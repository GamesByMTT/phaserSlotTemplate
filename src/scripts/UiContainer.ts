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
        this.jackpotPanelInit();
        this.BetBtnInit();
        // this.vaseInit();
    }

    lineBtnInit() { 
        
        const container = this.scene.add.container(gameConfig.scale.width/8, gameConfig.scale.height - 80);
        const lineText = new TextLabel(this.scene, -20, -70, "LINES", 30, "#3C2625");
        const linePanel = this.scene.add.sprite(0, 0, "lines").setDepth(4);
        linePanel.setOrigin(0.5);
        linePanel.setPosition(gameConfig.scale.width/9, gameConfig.scale.height - 80);
        container.add(lineText)
       // Plus Button
        // const pBtn = this.createButton('pBtn', 100, 0, () => {
        //     if (!currentGameData.isMoving) {
        //         currentGameData.currentLines++;
        //         if (currentGameData.currentLines >= initData.gameData.LinesCount.length) {
        //             currentGameData.currentLines = 0;
        //         }
        //         this.CurrentLineText.updateLabelText(initData.gameData.LinesCount[currentGameData.currentLines]);
        //     }
        // }).setDepth(1);
        // container.add(pBtn)
        // Minus Button
        // const mBtn = this.createButton('mBtn', -150, 0, () => {
        //     if (!currentGameData.isMoving) {
        //         currentGameData.currentLines--;
        //         if (currentGameData.currentLines < 0) {
        //             currentGameData.currentLines = initData.gameData.LinesCount.length - 1;
        //         }
        //         this.CurrentLineText.updateLabelText(initData.gameData.LinesCount[currentGameData.currentLines]);
        //     }
        // }).setDepth(0);
        // // this.add(mBtn);
        // container.add(mBtn)
        
        this.CurrentLineText = new TextLabel(this.scene, -20, -18, "20", 40, "#ffffff");
        
        //Line Count
        container.add(this.CurrentLineText).setDepth(10)
    }

    winBtnInit() {
        const winPanel = this.scene.add.sprite(0, 0, 'winPanel');
        winPanel.setOrigin(0.5);
        winPanel.setPosition(gameConfig.scale.width / 1.15, this.spinBtn.y);
        const winPanelText = new TextLabel(this.scene, 0, -70, "WON", 30, "#3C2625");
        const container = this.scene.add.container(gameConfig.scale.width / 1.15, this.spinBtn.y)
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
        balancePanel.setPosition(gameConfig.scale.width / 2 + balancePanel.width * 1.35, this.spinBtn.y);
        const balancePanelText = new TextLabel(this.scene, 0, -70, "BALANCE", 30, "#3C2625");

        const container = this.scene.add.container(balancePanel.x, balancePanel.y);
        // container.add(balancePanel);
        container.add(balancePanelText);

        currentGameData.currentBalance = initData.playerData.Balance;
        this.currentBalanceText = new TextLabel(this.scene, 0, -15, currentGameData.currentBalance.toFixed(2), 40, "#ffffff");
        container.add(this.currentBalanceText);
    }

    jackpotPanelInit() {
        const jackpotPanel = this.scene.add.sprite(0, 0, 'PanelJackpot');
        jackpotPanel.setOrigin(0.5);
        jackpotPanel.setPosition(0, -gameConfig.scale.height / 4 - jackpotPanel.height / 2 - 20);
        this.add(jackpotPanel);
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
            currentGameData.currentBetIndex = initData.gameData.Bets[initData.gameData.Bets.length - 1];
            this.CurrentBetText.updateLabelText(currentGameData.currentBetIndex.toString());
        }).setDepth(2);      
    }

    spinBtnInit(spinCallBack: () => void) {
        // this.spinBtn = this.scene.add.sprite(0, 0, "spinBtn");
        this.spinBtn = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "spinBtn")
        this.spinBtn = this.createButton('spinBtn', gameConfig.scale.width / 2, gameConfig.scale.height - this.spinBtn.height / 2, () => {
            Globals.Socket?.sendMessage("SPIN", { currentBet: currentGameData.currentBetIndex, currentLines : 20, spins: 1});
            currentGameData.currentBalance -= initData.gameData.Bets[currentGameData.currentBetIndex];
            this.currentBalanceText.updateLabelText(currentGameData.currentBalance.toFixed(2));
            
            this.onSpin(true);
            spinCallBack();
        }).setDepth(8);
   
    }
    BetBtnInit() {
        const container = this.scene.add.container(gameConfig.scale.width/3.7, gameConfig.scale.height - 80).setDepth(4);
        // this.spinBtn = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "spinBtn")
        const betPanel = this.scene.add.sprite(1000, gameConfig.scale.height - 100, 'BetPanel');
        betPanel.setOrigin(0.5);
        betPanel.setPosition( gameConfig.scale.width/3.7, gameConfig.scale.height - 80);
        const betPanelText = new TextLabel(this.scene, 0, -70, "TOTAL BET", 30, "#3C2625");

        container.add(betPanelText);
        // console.log(initData.gameData.Bets);
       
        const pBtn = this.createButton('pBtn', 100, 0, () => {
            pBtn.setTexture('pBtnH');
            // Disable interaction for this button
            pBtn.disableInteractive();
            if (!currentGameData.isMoving) {
                currentGameData.currentBetIndex++;
                if (currentGameData.currentBetIndex >= initData.gameData.Bets.length) {
                    currentGameData.currentBetIndex = 0;
                }
                this.CurrentBetText.updateLabelText(initData.gameData.Bets[currentGameData.currentBetIndex]);
            }
            this.scene.time.delayedCall(200, () => { // 200 ms delay before reverting
                pBtn.setTexture('pBtn'); // Revert back to original texture
                pBtn.setInteractive(); // Re-enable interaction
            });
        });
        container.add(pBtn).setDepth(1);
        const mBtn = this.createButton('mBtn', -100, 0, () => {
            if (!currentGameData.isMoving) {
                currentGameData.currentBetIndex--;
                if (currentGameData.currentBetIndex < 0) {
                    currentGameData.currentBetIndex = initData.gameData.Bets.length - 1;
                }
                this.CurrentBetText.updateLabelText(initData.gameData.Bets[currentGameData.currentBetIndex]);
            }
        });
        container.add(mBtn).setDepth(2);
        this.CurrentBetText = new TextLabel(this.scene, 0, -18, initData.gameData.Bets[currentGameData.currentBetIndex], 40, "#FFFFFF");
        container.add(this.CurrentBetText).setDepth(5);
    }

    autoSpinBtnInit(spinCallBack: () => void) {
        this.autoBetBtn = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "autoSpin");
        this.autoBetBtn = this.createButton(
            'autoSpin',
            gameConfig.scale.width / 2 + this.autoBetBtn.width / 1.7,
            gameConfig.scale.height - this.autoBetBtn.height / 2,
            () => {
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
            }
        ).setDepth(1);
    }
    
    
    startSpinRecursion(spinCallBack: () => void) {
        console.log("startSpinRecursion");
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
        console.log("spinRecursively");
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
        const button = this.scene.add.sprite(x, y, key).setInteractive();
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
            this.spinBtn.disableInteractive();
        }else{
            this.spinBtn.setInteractive();
            this.spinBtn.setTexture("spinBtn");
            this.autoBetBtn.setTexture("autoSpin");
        }        
    }

    onSpin(spin: boolean) {
        // Handle spin functionality
        if(spin){
            this.spinBtn.disableInteractive();
            this.spinBtn.setTexture("spinBtnOnPressed");
            this.autoBetBtn.setTexture("autoSpinOnPressed");
            // this.autoBetBtn.disableInteractive();
        }else{
            this.spinBtn.setTexture("spinBtn");
            this.spinBtn.setInteractive();
            this.autoBetBtn.setTexture("autoSpin");
            // this.autoBetBtn.setInteractive();
        }        
    }
}
