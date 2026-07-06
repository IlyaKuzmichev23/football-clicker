export class Sound {

    constructor() {

        this.click = new Audio("assets/sounds/click.mp3");
        this.buy = new Audio("assets/sounds/buy.mp3");
        this.background = new Audio("assets/sounds/background.mp3");

        this.background.loop = true;
        this.background.volume = 0.15;
        this.click.volume = 0.4;
        this.buy.volume = 0.4;
        this.soundEnabled = true;

    }

    playSound(sound) {
        const clone = sound.cloneNode();
        clone.volume = sound.volume;
        clone.play();
    }

    playClick() {
        if (!this.soundEnabled)
            return;

        this.playSound(this.click);
    }

    playBuy() {
        if (!this.soundEnabled)
            return;
        console.log(this.soundEnabled);
        this.playSound(this.buy);
    }

    playBack() {
        this.background.play();
    }   

    pauseMusic() {
        this.background.pause();
    }

    resumeMusic() {
        this.background.play();
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.background.muted = !this.soundEnabled;
    }
}