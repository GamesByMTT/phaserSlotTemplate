import Phaser from "phaser";
import { Globals } from "./Globals";
import { gameConfig } from "./appconfig";

export class UiPopups extends Phaser.GameObjects.Container {
    menuBtn!: InteractiveBtn;
    settingBtn!: InteractiveBtn;
    rulesBtn!: InteractiveBtn;
    infoBtn!: InteractiveBtn;
    isOpen: boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.setPosition(0, 0);

        // this.ruleBtnInit();
        // this.settingBtnInit();
        // this.infoBtnInit();
        // this.menuBtnInit();

        // scene.add.existing(this);
    }

    menuBtnInit() {
        const menuBtnTextures = [
            this.scene.textures.get('MenuBtn'),
            this.scene.textures.get('MenuBtnH')
        ];
        this.menuBtn = new InteractiveBtn(this.scene, menuBtnTextures, () => {
            // console.log("called");
            this.openPopUp();
        }, 0, true);
        this.menuBtn.setPosition(gameConfig.scale.width / 10, gameConfig.scale.height / 4);
        this.add(this.menuBtn);
    }

    openPopUp() {
        // Toggle the isOpen boolean
        this.isOpen = !this.isOpen;
        // console.log(this.isOpen);
        this.menuBtn.setInteractive(false);

        const targetY = gameConfig.scale.width / 10 + this.menuBtn.moveToPosition * this.menuBtn.height;

        if (this.isOpen) {
            this.tweenToPosition(this.rulesBtn, targetY);
            this.tweenToPosition(this.infoBtn, targetY);
            this.tweenToPosition(this.settingBtn, targetY);
        } else {
            this.tweenBack(this.rulesBtn);
            this.tweenBack(this.infoBtn);
            this.tweenBack(this.settingBtn);
        }
    }

    tweenToPosition(button: InteractiveBtn, targetY: number) {
        button.setVisible(true);
        this.scene.tweens.add({
            targets: button,
            y: targetY,
            duration: 600,
            ease: 'Elastic',
            easeParams: [1.1, 0.6],
            onComplete: () => {
                button.setInteractive(true);
                this.menuBtn.setInteractive(true);
            }
        });
    }

    tweenBack(button: InteractiveBtn) {
        button.setInteractive(false);
        this.scene.tweens.add({
            targets: button,
            y: gameConfig.scale.width / 10 + button.height,
            duration: 600,
            ease: 'Elastic',
            easeParams: [1.1, 0.6],
            onComplete: () => {
                button.setVisible(false);
                this.menuBtn.setInteractive(true);
            }
        });
    }

    settingBtnInit() {
        const settingBtnSprites = [
            this.scene.textures.get('settingBtn'),
            this.scene.textures.get('settingBtnH')
        ];
        this.settingBtn = new InteractiveBtn(this.scene, settingBtnSprites, () => {
            // console.log("called");
        }, 2, false);
        this.settingBtn.setPosition(gameConfig.scale.width / 10, gameConfig.scale.height / 4);
        this.add(this.settingBtn);
    }

    ruleBtnInit() {
        const rulesBtnSprites = [
            this.scene.textures.get('rulesBtn'),
            this.scene.textures.get('rulesBtnH')
        ];
        this.rulesBtn = new InteractiveBtn(this.scene, rulesBtnSprites, () => {
            // console.log("called");
        }, 3, false);
        this.rulesBtn.setPosition(gameConfig.scale.width / 10, gameConfig.scale.height / 4);
        this.add(this.rulesBtn);
    }

    infoBtnInit() {
        const infoBtnSprites = [
            this.scene.textures.get('infoBtn'),
            this.scene.textures.get('infoBtnH'),
        ];
        this.infoBtn = new InteractiveBtn(this.scene, infoBtnSprites, () => {
            // console.log("called");
        }, 4, false);
        this.infoBtn.setPosition(gameConfig.scale.width / 10, gameConfig.scale.height / 4);
        this.add(this.infoBtn);
    }
}

class InteractiveBtn extends Phaser.GameObjects.Sprite {
    moveToPosition: number = -1;

    constructor(scene: Phaser.Scene, textures: Phaser.Textures.Texture[], callback: () => void, endPos: number, visible: boolean) {
        super(scene, 0, 0, textures[0].key); // Use texture key

        this.setOrigin(0.5);
        this.setInteractive();
        this.setVisible(visible);
        this.moveToPosition = endPos;

        this.on('pointerdown', () => {
            this.setFrame(1);
            callback();
        });
        this.on('pointerup', () => {
            this.setFrame(0);
        });
        this.on('pointerout', () => {
            this.setFrame(0);
        });

        // Set up animations if necessary
        this.anims.create({
            key: 'hover',
            frames: this.anims.generateFrameNumbers(textures[1].key),
            frameRate: 10,
            repeat: -1
        });
    }
}

