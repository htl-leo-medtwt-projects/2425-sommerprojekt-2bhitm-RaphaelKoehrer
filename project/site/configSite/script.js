function chooseTeam(team) {
     const humanButton = document.querySelector("#chooseTeam div:nth-child(2) p");
     const orcButton = document.querySelector("#chooseTeam div:nth-child(3) p");
 
     if (team === 'human') {
          humanButton.classList.remove("yellow");
          orcButton.classList.remove("yellow");
          document.getElementById('humanBtn').src = "./img/Button_lightNew.png";
          document.getElementById('orcBtn').src = "./img/Button_dark.png";

          humanButton.classList.remove("gray");
         humanButton.classList.add("white");
         orcButton.classList.remove("white");
         orcButton.classList.add("gray");
     } else if (team === 'orc') {
          humanButton.classList.remove("yellow");
          orcButton.classList.remove("yellow");
          document.getElementById('humanBtn').src = "./img/Button_dark.png";
          document.getElementById('orcBtn').src = "./img/Button_lightNew.png";

          humanButton.classList.remove("white");
          humanButton.classList.add("gray");
          orcButton.classList.remove("gray");
          orcButton.classList.add("white");
     }
 }


 function goToNextPage() {
    const username = document.getElementById('usernameInput').value;
    const humanSelected = document.getElementById('humanBtn').src.includes("Button_lightNew");
    const orcSelected = document.getElementById('orcBtn').src.includes("Button_lightNew");

    let team = '';
    if (humanSelected) {
        team = 'human';
    } else if (orcSelected) {
        team = 'orc';
    }

    if (!username || !team) {
        alert("Please select a team and enter a username.");
        return;
    }

    const controlPreference = new URLSearchParams(window.location.search).get('control') || 'click';

    const overlay = document.getElementById('transitionOverlay');
    overlay.classList.add('active');

    setTimeout(() => {
        window.location.href = `../worldSite/index.html?team=${team}&username=${encodeURIComponent(username)}&control=${controlPreference}`;
    }, 500); 
}

 function fadeInPage() {
     const overlay = document.getElementById('transitionOverlay');
     overlay.classList.add('hidden');
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