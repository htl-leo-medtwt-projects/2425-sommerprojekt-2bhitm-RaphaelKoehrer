const tileSize = 64;
const zoomFactor = 1.35;
const mapCols = 20;
const mapRows = 20;

const tileSources = {
    1: 'img/grass1.png',
    2: 'img/grass2.png',
    3: 'img/Trees/tree1/tree1.png',
    4: 'img/Trees/tree2/tree2.png',
    5: 'img/water.png',
    6: 'img/waterGrassLeft.png',
    7: 'img/waterGrassRight.png',
    8: 'img/waterLandLeft.png',
    9: 'img/waterLandRight.png',
    31: 'img/Trees/tree1/tree1_2.png',
    32: 'img/Trees/tree1/tree1_3.png',
    33: 'img/Trees/tree1/tree1_4.png',
    41: 'img/Trees/tree2/tree2_2.png',
    42: 'img/Trees/tree2/tree2_3.png',
    43: 'img/Trees/tree2/tree2_4.png'
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
  [1,1,2,2,1,1,1,1,6,8,5,9,7,1,1,2,1,1,1,1],
  [1,1,2,2,2,2,2,1,6,8,5,9,7,1,2,2,1,1,1,2],
  [1,1,1,1,1,2,1,1,6,8,5,9,7,2,2,1,1,2,1,1],
  [1,1,2,1,1,2,2,1,6,8,5,9,7,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,6,8,5,9,7,1,1,1,1,1,1,1],
  [1,1,1,1,1,2,2,1,6,8,5,9,7,1,1,1,2,2,1,1],
  [1,1,1,1,1,1,1,1,6,8,5,9,7,1,1,1,1,1,1,1],
  [1,2,1,1,1,1,1,1,6,8,5,9,7,1,1,2,2,1,1,1],
  [1,1,1,1,1,1,1,1,6,8,5,9,7,1,1,1,1,1,1,1],
  [2,2,1,2,1,2,1,2,6,8,5,9,7,2,2,1,1,2,1,2],
  [4,4,3,3,4,3,3,3,6,8,5,9,7,4,3,4,3,3,3,4],
  [3,3,3,4,4,4,4,3,6,8,5,9,7,3,3,4,4,3,4,4],
  [3,3,3,3,4,4,4,3,6,8,5,9,7,4,4,3,3,4,3,3],
  [4,3,3,3,4,4,3,4,6,8,5,9,7,4,4,3,3,3,4,3],
];

let player = { x: 5, y: 7, animX: 5, animY: 7 };
let target = null;
let moving = false;
let animationFrame;
let isChoppingTree = false; 

const mapPlaceholder = document.getElementById('mapPlaceholder');
const minimapSection = document.getElementById('minimapSection');

const resourceBar = document.createElement('div');
resourceBar.id = 'resourceBar';
resourceBar.style.display = 'flex';
resourceBar.style.justifyContent = 'space-between';
resourceBar.innerHTML = `
    <div id="goldDisplay"><img src="./img/gold.png" alt="Gold"> <span id="goldValue">1000</span></div>
    <div id="woodDisplay"><img src="./img/treePreview.png" alt="Holz"> <span id="woodValue">250</span></div>
    <div id="buildingDisplay"><img src="./img/buildingPreview.png" alt="Gebäude"> <span id="buildingValue">1</span>/<span id="buildingGoal">-</span></div>
`;

const gameWrapper = document.getElementById('gameWrapper');
gameWrapper.parentNode.insertBefore(resourceBar, gameWrapper);

let gold = 1000;
let wood = 250;
let buildings = 1;
let buildingGoal = parseInt(params.goal) || 5;

document.getElementById('goldValue').textContent = gold;
document.getElementById('woodValue').textContent = wood;
document.getElementById('buildingValue').textContent = buildings;
document.getElementById('buildingGoal').textContent = buildingGoal;

function updateResourceBar() {
    document.getElementById('goldValue').textContent = gold;
    document.getElementById('woodValue').textContent = wood;
    document.getElementById('buildingValue').textContent = buildings;
    document.getElementById('buildingGoal').textContent = buildingGoal;
}

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

    ctx.fillStyle = params.team?.toLowerCase() === 'human' ? 'blue' : 'green';
    ctx.beginPath();
    ctx.arc(player.x * tileSize * scaleX + (tileSize * scaleX) / 2, player.y * tileSize * scaleY + (tileSize * scaleY) / 2, 7, 0, Math.PI * 2);
    ctx.fill();

    minimapSection.appendChild(canvas);
}

function movePlayer(dx, dy) {
    if (isChoppingTree) {
        showTreeMessage("You're already chopping a tree!");
        return;
    }

    player.x = Math.round(player.x);
    player.y = Math.round(player.y);

    const newX = player.x + dx;
    const newY = player.y + dy;

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
    if (moving || isChoppingTree) {
        if (isChoppingTree) showTreeMessage("You're already chopping a tree!");
        return;
    }
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

    const tileId = map[tileY]?.[tileX];
    if (tileId === 3 || tileId === 4) {
        highlightTreeTile(tileX, tileY);
        chopTree(tileX, tileY, tileId);
    } else if (tileX >= 0 && tileX < mapCols && tileY >= 0 && tileY < mapRows) {
        animatePlayerMovement(tileX, tileY);
    }
}

function highlightTreeTile(tileX, tileY) {
    const canvas = mapPlaceholder.firstChild;
    const ctx = canvas.getContext('2d');
    const x = tileX * tileSize;
    const y = tileY * tileSize;

    ctx.strokeStyle = 'lightgreen';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, tileSize, tileSize);
}

function handleCanvasRightClick(e) {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoomFactor;
    const clickY = (e.clientY - rect.top) / zoomFactor;
    const tileX = Math.floor(clickX / tileSize);
    const tileY = Math.floor(clickY / tileSize);

    const tileId = map[tileY]?.[tileX];
    if (tileId === 3 || tileId === 4) {
        const adjacentGrassTile = findAdjacentGrassTile(tileX, tileY);
        if (adjacentGrassTile) {
            const { x: targetX, y: targetY } = adjacentGrassTile;
            const isAdjacent =
                Math.abs(player.x - targetX) + Math.abs(player.y - targetY) === 0;

            if (isAdjacent) {
                chopTree(tileX, tileY, tileId);
            } else {
                animatePlayerMovement(targetX, targetY);
                setTimeout(() => {
                    if (
                        Math.abs(player.x - targetX) + Math.abs(player.y - targetY) === 0 &&
                        map[tileY]?.[tileX] === tileId
                    ) {
                        chopTree(tileX, tileY, tileId);
                    }
                }, 500); 
            }
        }
    }
}

function findAdjacentGrassTile(treeX, treeY) {
    const directions = [
        { dx: 0, dy: -1 }, 
        { dx: 0, dy: 1 },  
        { dx: -1, dy: 0 }, 
        { dx: 1, dy: 0 }  
    ];

    for (const { dx, dy } of directions) {
        const adjacentX = treeX + dx;
        const adjacentY = treeY + dy;
        if (map[adjacentY]?.[adjacentX] === 1 || map[adjacentY]?.[adjacentX] === 2) {
            return { x: adjacentX, y: adjacentY };
        }
    }
    return null;
}

function showTreeMessage(message) {
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.style.position = 'absolute';
    msg.style.left = `${player.x * tileSize + tileSize / 2}px`;
    msg.style.top = `${player.y * tileSize - tileSize / 2}px`;
    msg.style.color = 'white';
    msg.style.fontSize = '20px'; 
    msg.style.letterSpacing = '2px'; 
    msg.style.fontWeight = 'bold';
    msg.style.textShadow = '1px 1px 2px black';
    msg.style.transition = 'transform 2s, opacity 2s';
    msg.style.transform = 'translateY(0)';
    msg.style.opacity = '1';
    mapPlaceholder.appendChild(msg);

    setTimeout(() => {
        msg.style.transform = 'translateY(-50px)';
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 2000);
    }, 0);
}

function chopTree(tileX, tileY, tileId) {
    if (isChoppingTree) {
        showTreeMessage("You're already chopping a tree!");
        return;
    }

    isChoppingTree = true;
    const isTree1 = tileId === 3;
    const animationFrames = isTree1 ? [31, 32, 33] : [41, 42, 43];
    let currentFrame = 0;

    const animateChop = () => {
        if (currentFrame < animationFrames.length) {
            map[tileY][tileX] = animationFrames[currentFrame];
            drawMap();
            currentFrame++;
            setTimeout(animateChop, 2500);
        } else {
            map[tileY][tileX] = Math.random() < 0.5 ? 1 : 2;
            wood += 50;
            updateResourceBar();
            drawMap();
            isChoppingTree = false;
        }
    };

    animateChop();
}

document.addEventListener('contextmenu', handleCanvasRightClick);

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
        if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase()) && isChoppingTree) {
            showTreeMessage("You're already chopping a tree!");
            return;
        }
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

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'g') {
        if (isChoppingTree) {
            showTreeMessage("You're currently chopping a tree!");
            return;
        }
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];

        for (const { dx, dy } of directions) {
            const targetX = player.x + dx;
            const targetY = player.y + dy;

            const tileId = map[targetY]?.[targetX];
            if (tileId === 3 || tileId === 4) {
                chopTree(targetX, targetY, tileId);
                break;
            }
        }
    }
});

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
    updatePlayerElementPosition(player.x * tileSize, player.y * tileSize);
});

loadTiles();
