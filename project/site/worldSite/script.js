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

    selectedResource = "low"; // Immer "low" als Standard
    selectedGoal = document.getElementById('goal').value;
    selectedTimeLimit = document.getElementById('timeLimit').value;
    selectedMission = document.getElementById('missions').value;

    console.log(`Default Resource: ${selectedResource}`);
    console.log(`Default Goal: ${selectedGoal}`);
    console.log(`Default Time Limit: ${selectedTimeLimit}`);
    console.log(`Default Mission: ${selectedMission}`);
};

let selectedMap = null;
let selectedResource = "low"; // Immer "low"
let selectedGoal = null;
let selectedTimeLimit = null;
let selectedMission = null;
let selectedControl = 'wasd'; // Default

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

function selectControl(control) {
    selectedControl = control;
    console.log(`Selected Control: ${control}`);
}

function confirmSelection() {
    // Username und Team aus URL holen, Fallback auf leeren String falls nicht vorhanden
    const urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('username');
    let team = urlParams.get('team');

    // Fallback: Versuche Username und Team aus localStorage zu holen, falls leer
    if (!username) {
        username = localStorage.getItem('username') || '';
    }
    if (!team) {
        team = localStorage.getItem('team') || '';
    }

    // Falls immer noch leer, versuche aus vorherigen Feldern (optional)
    // (Hier ggf. weitere Logik, falls Username irgendwo im DOM steht)

    const params = new URLSearchParams({
        map: selectedMap,
        resource: selectedResource,
        goal: selectedGoal,
        timeLimit: selectedTimeLimit,
        mission: selectedMission,
        control: selectedControl,
        username: username,
        team: team
    });

    window.location.href = `../gameSite/index.html?${params.toString()}`;
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

let countAudio = 0;
function changeAudio() {
    if (countAudio % 2 === 0 ) {
        document.getElementById('audioImg').src = '../sounds/audioImg.png';
    }else {
        document.getElementById('audioImg').src = '../sounds/mutedImg.png';
    }
   
    MusicPlayer(countAudio);
    countAudio++;
}