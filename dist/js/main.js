/* Haitian Sensation Mission - main.js */
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

    if (navToggle) navToggle.addEventListener("click", () => setMenu(true));
    if (navClose) navClose.addEventListener("click", () => setMenu(false));

    document.querySelectorAll(".nav__link").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    if (navToggle) navToggle.setAttribute("aria-expanded", "false");

    const header = document.getElementById("header");
    const scrollUpEl = document.getElementById("scroll-up");
    const sections = Array.from(document.querySelectorAll("section[id]"));

    const navAnchorFor = (id) =>
        document.querySelector(`.nav__menu a[href$="#${id}"]`);

    const onScroll = () => {
        const y = window.scrollY;

        if (header) header.classList.toggle("blur-header", y >= 50);
        if (scrollUpEl) scrollUpEl.classList.toggle("show-scroll", y >= 350);

        sections.forEach((section) => {
            const top = section.offsetTop - 58;
            const bottom = top + section.offsetHeight;
            const link = navAnchorFor(section.id);
            if (!link) return;
            link.classList.toggle("active-link", y > top && y <= bottom);
        });
    };

    let ticking = false;
    window.addEventListener(
        "scroll",
        () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                onScroll();
                ticking = false;
            });
        },
        { passive: true }
    );
    onScroll();

    if (scrollUpEl && scrollUpEl.tagName === "BUTTON") {
        scrollUpEl.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
