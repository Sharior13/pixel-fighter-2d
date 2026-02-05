import { socket } from "./socket.js";
import { spriteManager } from "./spriteAnimator.js";
import { characterSpriteConfigs } from "../data/characterSprites.js";
import { animationStateManager } from "./animationStateManager.js";
import { battleUI } from "../ui/battleUI.js";
import { getPlayerUsername } from "../ui/titleScreen.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//resize canvas on window resize
window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let isRendering = false;
let currentGameState = null;
let animationFrameId = null;
let currentMap = null;
let bgImg = null;
let lastFrameTime = performance.now();

const camera = {
    x: 0,
    y: 0
};

const setMap = (mapData)=>{
    currentMap = mapData;
    if(currentMap){
        if(bgImg){
            bgImg.remove();
            bgImg = null;
        }

        //create a visible <img> that sits behind the canvas
        bgImg = document.createElement('img');
        bgImg.id = 'bgImage';
        bgImg.style.position = 'absolute';
        bgImg.style.top = '0px';
        bgImg.style.left = '0px';
        bgImg.style.width = currentMap.width + 'px';
        bgImg.style.height = currentMap.height + 'px';
        bgImg.style.zIndex = '-2';
        bgImg.style.pointerEvents = 'none';
        bgImg.style.imageRendering = 'pixelated';

        bgImg.onload = ()=>{
            console.log(`[Render] Background image loaded for: ${currentMap.name}`);
        };
        bgImg.onerror = ()=>{
            console.warn(`[Render] Background image not found for: ${currentMap.id}, using solid color`);
            bgImg = null;
        };
        //insert before the canvas so it renders behind it
        canvas.parentElement.insertBefore(bgImg, canvas);
        bgImg.src = `../assets/background/${currentMap.id}.gif`;
    }
};

const updateGameState = (state)=>{
    const isFirstState = !currentGameState;
    currentGameState = state;
    
    // Initialize sprite animators for new players
    if (isFirstState && state.players) {
        state.players.forEach(player => {
            initializePlayerSprites(player);
        });
    }
    
    // Update battle UI with current state
    battleUI.update(state);
};

const initializePlayerSprites = (player) => {
    const characterId = player.character.toLowerCase();
    const config = characterSpriteConfigs[characterId];
    
    if (!config) {
        console.warn(`[Render] No sprite config found for character: ${characterId}`);
        return;
    }
    
    if (!spriteManager.sprites.has(characterId)) {
        spriteManager.loadCharacter(characterId, config);
    }
    
    const animator = spriteManager.getAnimator(characterId);
    if (animator) {
        animationStateManager.registerPlayer(player.socketId, animator);
        console.log(`[Render] Initialized sprites for player: ${player.socketId} (${characterId})`);
    }
};

const stopRender = ()=>{
    if(animationFrameId){
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    isRendering = false;
    currentGameState = null;
    currentMap = null;

    if(bgImg){
        bgImg.remove();
        bgImg = null;
    }
    
    // Clear animation state manager
    animationStateManager.clear();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Render stopped");
};

const initializeRender = ()=>{
    if(isRendering){
        return;
    }
    isRendering = true;
    lastFrameTime = performance.now();
    console.log("render: ",isRendering);
    
    const drawBackground = ()=>{
        if(currentMap && bgImg){
            //move the <img> element opposite to camera so it scrolls with the world
            bgImg.style.left = (-camera.x) + 'px';
            bgImg.style.top = (-camera.y) + 'px';
        } else if(currentMap){
            //fill with solid color if no image
            ctx.fillStyle = currentMap.backgroundColor || "#1a1a2e";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };
    
    const drawGround = ()=>{
        if(!currentMap){
            return;
        }
        
        //draw ground line
        ctx.strokeStyle = "#4a4a4a";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(currentMap.boundaries.left, currentMap.groundY);
        ctx.lineTo(currentMap.boundaries.right, currentMap.groundY);
        ctx.stroke();
        
        //draw ground fill
        ctx.fillStyle = "rgba(74, 74, 74, 0.3)";
        ctx.fillRect(currentMap.boundaries.left, currentMap.groundY, currentMap.width, currentMap.height - currentMap.groundY);
    };
    
    const drawMapBoundaries = ()=>{
        if(!currentMap){
            return;
        }
        
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        //left boundary
        const leftX = currentMap.boundaries.left - camera.x;
        ctx.beginPath();
        ctx.moveTo(leftX, 0);
        ctx.lineTo(leftX, canvas.height);
        ctx.stroke();
        
        //right boundary
        const rightX = currentMap.boundaries.right - camera.x;
        ctx.beginPath();
        ctx.moveTo(rightX, 0);
        ctx.lineTo(rightX, canvas.height);
        ctx.stroke();
        
        ctx.setLineDash([]);
    };

    //update current player's viewport
    const updateCamera = ()=>{
        
        const localPlayer = currentGameState.players.find(p => p.socketId === socket.id);
        const opponent = currentGameState.players.find(p => p.socketId !== socket.id);

        if(!localPlayer || !opponent){
            return;
        }

        //check if opponent is within viewport
        const opponentVisible = (
            opponent.position.x >= camera.x && 
            opponent.position.x <= camera.x + canvas.width && 
            opponent.position.y >= camera.y && 
            opponent.position.y <= camera.y + canvas.height
        );

        let targetX, targetY;
        if(opponentVisible){
            //center on midpoint if both visible
            targetX = (localPlayer.position.x + opponent.position.x) / 2 - canvas.width / 2;
            targetY = (localPlayer.position.y + opponent.position.y) / 2 - canvas.height / 2;
        } else {
            //follow local player if no opponent
            targetX = localPlayer.position.x - canvas.width / 2;
            targetY = localPlayer.position.y - canvas.height / 2;
        }

        //smooth follow
        camera.x += (targetX - camera.x) * 0.1;
        camera.y += (targetY - camera.y) * 0.1;

        //clamp to map boundary
        camera.x = Math.max(0, Math.min(camera.x, currentMap.width - canvas.width));
        camera.y = Math.max(0, Math.min(camera.y, currentMap.height - canvas.height));

        //reduce camera blur
        camera.x = Math.round(camera.x);
        camera.y = Math.round(camera.y);
    };
    
    const drawGridLines = ()=>{
        ctx.beginPath();
        ctx.strokeStyle = "red";
        
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.stroke();
        
        ctx.moveTo(0, canvas.height/2);
        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.stroke();
        
        ctx.closePath();
    };
    
    const drawPlayer = (player, deltaTime)=>{
        // Update and draw sprite animation
        const animator = animationStateManager.getPlayerAnimator(player.socketId);
        
        if (animator) {
            // Update animation state based on player state
            animationStateManager.updatePlayerAnimation(player, deltaTime);
            
            // Get character config for scale
            const characterId = player.character.toLowerCase();
            const config = characterSpriteConfigs[characterId];
            const scale = config?.scale || 2.5;
            
            //hitbox

            // ctx.fillStyle = player.socketId === socket.id ? "blue" : "red";
            // ctx.fillRect(
            //     player.position.x - player.size.width/2, 
            //     player.position.y - player.size.height, 
            //     player.size.width, 
            //     player.size.height
            // );

            // Draw the animated sprite
            animator.draw(
                ctx,
                player.position.x,
                player.position.y,
                player.facing,
                scale
            );
        } else {
            // Fallback: draw colored rectangle if sprite not available
            ctx.fillStyle = player.socketId === socket.id ? "blue" : "red";
            ctx.fillRect(
                player.position.x - player.size.width/2, 
                player.position.y - player.size.height, 
                player.size.width, 
                player.size.height
            );
        }
        
        // Display player username above character
        const displayName = player.socketId === socket.id ? getPlayerUsername() : (player.username || player.character.charAt(0).toUpperCase() + player.character.slice(1));
        
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeText(
            displayName, 
            player.position.x, 
            player.position.y - player.size.height + 5
        );
        ctx.fillText(
            displayName, 
            player.position.x, 
            player.position.y - player.size.height + 5
        );
    };
    
    const drawCooldowns = (player) => {
        if(player.socketId !== socket.id){ 
            return;
        }
        
        const cooldowns = ['basic', 'special', 'ultimate'];
        const colors = {
            basic: '#4A90E2',
            special: '#9B59B6',
            ultimate: '#E74C3C'
        };
        
        cooldowns.forEach((ability, i)=>{
            const cd = player.cooldowns[ability];
            const x = 20;
            const y = 100 + i * 50;
            const width = 120;
            const height = 35;
            
            //background
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
            
            //ability box
            ctx.fillStyle = cd > 0 ? "rgba(128, 128, 128, 0.5)" : colors[ability];
            ctx.fillRect(x, y, width, height);
            
            //cooldown overlay
            if(cd > 0){
                const cdPercent = cd / player.cooldowns[ability];
                ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                ctx.fillRect(x, y, width * (cd / 10000), height);
            }
            
            //border
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            
            //text
            ctx.fillStyle = "white";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "left";
            const text = cd > 0 ? `${(cd / 1000).toFixed(1)}s` : "Ready";
            ctx.fillText(ability.toUpperCase(), x + 5, y + 15);
            ctx.font = "10px Arial";
            ctx.fillText(text, x + 5, y + 28);
        });
    };
    
    const animate = (currentTime) => {
        if(!isRendering){
            return;
        }
        animationFrameId = requestAnimationFrame(animate);

        // Calculate delta time in milliseconds
        const deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if(!currentGameState || !currentGameState.players){
            return;
        }

        updateCamera();

        drawBackground();
        
        //apply camera transform
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        
        //render players
        currentGameState.players.forEach(player=>{
            //draw player sprite with animation
            drawPlayer(player, deltaTime);
        });
        
        ctx.restore();
        
        // currentGameState.players.forEach(player=>{
        //     //draw cooldown indicators
        //     drawCooldowns(player);
        // });
        
        //for debug
        // drawGround();
        // drawGridLines();
        // drawMapBoundaries();
    };
    animate(lastFrameTime);
};

export { initializeRender, stopRender, setMap, updateGameState, canvas };