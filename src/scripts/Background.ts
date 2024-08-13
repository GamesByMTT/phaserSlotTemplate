import Phaser from "phaser";
import { staticData } from "./LoaderConfig";
import { GameObjects } from "phaser";
export default class Background extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.setOrigin(0, 0);
        this.setDisplaySize(scene.sys.canvas.width, scene.sys.canvas.height);
    }

    // preload() {
    //     // Load your assets here
    //     this.load.image('Background', 'static/Background.png');
    //     // this.load.spritesheet('animatedBackground', 'path/to/animated.png', { frameWidth: 64, frameHeight: 64 });
    // }

    // setSize(width: number, height: number) {
    //     this.setDisplaySize(width, height);
    // }
}
