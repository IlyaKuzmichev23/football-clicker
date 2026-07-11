export class SDK {

    constructor() {
        this.lang="ru";
        this.ysdk = null;
        this.player = null;
        this.isLocal=
            location.hostname==="127.0.0.1"||
            location.hostname==="localhost";
    }

    async init(){
        if(this.isLocal){
            return;
        }
        this.ysdk=await YaGames.init();
        this.lang=this.ysdk.environment.i18n.lang;
    }

    async initPlayer(){
        if(!this.ysdk)
            return;
        this.player=await this.ysdk.getPlayer();
    }

    isAuthorized(){
        return !this.isLocal&&this.player!==null;
    }

    async save(data){
        if(!this.player)
            return;
        try{
            await this.player.setData(data);
        }catch(e){
            console.error("Ошибка сохранения",e);
        }
    }

    async load(){
        if(!this.player)
            return null;
        try{
            return await this.player.getData();
        }catch(e){
            console.error("Ошибка загрузки",e);
            return null;
        }
    }

    async showFullscreenAd(game){
        if(this.isLocal)
            return;

        game.pause();

        return new Promise(resolve=>{
            this.ysdk.adv.showFullscreenAdv({
                callbacks:{
                    onClose:()=>{
                        game.resume();
                        resolve();
                    },
                    onError:(e)=>{
                        console.error("Ошибка рекламы",e);
                        game.resume();
                        resolve();
                    }
                }
            });
        });
    }

    async showRewardedAd(callback){
        if(this.isLocal){
            callback();
            return;
        }

        this.ysdk.adv.showRewardedVideo({
            callbacks:{
                onRewarded:()=>{
                    callback();
                },
                onError:(e)=>{
                    console.error("Ошибка рекламы",e);
                }
            }
        });
    }

    gameReady(){
        if(this.isLocal)
            return;
        this.ysdk.features.LoadingAPI?.ready();
    }

}