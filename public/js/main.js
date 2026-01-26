import { initializeRender, canvas } from "./render.js";

const titleDiv = document.getElementById('title-screen');
// const titleForm = document.getElementById('title-form');
// const playerName = document.getElementById('player-name');

const titleScreen = ()=>{
    const button = document.querySelector('.btn');
    button.addEventListener('click', ()=>{
        switch(button.id){
            case "quick-start-btn":
                startGame();
        }
    });
};
const startGame = ()=>{
    titleDiv.style.display = 'none';
    initializeRender();
};
titleScreen();

export { titleScreen };