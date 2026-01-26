const QUEUE_SIZE = 2;
const queue = [];

const addToQueue = (socket)=>{
    if(queue.find((p)=> p.id === socket.id)){
        return;
    }

    queue.push(socket);
    console.log("Queued:", socket.id);

    tryMatch();
};

const removeFromQueue = (socket)=>{
    const index = queue.findIndex(p => p.id === socket.id);
    if (index !== -1){
        queue.splice(index, 1);
    }
}

const tryMatch = ()=>{
    if(queue.length < QUEUE_SIZE){
        return;
    }

    const players = queue.splice(0, QUEUE_SIZE);
    const roomId = `match_${Date.now()}`;

    players.forEach((player, index)=>{
        player.join(roomId);
        player.emit("matchFound", {
            roomId,
            playerIndex: index
        });
    });

    console.log(`Match created: ${roomId}`);
};

module.exports = { addToQueue, removeFromQueue };