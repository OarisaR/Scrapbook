import musicFile from './music.mp3';

class AudioManager {
  constructor() {
    this.audio = new Audio(musicFile);
    this.audio.loop = true;
    this.audio.volume = 0.7;
    this.isPlaying = false;
    this.userMuted = localStorage.getItem('scrapbook_music_muted') === 'true';
    this.listeners = new Set();
    

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyListeners();
    });
    
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyListeners();
    });
  }
  
  async play() {
    if (this.userMuted) {
  return false;
}
    try {
      await this.audio.play();
      return true;
    } catch (error) {
      console.log('Audio play failed:', error);
      return false;
    }
  }
  
  pause() {
    this.audio.pause();
  }
  
  toggle() {
  if (this.isPlaying) {
    this.userMuted = true;
    localStorage.setItem('scrapbook_music_muted', 'true');
    this.pause();
    this.notifyListeners(); // force sync
  } else {
    this.userMuted = false;
    localStorage.setItem('scrapbook_music_muted', 'false');
    this.play();
  }
}
  addListener(callback) {
    this.listeners.add(callback);
  
    callback(this.isPlaying);
  }
  
  removeListener(callback) {
    this.listeners.delete(callback);
  }
  
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.isPlaying));
  }
}

// Create single instance
export const audioManager = new AudioManager();