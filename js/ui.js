export class UI {

    constructor(game){

        this.game = game;

        this.scoreElement = document.getElementById("score-value");

        this.clickPowerElement =
            document.getElementById("click-power");

        this.multiplierElement =
            document.getElementById("multiplier");

        this.passiveIncome = document.getElementById("passive-income");

    }

    update() {

        document.getElementById("score-value").textContent =`$${this.game.score.toLocaleString()}`;

        document.getElementById("click-power").textContent = `$${this.game.clickPower}`;

        document.getElementById("multiplier").textContent = `×${this.game.multiplier}`;

        document.getElementById("player").src =
            this.game.players[this.game.currentPlayer].image;

        document.getElementById("passive-income").textContent =
            `$${this.game.passiveMoney}/с`;
        
        const boost=document.getElementById("ad-boost");
        const timer=document.getElementById("ad-time");

        if(this.game.adTimer>0){
            boost.hidden=false;
            const min=Math.floor(this.game.adTimer/60);
            const sec=this.game.adTimer%60;
            timer.textContent=`${min}:${sec.toString().padStart(2,"0")}`;
        }else{
            boost.hidden=true;
        }
    }
}