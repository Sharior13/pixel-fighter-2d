let socket = null;

const initializeSocket = (mode, roomId)=>{
    if(socket){
        return;
    }

    socket = io();

    //start match process
    socket.emit("startMatch", mode, roomId);

    socket.on("queueJoined", ()=>{
        //add loading image for queue 
    });

    socket.on("matchFound", ({ roomId, playerIndex }) => {
        console.log("Match found!", roomId);

        // joinGameRoom(roomId, playerIndex);
    });
};

export { initializeSocket };