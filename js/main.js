import { PLAYERS } from "../data/players.js";
import { Game } from "./game.js";
import { UI } from "./ui.js";
import { Effects } from "./effects.js";
import { UPGRADES } from "../data/upgrades.js";
import { Sound } from "./sound.js";
import { sound } from "./audioManager.js";
import { SDK } from "./sdk.js";

import { renderShop } from "./shop.js"; 


async function loadYandexSDK(){
    const isLocal=
        location.hostname==="127.0.0.1"||
        location.hostname==="localhost";

    if(isLocal)
        return;

    await new Promise(resolve=>{
        const script=document.createElement("script");
        script.src="https://yandex.ru/games/sdk/v2";
        script.onload=resolve;
        script.onerror=()=>{
            console.error("Не удалось загрузить SDK");
            resolve();
        };
        document.head.appendChild(script);
    });
}

async function saveGame(){
    if(sdk.isAuthorized()){
        await sdk.save(game.getSaveData());
    }else{
        localStorage.setItem(
            "football-clicker-save",
            JSON.stringify(game.getSaveData())
        );
    }
}

async function loadGame(game){
    if(sdk.isAuthorized()){
        game.loadSaveData(await sdk.load());
    }else{
        const data=JSON.parse(localStorage.getItem("football-clicker-save"));
        game.loadSaveData(data);
    }
}

const loading = document.getElementById("loading-screen");
const progress = document.getElementById("loading-progress");


await loadYandexSDK();

const sdk = new SDK();
await sdk.init();
await sdk.initPlayer();
const game = new Game(PLAYERS);
await loadGame(game);

const ui = new UI(game);
renderShop(game, ui);
ui.update();

let percent = 0;

const loader = setInterval(async () => {
    percent++;
    progress.style.width = percent + "%";
    if(percent>=100){
        clearInterval(loader);
        loading.style.opacity="0";
        setTimeout(async ()=>{
            loading.remove();
            await sdk.showFullscreenAd(game);
            document.getElementById("game").style.visibility="visible";
            ui.update();
            sdk.gameReady();
        },300);
    }
},30);

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
    saveGame(game);
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

document.getElementById("reward-ad").addEventListener("click",()=>{
    sdk.showRewardedAd(()=>{
        game.startAdBoost();
        ui.update();
    });
});

renderShop(game, ui);

ui.update();


