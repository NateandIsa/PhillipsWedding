/* ============================================================
   Shared behavior: countdown + RSVP nudges
   ============================================================ */
(function () {
  var RSVP_KEY = "pushingp_rsvped";

  function hasRsvped() {
    try { return localStorage.getItem(RSVP_KEY) === "yes"; }
    catch (e) { return false; }
  }

  // ---- Countdown (any element with [data-countdown]) ----
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function startCountdown() {
    var el = document.querySelector("[data-countdown]");
    if (!el) return;
    var target = new Date(SITE_CONFIG.WEDDING_DATE).getTime();
    var d = el.querySelector("[data-cd-days]");
    var h = el.querySelector("[data-cd-hours]");
    var m = el.querySelector("[data-cd-mins]");
    var s = el.querySelector("[data-cd-secs]");

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        d.textContent = "00"; h.textContent = "00";
        m.textContent = "00"; s.textContent = "00";
        return;
      }
      d.textContent = pad(Math.floor(diff / 86400000));
      h.textContent = pad(Math.floor(diff / 3600000) % 24);
      m.textContent = pad(Math.floor(diff / 60000) % 60);
      s.textContent = pad(Math.floor(diff / 1000) % 60);
      setTimeout(tick, 1000);
    }
    tick();
  }

  // ---- RSVP nudges: hide everything once they've responded ----
  function applyNudges() {
    var nudges = document.querySelectorAll("[data-rsvp-nudge]");
    for (var i = 0; i < nudges.length; i++) {
      if (hasRsvped()) nudges[i].classList.add("hidden");
      else nudges[i].classList.remove("hidden");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    startCountdown();
    applyNudges();
    initScrollReveals();
  });

  // ---- Scroll-triggered reveals (content rises in as you scroll) ----
  function initScrollReveals() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    var selectors = ".explore-card, .detail-card, .timeline-item, .dresscode figure, " +
                    ".party-col, .swatch, .faq details, .hotel-card, .registry-card, " +
                    ".dress-note, .thermo-wrap, .venmo-block, .section-title, .section-lede";
    var els = document.querySelectorAll(selectors);
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in-view");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });

    for (var i = 0; i < els.length; i++) {
      els[i].classList.add("will-reveal");
      // stagger siblings slightly for a cascading feel
      els[i].style.transitionDelay = (i % 4) * 90 + "ms";
      obs.observe(els[i]);
    }
  }

  // expose for rsvp.js
  window.PUSHINGP = {
    RSVP_KEY: RSVP_KEY,
    hasRsvped: hasRsvped,
    markRsvped: function () {
      try { localStorage.setItem(RSVP_KEY, "yes"); } catch (e) {}
      applyNudges();
    }
  };
})();
