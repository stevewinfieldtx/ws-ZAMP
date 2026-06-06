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
    var img = $(".zk-hero__media img, .zk-herox__bg img");
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

  /* ---------------- Animated constellation background ---------------- */
  function constellation() {
    var canvas = document.createElement("canvas");
    canvas.id = "zk-constellation";
    canvas.setAttribute("aria-hidden", "true");
    document.body.insertBefore(canvas, document.body.firstChild);
    var ctx = canvas.getContext("2d");

    // On-brand palette: warm gold, teal, brand-blue light, soft white.
    var COLORS = [
      [255, 209, 102],  // golden tainoi
      [12, 166, 120],   // gossamer teal
      [84, 119, 178],   // torea bay light
      [240, 240, 235],  // soft white
    ];
    var LINK = 140;       // px distance for a connecting line
    var MOUSE_LINK = 190; // px distance lines reach toward the cursor
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, parts = [], mouse = { x: -9999, y: -9999, on: false };

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = Math.round(Math.min(150, Math.max(40, (W * H) / 13000)));
      parts = [];
      for (var i = 0; i < target; i++) {
        var c = COLORS[(Math.random() * COLORS.length) | 0];
        parts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32,
          r: Math.random() * 1.1 + 0.7,
          star: Math.random() < 0.22,            // some are little 4-point sparkles
          col: c,
          tw: Math.random() * Math.PI * 2,       // twinkle phase
          tws: 0.01 + Math.random() * 0.02,
        });
      }
    }

    function sparkle(x, y, r, a, col) {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      var s = r * 2.6;
      ctx.moveTo(0, -s); ctx.lineTo(r * 0.4, -r * 0.4); ctx.lineTo(s, 0);
      ctx.lineTo(r * 0.4, r * 0.4); ctx.lineTo(0, s); ctx.lineTo(-r * 0.4, r * 0.4);
      ctx.lineTo(-s, 0); ctx.lineTo(-r * 0.4, -r * 0.4); ctx.closePath();
      ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + a + ")";
      ctx.fill();
      ctx.restore();
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      var i, j, p, q, dx, dy, d;

      // links between nearby particles
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        for (j = i + 1; j < parts.length; j++) {
          q = parts[j];
          dx = p.x - q.x; dy = p.y - q.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            var a = (1 - d / LINK) * 0.16;
            ctx.strokeStyle = "rgba(255,255,255," + a + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        // link to cursor — brighter, gold
        if (mouse.on) {
          dx = p.x - mouse.x; dy = p.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_LINK) {
            var ma = (1 - d / MOUSE_LINK) * 0.5;
            ctx.strokeStyle = "rgba(255,209,102," + ma + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            // gentle drift toward the cursor for a living, morphing feel
            p.vx += (mouse.x - p.x) * 0.000018 * (1 - d / MOUSE_LINK);
            p.vy += (mouse.y - p.y) * 0.000018 * (1 - d / MOUSE_LINK);
          }
        }
      }

      // particles
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        p.x += p.vx; p.y += p.vy;
        // soft speed cap + slight damping so cursor pull doesn't accelerate forever
        p.vx *= 0.992; p.vy *= 0.992;
        if (Math.abs(p.vx) < 0.04) p.vx += (Math.random() - 0.5) * 0.01;
        if (Math.abs(p.vy) < 0.04) p.vy += (Math.random() - 0.5) * 0.01;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
        p.tw += p.tws;
        var glow = 0.55 + Math.sin(p.tw) * 0.35;
        if (p.star) sparkle(p.x, p.y, p.r, glow * 0.9, p.col);
        else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(" + p.col[0] + "," + p.col[1] + "," + p.col[2] + "," + glow + ")";
          ctx.fill();
        }
      }
    }

    var raf = null, running = true;
    function loop() { if (running) { frame(); raf = requestAnimationFrame(loop); } }

    resize();
    if (reduce) { frame(); return; }   // static field, no motion
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; }, { passive: true });
    window.addEventListener("mouseout", function () { mouse.on = false; mouse.x = -9999; mouse.y = -9999; });
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running && !raf) loop(); else if (!running && raf) { cancelAnimationFrame(raf); raf = null; }
    });
    loop();
  }

  function init() {
    constellation();
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
