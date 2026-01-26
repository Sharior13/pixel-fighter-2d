import { initializeRender, canvas } from "./render.js";
import { initializeSocket } from "./socket.js";

const titleDiv = document.getElementById('title-screen');
// const titleForm = document.getElementById('title-form');
// const playerName = document.getElementById('player-name');

const titleScreen = ()=>{
    canvas.style.backgroundImage = "url('./assets/title-bg.gif')";
    titleDiv.style.display = "flex";

    titleDiv.addEventListener('click', (event)=>{
        if(!event.target.classList.contains('btn')){
            return;
        }

        switch(event.target.id){
            case "quick-start-btn":
                startGame("quickStart");
                break;
            case "room-btn":
                console.log("chalyooo");
                //show popup and take room id then start game with that room id
                break;
            case "settings-btn":
                //show settings
                break;
            case "profile-btn":
                //show player name change option and login option
                break;
            default:
                break;
        }
    });
};

const startGame = (mode, id)=>{
    canvas.style.backgroundImage = 'none';
    titleDiv.style.display = 'none';
    initializeSocket(mode, id);
    initializeRender();
};

titleScreen();

export { titleScreen };