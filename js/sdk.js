export class SDK {

    constructor() {

        this.ysdk = null;
        this.player = null;
    }

    async init() {

        if (typeof YaGames === "undefined") {

            console.log("Локальный режим");

            return;

        }

        this.ysdk = await YaGames.init();

        console.log("SDK загружен");

    }

    async initPlayer() {

        if (!this.ysdk)
            return;

        this.player = await this.ysdk.getPlayer();

        console.log("Игрок получен");

    }

}