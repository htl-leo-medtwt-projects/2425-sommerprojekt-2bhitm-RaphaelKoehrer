(function() {
 

    const buildSection = document.getElementById('buildSection');
    if (buildSection) {
        const originalContent = buildSection.innerHTML;


        const buildings = [
            { src: './img/build/bridge.png', alt: 'Bridge', name: 'Bridge', wood: 800, gold: 250 },
            { src: './img/build/Farm_Orc.png', alt: 'Farm', name: 'Farm', wood: 400, gold: 400 }
        ];

        let draggingFarm = false;
        let dragImg = null;
        let farmDragActive = false;

        function showOriginalBuildSection() {
            buildSection.innerHTML = originalContent;
            attachBuildIconClick();
        }

        function startFarmDrag(building) {
            if (farmDragActive) return;
            farmDragActive = true;
            dragImg = document.createElement('img');
            dragImg.src = building.src;
            dragImg.style.position = 'fixed';
            dragImg.style.pointerEvents = 'none';
            dragImg.style.width = '64px';
            dragImg.style.height = '64px';
            dragImg.style.zIndex = 9999;
            document.body.appendChild(dragImg);
            function moveAt(ev) {
                dragImg.style.left = (ev.clientX - 32) + 'px';
                dragImg.style.top = (ev.clientY - 32) + 'px';
            }
            function onMouseMove(ev) {
                if (farmDragActive && dragImg) moveAt(ev);
            }
            document.addEventListener('mousemove', onMouseMove);
            function onMapRightClick(ev) {
                if (!farmDragActive) return;
                ev.preventDefault();
                const mapPlaceholder = document.getElementById('mapPlaceholder');
                const rect = mapPlaceholder.getBoundingClientRect();
                const x = ev.clientX - rect.left;
                const y = ev.clientY - rect.top;
                const tileSize = 64;
                const tileX = Math.floor(x / tileSize);
                const tileY = Math.floor(y / tileSize);
                if (!window.map) return;
                const map = window.map;
                if (map[tileY] && (map[tileY][tileX] === 1 || map[tileY][tileX] === 2)) {
                    const farm = buildings.find(b => b.alt === 'Farm');
                    if (window.wood < farm.wood || window.gold < farm.gold) {
                        if (typeof showTreeMessage === 'function') {
                            showTreeMessage(`Farm kostet ${farm.gold} Gold und ${farm.wood} Holz`);
                        } else {
                            alert(`Farm kostet ${farm.gold} Gold und ${farm.wood} Holz`);
                        }
                        cleanup();
                        return;
                    }
                    map[tileY][tileX] = 500;
                    window.wood -= farm.wood;
                    window.gold -= farm.gold;
                    if (typeof updateResourceBar === 'function') updateResourceBar();
                    if (typeof drawMap === 'function') drawMap();
                } else {
                    if (typeof showTreeMessage === 'function') showTreeMessage('Hier kann keine Farm gebaut werden!');
                }
                cleanup();
            }
            function cleanup() {
                farmDragActive = false;
                if (dragImg) {
                    document.body.removeChild(dragImg);
                    dragImg = null;
                }
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('contextmenu', onMapRightClick, true);
            }
            document.addEventListener('contextmenu', onMapRightClick, true);
        }

        function showBridgeModal() {
            let modal = document.getElementById('bridgeModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'bridgeModal';
                modal.style.display = 'none';
                document.body.appendChild(modal);
            }
            modal.innerHTML = `
                <div class="bridge-modal-content">
                    <p>Do you want to build a Bridge?</p>
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
                if (typeof showTreeMessage === 'function') {
                    showTreeMessage(`Brücke kostet ${bridge.gold} Gold und ${bridge.wood} Holz`);
                } else {
                    alert(`Brücke kostet ${bridge.gold} Gold und ${bridge.wood} Holz`);
                }
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
                if (typeof showTreeMessage === 'function') showTreeMessage('Kein Platz für Brücke gefunden!');
                return;
            }
            const spot = possibleSpots[Math.floor(Math.random() * possibleSpots.length)];
            map[spot.y][spot.x-1] = 221;
            map[spot.y][spot.x] = 222;
            map[spot.y][spot.x+1] = 223;
            window.wood -= bridge.wood;
            window.gold -= bridge.gold;
            if (typeof updateResourceBar === 'function') updateResourceBar();
            if (typeof drawMap === 'function') drawMap();
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
                    img.addEventListener('click', (e) => {
                        startFarmDrag(building);
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
