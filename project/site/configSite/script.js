
function visitNextSite() {
     window.location.href = "../configSite/index.html"; 
} 


function showTut() {
     document.getElementById('tutorial').style.display = 'flex';
}
function chooseTeam(team) {
     const humanButton = document.querySelector("#chooseTeam div:nth-child(2) p");
     const orcButton = document.querySelector("#chooseTeam div:nth-child(3) p");
 
     if (team === 'human') {
          humanButton.classList.remove("yellow");
          orcButton.classList.remove("yellow");
          document.getElementById('humanBtn').src = "./img/Button_light.png";
          document.getElementById('orcBtn').src = "./img/Button_dark.png";

          humanButton.classList.remove("gray");
         humanButton.classList.add("white");
         orcButton.classList.remove("white");
         orcButton.classList.add("gray");
     } else if (team === 'orc') {
          humanButton.classList.remove("yellow");
          orcButton.classList.remove("yellow");
          document.getElementById('humanBtn').src = "./img/Button_dark.png";
          document.getElementById('orcBtn').src = "./img/Button_light.png";

          humanButton.classList.remove("white");
          humanButton.classList.add("gray");
          orcButton.classList.remove("gray");
          orcButton.classList.add("white");
     }
 }