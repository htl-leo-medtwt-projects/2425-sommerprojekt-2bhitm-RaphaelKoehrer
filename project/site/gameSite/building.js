

(function() {
 

    const buildSection = document.getElementById('buildSection');
    if (buildSection) {
        const originalContent = buildSection.innerHTML;

        function showOriginalBuildSection() {
            buildSection.innerHTML = originalContent;
            attachBuildIconClick();
        }

        function showBuildingOptions() {
            buildSection.innerHTML = '';

            const buildings = [
                { src: './img/build/bridge.png', alt: 'Bridge' }
            ];

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
        }

        let placingBridge = false;
        let bridgeElement = null;
        let bridgePlacementDirection = null; 

        function startPlacingBridge() {
            if (placingBridge) return;
            placingBridge = true;
            bridgePlacementDirection = null;

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

        function moveBridgeWithCursor(e) {
            if (!placingBridge || !bridgeElement) return;

            if (bridgePlacementDirection === 'vertical') {
                bridgeElement.style.width = 64 + 'px';
                bridgeElement.style.height = 192 + 'px';
                bridgeElement.style.left = e.pageX - 32 + 'px';
                bridgeElement.style.top = e.pageY - 96 + 'px'; 
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

            if (typeof wood === 'undefined' || typeof gold === 'undefined') return;

            if (wood < 800 || gold < 250) {
                if (typeof showTreeMessage === 'function') showTreeMessage("You need more ressources!");
                cancelPlacingBridge();
                return;
            }

            const mapPlaceholder = document.getElementById('mapPlaceholder');
            const rect = mapPlaceholder.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const tileSize = 64;
            const tileX = Math.floor(x / tileSize);
            const tileY = Math.floor(y / tileSize);

            if (tileX < 0 || tileX >= 18 || tileY < 0 || tileY >= 20) {
                if (typeof showTreeMessage === 'function') showTreeMessage("You can only place a bridge above water");
                cancelPlacingBridge();
                return;
            }

            let canPlaceHorizontal = true;
            for (let i = 0; i < 3; i++) {
                if (window.map?.[tileY]?.[tileX + i] !== 5) {
                    canPlaceHorizontal = false;
                    break;
                }
            }

            let canPlaceVertical = true;
            if (tileY > 17) canPlaceVertical = false; 
            else {
                for (let i = 0; i < 3; i++) {
                    if (window.map?.[tileY + i]?.[tileX] !== 5) {
                        canPlaceVertical = false;
                        break;
                    }
                }
            }

            if (!canPlaceHorizontal && !canPlaceVertical) {
                if (typeof showTreeMessage === 'function') showTreeMessage("You can only place a bridge above water");
                cancelPlacingBridge();
                return;
            }

            if (canPlaceHorizontal) {
                bridgePlacementDirection = 'horizontal';
                for (let i = 0; i < 3; i++) {
                    window.map[tileY][tileX + i] = 1000;
                }
            } else if (canPlaceVertical) {
                bridgePlacementDirection = 'vertical';
                for (let i = 0; i < 3; i++) {
                    window.map[tileY + i][tileX] = 1000;
                }
            }

            window.wood -= 800;
            window.gold -= 250;
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
