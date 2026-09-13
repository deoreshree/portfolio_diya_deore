/* ================= MOBILE MENU ================= */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

function closeMobileMenu() {
    if (navLinks && navLinks.classList.contains("show")) {
        navLinks.classList.remove("show");
        if (menuBtn) {
            menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            menuBtn.setAttribute("aria-expanded", "false");
        }
    }
}

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        navLinks.classList.toggle("show");
        const isOpen = navLinks.classList.contains("show");
        menuBtn.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
        menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    /* CLOSE MOBILE MENU ON LINK CLICK */
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    /* CLOSE MOBILE MENU ON OUTSIDE CLICK */
    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    /* CLOSE MOBILE MENU ON ESCAPE KEY */
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMobileMenu();
        }
    });
}


/* ================= THEME WITH LOCALSTORAGE PERSISTENCE ================= */

const themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
    if (theme === "light") {
        document.body.classList.add("light-mode");
        if (themeBtn) {
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            themeBtn.setAttribute("aria-label", "Switch to dark theme");
            themeBtn.setAttribute("title", "Switch to dark theme");
        }
    } else {
        document.body.classList.remove("light-mode");
        if (themeBtn) {
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            themeBtn.setAttribute("aria-label", "Switch to light theme");
            themeBtn.setAttribute("title", "Switch to light theme");
        }
    }
}

/* Initialize theme from localStorage or system preference */
const savedTheme = localStorage.getItem("portfolio_theme");
if (savedTheme) {
    applyTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
}

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const isLight = document.body.classList.contains("light-mode");
        const newTheme = isLight ? "dark" : "light";
        applyTheme(newTheme);
        localStorage.setItem("portfolio_theme", newTheme);
    });
}


/* ================= SMOOTH SCROLL ================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function(e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            closeMobileMenu();
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


/* ================= ACTIVE NAV SPY ================= */

const sections = document.querySelectorAll("section");
const links = document.querySelectorAll(".nav-links a");

function updateActiveNav() {
    let current = "";
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    /* If user has reached the bottom of page, highlight Contact */
    if (scrollPosition + windowHeight >= docHeight - 80) {
        current = "contact";
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });
    }

    if (current) {
        links.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    }
}

let scrollThrottle = false;
window.addEventListener("scroll", () => {
    if (!scrollThrottle) {
        window.requestAnimationFrame(() => {
            updateActiveNav();
            scrollThrottle = false;
        });
        scrollThrottle = true;
    }
}, { passive: true });

window.addEventListener("DOMContentLoaded", updateActiveNav);


/* ================= SCROLL REVEAL ================= */

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    document.querySelectorAll(".reveal").forEach(element => {
        observer.observe(element);
    });
} else {
    document.querySelectorAll(".reveal").forEach(element => {
        element.classList.add("show");
    });
}


/* ================= TOP BUTTON ================= */

const topBtn = document.getElementById("topBtn");

if (topBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            topBtn.classList.add("show");
        } else {
            topBtn.classList.remove("show");
        }
    }, { passive: true });

    topBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* ================= CUSTOM CURSOR ================= */

const cursor = document.querySelector(".cursor");
const cursorRing = document.querySelector(".cursor-ring");
const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

if (cursor && cursorRing && !isTouchDevice) {
    let mouseMoved = false;

    document.addEventListener("mousemove", e => {
        if (!mouseMoved) {
            cursor.classList.add("visible");
            cursorRing.classList.add("visible");
            mouseMoved = true;
        }

        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
        cursorRing.style.left = e.clientX + "px";
        cursorRing.style.top = e.clientY + "px";
    });

    document.addEventListener("mouseleave", () => {
        cursor.classList.remove("visible");
        cursorRing.classList.remove("visible");
    });

    document.addEventListener("mouseenter", () => {
        if (mouseMoved) {
            cursor.classList.add("visible");
            cursorRing.classList.add("visible");
        }
    });

    document.querySelectorAll("a, button, .project, .skill, .stat").forEach(element => {
        element.addEventListener("mouseenter", () => {
            cursorRing.style.width = "50px";
            cursorRing.style.height = "50px";
            cursorRing.style.borderColor = "rgba(167, 139, 250, 0.9)";
        });

        element.addEventListener("mouseleave", () => {
            cursorRing.style.width = "35px";
            cursorRing.style.height = "35px";
            cursorRing.style.borderColor = "rgba(167, 139, 250, 0.6)";
        });
    });
}


/* ================= BUTTON CLICK RIPPLE ================= */

document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", function(e) {
        const ripple = document.createElement("span");
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.position = "absolute";
        ripple.style.width = size + "px";
        ripple.style.height = size + "px";
        ripple.style.left = e.clientX - rect.left - size / 2 + "px";
        ripple.style.top = e.clientY - rect.top - size / 2 + "px";
        ripple.style.borderRadius = "50%";
        ripple.style.background = "rgba(255, 255, 255, 0.3)";
        ripple.style.transform = "scale(0)";
        ripple.style.pointerEvents = "none";
        ripple.style.animation = "ripple 0.6s ease-out";

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});


/* ================= TYPING EFFECT ================= */

const words = [
    "Developer",
    "Problem Solver",
    "Data Science Learner"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const typing = document.querySelector(".typing");

function typeEffect() {
    if (!typing) return;

    const currentWord = words[wordIndex];

    if (!deleting) {
        typing.textContent = " • " + currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
            deleting = true;
            setTimeout(typeEffect, 1800);
            return;
        }
    } else {
        typing.textContent = " • " + currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 400);
            return;
        }
    }

    setTimeout(typeEffect, deleting ? 45 : 90);
}

if (typing) {
    typeEffect();
}


/* ================= DYNAMIC COPYRIGHT YEAR ================= */

const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}