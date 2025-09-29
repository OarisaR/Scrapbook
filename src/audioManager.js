import musicFile from './music.mp3';

class AudioManager {
  constructor() {
    this.audio = new Audio(musicFile);
    this.audio.loop = true;
    this.audio.volume = 0.7;
    this.isPlaying = false;
    this.listeners = new Set();
    
    // Set up event listeners
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
      this.pause();
    } else {
      this.play();
    }
  }
  
  addListener(callback) {
    this.listeners.add(callback);
    // Immediately notify about current state
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