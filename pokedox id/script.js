const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

const showAllButton = document.getElementById('show-all-btn');
const inputField = document.getElementById('pokemon-input');
const pokedexDiv = document.getElementById('pokedex');

let allPokemon = [];

window.addEventListener('load', async () => {
  await loadPokemonList();
  loadPokemonCards(allPokemon);
});

async function loadPokemonList() {
  const response = await fetch(
    'https://pokeapi.co/api/v2/pokemon?limit=151'
  );

  const data = await response.json();

  allPokemon = data.results;
}

async function loadPokemonCards(pokemonArray) {
  pokedexDiv.innerHTML = '';

  for (const pokemon of pokemonArray) {
    const response = await fetch(pokemon.url);
    const data = await response.json();

    createPokemonCard(data);
  }
}

inputField.addEventListener('input', async () => {
  const searchText = inputField.value.toLowerCase().trim();

  if (searchText === 'smash or pass') {
    window.open(
      'https://youtu.be/gys9oDZj-MY?is=PlUH9Xl9OEFwTBOI',
      '_blank'
    );

    inputField.value = '';
    return;
  }

  if (searchText === '') {
    loadPokemonCards(allPokemon);
    return;
  }
  if (!isNaN(searchText)) {
    try {
      const response = await fetch(apiUrl + searchText);

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      pokedexDiv.innerHTML = '';
      createPokemonCard(data);

      return;

    } catch {
      pokedexDiv.innerHTML = '';
      return;
    }
  }
  const filteredPokemon = allPokemon.filter(pokemon =>
    pokemon.name.includes(searchText)
  );

  loadPokemonCards(filteredPokemon);
});

showAllButton.addEventListener('click', () => {
  inputField.value = '';
  loadPokemonCards(allPokemon);
});

async function fetchPokemon(nameOrId) {
  try {
    const response = await fetch(apiUrl + nameOrId);

    if (!response.ok) {
      throw new Error('Pokémon not found');
    }

    const data = await response.json();

    showPokemonDetails(data);

  } catch (error) {
    alert(error.message);
  }
}

function createPokemonCard(data) {
  const card = document.createElement('div');
  card.className = 'pokemon-card';

  card.innerHTML = `
    <img
      src="${data.sprites.front_default}"
      class="pokemon-image"
    />

    <h2 class="pokemon-name">
      ${capitalize(data.name)}
    </h2>

    <div class="pokemon-types">
      ${data.types.map(typeInfo => `
        <div
          class="type"
          style="background-color:${getTypeColor(typeInfo.type.name)}"
        >
          ${typeInfo.type.name}
        </div>
      `).join('')}
    </div>
  `;

  card.addEventListener('click', () => {
    showPokemonDetails(data);
  });

  pokedexDiv.appendChild(card);
}

async function showPokemonDetails(data) {
  pokedexDiv.innerHTML = '';

  const speciesResponse = await fetch(data.species.url);
  const speciesData = await speciesResponse.json();

  const evolutionResponse = await fetch(
    speciesData.evolution_chain.url
  );

  const evolutionData = await evolutionResponse.json();

  const evolutions = [];

  extractEvolutions(evolutionData.chain, evolutions);

  const detailCard = document.createElement('div');
  detailCard.className = 'pokemon-detail-card';

  detailCard.innerHTML = `
    <button id="back-btn">
      ← Back
    </button>

    <img
      src="${data.sprites.front_default}"
      class="detail-image"
    />

    <h1>
      ${capitalize(data.name)}
    </h1>

    <div class="pokemon-types">
      ${data.types.map(typeInfo => `
        <div
          class="type"
          style="background-color:${getTypeColor(typeInfo.type.name)}"
        >
          ${typeInfo.type.name}
        </div>
      `).join('')}
    </div>

    <h3>Pokédex Info</h3>

    <p>
      <strong>Abilities:</strong>
      ${data.abilities
        .map(ability =>
          capitalize(ability.ability.name)
        )
        .join(', ')}
    </p>

    <h3>Stats</h3>

    ${data.stats.map(stat => `
      <p>
        ${stat.stat.name.toUpperCase()}:
        ${stat.base_stat}
      </p>
    `).join('')}

    <h3>Evolution Chain</h3>

    <div id="evolution-container"></div>
  `;

  pokedexDiv.appendChild(detailCard);

  document
    .getElementById('back-btn')
    .addEventListener('click', () => {
      loadPokemonCards(allPokemon);
    });

  const evolutionContainer =
    document.getElementById('evolution-container');

  for (const evolutionName of evolutions) {
    const response = await fetch(apiUrl + evolutionName);
    const evolutionData = await response.json();

    const evolutionCard = document.createElement('div');
    evolutionCard.className = 'pokemon-card evolution-card';

    evolutionCard.innerHTML = `
      <img
        src="${evolutionData.sprites.front_default}"
        class="pokemon-image"
      />

      <h2 class="pokemon-name">
        ${capitalize(evolutionData.name)}
      </h2>
    `;

    evolutionCard.addEventListener('click', () => {
      showPokemonDetails(evolutionData);
    });

    evolutionContainer.appendChild(evolutionCard);
  }
}

function extractEvolutions(chain, evolutions) {
  evolutions.push(chain.species.name);

  chain.evolves_to.forEach(evolution => {
    extractEvolutions(evolution, evolutions);
  });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

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
