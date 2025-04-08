function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    const team = params.get('team');
    const map = params.get('map');
    const resource = params.get('resource');
    const goal = params.get('goal');
    const timeLimit = params.get('timeLimit');
    const mission = params.get('mission');

    console.log(`Username: ${username}`);
    console.log(`Team: ${team}`);
    console.log(`Map: ${map}`);
    console.log(`Resource: ${resource}`);
    console.log(`Goal: ${goal}`);
    console.log(`Time Limit: ${timeLimit}`);
    console.log(`Mission: ${mission}`);

    document.getElementById('usernameDisplay').textContent = `Username: ${username}`;
    document.getElementById('teamDisplay').textContent = `Team: ${team}`;
    document.getElementById('mapDisplay').textContent = `Map: ${map}`;
    document.getElementById('resourceDisplay').textContent = `Resource: ${resource}`;
    document.getElementById('goalDisplay').textContent = `Goal: ${goal}`;
    document.getElementById('timeLimitDisplay').textContent = `Time Limit: ${timeLimit}`;
    document.getElementById('missionDisplay').textContent = `Mission: ${mission}`;
}

function fadeInPage() {
    console.log("fadeInPage called");
    const overlay = document.getElementById('transitionOverlay');
    if (overlay) {
        overlay.classList.add('hidden'); 
        console.log("Overlay hidden");
    } else {
        console.error("Overlay not found");
    }
}

window.onload = function () {
    fadeInPage();
    getQueryParams();
};