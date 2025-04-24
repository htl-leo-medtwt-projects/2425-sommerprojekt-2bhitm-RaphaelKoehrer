
const music = new Howl({
    src: ['../sounds/main_theme.mp3'],  
    html5: true,                      
    loop: true,
    volume: 0.25
  });

  const clickSound = new Howl({
    src: ['../sounds/click.mp3'],
    html5: true,
    volume: 0.5

  });

  const humanWork = new Howl({
    src: ['../sounds/humanWork.wav'],
    html5: true,
    volume: 0.65

  });
  const orcWork = new Howl({
    src: ['../sounds/orcWork.mp3'],
    html5: true,
    volume: 0.65

  });

  function startMusicOnce() {
    if (!music.playing()) {
      const saved = parseFloat(localStorage.getItem('musicTime')) || 0;
      music.seek(saved);
      music.play();
      document.removeEventListener('click', startMusicOnce);
    }
  }


  function MusicPlayer(count) {
    if (count % 2 === 0) {
      startMusicOnce();
    }else {
      if (music.playing()) {
        localStorage.setItem('musicTime', music.seek());
      }
      music.pause();
    }
  }
  


  window.addEventListener('beforeunload', () => {
    if (music.playing()) {
      localStorage.setItem('musicTime', music.seek());
    }
  });


  function clickSoundEffect() {
    clickSound.play();
  }
  
  document.querySelectorAll('.map-card, .setting-dropdown, #customButton, #tut, #start, #tutCloseBtn, #settingsDiv, #leaderBoardDiv, #settingsCloseBtn, #leaderboardClose, #humanBtn, #orcBtn, #done, #menuButton')
  .forEach(el => {
    el.addEventListener('click', function() {
        clickSoundEffect();
    });
});


function humanWorkSound() { 
humanWork.play();
}

function orcWorkSound() { 
  orcWork.play();
  }



