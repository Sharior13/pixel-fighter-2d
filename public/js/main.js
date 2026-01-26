import { initializeRender, canvas } from "./render.js";
import { initializeSocket } from "./socket.js";

const titleDiv = document.getElementById('title-screen');
// const titleForm = document.getElementById('title-form');
// const playerName = document.getElementById('player-name');

const titleScreen = ()=>{
    canvas.style.backgroundImage = "url('./assets/title-bg.gif')";
    titleDiv.style.display = "flex";

    const button = document.querySelector('.btn');
    button.addEventListener('click', ()=>{
        switch(button.id){
            case "quick-start-btn":
                startGame("quick-start");
            case "room-btn":
                //show popup and take room id then start game with that room id
            case "settings-btn":
                //show settings
            case "profile":
                //show player name change option and login option
        }
    });
};
const startGame = (mode)=>{
    canvas.style.backgroundImage = 'none';
    titleDiv.style.display = 'none';
    initializeSocket(mode);
    initializeRender();
};
titleScreen();

export { titleScreen };