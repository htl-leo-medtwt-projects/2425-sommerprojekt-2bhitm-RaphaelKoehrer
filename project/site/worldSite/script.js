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
let selectedGoal = null;
let selectedTimeLimit = null;
let selectedMission = null;

function selectMap(map) {
    selectedMap = map;
    console.log(`Selected Map: ${map}`);

    const mapCards = document.querySelectorAll('.map-card');

    mapCards.forEach(card => {
        if (card.getAttribute('onclick').includes(map)) {
            card.classList.add('selected'); 
            card.classList.remove('dimmed'); 
        } else {
            card.classList.remove('selected'); 
            card.classList.add('dimmed'); 
        }
    });
}

function selectResource(resource) {
    selectedResource = resource;
    console.log(`Selected Resource: ${resource}`);
}

function selectGoal(goal) {
    selectedGoal = goal;
    console.log(`Selected Goal: ${goal}`);
}

function selectTimeLimit(timeLimit) {
    selectedTimeLimit = timeLimit;
    console.log(`Selected Time Limit: ${timeLimit}`);
}

function selectMission(mission) {
    selectedMission = mission;
    console.log(`Selected Mission: ${mission}`);
}

function confirmSelection() {
    if (!selectedMap || !selectedResource || !selectedGoal || !selectedTimeLimit || !selectedMission) {
        alert("Bitte wähle alle Optionen aus!");
        return;
    }
    console.log(`Map: ${selectedMap}, Resource: ${selectedResource}, Goal: ${selectedGoal}, Time Limit: ${selectedTimeLimit}, Mission: ${selectedMission}`);
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