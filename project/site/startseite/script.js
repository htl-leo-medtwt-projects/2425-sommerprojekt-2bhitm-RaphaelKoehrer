function fadeInPage() {
     const overlay = document.getElementById('transitionOverlayLoad');
     overlay.classList.add('hidden');
 }


function visitNextSite() {
     window.location.href = "../configSite/index.html"; 
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

function visitNextSite() {
     const overlay = document.getElementById('transitionOverlay');
     overlay.classList.add('active');
     setTimeout(() => {
         window.location.href = "../configSite/index.html";
     }, 500); 
 }