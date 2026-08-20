document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const mobileLinks = document.querySelectorAll("#mobile-nav a");

const setMenu = (isOpen) => {
  if (!menuButton || !mobileNav) return;
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  mobileNav.hidden = !isOpen;
  document.body.classList.toggle("menu-open", isOpen);
};

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  mobileLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setMenu(false);
  });
}

const updateHeader = () => {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -7%", threshold: 0.08 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const desktopLinks = document.querySelectorAll(".desktop-nav a[href^='#']");
const sections = Array.from(desktopLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (!visible) return;
    desktopLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + visible.target.id);
    });
  }, { rootMargin: "-20% 0px -68%", threshold: [0, 0.25, 0.5] });

  sections.forEach((section) => sectionObserver.observe(section));
}

const filterButtons = document.querySelectorAll("[data-filter]");
const publicationCards = document.querySelectorAll(".publication-card[data-topic]");
const additionalWorks = document.querySelector(".more-publications");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });

    publicationCards.forEach((card) => {
      const topics = (card.dataset.topic || "").split(" ");
      card.hidden = filter !== "all" && !topics.includes(filter);
    });

    if (additionalWorks) additionalWorks.open = filter !== "all";
  });
});

if (filterButtons.length) {
  filterButtons.forEach((button, index) => button.setAttribute("aria-pressed", String(index === 0)));
}

const copyButton = document.querySelector("[data-copy-email]");
if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const email = copyButton.dataset.copyEmail;
    try {
      await navigator.clipboard.writeText(email);
      copyButton.textContent = "Copied to clipboard";
    } catch (_error) {
      window.location.href = "mailto:" + email;
      copyButton.textContent = "Opening email app";
    }

    window.setTimeout(() => {
      copyButton.textContent = "Copy email";
    }, 2200);
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
