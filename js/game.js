import { UPGRADES } from "../data/upgrades.js";

export class Game {

    constructor(players) {
        this.players = players;
        this.passiveIncome = 0;
        this.score = 0;

        this.baseClick = 1;
        this.upgradeBonus = 0;
        this.currentPlayer = 0;
        this.ownedPlayers = [0];
        this.upgradeLevels = {};
    }

    get clickPower() {
        return (this.baseClick+this.upgradeBonus)*this.multiplier;
    }

    get multiplier() {
        return this.players[this.currentPlayer].multiplier;
    }

    get passiveMoney(){
        return this.passiveIncome*this.multiplier;
    }

    click() {
        this.score += this.clickPower;
    }

    isPlayerOwned(playerId) {
        return this.ownedPlayers.includes(playerId);
    }

    startAdBoost(){
        this.adMultiplier=2;
        this.adTimer=60;
    }

    buyPlayer(player) {

        if (this.isPlayerOwned(player.id))
            return false;

        if (this.score < player.price)
            return false;

        this.score -= player.price;

        this.ownedPlayers.push(player.id);

        this.currentPlayer = player.id;

        return true;
    }

    selectPlayer(playerId) {

        if (!this.isPlayerOwned(playerId))
            return;

        this.currentPlayer = playerId;
    }

    buyUpgrade(upgrade) {

        const price = this.getUpgradePrice(upgrade);
        if (this.score < price)
            return false;

        this.score -= price;

        this.upgradeLevels[upgrade.id] =
            (this.upgradeLevels[upgrade.id] || 0) + 1;
        
        this.recalculateStats();

        return true;
    }

    getUpgradeLevel(upgradeId) {
        return this.upgradeLevels[upgradeId] || 0;
    }

    getUpgradePrice(upgrade) {

        const level = this.getUpgradeLevel(upgrade.id);

        return Math.floor(upgrade.price * Math.pow(2, level));

    }

    tickPassiveIncome() {
        this.score += this.passiveMoney;
    }

    save() {

        const data = {
            score: this.score,
            currentPlayer: this.currentPlayer,
            ownedPlayers: this.ownedPlayers,
            upgradeLevels: this.upgradeLevels
        };
        localStorage.setItem(
            "football-clicker-save",
            JSON.stringify(data)
        );
    }

    load() {
        const data = JSON.parse(
            localStorage.getItem("football-clicker-save")
        );
        if (!data)
            return;
        this.score = data.score ?? 0;
        this.currentPlayer = data.currentPlayer ?? 0;
        this.ownedPlayers = data.ownedPlayers ?? [0];
        this.upgradeLevels = data.upgradeLevels ?? {};
        this.recalculateStats();
    }

    recalculateStats() {

        this.upgradeBonus = 0;
        this.passiveIncome = 0;
        for (const upgrade of UPGRADES) {
            const level = this.upgradeLevels[upgrade.id] || 0;
            if (upgrade.type === "click") {
                this.upgradeBonus += upgrade.bonus * level;
            } else if (upgrade.type === "passive") {
                this.passiveIncome += upgrade.bonus * level;
            }
        }
    }

    getSaveData(){
        return {
            score:this.score,
            currentPlayer:this.currentPlayer,
            ownedPlayers:this.ownedPlayers,
            upgradeLevels:this.upgradeLevels
        };
    }


    loadSaveData(data){
        if(!data)
            return;
        this.score=data.score??0;
        this.currentPlayer=data.currentPlayer??0;
        this.ownedPlayers=data.ownedPlayers??[0];
        this.upgradeLevels=data.upgradeLevels??{};
        this.recalculateStats();
    }

}