import Phaser from "phaser";
import { Globals, TextStyle } from "./Globals";
import { gameConfig } from "./appconfig";
import { TextLabel } from "./TextLabel";

export class UiPopups extends Phaser.GameObjects.Container {
    menuBtn!: InteractiveBtn;
    settingBtn!: InteractiveBtn;
    rulesBtn!: InteractiveBtn;
    infoBtn!: InteractiveBtn;
    exitBtn!: InteractiveBtn
    yesBtn!: InteractiveBtn;
    noBtn!: InteractiveBtn
    isOpen: boolean = false;
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.setPosition(0, 0);
        this.ruleBtnInit();
        this.settingBtnInit();
        this.infoBtnInit();
        this.menuBtnInit();
        this.exitButton();
        scene.add.existing(this);
    }

    menuBtnInit() {
        const menuBtnTextures = [
            this.scene.textures.get('MenuBtn'),
            this.scene.textures.get('MenuBtnH')
        ];
        this.menuBtn = new InteractiveBtn(this.scene, menuBtnTextures, () => {
            this.openPopUp();
        }, 0, true);
        this.menuBtn.setPosition(this.menuBtn.width, this.menuBtn.height * 0.7 );
        this.add(this.menuBtn);
    }
    exitButton(){
        const exitButtonSprites = [
            this.scene.textures.get('exitButton'),
            this.scene.textures.get('exitButtonPressed')
        ];
        console.log(exitButtonSprites, "exitButtonSprites");
        this.exitBtn = new InteractiveBtn(this.scene, exitButtonSprites, ()=>{
            this.exitBtn.setTexture("exitButtonPressed");
            this.openLogoutPopup();
            // window.parent.postMessage( "onExit","*");
            // Globals.Socket?.sendMessage("EXIT",{});
        }, 0, true, );
        this.exitBtn.setPosition(gameConfig.scale.width - this.exitBtn.width, this.exitBtn.height * 0.7)
        this.add(this.exitBtn)
    }
    
    settingBtnInit() {
        const settingBtnSprites = [
            this.scene.textures.get('settingBtn'),
            this.scene.textures.get('settingBtnH')
        ];
        this.settingBtn = new InteractiveBtn(this.scene, settingBtnSprites, () => {
            // setting Button
        }, 1, false); // Adjusted the position index
        this.settingBtn.setPosition(this.settingBtn.width, this.settingBtn.height * 0.7);
        this.add(this.settingBtn);
    }

    infoBtnInit() {
        const infoBtnSprites = [
            this.scene.textures.get('infoBtn'),
            this.scene.textures.get('infoBtnH'),
        ];
        this.infoBtn = new InteractiveBtn(this.scene, infoBtnSprites, () => {
            // info button 
        }, 2, false); // Adjusted the position index
        this.infoBtn.setPosition(this.infoBtn.width, this.infoBtn.height * 0.7);
        this.add(this.infoBtn);
    }

    ruleBtnInit() {
        const rulesBtnSprites = [
            this.scene.textures.get('rulesBtn'),
            this.scene.textures.get('rulesBtnH')
        ];
        this.rulesBtn = new InteractiveBtn(this.scene, rulesBtnSprites, () => {
            // rules button
        }, 3, false); // Adjusted the position index
        this.rulesBtn.setPosition(this.rulesBtn.width, this.rulesBtn.height * 0.7);
        this.add(this.rulesBtn);
    }

    openPopUp() {
        // Toggle the isOpen boolean
        this.isOpen = !this.isOpen;
        this.menuBtn.setInteractive(false);
        if (this.isOpen) {
            this.tweenToPosition(this.rulesBtn, 3);
            this.tweenToPosition(this.infoBtn, 2);
            this.tweenToPosition(this.settingBtn, 1);
        } else {
            this.tweenBack(this.rulesBtn);
            this.tweenBack(this.infoBtn);
            this.tweenBack(this.settingBtn);
        }
    }

    tweenToPosition(button: InteractiveBtn, index: number) {

        const targetY = this.menuBtn.height + index * this.menuBtn.height; // Calculate the Y position with spacing
        button.setVisible(true);
        this.scene.tweens.add({
            targets: button,
            y: targetY,
            duration: 300,
            ease: 'Elastic',
            easeParams: [1, 0.9],
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
            y: button.height,
            duration: 100,
            ease: 'Elastic',
            easeParams: [1, 0.9],
            onComplete: () => {
                button.setVisible(false);
                this.menuBtn.setInteractive(true);
            }
        });
    }

    openLogoutPopup() {
        // Create a container for the popup
        const popupContainer = this.scene.add.container(
            gameConfig.scale.width/2, 
            gameConfig.scale.height/2
        );
        const logoutButtonSprite = [
            this.scene.textures.get("lines"),
            this.scene.textures.get("lines")
        ]
        // Create a semi-transparent background for the popup
        const popupBg = this.scene.add.image(0, 0, 'popupBgimg').setInteractive();
        popupBg.setOrigin(0.5);
        popupBg.setDisplaySize(683, 787); // Set the size for your popup background
        popupBg.setAlpha(1); // Optional: Set background transparency
    
        // Add text to the popup
        const popupText = new TextLabel(this.scene, 0, -45, "Are you sure you want to exit?", 35, "#3C2625");
        this.yesBtn = new InteractiveBtn(this.scene, logoutButtonSprite, ()=>{
            window.parent.postMessage( "onExit","*");
            Globals.Socket?.sendMessage("EXIT",{});
            popupContainer.destroy();
        }, 0, true)
        this.noBtn = new InteractiveBtn(this.scene, logoutButtonSprite, ()=>{
            popupContainer.destroy()
        }, 0, true)
        this.yesBtn.setPosition(-130, 80);
        this.noBtn.setPosition(130, 80);
        const noText = new TextLabel(this.scene, 130, 65, "No", 30, "#ffffff")
        this.add(noText);
        const yesText = new TextLabel(this.scene, -130, 65, "Yes", 30, "#ffffff")
        this.add(yesText)
        this.add(this.yesBtn);
        this.add(this.noBtn);
    
        popupContainer.add([popupBg, popupText, this.yesBtn, this.noBtn, yesText, noText]);
        this.scene.add.existing(popupContainer);
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

