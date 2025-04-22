const tileSize = 64;
const zoomFactor = 1.35;
const mapCols = 20;
const mapRows = 20;

const tileSources = {
    1: 'img/grass1.png',
    2: 'img/grass2.png',
    3: 'img/tree1.png',
    4: 'img/tree2.png',
    5: 'img/water.png',
    6: 'img/waterGrassLeft.png',
    7: 'img/waterGrassRight.png',
    8: 'img/waterLandLeft.png',
    9: 'img/waterLandRight.png'
};

const tileImages = {};
let tilesLoaded = 0;

const params = GetQueryParams();
const playerName = params.username;
const controlType = (params.control || 'wasd').toLowerCase();

const map = [
  [3,3,3,3,4,4,4,3,6,8,5,9,7,4,4,3,3,4,3,3],
  [4,3,3,3,4,4,3,4,6,8,5,9,7,4,4,3,3,3,4,3],
  [3,4,4,3,3,4,3,3,6,8,5,9,7,4,3,4,3,3,4,4],
  [4,4,3,3,4,3,3,3,6,8,5,9,7,4,3,4,3,3,3,4],
  [1,1,2,1,1,1,1,1,6,8,5,9,7,2,1,1,1,2,2,2],
  [1,1,1,2,2,1,1,2,6,8,5,9,7,2,2,1,1,1,2,1],
  [1,1,2,2,1,1,1,1,6,8,5,9,7,6,6,6,1,1,1,1],
  [1,1,2,2,2,2,2,1,6,8,5,9,7,6,6,6,1,1,1,1],
  [1,1,1,1,1,2,1,1,6,8,5,9,7,6,6,6,1,1,1,1],
  [1,1,2,1,1,2,2,1,6,8,5,9,7,6,6,6,1,1,1,1],
  [1,1,1,1,1,1,1,1,6,8,5,9,7,1,1,1,1,1,1,1],
  [1,1,1,1,1,2,2,1,6,8,5,9,7,7,1,1,7,7,1,1],
  [1,1,1,1,1,1,1,1,6,8,5,9,7,1,1,1,1,1,1,1],
  [1,2,1,1,1,1,1,1,6,8,5,9,7,1,4,4,1,1,1,1],
  [1,1,1,1,1,1,1,1,6,8,5,9,7,1,1,1,1,1,1,1],
  [2,2,1,2,1,2,1,2,6,8,5,9,7,2,2,1,1,2,1,2],
  [4,4,3,3,4,3,3,3,6,8,5,9,7,4,3,4,3,3,3,4],
  [3,3,3,4,4,4,4,3,6,8,5,9,7,1,1,4,4,1,1,1],
  [3,3,3,3,4,4,4,3,6,8,5,9,7,4,4,3,3,4,3,3],
  [4,3,3,3,4,4,3,4,6,8,5,9,7,4,4,3,3,3,4,3],
];

let player = { x: 5, y: 7, animX: 5, animY: 7 };
let target = null;
let moving = false;
let animationFrame;

const mapPlaceholder = document.getElementById('mapPlaceholder');
const minimapSection = document.getElementById('minimapSection');

function drawMap() {
    const canvas = document.createElement('canvas');
    canvas.width = mapCols * tileSize;
    canvas.height = mapRows * tileSize;
    const ctx = canvas.getContext('2d');

    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            const tileId = map[y][x];
            const img = tileImages[tileId];
            if (img) {
                ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    const px = player.animX * tileSize + tileSize / 2;
    const py = player.animY * tileSize + tileSize / 2;
    const textWidth = ctx.measureText(playerName).width;

    ctx.fillStyle = params.team?.toLowerCase() === 'human' ? 'blue' : 'green';
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.font = 'bold 14px sans-serif';
    ctx.lineWidth = 2;
    ctx.strokeText(playerName, px - textWidth / 2, py - tileSize / 2);
    ctx.fillText(playerName, px - textWidth / 2, py - tileSize / 2);

    mapPlaceholder.innerHTML = '';
    mapPlaceholder.appendChild(canvas);

    updateViewport();

    if (controlType === 'click') {
        canvas.onclick = handleCanvasClick;
    }
}

function updateViewport() {
    const canvas = mapPlaceholder.firstChild;
    if (!canvas) return;

    // Begrenzung, damit der Viewport nicht über die Map hinaus scrollt
    const viewWidth = mapPlaceholder.clientWidth / zoomFactor;
    const viewHeight = mapPlaceholder.clientHeight / zoomFactor;
    const minX = viewWidth / 2 - tileSize / 2;
    const minY = viewHeight / 2 - tileSize / 2;
    const maxX = mapCols * tileSize - viewWidth / 2 - tileSize / 2;
    const maxY = mapRows * tileSize - viewHeight / 2 - tileSize / 2;

    let centerX = player.x * tileSize;
    let centerY = player.y * tileSize;
    centerX = Math.max(minX, Math.min(centerX, maxX));
    centerY = Math.max(minY, Math.min(centerY, maxY));

    const offsetX = -(centerX * zoomFactor - mapPlaceholder.clientWidth / 2 + tileSize / 2);
    const offsetY = -(centerY * zoomFactor - mapPlaceholder.clientHeight / 2 + tileSize / 2);

    canvas.style.transform = `scale(${zoomFactor}) translate(${offsetX / zoomFactor}px, ${offsetY / zoomFactor}px)`;
    canvas.style.transformOrigin = 'top left';

    drawMinimap();
}

function drawMinimap() {
    minimapSection.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    const scaleX = canvas.width / (mapCols * tileSize);
    const scaleY = canvas.height / (mapRows * tileSize);

    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            const tileId = map[y][x];
            const img = tileImages[tileId];
            if (img) {
                ctx.drawImage(img, x * tileSize * scaleX, y * tileSize * scaleY, tileSize * scaleX, tileSize * scaleY);
            }
        }
    }

    // Spielerpunkt zeichnen
    ctx.fillStyle = params.team?.toLowerCase() === 'human' ? 'blue' : 'green';
    ctx.beginPath();
    ctx.arc(player.x * tileSize * scaleX + (tileSize * scaleX) / 2, player.y * tileSize * scaleY + (tileSize * scaleY) / 2, 7, 0, Math.PI * 2);
    ctx.fill();

    minimapSection.appendChild(canvas);
}

function movePlayer(dx, dy) {
    player.x = Math.round(player.x);
    player.y = Math.round(player.y);

    const newX = player.x + dx;
    const newY = player.y + dy;

    // Check if crossing water
    if (map[player.y][player.x] === 5 || map[newY][newX] === 5) {
        alert('You died');
        player.x = 6;
        player.y = 5;
        player.animX = 6;
        player.animY = 5;
        updateViewport();
        drawMap();
        return;
    }

    if (
        newX >= 0 && newX < mapCols &&
        newY >= 0 && newY < mapRows &&
        ![3, 4].includes(map[newY][newX])
    ) {
        player.x = newX;
        player.y = newY;
        player.animX = newX;
        player.animY = newY;
        updateViewport();
        drawMap();
        checkIfPlayerDied();
    }
}

function animatePlayerMovement(targetTileX, targetTileY) {
    if (moving) return;
    moving = true;
    const path = [];
    let cx = player.x;
    let cy = player.y;
    while (cx !== targetTileX || cy !== targetTileY) {
        if (cx < targetTileX) cx++;
        else if (cx > targetTileX) cx--;
        else if (cy < targetTileY) cy++;
        else if (cy > targetTileY) cy--;
        path.push({x: cx, y: cy});
    }
    let step = 0;
    function moveStep() {
        if (step >= path.length) {
            moving = false;
            checkIfPlayerDied();
            return;
        }
        const next = path[step];

        // Check if crossing water
        if (map[player.y][player.x] === 5 || map[next.y][next.x] === 5) {
            alert('You died');
            player.x = 6;
            player.y = 5;
            player.animX = 6;
            player.animY = 5;
            updateViewport();
            drawMap();
            moving = false;
            return;
        }

        player.x = next.x;
        player.y = next.y;
        player.animX = next.x;
        player.animY = next.y;
        updateViewport();
        drawMap();
        step++;
        setTimeout(moveStep, 120); 
    }
    moveStep();
}

function handleCanvasClick(e) {
    const rect = e.target.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoomFactor;
    const clickY = (e.clientY - rect.top) / zoomFactor;
    const tileX = Math.floor(clickX / tileSize);
    const tileY = Math.floor(clickY / tileSize);

    if (tileX >= 0 && tileX < mapCols && tileY >= 0 && tileY < mapRows &&
        ![3, 4].includes(map[tileY][tileX])) {
        animatePlayerMovement(tileX, tileY);
    }
}

function checkIfPlayerDied() {
    const currentTile = map[Math.floor(player.y)][Math.floor(player.x)];
    if (currentTile === 5) {
        alert('You died');
        player.x = 6;
        player.y = 5;
        updateViewport();
        drawMap();
    }
}

function GetQueryParams() {
    const params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (_, key, value) {
        params[key] = decodeURIComponent(value);
    });
    return params;
}

function loadTiles() {
    const totalTiles = Object.keys(tileSources).length;
    for (const [id, src] of Object.entries(tileSources)) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            tileImages[id] = img;
            tilesLoaded++;
            if (tilesLoaded === totalTiles) {
                drawMap();
            }
        };
        img.onerror = () => console.error(`Fehler beim Laden von Bild: ${src}`);
    }
}

if (controlType === 'wasd') {
    document.addEventListener('keydown', (e) => {
        if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
            e.preventDefault();
            switch (e.key.toLowerCase()) {
                case 'w': movePlayer(0, -1); break;
                case 'a': movePlayer(-1, 0); break;
                case 's': movePlayer(0, 1); break;
                case 'd': movePlayer(1, 0); break;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const mapPlaceholder = document.getElementById('mapPlaceholder');
    let playerElement = document.getElementById('character');
    if (!playerElement) {
        playerElement = document.createElement('div');
        playerElement.id = 'character';
        mapPlaceholder.appendChild(playerElement);
    }
    function updatePlayerElementPosition(x, y) {
        playerElement.style.transform = `translate(${x}px, ${y}px)`;
    }
    // Optional: Initial position setzen
    updatePlayerElementPosition(player.x * tileSize, player.y * tileSize);
});

loadTiles();
