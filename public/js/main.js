import { initializeRender, canvas } from "./render.js";

const titleForm = document.getElementById('title-form');
const playerName = document.getElementById('player-name');

const titleScreen = ()=>{

    titleForm.style = `left:${canvas.width/2 - 250}px; top:${-canvas.height/2 + 55}px`;
    titleForm.addEventListener('submit', (event)=>{
        event.preventDefault();
        startGame();
    });
};
const startGame = ()=>{
    titleForm.style.display = 'none';
};
titleScreen();
initializeRender();

export { titleScreen };