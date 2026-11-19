/* Inject a "Filter" box at the top of the primary sidebar, mirroring
   aistudio.google.com/docs. Typing hides nav items that (and whose
   descendants) do not match; sections containing matches are expanded
   while filtering, and the original fold state is restored on clear. */
(function () {
  function init() {
    var wrap = document.querySelector(".md-sidebar--primary .md-sidebar__scrollwrap");
    if (!wrap || wrap.querySelector(".ais-filter")) return;
    var box = document.createElement("div");
    box.className = "ais-filter";
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "篩選";
    input.setAttribute("aria-label", "篩選導覽");
    box.appendChild(input);
    var icon = document.createElement("span");
    icon.className = "ais-filter__icon";
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18l-7 8v5l-4 2v-7L3 5z"/></svg>';
    box.appendChild(icon);
    var kbd = document.createElement("kbd");
    kbd.className = "ais-filter__kbd";
    kbd.textContent = "/";
    box.appendChild(kbd);
    wrap.prepend(box);

    /* The top bar already switches between Docs and API reference, so
       the sidebar shows only the current section's tree (like the
       official site): hide the other section's group and landing page. */
    var mode = window.location.pathname.indexOf("/api-reference") === 0 ? "api" : "docs";
    var keepPrefix = mode === "api" ? "/api-reference/" : "/docs/";
    var otherPrefix = mode === "api" ? "/docs/" : "/api-reference/";
    var rootList = wrap.querySelector(".md-nav--primary > .md-nav__list");
    if (rootList) {
      Array.prototype.forEach.call(rootList.children, function (li) {
        var a = li.querySelector(":scope > a.md-nav__link") || li.querySelector("a.md-nav__link");
        if (!a) return;
        var p = new URL(a.getAttribute("href"), window.location.href).pathname;
        if (p.indexOf(otherPrefix) === 0) {
          li.classList.add("ais-offsection");
        }
      });
    }

    var items = Array.prototype.slice.call(wrap.querySelectorAll(".md-nav__item"));
    var toggles = Array.prototype.slice.call(wrap.querySelectorAll(".md-nav__toggle"));
    var initialFold = toggles.map(function (t) { return t.checked; });

    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      if (!q) {
        items.forEach(function (it) { it.style.display = ""; });
        toggles.forEach(function (t, i) { t.checked = initialFold[i]; });
        return;
      }
      var match = new Map();
      items.slice().reverse().forEach(function (it) {
        var own = false;
        var link = it.querySelector(":scope > .md-nav__link, :scope > a.md-nav__link");
        if (link && link.textContent.toLowerCase().indexOf(q) !== -1) own = true;
        var childHit = false;
        it.querySelectorAll(":scope > .md-nav .md-nav__item, :scope > .md-nav__list > .md-nav__item")
          .forEach(function (child) { if (match.get(child)) childHit = true; });
        match.set(it, own || childHit);
      });
      items.forEach(function (it) {
        var hit = !!match.get(it);
        it.style.display = hit ? "" : "none";
        if (hit) {
          var toggle = it.querySelector(":scope > .md-nav__toggle");
          if (toggle) toggle.checked = true;
        }
      });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* HTTP method badges in the API reference sidebar, mirroring the
   official site: a small tinted square before each method link —
   blue ↗ POST, green ↙ GET, red ✕ DELETE, amber ↗ PATCH. */
(function () {
  var VERBS = [
    [/^(get|list)-/, "get"],
    [/^delete-/, "delete"],
    [/^update-/, "patch"],
    [/^(create|cancel|register|import|upload|embed|batch|count|run|ping|rotate|start|generate|stream|async)-/, "post"]
  ];
  var PATHS = {
    post: "M7 17L17 7M9 7h8v8",
    get: "M17 7L7 17M15 17H7V9",
    patch: "M7 17L17 7M9 7h8v8",
    delete: "M6 6l12 12M18 6L6 18"
  };
  function init() {
    document.querySelectorAll(".md-nav--primary a.md-nav__link[href]").forEach(function (a) {
      var p;
      try { p = new URL(a.getAttribute("href"), window.location.href).pathname; } catch (e) { return; }
      if (p.indexOf("/api-reference/") !== 0) return;
      var seg = p.split("/").filter(Boolean);
      if (seg.length < 3) return;
      var last = seg[seg.length - 1];
      var kind = null;
      for (var i = 0; i < VERBS.length; i++) {
        if (VERBS[i][0].test(last)) { kind = VERBS[i][1]; break; }
      }
      if (!kind || a.querySelector(".ais-method")) return;
      var span = document.createElement("span");
      span.className = "ais-method ais-method--" + kind;
      span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="' + PATHS[kind] + '"/></svg>';
      var label = a.querySelector(".md-ellipsis");
      a.insertBefore(span, label || a.firstChild);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
