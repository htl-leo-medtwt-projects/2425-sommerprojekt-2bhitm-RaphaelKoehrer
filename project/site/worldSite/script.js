function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const team = params.get('team');
    const username = params.get('username');

    if (team && username) {
        console.log(`Team: ${team}, Username: ${username}`);
    } else {
        alert("Username oder Team nicht gefunden!");
    }

    fadeInPage();
}

window.onload = getQueryParams;


let selectedMap = null;
let selectedResource = null;
let selectedSetting1 = null;
let selectedSetting2 = null;

function selectMap(map) {
    selectedMap = map;
    console.log(`Selected Map: ${map}`);
}

function selectResource(resource) {
    selectedResource = resource;
    console.log(`Selected Resource: ${resource}`);
}

function selectSetting1(option) {
    selectedSetting1 = option;
    console.log(`Selected Setting 1: ${option}`);
}

function selectSetting2(option) {
    selectedSetting2 = option;
    console.log(`Selected Setting 2: ${option}`);
}

function confirmSelection() {
    if (!selectedMap || !selectedResource || !selectedSetting1 || !selectedSetting2) {
        alert("Bitte wähle alles Optionen aus!");
        return;
    }
    console.log(`Map: ${selectedMap}, Resource: ${selectedResource}, Setting 1: ${selectedSetting1}, Setting 2: ${selectedSetting2}`);
}



function fadeInPage() {
    console.log("fadeInPage called"); 
    const overlay = document.getElementById('transitionOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        console.log("Overlay hidden");
    } else {
        console.error("Overlay nicht gefunden");
    }
}
