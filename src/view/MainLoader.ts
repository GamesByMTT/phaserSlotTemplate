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
    private socketDataReceived: boolean = false;
    private maxProgress: number = 0.7; // Cap progress at 70%

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.resources = LoaderConfig;
    }

    preload() {
        // Load the background image first
        this.load.image("Background", "src/sprites/Background.jpg");

        // Once the background image is loaded, start loading other assets
        this.load.once('complete', () => {
            this.addBackgroundImage();
            this.startLoadingAssets();
        });
    }

    private addBackgroundImage() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'Background').setOrigin(0.5).setDisplaySize(width, height);

        // Initialize progress bar graphics
        this.progressBox = this.add.graphics();
        this.progressBar = this.add.graphics();

        // Draw initial progress bar background
        if (this.progressBox) {
            this.progressBox.fillStyle(0x000000, 1);
            this.progressBox.fillRect(width / 2 - 150, height / 2 + 10, 500, 10);
        }
    }

    private startLoadingAssets() {
        // Load all assets from LoaderConfig
        Object.entries(LoaderConfig).forEach(([key, value]) => {
            this.load.image(key, value);
        });

        // Start loading assets and update progress bar
        this.load.start();

        this.load.on('progress', (value: number) => {
            // Limit progress to 70% until socket initialization is done
            const adjustedValue = Math.min(value * this.maxProgress, this.maxProgress);
            this.updateProgressBar(adjustedValue);
        });

        this.load.on('complete', () => {
            // Only complete progress after socket initialization
            if (this.socketDataReceived) {
                this.completeLoading();
            }
        });

        // Initialize socket and handle completion
        
        this.initializeSocket();
    }

    private updateProgressBar(value: number) {
        const { width, height } = this.scale;
        if (this.progressBar) {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(width / 2 - 150, height / 2 + 10, 500 * value, 10);
        }
    }

    private initializeSocket() {
        this.socketManager = new SocketManager(() => {
            // Callback for when InitData is received
            this.onInitDataReceived();
        });
        Globals.Socket = this.socketManager;
    }

    private completeLoading() {
        if (this.progressBox) {
            this.progressBox.destroy();
        }
        if (this.progressBar) {
            this.progressBar.destroy();
        }
        this.updateProgressBar(1); // Set progress to 100%
        const loadedTextures = this.textures.list;
        Globals.resources = { ...loadedTextures };
    }

    private onInitDataReceived() {
        console.log("InitData received");
        this.socketDataReceived = true;

        // If assets are fully loaded, complete the loading process
        if (this.load.totalComplete === this.load.totalToLoad) {
            this.completeLoading();
            // Proceed with creating the MainScene
            setTimeout(() => {
                this.scene.add("MainScene", MainScene, true);
                this.mainScene = this.scene.get('MainScene') as MainScene;
                Globals.emitter = new MyEmitter(this.mainScene);
            }, 500);
            
        }
    }
}
