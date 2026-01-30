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

const camera = {
    x: 0,
    y: 0
};

const updateGameState = (state)=>{
    currentGameState = state;
};

//update current player's viewport
const updateCamera = (player)=>{
    camera.x = player.position.x - canvas.width / 2;
    camera.y = player.position.y - canvas.height / 2;

    camera.x = Math.max(0, Math.min(camera.x, 2000 - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, 600 - canvas.height));
};

const stopRender = ()=>{
    if(animationFrameId){
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    isRendering = false;
    currentGameState = null;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Render stopped");
};

const initializeRender = ()=>{
    if(isRendering){
        return;
    }
    isRendering = true;
    console.log("render: ",isRendering);
    
    
    
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
        const arrowX = player.facing > 0 ? player.position.x + 30 : player.position.x - 30;
        ctx.fillRect(arrowX, player.position.y - 25, 10, 10);
    };
    
    const drawHealthBar = (player)=>{
        const barWidth = player.size.width;
        const barHeight = 5;
        const x = player.position.x - barWidth / 2;
        const y = player.position.y - player.size.height - 10;
        
        //background
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
        cooldowns.forEach((ability, i)=>{
            const cd = player.cooldowns[ability];
            const x = 20;
            const y = 100 + i * 40;
            
            ctx.fillStyle = cd > 0 ? "gray" : "green";
            ctx.fillRect(x, y, 100, 30);
            
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            const text = cd > 0 ? `${(cd / 1000).toFixed(1)}s` : "Ready";
            ctx.fillText(`${ability}: ${text}`, x + 5, y + 20);
        });
    };
    
    const animate = () => {
        if(!isRendering){
            return;
        }
        animationFrameId = requestAnimationFrame(animate);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGridLines();

        if(!currentGameState || !currentGameState.players){
            return;
        }

        const localPlayer = currentGameState.players.find(p => p.socketId === socket.id);
        if(localPlayer){
            updateCamera(localPlayer);
        }

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
        
        //draw time remaining
        const timeLeft = Math.ceil(currentGameState.timeRemaining / 1000);
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.fillText(`Time: ${timeLeft}s`, canvas.width / 2 - 50, 30, 100);
    };
    animate();
};

export { initializeRender, stopRender, updateGameState, canvas };