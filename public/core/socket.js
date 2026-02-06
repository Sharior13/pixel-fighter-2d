import { openCharacterSelect, showOpponentPreview } from "../ui/characterSelect.js";
import { keys, actionTriggered } from "./input.js";
import { titleScreenUI } from "../ui/titleScreen.js";
import { initializeRender, stopRender, setMap, updateGameState, triggerKOAnimation  } from "./render.js";
import { matchEndScreen } from "../ui/matchEndScreen.js";
import { battleUI } from "../ui/battleUI.js";
import { audioManager } from "./audioManager.js";

let socket = null;
let inMatch = false;
let inputInterval = null;
let currentCharacterId = null;

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
        
        // Play map music
        if (gameState.map && gameState.map.id) {
            console.log('[Socket] Playing map music:', gameState.map.id);
            audioManager.playMapMusic(gameState.map.id);
        }
        
        // Find local player's character and preload sounds
        const localPlayer = gameState.players.find(p => p.socketId === socket.id);
        if (localPlayer && localPlayer.character) {
            currentCharacterId = localPlayer.character;
            audioManager.preloadCharacterSounds(localPlayer.character);
            console.log('[Socket] Preloaded sounds for:', localPlayer.character);
        }
        
        // Preload opponent's sounds too
        const opponent = gameState.players.find(p => p.socketId !== socket.id);
        if (opponent && opponent.character) {
            audioManager.preloadCharacterSounds(opponent.character);
            console.log('[Socket] Preloaded opponent sounds for:', opponent.character);
        }
        
        battleUI.initialize(gameState);
        initializeRender();
    });

    // Update game state
    socket.on("gameStateUpdate", (state) => {
        updateGameState(state);
    });

    socket.on('knockoutAnimation', (data) => {
        console.log('[Socket] Knockout animation triggered', data);
        triggerKOAnimation();
    });

    // Handle match end
    socket.on("matchEnd", ({ winner, finalStats, reason }) => {
        console.log("Match ended! Winner:", winner);
        console.log("Final stats:", finalStats);
        
        setTimeout(() => {
           // Stop game loop
           stopRender();
           
           // Hide battle UI
           battleUI.hide();

            const localPlayer = finalStats.find(p => p.socketId === socket.id);
            const opponent = finalStats.find(p => p.socketId !== socket.id);
            
            console.log('[Socket] Local player stats:', localPlayer);
            console.log('[Socket] Opponent stats:', opponent);
            
            matchEndScreen.show({
                winner,
                localPlayer,
                opponent,
                finalStats,
                reason
            });
            
            // Clean up character sounds
            if (localPlayer && localPlayer.character) {
                audioManager.unloadCharacterSounds(localPlayer.character);
            }
            if (opponent && opponent.character) {
                audioManager.unloadCharacterSounds(opponent.character);
            }
            
            // Stop map music and return to title music after fade out
            audioManager.stopMusic(true);
            setTimeout(() => {
                audioManager.playTitleMusic();
            }, 600);
        }, 2500);

        inMatch = false;
        currentCharacterId = null;
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
        battleUI.hide();
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

    // Jump (audio will be played by animationStateManager when animation starts)
    if ((keys.w || keys[' ']) && !actionTriggered.jump) {
        inputs.push({ type: "jump" });
        actionTriggered.jump = true;
    }

    // Dash
    if (keys.Shift && !actionTriggered.dash) {
        inputs.push({ type: "dash" });
        actionTriggered.dash = true;
    }

    // Attacks (audio will be played by animationStateManager when animation starts)
    if (keys.ArrowLeft && !actionTriggered.attack1) {
        inputs.push({ type: "attack", ability: "attack1" });
        actionTriggered.attack1 = true;
    }
    if (keys.ArrowRight && !actionTriggered.attack2) {
        inputs.push({ type: "attack", ability: "attack2" });
        actionTriggered.attack2 = true;
    }
    if (keys.ArrowUp && !actionTriggered.basic) {
        inputs.push({ type: "attack", ability: "basic" });
        actionTriggered.basic = true;
    }
    if (keys.ArrowDown && !actionTriggered.special) {
        inputs.push({ type: "attack", ability: "special" });
        actionTriggered.special = true;
    }
    if (keys.v && !actionTriggered.ultimate) {
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
    currentCharacterId = null;

    if (socket) {
        socket.off();
        socket.disconnect();
        socket = null;
    }
    
    console.log('[Socket] Cleaned up socket connection');
};

export { initializeSocket, cleanupSocket, socket };