const { addToQueue, removeFromQueue } = require('../game/matchmaking.js');
const { getMatchBySocket, selectCharacter, lockCharacter } = require('../game/matchManager.js');

const socketHandler = (io)=>{
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

            const player = match.players.find(p => p.socketId === socket.id);
            player.character = characterId;

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

            const allLocked = lockCharacter(socket);
            
            const player = match.players.find(p => p.socketId === socket.id);

            io.to(match.roomId).emit("playerLocked", {
                socketId: socket.id,
                playerIndex: player.playerIndex,
                characterId: player.character
            });

            if(allLocked){
                io.to(match.roomId).emit("startMatch", {
                    players: match.players.map((p)=>({
                        socketId: p.socketId,
                        playerIndex: p.playerIndex,
                        character: p.character
                    }))
                });
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
        });
    });
};

module.exports = { socketHandler };