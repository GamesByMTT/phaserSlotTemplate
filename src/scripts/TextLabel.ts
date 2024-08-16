import { Scene, GameObjects } from 'phaser';
import {TextStyle as globalTextStyle} from './Globals'

export class TextLabel extends GameObjects.Text {
    defaultColor: string;

    constructor(scene: Scene, x: number, y: number, textToShow: string, size: number, defaultColor: string = '#ffffff', font: string = 'Inter') {
        const style = {
            ...globalTextStyle,
            fontFamily: font,
            fontSize: `${size}px`,
            color: defaultColor,
            fill: defaultColor,
        };
        super(scene, x, y, textToShow, style);
    
        this.defaultColor = defaultColor;

        // Set the anchor
        this.setOrigin(0.5, 0.5);

        // Add this text object to the scene
        scene.add.existing(this);
    }

    updateLabelText(text: string) {
        console.log("text", text);
        this.setText(text);
    }

    setTextColor(color: string) {
        this.setColor(color);
    }
}
