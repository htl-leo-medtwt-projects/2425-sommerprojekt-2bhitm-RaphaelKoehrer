(function() {
 

    const buildSection = document.getElementById('buildSection');
    if (buildSection) {
        const originalContent = buildSection.innerHTML;


        const buildings = [
            { src: './img/build/bridge.png', alt: 'Bridge', name: 'Bridge', wood: 800, gold: 250 },
            { src: './img/build/Farm_Orc.png', alt: 'Farm', name: 'Farm', wood: 400, gold: 400 },
            { src: './img/build/Tower.png', alt: 'Tower', name: 'Tower', wood: 0, gold: 1000, requires: { farm: 1, bridge: 1 } }
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

        function showOriginalBuildSection() {
            buildSection.innerHTML = originalContent;
            attachBuildIconClick();
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
            if (typeof window.missionProgress !== 'undefined') {
                window.missionProgress.bridge = (window.missionProgress.bridge || 0) + 1;
            }
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
            if (typeof window.missionProgress !== 'undefined') {
                window.missionProgress.farm = (window.missionProgress.farm || 0) + 1;
            }
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
                if (!window.missionProgress || window.missionProgress.farm < tower.requires.farm || window.missionProgress.bridge < tower.requires.bridge) {
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
                    img.addEventListener('click', () => {
                        showBridgeModal();
                    });
                } else if (building.alt === 'Farm') {
                    img.addEventListener('click', () => {
                        showFarmModal();
                    });
                } else if (building.alt === 'Tower') {
                    img.addEventListener('click', () => {
                        showTowerModal();
                    });
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
                showOriginalBuildSection();
            });
            attachBuildIconClick();
        }

        function attachBuildIconClick() {
            const buildIcon = buildSection.querySelector('#buildIcon');
            if (buildIcon) {
                buildIcon.style.cursor = 'pointer';
                buildIcon.addEventListener('click', () => {
                    showBuildingOptions();
                });
            }
        }

        attachBuildIconClick();
    }
})();
