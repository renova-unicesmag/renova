/* CONFIGURACIÓN DE CÁMARA - MODO JPG */
/* ESCENAS ESPERANDO COORDENADAS DEL USUARIO */

const slides = [
  {
    id: 1, // Escena 1: Vista general
    x: 960,
    y: 540,
    zoom: 1,
  },
  {
    id: 2, // Escena 2: Ancho 350mm, sup-izq
    x: 494.12,
    y: 277.94,
    zoom: 1.9429,
  },
  {
    id: 3, // Escena 3: Ancho 350mm, izq, 10mm arriba de base
    x: 494.12,
    y: 773.64,
    zoom: 1.9429,
  },
  {
    id: 4, // Escena 4: Ancho 415mm, der, 35mm abajo de tope
    x: 1334.12,
    y: 429.03,
    zoom: 1.6386,
  },
  {
    id: 5, // Escena 5: Misma escala que Escena 4 (1.6386x), borde inferior, 25mm del borde der
    x: 1334.12,
    y: 750.32,
    zoom: 1.6386,
  },
  {
    id: 6, // Escena 6: Vuelve a la escena 1
    x: 960,
    y: 540,
    zoom: 1,
  },
];

let currentIndex = 0;
const world = document.getElementById("world");
const uiLayer = document.getElementById("ui-layer");
const topUiLayer = document.getElementById("top-ui-layer");
const dotsContainer = document.getElementById("dots-container");

// ICONOS OJO
const eyeVisible = document.getElementById("eye-icon-visible");
const eyeHidden = document.getElementById("eye-icon-hidden");

// ICONOS FULLSCREEN
const fsMaximize = document.getElementById("fs-icon-maximize");
const fsMinimize = document.getElementById("fs-icon-minimize");

// MOTOR DE CÁMARA
function updateCamera() {
  if (!world) return;

  const slide = slides[currentIndex];

  // 1. Escala Base (Fit)
  const scaleX = window.innerWidth / 1920;
  const scaleY = window.innerHeight / 1080;
  const baseScale = Math.min(scaleX, scaleY);

  // 2. Escala Final
  const finalScale = baseScale * slide.zoom;

  // 3. Traslación
  const tx = window.innerWidth / 2 - slide.x * finalScale;
  const ty = window.innerHeight / 2 - slide.y * finalScale;

  world.style.transform = `translate(${tx}px, ${ty}px) scale(${finalScale})`;
}

// TOGGLE UI
window.toggleUI = function () {
  if (uiLayer) uiLayer.classList.toggle("hidden");
  if (topUiLayer) topUiLayer.classList.toggle("hidden");

  // Si uiLayer tiene la clase 'hidden', la interfaz está oculta
  const isHidden = uiLayer.classList.contains("hidden");

  if (isHidden) {
    eyeVisible.classList.add("hidden-icon");
    eyeHidden.classList.remove("hidden-icon");
  } else {
    eyeVisible.classList.remove("hidden-icon");
    eyeHidden.classList.add("hidden-icon");
  }
};

// TOGGLE FULLSCREEN
window.toggleFullScreen = function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(
        `Error intentando habilitar pantalla completa: ${err.message}`,
      );
    });
    fsMaximize.classList.add("hidden-icon");
    fsMinimize.classList.remove("hidden-icon");
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      fsMaximize.classList.remove("hidden-icon");
      fsMinimize.classList.add("hidden-icon");
    }
  }
};

// Escuchar cambios en Fullscreen para asegurar iconos correctos si el usuario sale con ESC
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    fsMaximize.classList.remove("hidden-icon");
    fsMinimize.classList.add("hidden-icon");
  } else {
    fsMaximize.classList.add("hidden-icon");
    fsMinimize.classList.remove("hidden-icon");
  }
});

// GESTIÓN DE PUNTOS
function initDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = "";

  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "dot";
    if (index === currentIndex) dot.classList.add("active");

    dot.addEventListener("click", () => {
      currentIndex = index;
      updateUI();
      updateCamera();
    });

    dotsContainer.appendChild(dot);
  });
}

function updateUI() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    if (index === currentIndex) dot.classList.add("active");
    else dot.classList.remove("active");
  });
}

// LISTENERS
window.addEventListener("resize", updateCamera);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter")
    window.nextSlide();
  if (e.key === "ArrowLeft") window.prevSlide();
  if (e.key === "h" || e.key === "H") window.toggleUI();
});

window.nextSlide = function () {
  if (currentIndex < slides.length - 1) {
    currentIndex++;
    updateUI();
    updateCamera();
  }
};

window.prevSlide = function () {
  if (currentIndex > 0) {
    currentIndex--;
    updateUI();
    updateCamera();
  }
};

// INICIO
document.addEventListener("DOMContentLoaded", () => {
  initDots();
  updateUI();
  setTimeout(updateCamera, 100);
});
