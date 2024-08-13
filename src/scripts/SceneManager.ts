import Phaser from "phaser";
import TWEEN from "@tweenjs/tween.js";
import { Globals } from "./Globals";
import { GameObjects } from "phaser";
import { Scene } from "./Scene";

export default class SceneManager {

    static instance: SceneManager;

    container!: Phaser.GameObjects.Container;
    scene: Scene | null = null;

    constructor() {

        if (SceneManager.instance != undefined) {
            // console.log("SceneManager already created!");
            return;
        }
        SceneManager.instance = this;

        this.container = new Phaser.GameObjects.Container(new Phaser.Scene('placeholder'));
        this.scene = null;
    }


    start(scene: Scene) {

        if (this.scene) {
            this.scene.destroyScene();
            this.scene = null;
        }

        this.scene = scene;
        this.scene.initScene(this.container)
        // this.container.addChild(this.scene.sceneContainer);


        if (window.orientation == 90 || window.orientation == -90) {

            //orientation
        }
    }
   
    addToScene()
    {

    }
    update(time: number, delta: number) {
        
        if (this.scene && this.scene.update) {
            TWEEN.update();
            this.scene.update(time, delta);
        }

        // Globals.stats.update();
        Globals.fpsStats.update();

        // Globals.stats.begin();

        // monitored code goes here

        // Globals.stats.end();
    }

    resize() {
        if (this.scene) {
            this.scene.resize();
        }
    }

    recievedMessage(msgType: string, msgParams: any) {
        if (this.scene && this.scene.recievedMessage) {
            this.scene.recievedMessage(msgType, msgParams);
        }
    }
}