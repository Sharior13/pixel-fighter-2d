const { addToQueue, removeFromQueue } = require('../game/matchmaking.js');
const { getMatchBySocket, selectCharacter, lockCharacter, startCharacterSelectTimeout, deleteMatch } = require('../game/matchManager.js');

const socketHandler = (io)=>{
    io.on('connection', (socket)=>{
        console.log("player connected");
        
        //start match process when player presses quick play or custom room
        socket.on("findMatch", (mode, roomId)=>{
            if(mode === "quickStart"){
                const match = addToQueue(socket);
                socket.emit("queueJoined");
                if(!match){
                    return;
                }

                //emit status on match found
                io.to(match.roomId).emit("matchFound", {
                    roomId: match.roomId,
                    players: match.players.map(p => ({
                        socketId: p.socketId,
                        playerIndex: p.playerIndex
                    }))
                });

                //start match time out
                startCharacterSelectTimeout(match, (fightData)=>{
                    io.to(fightData.roomId).emit("fightStart", fightData);
                });
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

            const fightData = lockCharacter(socket);

            io.to(match.roomId).emit("playerLocked", {
                socketId: socket.id,
                playerIndex: player.playerIndex,
                characterId: player.character
            });

            if(fightData){
                io.to(fightData.roomId).emit("startMatch", fightData);
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
            if(match.phase === "CHARACTER_SELECT"){
                deleteMatch(match.roomId);
            }

            io.to(match.roomId).emit("playerDisconnected", socket.id);
        });
    });
};

module.exports = { socketHandler };