function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const team = params.get('team');
    const username = params.get('username');
    const control = params.get('control');

    if (team && username && control) {
        console.log(`Team: ${team}, Username: ${username}, Control: ${control}`);
    } else {
        alert("Username, Team oder Steuerung nicht gefunden!");
    }

    fadeInPage();
}

window.onload = function () {
    getQueryParams();

    selectedResource = document.getElementById('resource').value;
    selectedGoal = document.getElementById('goal').value;
    selectedTimeLimit = document.getElementById('timeLimit').value;
    selectedMission = document.getElementById('missions').value;

    console.log(`Default Resource: ${selectedResource}`);
    console.log(`Default Goal: ${selectedGoal}`);
    console.log(`Default Time Limit: ${selectedTimeLimit}`);
    console.log(`Default Mission: ${selectedMission}`);
};

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
    if (!selectedMap) {
        alert("Bitte wähle eine Karte aus!");
        return;
    }
    if (!selectedResource) {
        alert("Bitte wähle eine Ressource aus!");
        return;
    }
    if (!selectedGoal) {
        alert("Bitte wähle ein Ziel aus!");
        return;
    }
    if (!selectedTimeLimit) {
        alert("Bitte wähle ein Zeitlimit aus!");
        return;
    }
    if (!selectedMission) {
        alert("Bitte wähle eine Mission aus!");
        return;
    }

    console.log(`Map: ${selectedMap}, Resource: ${selectedResource}, Goal: ${selectedGoal}, Time Limit: ${selectedTimeLimit}, Mission: ${selectedMission}`);

    const overlay = document.getElementById('transitionOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.classList.add('active'); 

        setTimeout(() => {
            const params = new URLSearchParams({
                username: new URLSearchParams(window.location.search).get('username'),
                team: new URLSearchParams(window.location.search).get('team'),
                control: new URLSearchParams(window.location.search).get('control'),
                map: selectedMap,
                resource: selectedResource,
                goal: selectedGoal,
                timeLimit: selectedTimeLimit,
                mission: selectedMission
            });
            window.location.href = `../gameSite/index.html?${params.toString()}`;
        }, 500); 
    } else {
        console.error("Overlay nicht gefunden");
    }
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