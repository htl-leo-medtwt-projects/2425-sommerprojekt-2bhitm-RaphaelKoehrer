(function() {
    const buildSection = document.getElementById('buildSection');
    if (buildSection) {
        const originalContent = buildSection.innerHTML;

        const buildings = [
            { src: './img/build/bridge.png', alt: 'Bridge', name: 'Bridge', wood: 800, gold: 250 },
            { src: './img/build/Farm_Orc.png', alt: 'Farm_Orc', name: 'Farm Orc', wood: 200, gold: 500 }
        ];

        let placingBridge = false;
        let bridgeElement = null;
        let bridgePlacementDirection = null; 

        let placingFarmOrc = false;
        let farmOrcElement = null;

        function showOriginalBuildSection() {
            buildSection.innerHTML = originalContent;
            attachBuildIconClick();
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
                        startPlacingBridge();
                    });
                }
                if (building.alt === 'Farm_Orc') {
                    img.addEventListener('click', () => {
                        showFarmPriceScreen();
                        startPlacingFarmOrc();
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

        function startPlacingBridge() {
            if (placingBridge) return;
            placingBridge = true;
            bridgePlacementDirection = null;

            showBridgePriceScreen();

            bridgeElement = document.createElement('img');
            bridgeElement.src = './img/build/bridge.png';
            bridgeElement.alt = 'Bridge';
            bridgeElement.style.position = 'absolute';
            bridgeElement.style.pointerEvents = 'none';
            bridgeElement.style.zIndex = '10000';

            bridgeElement.style.width = '192px'; 
            bridgeElement.style.height = '64px';
            document.body.appendChild(bridgeElement);

            document.addEventListener('mousemove', moveBridgeWithCursor);
            document.addEventListener('contextmenu', placeBridgeOnClick);
        }

        function cancelPlacingBridge() {
            placingBridge = false;
            bridgePlacementDirection = null;
            if (bridgeElement) {
                document.body.removeChild(bridgeElement);
                bridgeElement = null;
            }
            document.removeEventListener('mousemove', moveBridgeWithCursor);
            document.removeEventListener('contextmenu', placeBridgeOnClick);

            showBuildingOptions();
        }

        function showBridgePriceScreen() {
            buildSection.innerHTML = '';

            const bridge = buildings.find(b => b.alt === 'Bridge');
            if (!bridge) {
                console.log("Bridge building not found in buildings array");
                return;
            }

            const priceDiv = document.createElement('div');
            priceDiv.style.color = 'white';
            priceDiv.style.fontFamily = "'custom'";
            priceDiv.style.fontSize = '2rem';
            priceDiv.style.padding = '20px';
            priceDiv.style.textAlign = 'center';

            const img = document.createElement('img');
            img.src = bridge.src;
            img.alt = bridge.alt;
            img.style.width = '96px';
            img.style.height = '32px';
            img.style.display = 'block';
            img.style.margin = '0 auto 20px auto';

            buildSection.appendChild(img);

            priceDiv.innerHTML = `
                <p>Wood: ${bridge.wood}</p>
                <p>Gold: ${bridge.gold}</p>
            `;

            buildSection.appendChild(priceDiv);
        }

        function showFarmPriceScreen() {
            buildSection.innerHTML = '';

            const farm = buildings.find(b => b.alt === 'Farm_Orc');
            if (!farm) {
                console.log("Farm building not found in buildings array");
                return;
            }

            const priceDiv = document.createElement('div');
            priceDiv.style.color = 'white';
            priceDiv.style.fontFamily = "'custom'";
            priceDiv.style.fontSize = '2rem';
            priceDiv.style.padding = '20px';
            priceDiv.style.textAlign = 'center';

            const img = document.createElement('img');
            img.src = farm.src;
            img.alt = farm.alt;
            img.style.width = '96px';
            img.style.height = '96px';
            img.style.display = 'block';
            img.style.margin = '0 auto 20px auto';

            buildSection.appendChild(img);

            priceDiv.innerHTML = `
                <p>Wood: ${farm.wood}</p>
                <p>Gold: ${farm.gold}</p>
            `;

            buildSection.appendChild(priceDiv);
        }

        function moveBridgeWithCursor(e) {
            if (!placingBridge || !bridgeElement) return;

            if (bridgePlacementDirection === 'vertical') {
                bridgeElement.style.width = '64px';
                bridgeElement.style.height = '192px';
                bridgeElement.style.left = (e.pageX - 32) + 'px';
                bridgeElement.style.top = (e.pageY - 32) + 'px'; 
            } else {
                bridgeElement.style.width = '192px';
                bridgeElement.style.height = '64px';
                bridgeElement.style.left = (e.pageX - 96) + 'px'; 
                bridgeElement.style.top = (e.pageY - 32) + 'px';
            }
        }

        function moveFarmOrcWithCursor(e) {
            if (!placingFarmOrc || !farmOrcElement) return;

            const mapPlaceholder = document.getElementById('mapPlaceholder');
            if (!mapPlaceholder) return;

            const rect = mapPlaceholder.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            farmOrcElement.style.left = (x - 96) + 'px';
            farmOrcElement.style.top = (y - 96) + 'px';
        }

        function startPlacingFarmOrc() {
            if (placingFarmOrc) return;
            placingFarmOrc = true;

            showFarmPriceScreen();

            farmOrcElement = document.createElement('img');
            farmOrcElement.src = './img/build/Farm_Orc.png';
            farmOrcElement.alt = 'Farm_Orc';
            farmOrcElement.style.position = 'absolute';
            farmOrcElement.style.pointerEvents = 'none';
            farmOrcElement.style.zIndex = '10000';
            farmOrcElement.style.width = '192px';
            farmOrcElement.style.height = '192px';

            const mapPlaceholder = document.getElementById('mapPlaceholder');
            if (mapPlaceholder) {
                mapPlaceholder.appendChild(farmOrcElement);
            } else {
                document.body.appendChild(farmOrcElement);
            }

            document.addEventListener('mousemove', moveFarmOrcWithCursor);
            document.addEventListener('contextmenu', placeFarmOrcOnClick);
        }

        function placeBridgeOnClick(e) {
            if (!placingBridge) return;
            e.preventDefault();

            if (typeof wood === 'undefined' || typeof gold === 'undefined') {
                console.log("wood or gold undefined", wood, gold);
                return;
            }

            const bridge = buildings.find(b => b.alt === 'Bridge');
            if (!bridge) {
                console.log("Bridge building not found in buildings array");
                cancelPlacingBridge();
                return;
            }

            if (window.wood < bridge.wood || window.gold < bridge.gold) {
                if (typeof showTreeMessage === 'function') {
                    showTreeMessage(`Brücke kostet ${bridge.gold} Gold und ${bridge.wood} Holz`);
                } else {
                    alert(`Brücke kostet ${bridge.gold} Gold und ${bridge.wood} Holz`);
                }
                cancelPlacingBridge();
                return;
            }

            const mapPlaceholder = document.getElementById('mapPlaceholder');
            const rect = mapPlaceholder.getBoundingClientRect();
            const x = e.pageX - rect.left;
            const y = e.pageY - rect.top;

            const tileSize = 64;
            const tileX = Math.floor(x / tileSize);
            const tileY = Math.floor(y / tileSize);

            if (!window.map) {
                console.log("window.map is undefined");
                return;
            }

            if (tileX < 0 || tileX >= window.map[0]?.length || tileY < 0 || tileY >= window.map.length) {
                if (typeof showTreeMessage === 'function') showTreeMessage("Du kannst die Brücke nur über Wasser platzieren");
                cancelPlacingBridge();
                return;
            }

            if (window.map[tileY][tileX] === 5) {
                if (tileX - 1 < 0 || tileX + 1 >= window.map[0].length) {
                    if (typeof showTreeMessage === 'function') showTreeMessage("Nicht genug Platz für die Brücke");
                    cancelPlacingBridge();
                    return;
                }
                bridgePlacementDirection = 'horizontal';
                window.map[tileY][tileX - 1] = 221;
                window.map[tileY][tileX] = 222;
                window.map[tileY][tileX + 1] = 223;
            } else {
                if (typeof showTreeMessage === 'function') showTreeMessage("Du kannst die Brücke nur über Wasser platzieren");
                cancelPlacingBridge();
                return;
            }

            window.wood -= bridge.wood;
            window.gold -= bridge.gold;
            if (typeof updateResourceBar === 'function') updateResourceBar();

            if (typeof drawMap === 'function') drawMap();

            cancelPlacingBridge();
        }

        function placeFarmOrcOnClick(e) {
            if (!placingFarmOrc) return;
            e.preventDefault();

            const farm = buildings.find(b => b.alt === 'Farm_Orc');
            if (!farm) {
                cancelPlacingFarmOrc();
                return;
            }

            const mapPlaceholder = document.getElementById('mapPlaceholder');
            const rect = mapPlaceholder.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;


            if (window.wood < farm.wood || window.gold < farm.gold) {
                if (typeof showTreeMessage === 'function') {
                    showTreeMessage(`Farm kostet ${farm.gold} Gold und ${farm.wood} Holz`);
                } else {
                    alert(`Farm kostet ${farm.gold} Gold und ${farm.wood} Holz`);
                }
                cancelPlacingFarmOrc();
                return;
            }


            if (!window.map) {
                console.log("window.map is undefined");
                cancelPlacingFarmOrc();
                return;
            }

            const tileSize = 64;
            const tileX = Math.floor(x / tileSize);
            const tileY = Math.floor(y / tileSize);

            if (tileX < 0 || tileX >= window.map[0]?.length || tileY < 0 || tileY >= window.map.length) {
                if (typeof showTreeMessage === 'function') showTreeMessage("Ungültiger Platz für die Farm");
                cancelPlacingFarmOrc();
                return;
            }

            // Do not modify map array; keep tiles intact

            // Remove farm preview element
            if (farmOrcElement && farmOrcElement.parentNode) {
                farmOrcElement.parentNode.removeChild(farmOrcElement);
                farmOrcElement = null;
            }

            // Add farm position to global placed farms array
            if (!window.placedFarms) {
                window.placedFarms = [];
            }
            window.placedFarms.push({ x: tileX, y: tileY });

            // Deduct resources
            window.wood -= farm.wood;
            window.gold -= farm.gold;
            if (typeof updateResourceBar === 'function') updateResourceBar();

            // Remove event listeners
            placingFarmOrc = false;
            document.removeEventListener('mousemove', moveFarmOrcWithCursor);
            document.removeEventListener('contextmenu', placeFarmOrcOnClick);

            // Redraw map and render farms
            if (typeof drawMap === 'function') drawMap();
            if (typeof renderFarms === 'function') renderFarms();
        }

        function cancelPlacingFarmOrc() {
            placingFarmOrc = false;
            if (farmOrcElement) {
                if (farmOrcElement.parentNode) {
                    farmOrcElement.parentNode.removeChild(farmOrcElement);
                }
                farmOrcElement = null;
            }
            document.removeEventListener('mousemove', moveFarmOrcWithCursor);
            document.removeEventListener('contextmenu', placeFarmOrcOnClick);

            showBuildingOptions();
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

        function updateResourceDisplayLoop() {
            if (typeof window.wood !== 'undefined' && typeof window.gold !== 'undefined') {
                wood = window.wood;
                gold = window.gold;
            }

            if (typeof updateResourceBar === 'function') {
                updateResourceBar();
            }
            requestAnimationFrame(updateResourceDisplayLoop);
        }

        attachBuildIconClick();
        updateResourceDisplayLoop();

        // Render farms on map overlay
        window.renderFarms = function() {
            const mapPlaceholder = document.getElementById('mapPlaceholder');
            if (!mapPlaceholder || !window.placedFarms) return;

            // Remove existing farm overlays
            const existingFarms = mapPlaceholder.querySelectorAll('.farmOverlay');
            existingFarms.forEach(farm => farm.remove());

            window.placedFarms.forEach(farmPos => {
                const farmImg = document.createElement('img');
                farmImg.src = './img/build/Farm_Orc.png';
                farmImg.alt = 'Farm_Orc';
                farmImg.classList.add('farmOverlay');
                farmImg.style.position = 'absolute';
                farmImg.style.width = '128px'; // Adjust size as needed
                farmImg.style.height = '128px';
                farmImg.style.left = (farmPos.x * 64) + 'px';
                farmImg.style.top = (farmPos.y * 64) + 'px';
                farmImg.style.pointerEvents = 'none';
                mapPlaceholder.appendChild(farmImg);
            });
        };
    }
})();
