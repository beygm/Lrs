// ✿ Personaliza la carta dentro de LETTER_PARAGRAPHS cuando tengas tu texto.
const LETTER_PARAGRAPHS = [
  "Este espacio está reservado para tus palabras.",
  "Cuando tengas lista tu carta, reemplaza estos párrafos por tu mensaje. También puedes enviármelo y te ayudo a integrarlo."
];

const letterBody = document.querySelector("#letterBody");
letterBody.innerHTML = LETTER_PARAGRAPHS.map(text => `<p>${escapeHTML(text)}</p>`).join("");

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

// Entrada suave de los elementos al aparecer en pantalla.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Modal de bienvenida y navegación a la carta.
const modal = document.querySelector("#letterModal");
const openModal = () => { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); };
const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
document.querySelector("#openLetter").addEventListener("click", openModal);
document.querySelector("#closeLetter").addEventListener("click", closeModal);
document.querySelector("[data-close]").addEventListener("click", closeModal);
document.querySelector("#goToLetter").addEventListener("click", () => {
  closeModal();
  document.querySelector("#carta").scrollIntoView({ behavior: "smooth" });
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// Mensajitos escondidos en las flores.
const pop = document.querySelector("#messagePop");
document.querySelectorAll(".flower-tile").forEach(tile => {
  tile.addEventListener("click", () => {
    pop.querySelector("p").textContent = tile.dataset.message;
    pop.classList.remove("show");
    requestAnimationFrame(() => pop.classList.add("show"));
  });
});

// Pétalos flotando discretamente.
const petalField = document.querySelector("#petalField");
const petalSymbols = ["✿", "✧", "·", "❀"];
function makePetal() {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.fontSize = `${10 + Math.random() * 13}px`;
  petal.style.setProperty("--drift", `${-70 + Math.random() * 140}px`);
  petal.style.animationDuration = `${9 + Math.random() * 8}s`;
  petalField.appendChild(petal);
  setTimeout(() => petal.remove(), 18000);
}
for (let i = 0; i < 10; i++) setTimeout(makePetal, i * 500);
setInterval(makePetal, 1500);

// Corazones al tocar el botón final.
document.querySelector("#heartButton").addEventListener("click", event => {
  const rect = event.currentTarget.getBoundingClientRect();
  for (let i = 0; i < 14; i++) {
    const heart = document.createElement("span");
    heart.className = "heart-float";
    heart.textContent = ["♡", "♥", "✧"][i % 3];
    heart.style.left = `${rect.left + rect.width / 2 + (Math.random() * 90 - 45)}px`;
    heart.style.top = `${rect.top + rect.height / 2}px`;
    heart.style.animationDelay = `${Math.random() * .35}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2300);
  }
});

// Botón de música: deja un detalle sonoro opcional sin cargar archivos externos.
// Usa una melodía sencilla generada con Web Audio; algunos navegadores requieren interacción.
let audioContext = null, melodyTimer = null, noteIndex = 0;
const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 783.99, 698.46];
const soundToggle = document.querySelector("#soundToggle");
function playNote() {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "sine";
  osc.frequency.value = notes[noteIndex++ % notes.length];
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + .04);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + .55);
  osc.connect(gain); gain.connect(audioContext.destination);
  osc.start(); osc.stop(audioContext.currentTime + .6);
}
soundToggle.addEventListener("click", async () => {
  if (melodyTimer) {
    clearInterval(melodyTimer); melodyTimer = null;
    soundToggle.setAttribute("aria-pressed", "false");
    soundToggle.querySelector(".sound-label").textContent = "Música";
    return;
  }
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") await audioContext.resume();
  playNote();
  melodyTimer = setInterval(playNote, 650);
  soundToggle.setAttribute("aria-pressed", "true");
  soundToggle.querySelector(".sound-label").textContent = "Pausar";
});


// Pequeño destello de celebración cuando ella abre su sorpresa.
document.querySelector("#openLetter").addEventListener("click", () => {
  const symbols = ["♡", "✦", "✿", "✧"];
  for (let i = 0; i < 18; i++) {
    const spark = document.createElement("span");
    spark.className = "heart-float";
    spark.textContent = symbols[i % symbols.length];
    spark.style.left = `${10 + Math.random() * 80}vw`;
    spark.style.top = `${15 + Math.random() * 55}vh`;
    spark.style.animationDuration = `${1.2 + Math.random() * 1.2}s`;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 2600);
  }
});
