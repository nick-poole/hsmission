/* Haitian Sensation Mission — main.js (Civic)
   The only JS on the site: mobile nav toggle + footer year. Everything else
   is native HTML/CSS by design (see design-spec/). */
(() => {
    "use strict";

    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("primary-nav");

    if (toggle && nav) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.addEventListener("click", () => {
            const open = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
        });
        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
