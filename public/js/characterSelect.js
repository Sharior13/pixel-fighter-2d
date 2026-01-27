import { socket } from "./socket.js";

const grid = document.getElementById("character-grid");
const lockBtn = document.getElementById("lockBtn");


//temporary
const CHARACTERS = [
  { id: "luffy", name: "Luffy" },
  { id: "naruto", name: "Naruto" },
  { id: "zoro", name: "Zoro" },
  { id: "kakashi", name: "Kakashi" }
];
const characterSelectState = {
  selectedCharacter: null,
  locked: false,
  opponents: {}
};

//open char select
const openCharacterSelect = ()=>{
    document.getElementById("character-select").classList.remove("hidden"); 

    characterSelectState.selectedCharacter = null;
    characterSelectState.locked = false;
    characterSelectState.opponents = {};

    renderCharacterGrid();
};

//render charcter selection ui
const renderCharacterGrid = ()=>{
    grid.innerHTML = "";
    
    CHARACTERS.forEach((char)=>{
      const btn = document.createElement("button");
      btn.className = "character-btn";
      btn.textContent = char.name;  

      btn.onclick = ()=>{
        if(characterSelectState.locked){
          return;
        }
        
        characterSelectState.selectedCharacter = char.id;
        socket.emit("selectCharacter", char.id);
        updateSelectionUI();
      };    

      grid.appendChild(btn);
    });
};

//update character selection ui
const updateSelectionUI = ()=>{
    document.querySelectorAll(".character-btn").forEach((btn)=>{
      btn.classList.remove("selected");
    }); 

    if (!characterSelectState.selectedCharacter){
      return;
    }  

    const index = CHARACTERS.findIndex(c => c.id === characterSelectState.selectedCharacter); 

    if (index !== -1){
      grid.children[index].classList.add("selected");
      document.getElementById("lockBtn").disabled = false;
    }
};

//lock button logic
lockBtn.onclick = ()=>{
    if (!characterSelectState.selectedCharacter){
      return;
    }   

    characterSelectState.locked = true;
    lockBtn.disabled = true;
    socket.emit("lockCharacter");   
    
    document.getElementById("statusText").textContent =
      "Locked in! Waiting for opponent...";
};

//show opponent character
const showOpponentPreview = (socketId, characterId)=>{
    characterSelectState.opponents[socketId] = characterId;
    document.getElementById("statusText").textContent =
      "Opponent is choosing...";
};

export { openCharacterSelect, showOpponentPreview };