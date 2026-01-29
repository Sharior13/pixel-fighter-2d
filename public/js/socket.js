import { openCharacterSelect, showOpponentPreview } from "./characterSelect.js";
import { keys, actionTriggered } from "./input.js";
import { titleScreen } from "./main.js";
import { initializeRender, updateGameState } from "./render.js";

let socket = null;
let inMatch = false;
let inputInterval = null;
let lastSentDirection = 0;

const initializeSocket = (mode, roomId)=>{
    if(socket){
        return;
    }

    socket = io();

    //start match process
    socket.emit("findMatch", mode, roomId);

    socket.on("queueJoined", ()=>{
        if(inMatch){
            return;
        }

        //add loading image for queue later
        document.getElementById("queuing").classList.remove("hidden");
        document.getElementById("queuing").innerHTML = `<p>Queue started!</p>`;
    });

    socket.on("matchFound", ({ roomId, playerIndex })=>{
        inMatch = true;
        console.log("Match found!", roomId);
        document.getElementById("queuing").classList.add("hidden");
        openCharacterSelect();
    });

    
    socket.on("characterPreview", ({ socketId, characterId })=>{
        if(socketId === socket.id){
          return;
        }

        showOpponentPreview(socketId, characterId);
    });

    socket.on("playerLocked", ({socketId})=>{
        if(socketId === socket.id){
          return;
        }

        document.getElementById("statusText").textContent =
          "Opponent locked in!";
    });

    socket.on("startMatch", ()=>{
        document.getElementById("character-select").classList.add("hidden");
        
        initializeRender();
    });

    //update game state
    socket.on("gameStateUpdate", (state)=>{
        console.log("maybe working fine");

        updateGameState(state);
    });

    socket.on("abilityExecuted", ({ socketId, ability, result }) => {
        //play animations, sound effects, damage numbers
        console.log(`${socketId} used ${ability}, hits:`, result.hits);
    });

    //handle match end
    socket.on("matchEnd", ({ winner, finalStats, reason })=>{
        console.log("Match ended! Winner:", winner);
        cleanupSocket();
        titleScreen();
        return;
    });

    socket.on("matchError", ({errMsg})=>{
        console.log("Match error: ", errMsg);
        cleanupSocket();
        titleScreen();
        return;
    })

    //send input to backend
    inputInterval = setInterval(()=>{
        if(socket){
            processInputs();
        }
    }, 1000/60);
};

const processInputs = ()=>{
    const inputs = [];

    //movement
    let direction = 0;
    if(keys.a || keys.ArrowLeft) direction = -1;
    if(keys.d || keys.ArrowRight) direction = 1;
    
    if(direction !== lastSentDirection) {
        inputs.push({ type: "move", direction });
        lastSentDirection = direction;
    }
    
    //jump
    if((keys.w || keys.ArrowUp) && !actionTriggered.jump) {
        inputs.push({ type: "jump" });
        actionTriggered.jump = true;
    }
    
    //attackz
    if(keys.z && !actionTriggered.basic) {
        inputs.push({ type: "attack", ability: "basic" });
        actionTriggered.basic = true;
    }
    if(keys.x && !actionTriggered.special) {
        inputs.push({ type: "attack", ability: "special" });
        actionTriggered.special = true;
    }
    if(keys.c && !actionTriggered.ultimate) {
        inputs.push({ type: "attack", ability: "ultimate" });
        actionTriggered.ultimate = true;
    }
    
    //block
    if(keys.Shift && !actionTriggered.block) {
        inputs.push({ type: "block" });
        actionTriggered.block = true;
    }
    
    //send all inputs at once
    if(inputs.length > 0) {
        socket.emit("playerInput", inputs);
    }
};

const cleanupSocket = ()=>{

    //handle player disconnect after game ends
    if(inputInterval){
        clearInterval(inputInterval);
        inputInterval = null;
    }

    lastSentDirection = 0;
    
    if(socket){
        socket.off();
        socket.disconnect();
        socket = null;
    }
};

export { initializeSocket, cleanupSocket, socket };