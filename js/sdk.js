export class SDK {

    constructor() {
        this.ysdk = null;
        this.player = null;
        this.isLocal=
            location.hostname==="127.0.0.1"||
            location.hostname==="localhost";
    }

    async init(){
        if(this.isLocal){
            console.log("Локальный режим");
            return;
        }
        this.ysdk=await YaGames.init();
        console.log("SDK загружен");
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

    async showFullscreenAd(){
        if(this.isLocal)
            return;

        return new Promise(resolve=>{
            this.ysdk.adv.showFullscreenAdv({
                callbacks:{
                    onClose:()=>{
                        resolve();
                    },
                    onError:(e)=>{
                        console.error("Ошибка рекламы",e);
                        resolve();
                    }
                }
            });
        });
    }

}