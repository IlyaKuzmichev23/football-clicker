import { PLAYERS } from "../data/players.js";
import { UPGRADES } from "../data/upgrades.js";
import { Sound } from "./sound.js";
import { sound } from "./audioManager.js";

let currentTab = "players";

export function renderShop(game, ui) {

    const playersTab = document.getElementById("players-tab");
    const upgradesTab = document.getElementById("upgrades-tab");

    playersTab.onclick = () => {
        currentTab = "players";
        renderShop(game, ui);
    };

    upgradesTab.onclick = () => {
        currentTab = "upgrades";
        renderShop(game, ui);
    };

    playersTab.classList.toggle("active", currentTab === "players");
    upgradesTab.classList.toggle("active", currentTab === "upgrades");

    document.getElementById("player-list").hidden = currentTab !== "players";
    document.getElementById("upgrade-list").hidden = currentTab !== "upgrades";

    renderPlayers(game, ui);
    renderUpgrades(game, ui);
}

function renderPlayers(game, ui) {

    const container = document.getElementById("player-list");

    container.innerHTML = "";

    PLAYERS.forEach(player => {

        const card = document.createElement("div");
        card.className = "player-card";

        card.innerHTML = `
            <img src="${player.image}">

            <h3>${player.name}</h3>

            <div class="card-info">

                <span>
                    <img src="assets/icons/multiplier.webp" class="icon icon-multiplier">
                    ${player.multiplier}
                </span>

                <span>
                    <img src="assets/icons/dollar.webp" class="icon icon-money">
                    $${player.price}
                </span>

            </div>
        `;

        if (game.isPlayerOwned(player.id)) {

            card.classList.add("owned");

        }

        if (game.currentPlayer === player.id) {

            card.classList.add("selected");

        }

        const button = document.createElement("button");

        button.className = "game-button";

        if (!game.isPlayerOwned(player.id)) {

            button.textContent = "Купить";

        } else if (game.currentPlayer === player.id) {

            button.textContent = "Выбран";
            button.disabled = true;

        } else {

            button.textContent = "Выбрать";

        }

        button.addEventListener("click", () => {
            if (game.isPlayerOwned(player.id)) {
                game.selectPlayer(player.id);
                ui.update();
                renderShop(game, ui);

                return;
            }

            if (!game.buyPlayer(player))
                return;
            sound.playBuy();
            ui.update();
            renderShop(game, ui);

        });

        card.append(button);

        container.append(card);

    });

}

function renderUpgrades(game, ui) {

    const container = document.getElementById("upgrade-list");

    container.innerHTML = "";

    UPGRADES.forEach(upgrade => {

        const card = document.createElement("div");

        card.className = "upgrade-card";

        card.innerHTML = `
            <img src="${upgrade.image}">

            <h3>${upgrade.name}</h3>

            <div class="card-info">

                <span>
                    <img
                        src="assets/icons/bonus.webp"
                        class="icon icon-bonus"
                    >
                    ${upgrade.type === "click"
                        ? `+$${upgrade.bonus}/клик`
                        : `+$${upgrade.bonus}/сек`
                    }
                </span>

                <span>
                    <img
                        src="assets/icons/dollar.webp"
                        class="icon icon-money"
                    >
                    $${game.getUpgradePrice(upgrade)}
                </span>

            </div>

            <div class="upgrade-level">

                Уровень ${game.getUpgradeLevel(upgrade.id)}

            </div>
        `;

        const button = document.createElement("button");

        button.className = "game-button";

        if (game.getUpgradeLevel(upgrade.id) > 0) {

            card.classList.add("owned");

        }

        button.textContent = "Купить";

        button.addEventListener("click", () => {

            if (!game.buyUpgrade(upgrade))
                return;

            sound.playBuy();

            ui.update();

            renderShop(game, ui);

        });

        card.append(button);

        container.append(card);

    });
}