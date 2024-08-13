import Phaser from "phaser";
import BBCodeTextPlugin from "phaser3-rex-plugins/plugins/bbcodetext-plugin";
import MainLoader from "../view/MainLoader";
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;
const ASPECT_RATIO = BASE_WIDTH / BASE_HEIGHT;

export const gameConfig = {
    
  type: Phaser.AUTO,
  scene: [MainLoader],
  scale: {
    scaleFactor: 1,
    minScaleFactor: 1,
    mode: Phaser.Scale.CENTER_BOTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
    get topY(): number {
      return (window.innerHeight - (this.width * this.scaleFactor)) / 2;
    },
    get bottomY(): number {
      return window.innerHeight - this.topY;
    },
    get leftX(): number {
      return (window.innerWidth - (this.width* this.scaleFactor)) / 2;
    },
    get rightX(): number {
      return window.innerWidth - this.leftX;
    },
    get minTopY(): number {
      return (window.innerHeight - (this.width * this.minScaleFactor)) / 2;
    },
    get minBottomY(): number {
      return window.innerHeight - this.minTopY;
    },
    get minLeftX(): number {
      return (window.innerWidth - (this.width* this.minScaleFactor)) / 2;
    },
    get minRightX(): number {
      return window.innerWidth - this.leftX;
    }
  },
  physics: { 
    default: "arcade",
    arcade: {
      debug: false,
    },
  },

  plugins: {
    global: [
      {
        key: "rexBBCodeTextPlugin",
        plugin: BBCodeTextPlugin,
        start: true,
      },
    ],
  }
  
};

export const CalculateScaleFactor = () => {
	const maxScaleFactor = Math.max(
		window.innerWidth / gameConfig.scale.width,
		window.innerHeight / gameConfig.scale.height,
	);

	const minScaleFactor = Math.min(
		window.innerWidth / gameConfig.scale.width,
		window.innerHeight / gameConfig.scale.height,
	);

	gameConfig.scale.scaleFactor = maxScaleFactor;
	gameConfig.scale.minScaleFactor = minScaleFactor;

	// console.log(gameConfig.leftX, gameConfig.rightX);
	// console.log(window.innerWidth + "x" + window.innerHeight);
	// console.log(gameConfig.scaleFactor);
	// console.log(gameConfig.minScaleFactor);
};
export const maxScaleFactor = () =>{
	return Math.max(
		window.innerWidth / gameConfig.scale.width,
		window.innerHeight / gameConfig.scale.height,
	);
};
export const minScaleFactor = () =>{
	return Math.min(
		window.innerWidth / gameConfig.scale.width,
		window.innerHeight / gameConfig.scale.height,
	);
};