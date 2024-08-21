import { io } from "socket.io-client";
import { Globals, ResultData, initData } from "./scripts/Globals";
import { EventEmitter } from "stream";

function getToken() {
  let cookieArr = document.cookie.split("; ");
  for(let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split("=");
      if('token' === cookiePair[0]) {
          return decodeURIComponent(cookiePair[1]);
      }
  }
  return null;
}
let SocketUrl = "https://dev.casinoparadize.com/";
let AuthToken =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzU4M2RkMWJkNzI4Zjg3YTM0ZWQ2OSIsInVzZXJuYW1lIjoiYXJwaXQiLCJyb2xlIjoicGxheWVyIiwiaWF0IjoxNzI0MjIwNDA2LCJleHAiOjE3MjQ4MjUyMDZ9.z6SvMAQLF_CTI1WZdNfCWvxHFF91U8tjwsogLAOkEY4";


function AuthVerify(callBack  : ()=>{})
{
  window.addEventListener('message', (event) => {
    if (event.data.type === 'authToken') 
    {
      SocketUrl = event.data.socketURL
      AuthToken = event.data.cookie;
      callBack();
    }
      

});
}


// // Usage example
// let token = getToken();
// if(token!== null) {
//   console.log("Token:", token);
// } else {''
//   console.log("Token not found");
// }


// const socketUrl = process.env.SOCKET_URL || ""
export class SocketManager {
  private socket : any;

  constructor(public onInitDataReceived: () => void) { 
    // const token = getToken();
    
        // Initialize the socket connection now that we have the necessary data
    //     this.initializeSocket();
   
    // if(token!== null) {
    //   console.log("Token:", token);
    // } else {
    //   console.log("Token not found");
    // }
    AuthVerify(()=>this.setupSocket)
    // this.setupSocket();
  
  }
  
  setupSocket()
  {
   this.socket = io(SocketUrl, {
      auth: {
        token: AuthToken,
        gameId: "SL-GOE",
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000, // Initial delay between reconnection attempts (in ms)
      reconnectionDelayMax: 5000,
    });
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on("connect_error", (error: Error) => {
      console.error("Connection Error:", error.message);
    });

    this.socket.on("connect", () => {
      console.log("Connected to the server");


      this.socket.on("message", (message : any) => {
        const data = JSON.parse(message);
        // console.log(`Message ID : ${data.id} |||||| Message Data : ${JSON.stringify(data.message)}`);
        if(data.id == "InitData") {
            this.onInitDataReceived();
            initData.gameData = data.message.GameData;
            initData.playerData = data.message.PlayerData;
            console.log(data, "initData on Socket File");
        }
        if(data.id == "ResultData"){
              ResultData.gameData = data.message.GameData;
              ResultData.playerData = data.message.PlayerData;
              Globals.emitter?.Call("ResultData");
              console.log(ResultData);
        }
      });
    });

    this.socket.on("internalError", (errorMessage: string) => {
      console.log(errorMessage);
    });
  }
 // Add this method to the SocketManager class in socket.ts
authenticate(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.socket.on("connect", () => {
            console.log("Connected to the server");

            this.socket.emit(
                "AUTH",
                JSON.stringify({
                    id: "AUTH",
                    Data: {
                        GameID: "SL-GF",
                    },
                })
            );

        });
    });
}
  messages(message: any) {
    // console.log(message, "Scoket message testing");
  }
  sendMessage(id : string, message: any) {
    console.log(message, "sending message");
    this.socket.emit(
      "message",
      JSON.stringify({ id: id, data: message })
    );
  }

}

