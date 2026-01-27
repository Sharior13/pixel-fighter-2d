import { openCharacterSelect, showOpponentPreview } from "./characterSelect.js";

let socket = null;

const initializeSocket = (mode, roomId)=>{
    if(socket){
        return;
    }

    socket = io();

    //start match process
    socket.emit("findMatch", mode, roomId);

    socket.on("queueJoined", ()=>{
        //add loading image for queue 
    });

    socket.on("matchFound", ({ roomId, playerIndex }) => {
        console.log("Match found!", roomId);
        openCharacterSelect();
    });

    socket.on("characterPreview", ({ socketId, characterId })=>{
        if(socketId === socket.id){
          return;
        }

        showOpponentPreview(socketId, characterId);
    });

    socket.on("playerLocked", (socketId)=>{
        if(socketId === socket.id){
          return;
        }

        document.getElementById("statusText").textContent =
          "Opponent locked in!";
    });

    socket.on("startMatch", ({ players }) => {
        document.getElementById("character-select").classList.add("hidden");
        
        // startFight(players);
    });
};

export { initializeSocket, socket };