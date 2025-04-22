
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

let player = { x: 10, y: 10 };
let target = null;
let moving = false;

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

  function drawName() {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.font = 'bold 14px sans-serif';
    ctx.lineWidth = 2;
    const px = player.x * tileSize + tileSize / 2;
    const py = player.y * tileSize + tileSize / 2;
    const textWidth = ctx.measureText(playerName).width;
    ctx.strokeText(playerName, px - textWidth / 2, py - tileSize / 2);
    ctx.fillText(playerName, px - textWidth / 2, py - tileSize / 2);
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoomFactor;
    const clickY = (e.clientY - rect.top) / zoomFactor;
    const tileX = Math.floor(clickX / tileSize);
    const tileY = Math.floor(clickY / tileSize);

    if (tileX >= 0 && tileX < mapCols && tileY >= 0 && tileY < mapRows) {
      target = { x: tileX, y: tileY };
      if (!moving) smoothMove();
    }
  });

  mapPlaceholder.innerHTML = '';
  mapPlaceholder.appendChild(canvas);

  updateViewport();
  drawName();
}

function updateViewport() {
  const canvas = mapPlaceholder.firstChild;
  if (!canvas) return;

  const offsetX = -(player.x * tileSize * zoomFactor - mapPlaceholder.clientWidth / 2 + tileSize / 2);
  const offsetY = -(player.y * tileSize * zoomFactor - mapPlaceholder.clientHeight / 2 + tileSize / 2);

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

  ctx.fillStyle = 'red';
  ctx.fillRect(player.x * tileSize * scaleX, player.y * tileSize * scaleY, tileSize * scaleX, tileSize * scaleY);

  minimapSection.appendChild(canvas);
}

function smoothMove() {
  if (!target) return;
  moving = true;

  if (player.x === target.x && player.y === target.y) {
    moving = false;
    return;
  }

  if (player.x < target.x) player.x++;
  else if (player.x > target.x) player.x--;

  else if (player.y < target.y) player.y++;
  else if (player.y > target.y) player.y--;

  updateViewport();
  drawMap();
  setTimeout(smoothMove, 100);
}


function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (newX >= 0 && newX < mapCols && newY >= 0 && newY < mapRows) {
    player.x = newX;
    player.y = newY;
    updateViewport();
    drawMap();
  }
}

function GetQueryParams() {
  const params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(_, key, value) {
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
    img.onerror = () => {
      console.error(`Fehler beim Laden von Bild: ${src}`);
    };
  }
}

loadTiles();
