import { openCharacterSelect, showOpponentPreview } from "../ui/characterSelect.js";
import { keys, actionTriggered } from "./input.js";
import { titleScreenUI } from "../ui/titleScreen.js";
import { initializeRender, stopRender, setMap, updateGameState } from "./render.js";
import { matchEndScreen } from "../ui/matchEndScreen.js";
import { battleUI } from "../ui/battleUI.js";

let socket = null;
let inMatch = false;
let inputInterval = null;

const initializeSocket = (mode, roomId) => {
    if (socket) {
        return;
    }

    socket = io();

    const username = titleScreenUI.getUsername();
    console.log('[Socket] Sending username:', username);
    // Start match process
    if (mode === "quickStart") {
        socket.emit("findMatch", mode, roomId, username);
    } else if (mode === "createCustomRoom") {
        socket.emit("createCustomRoom", username);
    } else if (mode === "joinCustomRoom") {
        socket.emit("joinCustomRoom", roomId, username);
    }

    socket.on("queueJoined", () => {
        if (inMatch) {
            return;
        }

        document.getElementById("queuing").classList.remove("hidden");
        document.getElementById("queuing").innerHTML = `<p>Queue started!</p>`;
    });

    socket.on("customRoomCreated", ({ roomId }) => {
        console.log("Custom room created:", roomId);
        document.getElementById("queuing").classList.remove("hidden");
        document.getElementById("queuing").innerHTML = `
            <div style="text-align: center;">
                <p>Custom Room Created!</p>
                <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">Room ID: ${roomId}</p>
                <p style="font-size: 14px; color: #888;">Waiting for opponent to join...</p>
            </div>
        `;
    });

    socket.on("customRoomError", ({ message }) => {
        alert(message);
        document.getElementById("queuing").classList.add("hidden");
        cleanupSocket();
        stopRender();
        titleScreenUI.showTitleScreen();
    });

    socket.on("matchFound", ({ roomId, playerIndex }) => {
        inMatch = true;
        console.log("Match found!", roomId);
        document.getElementById("queuing").classList.add("hidden");
        openCharacterSelect();
    });

    socket.on("characterPreview", ({ socketId, characterId }) => {
        if (socketId === socket.id) {
            return;
        }

        showOpponentPreview(socketId, characterId);
    });

    socket.on("playerLocked", ({ socketId }) => {
        if (socketId === socket.id) {
            return;
        }

        document.getElementById("statusText").textContent = "Opponent locked in!";
        document.getElementById('p2-label').classList.add('active');
    });

    socket.on("startMatch", (gameState) => {
        document.getElementById("character-select").style.display = "none";
        canvas.style.backgroundImage = 'none';

        setMap(gameState.map);
        battleUI.initialize(gameState);
        initializeRender();
    });

    // Update game state
    socket.on("gameStateUpdate", (state) => {
        updateGameState(state);
    });

    // Handle match end
    socket.on("matchEnd", ({ winner, finalStats, reason }) => {
        console.log("Match ended! Winner:", winner);

        // Stop game loop
        stopRender();
        
        // Hide battle UI
        battleUI.hide();

        // Show match end screen with stats
        const localPlayer = finalStats.find(p => p.socketId === socket.id);
        const opponent = finalStats.find(p => p.socketId !== socket.id);

        matchEndScreen.show({
            winner,
            localPlayer,
            opponent,
            reason
        });

        inMatch = false;
    });

    // Handle rematch responses
    socket.on("rematchAccepted", ({ roomId }) => {
        console.log("Rematch accepted!");
        matchEndScreen.handleRematchAccepted();
        openCharacterSelect();
    });

    socket.on("rematchDeclined", () => {
        console.log("Rematch declined by opponent");
        matchEndScreen.handleRematchDeclined();
    });

    socket.on("playerReturnedToMenu", (socketId) => {
        console.log("Opponent returned to menu");
        if (matchEndScreen.isWaitingForRematch) {
            matchEndScreen.handleRematchDeclined();
        }
    });

    socket.on("matchError", ({ errMsg }) => {
        console.log("Match error: ", errMsg);
        document.getElementById("character-select").style.display = "none";
        cleanupSocket();
        stopRender();
        titleScreenUI.showTitleScreen();
    });

    // Send input to backend
    inputInterval = setInterval(() => {
        if (socket) {
            processInputs();
        }
    }, 1000 / 60);
};

const processInputs = () => {
    const inputs = [];

    let direction = 0;
    if (keys.a) direction = -1;
    if (keys.d) direction = 1;

    inputs.push({ type: "move", direction });

    // Jump
    if ((keys.w || keys[' ']) && !actionTriggered.jump) {
        inputs.push({ type: "jump" });
        actionTriggered.jump = true;
    }

    // Dash
    if (keys.Shift && !actionTriggered.dash) {
        inputs.push({ type: "dash" });
        actionTriggered.dash = true;
    }

    // Separate attack buttons
    if (keys.q && !actionTriggered.attack1) {
        inputs.push({ type: "attack", ability: "attack1" });
        actionTriggered.attack1 = true;
    }
    if (keys.e && !actionTriggered.attack2) {
        inputs.push({ type: "attack", ability: "attack2" });
        actionTriggered.attack2 = true;
    }
    if (keys.z && !actionTriggered.basic) {
        inputs.push({ type: "attack", ability: "basic" });
        actionTriggered.basic = true;
    }
    if (keys.x && !actionTriggered.special) {
        inputs.push({ type: "attack", ability: "special" });
        actionTriggered.special = true;
    }
    if (keys.c && !actionTriggered.ultimate) {
        inputs.push({ type: "attack", ability: "ultimate" });
        actionTriggered.ultimate = true;
    }

    // Block
    if (keys.s) {
        if (!actionTriggered.block) {
            inputs.push({ type: "block", activate: true });
            actionTriggered.block = true;
        }
    } else {
        if (actionTriggered.block) {
            inputs.push({ type: "block", activate: false });
            actionTriggered.block = false;
        }
    }

    // Send all inputs at once
    if (inputs.length > 0) {
        socket.emit("playerInput", inputs);
    }
};

// Handle player disconnect after game ends
const cleanupSocket = () => {
    if (inputInterval) {
        clearInterval(inputInterval);
        inputInterval = null;
    }

    inMatch = false;

    if (socket) {
        socket.off();
        socket.disconnect();
        socket = null;
    }
    
    console.log('[Socket] Cleaned up socket connection');
};

export { initializeSocket, cleanupSocket, socket };