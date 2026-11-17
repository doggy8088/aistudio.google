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
        } else if (p.indexOf(keepPrefix) === 0 && li.classList.contains("md-nav__item--section")) {
          /* current section: drop its redundant group header (the top
             bar already names the section) and flatten its children */
          li.classList.add("ais-rootsection");
          var toggle = li.querySelector(":scope > .md-nav__toggle");
          if (toggle) toggle.checked = true;
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
