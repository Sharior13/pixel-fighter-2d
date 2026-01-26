let socket = null;

const initializeSocket = (mode, id)=>{
    if(socket){
        return;
    }

    socket = io();

    socket.emit("startMatch", mode, id);

    socket.on("queueJoined", ()=>{});

    socket.on("matchFound", ({ roomId, playerIndex }) => {
        console.log("Match found!", roomId);

        joinGameRoom(roomId, playerIndex);
    });
};

export { initializeSocket };