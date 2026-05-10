const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

const searchButton = document.getElementById('search-btn');
const inputField = document.getElementById('pokemon-input');
const pokedexDiv = document.getElementById('pokedex');

searchButton.addEventListener('click', () => {
  const pokemonNameOrId = inputField.value.toLowerCase().trim();
  if (pokemonNameOrId) {
    fetchPokemon(pokemonNameOrId);
  }
});

async function fetchPokemon(nameOrId) {
  try {
    const response = await fetch(apiUrl + nameOrId);
    if (!response.ok) {
      throw new Error('Pokémon not found');
    }
    const data = await response.json();
    displayPokemon(data);
  } catch (error) {
    alert(error.message);
    pokedexDiv.innerHTML = '';
  }
}

function displayPokemon(data) {
  pokedexDiv.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'pokemon-card';

  const name = document.createElement('div');
  name.className = 'pokemon-name';
  name.textContent = data.name;

  const typesContainer = document.createElement('div');
  typesContainer.className = 'pokemon-types';

  data.types.forEach(typeInfo => {
    const typeDiv = document.createElement('div');
    typeDiv.className = 'type';
    typeDiv.style.backgroundColor = getTypeColor(typeInfo.type.name);
    typeDiv.textContent = typeInfo.type.name;
    typesContainer.appendChild(typeDiv);
  });

  const statsContainer = document.createElement('div');
  statsContainer.className = 'stats';

  data.stats.forEach(statInfo => {
    const statDiv = document.createElement('div');
    statDiv.className = 'stat';
    statDiv.textContent = `${statInfo.stat.name.toUpperCase()}: ${statInfo.base_stat}`;
    statsContainer.appendChild(statDiv);
  });

  card.appendChild(name);
  card.appendChild(typesContainer);
  card.appendChild(statsContainer);

  pokedexDiv.appendChild(card);
}
