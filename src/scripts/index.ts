import Phaser from "phaser";
import { gameConfig, CalculateScaleFactor } from "./appconfig";

function loadGame() {
  new Phaser.Game(gameConfig);
}

if (typeof console !== 'undefined') {
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
}

loadGame();

