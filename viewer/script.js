/* CONFIGURACIÓN DE CÁMARA - MODO JPG */
/* ESCENAS ESPERANDO COORDENADAS DEL USUARIO */

const slides = [
  {
    id: 1,
    // ESTADO INICIAL: VISTA GENERAL
    x: 960,
    y: 540,
    zoom: 1,
  },
  {
    id: 2,
    // RESERVADO PARA COORDENADAS
    x: 960,
    y: 540,
    zoom: 1,
  },
];

let currentIndex = 0;
const world = document.getElementById("world");
const uiLayer = document.getElementById("ui-layer");
const dotsContainer = document.getElementById("dots-container");

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
  if (uiLayer) {
    uiLayer.classList.toggle("hidden");
  }
};

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
