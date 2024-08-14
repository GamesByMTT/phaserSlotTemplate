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

        this.progressBox = this.add.graphics();
        this.progressBar = this.add.graphics();

        this.load.on('progress', (value: number) => {
            this.updateProgressBar(value);
        });
        this.socketManager = new SocketManager(() => {
            // Callback for when InitData is received
            this.onInitDataReceived();
        });

        Globals.Socket = this.socketManager; // Assign the actual SocketManager instance

        this.socketManager.authenticate().then(() => {
            // Authentication successful, start the main scene
            this.scene.start("MainScene");
        }).catch((error) => {
            // Authentication failed, handle the error (e.g., show an error message)
            console.error("Authentication failed:", error);
        });
        this.load.on('complete', () => {
            if (this.progressBox) {
                this.progressBox.destroy();
            }
            if (this.progressBar) {
                this.progressBar.destroy();
            }
            this.updateProgressBar(1); // Ensure bar is full when complete
            const loadedTextures = this.textures.list;
            Globals.resources = { ...loadedTextures };

            // Initialize the socket manager and authenticate
        });

        // Load all assets from LoaderConfig
        Object.entries(LoaderConfig).forEach(([key, value]) => {
            this.load.image(key, value);
        });
    }

    create() {
        // Additional setup if needed
        this.scene.add("MainScene", MainScene, true);
        this.mainScene = this.scene.get('MainScene') as MainScene;
        // Create an instance of MyEmitter with the mainScene
        Globals.emitter = new MyEmitter(this.mainScene);
    }

    private updateProgressBar(value: number) {
        const { width, height } = this.scale;

        // Clear previous progress bar
        if (this.progressBox) this.progressBox.clear();
        if (this.progressBar) this.progressBar.clear();

        // Draw progress bar background
        if (this.progressBox) {
            this.progressBox.fillStyle(0x000000, 0.8);
            this.progressBox.fillRect(width / 2 - 160, height / 2 + 20, 320, 50);
        }

        // Draw progress bar fill
        if (this.progressBar) {
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(width / 2 - 150, height / 2 + 30, 300 * value, 30);
        }
    }

    private onInitDataReceived() {
        // Handle the InitData received from the server
        console.log("InitData received");
    } 
}
