(function() {
 

    const buildSection = document.getElementById('buildSection');
    const originalContent = buildSection.innerHTML;

    // Globale Power-Variable
    if (typeof window.power === 'undefined') {
        window.power = 1;
    }

    // Neue, gebalancte Preise für Buildings
    const buildings = [
        { src: './img/build/bridge.png', alt: 'Bridge', name: 'Bridge', wood: 600, gold: 200 },
        { src: './img/build/Farm_Orc.png', alt: 'Farm', name: 'Farm', wood: 250, gold: 200 },
        { src: './img/build/Tower.png', alt: 'Tower', name: 'Tower', wood: 200, gold: 600, requires: { farm: 1, bridge: 1 } },
        { src: './img/build/Lumbermill.png', alt: 'Lumbermill', name: 'Lumbermill', wood: 400, gold: 150, requires: { farm: 1, tower: 1 } },
        { src: './img/build/Refinery.png', alt: 'Refinery', name: 'Refinery', wood: 0, gold: 600, requires: { farm: 3, lumbermill: 1 } },
        { src: './img/build/Altar.png', alt: 'Altar', name: 'Altar', wood: 1000, gold: 1000 },
        { src: './img/build/Dragonroost.png', alt: 'Dragonroost', name: 'Dragonroost', wood: 1200, gold: 2000 }
    ];

    // Missionsziele als Objekt für dynamische Prüfung
    const missionGoals = {
        mission1: {
            farm: 3,
            tower: 1,
            lumbermill: 1,
            refinery: 1,
            altar: 1,
            dragonroost: 1
        },
        mission2: {
            farm: 5,
            tower: 2,
            lumbermill: 2,
            refinery: 2,
            altar: 1,
            dragonroost: 1
        }
    };

    // Initialisiere missionProgress mit allen Keys auf 0 beim Laden
    if (!window.missionProgress || typeof window.missionProgress !== 'object') {
        window.missionProgress = {};
    }
    // Alle Keys aus allen Missionszielen auf 0 setzen, falls nicht vorhanden
    Object.values(missionGoals).forEach(goal => {
        Object.keys(goal).forEach(key => {
            if (typeof window.missionProgress[key] !== 'number') window.missionProgress[key] = 0;
        });
    });

    // Hilfsfunktion für Bau-Meldungen wie beim Baumfällen
    function showBuildMessage(message) {
        if (typeof showTreeMessage === 'function') {
            showTreeMessage(message);
            return;
        }
        // Fallback falls showTreeMessage nicht existiert
        const msg = document.createElement('div');
        msg.textContent = message;
        msg.style.position = 'absolute';
        msg.style.left = '50%';
        msg.style.top = '30%';
        msg.style.transform = 'translate(-50%, 0)';
        msg.style.color = 'darkgray';
        msg.style.fontSize = '32px'; 
        msg.style.letterSpacing = '2px';
        msg.style.fontWeight = 'bold';
        msg.style.textShadow = '1px 1px 2px black';
        msg.style.transition = 'transform 2.5s, opacity 2.5s'; 
        msg.style.opacity = '1';
        document.body.appendChild(msg);
        setTimeout(() => {
            msg.style.transform = 'translate(-50%, -60px)';
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 2500);
        }, 0);
    }

    function showBridgeModal() {
        let modal = document.getElementById('bridgeModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bridgeModal';
            modal.style.display = 'none';
            document.body.appendChild(modal);
        }
        const bridge = buildings.find(b => b.alt === 'Bridge');
        modal.innerHTML = `
            <div class="bridge-modal-content">
                <p style="font-size:2rem;">Do you want to build a Bridge?</p>
                <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 18px;">
                    <span style='font-size:2rem; color:gold; margin-bottom: 6px;'>${bridge.gold} Gold</span>
                    <span style='font-size:2rem; color:green;'>${bridge.wood} Holz</span>
                </div>
                <button id="bridgeYesBtn">Yes</button>
                <button id="bridgeNoBtn">No</button>
            </div>
        `;
        modal.style.display = 'flex';
        document.getElementById('bridgeYesBtn').onclick = () => {
            placeBridgeRandomly();
            modal.style.display = 'none';
        };
        document.getElementById('bridgeNoBtn').onclick = () => {
            modal.style.display = 'none';
        };
    }

    function placeBridgeRandomly() {
        const bridge = buildings.find(b => b.alt === 'Bridge');
        if (!bridge) return;
        if (window.wood < bridge.wood || window.gold < bridge.gold) {
            showBuildMessage(`Brücke kostet ${bridge.gold} Gold und ${bridge.wood} Holz`);
            return;
        }
        if (!window.map) return;
        const map = window.map;
        const waterIds = [5, 8, 9, 100, 101];
        const possibleSpots = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 1; x < map[0].length - 1; x++) {
                if (
                    waterIds.includes(map[y][x-1]) &&
                    waterIds.includes(map[y][x]) &&
                    waterIds.includes(map[y][x+1])
                ) {
                    possibleSpots.push({x, y});
                }
            }
        }
        if (possibleSpots.length === 0) {
            showBuildMessage('Kein Platz für Brücke gefunden!');
            return;
        }
        const spot = possibleSpots[Math.floor(Math.random() * possibleSpots.length)];
        map[spot.y][spot.x-1] = 221;
        map[spot.y][spot.x] = 222;
        map[spot.y][spot.x+1] = 223;
        window.wood -= bridge.wood;
        window.gold -= bridge.gold;
        if (typeof window.missionProgress === 'undefined' || !window.missionProgress) {
            window.missionProgress = {};
        }
        window.missionProgress.bridge = (window.missionProgress.bridge || 0) + 1;
        if (typeof window.buildings !== 'undefined') { window.buildings++; }
        if (typeof updateResourceBar === 'function') updateResourceBar();
        if (typeof drawMap === 'function') drawMap();
        if (document.getElementById('buildingValue')) {
            document.getElementById('buildingValue').textContent = window.buildings;
        }
        checkMissionWin();
        // Goldmine nach Brückenbau spawnen (nur einmal)
        if (!window.goldmineSpawned) {
            let placed = false;
            for (let y = 0; y < map.length; y++) {
                for (let x = Math.floor(map[0].length/2)+1; x < map[0].length; x++) {
                    if ((map[y][x] === 1 || map[y][x] === 2)) {
                        map[y][x] = 504;
                        window.goldmineSpawned = {x, y};
                        placed = true;
                        if (typeof drawMap === 'function') drawMap();
                        break;
                    }
                }
                if (placed) break;
            }
        }
        // Rechtsklick-Event für Goldmine setzen
        setTimeout(() => {
            if (typeof window.attachGoldmineRightClick === 'function') window.attachGoldmineRightClick();
        }, 100);
    }

    // Rechtsklick auf Goldmine: FoundMessage und Goldminen-Intervall
    window.attachGoldmineRightClick = function() {
        if (!window.map) return;
        const map = window.map;
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === 504) {
                    const goldmineTile = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
                    if (goldmineTile) {
                        goldmineTile.oncontextmenu = function(e) {
                            e.preventDefault();
                            if (!window.goldmineActive) {
                                if (typeof showBuildMessage === 'function') showBuildMessage('Du hast eine Goldmine gefunden!');
                                window.goldmineActive = true;
                                if (window.goldmineInterval) clearInterval(window.goldmineInterval);
                                window.goldmineInterval = setInterval(() => {
                                    window.gold += 500;
                                    if (typeof updateResourceBar === 'function') updateResourceBar();
                                }, 60000);
                            } else {
                                if (typeof showBuildMessage === 'function') showBuildMessage('Goldmine ist bereits aktiv!');
                            }
                        };
                    }
                }
            }
        }
    }

    function showFarmModal() {
        let modal = document.getElementById('bridgeModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bridgeModal';
            modal.style.display = 'none';
            document.body.appendChild(modal);
        }
        const farm = buildings.find(b => b.alt === 'Farm');
        modal.innerHTML = `
            <div class="bridge-modal-content">
                <p style="font-size:2rem;">Willst du eine Farm bauen?</p>
                <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 18px;">
                    <span style='font-size:2rem; color:gold; margin-bottom: 6px;'>${farm.gold} Gold</span>
                    <span style='font-size:2rem; color:green;'>${farm.wood} Holz</span>
                </div>
                <button id="farmYesBtn">Ja</button>
                <button id="farmNoBtn">Nein</button>
            </div>
        `;
        modal.style.display = 'flex';
        document.getElementById('farmYesBtn').onclick = () => {
            placeFarmRandomly();
            modal.style.display = 'none';
        };
        document.getElementById('farmNoBtn').onclick = () => {
            modal.style.display = 'none';
        };
    }

    function placeFarmRandomly() {
        const farm = buildings.find(b => b.alt === 'Farm');
        if (!farm) return;
        if (window.wood < farm.wood || window.gold < farm.gold) {
            showBuildMessage(`Farm kostet ${farm.gold} Gold und ${farm.wood} Holz`);
            return;
        }
        if (!window.map) return;
        const map = window.map;
        const possibleSpots = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === 1 || map[y][x] === 2) {
                    possibleSpots.push({x, y});
                }
            }
        }
        if (possibleSpots.length === 0) {
            showBuildMessage('Kein Platz für Farm gefunden!');
            return;
        }
        const spot = possibleSpots[Math.floor(Math.random() * possibleSpots.length)];
        map[spot.y][spot.x] = 500;
        window.wood -= farm.wood;
        window.gold -= farm.gold;
        // missionProgress initialisieren, falls nicht vorhanden
        if (typeof window.missionProgress === 'undefined' || !window.missionProgress) {
            window.missionProgress = {};
        }
        window.missionProgress.farm = (window.missionProgress.farm || 0) + 1;
        if (typeof window.buildings !== 'undefined') { window.buildings++; }
        if (typeof updateResourceBar === 'function') updateResourceBar();
        if (typeof drawMap === 'function') drawMap();
        // Ressourcenanzeige updaten
        if (document.getElementById('buildingValue')) {
            document.getElementById('buildingValue').textContent = window.buildings;
        }
        checkMissionWin();
    }

    function showTowerModal() {
        let modal = document.getElementById('bridgeModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bridgeModal';
            modal.style.display = 'none';
            document.body.appendChild(modal);
        }
        const tower = buildings.find(b => b.alt === 'Tower');
        modal.innerHTML = `
            <div class="bridge-modal-content">
                <p style="font-size:2rem;">Willst du einen Tower bauen?</p>
                <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 18px;">
                    <span style='font-size:2rem; color:gold; margin-bottom: 6px;'>${tower.gold} Gold</span>
                    <span style='font-size:2rem; color:green;'>${tower.wood} Holz</span>
                </div>
                <button id="towerYesBtn">Ja</button>
                <button id="towerNoBtn">Nein</button>
            </div>
        `;
        modal.style.display = 'flex';
        document.getElementById('towerYesBtn').onclick = () => {
            placeTowerRandomly();
            modal.style.display = 'none';
        };
        document.getElementById('towerNoBtn').onclick = () => {
            modal.style.display = 'none';
        };
    }

    function placeTowerRandomly() {
        const tower = buildings.find(b => b.alt === 'Tower');
        if (!tower) return;
        // Prüfe Voraussetzungen
        if (tower.requires) {
            // missionProgress.farm und missionProgress.bridge müssen korrekt gezählt werden
            const farmCount = window.missionProgress && window.missionProgress.farm ? window.missionProgress.farm : 0;
            const bridgeCount = window.missionProgress && window.missionProgress.bridge ? window.missionProgress.bridge : 0;
            if (farmCount < tower.requires.farm || bridgeCount < tower.requires.bridge) {
                showBuildMessage('Du brauchst mindestens 1 Farm und 1 Brücke für einen Tower!');
                return;
            }
        }
        if (window.wood < tower.wood || window.gold < tower.gold) {
            showBuildMessage(`Tower kostet ${tower.gold} Gold und ${tower.wood} Holz`);
            return;
        }
        if (!window.map) return;
        const map = window.map;
        const possibleSpots = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === 1 || map[y][x] === 2) {
                    possibleSpots.push({x, y});
                }
            }
        }
        if (possibleSpots.length === 0) {
            showBuildMessage('Kein Platz für Tower gefunden!');
            return;
        }
        const spot = possibleSpots[Math.floor(Math.random() * possibleSpots.length)];
        map[spot.y][spot.x] = 501;
        window.wood -= tower.wood;
        window.gold -= tower.gold;
        if (typeof window.missionProgress !== 'undefined') {
            window.missionProgress.tower = (window.missionProgress.tower || 0) + 1;
        }
        if (typeof window.buildings !== 'undefined') { window.buildings++; }
        // Power erhöhen
        if (typeof window.power !== 'undefined') { window.power++; }
        if (typeof updateResourceBar === 'function') updateResourceBar();
        if (typeof drawMap === 'function') drawMap();
        if (document.getElementById('buildingValue')) {
            document.getElementById('buildingValue').textContent = window.buildings;
        }
        checkMissionWin();
    }

    function showLumbermillModal() {
        let modal = document.getElementById('bridgeModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bridgeModal';
            modal.style.display = 'none';
            document.body.appendChild(modal);
        }
        const lumbermill = buildings.find(b => b.alt === 'Lumbermill');
        modal.innerHTML = `
            <div class="bridge-modal-content">
                <p style="font-size:2rem;">Willst du ein Lumbermill bauen?</p>
                <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 18px;">
                    <span style='font-size:2rem; color:gold; margin-bottom: 6px;'>${lumbermill.gold} Gold</span>
                    <span style='font-size:2rem; color:green;'>${lumbermill.wood} Holz</span>
                </div>
                <button id="lumbermillYesBtn">Ja</button>
                <button id="lumbermillNoBtn">Nein</button>
            </div>
        `;
        modal.style.display = 'flex';
        document.getElementById('lumbermillYesBtn').onclick = () => {
            placeLumbermillRandomly();
            modal.style.display = 'none';
        };
        document.getElementById('lumbermillNoBtn').onclick = () => {
            modal.style.display = 'none';
        };
    }

    function placeLumbermillRandomly() {
        const lumbermill = buildings.find(b => b.alt === 'Lumbermill');
        if (!lumbermill) return;
        // Prüfe Voraussetzungen
        if (lumbermill.requires) {
            if (!window.missionProgress || window.missionProgress.farm < lumbermill.requires.farm || window.missionProgress.tower < lumbermill.requires.tower) {
                showBuildMessage('Du brauchst mindestens 1 Farm und 1 Tower für ein Lumbermill!');
                return;
            }
        }
        if (window.wood < lumbermill.wood || window.gold < lumbermill.gold) {
            showBuildMessage(`Lumbermill kostet ${lumbermill.gold} Gold und ${lumbermill.wood} Holz`);
            return;
        }
        if (!window.map) return;
        const map = window.map;
        const possibleSpots = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === 1 || map[y][x] === 2) {
                    possibleSpots.push({x, y});
                }
            }
        }
        if (possibleSpots.length === 0) {
            showBuildMessage('Kein Platz für Lumbermill gefunden!');
            return;
        }
        const spot = possibleSpots[Math.floor(Math.random() * possibleSpots.length)];
        map[spot.y][spot.x] = 502;
        window.wood -= lumbermill.wood;
        window.gold -= lumbermill.gold;
        if (typeof window.missionProgress !== 'undefined') {
            window.missionProgress.lumbermill = (window.missionProgress.lumbermill || 0) + 1;
        }
        if (typeof window.buildings !== 'undefined') { window.buildings++; }
        if (typeof updateResourceBar === 'function') updateResourceBar();
        if (typeof drawMap === 'function') drawMap();
        if (document.getElementById('buildingValue')) {
            document.getElementById('buildingValue').textContent = window.buildings;
        }
        checkMissionWin();
    }

    function showRefineryModal() {
        let modal = document.getElementById('bridgeModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bridgeModal';
            modal.style.display = 'none';
            document.body.appendChild(modal);
        }
        const refinery = buildings.find(b => b.alt === 'Refinery');
        modal.innerHTML = `
            <div class="bridge-modal-content">
                <p style="font-size:2rem;">Willst du eine Refinery bauen?</p>
                <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 18px;">
                    <span style='font-size:2rem; color:gold; margin-bottom: 6px;'>${refinery.gold} Gold</span>
                    <span style='font-size:2rem; color:green;'>${refinery.wood} Holz</span>
                </div>
                <button id="refineryYesBtn">Ja</button>
                <button id="refineryNoBtn">Nein</button>
            </div>
        `;
        modal.style.display = 'flex';
        document.getElementById('refineryYesBtn').onclick = () => {
            placeRefineryRandomly();
            modal.style.display = 'none';
        };
        document.getElementById('refineryNoBtn').onclick = () => {
            modal.style.display = 'none';
        };
    }

    function placeRefineryRandomly() {
        const refinery = buildings.find(b => b.alt === 'Refinery');
        if (!refinery) return;
        // Prüfe Voraussetzungen
        if (refinery.requires) {
            if (!window.missionProgress || window.missionProgress.farm < refinery.requires.farm || window.missionProgress.lumbermill < refinery.requires.lumbermill) {
                showBuildMessage('Du brauchst mindestens 3 Farmen und 1 Lumbermill für eine Refinery!');
                return;
            }
        }
        if (window.wood < refinery.wood || window.gold < refinery.gold) {
            showBuildMessage(`Refinery kostet ${refinery.gold} Gold und ${refinery.wood} Holz`);
            return;
        }
        if (!window.map) return;
        const map = window.map;
        const possibleSpots = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === 1 || map[y][x] === 2) {
                    possibleSpots.push({x, y});
                }
            }
        }
        if (possibleSpots.length === 0) {
            showBuildMessage('Kein Platz für Refinery gefunden!');
            return;
        }
        const spot = possibleSpots[Math.floor(Math.random() * possibleSpots.length)];
        map[spot.y][spot.x] = 503;
        window.wood -= refinery.wood;
        window.gold -= refinery.gold;
        if (typeof window.missionProgress !== 'undefined') {
            window.missionProgress.refinery = (window.missionProgress.refinery || 0) + 1;
        }
        if (typeof window.buildings !== 'undefined') { window.buildings++; }
        if (typeof window.hasRefinery === 'undefined') window.hasRefinery = false;
        window.hasRefinery = true;
        if (typeof updateResourceBar === 'function') updateResourceBar();
        if (typeof drawMap === 'function') drawMap();
        if (document.getElementById('buildingValue')) {
            document.getElementById('buildingValue').textContent = window.buildings;
        }
        checkMissionWin();
    }

    function showAltarModal() {
        let modal = document.getElementById('bridgeModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bridgeModal';
            modal.style.display = 'none';
            document.body.appendChild(modal);
        }
        const altar = buildings.find(b => b.alt === 'Altar');
        modal.innerHTML = `
            <div class="bridge-modal-content">
                <p style="font-size:2rem;">Willst du einen Altar bauen?</p>
                <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 18px;">
                    <span style='font-size:2rem; color:gold; margin-bottom: 6px;'>${altar.gold} Gold</span>
                    <span style='font-size:2rem; color:green;'>${altar.wood} Holz</span>
                </div>
                <button id="altarYesBtn">Ja</button>
                <button id="altarNoBtn">Nein</button>
            </div>
        `;
        modal.style.display = 'flex';
        document.getElementById('altarYesBtn').onclick = () => {
            placeAltarRandomly();
            modal.style.display = 'none';
        };
        document.getElementById('altarNoBtn').onclick = () => {
            modal.style.display = 'none';
        };
    }

    function placeAltarRandomly() {
        const altar = buildings.find(b => b.alt === 'Altar');
        if (!altar) return;
        if (window.wood < altar.wood || window.gold < altar.gold) {
            showBuildMessage(`Altar kostet ${altar.gold} Gold und ${altar.wood} Holz`);
            return;
        }
        if (!window.map) return;
        const map = window.map;
        const possibleSpots = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === 1 || map[y][x] === 2) {
                    possibleSpots.push({x, y});
                }
            }
        }
        if (possibleSpots.length === 0) {
            showBuildMessage('Kein Platz für Altar gefunden!');
            return;
        }
        const spot = possibleSpots[Math.floor(Math.random() * possibleSpots.length)];
        map[spot.y][spot.x] = 505;
        window.wood -= altar.wood;
        window.gold -= altar.gold;
        if (typeof window.missionProgress !== 'undefined') {
            window.missionProgress.altar = (window.missionProgress.altar || 0) + 1;
        }
        if (typeof window.buildings !== 'undefined') { window.buildings++; }
        if (typeof updateResourceBar === 'function') updateResourceBar();
        if (typeof drawMap === 'function') drawMap();
        if (document.getElementById('buildingValue')) {
            document.getElementById('buildingValue').textContent = window.buildings;
        }
        checkMissionWin();
        // Altar-Effekt: Alle Wasser-Tiles (ID 5, 8, 9, 100, 101, 221, 222, 223) werden zu 1 oder 2
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if ([5,8,9,100,101,221,222,223].includes(map[y][x])) {
                    map[y][x] = Math.random() < 0.5 ? 1 : 2;
                }
            }
        }
        if (typeof drawMap === 'function') drawMap();
        showAltarOverlay();
    }

    function showAltarOverlay() {
        // Rotes Overlay erzeugen
        let altarOverlay = document.getElementById('altarRedOverlay');
        if (!altarOverlay) {
            altarOverlay = document.createElement('div');
            altarOverlay.id = 'altarRedOverlay';
            altarOverlay.style.position = 'fixed';
            altarOverlay.style.top = '0';
            altarOverlay.style.left = '0';
            altarOverlay.style.width = '100vw';
            altarOverlay.style.height = '100vh';
            altarOverlay.style.background = 'rgba(180,0,0,0.55)';
            altarOverlay.style.zIndex = '999998';
            altarOverlay.style.pointerEvents = 'none';
            altarOverlay.style.transition = 'none';
            document.body.appendChild(altarOverlay);
        }
        altarOverlay.style.display = 'block';
        // Shake und Verzerrung auf body
        const body = document.body;
        let shakeFrame = 0;
        let shakeActive = true;
        function doShake() {
            if (!shakeActive) return;
            const x = Math.random() * 32 - 16;
            const y = Math.random() * 32 - 16;
            const r = Math.random() * 10 - 5;
            const sx = 1 + (Math.random() * 0.08 - 0.04);
            const sy = 1 + (Math.random() * 0.08 - 0.04);
            body.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${sx},${sy}) skew(${Math.random()*8-4}deg,${Math.random()*8-4}deg)`;
            shakeFrame++;
            if (shakeActive) setTimeout(doShake, 30);
        }
        doShake();
        // Sound abspielen
        let altarAudio = document.getElementById('altarDistortedAudio');
        if (!altarAudio) {
            altarAudio = document.createElement('audio');
            altarAudio.id = 'altarDistortedAudio';
            altarAudio.src = '../sounds/distorted.m4a';
            altarAudio.loop = true;
            altarAudio.volume = 1;
            document.body.appendChild(altarAudio);
        }
        altarAudio.currentTime = 0;
        altarAudio.play();
        // Horror-Zeichen animieren
        let horrorContainer = document.getElementById('altarHorrorContainer');
        if (!horrorContainer) {
            horrorContainer = document.createElement('div');
            horrorContainer.id = 'altarHorrorContainer';
            horrorContainer.style.position = 'fixed';
            horrorContainer.style.top = '0';
            horrorContainer.style.left = '0';
            horrorContainer.style.width = '100vw';
            horrorContainer.style.height = '100vh';
            horrorContainer.style.pointerEvents = 'none';
            horrorContainer.style.zIndex = '999999';
            document.body.appendChild(horrorContainer);
        }
        horrorContainer.innerHTML = '';
        let running = true;
        function spawnHorrorSymbol() {
            if (!running) return;
            const chars = '0123456789#@!$%&*?ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const el = document.createElement('div');
            el.textContent = chars[Math.floor(Math.random()*chars.length)];
            el.style.position = 'fixed';
            el.style.left = Math.random()*100 + 'vw';
            el.style.top = '-40px';
            el.style.fontSize = (Math.random()*2+2) + 'rem';
            el.style.color = '#fff';
            el.style.fontWeight = 'bold';
            el.style.textShadow = '2px 2px 8px #000, 0 0 16px #fff';
            el.style.pointerEvents = 'none';
            el.style.zIndex = '999999';
            el.style.transform = `rotate(${Math.random()*40-20}deg) skew(${Math.random()*30-15}deg,${Math.random()*30-15}deg)`;
            horrorContainer.appendChild(el);
            // Animieren
            const duration = 1200 + Math.random()*800;
            el.animate([
                { top: '-40px', opacity: 1 },
                { top: '100vh', opacity: 0.2 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(.5,0,.5,1)'
            });
            setTimeout(() => { el.remove(); }, duration+100);
        }
        // Viele Symbole schnell spawnen
        let horrorInterval = setInterval(() => {
            for (let i=0; i<4; i++) spawnHorrorSymbol();
        }, 80);
        // Nach 3.5s alles entfernen
        setTimeout(() => {
            running = false;
            clearInterval(horrorInterval);
            horrorContainer.innerHTML = '';
            shakeActive = false;
            body.style.transform = '';
            altarOverlay.style.display = 'none';
            if (altarAudio) {
                altarAudio.pause();
                altarAudio.currentTime = 0;
                altarAudio.remove();
            }
        }, 3500);
    }

    function showDragonroostModal() {
        let modal = document.getElementById('bridgeModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bridgeModal';
            modal.style.display = 'none';
            document.body.appendChild(modal);
        }
        const dragonroost = buildings.find(b => b.alt === 'Dragonroost');
        modal.innerHTML = `
            <div class="bridge-modal-content">
                <p style="font-size:2rem;">Willst du ein Dragonroost bauen?</p>
                <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 18px;">
                    <span style='font-size:2rem; color:gold; margin-bottom: 6px;'>${dragonroost.gold} Gold</span>
                    <span style='font-size:2rem; color:green;'>${dragonroost.wood} Holz</span>
                </div>
                <button id="dragonroostYesBtn">Ja</button>
                <button id="dragonroostNoBtn">Nein</button>
            </div>
        `;
        modal.style.display = 'flex';
        document.getElementById('dragonroostYesBtn').onclick = () => {
            placeDragonroostRandomly();
            modal.style.display = 'none';
        };
        document.getElementById('dragonroostNoBtn').onclick = () => {
            modal.style.display = 'none';
        };
    }

    function placeDragonroostRandomly() {
        const dragonroost = buildings.find(b => b.alt === 'Dragonroost');
        if (!dragonroost) return;
        if (window.wood < dragonroost.wood || window.gold < dragonroost.gold) {
            showBuildMessage(`Dragonroost kostet ${dragonroost.gold} Gold und ${dragonroost.wood} Holz`);
            return;
        }
        if (!window.map) return;
        const map = window.map;
        const possibleSpots = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === 1 || map[y][x] === 2) {
                    possibleSpots.push({x, y});
                }
            }
        }
        if (possibleSpots.length === 0) {
            showBuildMessage('Kein Platz für Dragonroost gefunden!');
            return;
        }
        const spot = possibleSpots[Math.floor(Math.random() * possibleSpots.length)];
        map[spot.y][spot.x] = 506;
        window.wood -= dragonroost.wood;
        window.gold -= dragonroost.gold;
        if (typeof window.missionProgress !== 'undefined') {
            window.missionProgress.dragonroost = (window.missionProgress.dragonroost || 0) + 1;
        }
        if (typeof window.buildings !== 'undefined') { window.buildings++; }
        if (typeof updateResourceBar === 'function') updateResourceBar();
        if (typeof drawMap === 'function') drawMap();
        if (document.getElementById('buildingValue')) {
            document.getElementById('buildingValue').textContent = window.buildings;
        }
        checkMissionWin();
        // Dragonroost-Effekt: 30% mehr Gold aus der Goldmine
        window.dragonroostActive = true;
    }

    // Entferne alle Reste von Upgrade-Menü und stelle das Build-Menü sicher wieder her
    // Stelle sicher, dass buildSection nur den Hammer enthält
    buildSection.innerHTML = '<img src="./img/hammer.png" alt="Build Icon" id="buildIcon" style="cursor:pointer;">';

    function attachBuildIconClick() {
        const buildIcon = document.getElementById('buildIcon');
        if (buildIcon) {
            buildIcon.addEventListener('click', showBuildingOptions);
        }
    }
    attachBuildIconClick();

    function showBuildingOptions() {
        buildSection.innerHTML = '';
        buildings.forEach(building => {
            const img = document.createElement('img');
            img.src = building.src;
            img.alt = building.alt;
            img.classList.add('buildingOption');
            img.style.width = '64px';
            img.style.height = '64px';
            img.style.marginBottom = '8px';
            img.style.cursor = 'pointer';
            buildSection.appendChild(img);
            if (building.alt === 'Bridge') {
                img.addEventListener('click', () => { showBridgeModal(); });
            } else if (building.alt === 'Farm') {
                img.addEventListener('click', () => { showFarmModal(); });
            } else if (building.alt === 'Tower') {
                img.addEventListener('click', () => { showTowerModal(); });
            } else if (building.alt === 'Lumbermill') {
                img.addEventListener('click', () => { showLumbermillModal(); });
            } else if (building.alt === 'Refinery') {
                img.addEventListener('click', () => { showRefineryModal(); });
            } else if (building.alt === 'Altar') {
                img.addEventListener('click', () => { showAltarModal(); });
            } else if (building.alt === 'Dragonroost') {
                img.addEventListener('click', () => { showDragonroostModal(); });
            }
        });
        const backArrow = document.createElement('img');
        backArrow.src = './img/build/back.png';
        backArrow.alt = 'Back';
        backArrow.id = 'backArrow';
        backArrow.style.width = '48px';
        backArrow.style.height = '48px';
        backArrow.style.cursor = 'pointer';
        backArrow.style.marginTop = '12px';
        buildSection.appendChild(backArrow);
        backArrow.addEventListener('click', () => {
            buildSection.innerHTML = '<img src="./img/hammer.png" alt="Build Icon" id="buildIcon" style="cursor:pointer;">';
            attachBuildIconClick();
        });
    }

    // Missionsanzeige rechts neben der Map
    function showMissionDisplay() {
        let missionDisplay = document.getElementById('missionDisplay');
        if (!missionDisplay) {
            missionDisplay = document.createElement('div');
            missionDisplay.id = 'missionDisplay';
            missionDisplay.style.position = 'absolute';
            missionDisplay.style.right = '150px';
            missionDisplay.style.top = '120px';
            missionDisplay.style.width = '260px';
            missionDisplay.style.minHeight = '120px';
            missionDisplay.style.background = 'rgba(0,0,0,0.7)';
            missionDisplay.style.color = 'white';
            missionDisplay.style.fontSize = '1.5rem';
            missionDisplay.style.padding = '18px 18px 18px 24px';
            missionDisplay.style.borderRadius = '12px';
            missionDisplay.style.zIndex = '1001';
            missionDisplay.style.display = 'flex';
            missionDisplay.style.flexDirection = 'column';
            missionDisplay.style.justifyContent = 'flex-start';
            missionDisplay.style.alignItems = 'flex-start';
            document.body.appendChild(missionDisplay);
        }
        let missionText = '';
        let params = window.params;
        if (!params) {
            params = {};
            window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (_, key, value) {
                params[key] = decodeURIComponent(value);
            });
            window.params = params;
        }
        if (params.mission === 'none' || !params.mission) {
            missionText = '<b>Kein Missionsziel</b><br>Baue beliebig viele Gebäude!';
        } else if (params.mission === 'mission1') {
            missionText = '<b>Mission 1</b><ul style="margin-top:8px;">'
                + '<li id="missionFarm">Baue 3 Farmen</li>'
                + '<li id="missionTower">Baue 1 Tower</li>'
                + '<li id="missionLumbermill">Baue 1 Lumbermill</li>'
                + '<li id="missionRefinery">Baue 1 Refinery</li>'
                + '<li id="missionAltar">Baue 1 Altar</li>'
                + '<li id="missionDragonroost">Baue 1 Dragonroost</li>'
                + '</ul>';
        } else if (params.mission === 'mission2') {
            missionText = '<b>Mission 2</b><ul style="margin-top:8px;">'
                + '<li id="missionFarm">Baue 5 Farmen</li>'
                + '<li id="missionTower">Baue 2 Tower</li>'
                + '<li id="missionLumbermill">Baue 2 Lumbermills</li>'
                + '<li id="missionRefinery">Baue 2 Refineries</li>'
                + '<li id="missionAltar">Baue 1 Altar</li>'
                + '<li id="missionDragonroost">Baue 1 Dragonroost</li>'
                + '</ul>';
        } else {
            missionText = '';
        }
        missionDisplay.innerHTML = missionText;
    }
    // Beim Laden anzeigen
    showMissionDisplay();

    // Missionslogik: Prüfe Missionsziele und Sieg
    function checkMissionWin() {
        let params = window.params;
        if (!params) {
            params = {};
            window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (_, key, value) {
                params[key] = decodeURIComponent(value);
            });
            window.params = params;
        }
        if (window.missionWon) return; // Sieg nur einmal auslösen
        const mp = window.missionProgress || {};
        // Dynamische Missionsprüfung
        if (params.mission && missionGoals[params.mission]) {
            const goal = missionGoals[params.mission];
            let allMet = true;
            for (const key in goal) {
                if ((mp[key] || 0) < goal[key]) {
                    allMet = false;
                    break;
                }
            }
            if (allMet) {
                window.missionWon = true;
                if (typeof showYouWonScreen === 'function') showYouWonScreen();
            }
        } else {
            if (typeof window.buildings !== 'undefined' && typeof window.buildingGoal !== 'undefined' && window.buildingGoal > 0 && window.buildings >= window.buildingGoal) {
                window.missionWon = true;
                if (typeof showYouWonScreen === 'function') showYouWonScreen();
            }
        }
    }

    // --- Adminmodus per Tastenkombination ALT + A ---
    let adminActive = false;
    function setAdminMode(active) {
        adminActive = active;
        if (adminActive) {
            window.wood = Number.MAX_VALUE;
            window.gold = Number.MAX_VALUE;
        } else {
            window.wood = 250;
            window.gold = 1000;
        }
        if (typeof updateResourceBar === 'function') updateResourceBar();
    }
    window.isAdminMode = () => adminActive;

    window.addEventListener('keydown', function(e) {
        if (e.altKey && (e.key === 'a' || e.key === 'A')) {
            setAdminMode(!adminActive);
        }
    });

    // Entferne den Admin-Button-Code komplett
    // ...entfernt: Admin-Button-Erstellung und zugehörige Logik...

})();
