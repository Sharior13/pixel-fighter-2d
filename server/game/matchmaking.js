const { matches, createMatch, startCharacterSelectTimeout } = require("./matchManager.js");

const ROOM_ID_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const QUEUE_SIZE = 2;
const queue = [];

//add players to matchmaking queue
const addToQueue = (socket)=>{
    if(queue.find((p)=> p.id === socket.id)){
        return null;
    }

    queue.push(socket);
    console.log("Queued:", socket.id);

    return tryMatch();
};

//remove players from matchmaking queue
const removeFromQueue = (socket)=>{
    const index = queue.findIndex(p => p.id === socket.id);
    if (index !== -1){
        queue.splice(index, 1);
        console.log("Removed from queue:", socket.id);
    }
};

//start match phase on full queue
const tryMatch = ()=>{
    if(queue.length < QUEUE_SIZE){
        return null;
    }

    //add players in queue to plsyers variable and reset queue
    const players = queue.splice(0, QUEUE_SIZE);

    const roomId = generateRoomCode();
    const match = createMatch(roomId, players);

    //make each player join the match room
    players.forEach((player)=>{
        player.join(roomId);
    });

    console.log(`Match created: ${roomId}`);

    return match;
};

//generate random room id that doesnt already exist
const generateRoomCode = (length = 5)=>{
    let code = "";
    do{
        code = "";
        for (let i = 0; i < length; i++) {
            code += ROOM_ID_CHARS[Math.floor(Math.random() * ROOM_ID_CHARS.length)];
        }
    } while(matches.has(code));
    return code;
};

module.exports = { addToQueue, removeFromQueue };