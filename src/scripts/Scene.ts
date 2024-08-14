import Phaser from 'phaser';
import Background from './Background';
import { gameConfig } from './appconfig';
import { Globals } from './Globals';


export abstract class Scene extends Phaser.Scene {
    private sceneContainer: Phaser.GameObjects.Container;
    mainContainer: Phaser.GameObjects.Container;
    // private mainBackground: Background;

    constructor(key: string) {
        super({ key });
        this.sceneContainer = this.add.container();
        this.mainContainer = this.add.container();

        // Initialize background
        this.resetMainContainer();
        this.sceneContainer.add(this.mainContainer);
    }

    resetMainContainer() {
        this.mainContainer.setPosition(gameConfig.scale.minLeftX, gameConfig.scale.minTopY);
        this.mainContainer.setScale(gameConfig.scale.minScaleFactor);
    }

    addToScene(obj: Phaser.GameObjects.GameObject) {
        this.sceneContainer.add(obj);
    }

    resize(): void {
        this.resetMainContainer();
        // if (this.mainBackground) {
        //     this.mainBackground.setSize(window.innerWidth, window.innerHeight);
        // }
    }

    initScene(container: Phaser.GameObjects.Container) {
        container.add(this.sceneContainer);
    }

    destroyScene() {
        this.sceneContainer.destroy();
    }

    addChildToFullScene(component: Phaser.GameObjects.GameObject) {
        this.sceneContainer.add(component);
    }

    addChildToIndexFullScene(component: Phaser.GameObjects.GameObject, index: number) {
        this.sceneContainer.add(component);
    }

    abstract update(time: number, delta: number): void;

    abstract recievedMessage(msgType: string, msgParams: any): void;
}
