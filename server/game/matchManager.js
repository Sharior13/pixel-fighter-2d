const matches = new Map();

//create a new match
const createMatch = (roomId, sockets)=>{
    const match = {
        roomId,
        phase: "CHARACTER_SELECT",
        players: sockets.map((socket, index) => ({
            socketId: socket.id,
            socket,
            playerIndex: index,
            character: null,
            locked: false
        }))
    };

    matches.set(roomId, match);
    return match;
};

//get existing match
const getMatch = (roomId)=>{
    return matches.get(roomId);
};

//get existing match by socket
const getMatchBySocket = (socket)=>{
    for (const match of matches.values()) {
        if (match.players.some(p => p.socketId === socket.id)) {
            return match;
        }
    }
    return null;
};

module.exports = { matches, createMatch, getMatch, getMatchBySocket };