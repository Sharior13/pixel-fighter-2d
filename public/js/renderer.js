const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

let isRendering = false;

const initializeRender = ()=>{
    if(isRendering){
        return;
    }

    const animate = ()=>{
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animate();
};

export { initializeRender };