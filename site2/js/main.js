/* =========================================================================
   AMPLIFY — main.js
   Vanilla JS only. Each feature is a guard-claused init function.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------- sticky header shadow */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------- mobile navigation */
  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var panel = document.getElementById("navPanel");
    if (!toggle || !panel) return;

    var close = function () {
      panel.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    var open = function () {
      panel.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", function () {
      if (panel.classList.contains("open")) { close(); } else { open(); }
    });

    // close after choosing a destination
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    // esc to close
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    // reset when we grow past the mobile breakpoint
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) close();
    });
  }

  /* ---------------------------------------------- tracklist play toggle */
  function initTracks() {
    var tracks = document.querySelectorAll("[data-track]");
    if (!tracks.length) return;

    var stop = function (row) {
      row.classList.remove("is-playing");
      var btn = row.querySelector(".track-play");
      if (btn) btn.setAttribute("aria-pressed", "false");
    };

    tracks.forEach(function (row) {
      var btn = row.querySelector(".track-play");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var playing = row.classList.contains("is-playing");
        // only one track "plays" at a time
        tracks.forEach(stop);
        if (!playing) {
          row.classList.add("is-playing");
          btn.setAttribute("aria-pressed", "true");
        }
      });
    });
  }

  /* ---------------------------------------------- video click-to-reveal */
  function initVideo() {
    var stage = document.getElementById("videoStage");
    if (!stage) return;

    var play = function () {
      if (stage.classList.contains("is-live")) return;
      stage.classList.add("is-live");
      stage.setAttribute("aria-label", "Sundown Static music video is now playing");
    };

    stage.addEventListener("click", play);
    stage.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        play();
      }
    });
  }

  /* ---------------------------------------------- merch add-to-cart flash */
  function initMerch() {
    var buttons = document.querySelectorAll(".merch-add");
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      var original = btn.getAttribute("aria-label") || "Add to cart";
      var timer;
      btn.addEventListener("click", function () {
        btn.classList.add("added");
        btn.setAttribute("aria-label", "Added to cart");
        clearTimeout(timer);
        timer = setTimeout(function () {
          btn.classList.remove("added");
          btn.setAttribute("aria-label", original);
        }, 1600);
      });
    });
  }

  /* ---------------------------------------------- newsletter validation */
  function initSignup() {
    var form = document.getElementById("signupForm");
    if (!form) return;
    var ok = document.getElementById("signupOk");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var setError = function (name, msg) {
      var field = form.querySelector('[name="' + name + '"]');
      var slot = form.querySelector('[data-err="' + name + '"]');
      if (slot) slot.textContent = msg;
      if (field) field.setAttribute("aria-invalid", msg ? "true" : "false");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var valid = true;

      if (!name.value.trim()) { setError("name", "Please tell us your name."); valid = false; }
      else { setError("name", ""); }

      if (!emailRe.test(email.value.trim())) { setError("email", "Enter a valid email address."); valid = false; }
      else { setError("email", ""); }

      if (!valid) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        if (ok) ok.classList.remove("show");
        return;
      }

      // front-end only — wire the action to your provider to go live
      form.reset();
      if (ok) ok.classList.add("show");
    });

    // clear an error as the visitor corrects it
    form.querySelectorAll("input").forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") {
          setError(input.getAttribute("name"), "");
        }
      });
    });
  }

  /* ---------------------------------------------- scroll reveal */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------- boot */
  function boot() {
    initHeader();
    initMobileNav();
    initTracks();
    initVideo();
    initMerch();
    initSignup();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
