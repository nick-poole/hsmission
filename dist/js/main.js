/* Haitian Sensation Mission — main.js (Civic)
   The only JS on the site: mobile nav show/hide + footer year. Everything
   else is native HTML/CSS by design (see design-spec/). */
(() => {
    "use strict";

    const navMenu = document.getElementById("nav-menu");
    const navToggle = document.getElementById("nav-toggle");
    const navClose = document.getElementById("nav-close");

    const setMenu = (open) => {
        if (!navMenu) return;
        navMenu.classList.toggle("show-menu", open);
        if (navToggle) navToggle.setAttribute("aria-expanded", String(open));
    };

    if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.addEventListener("click", () => setMenu(true));
    }
    if (navClose) navClose.addEventListener("click", () => setMenu(false));

    document.querySelectorAll(".nav__link").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
