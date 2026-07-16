/* ============================================================
   RSVP form → Google Apps Script → Google Sheet
   ============================================================ */
(function () {
  var form = document.getElementById("rsvpForm");
  var thanks = document.getElementById("rsvpThanks");
  var status = document.getElementById("formStatus");
  var submitBtn = document.getElementById("submitBtn");
  var countField = document.getElementById("countField");
  var songField = document.getElementById("songField");
  if (!form) return;

  // If they already RSVP'd on this device, show the thank-you straight away
  if (window.PUSHINGP && window.PUSHINGP.hasRsvped()) {
    form.classList.add("hidden");
    thanks.classList.remove("hidden");
  }

  // Declining? Hide the party-count and song fields — keep it painless.
  var radios = form.querySelectorAll('input[name="attending"]');
  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", function () {
      var declining = this.value.indexOf("declines") !== -1;
      countField.classList.toggle("hidden", declining);
      songField.classList.toggle("hidden", declining);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var attending = (form.querySelector('input[name="attending"]:checked') || {}).value || "";
    var declining = attending.indexOf("declines") !== -1;
    var count = declining ? "0" : String(form.count.value || "1");
    var song = declining ? "" : form.song.value.trim();

    if (!name || !email || !attending) {
      status.textContent = "Please fill in your name, email, and whether you can join us.";
      status.className = "form-status err";
      return;
    }
    if (!declining && (Number(count) < 1 || Number(count) > 12)) {
      status.textContent = "Party size should be between 1 and 12.";
      status.className = "form-status err";
      return;
    }

    var url = SITE_CONFIG.APPS_SCRIPT_URL;
    if (!url || url.indexOf("PASTE_") === 0) {
      status.textContent = "The RSVP system isn't connected yet — check back soon!";
      status.className = "form-status err";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    var data = new FormData();
    data.append("form", "rsvp");
    data.append("name", name);
    data.append("email", email);
    data.append("attending", attending);
    data.append("count", count);
    data.append("song", song);

    // no-cors: Apps Script accepts the POST; we can't read the reply,
    // so a completed request is treated as success.
    fetch(url, { method: "POST", mode: "no-cors", body: data })
      .then(function () {
        if (window.PUSHINGP) window.PUSHINGP.markRsvped();
        form.classList.add("hidden");
        thanks.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(function () {
        status.textContent = "Something went wrong sending your reply. Please try again in a moment.";
        status.className = "form-status err";
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Our Reply";
      });
  });
})();
