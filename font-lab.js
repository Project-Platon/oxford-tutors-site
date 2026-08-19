/* ============================================================
   FONT LAB — a review-only tool for choosing site fonts.
   A floating "Aa Fonts" button opens a panel where you can
   mix and match the heading serif, the body sans, and the
   emphasis italic. Choices apply live across the page.

   This is a temporary decision aid, not a production feature.
   To remove: delete this file and its <script> tag.
   ============================================================ */
(function () {
  "use strict";

  var SERIFS = ["Default (Libre Caslon)", "EB Garamond", "Newsreader", "Fraunces", "Lora", "Spectral", "Playfair Display", "Cormorant Garamond", "Source Serif 4"];
  var SANS = ["Default (Archivo)", "Public Sans", "Instrument Sans", "Inter", "Work Sans", "Figtree", "IBM Plex Sans"];
  var ITALICS = ["Default (Libre Caslon)", "EB Garamond", "Newsreader", "Fraunces", "Lora", "Spectral", "Cormorant Garamond"];

  var root = document.documentElement;
  var cs = getComputedStyle(root);
  var defaults = {
    display: cs.getPropertyValue("--display"),
    serif: cs.getPropertyValue("--serif"),
    sans: cs.getPropertyValue("--sans"),
    italic: cs.getPropertyValue("--italic")
  };
  var choice = { headings: "Default", body: "Default", italic: "Default" };

  function isDefault(n) { return /^Default/.test(n); }

  function loadFont(name, kind) {
    var id = "fl-" + name.replace(/\W+/g, "");
    if (document.getElementById(id)) return;
    var axis = kind === "sans" ? "wght@400;500;600;700" : "ital,wght@0,400;0,700;1,400";
    var link = document.createElement("link");
    link.rel = "stylesheet"; link.id = id;
    link.href = "https://fonts.googleapis.com/css2?family=" + name.replace(/ /g, "+") + ":" + axis + "&display=swap";
    document.head.appendChild(link);
  }

  function applyHeadings(name) {
    choice.headings = name;
    if (isDefault(name)) { root.style.setProperty("--display", defaults.display); root.style.setProperty("--serif", defaults.serif); }
    else { loadFont(name, "serif"); var v = "'" + name + "', Georgia, 'Times New Roman', serif"; root.style.setProperty("--display", v); root.style.setProperty("--serif", v); }
    updateReadout();
  }
  function applyBody(name) {
    choice.body = name;
    if (isDefault(name)) root.style.setProperty("--sans", defaults.sans);
    else { loadFont(name, "sans"); root.style.setProperty("--sans", "'" + name + "', system-ui, -apple-system, sans-serif"); }
    updateReadout();
  }
  function applyItalic(name) {
    choice.italic = name;
    if (isDefault(name)) root.style.setProperty("--italic", defaults.italic);
    else { loadFont(name, "serif"); root.style.setProperty("--italic", "'" + name + "', Georgia, serif"); }
    updateReadout();
  }

  var readoutEl;
  function clean(n) { return n.replace(/\s*\(.*\)$/, ""); }
  function updateReadout() {
    if (readoutEl) readoutEl.textContent = "Headings: " + clean(choice.headings) + "  ·  Body: " + clean(choice.body) + "  ·  Italic: " + clean(choice.italic);
  }

  /* ---------- styles ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".fl-btn{position:fixed;right:18px;bottom:18px;z-index:9999;display:inline-flex;align-items:center;gap:8px;" +
    "background:#002147;color:#f4ecd9;border:1px solid #d8bd77;border-radius:999px;padding:11px 16px;font:600 14px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 24px -10px rgba(0,0,0,.5)}" +
    ".fl-btn b{font-family:Georgia,serif;font-weight:700;font-size:16px}" +
    ".fl-panel{position:fixed;right:18px;bottom:70px;z-index:9999;width:300px;max-width:calc(100vw - 36px);background:#fff;border:1px solid #e6dfce;border-radius:14px;box-shadow:0 24px 60px -20px rgba(0,0,0,.4);padding:18px;display:none;font-family:system-ui,sans-serif}" +
    ".fl-panel.open{display:block}" +
    ".fl-panel h4{margin:0 0 2px;font:700 15px/1.2 Georgia,serif;color:#002147}" +
    ".fl-panel .fl-sub{margin:0 0 14px;font-size:12px;color:#64656e}" +
    ".fl-row{margin-bottom:12px}" +
    ".fl-row label{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#7a611f;margin-bottom:5px}" +
    ".fl-row select{width:100%;padding:9px 10px;border:1px solid #d8cfba;border-radius:8px;font-size:14px;background:#fdfbf6;color:#002147}" +
    ".fl-readout{font-size:12px;color:#2c3752;background:#f7f4ec;border-radius:8px;padding:8px 10px;margin:6px 0 12px;line-height:1.5}" +
    ".fl-actions{display:flex;gap:8px}" +
    ".fl-actions button{flex:1;padding:9px;border-radius:8px;font:600 13px system-ui,sans-serif;cursor:pointer;border:1px solid #d8cfba;background:#fff;color:#002147}" +
    ".fl-actions .fl-copy{background:#96792d;color:#fff;border-color:#96792d}";
  document.head.appendChild(css);

  function selectRow(labelText, options, onChange) {
    var row = document.createElement("div"); row.className = "fl-row";
    var lab = document.createElement("label"); lab.textContent = labelText; row.appendChild(lab);
    var sel = document.createElement("select");
    options.forEach(function (o) { var op = document.createElement("option"); op.value = o; op.textContent = o; sel.appendChild(op); });
    sel.addEventListener("change", function () { onChange(sel.value); });
    row.appendChild(sel); return row;
  }

  function build() {
    var btn = document.createElement("button");
    btn.className = "fl-btn"; btn.type = "button";
    btn.innerHTML = "<b>Aa</b> Fonts";

    var panel = document.createElement("div"); panel.className = "fl-panel";
    var h = document.createElement("h4"); h.textContent = "Choose the fonts";
    var sub = document.createElement("p"); sub.className = "fl-sub"; sub.textContent = "Mix and match, then copy your choice.";
    panel.appendChild(h); panel.appendChild(sub);
    panel.appendChild(selectRow("Headings (serif)", SERIFS, applyHeadings));
    panel.appendChild(selectRow("Body & interface (sans)", SANS, applyBody));
    panel.appendChild(selectRow("Emphasis (italic)", ITALICS, applyItalic));

    readoutEl = document.createElement("div"); readoutEl.className = "fl-readout"; panel.appendChild(readoutEl); updateReadout();

    var actions = document.createElement("div"); actions.className = "fl-actions";
    var reset = document.createElement("button"); reset.type = "button"; reset.textContent = "Reset";
    reset.addEventListener("click", function () {
      applyHeadings("Default"); applyBody("Default"); applyItalic("Default");
      panel.querySelectorAll("select").forEach(function (s) { s.selectedIndex = 0; });
    });
    var copy = document.createElement("button"); copy.type = "button"; copy.className = "fl-copy"; copy.textContent = "Copy my choice";
    copy.addEventListener("click", function () {
      var txt = "Font choice — Headings: " + clean(choice.headings) + ", Body: " + clean(choice.body) + ", Italic: " + clean(choice.italic);
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { copy.textContent = "Copied!"; setTimeout(function () { copy.textContent = "Copy my choice"; }, 1500); });
      else { copy.textContent = txt; }
    });
    actions.appendChild(reset); actions.appendChild(copy); panel.appendChild(actions);

    btn.addEventListener("click", function () { panel.classList.toggle("open"); });
    document.body.appendChild(btn); document.body.appendChild(panel);
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build);
})();
