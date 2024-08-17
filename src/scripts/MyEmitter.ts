import Phaser from "phaser";
import MainScene from "../view/MainScene";
export default class MyEmitter {
    private mainscene : MainScene;
    constructor(mainscene: MainScene){
        this.mainscene = mainscene
    }
    Call(msgType: string, msgParams = {}) {
        if (msgType != "timer" && msgType != "turnTimer")
            this.mainscene.recievedMessage(msgType, msgParams);
    }
}