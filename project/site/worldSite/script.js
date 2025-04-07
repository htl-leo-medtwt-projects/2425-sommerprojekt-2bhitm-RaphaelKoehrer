function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const team = params.get('team');
    const username = params.get('username');

    if (team && username) {
        console.log(`Team: ${team}, Username: ${username}`);
    } else {
        alert("Missing team or username!");
    }
}

window.onload = getQueryParams;


 function fadeInPage() {
     const overlay = document.getElementById('transitionOverlay');
     overlay.classList.add('hidden');
 }