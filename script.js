/**
 * RENOVA WEB - V2 INTERACTIVITY
 */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initLogoParallax();
  initMockProjects();
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

// MOCK PROJECTS DATA (Visually focused)
const projectsData = [
  {
    id: 1,
    title: "Micelio Estructural",
    icon: "cpu",
    category: "id",
    tag: "Biomateriales",
    bg: "linear-gradient(45deg, #00E5FF, #001f3f)",
  },
  {
    id: 2,
    title: "Pabellón Paramétrico",
    icon: "box",
    category: "deploy",
    tag: "Arquitectura",
    bg: "linear-gradient(45deg, #001f3f, #003666)",
  },
  {
    id: 3,
    title: "Optimización ACV",
    icon: "activity",
    category: "deploy",
    tag: "Consultoría",
    bg: "linear-gradient(45deg, #003333, #00E5FF)",
  },
  {
    id: 4,
    title: "Filtros Activos",
    icon: "droplet",
    category: "id",
    tag: "Remediación",
    bg: "linear-gradient(45deg, #051a1a, #004d4d)",
  },
];

function initMockProjects() {
  const grid = document.getElementById("projects-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (!grid) return;

  function renderProjects(filter = "all") {
    grid.innerHTML = "";
    const filtered =
      filter === "all"
        ? projectsData
        : projectsData.filter((p) => p.category === filter);

    filtered.forEach((project) => {
      const el = document.createElement("div");
      el.className = "project-item";
      el.innerHTML = `
                <div class="project-bg" style="background: ${project.bg}"></div>
                <div class="project-content">
                    <span class="project-tag"><i data-feather="${project.icon}"></i> ${project.tag}</span>
                    <h3>${project.title}</h3>
                </div>
            `;
      grid.appendChild(el);
    });

    // Re-call feather replace for newly injected icons
    if (typeof feather !== "undefined") {
      feather.replace();
    }
  }

  // Initial render
  renderProjects();

  // Filter Logic
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      renderProjects(e.target.dataset.filter);
    });
  });
}
