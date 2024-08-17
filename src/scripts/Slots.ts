import Phaser from 'phaser';
import { Globals, ResultData, initData } from "./Globals";
import { gameConfig } from './appconfig';
// import { symbols } from './LoaderConfig';
import { Easing, Tween } from "@tweenjs/tween.js"; // If using TWEEN for animations

export class Slots extends Phaser.GameObjects.Container {
    slotMask: Phaser.GameObjects.Graphics;
    slotSymbols: any[][] = [];
    moveSlots: boolean = false;
    resultCallBack: () => void;
    slotFrame!: Phaser.GameObjects.Sprite;
    private maskWidth: number;
    private maskHeight: number;
    private symbolKeys: string[];
    private symbolWidth: number;
    private symbolHeight: number;
    private spacingX: number;
    private spacingY: number;
    private reelContainers: Phaser.GameObjects.Container[] = [];
    

    constructor(scene: Phaser.Scene, callback: () => void) {
        super(scene);

        this.resultCallBack = callback;

        this.slotMask = new Phaser.GameObjects.Graphics(scene);
        
        this.maskWidth = gameConfig.scale.width / 1.8;
        this.maskHeight = 640;
        this.slotMask.fillStyle(0xffffff, 1);
        this.slotMask.fillRoundedRect(0, 0, this.maskWidth, this.maskHeight, 20);
        // mask Position set
        this.slotMask.setPosition(
            gameConfig.scale.width / 4 - 50,
            gameConfig.scale.height / 5 - 40
        );
        // this.add(this.slotMask);
        // Filter and pick symbol keys based on the criteria
        this.symbolKeys = this.getFilteredSymbolKeys();
        
        // Assume all symbols have the same width and height
        const exampleSymbol = new Phaser.GameObjects.Sprite(scene, 0, 0, this.getRandomSymbolKey());
        this.symbolWidth = exampleSymbol.displayWidth/ 2;
        this.symbolHeight = exampleSymbol.displayHeight/2;
        this.spacingX = this.symbolWidth * 1.8; // Add some spacing
        this.spacingY = this.symbolHeight * 1.7; // Add some spacing
        const startPos = {
            x: gameConfig.scale.width / 4 + 52,
            y: gameConfig.scale.height / 4 + 35       
        };
        for (let i = 0; i < 5; i++) { // 5 columns
            const reelContainer = new Phaser.GameObjects.Container(scene);
            this.reelContainers.push(reelContainer); // Store the container for future use
            
            this.slotSymbols[i] = [];
            for (let j = 0; j < 3; j++) { // 3 rows
                let symbolKey = this.getRandomSymbolKey(); // Get a random symbol key
                let slot = new Symbols(scene, symbolKey, { x: i, y: j });
                
                slot.symbol.setMask(new Phaser.Display.Masks.GeometryMask(scene, this.slotMask));
                slot.symbol.setPosition(
                    startPos.x + i * this.spacingX ,
                    startPos.y + j * this.spacingY
                );
                slot.startX = slot.symbol.x;
                slot.startY = slot.symbol.y;
                this.slotSymbols[i].push(slot);
                // this.add(slot.symbol);
                reelContainer.add(slot.symbol)
            }
            this.add(reelContainer);
        }
    }

    getFilteredSymbolKeys(): string[] {
        // Filter symbols based on the pattern
        const allSprites = Globals.resources;
        const filteredSprites = Object.keys(allSprites).filter(spriteName => {
            const regex = /^slots\d+_\d+$/; // Regex to match "slots<number>_<number>"
            if (regex.test(spriteName)) {
                const [, num1, num2] = spriteName.match(/^slots(\d+)_(\d+)$/) || [];
                const number1 = parseInt(num1, 10);
                const number2 = parseInt(num2, 10);
                // Check if the numbers are within the desired range
                return number1 >= 1 && number1 <= 14 && number2 >= 1 && number2 <= 14;
            }
            return false;
        });

        return filteredSprites;
    }

    getRandomSymbolKey(): string {
        const randomIndex = Phaser.Math.Between(0, this.symbolKeys.length - 1);
        return this.symbolKeys[randomIndex];
    }

    moveReel() {
        for (let i = 0; i < this.slotSymbols.length; i++) {
            for (let j = 0; j < this.slotSymbols[i].length; j++) {
                setTimeout(() => {
                    this.slotSymbols[i][j].startMoving = true;
                    if (j < 3) this.slotSymbols[i][j].stopAnimation();
                }, 100 * i);
            }
        }
        this.moveSlots = true;
    }

    stopTween() {
        // Calculate the maximum delay for endTween
        const maxDelay = 200 * (this.slotSymbols.length - 1);
    
        // Use a single timeout for resultCallBack, ensuring it's called only once after all endTweens
        setTimeout(() => {
            // Call resultCallBack after all endTween calls
            this.resultCallBack();
            this.moveSlots = false;
            ResultData.gameData.symbolsToEmit.forEach((rowArray: any) => {
                rowArray.forEach((row: any) => {
                    if (typeof row === "string") {
                        const [y, x]: number[] = row.split(",").map((value) => parseInt(value)); // Swap x and y here
                        const animationId = `symbol_anim_${ResultData.gameData.ResultReel[x][y]}`;
                        if (this.slotSymbols[y] && this.slotSymbols[y][x]) { // Correct access based on swapped x and y
                            // Debuging the Symbol       
                            this.slotSymbols[y][x].playAnimation(animationId);    
                        } 
                    }
                });
            });
            
        }, maxDelay + 200); // Ensure the resultCallBack is called after the last endTween
    
        // Call endTween for each symbol with appropriate delay
        for (let i = 0; i < this.slotSymbols.length; i++) {
            for (let j = 0; j < this.slotSymbols[i].length; j++) {
                setTimeout(() => {
                    this.slotSymbols[i][j].endTween();
                }, 200 * i);
            }
        }
    }

    update(time: number, delta: number) {
        if (this.slotSymbols && this.moveSlots) {
            for (let i = 0; i < this.slotSymbols.length; i++) {
                for (let j = 0; j < this.slotSymbols[i].length; j++) {
                    this.slotSymbols[i][j].update(delta);
                    if (
                        this.slotSymbols[i][j].symbol.y +
                            this.slotSymbols[i][j].symbol.displayHeight * 1.5 >=
                        2000
                    ) {
                        if (j === 0) {
                            this.slotSymbols[i][j].symbol.y =
                                this.slotSymbols[i][this.slotSymbols[i].length - 1].symbol.y -
                                this.slotSymbols[i][this.slotSymbols[i].length - 1].symbol.displayHeight / 2;
                        } else {
                            this.slotSymbols[i][j].symbol.y =
                                this.slotSymbols[i][j - 1].symbol.y - this.slotSymbols[i][j].symbol.displayHeight;
                        }
                    }
                }
            }
        }
    }
}

// @Sybols CLass
class Symbols {
    symbol: Phaser.GameObjects.Sprite;
    startY: number = 0;
    startX: number = 0;
    startMoving: boolean = false;
    index: { x: number; y: number };
    scene: Phaser.Scene;
    private isMobile: boolean;

    constructor(scene: Phaser.Scene, symbolKey: string, index: { x: number; y: number }) {
        this.scene = scene;
        this.index = index;
        const updatedSymbolKey = this.updateKeyToZero(symbolKey)
        this.symbol = new Phaser.GameObjects.Sprite(scene, 0, 0, updatedSymbolKey);
        this.symbol.setOrigin(0.5, 0.5);
        this.isMobile = scene.sys.game.device.os.android || scene.sys.game.device.os.iOS;
        // Load textures and create animation
        const textures: string[] = [];
        Globals.resources
        for (let i = 0; i < 23; i++) {
            textures.push(`${symbolKey}`);
        }
        this.scene.anims.create({
            key: `${symbolKey}`,
            frames: textures.map((texture) => ({ key: texture })),
            frameRate: 20,
            repeat: -1,
        });
    }
    // to update the slotx_0 to show the 0 index image at the end
    updateKeyToZero(symbolKey: string): string {
        const match = symbolKey.match(/^slots(\d+)_\d+$/);
        if (match) {
            const xValue = match[1];
            return `slots${xValue}_0`;
        } else {
            return symbolKey; // Return the original key if format is incorrect
        }
    }
    playAnimation(animationId: any) {
        this.symbol.play(animationId)
    }
      stopAnimation() {
        this.symbol.anims.stop();
        this.symbol.setFrame(0);
      }
      endTween() {
        if (this.index.y < 3) {
            let textureKeys: string[] = [];
            // Retrieve the elementId based on index
            const elementId = ResultData.gameData.ResultReel[this.index.y][this.index.x];
                for (let i = 0; i < 23; i++) {
                    const textureKey = `slots${elementId}_${i}`;
                    // Check if the texture exists in cache
                    if (this.scene.textures.exists(textureKey)) {
                        textureKeys.push(textureKey);
                    } 
                }
                // Check if we have texture keys to set
                    if (textureKeys.length > 0) {
                    // Create animation with the collected texture keys
                        this.scene.anims.create({
                            key: `symbol_anim_${elementId}`,
                            frames: textureKeys.map(key => ({ key })),
                            frameRate: 20,
                            repeat: -1
                        });
                    // Set the texture to the first key and start the animation
                        this.symbol.setTexture(textureKeys[0]);               
                    }
        }
        // Stop moving and start tweening the sprite's position
        this.startMoving = false;
        this.scene.tweens.add({
            targets: this.symbol,
            y: this.startY,
            duration: 300,
            ease: 'Elastic.easeOut',
            repeat: 0,
            onComplete: () => {
                // Animation complete callback
            }
        });
    }
    
      update(dt: number) {
        
        if (this.startMoving) {
          const deltaY = 10 * dt;
          const newY = this.symbol.y + deltaY;  
          this.symbol.y = newY; 
        // Check if newY exceeds the maximum value
        if (newY >= (this.isMobile ? window.innerHeight * 2 : window.innerHeight * 1.2)) {
            this.symbol.y = 100; // Reset to 0 if it exceeds maxY
        } 
    }
}
}
