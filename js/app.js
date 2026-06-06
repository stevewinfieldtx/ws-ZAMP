/* ZAMP Funds — interaction layer (vanilla, dependency-free).
   Condensing nav, scroll progress, mobile menu, FAQ accordion,
   portfolio filtering, contact form, scroll-reveal, count-up,
   parallax hero, magnetic buttons, and subtle card tilt.
   Everything respects prefers-reduced-motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- Scroll progress + condensing nav ---------------- */
  function scrollChrome() {
    var bar = $(".zk-progress");
    var nav = $("[data-nav]");
    var ticking = false;
    function update() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var y = window.scrollY || doc.scrollTop;
      if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      if (nav) nav.classList.toggle("is-stuck", y > 12);
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* ---------------- Mobile menu ---------------- */
  function mobileMenu() {
    var toggle = $("[data-menu-toggle]");
    var menu = $("[data-menu]");
    if (!toggle || !menu) return;
    var icon = $(".material-symbols-rounded", toggle);
    toggle.addEventListener("click", function () {
      var open = menu.hasAttribute("hidden");
      if (open) { menu.removeAttribute("hidden"); } else { menu.setAttribute("hidden", ""); }
      toggle.setAttribute("aria-expanded", String(open));
      if (icon) icon.textContent = open ? "close" : "menu";
    });
  }

  /* ---------------- FAQ accordion (single-open) ---------------- */
  function accordions() {
    $$("[data-accordion]").forEach(function (acc) {
      var items = $$(".zds-accordion__item", acc);
      items.forEach(function (item) {
        var trigger = $(".zds-accordion__trigger", item);
        if (!trigger) return;
        trigger.addEventListener("click", function () {
          var isOpen = item.getAttribute("data-open") === "true";
          items.forEach(function (it) {
            it.setAttribute("data-open", "false");
            var t = $(".zds-accordion__trigger", it);
            if (t) t.setAttribute("aria-expanded", "false");
          });
          item.setAttribute("data-open", String(!isOpen));
          trigger.setAttribute("aria-expanded", String(!isOpen));
        });
      });
    });
  }

  /* ---------------- Portfolio filter (FLIP-style) ---------------- */
  function portfolioFilter() {
    var filters = $("[data-pf-filters]");
    var grid = $("[data-pf-grid]");
    if (!filters || !grid) return;
    var items = $$(".zk-pf-item", grid);
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      $$(".zk-chip", filters).forEach(function (c) { c.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var f = btn.getAttribute("data-filter");
      items.forEach(function (item) {
        var show = f === "All" || item.getAttribute("data-sector") === f;
        if (show) {
          item.classList.remove("is-hidden");
          if (!reduce) {
            item.classList.add("is-enter");
            requestAnimationFrame(function () {
              requestAnimationFrame(function () { item.classList.remove("is-enter"); });
            });
          }
        } else {
          item.classList.add("is-hidden");
        }
      });
    });
  }

  /* ---------------- Contact form (demo submit) ---------------- */
  function contactForm() {
    $$("[data-contact-form]").forEach(function (form) {
      var btn = $('button[type="submit"]', form);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        if (btn) { btn.textContent = "Thanks — we'll be in touch"; btn.disabled = true; }
        form.reset();
      });
    });
  }

  /* ---------------- Count-up ---------------- */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function countUp(el) {
    var raw = el.dataset.zampVal || el.textContent.trim();
    el.dataset.zampVal = raw;
    var m = raw.match(/^(\D*)(\d[\d,]*)(.*)$/);
    if (!m) return;
    var prefix = m[1], target = parseInt(m[2].replace(/,/g, ""), 10), suffix = m[3];
    if (!isFinite(target)) return;
    if (reduce) { el.textContent = prefix + target.toLocaleString() + suffix; return; }
    var dur = 1300, t0 = performance.now();
    (function tick(now) {
      var p = Math.min(1, (now - t0) / dur);
      el.textContent = prefix + Math.round(easeOutCubic(p) * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  /* ---------------- Scroll reveal ---------------- */
  var REVEAL = [
    ".zk-section-head", ".zk-hero__tag", ".zk-hero__title", ".zk-hero__sub", ".zk-hero__actions", ".zk-hero__scroll",
    ".zk-feature", ".zds-card", ".zk-split__text", ".zk-split__media",
    ".zk-step", ".zk-team__card", ".zk-sector", ".zk-quote",
    ".zk-benefit", ".zk-cta__col", ".zk-contact__info", ".zk-contact__form",
    ".zk-founder__media", ".zk-founder__body", ".zk-pagehead > *", ".zk-statband .zds-stat",
  ];
  function reveals() {
    if (reduce || !("IntersectionObserver" in window)) {
      $$(".zds-stat__value").forEach(countUp);
      return;
    }
    var seen = new Set(), els = [];
    REVEAL.forEach(function (sel) {
      $$(sel).forEach(function (el) { if (!seen.has(el)) { seen.add(el); els.push(el); } });
    });
    els.forEach(function (el) {
      el.classList.add("zk-reveal");
      var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return seen.has(c); });
      var idx = sibs.indexOf(el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx * 80, 320) + "ms";
    });
    function reveal(el) {
      if (el.classList.contains("is-in")) return;
      el.classList.add("is-in");
      $$(".zds-stat__value", el).forEach(countUp);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
    var vh = window.innerHeight || document.documentElement.clientHeight;
    requestAnimationFrame(function () {
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > 0) { reveal(el); io.unobserve(el); }
      });
    });
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); statIO.unobserve(e.target); } });
    }, { threshold: 0.6 });
    $$(".zds-stat__value").forEach(function (el) { statIO.observe(el); });
  }

  /* ---------------- Parallax hero ---------------- */
  function parallax() {
    if (reduce) return;
    var img = $(".zk-hero__media img");
    if (!img) return;
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || 0;
      img.style.transform = "translate3d(0," + (y * 0.08) + "px,0) scale(1.06)";
    }
    img.style.transform = "scale(1.06)";
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  }

  /* ---------------- Magnetic buttons ---------------- */
  function magnetic() {
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
    $$(".zk-hero__actions .zds-btn--primary, .zk-cta .zds-btn--primary, .zk-pagehead .zds-btn--primary").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + mx * 0.18 + "px," + (my * 0.18 - 2) + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  /* ---------------- Card tilt ---------------- */
  function cardTilt() {
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
    $$(".zk-pf-grid .zds-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(900px) rotateX(" + (-py * 4) + "deg) rotateY(" + (px * 4) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  function init() {
    scrollChrome();
    mobileMenu();
    accordions();
    portfolioFilter();
    contactForm();
    reveals();
    parallax();
    magnetic();
    cardTilt();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
