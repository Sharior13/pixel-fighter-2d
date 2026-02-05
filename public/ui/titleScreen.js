import { initializeRender, canvas } from "../core/render.js";
import { initializeSocket } from "../core/socket.js";
import "./characterSelect.js";
import "../core/input.js";

const titleDiv = document.getElementById('title-screen');
const roomDiv = document.getElementById('main-container');

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
                // Show custom room UI
                hideTitleScreen();
                roomDiv.style.display = 'flex';
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

    // Custom room back button
    document.getElementById('room-back').addEventListener('click', () => {
        roomDiv.style.display = "none";
        showTitleScreen();
    });

    // Create room button
    document.getElementById('room-create-btn').addEventListener('click', () => {
        const roomNameInput = document.querySelector('#main-container .join:nth-child(2) input');
        const roomName = roomNameInput.value.trim();
        
        if (!roomName) {
            alert("Please enter a room name");
            return;
        }

        hideTitleScreen();
        roomDiv.style.display = "none";
        startGame("createCustomRoom");
    });

    // Join room button
    document.getElementById('room-join-btn').addEventListener('click', () => {
        const roomIdInput = document.querySelector('#main-container .join:nth-child(1) input');
        const roomId = roomIdInput.value.trim().toUpperCase();
        
        if (!roomId) {
            alert("Please enter a room ID");
            return;
        }

        if (roomId.length !== 5) {
            alert("Room ID must be 5 characters");
            return;
        }

        hideTitleScreen();
        roomDiv.style.display = "none";
        startGame("joinCustomRoom", roomId);
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