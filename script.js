/**
 * RENOVA WEB - V2 INTERACTIVITY
 */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initLogoParallax();
  initMockProjects();
  initMobileNav();
});

// THEME TOGGLE (LIGHT / DARK)
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  const htmlElem = document.documentElement;

  // Check system preference or saved preference
  const savedTheme = localStorage.getItem("r3nova-theme");
  if (savedTheme) {
    htmlElem.setAttribute("data-theme", savedTheme);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    htmlElem.setAttribute("data-theme", "light");
  }

  toggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElem.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    htmlElem.setAttribute("data-theme", newTheme);
    localStorage.setItem("r3nova-theme", newTheme);
  });
}

// LOGO PARALLAX EFFECT — smooth, flicker-free
function initLogoParallax() {
  const heroSection = document.getElementById("about");
  const logoWrapper = document.querySelector(".liquid-logo-wrapper");

  if (!heroSection || !logoWrapper) return;

  const isDesktop = window.innerWidth > 968;
  if (!isDesktop) return;

  let rafId = null;
  let resetRafId = null;
  let isInside = false;
  let isEntering = false;
  let enterTimeout = null;

  function applyTilt(xAxis, yAxis) {
    if (!isEntering) {
      logoWrapper.style.transition = "transform 0.12s linear";
    }
    logoWrapper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  }

  function resetTilt() {
    logoWrapper.style.transition =
      "transform 1.4s cubic-bezier(0.2, 0.8, 0.2, 1)";
    logoWrapper.style.transform = "rotateY(0deg) rotateX(0deg)";
  }

  // Full-screen mouse tracking for smooth continuous rotation
  document.addEventListener("mousemove", (e) => {
    if (resetRafId) {
      cancelAnimationFrame(resetRafId);
      resetRafId = null;
    }
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const bounds = logoWrapper.getBoundingClientRect();
      // Calculate offset based on the center of the logo specifically
      const xOffset = e.clientX - (bounds.left + bounds.width / 2);
      const yOffset = e.clientY - (bounds.top + bounds.height / 2);

      // Calculate rotation based on total screen size so it doesn't overshoot
      const xAxis = -(xOffset / (window.innerWidth / 30));
      const yAxis = yOffset / (window.innerHeight / 30);

      applyTilt(xAxis, yAxis);
    });
  });

  // Leaving the document entirely (alt-tab, moving to another monitor) resets the logo
  document.addEventListener("mouseleave", () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    resetRafId = requestAnimationFrame(() => {
      resetTilt();
      resetRafId = null;
    });
  });

  // The shine animation should still only trigger when actually touching the logo
  logoWrapper.addEventListener("mouseenter", () => {
    // Smooth entry transition (catch-up to the cursor smoothly)
    isEntering = true;
    logoWrapper.style.transition =
      "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";

    if (enterTimeout) clearTimeout(enterTimeout);
    enterTimeout = setTimeout(() => {
      isEntering = false;
    }, 500);

    // Start shine only if not already animating
    if (!logoWrapper.classList.contains("logo-shining")) {
      logoWrapper.classList.add("logo-shining");

      setTimeout(() => {
        logoWrapper.classList.remove("logo-shining");
      }, 2500);
    }
  });
}

// MOBILE NAV — Hamburger + Slide Drawer
function initMobileNav() {
  const capsuleNav = document.querySelector(".capsule-nav");
  const navControls = capsuleNav
    ? capsuleNav.querySelector(".nav-controls")
    : null;
  const navLinks = capsuleNav ? capsuleNav.querySelector(".nav-links") : null;

  if (!capsuleNav || !navControls) return;

  // --- Inject hamburger button BEFORE nav-controls ---
  const hamburger = document.createElement("button");
  hamburger.className = "nav-hamburger";
  hamburger.setAttribute("aria-label", "Abrir menú");
  hamburger.innerHTML = '<i data-feather="menu"></i>';
  navControls.before(hamburger);

  // --- Build drawer HTML dynamically from existing nav-links ---
  // Collect links from the page's nav-links div
  const linkItems = navLinks ? Array.from(navLinks.querySelectorAll("a")) : [];

  let drawerLinksHTML = "";
  linkItems.forEach((link) => {
    const clonedLink = link.cloneNode(true);
    drawerLinksHTML += clonedLink.outerHTML;
  });

  const drawer = document.createElement("div");
  drawer.className = "mobile-nav-drawer";
  drawer.innerHTML = `
    <div class="drawer-backdrop"></div>
    <div class="drawer-panel">
      <button class="drawer-close" aria-label="Cerrar menú">
        <i data-feather="x"></i>
      </button>
      ${drawerLinksHTML}
    </div>
  `;
  document.body.appendChild(drawer);

  // Re-render feather icons inside the drawer
  if (typeof feather !== "undefined") {
    feather.replace();
  }

  // --- Open / Close logic ---
  function openDrawer() {
    drawer.classList.add("open");
    hamburger.classList.add("active");
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    hamburger.classList.remove("active");
  }

  hamburger.addEventListener("click", () => {
    if (drawer.classList.contains("open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
  drawer
    .querySelector(".drawer-backdrop")
    .addEventListener("click", closeDrawer);
  drawer.querySelector(".drawer-close").addEventListener("click", closeDrawer);

  // Close drawer when a link is tapped
  drawer.querySelectorAll(".drawer-panel a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}
