import { io } from "socket.io-client";
import { Globals, ResultData, initData } from "./scripts/Globals";


// const socketUrl = process.env.SOCKET_URL || ""
export class SocketManager {
  private socket : any;
  public authToken : string = "";
  public SocketUrl : string= "";
  public socketLoaded : boolean = false;

  constructor() { 
   
  }

  onToken(data : {socketUrl : string, authToken : string})
  {
    try { 
      this.SocketUrl = data.socketUrl;
      this.authToken = data.authToken;
      this.socketLoaded = true;
      this.setupSocket();
    }
    catch(error){
      console.error("Got Error In Auth Token : ",error);
    }
  }
  
  setupSocket()
  {
   this.socket = io(this.SocketUrl, {
      auth: {
        token: this.authToken,
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
            // Globals.MainLoader?.onInitDataReceived();
            // this.onInitDataReceived()
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
  updateSocketConfig(newSocketUrl: string, newAuthToken: string) {
    console.log("updateSocketConfig to update socket URL");
    SocketUrl = newSocketUrl;
    AuthToken = newAuthToken;
    console.log(this.socket, "this.socket");
    
    if (this.socket == undefined) {
        // this.socket.disconnect();
        console.log("setupSocket");
        
        this.setupSocket(); // Reinitialize the socket with new config
    }
}
}

