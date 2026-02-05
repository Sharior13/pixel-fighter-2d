import { socket } from "../core/socket.js";

class BattleUI {
    constructor() {
        this.gameContainer = document.querySelector('.game-container');
        this.timerDisplay = document.getElementById('timer');
        this.roundIndicator = document.querySelector('.round-indicator');
        
        // Player 1 (left) elements
        this.p1HealthBar = document.getElementById('health-p1');
        this.p1UltimateBar = document.getElementById('ultimate-p1');
        this.p1CharacterImage = document.querySelector('.character-frame.left .character-image');
        this.p1CharacterName = document.querySelector('.character-name.left');
        
        // Player 2 (right) elements
        this.p2HealthBar = document.getElementById('health-p2');
        this.p2UltimateBar = document.getElementById('ultimate-p2');
        this.p2CharacterImage = document.querySelector('.character-frame.right .character-image');
        this.p2CharacterName = document.querySelector('.character-name.right');
        
        this.isVisible = false;
        this.currentState = null;
        this.localPlayerIndex = null; // Track which side the local player is on
    }
    
    show() {
        this.gameContainer.classList.remove('hidden');
        this.isVisible = true;
    }
    
    hide() {
        this.gameContainer.classList.add('hidden');
        this.isVisible = false;
        this.currentState = null;
    }
    
    initialize(gameState) {
        if (!gameState || !gameState.players || gameState.players.length < 2) {
            console.error('[BattleUI] Invalid game state for initialization');
            return;
        }
        
        const localPlayer = gameState.players.find(p => p.socketId === socket.id);
        const opponent = gameState.players.find(p => p.socketId !== socket.id);
        
        if (!localPlayer || !opponent) {
            console.error('[BattleUI] Could not find players');
            return;
        }
        
        // Determine which side each player is on based on playerIndex
        // playerIndex 0 spawns on left, playerIndex 1 spawns on right
        let p1, p2;
        
        if (localPlayer.playerIndex === 0) {
            // Local player on left
            p1 = localPlayer;
            p2 = opponent;
        } else {
            // Local player on right (swap the displays)
            p1 = opponent;
            p2 = localPlayer;
        }
        
        // Set character images based on actual spawn positions
        this.updateCharacterImage(this.p1CharacterImage, p1.character);
        this.updateCharacterImage(this.p2CharacterImage, p2.character);
        
        // Set character names
        this.p1CharacterName.textContent = p1.character.toUpperCase();
        this.p2CharacterName.textContent = p2.character.toUpperCase();
        
        // Set map name
        if (gameState.map && gameState.map.name) {
            this.roundIndicator.textContent = gameState.map.name;
        }
        
        // Store player indices for update method
        this.localPlayerIndex = localPlayer.playerIndex;
        
        this.show();
        console.log('[BattleUI] Initialized with local player index:', localPlayer.playerIndex);
    }
    
    updateCharacterImage(imageElement, characterName) {
        const charName = characterName.toLowerCase();
        imageElement.src = `../assets/characters/${charName}/${charName}-icon.png`;
        imageElement.alt = characterName;
        
        // Handle image load error
        imageElement.onerror = () => {
            console.warn(`[BattleUI] Character image not found for ${characterName}`);
            // Use a simple colored div instead of placeholder URL
            imageElement.style.display = 'none';
            imageElement.parentElement.style.background = '#8B4513';
            imageElement.parentElement.style.display = 'flex';
            imageElement.parentElement.style.alignItems = 'center';
            imageElement.parentElement.style.justifyContent = 'center';
            imageElement.parentElement.innerHTML = `<span style="color: white; font-weight: bold; font-size: 14px;">${characterName.toUpperCase()}</span>`;
        };
    }
    
    update(gameState) {
        if (!this.isVisible || !gameState || !gameState.players) {
            return;
        }
        
        this.currentState = gameState;
        
        const localPlayer = gameState.players.find(p => p.socketId === socket.id);
        const opponent = gameState.players.find(p => p.socketId !== socket.id);
        
        if (!localPlayer || !opponent) {
            return;
        }
        
        // Determine which bars to update based on spawn position
        let p1, p2;
        if (this.localPlayerIndex === 0) {
            // Local player on left (playerIndex 0)
            p1 = localPlayer;
            p2 = opponent;
        } else {
            // Local player on right (playerIndex 1)
            p1 = opponent;
            p2 = localPlayer;
        }
        
        // Update Player 1 (left side) bars
        this.updateHealthBar(this.p1HealthBar, p1.health, p1.maxHealth);
        this.updateUltimateBar(this.p1UltimateBar, p1.cooldowns?.ultimate || 0);
        
        // Update Player 2 (right side) bars
        this.updateHealthBar(this.p2HealthBar, p2.health, p2.maxHealth);
        this.updateUltimateBar(this.p2UltimateBar, p2.cooldowns?.ultimate || 0);
        
        // Update timer
        this.updateTimer(gameState.timeRemaining);
    }
    
    updateHealthBar(barElement, currentHealth, maxHealth) {
        const percentage = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
        barElement.style.width = percentage + '%';
        
        // Add color change based on health
        if (percentage <= 20) {
            barElement.style.background = 'linear-gradient(90deg, #8B0000, #DC143C)';
        } else if (percentage <= 50) {
            barElement.style.background = 'linear-gradient(90deg, #DC143C, #FF4444)';
        } else {
            barElement.style.background = 'linear-gradient(90deg, #DC143C, #FF4444, #FF6666)';
        }
    }
    
    updateUltimateBar(barElement, ultimateCooldown) {
        // Get max ultimate cooldown from character abilities (assume 30000ms default)
        const maxUltimateCooldown = 30000;
        
        // Calculate percentage: inverted so bar is full when cooldown is 0 (ready)
        // and empty when cooldown is at max
        const cooldownPercentage = (ultimateCooldown / maxUltimateCooldown) * 100;
        const fillPercentage = Math.max(0, Math.min(100, 100 - cooldownPercentage));
        
        barElement.style.width = fillPercentage + '%';
        
        // Add glow effect when ultimate is full/ready
        if (fillPercentage >= 100) {
            barElement.style.boxShadow = 'inset 0 -4px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 255, 102, 0.9)';
            barElement.style.background = 'linear-gradient(90deg, #00C853, #00FF66, #69F0AE)';
        } else {
            barElement.style.boxShadow = 'inset 0 -4px 8px rgba(0, 0, 0, 0.4), 0 0 12px rgba(0, 200, 83, 0.5)';
            barElement.style.background = 'linear-gradient(90deg, #00C853, #00FF66)';
        }
    }
    
    updateTimer(timeRemaining) {
        const seconds = Math.max(0, Math.ceil(timeRemaining / 1000));
        this.timerDisplay.textContent = seconds;
        
        // Add warning color when time is low
        if (seconds <= 10) {
            this.timerDisplay.style.color = '#FF4444';
            this.timerDisplay.style.animation = 'pulse 0.5s ease-in-out infinite';
        } else if (seconds <= 30) {
            this.timerDisplay.style.color = '#FFD700';
            this.timerDisplay.style.animation = 'none';
        } else {
            this.timerDisplay.style.color = '#FFF';
            this.timerDisplay.style.animation = 'none';
        }
    }
}

// Create singleton instance
const battleUI = new BattleUI();

// Add pulse animation for timer warning
if (!document.getElementById('timer-pulse-style')) {
    const style = document.createElement('style');
    style.id = 'timer-pulse-style';
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
    `;
    document.head.appendChild(style);
}

export { battleUI };