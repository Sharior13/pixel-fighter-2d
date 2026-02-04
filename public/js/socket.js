import { openCharacterSelect, showOpponentPreview } from "./characterSelect.js";
import { keys, actionTriggered } from "./input.js";
import { titleScreen } from "./main.js";
import { initializeRender, stopRender, setMap, updateGameState } from "./render.js";

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

        document.getElementById("statusText").textContent = "Opponent locked in!";
        document.getElementById('p2-label').classList.add('active');
    });

    socket.on("startMatch", (gameState)=>{
        document.getElementById("character-select").style.display = "none"; 
        canvas.style.backgroundImage = 'none';
        
        setMap(gameState.map);
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
        stopRender();
        titleScreen();
    });

    socket.on("matchError", ({errMsg})=>{
        console.log("Match error: ", errMsg);
        document.getElementById("character-select").style.display = "none"; 
        cleanupSocket();
        stopRender();
        titleScreen();
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

    let direction = 0;
    if(keys.a) direction = -1;
    if(keys.d) direction = 1;
    
    inputs.push({ type: "move", direction });
    lastSentDirection = direction;
    
    //jump
    if((keys.w || keys[' ']) && !actionTriggered.jump) {
        inputs.push({ type: "jump" });
        actionTriggered.jump = true;
    }
    
    //dash
    if(keys.Shift && !actionTriggered.dash) {
        inputs.push({ type: "dash" });
        actionTriggered.dash = true;
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
    if(keys.s){
        if(!actionTriggered.block){
            inputs.push({ type: "block", activate: true });
            actionTriggered.block = true;
        }
    }
    else{
        if(actionTriggered.block){
            inputs.push({ type: "block", activate: false });
            actionTriggered.block = false;
        }
    }
    
    //send all inputs at once
    if(inputs.length > 0) {
        socket.emit("playerInput", inputs);
    }
};

//handle player disconnect after game ends
const cleanupSocket = ()=>{
    if(inputInterval){
        clearInterval(inputInterval);
        inputInterval = null;
    }

    lastSentDirection = 0;
    inMatch = false;
    
    if(socket){
        socket.off();
        socket.disconnect();
        socket = null;
    }
};

export { initializeSocket, cleanupSocket, socket };