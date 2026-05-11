const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

const searchButton = document.getElementById('search-btn');
const inputField = document.getElementById('pokemon-input');
const pokedexDiv = document.getElementById('pokedex');

// Load Pokémon when page opens
window.addEventListener('load', () => {
  loadPokemon();
});

// Search button
searchButton.addEventListener('click', () => {
  const pokemonNameOrId = inputField.value.toLowerCase().trim();

  if (pokemonNameOrId) {
    fetchPokemon(pokemonNameOrId);
  } else {
    loadPokemon();
  }
});

// Allow Enter key search
inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchButton.click();
  }
});

// Load first 151 Pokémon
async function loadPokemon() {
  pokedexDiv.innerHTML = '';

  for (let i = 1; i <= 151; i++) {
    try {
      const response = await fetch(apiUrl + i);
      const data = await response.json();

      displayPokemon(data);

    } catch (error) {
      console.error(error);
    }
  }
}

// Search one Pokémon
async function fetchPokemon(nameOrId) {
  try {
    pokedexDiv.innerHTML = '';

    const response = await fetch(apiUrl + nameOrId);

    if (!response.ok) {
      throw new Error('Pokémon not found');
    }

    const data = await response.json();

    displayPokemon(data);

  } catch (error) {
    alert(error.message);
  }
}

// Create Pokémon card
function displayPokemon(data) {
  const card = document.createElement('div');
  card.className = 'pokemon-card';

  // Pokémon Image
  const image = document.createElement('img');
  image.src = data.sprites.front_default;
  image.alt = data.name;
  image.className = 'pokemon-image';

  // Pokémon Name
  const name = document.createElement('div');
  name.className = 'pokemon-name';
  name.textContent =
    data.name.charAt(0).toUpperCase() + data.name.slice(1);

  // Pokémon Types
  const typesContainer = document.createElement('div');
  typesContainer.className = 'pokemon-types';

  data.types.forEach(typeInfo => {
    const typeDiv = document.createElement('div');

    typeDiv.className = 'type';
    typeDiv.style.backgroundColor =
      getTypeColor(typeInfo.type.name);

    typeDiv.textContent = typeInfo.type.name;

    typesContainer.appendChild(typeDiv);
  });

  // Pokémon Stats
  const statsContainer = document.createElement('div');
  statsContainer.className = 'stats';

  data.stats.forEach(statInfo => {
    const statDiv = document.createElement('div');

    statDiv.className = 'stat';

    statDiv.textContent =
      `${statInfo.stat.name.toUpperCase()}: ${statInfo.base_stat}`;

    statsContainer.appendChild(statDiv);
  });

  // Add everything to card
  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(typesContainer);
  card.appendChild(statsContainer);

  // Add card to page
  pokedexDiv.appendChild(card);
}

// Pokémon type colors
function getTypeColor(type) {
  const colors = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0'
  };

  return colors[type] || '#777';
}