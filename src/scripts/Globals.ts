import Phaser from "phaser";
import { App } from "./App";
import Stats from "stats.js"
import MyEmitter from "./MyEmitter";
import { Howl } from "howler";
import { SocketManager } from "../socket";

type globalDataType = {
  resources: { [key: string]:  Phaser.Textures.Texture }
  emitter: MyEmitter | undefined;
  isMobile: boolean;
  fpsStats : Stats ,
  soundResources: { [key: string]: Howl };

  App: App | undefined;
  Socket : SocketManager | undefined,
  PhaserInstance: Phaser.Game | undefined;
}

export const Globals: globalDataType = {
 resources: { },
  emitter: undefined,
  get isMobile() {
    if (!this.PhaserInstance) {
      return false; // Default to false if PhaserInstance is not set
    }
    const device = this.PhaserInstance.device;
    return device.os.android || device.os.iOS;
  },
  fpsStats: new Stats(),
  App: undefined,
  Socket: undefined,
  soundResources: {},
  PhaserInstance: undefined
};


export const currentGameData = {
  currentBetIndex : 0,
  won : 0,
  AutoPlay: 0,
  currentLines : 0,
  currentBalance : 0,
  isMoving : false,
}

export const initData = {
  gameData : {
    Reel : [[]],
    BonusData : [],
    Bets : [],
    LinesCount : [],
    autoSpin : [],
    Lines : [[]],

  },
  playerData : {
    Balance : 0,
    haveWon : 0,
    currentWining : 0,
    currentBet : 0,
  },
};

export const ResultData = {
  gameData : {
    BonusResult: [],
    BonusStopIndex:  -1,
    ResultReel: [[]],
    WinAmout: 0,
    freeSpins:  {
      count: 0,
      isNewAdded: false
    },
    isBonus:  false,
    jackpot:  0,
    linesToEmit:[],
    symbolsToEmit: [],
  },
  playerData : {
    Balance : 0,
    haveWon : 0,
    currentWining : 0,
    currentBet : 0,
  },
};
export const TextStyle = {
  dropShadow: true,
  dropShadowAngle: 1.8,
  dropShadowColor: "#ffffff",
  dropShadowDistance: 1,
  fill: "#4f3130",
  fillGradientStops: [
    0.4
  ],
  fontWeight: "bolder",
  lineJoin: "round",
  miterLimit: 0,
  stroke: "#4f3130",
  strokeThickness: 1.5
};
