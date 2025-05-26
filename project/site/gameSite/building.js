(function() {
 

    const buildSection = document.getElementById('buildSection');
    const originalContent = buildSection.innerHTML;

    // Globale Power-Variable
    if (typeof window.power === 'undefined') {
        window.power = 1;
    }

    const buildings = [
        { src: './img/build/bridge.png', alt: 'Bridge', name: 'Bridge', wood: 800, gold: 250 },
        { src: './img/build/Farm_Orc.png', alt: 'Farm', name: 'Farm', wood: 400, gold: 400 },
        { src: './img/build/Tower.png', alt: 'Tower', name: 'Tower', wood: 0, gold: 1000, requires: { farm: 1, bridge: 1 } },
        { src: './img/build/Lumbermill.png', alt: 'Lumbermill', name: 'Lumbermill', wood: 600, gold: 200, requires: { farm: 1, tower: 1 } },
        { src: './img/build/Refinery.png', alt: 'Refinery', name: 'Refinery', wood: 0, gold: 800, requires: { farm: 3, lumbermill: 1 } }
    ];

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
        // missionProgress initialisieren, falls nicht vorhanden
        if (typeof window.missionProgress === 'undefined' || !window.missionProgress) {
            window.missionProgress = {};
        }
        window.missionProgress.bridge = (window.missionProgress.bridge || 0) + 1;
        if (typeof window.buildings !== 'undefined') { window.buildings++; }
        if (typeof updateResourceBar === 'function') updateResourceBar();
        if (typeof drawMap === 'function') drawMap();
        // Ressourcenanzeige updaten
        if (document.getElementById('buildingValue')) {
            document.getElementById('buildingValue').textContent = window.buildings;
        }
        if (typeof window.buildings !== 'undefined' && typeof window.buildingGoal !== 'undefined' && window.buildings == window.buildingGoal) {
            if (typeof showYouWonScreen === 'function') showYouWonScreen();
        }
        // Goldmine nach Brückenbau spawnen
        if (!window.goldmineSpawned) {
            // Suche rechts vom Fluss (x > 10) ein Tile 1 oder 2
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
        if (typeof window.buildings !== 'undefined' && typeof window.buildingGoal !== 'undefined' && window.buildings == window.buildingGoal) {
            if (typeof showYouWonScreen === 'function') showYouWonScreen();
        }
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
        if (typeof window.buildings !== 'undefined' && typeof window.buildingGoal !== 'undefined' && window.buildings == window.buildingGoal) {
            if (typeof showYouWonScreen === 'function') showYouWonScreen();
        }
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
        if (typeof window.buildings !== 'undefined' && typeof window.buildingGoal !== 'undefined' && window.buildings == window.buildingGoal) {
            if (typeof showYouWonScreen === 'function') showYouWonScreen();
        }
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
        if (typeof window.buildings !== 'undefined' && typeof window.buildingGoal !== 'undefined' && window.buildings == window.buildingGoal) {
            if (typeof showYouWonScreen === 'function') showYouWonScreen();
        }
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
        if (params.mission === 'none') {
            missionText = '<b>No Mission</b>';
        } else if (params.mission === 'mission1') {
            missionText = '<b>Mission 1</b><ul style="margin-top:8px;">'
                + '<li id="missionFarm">Baue 3 Farmen</li>'
                + '<li id="missionBridge">Baue 2 Brücken</li>'
                + '</ul>';
        } else if (params.mission === 'mission2') {
            missionText = '<b>Mission 2</b><ul style="margin-top:8px;">'
                + '<li id="missionFarm">Baue 5 Farmen</li>'
                + '<li id="missionBridge">Baue 1 Brücke</li>'
                + '</ul>';
        } else {
            missionText = '';
        }
        missionDisplay.innerHTML = missionText;
    }
    // Beim Laden anzeigen
    showMissionDisplay();
})();
