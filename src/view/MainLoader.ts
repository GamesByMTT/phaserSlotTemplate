import { Scene, GameObjects } from "phaser";
import MainScene from "./MainScene";
import { LoaderConfig } from "../scripts/LoaderConfig";
import { Globals } from "../scripts/Globals";
import { SocketManager } from "../socket";
import MyEmitter from "../scripts/MyEmitter";
export default class MainLoader extends Scene {
    resources: any;
    private progressBar: GameObjects.Graphics | null = null;
    private progressBox: GameObjects.Graphics | null = null;
    private socketManager: SocketManager | null = null;
    private mainScene!: MainScene;
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.resources = LoaderConfig;
    }
    preload() {
        this.load.image("Background", "src/sprites/Background.jpg")
        this.progressBox = this.add.graphics();
        this.progressBar = this.add.graphics();

        this.socketManager = new SocketManager(() => {
            // Callback for when InitData is received
            this.onInitDataReceived();
        });
         // Assign the actual SocketManager instance
        this.load.on('progress', (value: number) => {
            this.updateProgressBar(value);
        });
        Globals.Socket = this.socketManager;

        this.load.on('complete', () => {
            if (this.progressBox) {
                this.progressBox.destroy();
            }
            if (this.progressBar) {
                this.progressBar.destroy();
            }
            this.updateProgressBar(1); 
            const loadedTextures = this.textures.list;
            Globals.resources = { ...loadedTextures };
        });
        // Load all assets from LoaderConfig
        Object.entries(LoaderConfig).forEach(([key, value]) => {
            this.load.image(key, value);
        });
    }

    private updateProgressBar(value: number) {
        const { width, height } = this.scale;
        // Clear previous progress bar
        if (this.progressBox) this.progressBox.clear();
        if (this.progressBar) this.progressBar.clear();
        // this.add.image(width / 2, height / 2, 'Background').setOrigin(0.5).setDisplaySize(1920, 1080).setDepth(0);
        // Draw progress bar background
        if (this.progressBox) {
            this.progressBox.fillStyle(0x000000, 1);
            this.progressBox.fillRect(width / 2 - 150, height / 2 , 500, 10)
        }

        // Draw progress bar fill
        if (this.progressBar) {
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(width / 2 - 150, height / 2, 500 * value, 10)
        }
    }


    create() {
        const {width, height} = this.cameras.main
        this.add.image(width / 2, height / 2, 'Background').setOrigin(0.5).setDisplaySize(width, height);
        // Additional setup if needed
        this.scene.add("MainScene", MainScene, true);
        this.mainScene = this.scene.get('MainScene') as MainScene;
        // Create an instance of MyEmitter with the mainScene
        Globals.emitter = new MyEmitter(this.mainScene);
    }

    private onInitDataReceived() {
        // Handle the InitData received from the server
        console.log("InitData received");
    } 
}
