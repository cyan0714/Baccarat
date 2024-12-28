class AudioService {
  private dealSound: HTMLAudioElement;
  private extraCardSound: HTMLAudioElement;

  constructor() {
    this.dealSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2359/2359-preview.mp3');
    this.extraCardSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
  }

  async playDealSound() {
    this.dealSound.currentTime = 0;
    await this.dealSound.play();
  }

  async playExtraCardSound() {
    this.extraCardSound.currentTime = 0;
    await this.extraCardSound.play();
  }
}

export const audioService = new AudioService(); 
