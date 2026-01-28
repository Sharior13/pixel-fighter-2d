const matches = new Map();
const lockTimeouts = new Map();

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
    for(const match of matches.values()){
        if(match.players.some(p => p.socketId === socket.id)){
            return match;
        }
    }
    return null;
};

//charcter selection logic
const selectCharacter = (socket, characterId)=>{
    const match = getMatchBySocket(socket);

    if(!match || match.phase !== "CHARACTER_SELECT"){
        return;
    }

    const player = match.players.find(p => p.socketId === socket.id);
    if(!player || player.locked){
        return;
    }

    player.character = characterId;
    
    return match;
};

//character locking logic
const lockCharacter = (socket)=>{
    const match = getMatchBySocket(socket);

    if(!match || match.phase !== "CHARACTER_SELECT"){
        return;
    }

    const player = match.players.find(p => p.socketId === socket.id);
    if(!player || !player.character){
        return null;
    }

    player.locked = true;

    if(match.players.every(p => p.locked)){
        clearCharacterSelectTimeout(match.roomId);
        return startFight(match);
    }
    return null;
};

//character selection time limit logic
const startCharacterSelectTimeout = (match, startOnTimeout, duration = 15000)=>{
    if(lockTimeouts.has(match.roomId)){
        return;
    }

    const timeoutId = setTimeout(()=>{
        const currentMatch = matches.get(match.roomId);

        if(match.phase !== "CHARACTER_SELECT"){ 
            return;
        }

        currentMatch.players.forEach((p)=>{
            if(!p.character){
                p.character = getRandomCharacter();
            }
            p.locked = true;
        });

        const fightData = startFight(currentMatch);
        lockTimeouts.delete(match.roomId);

        if(typeof startOnTimeout === "function"){
            startOnTimeout(fightData);
        }

    }, duration);

    lockTimeouts.set(match.roomId, timeoutId);
};

//start fight logic
const startFight = (match)=>{
    match.phase = "FIGHT";

    return {
        roomId: match.roomId,
        players: match.players.map(p => ({
            socketId: p.socketId,
            playerIndex: p.playerIndex,
            character: p.character
        }))
    };
};

//give random character on player failing to lock in
const getRandomCharacter = () => {
    const characters = ["luffy", "naruto", "zoro", "kakashi"];
    return characters[Math.floor(Math.random() * characters.length)];
};

//clear timeout on lock in
const clearCharacterSelectTimeout = (roomId) => {
    if(lockTimeouts.has(roomId)){
        clearTimeout(lockTimeouts.get(roomId));
        lockTimeouts.delete(roomId);
    }
};

//cleanup match data
const deleteMatch = (roomId) => {
    clearCharacterSelectTimeout(roomId);
    matches.delete(roomId);
};

module.exports = { matches, createMatch, getMatch, getMatchBySocket, selectCharacter, lockCharacter, startCharacterSelectTimeout, clearCharacterSelectTimeout, deleteMatch };