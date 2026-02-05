const { initMatchmaking, addToQueue, removeFromQueue } = require('../matchmaking/matchMaking.js');
const { getMatchBySocket, selectCharacter, lockCharacter, deleteMatch } = require('../matchmaking/matchManager.js');
const { initializeGameState, processInput, startGameLoop, getGameState, deleteGameState } = require('../core/gameState.js');

const socketHandler = (io)=>{

    //pass io to matchmaking.js
    initMatchmaking(io);
    io.on('connection', (socket)=>{
        console.log("player connected");
        
        //start match process when player presses quick play or custom room
        socket.on("findMatch", (mode, roomId)=>{
            if(mode === "quickStart"){
                addToQueue(socket);
                socket.emit("queueJoined");
            }
            else if(mode === "custom"){
                // socket.join(roomId);
            }
        });
        
        //receive player selected character in character selecting phase
        socket.on("selectCharacter", (characterId)=>{
            const match = selectCharacter(socket, characterId);
            if (!match || match.phase !== "CHARACTER_SELECT"){ 
                return;
            }
            
            io.to(match.roomId).emit("characterPreview", {
                socketId: socket.id,
                characterId
            });            
        });

        //handle server-side lock in logic
        socket.on("lockCharacter", ()=>{
            const match = getMatchBySocket(socket);
            
            if(!match){ 
                return;
            }
            
            const player = match.players.find(p => p.socketId === socket.id);
            if(!player){
                return;
            }

            // lock the character and get fight data if all players are locked
            const fightData = lockCharacter(socket);

            io.to(match.roomId).emit("playerLocked", {
                socketId: socket.id,
                playerIndex: player.playerIndex,
                characterId: player.character
            });

            if(fightData){
                console.log("All players locked, starting match");
                
                //initialize server-authoritative game state
                try{
                    const gameState = initializeGameState(fightData.roomId, fightData.players, fightData.mapId);
                    
                    //emit startMatch with initial game state
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
                    
                    //start the server-side game loop
                    startGameLoop(fightData.roomId, io);
                } catch(error){
                    io.to(fightData.roomId).emit("matchError", {
                        message: "Failed to start match"
                    });
                }
            }
        });

        //handle player input during fight
        socket.on("playerInput", (inputs)=>{
            const match = getMatchBySocket(socket);
            
            if(!match || match.phase !== "FIGHT"){
                return;
            }

            if(!Array.isArray(inputs)){
                console.warn("Invalid input batch");
                return;
            }
            
            //process input through server-side game state
            inputs.forEach(input=>{
                const result = processInput(match.roomId, socket.id, input);
                if(!result){
                    console.warn("failed to process input for:", socket.id);
                }
            });           
        });

        //rematch logic
        socket.on('rematchRequest', () => {
            const { rematchHandler } = require('./rematchHandler.js');
            const { getMatchBySocket, createMatch, startCharacterSelectTimeout } = require('./matchManager.js');
                
            rematchHandler.handleRematchRequest(
                socket, 
                io, 
                getMatchBySocket, 
                createMatch, 
                startCharacterSelectTimeout
            );
        });

        //main menu button logic
        socket.on('returnToMenu', () => {
            const { getMatchBySocket, deleteMatch } = require('./matchManager.js');
            const match = getMatchBySocket(socket);
                
            if (match) {
                console.log(`[Server] ${socket.id} returning to menu from room ${match.roomId}`);
                socket.leave(match.roomId);
            }
        });

        //remove players on disconnect
        socket.on("disconnect", ()=>{
            console.log("Player disconnected");

            removeFromQueue(socket);
            
            const match = getMatchBySocket(socket);
            if(!match){ 
                return;
            }

            io.to(match.roomId).emit("playerDisconnected", socket.id);

            if(match.phase === "CHARACTER_SELECT"){
                deleteGameState(match.roomId);
                deleteMatch(match.roomId);
                io.to(match.roomId).emit("matchError", {
                    reason: "opponent_disconnected"
                });
            } 
            else if(match.phase === "FIGHT"){
                //end the game if a player disconnects during fight
                const gameState = getGameState(match.roomId);

                if(gameState){
                    const remainingPlayer = gameState.players.find(p => p.socketId !== socket.id);
                    if(remainingPlayer){
                        io.to(match.roomId).emit("matchEnd", {
                            winner: remainingPlayer.socketId,
                            reason: "opponent_disconnected"
                        });
                    }
                }
                deleteGameState(match.roomId);
                deleteMatch(match.roomId);
            }
        });
    });
};

module.exports = { socketHandler };