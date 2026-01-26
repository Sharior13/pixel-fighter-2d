const { addToQueue, removeFromQueue } = require('../game/matchmaking.js');
const { getMatchBySocket } = require('../game/matchManager.js');

const socketHandler = (io)=>{
    io.on('connection', (socket)=>{
        console.log("player connected");

        //start match process when player presses quick play or custom room
        socket.on("startMatch", (mode, roomId)=>{
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
            const match = getMatchBySocket(socket);
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

        //remove players on disconnect
        socket.on("disconnect", ()=>{
            console.log("Player disconnected");
            removeFromQueue(socket);
        });
    });
};

module.exports = { socketHandler };