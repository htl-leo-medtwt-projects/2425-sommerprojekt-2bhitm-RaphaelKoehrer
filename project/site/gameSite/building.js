

(function() {
 

    const buildSection = document.getElementById('buildSection');
    if (buildSection) {
        const originalContent = buildSection.innerHTML;


        const buildings = [
            { src: './img/build/bridge.png', alt: 'Bridge', name: 'Bridge', wood: 800, gold: 250 }
        ];

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

        let placingBridge = false;
        let bridgeElement = null;
        let bridgePlacementDirection = null; 

        function startPlacingBridge() {
            console.log("startPlacingBridge called, placingBridge:", placingBridge);
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

            bridgeElement.style.width = 192 + 'px'; 
            bridgeElement.style.height = 64 + 'px';
            document.body.appendChild(bridgeElement);

            document.addEventListener('mousemove', moveBridgeWithCursor);
            document.addEventListener('contextmenu', placeBridgeOnClick);
        }

        function cancelPlacingBridge() {
            console.log("cancelPlacingBridge called");
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

        function moveBridgeWithCursor(e) {
            if (!placingBridge || !bridgeElement) return;

            if (bridgePlacementDirection === 'vertical') {
                bridgeElement.style.width = 64 + 'px';
                bridgeElement.style.height = 192 + 'px';
                bridgeElement.style.left = e.pageX - 32 + 'px';
                bridgeElement.style.top = e.pageY - 32 + 'px'; 
            } else {
                bridgeElement.style.width = 192 + 'px';
                bridgeElement.style.height = 64 + 'px';
                bridgeElement.style.left = e.pageX - 96 + 'px'; 
                bridgeElement.style.top = e.pageY - 32 + 'px';
            }
        }

        function placeBridgeOnClick(e) {
            if (!placingBridge) return;
            e.preventDefault();

            console.log("placeBridgeOnClick triggered");

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
                console.log("Not enough resources");
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

            console.log("Clicked tile:", tileX, tileY);

            if (!window.map) {
                console.log("window.map is undefined");
                return;
            }
            console.log("Map dimensions:", window.map.length, window.map[0]?.length);

            if (tileX < 0 || tileX >= window.map[0]?.length || tileY < 0 || tileY >= window.map.length) {
                if (typeof showTreeMessage === 'function') showTreeMessage("Du kannst die Brücke nur über Wasser platzieren");
                cancelPlacingBridge();
                return;
            }

            if (window.map[tileY][tileX] === 5) {
                if (tileX - 1 < 0 || tileX + 1 >= window.map[0].length) {
                    console.log("Not enough space to place bridge horizontally");
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

        function cancelPlacingBridge() {
            placingBridge = false;
            bridgePlacementDirection = null;
            if (bridgeElement) {
                document.body.removeChild(bridgeElement);
                bridgeElement = null;
            }
            document.removeEventListener('mousemove', moveBridgeWithCursor);
            document.removeEventListener('contextmenu', placeBridgeOnClick);

            // Restore buildSection menu after placing bridge
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

        attachBuildIconClick();
    }
})();
