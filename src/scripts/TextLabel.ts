import { Scene, GameObjects } from 'phaser';

export class TextLabel extends GameObjects.Text {
    defaultColor: string;

    constructor(scene: Scene, x: number, y: number, textToShow: string, size: number, defaultColor: string = '#ff7f50', font: string = 'Inter') {
        super(scene, x, y, textToShow, {
            fontFamily: font,
            fontSize: `${size}px`,
            color: defaultColor
        });

        this.defaultColor = defaultColor;

        // Set the anchor
        this.setOrigin(0.5, 0.5);

        // Add this text object to the scene
        scene.add.existing(this);
    }

    updateLabelText(text: string) {
        console.log(text, "text");
        
        this.setText(text);
        // Optionally, update color or other styles here if needed
    }

    setTextColor(color: string) {
        this.setColor(color);
    }
}
