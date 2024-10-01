const apiUrl = 'https://rickandmortyapi.com/api/character';
const characterList = document.getElementById('characterList');
const filterInput = document.getElementById('filterInput');
const favoritesList = document.getElementById('favoritesList');
const characterDetails = document.getElementById('characterDetails');
const characterName = document.getElementById('characterName');
const characterSpecies = document.getElementById('characterSpecies');
const characterStatus = document.getElementById('characterStatus');
const characterOrigin = document.getElementById('characterOrigin');
const characterImage = document.getElementById('characterImage');
const closeDetails = document.getElementById('closeDetails');
const clearFavorites = document.getElementById('clearFavorites');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let allCharacters = [];

// Função para buscar dados da API
async function fetchCharacters() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Erro: ${response.status}`);
    const data = await response.json();
    allCharacters = data.results;
    displayCharacters(allCharacters);
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
  }
}

// Função para exibir personagens
function displayCharacters(characters) {
  characterList.innerHTML = characters.map(character => `
    <div class="card" data-id="${character.id}">
      <img src="${character.image}" alt="${character.name}" />
      <div>
        <strong>${character.name}</strong>
        <button class="favorite-btn" onclick="addToFavorites(${character.id})">Favorito</button>
        <button class="details-btn" onclick="showCharacterDetails(${character.id})">Mostrar Características</button>
      </div>
    </div>
  `).join('');
}

// Função para exibir características do personagem
function showCharacterDetails(id) {
  const character = allCharacters.find(c => c.id === id);
  if (character) {
    characterName.textContent = character.name;
    characterSpecies.textContent = `Espécie: ${character.species}`;
    characterStatus.textContent = `Status: ${character.status}`;
    characterOrigin.textContent = `Origem: ${character.origin.name}`;
    characterImage.src = character.image;
    
    characterDetails.classList.add('active');
  }
}

// Função para fechar detalhes do personagem
closeDetails.addEventListener('click', () => {
  characterDetails.classList.remove('active');
});

// Função para adicionar favoritos
function addToFavorites(id) {
  if (!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
  } else {
    alert('Este personagem já está na lista de favoritos.');
  }
}

// Exibir favoritos
function renderFavorites() {
  if (favorites.length === 0) {
    favoritesList.innerHTML = '<p>Você não tem favoritos ainda.</p>';
    return;
  }

  favoritesList.innerHTML = favorites.map(id => {
    const character = allCharacters.find(c => c.id === id);
    return character ? `
      <div class="favorite-character">
        <img src="${character.image}" alt="${character.name}" />
        <button class="favorite-btn" onclick="removeFromFavorites(${id})" style="display: none;">Remover</button>
      </div>
    ` : '';
  }).join('');
}

// Função para remover favoritos
function removeFromFavorites(id) {
  favorites = favorites.filter(favId => favId !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

// Função para limpar favoritos
clearFavorites.addEventListener('click', () => {
  favorites = []; // Limpa a lista de favoritos
  localStorage.removeItem('favorites'); // Remove do localStorage
  renderFavorites(); // Atualiza a exibição dos favoritos
});

// Filtragem
filterInput.addEventListener('input', () => {
  const searchTerm = filterInput.value.toLowerCase();
  const filteredCharacters = allCharacters.filter(character =>
    character.name.toLowerCase().includes(searchTerm)
  );
  displayCharacters(filteredCharacters);
});

// Carregar personagens e favoritos ao iniciar a página
fetchCharacters();
renderFavorites();
