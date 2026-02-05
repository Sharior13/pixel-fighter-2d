import { initializeRender, canvas } from "../core/render.js";
import { initializeSocket } from "../core/socket.js";
import "./characterSelect.js";
import "../core/input.js";

const titleDiv = document.getElementById('title-screen');

const titleScreen = () => {
    showTitleScreen();

    // Listen to player clicking buttons and react accordingly
    titleDiv.addEventListener('click', (event) => {
        if (!event.target.classList.contains('btn')) {
            return;
        }

        switch (event.target.id) {
            case "quick-start-btn":
                startGame("quickStart");
                break;
            case "room-btn":
                console.log("Room creation not yet implemented");
                // Show popup and take room id then start game with that room id
                // startGame("custom", roomId);
                break;
            case "settings-btn":
                // Show settings
                break;
            case "profile-btn":
                // Show player name change option and login option
                break;
            default:
                break;
        }
    });
};

const startGame = (mode, roomId) => {
    hideTitleScreen();
    initializeSocket(mode, roomId);
    initializeRender();
};

const hideTitleScreen = () => {
    titleDiv.style.display = 'none';
};

const showTitleScreen = () => {
    canvas.style.backgroundImage = "url('./assets/background/title-bg.gif')";
    titleDiv.style.display = "flex";
};

titleScreen();

export { titleScreen };