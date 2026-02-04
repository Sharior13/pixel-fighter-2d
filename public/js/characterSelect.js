import { socket } from "./socket.js";

const grid = document.getElementById("character-grid");
const lockBtn = document.getElementById("lockBtn");
const player1Preview = document.getElementById("player1-preview");
const player2Preview = document.getElementById("player2-preview");
const statusText = document.getElementById("statusText");

//temporary
const CHARACTERS = [
  { id: "luffy", name: "Luffy", image:'../assets/characters/luffy/luffy.gif' },
  { id: "naruto", name: "Naruto", image:'../assets/characters/naruto/naruto.gif' },
  { id: "zoro", name: "Zoro", image:'../assets/characters/zoro/zoro.gif' },
  { id: "kakashi", name: "Kakashi", image:'../assets/characters/kakashi/kakashi.gif' }
];
const characterSelectState = {
  selectedCharacter: null,
  opponentCharacter: null,
  locked: false
};

//open char select
const openCharacterSelect = ()=>{
    document.getElementById("character-select").style.display = "flex"; 
    document.getElementById('p1-label').classList.remove('active');
    document.getElementById('p2-label').classList.remove('active');

    characterSelectState.selectedCharacter = null;
    characterSelectState.opponentCharacter = null;
    characterSelectState.locked = false;

    player1Preview.innerHTML = '<span class="silhouette">?</span>';
    player2Preview.innerHTML = '<span class="silhouette">?</span>';
    statusText.textContent = '';
    lockBtn.disabled = true;

    renderCharacterGrid();
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
        
                slot.onclick = ()=>{
                    if(characterSelectState.locked){
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
    document.querySelectorAll(".character-slot").forEach((btn)=>{
        btn.classList.remove("selected");
        btn.removeAttribute("data-player");
    }); 

   //mark player 1's character
    if (characterSelectState.selectedCharacter) {
        const p1Index = CHARACTERS.findIndex(c => c.id === characterSelectState.selectedCharacter);
        if (p1Index !== -1) {
            const p1Slot = grid.children[p1Index];
            p1Slot.classList.add("selected");
            p1Slot.setAttribute("data-player", "P1");
        }
        lockBtn.disabled = false;
    }

    //mark player 2's character
    if (characterSelectState.opponentCharacter) {
        const p2Index = CHARACTERS.findIndex(c => c.id === characterSelectState.opponentCharacter);
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
        updateSelectionUI();
    }
};

export { openCharacterSelect, showOpponentPreview };