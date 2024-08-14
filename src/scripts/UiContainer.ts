import Phaser from 'phaser';
import { Scene, GameObjects, Types } from 'phaser';
import { Globals, ResultData, currentGameData, initData, TextStyle } from './Globals';
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

    constructor(scene: Scene, spinCallBack: () => void) {
        super(scene);
        scene.add.existing(this); 
        // Initialize UI elements
        this.maxBetInit();
        this.spinBtnInit(spinCallBack);
        this.autoSpinBtnInit();
        this.lineBtnInit();
        this.winBtnInit();
        this.balanceBtnInit();
        this.jackpotPanelInit();
        this.BetBtnInit();
        // this.vaseInit();
    }

    lineBtnInit() {
        const linePanel = this.scene.add.sprite(0, 0, "lines").setDepth(10);
        
        linePanel.setOrigin(0.5);
        linePanel.setPosition(gameConfig.scale.width/9, gameConfig.scale.height - 80);
        const container = this.scene.add.container(gameConfig.scale.width/8, gameConfig.scale.height - 80);
        const lineText = new TextLabel(this.scene, -20, -70, "LINES", 30, "#3C2625");
        container.add(lineText)
        const pBtn = this.createButton('pBtn', 100, 0, () => {
            if (!currentGameData.isMoving) {
                currentGameData.currentLines++;
                if (currentGameData.currentLines >= initData.gameData.LinesCount.length) {
                    currentGameData.currentLines = 0;
                }
                // this.CurrentLineText.updateLabelText(initData.gameData.LinesCount[currentGameData.currentLines]);
            }
        });
        container.add(pBtn).setDepth(1)
        // this.add(pBtn);

        const mBtn = this.createButton('mBtn', -150, 0, () => {
            if (!currentGameData.isMoving) {
                currentGameData.currentLines--;
                if (currentGameData.currentLines < 0) {
                    currentGameData.currentLines = initData.gameData.LinesCount.length - 1;
                }
                // this.CurrentLineText.updateLabelText(initData.gameData.LinesCount[currentGameData.currentLines]);
            }
        });
        // this.add(mBtn);
        container.add(mBtn).setDepth(1)

        // this.add(linePanel);

        currentGameData.currentLines = initData.gameData.LinesCount.length - 1;
        const currentLine: number = initData.gameData.LinesCount[currentGameData.currentLines];
        // this.CurrentLineText = new TextLabel(this.scene, 0, -15, 0.5, currentLine.toString(), 40, 0xFFFFFF);
        // linePanel.add(this.CurrentLineText);
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
        this.currentBalanceText = new TextLabel(this.scene, 0, -15, currentGameData.currentBalance.toString(), 40, "#ffffff");
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
            Globals.Socket?.sendMessage("SPIN", { currentBet: initData.gameData.Bets[currentGameData.currentBetIndex] });
            currentGameData.currentBalance -= initData.gameData.Bets[currentGameData.currentBetIndex];
            this.currentBalanceText.updateLabelText(currentGameData.currentBalance.toString());
            this.onSpin(true);

            spinCallBack();
        }).setDepth(10);
   
    }

    
    BetBtnInit() {
        // this.spinBtn = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "spinBtn")
        const betPanel = this.scene.add.sprite(1000, gameConfig.scale.height - 100, 'BetPanel').setDepth(10);
        betPanel.setOrigin(0.5);
        betPanel.setPosition( gameConfig.scale.width/3.7, gameConfig.scale.height - 80);

        const betPanelText = new TextLabel(this.scene, 0, -70, "TOTAL BET", 30, "#3C2625");

        const container = this.scene.add.container(gameConfig.scale.width/3.7, gameConfig.scale.height - 80);
        // container.add(betPanel);
        container.add(betPanelText);
        // console.log(initData.gameData.Bets);
        
        this.CurrentBetText = new TextLabel(this.scene, gameConfig.scale.width/3.7, gameConfig.scale.height - 70, initData.gameData.Bets[currentGameData.currentBetIndex], 40, "FFFFFF");
        container.add(this.CurrentBetText);

        const pBtn = this.createButton('pBtn', 100, 0, () => {
            if (!currentGameData.isMoving) {
                currentGameData.currentBetIndex++;
                if (currentGameData.currentBetIndex >= initData.gameData.Bets.length) {
                    currentGameData.currentBetIndex = 0;
                }
                this.CurrentBetText.updateLabelText(initData.gameData.Bets[currentGameData.currentBetIndex]);
            }
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
        container.add(mBtn).setDepth(1);

        // this.add(container);
    }
    autoSpinBtnInit() {
        this.autoBetBtn = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "autoSpin")
        // this.autoBetBtn.setPosition(gameConfig.scale.width/2 + this.autoBetBtn.width / 1.7, gameConfig.scale.height / 1 - this.autoBetBtn.height / 2)
        this.autoBetBtn = this.createButton('autoSpin', gameConfig.scale.width/2 + this.autoBetBtn.width / 1.7, gameConfig.scale.height / 1 - this.autoBetBtn.height / 2, () => { }).setDepth(1);
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

    onSpin(spin: boolean) {
        // Handle spin functionality
    }
}
