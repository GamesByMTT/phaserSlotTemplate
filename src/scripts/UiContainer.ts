import Phaser from 'phaser';
import { Scene, GameObjects, Types } from 'phaser';
import { Globals, ResultData, currentGameData, initData } from './Globals';
import { TextLabel } from './TextLabel';
import { gameConfig } from './appconfig';

// Define UiContainer as a Phaser Scene class
export class UiContainer extends Phaser.GameObjects.Container {
    spinBtn!: Phaser.GameObjects.Sprite;
    maxbetBtn!: Phaser.GameObjects.Sprite;
    autoBetBtn!: Phaser.GameObjects.Sprite;
    fireAnimation: Phaser.GameObjects.Sprite[] = [];
    CurrentBetText!: TextLabel;
    currentWiningText!: TextLabel;
    currentBalanceText!: TextLabel;
    CurrentLineText!: TextLabel;
    private isAutoSpinning: boolean = false; // Flag to track if auto-spin is active


    constructor(scene: Scene, spinCallBack: () => void) {
        super(scene);
        scene.add.existing(this); 
        // Initialize UI elements
        this.maxBetInit();
        this.spinBtnInit(spinCallBack);
        this.autoSpinBtnInit(spinCallBack);
        this.lineBtnInit();
        this.winBtnInit();
        this.balanceBtnInit();
        this.BetBtnInit();
        // this.vaseInit();
    }

    lineBtnInit() { 
        
        const container = this.scene.add.container(gameConfig.scale.width/8, gameConfig.scale.height - 70);
        const lineText = new TextLabel(this.scene, -20, -70, "LINES", 30, "#3C2625");
        const linePanel = this.scene.add.sprite(0, 0, "lines").setDepth(4);
        linePanel.setOrigin(0.5);
        linePanel.setPosition(gameConfig.scale.width/9, gameConfig.scale.height - 70);
        container.add(lineText);
        this.CurrentLineText = new TextLabel(this.scene, -20, -18, "20", 40, "#ffffff");
        //Line Count
        container.add(this.CurrentLineText).setDepth(10)
    }

    winBtnInit() {
        const winPanel = this.scene.add.sprite(0, 0, 'winPanel');
        winPanel.setOrigin(0.5);
        winPanel.setPosition(gameConfig.scale.width / 1.12, this.spinBtn.y);
        const winPanelText = new TextLabel(this.scene, 0, -70, "WON", 30, "#3C2625");
        const container = this.scene.add.container(gameConfig.scale.width / 1.12, this.spinBtn.y)
        container.add(winPanelText);
        const currentWining: any = ResultData.playerData.currentWining;
        this.currentWiningText = new TextLabel(this.scene, 0, -15, currentWining, 40, "#FFFFFF");
        const winPanelChild = this.scene.add.container(winPanel.x, winPanel.y)
        winPanelChild.add(this.currentWiningText);
        // winPanel.addChild(this.currentWiningText);
    }

    balanceBtnInit() {
        const balancePanel = this.scene.add.sprite(0, 0, 'balancePanel');
        balancePanel.setOrigin(0.5);
        balancePanel.setPosition(gameConfig.scale.width/1.35, this.spinBtn.y);
        const balancePanelText = new TextLabel(this.scene, 0, -70, "BALANCE", 30, "#3C2625");
        const container = this.scene.add.container(balancePanel.x, balancePanel.y);
        // container.add(balancePanel);
        container.add(balancePanelText);
        currentGameData.currentBalance = initData.playerData.Balance;
        this.currentBalanceText = new TextLabel(this.scene, 0, -15, currentGameData.currentBalance.toFixed(2), 40, "#ffffff");
        container.add(this.currentBalanceText);
    }
    // Vase Sprite for animation
    // vaseInit() {
    //     const vase1 = this.scene.add.sprite(0, 0, 'fireVase');
    //     vase1.setOrigin(0.5);
    //     vase1.setPosition(vase1.width * 1.70, gameConfig.scale.height - vase1.height * 1.80);
    //     const fire1 = this.addFire();

    //     const vase2 = this.scene.add.sprite(0, 0, 'fireVase');
    //     vase2.setOrigin(0.5);
    //     vase2.setPosition(gameConfig.scale.width - vase2.width * 1.70, gameConfig.scale.height - vase2.height * 1.80);
    //     const fire2 = this.addFire();

    //     this.add(vase1);
    //     this.add(vase2);
    //     this.fireAnimation.push(fire1, fire2);
    // }

    maxBetInit() {
        this.maxbetBtn =  new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'maxBetBtn');
        // this.maxbetBtn.setPosition(gameConfig.scale.width / 2 - this.maxbetBtn.width / 1.7, gameConfig.scale.height - this.maxbetBtn.height / 2);
        this.maxbetBtn = this.createButton('maxBetBtn', gameConfig.scale.width / 2 - this.maxbetBtn.width / 1.7, gameConfig.scale.height - this.maxbetBtn.height / 2, () => {
            this.scene.tweens.add({
                targets: this.maxbetBtn,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
                onComplete: ()=>{
                    this.maxbetBtn.setTexture("maxBetBtOnPressed")
                    this.maxbetBtn.disableInteractive()
                    currentGameData.currentBetIndex = initData.gameData.Bets[initData.gameData.Bets.length - 1];
                    this.CurrentBetText.updateLabelText(currentGameData.currentBetIndex.toString());
                    this.scene.tweens.add({
                        targets: this.maxbetBtn,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 100,
                        onComplete: ()=>{
                            this.maxbetBtn.setTexture("maxBetBtn");
                            this.maxbetBtn.setInteractive({ useHandCursor: true, pixelPerfect: true })
                        }
                    })
                }
            })
        
        }).setDepth(2);      
    }

    spinBtnInit(spinCallBack: () => void) {
        this.spinBtn = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "spinBtn");
        this.spinBtn = this.createButton('spinBtn', gameConfig.scale.width / 2, gameConfig.scale.height - this.spinBtn.height / 2, () => {
            // checking if autoSpining is working or not if it is auto Spining then stop it
            if(this.isAutoSpinning){
                this.autoBetBtn.emit('pointerdown'); // Simulate the pointerdown event
                this.autoBetBtn.emit('pointerup'); // Simulate the pointerup event (if needed)
                return;
            }
           // tween added to scale transition
            this.scene.tweens.add({
                targets: this.spinBtn,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
                onComplete: () => {
                    // Send message and update the balance
                    Globals.Socket?.sendMessage("SPIN", { currentBet: currentGameData.currentBetIndex, currentLines: 20, spins: 1 });
                    currentGameData.currentBalance -= initData.gameData.Bets[currentGameData.currentBetIndex];
                    this.currentBalanceText.updateLabelText(currentGameData.currentBalance.toFixed(2));
                    // Trigger the spin callback
                    this.onSpin(true);
                    spinCallBack();
    
                    // Scale back to original size 
                    this.scene.tweens.add({
                        targets: this.spinBtn,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 100,
                        onComplete: () => {
                            // this.spinBtn.setTexture('spinBtn');
                        }
                    });
                }
            });
        }).setDepth(8);
   
    }
    BetBtnInit() {
        const container = this.scene.add.container(gameConfig.scale.width / 3.8, gameConfig.scale.height - 70);
        // Bet panel text
        const betPanelText = new TextLabel(this.scene, 0, -70, "TOTAL BET", 30, "#3C2625").setDepth(2);
        container.add(betPanelText);
     
        // Plus button
        const pBtn = this.createButton('pBtn', 90, 0, () => {
            pBtn.setTexture('pBtnH');
            pBtn.disableInteractive();
            if (!currentGameData.isMoving) {
                currentGameData.currentBetIndex++;
                if (currentGameData.currentBetIndex >= initData.gameData.Bets.length) {
                    currentGameData.currentBetIndex = 0;
                }
                this.CurrentBetText.updateLabelText(initData.gameData.Bets[currentGameData.currentBetIndex]);
            }
            this.scene.time.delayedCall(200, () => {
                pBtn.setTexture('pBtn');
                pBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            });
        }).setDepth(0);
        container.add(pBtn);
    
        // Minus button
        const mBtn = this.createButton('mBtn', -90, 0, () => {
            mBtn.setTexture('mBtnH');
            mBtn.disableInteractive();
            if (!currentGameData.isMoving) {
                currentGameData.currentBetIndex--;
                if (currentGameData.currentBetIndex < 0) {
                    currentGameData.currentBetIndex = initData.gameData.Bets.length - 1;
                }
                this.CurrentBetText.updateLabelText(initData.gameData.Bets[currentGameData.currentBetIndex]);
            }
            this.scene.time.delayedCall(200, () => {
                mBtn.setTexture('mBtn');
                mBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            });
        }).setDepth(0);
        container.add(mBtn);
        const betPanel = this.scene.add.sprite(0, 0, 'BetPanel').setOrigin(0.5).setDepth(4);
        container.add(betPanel);
        this.CurrentBetText = new TextLabel(this.scene, 0, -18, initData.gameData.Bets[currentGameData.currentBetIndex], 40, "#FFFFFF").setDepth(6);
        container.add(this.CurrentBetText);
    
    }

    autoSpinBtnInit(spinCallBack: () => void) {
        this.autoBetBtn = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "autoSpin");
        this.autoBetBtn = this.createButton(
            'autoSpin',
            gameConfig.scale.width / 2 + this.autoBetBtn.width / 1.7,
            gameConfig.scale.height - this.autoBetBtn.height / 2,
            () => {
                this.scene.tweens.add({
                    targets: this.autoBetBtn,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 100,
                    onComplete: () =>{
                        this.isAutoSpinning = !this.isAutoSpinning; // Toggle auto-spin state
                        if (this.isAutoSpinning && currentGameData.currentBalance > 0) {
                            Globals.Socket?.sendMessage("SPIN", {
                                currentBet: currentGameData.currentBetIndex,
                                currentLines : 20
                            });
                            currentGameData.currentBalance -= initData.gameData.Bets[currentGameData.currentBetIndex];
                            this.currentBalanceText.updateLabelText(currentGameData.currentBalance.toFixed(2));
                            this.autoSpinRec(true)
                            spinCallBack(); // Callback to indicate the spin has started
                            // Start the spin recursion
                            this.startSpinRecursion(spinCallBack);
                        } else {
                            // Stop the spin if auto-spin is turned off
                            this.autoSpinRec(false);
                        }
                        this.scene.tweens.add({
                            targets: this.autoBetBtn,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 100,
                            onComplete: () => {
                                // this.spinBtn.setTexture('spinBtn');
                            }
                        });
                    }
                })
            }
        ).setDepth(1);
    }
    
    startSpinRecursion(spinCallBack: () => void) {
        if (this.isAutoSpinning && currentGameData.currentBalance > 0) {
            // Delay before the next spin
            const delay = currentGameData.isMoving && (ResultData.gameData.symbolsToEmit.length > 0) ? 3000 : 5000;
            this.scene.time.delayedCall(delay, () => {
                if (this.isAutoSpinning && currentGameData.currentBalance >= 0) {
                    Globals.Socket?.sendMessage("SPIN", {
                        currentBet: currentGameData.currentBetIndex,
                        currentLines : 20
                    });
                    currentGameData.currentBalance -= initData.gameData.Bets[currentGameData.currentBetIndex];
                    this.currentBalanceText.updateLabelText(currentGameData.currentBalance.toFixed(2));
                    spinCallBack();
                    // Call the spin recursively
                    this.spinRecursively(spinCallBack);
                }
            });
        }
    }
    
    spinRecursively(spinCallBack: () => void) {
        if (this.isAutoSpinning) {
            // Perform the spin
            this.autoSpinRec(true);
            if (currentGameData.currentBalance < initData.gameData.Bets[currentGameData.currentBetIndex]) {
                // Stop the spin when a winning condition is met or balance is insufficient
                this.autoSpinRec(false);
                spinCallBack();
            } else {
                // Continue spinning if no winning condition is met and balance is sufficient
                this.startSpinRecursion(spinCallBack);
            }
        }
    }
    
    createButton(key: string, x: number, y: number, callback: () => void): Phaser.GameObjects.Sprite {
        const button = this.scene.add.sprite(x, y, key).setInteractive({ useHandCursor: true, pixelPerfect: true });
        button.on('pointerdown', callback);
        return button;
    }

    addFire(): Phaser.GameObjects.Sprite {
        const fire = this.scene.add.sprite(0, 0, 'fire').play('fireAnimation');
        fire.setOrigin(0.5);
        return fire;
    }

    autoSpinRec(spin: boolean){
        if(spin){
            this.spinBtn.setTexture("spinBtnOnPressed");
            this.autoBetBtn.setTexture("autoSpinOnPressed");
        }else{
            this.spinBtn.setTexture("spinBtn");
            this.autoBetBtn.setTexture("autoSpin");
        }        
    }

    onSpin(spin: boolean) {
        // Handle spin functionality
        if(this.isAutoSpinning){
            return
        }
        if(spin){
            this.spinBtn.disableInteractive();
            this.spinBtn.setTexture("spinBtnOnPressed");
            this.autoBetBtn.setTexture("autoSpinOnPressed");
            this.autoBetBtn.disableInteractive();
        }else{
            this.spinBtn.setTexture("spinBtn");
            this.spinBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.autoBetBtn.setTexture("autoSpin");
            this.autoBetBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
        }        
    }
}
