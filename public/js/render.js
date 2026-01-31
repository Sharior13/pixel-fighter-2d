import { socket } from "./socket.js";
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

const camera = {
    x: 0,
    y: 0
};

const updateGameState = (state)=>{
    currentGameState = state;

    if(state.map && !currentMap){
        currentMap = state.map;
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
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Render stopped");
};

const initializeRender = ()=>{
    if(isRendering){
        return;
    }
    isRendering = true;
    console.log("render: ",isRendering);
    
    const drawBackground = ()=>{
        if(currentMap){
            ctx.fillStyle = currentMap.backgroundColor || "#1a1a2e";
        } else {
            ctx.fillStyle = "#1a1a2e";
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    const drawGround = ()=>{
        if(!currentMap){
            return;
        }
        
        //draw ground line
        ctx.strokeStyle = "#4a4a4a";
        ctx.lineWidth = 3;
        ctx.beginPath();
        const groundScreenY = currentMap.groundY - camera.y;
        ctx.moveTo(0, groundScreenY);
        ctx.lineTo(canvas.width, groundScreenY);
        ctx.stroke();
        
        //draw ground fill
        ctx.fillStyle = "rgba(74, 74, 74, 0.3)";
        ctx.fillRect(0, groundScreenY, canvas.width, canvas.height - groundScreenY);
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
    const updateCamera = (player)=>{
        camera.x = player.position.x - canvas.width / 2;
        camera.y = player.position.y - canvas.height / 2;
    
        camera.x = Math.max(0, Math.min(camera.x, currentMap.width - canvas.width));
        camera.y = Math.max(0, Math.min(camera.y, currentMap.height - canvas.height));
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
    
    const drawPlayer = (player)=>{
        ctx.fillStyle = player.socketId === socket.id ? "blue" : "red";
        ctx.fillRect(player.position.x - player.size.width/2, player.position.y - player.size.height, player.size.width, player.size.height);
        
        //facing indicator
        ctx.fillStyle = "yellow";
        const arrowSize = 15;
        const arrowX = player.facing > 0 ? player.position.x + player.size.width / 2 + 10 : player.position.x - player.size.width / 2 - 10 - arrowSize;
        const arrowY = player.position.y - player.size.height / 2 - arrowSize / 2;
        
        ctx.beginPath();
        if(player.facing > 0){
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize / 2);
            ctx.lineTo(arrowX, arrowY + arrowSize);
        }
        else{
            ctx.moveTo(arrowX + arrowSize, arrowY);
            ctx.lineTo(arrowX, arrowY + arrowSize / 2);
            ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize);
        }
        ctx.closePath();
        ctx.fill();
        
        //character name
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            player.character, 
            player.position.x, 
            player.position.y - player.size.height - 30
        );
    };
    
    const drawHealthBar = (player)=>{
        const barWidth = player.size.width;
        const barHeight = 8;
        const x = player.position.x - barWidth / 2;
        const y = player.position.y - player.size.height - 10;
        
        //background
        ctx.fillStyle = "black"; 
        ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);

        ctx.fillStyle = "red";
        ctx.fillRect(x, y, barWidth, barHeight);
        
        //health
        const healthWidth = (player.health / player.maxHealth) * barWidth;
        ctx.fillStyle = "green";
        ctx.fillRect(x, y, healthWidth, barHeight);

        //border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
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
    
    const drawHUD = () => {
        if(!currentGameState){
            return;
        }
        
        //map name
        if(currentMap){
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(canvas.width / 2 - 100, 10, 200, 40);
            
            ctx.fillStyle = "white";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            ctx.fillText(currentMap.name, canvas.width / 2, 25);
            
            //time remaining
            const timeLeft = Math.ceil(currentGameState.timeRemaining / 1000);
            ctx.font = "14px Arial";
            ctx.fillText(`Time: ${timeLeft}s`, canvas.width / 2, 42);
        }
        
        //player scores
        currentGameState.players.forEach((player, index) => {
            const isLeft = index === 0;
            const x = isLeft ? 20 : canvas.width - 220;
            const y = 20;
            
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(x, y, 200, 60);
            
            ctx.fillStyle = player.socketId === socket.id ? "#4A90E2" : "#E24A4A";
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "left";
            ctx.fillText(player.character, x + 10, y + 20);
            
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.fillText(`HP: ${player.health}/${player.maxHealth}`, x + 10, y + 40);
            ctx.fillText(`Combo: ${player.combo}`, x + 10, y + 55);
        });
    };
    
    const animate = () => {
        if(!isRendering){
            return;
        }
        animationFrameId = requestAnimationFrame(animate);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if(!currentGameState || !currentGameState.players){
            return;
        }
        
        const localPlayer = currentGameState.players.find(p => p.socketId === socket.id);
        if(localPlayer){
            updateCamera(localPlayer);
        }

        //for debug
        drawGridLines();
        drawMapBoundaries();

        drawBackground();
        drawGround();

        //apply camera transform
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        //render players
        currentGameState.players.forEach(player=>{
            //draw player sprite
            drawPlayer(player);
            
            //draw health bar
            drawHealthBar(player);
        });
        ctx.restore();
        currentGameState.players.forEach(player=>{
            //draw cooldown indicators
            drawCooldowns(player);
        });

        drawHUD();
    };
    animate();
};

export { initializeRender, stopRender, updateGameState, canvas };