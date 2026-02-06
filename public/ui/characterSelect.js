import { socket } from "../core/socket.js";
import { canvas } from "../core/render.js";
import { audioManager } from "../core/audioManager.js";

const grid = document.getElementById("character-grid");
const lockBtn = document.getElementById("lockBtn");
const player1Preview = document.getElementById("player1-preview");
const player2Preview = document.getElementById("player2-preview");
const statusText = document.getElementById("statusText");

//temporary
const CHARACTERS = [
  { id: "luffy", name: "Luffy", image:'../assets/characters/luffy/luffy.gif' },
  { id: "zoro", name: "Zoro", image:'../assets/characters/zoro/zoro.gif' },
  { id: "naruto", name: "Naruto", image:'../assets/characters/naruto/naruto.gif' },
  { id: "sasuke", name: "Sasuke", image:'../assets/characters/sasuke/sasuke.gif' },
  { id: "kakashi", name: "Kakashi", image:'../assets/characters/kakashi/kakashi.gif' },
  { id: "ichigo", name: "Ichigo", image:'../assets/characters/ichigo/ichigo.gif' },
  { id: "rukia", name: "Rukia", image:'../assets/characters/rukia/rukia.gif' },
  { id: "s1", name: "s1", image:'../assets/characters/others/s1.gif', unavailable: true },
  { id: "s2", name: "s2", image:'../assets/characters/others/s2.gif', unavailable: true },
  { id: "s3", name: "s3", image:'../assets/characters/others/s3.gif', unavailable: true },
  { id: "s4", name: "s4", image:'../assets/characters/others/s4.gif', unavailable: true },
];
const characterSelectState = {
    selectedCharacter: null,
    opponentCharacter: null,
    locked: false,
    timerInterval: null,
    timeRemaining: 30
};

const playCharacterLockSound = (characterId) => {
    if (!characterId) return;

    // Use audioManager for proper volume control
    audioManager.playSFX(
        `../assets/characters/${characterId}/${characterId}-select.ogg`
    );
};

//open char select
const openCharacterSelect = ()=>{
    document.getElementById("character-select").style.display = "flex"; 
    document.getElementById('p1-label').classList.remove('active');
    document.getElementById('p2-label').classList.remove('active');

    // Restore character select background
    canvas.style.backgroundImage = "url('../assets/background/title-bg.gif')";

    characterSelectState.selectedCharacter = null;
    characterSelectState.opponentCharacter = null;
    characterSelectState.locked = false;
    characterSelectState.timeRemaining = 30;

    player1Preview.innerHTML = '<span class="silhouette">?</span>';
    player2Preview.innerHTML = '<span class="silhouette">?</span>';
    statusText.textContent = '';
    lockBtn.disabled = true;

    // Clear any existing timer
    if (characterSelectState.timerInterval) {
        clearInterval(characterSelectState.timerInterval);
    }

    // Start countdown timer
    startCharacterSelectTimer();

    renderCharacterGrid();
};

// Timer function for character select
const startCharacterSelectTimer = () => {
    // Create or update timer display
    let timerDisplay = document.getElementById('character-timer');
    characterSelectState.timerInterval = setInterval(()=>{
        const seconds = characterSelectState.timeRemaining;
        // Change color based on time remaining
        if (seconds <= 10) {
            timerDisplay.style.color = '#FF4444';
            timerDisplay.style.animation = 'pulse 0.5s ease-in-out infinite';
        } else if (seconds <= 30) {
            timerDisplay.style.color = '#FFD700';
            timerDisplay.style.animation = 'none';
        } else {
            timerDisplay.style.color = '#FFF';
            timerDisplay.style.animation = 'none';
        }

        timerDisplay.textContent = `${characterSelectState.timeRemaining}`;
        characterSelectState.timeRemaining--;
    }, 1000);
};

//render charcter selection ui
const renderCharacterGrid = ()=>{
    grid.innerHTML = "";
    
    CHARACTERS.forEach((char)=>{
        const slot = document.createElement('button');

        slot.className = "character-slot";
        if (char.image) {
            const img = document.createElement('img');
            img.src = char.image;
            img.alt = char.name;
            slot.appendChild(img);
        }
        else {
            slot.textContent = char.name;
        }

        if(char.unavailable){
          slot.classList.add('locked');
        }
    
        slot.onclick = ()=>{
            if(characterSelectState.locked || char.unavailable){
              return;
            }
            if (char.id === characterSelectState.opponentCharacter) {
              return;
            }
    
            characterSelectState.selectedCharacter = char.id;
            socket.emit("selectCharacter", char.id);
            updatePlayerPreview(player1Preview, char);
            updateSelectionUI();
        };    

      grid.appendChild(slot);
    });
};

//update player preview image
const updatePlayerPreview = (previewElement, character) => {
    previewElement.innerHTML = '';

    if (!character) {
        const silhouette = document.createElement('span');
        silhouette.className = 'silhouette';
        silhouette.textContent = '?';
        previewElement.appendChild(silhouette);
        return;
    }

    if (character.image) {
        const img = document.createElement('img');
        img.src = character.image;
        img.alt = character.name;
        previewElement.appendChild(img);
    }
    else {
        previewElement.textContent = character.name;
    }

    previewElement.classList.add('animate');
};

//update character selection ui
const updateSelectionUI = ()=>{
    document.querySelectorAll(".character-slot").forEach((btn, index)=>{
        const char = CHARACTERS[index];
        const charId = char.id;
        
        // Remove all dynamic classes
        btn.classList.remove("selected", "taken");
        btn.removeAttribute("data-player");
        
        // Re-add 'locked' class only for unavailable characters
        if (char.unavailable) {
            btn.classList.add("locked");
        } else {
            // Remove 'locked' class from available characters
            btn.classList.remove("locked");
        }
        
        // Mark opponent's character as taken
        if(characterSelectState.opponentCharacter === charId && characterSelectState.selectedCharacter !== charId){
            btn.classList.add("locked", "taken");
        }
    }); 

    
  //player 1 selection
  if (characterSelectState.selectedCharacter) {
    const p1Index = CHARACTERS.findIndex(
      c => c.id === characterSelectState.selectedCharacter
    );
    if (p1Index !== -1) {
      const p1Slot = grid.children[p1Index];
      p1Slot.classList.add("selected");
      p1Slot.setAttribute("data-player", "P1");
    }
    lockBtn.disabled = false;
  }

  //player 2 selection
  if (characterSelectState.opponentCharacter) {
    const p2Index = CHARACTERS.findIndex(
      c => c.id === characterSelectState.opponentCharacter
    );
    if (p2Index !== -1) {
      const p2Slot = grid.children[p2Index];
      p2Slot.classList.add("selected");
      p2Slot.setAttribute("data-player", "P2");
    }
  }
};

//lock button logic
lockBtn.onclick = ()=>{
    if (!characterSelectState.selectedCharacter){
      return;
    }   
    document.getElementById('p1-label').classList.add('active');
    characterSelectState.locked = true;
    lockBtn.disabled = true;

    playCharacterLockSound(characterSelectState.selectedCharacter);
    socket.emit("lockCharacter");   
    
    document.getElementById("statusText").textContent = "Locked in! Waiting for opponent...";
};

//show opponent character
const showOpponentPreview = (socketId, characterId)=>{
    characterSelectState.opponentCharacter = characterId;
    
    //find the opponent's character and update their preview
    const opponentChar = CHARACTERS.find(c => c.id === characterId);
    if (opponentChar) {
        updatePlayerPreview(player2Preview, opponentChar);
    }
    updateSelectionUI();
    if(opponentChar.locked){
        document.getElementById('p2-label').classList.add('active');
        playCharacterLockSound(characterId); 
    }
};

export { openCharacterSelect, showOpponentPreview };