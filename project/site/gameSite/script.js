// Ressourcen-Variablen und Initialisierung
let gold = 1000;
let wood = 250;
let totalTiles = 0;

window.gold = gold;
window.wood = wood;

// Ressourcenanzeige-Update Loop
setInterval(() => {
    if (typeof window.gold !== 'undefined' && typeof window.wood !== 'undefined') {
        gold = window.gold;
        wood = window.wood;
        if (typeof updateResourceBar === 'function') updateResourceBar();
    }
    if (typeof window.buildings !== 'undefined') {
        const buildingValueSpan = document.getElementById('buildingValue');
        if (buildingValueSpan) {
            buildingValueSpan.innerHTML = window.buildings;
        }
    }
}, 200);

// --- Starthilfe Overlay ---
let helpOverlay = document.getElementById('helpOverlay');
if (!helpOverlay) {
    helpOverlay = document.createElement('div');
    helpOverlay.id = 'helpOverlay';
    helpOverlay.style.position = 'absolute';
    helpOverlay.style.top = '100px';
    helpOverlay.style.left = '50%';
    helpOverlay.style.transform = 'translateX(-50%)';
    helpOverlay.style.background = 'rgba(0,0,0,0.45)';
    helpOverlay.style.color = 'white';
    helpOverlay.style.fontSize = '2rem';
    helpOverlay.style.padding = '12px 32px';
    helpOverlay.style.borderRadius = '12px';
    helpOverlay.style.zIndex = '3001';
    helpOverlay.style.textAlign = 'center';
    helpOverlay.style.pointerEvents = 'none';
    helpOverlay.style.fontFamily = 'custom, Arial, sans-serif';
    helpOverlay.textContent = 'Build a Bridge so you can get to the Goldmine!';
    helpOverlay.style.display = 'none'; 
    document.body.appendChild(helpOverlay);
} else {
    helpOverlay.style.display = 'none'; 
}

let missionDisplay = document.getElementById('missionDisplay');
if (missionDisplay) {
    missionDisplay.style.display = 'none';
}

window.addEventListener('DOMContentLoaded', () => {
    let missionDisplay = document.getElementById('missionDisplay');
    if (missionDisplay) missionDisplay.style.display = 'none';
});
function setHelpOverlay(text, duration) {
    helpOverlay.textContent = text;
    helpOverlay.style.display = 'block';
    if (duration) {
        setTimeout(() => {
            helpOverlay.style.display = 'none';
        }, duration);
    }
}

// Spielstart und Map-Initialisierung
function StartGame() {
    const params = GetQueryParams();
    console.log("StartGame params:", params);

    const mapPlaceholder = document.getElementById('mapPlaceholder');
    const minimapSection = document.getElementById('minimapSection');

    const tileImages = {};

    delStart();

    window.isMoving = false;
    if (window.isMoving === false) {
        
    }
    function playWorkSound() {
        if (params.team == "human")  {
            humanWorkSound();
            console.log("human work sound played");
        } else if (params.team == "orc") {
            orcWorkSound();
            console.log("orc work sound played");
        }
    }
    playWorkSound();
    startMusicOnce();

    const tileSize = 64;
    const zoomFactor = 1.75;
    const mapCols = 20;
    const mapRows = 20;

    let tileSources;
    let map;
    window.map = null; 

    // Map-Definitionen und TileSources
    if (params.map == "map2") {
        tileSources = {
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
            43: 'img/Trees/tree2/tree2_4.png',
            221: 'img/swamp/Bridge/BridgeLeft.png',
            222: 'img/swamp/Bridge/BridgeMiddle.png',
            223: 'img/swamp/Bridge/BridgeRight.png',
            500: 'img/Farm.png',
            501: 'img/Tower.png',
            502: 'img/Lumbermill.png',
            503: 'img/Refinery.png',
            504: 'img/Goldmine.png',
            999: 'img/mine.png',
            1000: './img/build/bridge.png',
        };
        
        loadTiles();
        map = [
            [3, 3, 3, 3, 4, 4, 4, 3, 6, 8, 5, 9, 7, 4, 4, 3, 3, 4, 3, 3],
            [4, 3, 3, 3, 4, 4, 3, 4, 6, 8, 5, 9, 7, 4, 4, 3, 3, 3, 4, 3],
            [3, 4, 4, 3, 3, 4, 3, 3, 6, 8, 5, 9, 7, 1, 3, 4, 3, 3, 4, 4],
            [4, 4, 3, 3, 4, 3, 3, 3, 6, 8, 5, 9, 7, 1, 2, 4, 3, 3, 3, 4],
            [3, 4, 3, 4, 4, 3, 1, 1, 6, 8, 5, 9, 7, 2, 1, 1, 3, 4, 4, 3],
            [4, 4, 3, 2, 2, 1, 1, 2, 6, 8, 5, 9, 7, 2, 2, 1, 1, 4, 3, 4],
            [4, 3, 2, 2, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 2, 1, 1, 3, 4],
            [3, 1, 2, 2, 2, 2, 2, 1, 6, 8, 5, 9, 7, 1, 2, 2, 1, 1, 1, 2],
            [1, 1, 1, 1, 1, 2, 1, 1, 6, 8, 5, 9, 7, 2, 2, 1, 1, 2, 1, 1],
            [1, 1, 2, 1, 1, 2, 2, 1, 6, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 2, 1, 6, 8, 5, 9, 7, 1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [3, 3, 1, 1, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 2, 2, 1, 1, 1],
            [3, 4, 4, 4, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [3, 4, 4, 4, 4, 3, 2, 2, 6, 8, 5, 9, 7, 2, 2, 1, 1, 2, 1, 2],
            [4, 4, 3, 3, 4, 3, 1, 2, 6, 8, 5, 9, 7, 2, 2, 1, 1, 1, 3, 4],
            [2, 2, 3, 4, 4, 1, 1, 2, 6, 8, 5, 9, 7, 1, 1, 1, 4, 3, 4, 4],
            [1, 2, 1, 1, 2, 2, 1, 2, 6, 8, 5, 9, 7, 1, 2, 3, 3, 4, 3, 3],
            [2, 1, 1, 1, 2, 1, 1, 2, 6, 8, 5, 9, 7, 4, 4, 3, 3, 3, 4, 3],
        ];
        window.map = map;
        window.originalMap = JSON.parse(JSON.stringify(map));
    } else if (params.map == "map1") {
        if (params.map == "map1") {
            tileSources = { 1: 'img/winter/Grass/grass1.png', 
                2: 'img/winter/Grass/grass2.png',
                3: 'img/winter/Trees/tree1/tree1.png', 
                4: 'img/winter/Trees/tree2/tree2.png', 
                5: 'img/winter/Water/water.png', 
                6: 'img/winter/Grass/grass1.png', 
                7: 'img/winter/Grass/grass1.png', 
                8: 'img/winter/Water/waterGrassLeft.png', 
                9: 'img/winter/Water/waterGrassRight.png', 
                31: 'img/winter/Trees/tree1/tree1_2.png', 
                32: 'img/winter/Trees/tree1/tree1_3.png', 
                33: 'img/winter/Trees/tree1/tree1_4.png', 
                41: 'img/winter/Trees/tree2/tree2_2.png', 
                42: 'img/winter/Trees/tree2/tree2_3.png', 
                43: 'img/winter/Trees/tree2/tree2_4.png',
                100: 'img/winter/Water/waterGrassLeft2.png',
                101: 'img/winter/Water/waterGrassRight2.png',
                221: 'img/winter/Bridge/BridgeLeft.png',
                222: 'img/winter/Bridge/BridgeMiddle.png',
                223: 'img/winter/Bridge/BridgeRight.png',
                500: 'img/winter/Farm/Farm.png',
                501: 'img/winter/Tower/Tower.png',
                502: 'img/winter/Lumbermill/Lumbermill.png',
                503: 'img/winter/Refinery/Refinery.png',
                504: 'img/winter/Goldmine/Goldmine.png',
                999: 'img/mine_winter.png',
                1000: './img/build/bridge.png',
        };
        }
        
        loadTiles();
        map = [ 
            [3, 3, 3, 3, 4, 4, 4, 3, 6, 8, 5, 9, 7, 4, 4, 3, 3, 4, 3, 3],
            [4, 3, 3, 3, 4, 4, 3, 4, 6, 100, 5, 101, 7, 4, 4, 3, 3, 3, 4, 3],
            [3, 4, 4, 3, 3, 4, 3, 3, 6, 8, 5, 9, 7, 1, 3, 4, 3, 3, 4, 4],
            [4, 4, 3, 3, 4, 3, 3, 3, 6, 100, 5, 101, 7, 1, 2, 4, 3, 3, 3, 4],
            [3, 4, 3, 4, 4, 3, 1, 1, 6, 8, 5, 9, 7, 2, 1, 1, 3, 4, 4, 2],
            [4, 4, 3, 2, 2, 1, 1, 2, 6, 100, 5, 101, 7, 2, 2, 1, 1, 4, 3, 4],
            [4, 3, 2, 2, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 2, 1, 1, 3, 4],
            [3, 1, 2, 2, 2, 2, 2, 1, 6, 100, 5, 101, 7, 1, 2, 2, 1, 1, 1, 2],
            [1, 1, 1, 1, 1, 2, 1, 1, 6, 8, 5, 9, 7, 2, 2, 1, 1, 2, 1, 1],
            [1, 1, 2, 1, 1, 2, 2, 1, 6, 100, 5, 101, 7, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 2, 1, 6, 100, 5, 101, 7, 1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [3, 3, 1, 1, 1, 1, 1, 1, 6, 100, 5, 101, 7, 1, 1, 2, 2, 1, 1, 1],
            [3, 4, 4, 4, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [3, 4, 4, 4, 4, 3, 2, 2, 6, 100, 5, 101, 7, 2, 2, 1, 1, 2, 1, 2],
            [4, 4, 3, 3, 4, 3, 1, 2, 6, 8, 5, 9, 7, 2, 2, 1, 1, 1, 3, 4],
            [2, 2, 3, 4, 4, 1, 1, 2, 6, 100, 5, 101, 7, 1, 1, 1, 4, 3, 4, 4],
            [1, 2, 1, 1, 2, 2, 1, 2, 6, 8, 5, 9, 7, 1, 2, 3, 3, 4, 3, 3],
            [2, 1, 1, 1, 2, 1, 1, 2, 6, 100, 5, 101, 7, 4, 4, 3, 3, 3, 4, 3],
        ];
        window.map = map;
        window.originalMap = JSON.parse(JSON.stringify(map));
    }else if (params.map == "map3") {
        if (params.map == "map3") {
            tileSources = { 1: 'img/swamp/Grass/grass.png', 
                2: 'img/swamp/Grass/grass2.png',
                3: 'img/swamp/Trees/tree1/tree1.png', 
                4: 'img/swamp/Trees/tree2/tree2.png', 
                5: 'img/swamp/Water/water.png', 
                6: 'img/swamp/Grass/grass2.png', 
                7: 'img/swamp/Grass/grass.png', 
                8: 'img/swamp/Water/waterLeft.png', 
                9: 'img/swamp/Water/waterRight.png', 
                31: 'img/swamp/Trees/tree1/tree1_2.png', 
                32: 'img/swamp/Trees/tree1/tree1_3.png', 
                33: 'img/swamp/Trees/tree1/tree1_4.png', 
                41: 'img/swamp/Trees/tree2/tree2_2.png', 
                42: 'img/swamp/Trees/tree2/tree2_3.png', 
                43: 'img/swamp/Trees/tree2/tree2_4.png',
                100: 'img/winter/Water/waterGrassLeft2.png',
                101: 'img/winter/Water/waterGrassRight2.png',
                221: 'img/swamp/Bridge/BridgeLeft.png',
                222: 'img/swamp/Bridge/BridgeMiddle.png',
                223: 'img/swamp/Bridge/BridgeRight.png',
                500: 'img/swamp/Farm/Farm.png',
                501: 'img/swamp/Tower/Tower.png',
                502: 'img/swamp/Lumbermill/Lumbermill.png',
                503: 'img/swamp/Refinery/Refinery.png',
                504: 'img/swamp/Goldmine/Goldmine.png',
                999: 'img/mine.png',
                1000: './img/build/bridge.png',
        };
        }
        
        loadTiles();
        map = [ 
            [3, 3, 3, 3, 4, 4, 4, 3, 1, 8, 5, 9, 7, 4, 4, 3, 3, 4, 3, 3],
            [4, 3, 3, 3, 4, 4, 3, 4, 1, 8, 5, 9, 7, 4, 4, 3, 3, 3, 4, 3],
            [3, 4, 4, 3, 3, 4, 3, 3, 1, 8, 5, 9, 7, 1, 3, 4, 3, 3, 4, 4],
            [4, 4, 3, 3, 4, 3, 3, 3, 1, 8, 5, 9, 7, 1, 2, 4, 3, 3, 3, 4],
            [3, 4, 3, 4, 4, 3, 1, 1, 1, 8, 5, 9, 7, 2, 1, 1, 3, 4, 4, 2],
            [4, 4, 3, 2, 2, 1, 1, 2, 1, 8, 5, 9, 7, 2, 2, 1, 1, 4, 3, 4],
            [4, 3, 2, 2, 1, 1, 1, 1, 1, 8, 5, 9, 7, 1, 1, 2, 1, 1, 3, 4],
            [3, 1, 2, 2, 2, 2, 2, 1, 1, 8, 5, 9, 7, 1, 2, 2, 1, 1, 1, 2],
            [1, 1, 1, 1, 1, 2, 1, 1, 1, 8, 5, 9, 7, 2, 2, 1, 1, 2, 1, 1],
            [1, 1, 2, 1, 1, 2, 2, 1, 1, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 2, 1, 1, 8, 5, 9, 7, 1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [3, 3, 1, 1, 1, 1, 1, 1, 1, 8, 5, 9, 7, 1, 1, 2, 2, 1, 1, 1],
            [3, 4, 4, 4, 1, 1, 1, 1, 1, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [3, 4, 4, 4, 4, 3, 2, 2, 1, 8, 5, 9, 7, 2, 2, 1, 1, 2, 1, 2],
            [4, 4, 3, 3, 4, 3, 1, 2, 1, 8, 5, 9, 7, 2, 2, 1, 1, 1, 3, 4],
            [2, 2, 3, 4, 4, 1, 1, 2, 1, 8, 5, 9, 7, 1, 1, 1, 4, 3, 4, 4],
            [1, 2, 1, 1, 2, 2, 1, 2, 1, 8, 5, 9, 7, 1, 2, 3, 3, 4, 3, 3],
            [2, 1, 1, 1, 2, 1, 1, 2, 1, 8, 5, 9, 7, 4, 4, 3, 3, 3, 4, 3],
        ];
        window.map = map;
        window.originalMap = JSON.parse(JSON.stringify(map));
    }else {
        console.log("map1!");
        tileSources = {
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
            43: 'img/Trees/tree2/tree2_4.png',
            221: 'img/Default/Bridge/BridgeLeft.png',
            222: 'img/Default/Bridge/BridgeMiddle.png',
            223: 'img/Default/Bridge/BridgeRight.png',
            500: 'img/Farm.png',
            501: 'img/Tower.png',
            502: 'img/Lumbermill.png',
            503: 'img/Refinery.png',
            504: 'img/Goldmine.png',
            999: 'img/mine.png',
            1000: './img/build/bridge.png',
        };
        
        loadTiles();
        map = [
            [3, 3, 3, 3, 4, 4, 4, 3, 6, 8, 5, 9, 7, 4, 4, 3, 3, 4, 3, 3],
            [4, 3, 3, 3, 4, 4, 3, 4, 6, 8, 5, 9, 7, 4, 4, 3, 3, 3, 4, 3],
            [3, 4, 4, 3, 3, 4, 3, 3, 6, 8, 5, 9, 7, 1, 3, 4, 3, 3, 4, 4],
            [4, 4, 3, 3, 4, 3, 3, 3, 6, 8, 5, 9, 7, 1, 2, 4, 3, 3, 3, 4],
            [3, 4, 3, 4, 4, 3, 1, 1, 6, 8, 5, 9, 7, 2, 1, 1, 3, 4, 4, 3],
            [4, 4, 3, 2, 2, 1, 1, 2, 6, 8, 5, 9, 7, 2, 2, 1, 1, 4, 3, 4],
            [4, 3, 2, 2, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 2, 1, 1, 3, 4],
            [3, 1, 2, 2, 2, 2, 2, 1, 6, 8, 5, 9, 7, 1, 2, 2, 1, 1, 1, 2],
            [1, 1, 1, 1, 1, 2, 1, 1, 6, 8, 5, 9, 7, 2, 2, 1, 1, 2, 1, 1],
            [1, 1, 2, 1, 1, 2, 2, 1, 6, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 2, 1, 6, 8, 5, 9, 7, 1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [3, 3, 1, 1, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 2, 2, 1, 1, 1],
            [3, 4, 4, 4, 1, 1, 1, 1, 6, 8, 5, 9, 7, 1, 1, 1, 1, 1, 1, 1],
            [3, 4, 4, 4, 4, 3, 2, 2, 6, 8, 5, 9, 7, 2, 2, 1, 1, 2, 1, 2],
            [4, 4, 3, 3, 4, 3, 1, 2, 6, 8, 5, 9, 7, 2, 2, 1, 1, 1, 3, 4],
            [2, 2, 3, 4, 4, 1, 1, 2, 6, 8, 5, 9, 7, 1, 1, 1, 4, 3, 4, 4],
            [1, 2, 1, 1, 2, 2, 1, 2, 6, 8, 5, 9, 7, 1, 2, 3, 3, 4, 3, 3],
            [2, 1, 1, 1, 2, 1, 1, 2, 6, 8, 5, 9, 7, 4, 4, 3, 3, 3, 4, 3],
        ];
        window.map = map;
        window.originalMap = JSON.parse(JSON.stringify(map));
    }

    // --- Hook in Bridge bauen und Goldmine finden ---
    // Brückenbau-Überwachung
    let bridgeBuilt = false;
    let goldmineFound = false;
    // Patch placeBridgeRandomly, falls vorhanden
    if (typeof window.placeBridgeRandomly === 'function') {
        const origPlaceBridgeRandomly = window.placeBridgeRandomly;
        window.placeBridgeRandomly = function() {
            const beforeBridge = window.missionProgress && window.missionProgress.bridge || 0;
            origPlaceBridgeRandomly();
            const afterBridge = window.missionProgress && window.missionProgress.bridge || 0;
            if (!bridgeBuilt && afterBridge > beforeBridge) {
                bridgeBuilt = true;
                setHelpOverlay('Run to the Goldmine and press Right Click!');
            }
        }
    }
    // Fallback: Überwache missionProgress.bridge im Ressourcen-Update
    const origUpdateResourceBar = window.updateResourceBar;
    window.updateResourceBar = function() {
        if (origUpdateResourceBar) origUpdateResourceBar();
        if (!bridgeBuilt && window.missionProgress && window.missionProgress.bridge > 0) {
            bridgeBuilt = true;
            setHelpOverlay('Run to the Goldmine and press Right Click!');
        }
    }
    // Goldmine finden überwachen
    const origShowGoldmineMessage = window.showGoldmineMessage;
    window.showGoldmineMessage = function(tileX, tileY) {
        if (origShowGoldmineMessage) origShowGoldmineMessage(tileX, tileY);
        if (!goldmineFound) {
            goldmineFound = true;
            setHelpOverlay('Congratulations, you have found the goldmine!', 5000);
        }
    }

    // Baum fällen Funktion (muss im Scope von StartGame sein!)
    function showTreeMessage(message) {
        const msg = document.createElement('div');
        msg.textContent = message;
        msg.style.position = 'absolute';
        msg.style.left = `${player.x * tileSize + tileSize / 2}px`;
        msg.style.top = `${player.y * tileSize - tileSize / 2}px`;
        msg.style.color = 'darkgray';
        msg.style.fontSize = '32px'; 
        msg.style.letterSpacing = '2px';
        msg.style.fontWeight = 'bold';
        msg.style.textShadow = '1px 1px 2px black';
        msg.style.transition = 'transform 2.5s, opacity 2.5s'; 
        msg.style.transform = 'translateY(0)';
        msg.style.opacity = '1';
        mapPlaceholder.appendChild(msg);
        setTimeout(() => {
            msg.style.transform = 'translateY(-60px)';
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 2500);
        }, 0);
    }
    function chopTree(tileX, tileY, tileId) {
        if (isChoppingTree) return;
        isChoppingTree = true;
        showTreeMessage('Chopping tree...');
        let animSteps;
        if (tileId === 3) {
            animSteps = [31, 32, 33];
        } else if (tileId === 4) {
            animSteps = [41, 42, 43];
        } else {
            isChoppingTree = false;
            return;
        }
        let step = 0;
        let totalDuration = (window.hasRefinery ? 4000 : 5000);
        let frameDuration = Math.floor(totalDuration / animSteps.length);
        function animateStep() {
            if (step < animSteps.length) {
                map[tileY][tileX] = animSteps[step];
                if (typeof drawMap === 'function') drawMap();
                step++;
                setTimeout(animateStep, frameDuration);
            } else {
                const newTile = Math.random() < 0.5 ? 1 : 2;
                map[tileY][tileX] = newTile;
                let woodGain = window.missionProgress && window.missionProgress.lumbermill > 0 ? 75 : 50;
                wood += woodGain;
                window.wood = wood;
                if (typeof updateResourceBar === 'function') updateResourceBar();
                if (typeof drawMap === 'function') drawMap();
                isChoppingTree = false;
            }
        }
        animateStep();
    }

    let timerInterval;
    let timeLeft = 0;
    // Zeitlimit aus params.timeLimit statt params.time auslesen
    if (params.timeLimit) {
        const timeMatch = params.timeLimit.match(/^(\d+)/);
        if (timeMatch) {
            timeLeft = parseInt(timeMatch[1]) * 60;
        } else {
            timeLeft = 0;
        }
    }

    let timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) {
        timerDisplay = document.createElement('div');
        timerDisplay.id = 'timerDisplay';
        timerDisplay.style.fontSize = '2rem';
        timerDisplay.style.color = 'white';
        timerDisplay.style.textAlign = 'center';
        timerDisplay.style.margin = '10px 0 0 0';
        const mapContainer = document.getElementById('mapContainer');
        mapContainer.parentNode.insertBefore(timerDisplay, mapContainer.nextSibling);
    }
    function updateTimerDisplay() {
        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;
        timerDisplay.textContent = `Verbleibende Zeit: ${min}:${sec.toString().padStart(2, '0')}`;
    }
    if (timeLeft > 0) {
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if (window.buildings < window.buildingGoal) {
                    showGameOverScreen();
                }
            }
        }, 1000);
    } else {
        timerDisplay.textContent = "Verbleibende Zeit: 0:00";
    }

    // Tile-Image-Preloading
    let tilesLoaded = 0;
    let orcSpritesLoaded = 0;
    let humanSpritesLoaded = 0;

    function checkAllSpritesLoaded() {
        if (orcSpritesLoaded === 2 && humanSpritesLoaded === 2 && tilesLoaded === totalTiles) {
            drawMap();
        }
    }

    if (!window.orcStandSprite) {
        window.orcStandSprite = new Image();
        window.orcStandSprite.onload = function() {
            orcSpritesLoaded++;
            checkAllSpritesLoaded();
        };
        window.orcStandSprite.src = './orc/Stand.png';
    } else {
        orcSpritesLoaded++;
    }

    if (!window.orcRunSprite) {
        window.orcRunSprite = new Image();
        window.orcRunSprite.onload = function() {
            orcSpritesLoaded++;
            checkAllSpritesLoaded();
        };
        window.orcRunSprite.src = './orc/Run.png';
    } else {
        orcSpritesLoaded++;
    }

    if (!window.humanStandSprite) {
        window.humanStandSprite = new Image();
        window.humanStandSprite.onload = function() {
            humanSpritesLoaded++;
            checkAllSpritesLoaded();
        };
        window.humanStandSprite.src = './human/Stand.png';
    }

    if (!window.humanRunSprite) {
        window.humanRunSprite = new Image();
        window.humanRunSprite.onload = function() {
            humanSpritesLoaded++;
            checkAllSpritesLoaded();
        };
        window.humanRunSprite.src = './human/Run.png';
    }

    // Player-Setup
    const playerName = params.username;
    const controlType = (params.control || 'wasd').toLowerCase();

    let player = { x: 5, y: 7, animX: 5, animY: 7 };
    let target = null;
    let moving = false;
    let animationFrame;
    let isChoppingTree = false;

    // Ressourcenbar-Setup
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

    // Buildings- und Goal-Setup
    let buildings = 1;
    let buildingGoal = parseInt(params.goal) || 5;
    window.buildings = buildings;
    window.buildingGoal = buildingGoal;
    // Mission-Progress ggf. überschreiben
    if (params.mission === 'mission1') {
        window.buildingGoal = 5; // 3 Farmen + 2 Brücken
    } else if (params.mission === 'mission2') {
        window.buildingGoal = 6; // 5 Farmen + 1 Brücke
    }

    document.getElementById('goldValue').textContent = gold;
    document.getElementById('woodValue').textContent = wood;
    document.getElementById('buildingValue').textContent = buildings;
    document.getElementById('buildingGoal').textContent = buildingGoal;

    // Ressourcenbar-Update Funktion
    function updateResourceBar() {
        document.getElementById('goldValue').textContent = gold;
        document.getElementById('woodValue').textContent = wood;
        document.getElementById('buildingValue').textContent = buildings;
        document.getElementById('buildingGoal').textContent = buildingGoal;
    }
    window.updateResourceBar = updateResourceBar;

    // Map-Zeichnen
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

        if (params.team?.toLowerCase() === 'human') {
            const px = player.animX * tileSize + tileSize / 2;
            const py = player.animY * tileSize + tileSize / 2;
            const textWidth = ctx.measureText(playerName).width;

            if (!window.humanRunSprite) {
                window.humanRunSprite = new Image();
                window.humanRunSprite.src = './human/Run.png';
            }
            if (!window.humanStandSprite) {
                window.humanStandSprite = new Image();
                window.humanStandSprite.src = './human/Stand.png';
            }
            if (!window.humanFrame) window.humanFrame = 0;
            if (!window.humanFrameCount) window.humanFrameCount = 8;
            if (!window.humanRunFrameWidth) window.humanRunFrameWidth = 224; 
            if (!window.humanRunFrameHeight) window.humanRunFrameHeight = 152;
            if (!window.humanStandFrameWidth) window.humanStandFrameWidth = 160;
            if (!window.humanStandFrameHeight) window.humanStandFrameHeight = 160;
            if (!window.humanFrameInterval) window.humanFrameInterval = 75; 
            if (!window.humanFacingLeft) window.humanFacingLeft = false;
            if (typeof window.isMoving === 'undefined') window.isMoving = false;

            const now = Date.now();
            if (!window.humanLastFrameTime) window.humanLastFrameTime = now;
            if (now - window.humanLastFrameTime > window.humanFrameInterval) {
                window.humanFrame = (window.humanFrame + 1) % window.humanFrameCount;
                window.humanLastFrameTime = now;
            }

            const scale = 0.5;
            const drawX = player.animX * tileSize + tileSize / 2 - (window.humanStandFrameWidth * scale) / 2;
            const drawY = player.animY * tileSize + tileSize / 2 - (window.humanStandFrameHeight * scale) / 2;

            ctx.save();
            if (window.humanFacingLeft) {
                ctx.translate(drawX + (window.humanStandFrameWidth * scale) / 2, 0);
                ctx.scale(-1, 1);
                ctx.translate(-(drawX + (window.humanStandFrameWidth * scale) / 2), 0);
            }

            if (!window.humanInitialStandDrawn) {
                ctx.drawImage(window.humanStandSprite, 0, 0, window.humanStandFrameWidth, window.humanStandFrameHeight, drawX, drawY, window.humanStandFrameWidth * scale, window.humanStandFrameHeight * scale);
                window.humanInitialStandDrawn = true;
            } else {
                const frameX = window.humanFrame * window.humanRunFrameWidth;
                ctx.drawImage(window.humanRunSprite, frameX, 0, window.humanRunFrameWidth, window.humanRunFrameHeight, drawX, drawY, window.humanRunFrameWidth * scale, window.humanRunFrameHeight * scale);
            }

            ctx.restore();

            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.font = 'bold 14px sans-serif';
            ctx.lineWidth = 2;
            ctx.strokeText(playerName, drawX + (window.humanFrameWidth * scale) / 2 - textWidth / 2, drawY - 10);
            ctx.fillText(playerName, drawX + (window.humanFrameWidth * scale) / 2 - textWidth / 2, drawY - 10);
        } else {

            if (!window.orcRunSprite) {
                window.orcRunSprite = new Image();
                window.orcRunSprite.src = './orc/Run.png';
            }
            if (!window.orcStandSprite) {
                window.orcStandSprite = new Image();
                window.orcStandSprite.src = './orc/Stand.png';
            }
            if (!window.orcFrame) window.orcFrame = 0;
            if (!window.orcFrameCount) window.orcFrameCount = 6;
            if (!window.orcFrameWidth) window.orcFrameWidth = 96; 
            if (!window.orcFrameHeight) window.orcFrameHeight = 96;
            if (!window.orcFrameInterval) window.orcFrameInterval = 75; 
            if (!window.orcFacingLeft) window.orcFacingLeft = false;
            if (typeof window.isMoving === 'undefined') window.isMoving = false;

            const now = Date.now();
            if (!window.orcLastFrameTime) window.orcLastFrameTime = now;
            if (now - window.orcLastFrameTime > window.orcFrameInterval) {
                window.orcFrame = (window.orcFrame + 1) % window.orcFrameCount;
                window.orcLastFrameTime = now;
            }

            const drawX = player.animX * tileSize + tileSize / 2 - window.orcFrameWidth / 2;
            const drawY = player.animY * tileSize + tileSize / 2 - window.orcFrameHeight / 2;

            ctx.save();
            if (window.orcFacingLeft) {
                ctx.translate(drawX + window.orcFrameWidth / 2, 0);
                ctx.scale(-1, 1);
                ctx.translate(-(drawX + window.orcFrameWidth / 2), 0);
            }

            if (!window.orcInitialStandDrawn) {
                ctx.drawImage(window.orcStandSprite, 0, 0, window.orcFrameWidth, window.orcFrameHeight, drawX, drawY, window.orcFrameWidth, window.orcFrameHeight);
                window.orcInitialStandDrawn = true;
            } else {
                const frameX = window.orcFrame * window.orcFrameWidth;
                ctx.drawImage(window.orcRunSprite, frameX, 0, window.orcFrameWidth, window.orcFrameHeight, drawX, drawY, window.orcFrameWidth, window.orcFrameHeight);
            }

            ctx.restore();

            const textWidth = ctx.measureText(playerName).width;
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.font = 'bold 14px sans-serif';
            ctx.lineWidth = 2;
            ctx.strokeText(playerName, drawX + window.orcFrameWidth / 2 - textWidth / 2, drawY - 10);
            ctx.fillText(playerName, drawX + window.orcFrameWidth / 2 - textWidth / 2, drawY - 10);
        }

        mapPlaceholder.innerHTML = '';
        mapPlaceholder.appendChild(canvas);

        updateViewport();

        if (controlType === 'click') {
            canvas.onclick = handleCanvasClick;
            canvas.oncontextmenu = handleCanvasRightClick;
        }
    }
    window.drawMap = drawMap;

    // Viewport-Update
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

    // Minimap-Zeichnen
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

    // Spielerbewegung (WASD und Click)
    function movePlayer(dx, dy) {
        if (isChoppingTree) {
            showTreeMessage("You're currently chopping a tree!");
            return;
        }

        player.x = Math.round(player.x);
        player.y = Math.round(player.y);

        const newX = player.x + dx;
        const newY = player.y + dy;

        if (map[player.y][player.x] === 5 || map[newY][newX] === 5) {
            showGameOverScreen();
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
            if (params.team?.toLowerCase() === 'human') {
                window.humanFacingLeft = dx < 0;
            } else {
                window.orcFacingLeft = dx < 0;
            }
            window.isMoving = true;
            updateViewport();
            drawMap();
            checkIfPlayerDied();
            setTimeout(() => {
                window.isMoving = false;
                drawMap();
            }, 120); 
        }
    }

    function animatePlayerMovement(targetTileX, targetTileY) {
        if (moving || isChoppingTree) {
            if (isChoppingTree) showTreeMessage("You're currently chopping a tree!");
            return;
        }
        moving = true;
        const path = [];
        let cx = player.x;
        let cy = player.y;
        while (cx !== targetTileX || cy !== targetTileY) {
            if (cx < targetTileX) {
                if (params.team?.toLowerCase() === 'human') {
                    window.humanFacingLeft = false;
                } else {
                    window.orcFacingLeft = false;
                }
                window.isMoving = true;
                cx++;
            } else if (cx > targetTileX) {
                if (params.team?.toLowerCase() === 'human') {
                    window.humanFacingLeft = true;
                } else {
                    window.orcFacingLeft = true;
                }
                window.isMoving = true;
                cx--;
            } else if (cy < targetTileY) {
                cx = cx; 
                cy++;
                window.isMoving = true;
            } else if (cy > targetTileY) {
                cx = cx; 
                cy--;
                window.isMoving = true;
            }
            path.push({ x: cx, y: cy });
        }
        let step = 0;
        function moveStep() {
            if (step >= path.length) {
                moving = false;
                window.isMoving = false;
                checkIfPlayerDied();
                drawMap(); 
                return;
            }
            const next = path[step];

            if (map[player.y][player.x] === 5 || map[next.y][next.x] === 5) {
                showGameOverScreen();
                player.x = 6;
                player.y = 5;
                player.animX = 6;
                player.animY = 5;
                updateViewport();
                drawMap();
                moving = false;
                window.isMoving = false;
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

    function handleCanvasRightClick(e) {
        e.preventDefault();
        const rect = e.target.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) / zoomFactor;
        const clickY = (e.clientY - rect.top) / zoomFactor;
        const tileX = Math.floor(clickX / tileSize);
        const tileY = Math.floor(clickY / tileSize);

        const tileId = map[tileY]?.[tileX];
        // Goldmine-Logik
        if (tileId === 504) {
            if (!window.goldmineDiscovered) {
                window.goldmineDiscovered = true;
                showGoldmineMessage(tileX, tileY);
                blinkGoldmineTile(tileX, tileY, 3000);
                if (window.goldmineInterval) clearInterval(window.goldmineInterval);
                window.goldmineInterval = setInterval(() => {
                    gold += 500;
                    window.gold = gold;
                    if (typeof updateResourceBar === 'function') updateResourceBar();
                }, 60000);
            } else {
                blinkGoldmineTile(tileX, tileY, 3000);
            }
            return;
        }
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

    // Hilfsfunktion: Finde angrenzendes Grasfeld zu einem Baum
    function findAdjacentGrassTile(tileX, tileY) {
        const directions = [
            { dx: 0, dy: -1 }, // oben
            { dx: 0, dy: 1 },  // unten
            { dx: -1, dy: 0 }, // links
            { dx: 1, dy: 0 }   // rechts
        ];
        for (const { dx, dy } of directions) {
            const nx = tileX + dx;
            const ny = tileY + dy;
            if (
                nx >= 0 && nx < map[0].length &&
                ny >= 0 && ny < map.length &&
                (map[ny][nx] === 1 || map[ny][nx] === 2)
            ) {
                return { x: nx, y: ny };
            }
        }
        return null;
    }

    function blinkGoldmineTile(tileX, tileY, duration) {
        const canvas = mapPlaceholder.firstChild;
        const ctx = canvas.getContext('2d');
        const x = tileX * tileSize;
        const y = tileY * tileSize;
        let blink = true;
        let elapsed = 0;
        const blinkInterval = 150;
        function doBlink() {
            ctx.save();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'gold';
            ctx.globalAlpha = blink ? 1 : 0.2;
            ctx.strokeRect(x, y, tileSize, tileSize);
            ctx.restore();
            blink = !blink;
            elapsed += blinkInterval;
            if (elapsed < duration) {
                setTimeout(doBlink, blinkInterval);
            } else {
                drawMap();
            }
        }
        doBlink();
    }

    function showGoldmineMessage(tileX, tileY) {
        // Wie showTreeMessage, aber goldener Text und zentraler
        const msg = document.createElement('div');
        msg.textContent = 'You have found the Goldmine! + 500 Gold every minute!';
        msg.style.position = 'absolute';
        msg.style.left = '50%';
        msg.style.top = '30%';
        msg.style.transform = 'translate(-50%, 0)';
        msg.style.color = 'gold';
        msg.style.fontSize = '32px';
        msg.style.letterSpacing = '2px';
        msg.style.fontWeight = 'bold';
        msg.style.textShadow = '1px 1px 2px black'; 
        msg.style.transition = 'opacity 0.3s';
        msg.style.opacity = '1';
        msg.style.zIndex = '9999';
        document.body.appendChild(msg);
        let visible = true;
        let blinkCount = 0;
        const blinkInterval = setInterval(() => {
            visible = !visible;
            msg.style.opacity = visible ? '1' : '0.2';
            blinkCount++;
            if (blinkCount > 9) { // 3s, alle 300ms
                clearInterval(blinkInterval);
                msg.style.opacity = '0';
                setTimeout(() => msg.remove(), 500);
            }
        }, 300);
    }

    // Baum-Highlight und Fällen
    function highlightTreeTile(tileX, tileY) {
        const canvas = mapPlaceholder.firstChild;
        const ctx = canvas.getContext('2d');
        const x = tileX * tileSize;
        const y = tileY * tileSize;

        ctx.strokeStyle = 'lightgreen';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, tileSize, tileSize);
    }

    // chopTree global verfügbar machen
    if (typeof chopTree === 'function') {
        window.chopTree = chopTree;
    }

    // Spieler Tod Prüfung
    function checkIfPlayerDied() {
        const currentTile = map[Math.floor(player.y)][Math.floor(player.x)];
        if (currentTile === 5) {
            showGameOverScreen();
            player.x = 6;
            player.y = 5;
            updateViewport();
            drawMap();
        }
    }

    // Query-Parameter auslesen
    function GetQueryParams() {
        const params = {};
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (_, key, value) {
            params[key] = decodeURIComponent(value);
        });
        return params;
    }

    // Tiles laden
    function loadTiles() {
        totalTiles = Object.keys(tileSources).length;
        for (const [id, src] of Object.entries(tileSources)) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                tileImages[id] = img;
                tilesLoaded++;
                checkAllSpritesLoaded();
            };
            img.onerror = () => console.error(`Fehler beim Laden von Bild: ${src}`);
        }
    }

    // WASD Steuerung
    if (controlType === 'wasd') {
        let keysPressed = {};
        let movementInterval = null;
        let animationFrameId = null;

        function startMovement() {
            if (movementInterval) return;
            movementInterval = setInterval(() => {
                if (isChoppingTree) {
                    showTreeMessage("You're currently chopping a tree!");
                    return;
                }
                if (keysPressed['w']) movePlayer(0, -1);
                if (keysPressed['a']) movePlayer(-1, 0);
                if (keysPressed['s']) movePlayer(0, 1);
                if (keysPressed['d']) movePlayer(1, 0);
            }, 120);
            startAnimationLoop();
        }

        function stopMovement() {
            if (movementInterval) {
                clearInterval(movementInterval);
                movementInterval = null;
            }
            window.isMoving = false;
            cancelAnimationFrame(animationFrameId);
            drawMap();
        }

        function animationLoop() {
            drawMap();
            animationFrameId = requestAnimationFrame(animationLoop);
        }

        function startAnimationLoop() {
            if (!animationFrameId) {
                animationLoop();
            }
        }

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (['w', 'a', 's', 'd'].includes(key)) {
                if (isChoppingTree) {
                    showTreeMessage("You're currently chopping a tree!");
                    return;
                }
                if (!keysPressed[key]) {
                    keysPressed[key] = true;
                    window.isMoving = true;
                    startMovement();
                }
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (['w', 'a', 's', 'd'].includes(key)) {
                keysPressed[key] = false;
                if (!keysPressed['w'] && !keysPressed['a'] && !keysPressed['s'] && !keysPressed['d']) {
                    stopMovement();
                }
                e.preventDefault();
            }
        });
    }

    // Taste G für Baumfällen
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

    // Initiales Map-Rendering nach DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        let playerElement = document.getElementById('character');
        if (params.team?.toLowerCase() === 'orc' && playerElement) {
            playerElement.style.display = 'none';
        }
        if (params.team?.toLowerCase() === 'human') {
            window.humanInitialStandDrawn = false;
        }
        drawMap();
    });
}

// Seitenübergang
function fadeInPage() {
    const overlay = document.getElementById('transitionOverlay');
    overlay.classList.add('hidden');
}

// Startscreen entfernen
function delStart() {
    document.getElementById('startGame').style.display = 'none';
    document.getElementById('gameWrapper').style.display = 'flex';
    // HelpOverlay und MissionDisplay erst jetzt anzeigen
    if (helpOverlay) helpOverlay.style.display = 'block';
    let missionDisplay = document.getElementById('missionDisplay');
    if (missionDisplay) missionDisplay.style.display = 'block';
}

// Game Over Screen anzeigen
function showGameOverScreen() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) {
        gameOverScreen.style.display = 'flex';
    }
    // Stoppe Goldmine-Timer
    if (window.goldmineInterval) {
        clearInterval(window.goldmineInterval);
        window.goldmineInterval = null;
    }
}

// You Won Screen anzeigen
function showYouWonScreen() {
    const youWonScreen = document.getElementById('youWonScreen');
    if (youWonScreen) {
        youWonScreen.style.display = 'flex';
    }
    // Game stoppen (optional)
    document.getElementById('gameWrapper').style.display = 'none';
    document.getElementById('resourceBar').style.display = 'none';
    // Stoppe Goldmine-Timer
    if (window.goldmineInterval) {
        clearInterval(window.goldmineInterval);
        window.goldmineInterval = null;
    }
}
window.showYouWonScreen = showYouWonScreen;

// Menü- und Restart-Button Logik
document.addEventListener('DOMContentLoaded', () => {
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            location.href = '../startseite/index.html';
        });

    
    const restartButton2 = document.getElementById('restartWinButton');
    if (restartButton2) {
        restartButton2.addEventListener('click', () => {
            location.href = '../startseite/index.html';
        });
    }
    }  

    

    // Menü-Button Logik
    const menuButton = document.getElementById('menuButton');
    const menuScreen = document.getElementById('menuScreen');
    const closeMenuButton = document.getElementById('closeMenuButton');
    const menuRestartButton = document.getElementById('menuRestartButton');
    const volumeSlider = document.getElementById('volumeSlider');

    if (menuButton && menuScreen) {
        menuButton.addEventListener('click', () => {
            menuScreen.style.display = 'flex';
            menuScreen.style.justifyContent = 'center';
            menuScreen.style.alignItems = 'center';
        });
    }
    if (closeMenuButton && menuScreen) {
        closeMenuButton.addEventListener('click', () => {
            menuScreen.style.display = 'none';
        });
    }
    if (menuRestartButton) {
        menuRestartButton.addEventListener('click', () => {
            location.href = '../startseite/index.html';
        });
    }
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (typeof Howler !== 'undefined') {
                Howler.volume(value);
            }
        });
    }

    // Upgrade-Menü Logik
    const upgradeIcon = document.getElementById('upgradeIcon');
    const upgradeMenu = document.getElementById('upgradeMenu');
    const closeUpgradeMenu = document.getElementById('closeUpgradeMenu');
    if (upgradeIcon && upgradeMenu) {
        upgradeIcon.style.cursor = 'pointer';
        upgradeIcon.addEventListener('click', () => {
            upgradeMenu.style.display = 'flex';
        });
    }
    if (closeUpgradeMenu && upgradeMenu) {
        closeUpgradeMenu.addEventListener('click', () => {
            upgradeMenu.style.display = 'none';
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'm' && menuScreen) {
            menuScreen.style.display = 'flex';
            menuScreen.style.justifyContent = 'center';
            menuScreen.style.alignItems = 'center';
        }
    });
});

// Audio-Umschalter
let countAudio = 1;
function changeAudio() {
    if (countAudio % 2 === 0 ) {
        document.getElementById('audioImg').src = '../sounds/audioImg.png';
    }else {
        document.getElementById('audioImg').src = '../sounds/mutedImg.png';
    }
   
    MusicPlayer(countAudio);
    countAudio++;
}

// Ressourcen synchronisieren
window.syncResources = function() {
    if (typeof gold !== 'undefined' && typeof wood !== 'undefined') {
        gold = window.gold;
        wood = window.wood;
        updateResourceBar();
    }
}
