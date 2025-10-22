const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const indicadoresContainer = document.querySelector(".indicadores");

let index = 0;

slides.forEach((_, i) => {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("ativo");
  dot.addEventListener("click", () => {
    index = i;
    mostrarSlide(index);
    atualizarIndicadores();
  });
  indicadoresContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".indicadores span");

function mostrarSlide(novoIndex) {
  slides.forEach((slide) => slide.classList.remove("ativo"));
  slides[novoIndex].classList.add("ativo");
}

function atualizarIndicadores() {
  dots.forEach((dot) => dot.classList.remove("ativo"));
  dots[index].classList.add("ativo");
}

nextBtn.addEventListener("click", () => {
  index = (index + 1) % slides.length; // avança
  mostrarSlide(index);
  atualizarIndicadores();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length; // volta
  mostrarSlide(index);
  atualizarIndicadores();
});

// Troca automática a cada 4 segundos
setInterval(() => {
  index = (index + 1) % slides.length;
  mostrarSlide(index);
  atualizarIndicadores();
}, 4000);
