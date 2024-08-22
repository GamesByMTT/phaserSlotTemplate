import Phaser from "phaser";
import { gameConfig, CalculateScaleFactor } from "./appconfig";
import { log } from "console";

window.parent.postMessage( "authToken","*");

function loadGame() {
  new Phaser.Game(gameConfig);
}

if (typeof console !== 'undefined') {
  console.warn = () => {};
  console.info = () => {};
  // console.debug = () => {};
}


loadGame();