const { addToQueue, removeFromQueue } = require('../game/matchmaking.js');

const socketHandler = (io)=>{
    io.on('connection', (socket)=>{
        console.log("player connected");

        socket.on("startMatch", (mode, id)=>{
            if(mode === "quickStart"){
                addToQueue(socket);
                socket.emit("queueJoined");
            }
        })

        socket.on("disconnect", ()=>{
            console.log("Player disconnected");
            removeFromQueue(socket);
        });
    });
};

module.exports =  { socketHandler };