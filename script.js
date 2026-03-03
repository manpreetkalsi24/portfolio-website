window.onload = pageReady;

function pageReady() {
    setupTheme();
    setupNav();
    setupReveal();
    setupActiveNav();
    setupToTop();
    setupContactForm();
}

function setupTheme() {
    const root = document.documentElement;
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    root.setAttribute("data-theme", initial);

    button.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
        const next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        showToast(next === "dark" ? "Dark theme enabled" : "Light theme enabled");
    });
}

function setupNav() {
    const toggle = document.getElementById("nav-toggle");
    const panel = document.getElementById("nav-panel");
    if (!toggle || !panel) return;

    const close = () => {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
        const open = panel.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.querySelectorAll("[data-nav]").forEach(link => {
        link.addEventListener("click", close);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });

    document.addEventListener("click", (e) => {
        if (!panel.classList.contains("is-open")) return;
        const target = e.target;
        if (!(target instanceof Element)) return;
        if (panel.contains(target) || toggle.contains(target)) return;
        close();
    });
}

function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (items.length === 0) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        items.forEach(el => el.classList.add("is-visible"));
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.18 }
    );

    items.forEach(el => io.observe(el));
}

function setupActiveNav() {
    const links = Array.from(document.querySelectorAll(".nav-link"));
    const sections = links
        .map(link => {
            const id = link.getAttribute("href");
            if (!id || !id.startsWith("#")) return null;
            return document.querySelector(id);
        })
        .filter(Boolean);

    if (links.length === 0 || sections.length === 0) return;

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = `#${entry.target.id}`;
                links.forEach(a => {
                    const active = a.getAttribute("href") === id;
                    a.classList.toggle("is-active", active);
                });
            });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(section => io.observe(section));
}

function setupToTop() {
    const btn = document.getElementById("to-top");
    if (!btn) return;

    const onScroll = () => {
        const show = window.scrollY > 500;
        btn.classList.toggle("is-visible", show);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        form.reset();
        showToast("Thanks! For contacting me.");
    });
}

let toastTimer = null;
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("is-visible");

    if (toastTimer) {
        window.clearTimeout(toastTimer);
    }

    toastTimer = window.setTimeout(() => {
        toast.classList.remove("is-visible");
        toastTimer = null;
    }, 2600);
}