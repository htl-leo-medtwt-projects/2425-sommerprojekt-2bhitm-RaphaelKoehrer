
const music = new Howl({
    src: ['../sounds/main_theme.mp3'],  
    html5: true,                      
    loop: true,
    volume: 1.0
  });
  
  function startMusicOnce() {
    if (!music.playing()) {
      const saved = parseFloat(localStorage.getItem('musicTime')) || 0;
      music.seek(saved);
      music.play();
      document.removeEventListener('click', startMusicOnce);
    }
  }
  document.addEventListener('click', startMusicOnce);
  
  window.addEventListener('beforeunload', () => {
    if (music.playing()) {
      localStorage.setItem('musicTime', music.seek());
    }
  });
  