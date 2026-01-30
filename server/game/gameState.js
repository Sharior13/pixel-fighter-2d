const { getCharacterData } = require('./characterData.js');

const gameStates = new Map();
const gameLoopIntervals = new Map();

const GAME_CONFIG = {
    tickRate: 60,
    tickInterval: 1000 / 60,
    charSelectTimeout: 100,
    matchDuration: 180000,
    gravity: 0.5,
    groundY: 400,
    stageWidth: 2000,
    inputBufferSize: 10
};


//initialize game state when match starts
const initializeGameState = (roomId, playerData)=>{
    if(gameStates.has(roomId)){
        console.warn(`[GameState] Game state already exists for room ${roomId}`);
        return gameStates.get(roomId);
    }

    const gameState = {
        roomId,
        phase: "FIGHT",
        startTime: Date.now(),
        lastUpdateTime: Date.now(),
        tickCount: 0,
        
        players: playerData.map((p, index)=>{
            const charData = getCharacterData(p.character);
            
            if(!charData){
                console.error(`[GameState] Invalid character: ${p.character}`);
                throw new Error(`Invalid character: ${p.character}`);
            }

            return {
                socketId: p.socketId,
                playerIndex: p.playerIndex,
                character: p.character,

                size: {
                    width: 75,
                    height: 150
                },

                //position and movement
                position: {
                    x: index === 0 ? 200 : 600,
                    y: GAME_CONFIG.groundY
                },
                velocity: {
                    x: 0,
                    y: 0
                },
                facing: index === 0 ? 1 : -1,
                currentDirection: 0,
                
                //flags
                isGrounded: true,
                isJumping: false,
                isAttacking: false,
                isBlocking: false,
                isStunned: false,
                isDead: false,
                
                //stats from character data
                health: charData.stats.maxHealth,
                maxHealth: charData.stats.maxHealth,
                speed: charData.stats.speed,
                jumpForce: charData.stats.jumpForce,
                weight: charData.stats.weight,
                
                //abilities and cooldowns
                abilities: charData.abilities,
                cooldowns: {
                    basic: 0,
                    special: 0,
                    ultimate: 0
                },
                
                //combat stats
                combo: 0,
                damage: 0,
                damageReceived: 0,
                killCount: 0,
                
                //input buffer
                inputBuffer: [],
                lastInputTime: 0
            };
        }),
        
        //match stats
        winner: null,
        matchEndTime: null,
        
        //projectiles, effects,
        projectiles: [],
        effects: []
    };

    gameStates.set(roomId, gameState);
    console.log(`[GameState] Initialized game state for room ${roomId}`);
    
    return gameState;
};


const getGameState = (roomId)=>{
    return gameStates.get(roomId);
};


//update cooldown
const updateCooldowns = (player, deltaTime)=>{
    if(player.cooldowns.basic > 0){
        player.cooldowns.basic = Math.max(0, player.cooldowns.basic - deltaTime);
    }
    if(player.cooldowns.special > 0){
        player.cooldowns.special = Math.max(0, player.cooldowns.special - deltaTime);
    }
    if(player.cooldowns.ultimate > 0){
        player.cooldowns.ultimate = Math.max(0, player.cooldowns.ultimate - deltaTime);
    }
};


//process player input
const processInput = (roomId, socketId, input)=>{
    const gameState = gameStates.get(roomId);
    
    if(!gameState || gameState.phase !== "FIGHT"){
        return null;
    }
    
    const player = gameState.players.find(p => p.socketId === socketId);
    
    if(!player || player.isDead){
        return null;
    }
    
    //validate input
    const validatedInput = {
        type: input.type,
        direction: input.direction || 0,
        ability: input.ability || null,
        timestamp: Date.now()
    };
    
    //add to input buffer
    player.inputBuffer.push(validatedInput);
    
    //keep buffer size limited
    if(player.inputBuffer.length > GAME_CONFIG.inputBufferSize){
        player.inputBuffer.shift();
    }
    
    player.lastInputTime = validatedInput.timestamp;
    
    return validatedInput;
};

//apply to player movement
const applyMovement = (player, direction, deltaTime)=>{
    if(player.isStunned || player.isAttacking){
        return;
    }
    
    //update facing direction
    if(direction !== 0){
        player.facing = direction;
    }

    player.currentDirection = direction;
    
    //apply horizontal velocity
    player.velocity.x = direction * player.speed;
    
    //update position
    player.position.x += player.velocity.x;
    
    //ensure player stays within map boundary
    player.position.x = Math.max(player.size.width, Math.min(GAME_CONFIG.stageWidth - player.size.width, player.position.x));
};


const applyJump = (player)=>{
    if(player.isGrounded && !player.isStunned && !player.isAttacking){
        player.velocity.y = -player.jumpForce;
        player.isGrounded = false;
        player.isJumping = true;
    }
};


const applyGravity = (player, deltaTime)=>{
    if(!player.isGrounded){
        player.velocity.y += GAME_CONFIG.gravity;
        player.position.y += player.velocity.y;
        
        //check if landd
        if(player.position.y >= GAME_CONFIG.groundY){
            player.position.y = GAME_CONFIG.groundY;
            player.velocity.y = 0;
            player.isGrounded = true;
            player.isJumping = false;
        }
    }
};


//process ability
const executeAbility = (gameState, player, abilityType)=>{
    //check if ability is on cooldown
    if(player.cooldowns[abilityType] > 0){
        return { success: false, reason: 'cooldown' };
    }
    
    //check if player can use ability
    if(player.isStunned || player.isDead){
        return { success: false, reason: 'disabled' };
    }
    
    const ability = player.abilities[abilityType];
    
    if(!ability){
        return { success: false, reason: 'invalid' };
    }
    
    player.isAttacking = true;

    player.cooldowns[abilityType] = ability.cooldown;
    
    //find other players in range
    const targets = gameState.players.filter((p) => p.socketId !== player.socketId && !p.isDead && Math.abs(p.position.x - player.position.x) <= ability.range && Math.abs(p.position.y - player.position.y) <= ability.range);
    
    //apply damage and knockback to players
    const hits = targets.map(target=>{
        target.health -= ability.damage;
        target.damageReceived += ability.damage;
        
        const knockbackDir = target.position.x > player.position.x ? 1 : -1;
        target.velocity.x = knockbackDir * ability.knockback;
        
        //check if player died
        if(target.health <= 0){
            target.health = 0;
            target.isDead = true;
            player.killCount++;
        }
        
        player.damage += ability.damage;
        player.combo++;
        
        return {
            targetSocketId: target.socketId,
            damage: ability.damage,
            knockback: ability.knockback,
            healthRemaining: target.health
        };
    });
    
    //reset state after ability
    setTimeout(()=>{
        player.isAttacking = false;
    }, ability.duration || 300);
    
    return {
        success: true,
        abilityId: ability.id,
        hits
    };
};

//main game loop update
const gameTick = (roomId, io)=>{
    const gameState = gameStates.get(roomId);
    
    if(!gameState || gameState.phase !== "FIGHT"){
        stopGameLoop(roomId);
        return;
    }
    
    const currentTime = Date.now();
    const deltaTime = currentTime - gameState.lastUpdateTime;
    gameState.lastUpdateTime = currentTime;
    gameState.tickCount++;
    
    //check if match time expired
    const elapsedTime = currentTime - gameState.startTime;
    if(elapsedTime >= GAME_CONFIG.matchDuration){
        endMatch(roomId, io);
        return;
    }
    
    //update all players
    gameState.players.forEach(player=>{
        if(player.isDead){
            return;
        }
        
        //update cooldowns
        updateCooldowns(player, deltaTime);
        
        //process all buffered inputs
        let latestMovement = null;
        const otherInputs = [];

        //empty the entire buffer
        while(player.inputBuffer.length > 0){
            const input = player.inputBuffer.shift();

            if(input.type === 'move'){
                latestMovement = input;
            } else {
                otherInputs.push(input);
            }
        }

        //apply latest movement
        if(latestMovement){
            applyMovement(player, latestMovement.direction, deltaTime);
            player.currentDirection = latestMovement.direction;
        }

        //process all other inputs
        otherInputs.forEach(input => {
            switch (input.type) {
                case 'jump':
                    applyJump(player);
                    break;
                case 'attack':
                    if(input.ability){
                        const result = executeAbility(gameState, player, input.ability);
                        if(result.success){
                            io.to(roomId).emit('abilityExecuted', {
                                socketId: player.socketId,
                                ability: input.ability,
                                result
                            });
                        }
                    }
                    break;
                case 'block':
                    player.isBlocking = true;
                    setTimeout(()=>{
                        player.isBlocking = false;
                    }, 500);
                    break;
            }
        });

        //if no movement input continue with last direction
        if(!latestMovement && player.currentDirection !== 0){
            applyMovement(player, player.currentDirection, deltaTime);
        }
        
        applyGravity(player, deltaTime);
        
        //reset combo on no recent input
        if(currentTime - player.lastInputTime > 2000){
            player.combo = 0;
        }
    });
    
    //win conditions
    const alivePlayers = gameState.players.filter(p => !p.isDead);
    if(alivePlayers.length === 1){
        endMatch(roomId, io, alivePlayers[0]);
        return;
    }
    
    //emit state update
    if(gameState.tickCount % 1 === 0) {
        io.to(roomId).emit('gameStateUpdate', getClientGameState(gameState));
    }
};

//main server side game loop
const startGameLoop = (roomId, io)=>{
    if(gameLoopIntervals.has(roomId)){
        console.warn(`[GameState] Game loop already running for room ${roomId}`);
        return;
    }
    
    console.log(`[GameState] Starting game loop for room ${roomId}`);
    
    const intervalId = setInterval(()=>{
        gameTick(roomId, io);
    }, GAME_CONFIG.tickInterval);
    
    gameLoopIntervals.set(roomId, intervalId);
};


const stopGameLoop = (roomId)=>{
    if(gameLoopIntervals.has(roomId)){
        clearInterval(gameLoopIntervals.get(roomId));
        gameLoopIntervals.delete(roomId);
        console.log(`[GameState] Stopped game loop for room ${roomId}`);
    }
};

//handle end of match
const endMatch = (roomId, io, winner = null)=>{
    const gameState = gameStates.get(roomId);
    
    if(!gameState){
        return;
    }
    
    gameState.phase = "ENDED";
    gameState.matchEndTime = Date.now();
    
    if(!winner){
        winner = gameState.players.reduce((prev, current) => 
            current.health > prev.health ? current : prev
        );
    }
    
    gameState.winner = winner.socketId;
    
    stopGameLoop(roomId);
    
    //emit match end event
    io.to(roomId).emit('matchEnd', {
        winner: winner.socketId,
        finalStats: gameState.players.map(p => ({
            socketId: p.socketId,
            character: p.character,
            health: p.health,
            damage: p.damage,
            damageReceived: p.damageReceived,
            killCount: p.killCount
        }))
    });
    
    console.log(`[GameState] Match ended in room ${roomId}, winner: ${winner.socketId}`);
    
    setTimeout(()=>{
        deleteGameState(roomId);
    }, 5000);
};

//client game state
const getClientGameState = (gameState)=>{
    return {
        roomId: gameState.roomId,
        phase: gameState.phase,
        tickCount: gameState.tickCount,
        timeRemaining: GAME_CONFIG.matchDuration - (Date.now() - gameState.startTime),
        players: gameState.players.map(p => ({
            socketId: p.socketId,
            playerIndex: p.playerIndex,
            character: p.character,
            size: p.size,
            position: p.position,
            velocity: p.velocity,
            facing: p.facing,
            health: p.health,
            maxHealth: p.maxHealth,
            isGrounded: p.isGrounded,
            isAttacking: p.isAttacking,
            isBlocking: p.isBlocking,
            isStunned: p.isStunned,
            isDead: p.isDead,
            cooldowns: p.cooldowns,
            combo: p.combo
        })),
        projectiles: gameState.projectiles,
        effects: gameState.effects
    };
};


const deleteGameState = (roomId)=>{
    stopGameLoop(roomId);
    gameStates.delete(roomId);
    console.log(`[GameState] Deleted game state for room ${roomId}`);
};

module.exports = { GAME_CONFIG, initializeGameState, getGameState, processInput, startGameLoop, stopGameLoop, endMatch, deleteGameState, getClientGameState };