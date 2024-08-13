import Phaser from "phaser";
import { gameConfig, CalculateScaleFactor } from "./appconfig";

function loadGame() {
  new Phaser.Game(gameConfig);
}

loadGame();

