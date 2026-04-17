async function loadComponent(target) {
  const componentName = target.dataset.component;
  const base = document.body.dataset.base || ".";

  try {
    const response = await fetch(`${base}/components/${componentName}.html`);
    if (!response.ok) {
      throw new Error(`Unable to load ${componentName}`);
    }

    const markup = await response.text();
    target.innerHTML = markup.replaceAll("{{BASE}}", base);
  } catch (error) {
    console.error(error);
  }
}

function highlightActiveNav() {
  const currentPage = document.body.dataset.page;
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const isActive = link.dataset.navLink === currentPage;
    link.classList.toggle("nav-link-active", isActive);
  });
}

function initMobileNav() {
  const toggleButton = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (!toggleButton || !mobileMenu) {
    return;
  }

  toggleButton.addEventListener("click", () => {
    const isOpen = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("hidden", isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggleButton.setAttribute("aria-expanded", "false");
      mobileMenu.classList.add("hidden");
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href) {
        return;
      }

      const url = new URL(href, window.location.href);
      const isSamePage =
        url.pathname.replace(/\/$/, "") === window.location.pathname.replace(/\/$/, "") &&
        url.hash;

      if (!isSamePage) {
        return;
      }

      const target = document.querySelector(url.hash);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", url.hash);
    });
  });
}

function scrollToHashOnLoad() {
  if (!window.location.hash) {
    return;
  }

  window.setTimeout(() => {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 120);
}

function initRevealAnimations() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  reveals.forEach((item) => observer.observe(item));
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const message = document.querySelector("[data-form-message]");

  if (!form || !message) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    message.textContent =
      "Thank you. Your message has been noted, and the FYNTRA LTD team will get back to you soon.";
    message.classList.remove("opacity-0", "translate-y-2");
  });
}

function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const componentTargets = Array.from(document.querySelectorAll("[data-component]"));
  await Promise.all(componentTargets.map(loadComponent));
  highlightActiveNav();
  initMobileNav();
  initSmoothScroll();
  scrollToHashOnLoad();
  initRevealAnimations();
  initContactForm();
  setCurrentYear();
});
