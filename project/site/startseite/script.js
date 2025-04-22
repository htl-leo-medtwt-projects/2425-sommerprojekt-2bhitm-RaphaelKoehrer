function fadeInPage() {
     const overlay = document.getElementById('transitionOverlayLoad');
     overlay.classList.add('hidden');
 }

function saveControlPreference() {
    const selectedControl = document.getElementById('controlSelect').value;
    localStorage.setItem('controlPreference', selectedControl);
}

function visitNextSite() {
    const overlay = document.getElementById('transitionOverlay');
    overlay.classList.add('active');
    const controlPreference = localStorage.getItem('controlPreference') || 'click';
    setTimeout(() => {
        window.location.href = `../configSite/index.html?control=${controlPreference}`;
    }, 500);
}

function showTut() {
     document.getElementById('tutorial').style.display = 'flex';
}

function closeTut() {
     document.getElementById('tutorial').style.display = 'none';
}

function showLeaderboard() {
     document.getElementById('leaderboard').style.display = 'flex';
 }
 
 function closeLeaderboard() {
     document.getElementById('leaderboard').style.display = 'none';
 }
 
 function showSettings() {
     document.getElementById('settings').style.display = 'flex';
 }
 
 function closeSettings() {
     document.getElementById('settings').style.display = 'none';
 }