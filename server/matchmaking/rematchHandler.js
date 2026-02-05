const { initializeGameState, startGameLoop, deleteGameState } = require('../core/gameState.js');
const { createMatch, startCharacterSelectTimeout, deleteMatch } = require('./matchManager.js');

const rematchRequests = new Map(); // roomId -> Set of socket IDs who want rematch

const handleRematchRequest = (socket, io, getMatchBySocket) => {
    const match = getMatchBySocket(socket);
    
    if (!match) {
        console.log(`[Rematch] No match found for ${socket.id}`);
        return;
    }

    const roomId = match.roomId;
    
    // Initialize rematch requests for this room if not exists
    if (!rematchRequests.has(roomId)) {
        rematchRequests.set(roomId, new Set());
    }

    const requests = rematchRequests.get(roomId);
    requests.add(socket.id);

    console.log(`[Rematch] ${socket.id} wants rematch in ${roomId}. Total requests: ${requests.size}/${match.players.length}`);

    // If all players want rematch
    if (requests.size === match.players.length) {
        console.log(`[Rematch] All players agreed! Starting rematch for room ${roomId}`);
        
        // Clear rematch requests
        rematchRequests.delete(roomId);

        // CRITICAL: Delete old game state and match before creating new one
        deleteGameState(roomId);
        deleteMatch(roomId);

        // Create new match with same players
        const players = match.players.map(p => p.socket);
        const newMatch = createMatch(roomId, players);

        // Notify all players that rematch is accepted
        io.to(roomId).emit("rematchAccepted", {
            roomId: newMatch.roomId
        });

        // Start character selection timeout
        startCharacterSelectTimeout(newMatch, (fightData) => {
            try {
                const gameState = initializeGameState(fightData.roomId, fightData.players, fightData.mapId);
                io.to(fightData.roomId).emit("startMatch", {
                    roomId: fightData.roomId,
                    players: fightData.players,
                    map: gameState.map,
                    gameState: {
                        players: gameState.players.map(p => ({
                            socketId: p.socketId,
                            playerIndex: p.playerIndex,
                            character: p.character,
                            position: p.position,
                            health: p.health,
                            maxHealth: p.maxHealth
                        }))
                    }
                });

                startGameLoop(fightData.roomId, io);
                console.log("[Rematch] Match started successfully");
            } catch (error) {
                console.error("[Rematch] Error starting match:", error);
                io.to(fightData.roomId).emit("matchError", {
                    message: "Failed to start rematch"
                });
            }
        });
    }
};

const handleRematchDecline = (socket, io, getMatchBySocket) => {
    const match = getMatchBySocket(socket);
    
    if (!match) {
        return;
    }

    const roomId = match.roomId;
    
    // Clear rematch requests for this room
    rematchRequests.delete(roomId);

    // Notify all players that rematch was declined
    io.to(roomId).emit("rematchDeclined");

    console.log(`[Rematch] ${socket.id} declined rematch in ${roomId}`);
};

const clearRematchRequests = (roomId) => {
    rematchRequests.delete(roomId);
};

module.exports = { handleRematchRequest, handleRematchDecline, clearRematchRequests
};