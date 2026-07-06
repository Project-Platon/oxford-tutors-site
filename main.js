/* ============================================================
   Oxford Tutors USA
   Mobile nav (focus-trapped) · nav dropdowns · scroll-spy ·
   testimonial slider · accessible intake form.
   ============================================================ */
(function () {
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");
  var backdrop = document.getElementById("nav-backdrop");
  function focusables() { return $$('a[href], button:not([disabled])', nav); }
  function openNav() { nav.classList.add("open"); toggle.setAttribute("aria-expanded", "true"); toggle.setAttribute("aria-label", "Close menu"); if (backdrop) backdrop.hidden = false; document.body.style.overflow = "hidden"; var f = focusables()[0]; if (f) f.focus(); }
  function closeNav() { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); if (backdrop) backdrop.hidden = true; document.body.style.overflow = ""; }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { nav.classList.contains("open") ? closeNav() : openNav(); });
    nav.addEventListener("click", function (e) { var a = e.target.closest("a"); if (a && a.getAttribute("href") && a.getAttribute("href").charAt(0) !== "#") { /* leaving page */ } if (a) closeNav(); });
    if (backdrop) backdrop.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) {
      if (!nav.classList.contains("open")) return;
      if (e.key === "Escape") { closeNav(); toggle.focus(); return; }
      if (e.key === "Tab") { var f = focusables(); if (!f.length) return; var a = f[0], b = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); } else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); } }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 767 && nav.classList.contains("open")) closeNav(); });
  }

  /* ---------- Nav dropdowns (injected; CSS shows on hover / focus-within) ---------- */
  var subs = {
    "Services": { items: [
      ["Academic Mentorship", "", "academic-mentorship.html"],
      ["College & Graduate Admissions", "", "admissions.html"],
      ["Test Preparation", "", "test-preparation.html"],
      ["Executive Functioning", "", "executive-functioning.html"],
      ["Educational Planning", "", "educational-planning.html"],
      ["Family Consulting", "", "family-consulting.html"],
      ["All services", "Overview", "services.html"]
    ]}
  };
  $$(".nav-link").forEach(function (link) {
    var key = link.textContent.replace(/[^A-Za-z &]/g, "").trim();
    var cfg = subs[key];
    if (!cfg) return;
    var li = link.parentNode;
    link.setAttribute("aria-haspopup", "true");
    link.setAttribute("aria-expanded", "false");
    var caret = document.createElement("span"); caret.className = "caret"; caret.setAttribute("aria-hidden", "true");
    link.appendChild(document.createTextNode(" ")); link.appendChild(caret);
    var ul = document.createElement("ul"); ul.className = "dropdown";
    var anchorHref = cfg.anchor ? (document.getElementById(cfg.anchor) ? "#" + cfg.anchor : "index.html#" + cfg.anchor) : null;
    cfg.items.forEach(function (it) {
      var a = document.createElement("a");
      a.href = it[2] || anchorHref || "#";
      a.innerHTML = it[0] + (it[1] ? '<span class="d-desc">' + it[1] + "</span>" : "");
      var l = document.createElement("li"); l.appendChild(a); ul.appendChild(l);
    });
    li.appendChild(ul);
    li.addEventListener("mouseenter", function () { link.setAttribute("aria-expanded", "true"); });
    li.addEventListener("mouseleave", function () { link.setAttribute("aria-expanded", "false"); });
    li.addEventListener("focusin", function () { link.setAttribute("aria-expanded", "true"); });
    li.addEventListener("focusout", function (e) { if (!li.contains(e.relatedTarget)) link.setAttribute("aria-expanded", "false"); });
  });

  /* ---------- Hash landing fix ----------
     html { scroll-behavior: smooth } can swallow the initial jump when a page
     loads with a #hash (e.g. index.html#consult from another page, or a reload),
     leaving the visitor stuck at the top. Re-scroll to the target after load,
     once images and fonts have settled, honouring the sticky-header offset. */
  function scrollToHash(hash) {
    if (!hash || hash.length < 2) return;
    var el = document.getElementById(hash.slice(1));
    if (!el) return;
    var pad = parseInt(getComputedStyle(document.documentElement).scrollPaddingTop, 10) || 0;
    var y = el.getBoundingClientRect().top + window.pageYOffset - pad;
    window.scrollTo({ top: y, behavior: "auto" });
  }
  if (location.hash) window.addEventListener("load", function () { scrollToHash(location.hash); });

  /* ---------- Scroll-spy ---------- */
  var navLinks = $$(".nav-link");
  var map = {};
  navLinks.forEach(function (l) { var id = l.getAttribute("href"); if (id && id.charAt(0) === "#" && id.length > 1) { var s = document.querySelector(id); if (s) map[s.id] = l; } });
  var sections = Object.keys(map).map(function (id) { return document.getElementById(id); });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { navLinks.forEach(function (l) { l.classList.remove("active"); }); if (map[en.target.id]) map[en.target.id].classList.add("active"); } });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Testimonials: click to advance, soft line-by-line float ----------
     Lines are pre-measured (no reflow), then float up and fade in, gently
     staggered. Motion uses top/opacity (not transform) so the text stays crisp.
     Height is locked to the tallest quote so clicks never resize. */
  var vcard = document.getElementById("voices-card");
  if (vcard) {
    var vq = document.getElementById("voices-quote");
    var vname = document.getElementById("voices-name");
    var vrole = document.getElementById("voices-role");
    var vcur = document.getElementById("voices-cur");
    var vtotal = document.getElementById("voices-total");
    var vdata = $$(".voices-data li").map(function (li) {
      return { q: (li.textContent || "").trim(), name: li.getAttribute("data-name") || "", role: li.getAttribute("data-role") || "" };
    });
    if (vq && vdata.length) {
      var vi = 0, vlock = false;
      if (vtotal) vtotal.textContent = vdata.length;

      function vSplit(text) {
        vq.textContent = "";
        var probes = text.split(/\s+/).map(function (w) {
          var s = document.createElement("span"); s.style.display = "inline-block"; s.textContent = w;
          vq.appendChild(s); vq.appendChild(document.createTextNode(" ")); return s;
        });
        var lines = [], cur = [], top = null;
        probes.forEach(function (s) { var t = s.offsetTop; if (top === null || Math.abs(t - top) < 2) cur.push(s.textContent); else { lines.push(cur); cur = [s.textContent]; } top = t; });
        if (cur.length) lines.push(cur);
        vq.textContent = "";
        lines.forEach(function (words, i) {
          var line = document.createElement("span"); line.className = "v-line";
          var inner = document.createElement("span"); inner.className = "v-line-inner";
          inner.style.transitionDelay = (i * 0.1).toFixed(2) + "s";
          inner.textContent = words.join(" ");
          line.appendChild(inner); vq.appendChild(line); vq.appendChild(document.createTextNode(" "));
        });
      }

      function vRender(i) {
        vSplit("“" + vdata[i].q + "”");
        if (vname) vname.textContent = vdata[i].name;
        if (vrole) vrole.textContent = vdata[i].role;
        if (vcur) vcur.textContent = i + 1;
      }

      /* Lock the quote area to the tallest testimonial so clicks never resize the section. */
      function vMeasureMax() {
        var wrap = vq.parentNode;
        wrap.style.minHeight = "0px";
        var max = 0;
        vdata.forEach(function (d, j) { vSplit("“" + vdata[j].q + "”"); if (vq.offsetHeight > max) max = vq.offsetHeight; });
        wrap.style.minHeight = max + "px";
      }

      function vGo(dir) {
        if (vlock) return;
        var next = (vi + dir + vdata.length) % vdata.length;
        if (next === vi) return;
        if (prefersReduced) { vi = next; vRender(vi); return; }
        vlock = true;
        vcard.classList.add("is-out");
        setTimeout(function () {
          vi = next;
          vcard.classList.remove("is-out");
          vcard.classList.add("is-in");
          vRender(vi);
          void vcard.offsetWidth;
          requestAnimationFrame(function () { vcard.classList.remove("is-in"); });
          setTimeout(function () { vlock = false; }, 1100);
        }, 300);
      }

      vMeasureMax();
      vRender(0);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!vlock) { vMeasureMax(); vRender(vi); } });
      vcard.addEventListener("click", function () { vGo(1); });
      vcard.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); vGo(1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); vGo(1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); vGo(-1); }
      });
      var vrt;
      window.addEventListener("resize", function () { clearTimeout(vrt); vrt = setTimeout(function () { if (!vlock) { vMeasureMax(); vRender(vi); } }, 200); });
    }
  }

  /* ---------- Hero "finds its path": draw the gold underline on load, re-trace on hover ---------- */
  var heroEm = document.querySelector(".hero-em");
  if (heroEm) {
    var heroDraw = function () { heroEm.classList.remove("is-drawn"); void heroEm.offsetWidth; heroEm.classList.add("is-drawn"); };
    window.setTimeout(heroDraw, 420);
    var heroTitleEl = document.getElementById("hero-title");
    if (heroTitleEl) heroTitleEl.addEventListener("mouseenter", heroDraw);
  }

  /* ---------- Hero film: click the poster to play inline (YouTube facade) ---------- */
  $$(".hero-video[data-embed]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      if (el.classList.contains("is-playing")) return;
      e.preventDefault();
      var ifr = document.createElement("iframe");
      ifr.className = "hero-video-frame";
      ifr.src = "https://www.youtube.com/embed/" + el.getAttribute("data-embed") + "?autoplay=1&rel=0&modestbranding=1";
      ifr.title = "Oxford Tutors Changes Lives";
      ifr.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      ifr.setAttribute("allowfullscreen", "");
      ifr.setAttribute("frameborder", "0");
      ifr.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      el.appendChild(ifr);
      el.classList.add("is-playing");
      el.removeAttribute("target");
    });
  });

  /* ---------- Horizontal rails (Insights) ---------- */
  $$(".blog-rail").forEach(function (rail) {
    var scope = rail.closest("section") || document;
    var prev = scope.querySelector(".rail-prev");
    var next = scope.querySelector(".rail-next");
    function step(dir) {
      var card = rail.querySelector(".blog-card");
      var delta = card ? card.offsetWidth + 22 : Math.round(rail.clientWidth * 0.8);
      rail.scrollBy({ left: dir * delta, behavior: prefersReduced ? "auto" : "smooth" });
    }
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });
  });

  /* ---------- Videos: show Vimeo's own poster, play on click ---------- */
  $$(".video iframe").forEach(function (fr) {
    var base = (fr.getAttribute("src") || fr.getAttribute("data-src") || "").split("?")[0];
    if (!base) return;
    fr.removeAttribute("data-src");
    fr.removeAttribute("loading");
    fr.setAttribute("src", base + "?title=0&byline=0&portrait=0&playsinline=1&dnt=1");
  });

  /* ---------- Persistent mobile CTA: show after the hero, hide over the form ---------- */
  (function () {
    var mcta = document.querySelector(".mobile-cta");
    var heroEl = document.querySelector(".hero");
    var consultEl = document.getElementById("consult");
    if (!mcta || !heroEl || !consultEl || !("IntersectionObserver" in window)) return;
    var heroVisible = true, consultVisible = false;
    function sync() { mcta.classList.toggle("is-visible", !heroVisible && !consultVisible); }
    new IntersectionObserver(function (es) { es.forEach(function (e) { heroVisible = e.isIntersecting; }); sync(); }, { threshold: 0.12 }).observe(heroEl);
    new IntersectionObserver(function (es) { es.forEach(function (e) { consultVisible = e.isIntersecting; }); sync(); }, { threshold: 0.12 }).observe(consultEl);
  })();

  /* ---------- Who-we-serve reveal cards: expose expand state to assistive tech ---------- */
  $$(".whb-item").forEach(function (btn) {
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("mouseenter", function () { btn.setAttribute("aria-expanded", "true"); });
    btn.addEventListener("mouseleave", function () { btn.setAttribute("aria-expanded", "false"); });
    btn.addEventListener("focus", function () { btn.setAttribute("aria-expanded", "true"); });
    btn.addEventListener("blur", function () { btn.setAttribute("aria-expanded", "false"); });
  });

  /* ---------- Intake form ---------- */
  var form = document.getElementById("intake-form");
  var success = document.getElementById("intake-success");
  if (form && success) {
    var INBOX = "Elisabeth@OxfordTutorsUSA.com";
    var rules = [
      { id: "f-name", err: "err-name", t: function (v) { return v.trim().length > 0; } },
      { id: "f-email", err: "err-email", t: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
      { id: "f-stage", err: "err-stage", t: function (v) { return v.trim().length > 0; } },
      { id: "f-about", err: "err-about", t: function (v) { return v.trim().length > 0; } }
    ];
    function setValid(r, ok) {
      var i = document.getElementById(r.id), e = document.getElementById(r.err);
      if (!i) return;
      if (ok) { i.removeAttribute("aria-invalid"); i.removeAttribute("aria-describedby"); if (e) e.hidden = true; }
      else { i.setAttribute("aria-invalid", "true"); if (e) { e.hidden = false; i.setAttribute("aria-describedby", r.err); } }
    }
    rules.forEach(function (r) { var i = document.getElementById(r.id); if (!i) return; i.addEventListener(i.tagName === "SELECT" ? "change" : "input", function () { if (i.getAttribute("aria-invalid") === "true" && r.t(i.value)) setValid(r, true); }); });
    function showSuccess() {
      form.hidden = true; success.hidden = false; success.focus();
      success.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
    }
    function showError(btn) {
      if (btn) { btn.disabled = false; btn.textContent = "Schedule a Discovery Call"; }
      var err = document.getElementById("form-send-error");
      if (!err) {
        err = document.createElement("p");
        err.id = "form-send-error"; err.className = "field-error"; err.setAttribute("role", "alert"); err.hidden = false;
        err.innerHTML = "Sorry, that didn’t send just now. Please try once more, or email us directly at <a href=\"mailto:" + INBOX + "\">" + INBOX + "</a>.";
        var foot = form.querySelector(".form-foot") || form;
        foot.appendChild(err);
      }
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null, ok = true;
      rules.forEach(function (r) { var i = document.getElementById(r.id); var good = i ? r.t(i.value) : false; setValid(r, good); if (!good) { ok = false; if (!firstBad) firstBad = i; } });
      if (!ok) { if (firstBad) firstBad.focus(); return; }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      // Netlify Forms: POST url-encoded to the site root; only confirm on a real success.
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
        .then(function (r) { if (!r.ok) throw new Error(r.status); showSuccess(); })
        .catch(function () { showError(btn); });
    });
  }
})();
