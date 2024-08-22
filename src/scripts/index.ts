import Phaser from "phaser";
import { gameConfig, CalculateScaleFactor } from "./appconfig";
import { Globals } from "./Globals";
import { SocketManager } from "../socket";

window.parent.postMessage( "authToken","*");

if(!IS_DEV)
{

  window.addEventListener("message", function(event: MessageEvent) {
    console.log("event check", event);
    // Check the message type and handle accordingly
    if (event.data.type === "authToken") {
      console.log("event check", event.data);
      const data = { 
        socketUrl : event.data.socketURL,
        authToken :  event.data.cookie
      }
      // Call the provided callback function
      console.log("Got Data From Cookies : ",data);
      Globals.Socket = new SocketManager();
      Globals.Socket.onToken(data);
    }
  });
}
else
{
  const data  = {
    socketUrl : "https://dev.casinoparadize.com/",
    authToken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzU4M2RkMWJkNzI4Zjg3YTM0ZWQ2OSIsInVzZXJuYW1lIjoiYXJwaXQiLCJyb2xlIjoicGxheWVyIiwiaWF0IjoxNzI0MjIwNDA2LCJleHAiOjE3MjQ4MjUyMDZ9.z6SvMAQLF_CTI1WZdNfCWvxHFF91U8tjwsogLAOkEY4",
  }
  Globals.Socket = new SocketManager();
  Globals.Socket.onToken(data);
}

function loadGame() {
  new Phaser.Game(gameConfig);
}

if (typeof console !== 'undefined') {
  console.warn = () => {};
  console.info = () => {};
  // console.debug = () => {};
}


loadGame();