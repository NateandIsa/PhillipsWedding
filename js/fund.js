/* ============================================================
   Honeymoon fund thermometer
   Reads a PERCENTAGE from the Apps Script endpoint.
   Dollar amounts never reach the browser — by design.
   ============================================================ */
(function () {
  var fill = document.getElementById("thermoFill");
  var pctEl = document.getElementById("thermoPercent");
  var bar = document.getElementById("thermoBar");
  var milestone = document.getElementById("thermoMilestone");
  var daysEl = document.getElementById("fundDays");
  if (!fill) return;

  function milestoneCopy(p) {
    if (p >= 100) return "We made it — thank you, thank you, thank you!";
    if (p >= 90)  return "The final stretch — you could be the one to get us there!";
    if (p >= 75)  return "So close we can hear the ocean.";
    if (p >= 50)  return "Over halfway to paradise!";
    if (p >= 25)  return "The bags are (mentally) packed.";
    if (p > 0)    return "The adventure fund is officially growing.";
    return "Be the first to send us packing!";
  }

  function render(p) {
    p = Math.max(0, Math.min(100, Math.round(p)));
    pctEl.textContent = p;
    milestone.textContent = milestoneCopy(p);
    bar.setAttribute("aria-valuenow", p);
    // slight delay so the fill animates in after paint
    setTimeout(function () { fill.style.width = p + "%"; }, 150);
  }

  // Days-until urgency line
  var msLeft = new Date(SITE_CONFIG.WEDDING_DATE).getTime() - Date.now();
  var days = Math.max(0, Math.ceil(msLeft / 86400000));
  if (daysEl) {
    daysEl.textContent = days > 0
      ? "Only " + days + " days until we say \u201CI do\u201D \u2014 and pack our bags"
      : "The honeymoon is here!";
  }

  var url = SITE_CONFIG.APPS_SCRIPT_URL;
  if (!url || url.indexOf("PASTE_") === 0) {
    render(SITE_CONFIG.FALLBACK_FUND_PERCENT);
    return;
  }

  fetch(url + "?action=fund")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data && typeof data.percent === "number") render(data.percent);
      else render(SITE_CONFIG.FALLBACK_FUND_PERCENT);
    })
    .catch(function () {
      render(SITE_CONFIG.FALLBACK_FUND_PERCENT);
    });
})();
