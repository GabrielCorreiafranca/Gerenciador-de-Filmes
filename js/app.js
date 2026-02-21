const API_KEY = "59b42e17";

const catalogo = document.getElementById("catalogo");
const searchInput = document.getElementById("search");
const favBtn = document.getElementById("favBtn");
const homeBtn = document.getElementById("homeBtn");

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

function salvarFavoritos() {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function toggleFavorito(filme) {
  const index = favoritos.findIndex(f => f.imdbID === filme.imdbID);
  if (index >= 0) {
    favoritos.splice(index, 1);
  } else {
    favoritos.push(filme);
  }
  salvarFavoritos();
}

const categorias = [
  { titulo: "Heróis", termo: "avengers" },
  { titulo: "Batman", termo: "batman" },
  { titulo: "Fantasia", termo: "harry" },
  { titulo: "Star Wars", termo: "star" },
  { titulo: "Velocidade", termo: "fast" },
  { titulo: "Homem-Aranha", termo: "spider" }
];

function criarCard(filme) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  const isFav = favoritos.some(f => f.imdbID === filme.imdbID);

  card.innerHTML = `
    <button class="favorite-button ${isFav ? "active" : ""}">❤</button>
    <img src="${filme.Poster}">
    <h3>${filme.Title}</h3>
  `;

  const favButton = card.querySelector(".favorite-button");

  favButton.onclick = e => {
    e.stopPropagation();
    toggleFavorito(filme);
    favButton.classList.toggle("active");
  };

  return card;
}

async function criarCarrossel(categoria) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${categoria.termo}&type=movie`);
  const data = await res.json();

  const section = document.createElement("section");
  section.classList.add("movie-section");

  const titulo = document.createElement("h2");
  titulo.textContent = categoria.titulo;

  const row = document.createElement("div");
  row.classList.add("movie-row");

  if (data.Search) {
    data.Search.forEach(filme => {
      if (filme.Poster === "N/A") return;
      row.appendChild(criarCard(filme));
    });
  }

  section.appendChild(titulo);
  section.appendChild(row);
  catalogo.appendChild(section);
}

async function carregarCatalogo() {
  catalogo.innerHTML = "";
  for (let categoria of categorias) {
    await criarCarrossel(categoria);
  }
}

function mostrarFavoritos() {
  catalogo.innerHTML = "";

  const section = document.createElement("section");
  section.classList.add("movie-section");

  const titulo = document.createElement("h2");
  titulo.textContent = "⭐ Favoritos";

  const row = document.createElement("div");
  row.classList.add("movie-row");

  if (favoritos.length === 0) {
    row.innerHTML = "<p>Você ainda não adicionou favoritos.</p>";
  } else {
    favoritos.forEach(filme => {
      row.appendChild(criarCard(filme));
    });
  }

  section.appendChild(titulo);
  section.appendChild(row);
  catalogo.appendChild(section);
}

searchInput.addEventListener("input", async e => {
  const valor = e.target.value.trim();

  if (valor.length > 2) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${valor}&type=movie`);
    const data = await res.json();

    catalogo.innerHTML = "";

    const section = document.createElement("section");
    section.classList.add("movie-section");

    const row = document.createElement("div");
    row.classList.add("movie-row");

    if (data.Search) {
      data.Search.forEach(filme => {
        if (filme.Poster === "N/A") return;
        row.appendChild(criarCard(filme));
      });
    }

    section.appendChild(row);
    catalogo.appendChild(section);
  }
});

favBtn.onclick = mostrarFavoritos;
homeBtn.onclick = carregarCatalogo;

carregarCatalogo();