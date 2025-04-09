function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    const team = params.get('team');
    const map = params.get('map');
    const resource = params.get('resource');
    const goal = params.get('goal');
    const timeLimit = params.get('timeLimit');
    const mission = params.get('mission');

    console.log(`Username: ${username}`);
    console.log(`Team: ${team}`);
    console.log(`Map: ${map}`);
    console.log(`Resource: ${resource}`);
    console.log(`Goal: ${goal}`);
    console.log(`Time Limit: ${timeLimit}`);
    console.log(`Mission: ${mission}`);

    document.getElementById('usernameDisplay').textContent = `Username: ${username}`;
    document.getElementById('teamDisplay').textContent = `Team: ${team}`;
    document.getElementById('mapDisplay').textContent = `Map: ${map}`;
    document.getElementById('resourceDisplay').textContent = `Resource: ${resource}`;
    document.getElementById('goalDisplay').textContent = `Goal: ${goal}`;
    document.getElementById('timeLimitDisplay').textContent = `Time Limit: ${timeLimit}`;
    document.getElementById('missionDisplay').textContent = `Mission: ${mission}`;
}

function fadeInPage() {
    console.log("fadeInPage called");
    const overlay = document.getElementById('transitionOverlay');
    if (overlay) {
        overlay.classList.add('hidden'); 
        console.log("Overlay hidden");
    } else {
        console.error("Overlay not found");
    }
}

const mapContainer = document.getElementById('mapContainer');
const mapPlaceholder = document.getElementById('mapPlaceholder');
const MAP_SIZE = 64; 
const TILE_SIZE = 32;
const VISIBLE_MAP_SIZE = 5; 

const TILESET_IMAGE = './img/tileset.png'; 
const TILESET_TILE_SIZE = 32;
const TILESET_COLUMNS = 10; 

const TILE_TYPES = {
    grass: [0, 9], 
    water: [10, 19], 
    rock: [20, 29], 
};


const SPRITE_SIZE = 64; 
const characterSprite = document.createElement('div');
characterSprite.id = 'character';
characterSprite.style.width = `${SPRITE_SIZE}px`;
characterSprite.style.height = `${SPRITE_SIZE}px`;
characterSprite.style.backgroundImage = 'url(./img/character_spritesheet.png)';
characterSprite.style.backgroundSize = '256px 256px'; 
characterSprite.style.position = 'absolute';
characterSprite.style.zIndex = '10';
mapContainer.appendChild(characterSprite);

let characterPosition = { x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) };
let animationFrame = 0;

function generateMapData(size) {
    const map = [];
    for (let y = 0; y < size; y++) {
        const row = [];
        for (let x = 0; x < size; x++) {
            const tileType = Math.random();
            let tileID;

            if (tileType < 0.6) {
                tileID = randomTileID(TILE_TYPES.grass);
            } else if (tileType < 0.8) {
                tileID = randomTileID(TILE_TYPES.water);
            } else {
                tileID = randomTileID(TILE_TYPES.rock);
            }

            row.push(tileID);
        }
        map.push(row);
    }
    return map;
}

function randomTileID(range) {
    const [min, max] = range;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const mapData = generateMapData(MAP_SIZE);

function renderMap() {
    mapPlaceholder.style.width = `${MAP_SIZE * TILE_SIZE}px`;
    mapPlaceholder.style.height = `${MAP_SIZE * TILE_SIZE}px`;
    mapPlaceholder.innerHTML = '';

    mapData.forEach((row, y) => {
        row.forEach((tileID, x) => {
            const tileElement = document.createElement('div');
            tileElement.style.width = `${TILE_SIZE}px`;
            tileElement.style.height = `${TILE_SIZE}px`;
            tileElement.style.position = 'absolute';
            tileElement.style.left = `${x * TILE_SIZE}px`;
            tileElement.style.top = `${y * TILE_SIZE}px`;

            const tileX = tileID % TILESET_COLUMNS; 
            const tileY = Math.floor(tileID / TILESET_COLUMNS); 
            const backgroundX = tileX * TILESET_TILE_SIZE; 
            const backgroundY = tileY * TILESET_TILE_SIZE; 

            tileElement.style.backgroundImage = `url(${TILESET_IMAGE})`;
            tileElement.style.backgroundPosition = `-${backgroundX}px -${backgroundY}px`;
            tileElement.style.backgroundSize = `${TILESET_COLUMNS * TILESET_TILE_SIZE}px auto`;

            mapPlaceholder.appendChild(tileElement);
        });
    });
}

renderMap();

function updateCharacterPosition() {
    const mapOffsetX = Math.min(
        Math.max(0, characterPosition.x - Math.floor(VISIBLE_MAP_SIZE / 2)),
        MAP_SIZE - VISIBLE_MAP_SIZE
    );
    const mapOffsetY = Math.min(
        Math.max(0, characterPosition.y - Math.floor(VISIBLE_MAP_SIZE / 2)),
        MAP_SIZE - VISIBLE_MAP_SIZE
    );

    mapPlaceholder.style.transform = `translate(${-mapOffsetX * TILE_SIZE}px, ${-mapOffsetY * TILE_SIZE}px)`;

    characterSprite.style.left = `${(characterPosition.x - mapOffsetX) * TILE_SIZE}px`;
    characterSprite.style.top = `${(characterPosition.y - mapOffsetY) * TILE_SIZE}px`;
}


function updateCharacterAnimation(direction) {
    animationFrame = (animationFrame + 1) % 4;
    const directionOffset = {
        down: 0,
        left: 1,
        right: 2,
        up: 3,
    };
    const offsetY = directionOffset[direction] * SPRITE_SIZE;
    characterSprite.style.backgroundPosition = `-${animationFrame * SPRITE_SIZE}px -${offsetY}px`;
}


document.addEventListener('keydown', (event) => {
    let moved = false;
    switch (event.key.toLowerCase()) {
        case 'w': 
            if (characterPosition.y > 0) {
                characterPosition.y--;
                updateCharacterAnimation('up');
                moved = true;
            }
            break;
        case 's': 
            if (characterPosition.y < MAP_SIZE - 1) {
                characterPosition.y++;
                updateCharacterAnimation('down');
                moved = true;
            }
            break;
        case 'a': 
            if (characterPosition.x > 0) {
                characterPosition.x--;
                updateCharacterAnimation('left');
                moved = true;
            }
            break;
        case 'd': 
            if (characterPosition.x < MAP_SIZE - 1) {
                characterPosition.x++;
                updateCharacterAnimation('right');
                moved = true;
            }
            break;
    }
    if (moved) updateCharacterPosition();
});


window.onload = function () {
    fadeInPage();
    getQueryParams();
    updateCharacterPosition();
};