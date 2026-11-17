/* Inject a "Filter" box at the top of the primary sidebar, mirroring
   aistudio.google.com/docs. Typing hides nav items that (and whose
   descendants) do not match. */
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

    var items = Array.prototype.slice.call(wrap.querySelectorAll(".md-nav__item"));
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      if (!q) {
        items.forEach(function (it) { it.style.display = ""; });
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
      items.forEach(function (it) { it.style.display = match.get(it) ? "" : "none"; });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
