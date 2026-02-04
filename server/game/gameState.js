const { getCharacterData } = require('./characterData.js');
const { getMapData } = require('./maps.js');
const { AttackHandler } = require('./attackHandler.js');

const gameStates = new Map();
const gameLoopIntervals = new Map();

const GAME_CONFIG = {
    tickRate: 60,
    tickInterval: 1000 / 60,
    charSelectTimeout: 1000000,
    matchDuration: 180000,
    gravity: 0.5,
    inputBufferSize: 10,
    dash:{
        speed: 5,
        duration: 200, 
        cooldown: 1000,
    },
    block: {
        damageReduction: 0.8,
        perfectWindow: 100,
        perfectReduction: 0.95
    }
};


//initialize game state when match starts
const initializeGameState = (roomId, playerData, mapId)=>{
    if(gameStates.has(roomId)){
        console.warn(`[GameState] Game state already exists for room ${roomId}`);
        return gameStates.get(roomId);
    }

    //load map
    const mapData = getMapData(mapId);
    console.log(`[GameState] Initializing game with map: ${mapData.name}`);

    const gameState = {
        roomId,
        phase: "FIGHT",
        startTime: Date.now(),
        lastUpdateTime: Date.now(),
        tickCount: 0,
        
        //map configs
        map: {
            id: mapData.id,
            name: mapData.name,
            width: mapData.width,
            height: mapData.height,
            groundY: mapData.groundY,
            backgroundColor: mapData.backgroundColor,
            platforms: mapData.platforms,
            boundaries: mapData.boundaries
        },

        players: playerData.map((p, index)=>{
            const charData = getCharacterData(p.character);
            
            if(!charData){
                console.error(`[GameState] Invalid character: ${p.character}`);
                throw new Error(`Invalid character: ${p.character}`);
            }

            const spawnPoint = mapData.spawnPoints[index] || { 
                x: index === 0 ? 400 : mapData.width - 400, 
                y: mapData.groundY 
            };

            return {
                socketId: p.socketId,
                playerIndex: p.playerIndex,
                character: p.character,

                size: {
                    width: 115,
                    height: 190
                },

                //position and movement
                position: {
                    x: spawnPoint.x,
                    y: spawnPoint.y
                },
                velocity: {
                    x: 0,
                    y: 0
                },
                facing: index === 0 ? 1 : -1,
                currentDirection: 0,
                
                //flags
                isGrounded: false,
                isJumping: false,
                isAttacking: false,
                isStunned: false,
                isDead: false,
                isDashing: false,     
                dashTimer: 0,        
                dashCooldownTimer: 0,
                attackTimer: 0, 
                isBlocking: false,      
                blockActivatedTime: 0,
                
                //stats from character data
                health: charData.stats.maxHealth,
                maxHealth: charData.stats.maxHealth,
                speed: charData.stats.speed,
                jumpForce: charData.stats.jumpForce,
                weight: charData.stats.weight,
                
                //abilities and cooldowns
                abilities: charData.abilities,
                cooldowns: {
                    dash: 0,
                    attack1: 0,
                    attack2: 0,
                    basic: 0,
                    special: 0,
                    ultimate: 0,
                },
                currentAttack: null,
                attackStartTime: null,
                attackFrame: 0,
                
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
    gameState.attackHandler = new AttackHandler();

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
        activate: input.activate !== undefined ? input.activate : null, 
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
const applyMovement = (player, direction, deltaTime, mapBoundaries)=>{
    if(player.isStunned || player.isAttacking){
        return;
    }
    
    //update facing direction
    if(direction !== 0){
        player.facing = direction;
    }

    player.currentDirection = direction;
    
    let speed = player.speed;
    
    if(player.isDashing){
        speed = player.speed * GAME_CONFIG.dash.speed;
    } 
    else if(player.isBlocking){
        speed = 0;
    }
    
    //apply horizontal velocity
    player.velocity.x = direction * speed;
    
    //update position
    player.position.x += player.velocity.x;
    
    //ensure player stays within map boundary
    const leftBound = mapBoundaries.left + player.size.width / 2;
    const rightBound = mapBoundaries.right - player.size.width / 2;
    player.position.x = Math.max(leftBound, Math.min(rightBound, player.position.x));
};


const applyJump = (player)=>{
    if(player.isGrounded && !player.isStunned && !player.isAttacking){
        player.velocity.y = -player.jumpForce;
        player.isGrounded = false;
        player.isJumping = true;
    }
};


const applyGravity = (player, deltaTime, groundY)=>{
    if(!player.isGrounded){
        player.velocity.y += GAME_CONFIG.gravity;
        player.position.y += player.velocity.y;
        
        //check if landd
        if(player.position.y >= groundY){
            player.position.y = groundY;
            player.velocity.y = 0;
            player.isGrounded = true;
            player.isJumping = false;
        }
    }
};

const applyDash = (player) => {
    // Can't dash if already dashing, attacking, stunned, or on cooldown
    if(player.isDashing || player.isAttacking || player.isStunned || 
       player.dashCooldownTimer > 0 || player.isBlocking || player.velocity.x == 0){
        return { success: false, reason: 'cannot_dash' };
    }
    
    // Activate dash
    player.isDashing = true;
    player.dashTimer = GAME_CONFIG.dash.duration;
    player.dashCooldownTimer = GAME_CONFIG.dash.cooldown;
    
    console.log(`[GameState] Player ${player.socketId} dashed!`);

    return { success: true };
};

const applyBlock = (player, activate) => {
    if(activate){
        if(!player.isBlocking && !player.isAttacking && !player.isStunned){
            player.isBlocking = true;
            player.blockActivatedTime = Date.now();
            console.log(`[GameState] Player ${player.socketId} started blocking`);
        }
    } 
    else {
        if(player.isBlocking){
            player.isBlocking = false;
            console.log(`[GameState] Player ${player.socketId} stopped blocking`);
        }
    }
};


const executeAbility = (gameState, player, abilityName)=>{
    const ability = player.abilities[abilityName];
    
    if(!ability){
        return { success: false, reason: 'invalid_ability' };
    }
    
    //cooldown check
    if(player.cooldowns[abilityName] > 0){
        return { success: false, reason: 'on_cooldown' };
    }
    
    //check if player can attack
    if(player.isStunned || player.isAttacking){
        return { success: false, reason: 'cannot_attack' };
    }
    
    //set cooldown
    player.cooldowns[abilityName] = ability.cooldown;
    player.isAttacking = true;
    player.attackTimer = ability.duration || 300;
    
    //apply ability effects
    const hits = gameState.players
    .filter(target => target.socketId !== player.socketId && !target.isDead)
    .map(target=>{
        //hitbox checking
        const distance = Math.abs(player.position.x - target.position.x);
        const isInRange = distance <= ability.range;
        
        //direction check
        const isFacingTarget = (player.facing === 1 && target.position.x > player.position.x) ||
                              (player.facing === -1 && target.position.x < player.position.x);
        
        if(!isInRange || !isFacingTarget){
            return null;
        }
        
        let damage = ability.damage;
        
        //block logic
        if(target.isBlocking){
            const blockTime = Date.now() - target.blockActivatedTime;
            const isPerfectBlock = blockTime <= GAME_CONFIG.block.perfectWindow;
            
            if(isPerfectBlock){
                damage *= (1 - GAME_CONFIG.block.perfectReduction);
                console.log(`[GameState] Perfect block! Damage reduced to ${damage}`);
            } else {
                damage *= (1 - GAME_CONFIG.block.damageReduction);
            }
        }
        
        target.health -= damage;
        target.damageReceived += damage;
        
        //knockback
        if(ability.knockback){
            target.velocity.x = player.facing * ability.knockback.x;
            target.velocity.y = -ability.knockback.y;
            target.isGrounded = false;
        }
        
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
    gameState.attackHandler.updateAttacks(gameState, deltaTime);
    gameState.lastUpdateTime = currentTime;
    gameState.tickCount++;
    
    //check if match time expired
    const elapsedTime = currentTime - gameState.startTime;
    if(elapsedTime >= GAME_CONFIG.matchDuration){
        endMatch(roomId, io);
        return;
    }
    const checkMatchEnd = (gameState) => {
        // Check if time is up
        if (gameState.timeRemaining <= 0) {
            const p1 = gameState.players[0];
            const p2 = gameState.players[1];

            let winner;
            if (p1.health > p2.health) {
                winner = p1.socketId;
                p1.state = 'victory';
                p2.state = 'defeated';
            } else if (p2.health > p1.health) {
                winner = p2.socketId;
                p2.state = 'victory';
                p1.state = 'defeated';
            } else {
                // Draw - both defeated
                winner = null;
                p1.state = 'defeated';
                p2.state = 'defeated';
            }

            return { gameEnded: true, winner, reason: 'timeout' };
        }

        // Check for K.O.
        const alivePlayers = gameState.players.filter(p => !p.isDead);

        if (alivePlayers.length === 1) {
            // One player left - they win
            const winner = alivePlayers[0];
            const loser = gameState.players.find(p => p.socketId !== winner.socketId);

            winner.state = 'victory';
            loser.state = 'defeated';
            loser.isDead = true;

            return { gameEnded: true, winner: winner.socketId, reason: 'ko' };
        }

        if (alivePlayers.length === 0) {
            // Both dead - draw
            gameState.players.forEach(p => p.state = 'defeated');
            return { gameEnded: true, winner: null, reason: 'double_ko' };
        }

        return { gameEnded: false };
    };
    //update all players
    gameState.players.forEach(player=>{
        if(player.isDead){
            return;
        }

        Object.keys(player.cooldowns).forEach(ability => {
            if (player.cooldowns[ability] > 0) {
                player.cooldowns[ability] -= deltaTime;
                if (player.cooldowns[ability] < 0) {
                    player.cooldowns[ability] = 0;
                }
            }
        });
        if (player.isStunned && Date.now() >= player.stunEndTime) {
        player.isStunned = false;
        }
        //update cooldowns
        updateCooldowns(player, deltaTime);

        if(player.dashTimer > 0){
            player.dashTimer -= deltaTime;
            if(player.dashTimer <= 0){
                player.dashTimer = 0;
                player.isDashing = false;
            }
        }

        //update dash cooldown
        if(player.dashCooldownTimer > 0){
            player.dashCooldownTimer -= deltaTime;
            if(player.dashCooldownTimer <= 0){
                player.dashCooldownTimer = 0;
            }
        }

        //update attack timer 
        if(player.attackTimer > 0){
            player.attackTimer -= deltaTime;
            if(player.attackTimer <= 0){
                player.attackTimer = 0;
                player.isAttacking = false;
            }
        }
        
        //process all buffered inputs
        let latestMovement = null;
        const otherInputs = [];

        //empty the entire buffer
        while(player.inputBuffer.length > 0){
            const input = player.inputBuffer.shift();

            if(input.type === 'move'){
                latestMovement = input;
            }
            else {
                otherInputs.push(input);
            }
        }

        //apply latest movement
        if(latestMovement){
            applyMovement(player, latestMovement.direction, deltaTime, gameState.map.boundaries);
            player.currentDirection = latestMovement.direction;
        }

        //process all other inputs
        otherInputs.forEach(input => {
            switch (input.type) {
                case 'jump':
                    applyJump(player);
                    break;
                case 'attack':
                    const result = gameState.attackHandler.initiateAttack(
                        gameState,
                        player,
                        input.ability
                    );
                    
                    if (result.success) {
                        console.log(`[GameState] ${player.socketId} started ${input.ability}`);
                    } else {
                        console.log(`[GameState] Attack ${input.ability} failed: ${result.reason}`);
                    }
                    break;
                case 'block':
                    applyBlock(player, input.activate);
                    break;
                case 'dash':
                    applyDash(player);
                    break;
            }
        });
        
        applyGravity(player, deltaTime, gameState.map.groundY);
        
        //reset combo on no recent input
        if(currentTime - player.lastInputTime > 2000){
            player.combo = 0;
        }
    });
    const matchEndCheck = checkMatchEnd(gameState);

    if (matchEndCheck.gameEnded) {
        // Play victory/defeat animations for 3 seconds before ending
        const animationDuration = 3000;
        
        setTimeout(() => {
            // Stop game loop
            if (gameLoopIntervals.has(roomId)) {
                clearInterval(gameLoopIntervals.get(roomId));
                gameLoopIntervals.delete(roomId);
            }
            
            // Send final game state with animations
            io.to(roomId).emit('gameStateUpdate', {
                players: gameState.players.map(p => ({
                    socketId: p.socketId,
                    playerIndex: p.playerIndex,
                    character: p.character,
                    position: p.position,
                    velocity: p.velocity,
                    facing: p.facing,
                    health: p.health,
                    maxHealth: p.maxHealth,
                    isGrounded: p.isGrounded,
                    isAttacking: p.isAttacking,
                    currentAttack: p.currentAttack,
                    attackFrame: p.attackFrame,
                    isBlocking: p.isBlocking,
                    isDashing: p.isDashing,
                    isStunned: p.isStunned,
                    isDead: p.isDead,
                    state: p.state, // 'victory' or 'defeated'
                    cooldowns: p.cooldowns,
                    combo: p.combo
                })),
                timeRemaining: gameState.timeRemaining
            });
            
            // Send match end event
            io.to(roomId).emit('matchEnd', {
                winner: matchEndCheck.winner,
                finalStats: gameState.players.map(p => ({
                    socketId: p.socketId,
                    character: p.character,
                    health: p.health,
                    damage: p.damage,
                    damageReceived: p.damageReceived,
                    combo: p.combo,
                    killCount: p.killCount
                })),
                reason: matchEndCheck.reason
            });
            
            console.log(`[GameState] Match ended in room ${roomId}. Winner: ${matchEndCheck.winner || 'Draw'}`);
            
            // Don't delete game state immediately - keep for rematch
            // gameStates.delete(roomId);
            
        }, animationDuration);
        
        return; // Stop further game loop iterations
    }
    
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
        map: gameState.map,
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
            isAttacking: p.isAttacking || false,
            currentAttack: p.currentAttack || null,
            attackFrame: p.attackFrame || 0,
            isBlocking: p.isBlocking,
            isDashing: p.isDashing, 
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