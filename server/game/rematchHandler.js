// rematchHandler.js - Server-side rematch management

const rematchRequests = new Map(); // Map<roomId, Set<socketId>>

class RematchHandler {
    constructor() {
        this.pendingRematches = new Map(); // Map<roomId, { players: Set<socketId>, match: matchData }>
    }
    
    // Handle rematch request from a player
    handleRematchRequest(socket, io, getMatchBySocket, createMatch, startCharacterSelectTimeout) {
        const oldMatch = getMatchBySocket(socket);
        
        if (!oldMatch) {
            console.log('[Rematch] No match found for socket:', socket.id);
            return;
        }
        
        const roomId = oldMatch.roomId;
        
        // Initialize rematch request set for this room
        if (!this.pendingRematches.has(roomId)) {
            this.pendingRematches.set(roomId, {
                players: new Set(),
                matchData: oldMatch
            });
        }
        
        const rematchData = this.pendingRematches.get(roomId);
        rematchData.players.add(socket.id);
        
        console.log(`[Rematch] ${socket.id} requested rematch in room ${roomId}`);
        console.log(`[Rematch] ${rematchData.players.size}/${oldMatch.players.length} players ready`);
        
        // Check if all players have requested rematch
        if (rematchData.players.size === oldMatch.players.length) {
            this.initiateRematch(roomId, oldMatch, io, createMatch, startCharacterSelectTimeout);
        }
    }
    
    // Start a rematch
    initiateRematch(roomId, oldMatch, io, createMatch, startCharacterSelectTimeout) {
        console.log(`[Rematch] Starting rematch for room ${roomId}`);
        
        // Get the player sockets from old match
        const playerSockets = oldMatch.players.map(p => p.socket);
        
        // Create new match with same players
        const newMatch = createMatch(roomId, playerSockets);
        
        // Notify players that rematch is accepted
        io.to(roomId).emit('rematchAccepted', {
            roomId: newMatch.roomId
        });
        
        // Start character select timeout for new match
        const { initializeGameState, startGameLoop } = require('./gameState.js');
        
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
            } catch(error) {
                console.error('[Rematch] Failed to start match:', error);
                io.to(fightData.roomId).emit("matchError", {
                    message: "Failed to start match"
                });
            }
        });
        
        // Clean up rematch data
        this.pendingRematches.delete(roomId);
    }
    
    // Handle player declining rematch or disconnecting
    handleRematchDecline(socket, io, getMatchBySocket) {
        const match = getMatchBySocket(socket);
        
        if (!match) return;
        
        const roomId = match.roomId;
        
        // Notify other players that rematch was declined
        io.to(roomId).emit('rematchDeclined');
        
        // Clean up
        this.pendingRematches.delete(roomId);
        
        console.log(`[Rematch] Declined for room ${roomId}`);
    }
    
    // Clean up rematch data for a room
    clearRoom(roomId) {
        this.pendingRematches.delete(roomId);
    }
}

// Create singleton instance
const rematchHandler = new RematchHandler();

module.exports = { rematchHandler };