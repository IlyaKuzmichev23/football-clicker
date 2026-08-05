// export class Sound {

//     constructor() {

//         this.click = new Audio("assets/sounds/click.mp3");
//         this.buy = new Audio("assets/sounds/buy.mp3");
//         this.background = new Audio("assets/sounds/background.mp3");

//         this.background.loop = true;
//         this.background.volume = 0.15;
//         this.click.volume = 0.4;
//         this.buy.volume = 0.4;
//         this.soundEnabled = true;

//     }

//     playSound(sound) {
//         const clone = sound.cloneNode();
//         clone.volume = sound.volume;
//         clone.play();
//     }

//     playClick() {
//         if (!this.soundEnabled)
//             return;

//         this.playSound(this.click);
//     }

//     playBuy() {
//         if (!this.soundEnabled)
//             return;
//         this.playSound(this.buy);
//     }

//     playBack() {
//         this.background.play();
//     }   

//     pauseMusic() {
//         this.background.pause();
//     }

//     resumeMusic() {
//         this.background.play();
//     }

//     toggleSound() {
//         this.soundEnabled = !this.soundEnabled;
//         this.background.muted = !this.soundEnabled;
//     }
// }

export class Sound {

    constructor() {

        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        this.buffers = {
            click: null,
            buy: null,
            background: null
        };

        this.backgroundSource = null;

        this.soundEnabled = true;

        this.clickVolume = 0.4;
        this.buyVolume = 0.4;
        this.backgroundVolume = 0.15;

    }

    async loadBuffer(url) {

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        return await this.ctx.decodeAudioData(arrayBuffer);

    }

    async init() {

        this.buffers.click =
            await this.loadBuffer("assets/sounds/click.mp3");

        this.buffers.buy =
            await this.loadBuffer("assets/sounds/buy.mp3");

        this.buffers.background =
            await this.loadBuffer("assets/sounds/background.mp3");

    }

    playBuffer(buffer, volume, loop = false) {

        if (!this.soundEnabled)
            return null;

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = loop;

        const gain = this.ctx.createGain();
        gain.gain.value = volume;

        source.connect(gain);
        gain.connect(this.ctx.destination);

        source.start();

        return source;

    }

    playClick() {

        this.playBuffer(
            this.buffers.click,
            this.clickVolume
        );

    }

    playBuy() {

        this.playBuffer(
            this.buffers.buy,
            this.buyVolume
        );

    }

    playBack() {

        if (this.backgroundSource)
            return;

        this.backgroundSource = this.playBuffer(
            this.buffers.background,
            this.backgroundVolume,
            true
        );

    }

    pauseMusic() {

        if (!this.backgroundSource)
            return;

        this.backgroundSource.stop();
        this.backgroundSource = null;

    }

    resumeMusic() {

        this.playBack();

    }

    toggleSound() {

        this.soundEnabled = !this.soundEnabled;

        if (!this.soundEnabled)
            this.pauseMusic();

        else
            this.resumeMusic();

    }

}