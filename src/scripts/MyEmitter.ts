import Phaser from "phaser";
import SceneManager from "./SceneManager";
import MainScene from "../view/MainScene";
export default class MyEmitter {
    private mainscene : MainScene;
    constructor(mainscene: MainScene){
        this.mainscene = mainscene
    }
    Call(msgType: string, msgParams = {}) {
        if (msgType != "timer" && msgType != "turnTimer")
            // console.log(`Emitter Called : ${msgType}`);
            this.mainscene.recievedMessage(msgType, msgParams);
    }
}