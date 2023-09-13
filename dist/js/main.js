//=============== SHOW MENU ===============
const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close");

//===== SHOW MENU =====*/
if (navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.add("show-menu");
    });
}

//===== HIDE MENU =====*/
if (navClose) {
    navClose.addEventListener("click", () => {
        navMenu.classList.remove("show-menu");
    });
}

//=========== REMOVE MENU onClick ===========
const navLink = document.querySelectorAll(".nav__link");

const linkAction = () => {
    const navMenu = document.getElementById("nav-menu");

    navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));

//============= ADD BLUR TO HEADER =============
const scrollHeader = () => {
    const header = document.getElementById("header");

    //____window object,
    this.scrollY >= 50
        ? //add _____________ class
          header.classList.add("blur-header")
        : header.classList.remove("blur-header");
};
window.addEventListener("scroll", scrollHeader);

//=============== SHOW SCROLL UP ===============
const scrollUp = () => {
    const scrollUp = document.getElementById("scroll-up");

    //____when window object >= 350vh
    this.scrollY >= 350
        ? scrollUp.classList.add("show-scroll")
        : scrollUp.classList.remove("show-scroll");
};
window.addEventListener("scroll", scrollUp);

//========== SCROLL SECTIONS ACTIVE LINK ==========

//============ SCROLL REVEAL ANIMATION ============
