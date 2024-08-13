import { Scene, GameObjects, Scale } from 'phaser';
import { Slots } from '../scripts/Slots';
import { UiContainer } from '../scripts/UiContainer';
import { LineGenerator } from '../scripts/Lines';
import { UiPopups } from '../scripts/UiPopup';
import { Globals, ResultData, currentGameData } from '../scripts/Globals';
import { gameConfig } from '../scripts/appconfig';

export default class MainScene extends Scene {
    slot!: Slots;
    slotFrame!: Phaser.GameObjects.Sprite;
    lineGenerator!: LineGenerator;
    uiContainer!: UiContainer;
    uiPopups!: UiPopups;
    private mainContainer!: Phaser.GameObjects.Container;

    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Load assets
        this.load.image('frame', 'src/sprites/SlotMachine_3x5.png');
        this.load.image('Background', 'src/sprites/Background.png'); // Load background image
        // Load any other assets if required
    }

    create() {
        // Set up the background
        const { width, height } = this.cameras.main;
        // this.add.image(width / 2, height / 2, 'Background').setOrigin(0.5).setDisplaySize(width, height);

        // Initialize main container
        this.mainContainer = this.add.container();

        // Set up the slot frame
        // this.slotFrame = new Phaser.GameObjects.Sprite(this, width / 2, height / 2, 'frame')
        // this.slotFrame = this.add.sprite(width / 2, height / 2, 'frame').setOrigin(0.5);
        // this.mainContainer.add(this.slotFrame);

        // Initialize UI Container
        this.uiContainer = new UiContainer(this, () => this.onSpinCallBack());
        this.mainContainer.add(this.uiContainer);

        // Initialize Slots
        this.slot = new Slots(this, () => this.onResultCallBack());
        this.mainContainer.add(this.slot);

        // Initialize Line Generator
        setTimeout(() => {
            this.lineGenerator = new LineGenerator(this, this.slot.slotSymbols[0][0].symbol.height, this.slot.slotSymbols[0][0].symbol.width);
            this.mainContainer.add(this.lineGenerator);
        }, 2000);
        

        // Initialize UI Popups
        // this.uiPopups = new UiPopups(this);

    }

    update(time: number, delta: number) {
        this.slot.update(time, delta);
        // Update other elements if needed
    }

    onResultCallBack() {
        this.uiContainer.onSpin(false);
        this.lineGenerator.showLines(ResultData.gameData.linesToEmit);
    }

    onSpinCallBack() {
        this.slot.moveReel();
        this.lineGenerator.hideLines();
    }

    recievedMessage(msgType: string, msgParams: any) {
        // console.log("stopTween");
        if (msgType === 'ResultData') {
            this.time.delayedCall(1000, () => {
                this.uiContainer.currentWiningText.updateLabelText(ResultData.playerData.currentWining.toString());
                currentGameData.currentBalance = ResultData.playerData.Balance;
                this.uiContainer.currentBalanceText.updateLabelText(currentGameData.currentBalance.toString());
                this.slot.stopTween();
            });
        }
    }
}
