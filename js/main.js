import { PLAYERS } from "../data/players.js";
import { Game } from "./game.js";
import { UI } from "./ui.js";
import { Effects } from "./effects.js";
import { UPGRADES } from "../data/upgrades.js";
import { Sound } from "./sound.js";
import { sound } from "./audioManager.js";
import { SDK } from "./sdk.js";

import { renderShop } from "./shop.js"; 

const loading = document.getElementById("loading-screen");
const progress = document.getElementById("loading-progress");

const sdk = new SDK();

await sdk.init();

await sdk.initPlayer();

const game = new Game(PLAYERS);

game.load();

const ui = new UI(game);

renderShop(game, ui);

ui.update();

let percent = 0;

const loader = setInterval(() => {

    percent++;

    progress.style.width = percent + "%";

    if (percent >= 100) {

        clearInterval(loader);

        loading.style.opacity = "0";

        setTimeout(() => {

            loading.remove();

        }, 300);

    }

}, 30);

const effects = new Effects(
    document.getElementById("player-container")
);

const player = document.getElementById("player");


document.addEventListener("pointerdown", () => {

    sound.playBack();

}, { once: true });

player.addEventListener("click", (event) => {

    game.click();
    sound.playClick();
    ui.update();

    const container = document.getElementById("player-container");
    const rect = container.getBoundingClientRect();

    effects.createFloatingText(
        `$${game.clickPower}`,
        event.clientX - rect.left,
        event.clientY - rect.top
    );
});

player.classList.add("click");

setTimeout(() => {
    player.classList.remove("click");
}, 80);

setInterval(() => {
    game.tickPassiveIncome();
    ui.update();
    game.save();
}, 1000);

window.addEventListener("blur", () => {

    sound.pauseMusic();

});

window.addEventListener("focus", () => {

    sound.resumeMusic();

});


const button = document.getElementById("sound-toggle");
const soundIcon = document.getElementById("sound-icon");

button.addEventListener("click", () => {
    sound.toggleSound();
    soundIcon.src = sound.soundEnabled
        ? "assets/icons/soundOn.webp"
        : "assets/icons/soundOff.webp";
});


renderShop(game, ui);

ui.update();


