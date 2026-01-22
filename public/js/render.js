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

const initializeRender = ()=>{
    if(isRendering){
        return;
    }
    
    const gridLines = ()=>{
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

    const animate = ()=>{
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        gridLines();
    }
    animate();

};

export { initializeRender, canvas };