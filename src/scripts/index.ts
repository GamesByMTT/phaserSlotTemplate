import Phaser from "phaser";
import { gameConfig, CalculateScaleFactor } from "./appconfig";

window?.addEventListener('message', function(event){
  console.log("event check on index File", event.data);
  // Check the message type and handle accordingly
  const message = event.data;
  if(message == "authToken"){
    console.log("first message");
    SocketUrl = event.data.socketURL
    AuthToken = event.data.cookie
    // socketManager?.updateSocketConfig(event.data.socketURL, event.data.cookie)  
  }
});

function loadGame() {
  new Phaser.Game(gameConfig);
}

if (typeof console !== 'undefined') {
  console.warn = () => {};
  console.info = () => {};
  // console.debug = () => {};
}

console.log(window,"window.addEventListener");


loadGame();

