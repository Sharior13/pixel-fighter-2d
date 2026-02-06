import { socket, cleanupSocket } from "../core/socket.js";
import { titleScreenUI } from "./titleScreen.js";
import { audioManager } from "../core/audioManager.js";

class MatchEndScreen {
    constructor() {
        this.screenElement = null;
        this.isWaitingForRematch = false;
        this.matchData = null;
        this.createScreenElement();
    }

    createScreenElement() {
        // Create the match end screen HTML
        const screen = document.createElement('div');
        screen.id = 'match-end-screen';
        screen.innerHTML = `
            <div class="result-container">
                <div class="result-text"></div>
                <div class="match-stats">
                    <div class="player-stats player1-stats">
                        <div class="player-label">YOU</div>
                        <div class="player-character"></div>
                        <div class="stat-row">
                            <span class="stat-label">Damage Dealt:</span>
                            <span class="stat-value damage-dealt">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Damage Taken:</span>
                            <span class="stat-value damage-taken">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Combo Count:</span>
                            <span class="stat-value combo-count">0</span>
                        </div>
                    </div>
                    <div class="player-stats player2-stats">
                        <div class="player-label">OPPONENT</div>
                        <div class="player-character"></div>
                        <div class="stat-row">
                            <span class="stat-label">Damage Dealt:</span>
                            <span class="stat-value damage-dealt">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Damage Taken:</span>
                            <span class="stat-value damage-taken">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Combo Count:</span>
                            <span class="stat-value combo-count">0</span>
                        </div>
                    </div>
                </div>
                <div class="match-end-buttons">
                    <button class="match-end-btn rematch-btn" id="rematch-btn">
                        Rematch
                    </button>
                    <button class="match-end-btn main-menu-btn" id="main-menu-btn">
                        Main Menu
                    </button>
                </div>
                <div class="waiting-text" style="display: none;">
                    Waiting for opponent...
                </div>
            </div>
        `;

        document.body.appendChild(screen);
        this.screenElement = screen;

        // Bind button events
        document.getElementById('rematch-btn').addEventListener('click', () => this.requestRematch());
        document.getElementById('main-menu-btn').addEventListener('click', () => this.returnToMenu());
    }

    show(matchData) {
        this.matchData = matchData;
        const { winner, localPlayer, opponent, reason } = matchData;

        console.log('[MatchEndScreen] Showing results');
        console.log('[MatchEndScreen] Winner:', winner);
        console.log('[MatchEndScreen] Local player:', localPlayer);
        console.log('[MatchEndScreen] Opponent:', opponent);

        const isVictory = winner === socket.id;

        // Set result text and styling
        const resultText = this.screenElement.querySelector('.result-text');
        const resultContainer = this.screenElement.querySelector('.result-container');

        if (isVictory) {
            resultText.textContent = 'VICTORY';
            resultText.classList.add('victory');
            resultContainer.classList.add('victory');
        } else {
            resultText.textContent = 'DEFEAT';
            resultText.classList.add('defeat');
            resultContainer.classList.add('defeat');
        }

        // Fill in stats
        this.updatePlayerStats('.player1-stats', localPlayer, isVictory);
        this.updatePlayerStats('.player2-stats', opponent, !isVictory);

        // Show the screen
        this.screenElement.classList.add('show');
    }

    updatePlayerStats(selector, playerData, isWinner) {
        if (!playerData) {
            console.error('[MatchEndScreen] No player data provided for', selector);
            return;
        }

        const statsContainer = this.screenElement.querySelector(selector);

        if (isWinner) {
            statsContainer.classList.add('winner');
        } else {
            statsContainer.classList.add('loser');
        }

        // Display character name
        const characterName = playerData.character || 'Unknown';
        statsContainer.querySelector('.player-character').textContent = characterName.toUpperCase();
        
        // FIXED: Access stats from correct property structure
        // The server sends stats in various formats, try all possible locations
        const damageDealt = playerData.damageDealt || 
                           playerData.damage || 
                           (playerData.stats && playerData.stats.damageDealt) || 
                           0;
        
        const damageTaken = playerData.damageReceived || 
                           playerData.damageTaken || 
                           (playerData.stats && playerData.stats.damageReceived) || 
                           0;
        
        const comboCount = playerData.maxCombo || 
                          playerData.combo || 
                          (playerData.stats && playerData.stats.maxCombo) || 
                          0;

        console.log(`[MatchEndScreen] ${selector} stats:`, {
            damageDealt,
            damageTaken,
            comboCount,
            rawData: playerData
        });

        statsContainer.querySelector('.damage-dealt').textContent = Math.round(damageDealt);
        statsContainer.querySelector('.damage-taken').textContent = Math.round(damageTaken);
        statsContainer.querySelector('.combo-count').textContent = comboCount;
    }

    requestRematch() {
        if (!socket || this.isWaitingForRematch) {
            return;
        }

        const rematchBtn = document.getElementById('rematch-btn');
        const waitingText = this.screenElement.querySelector('.waiting-text');

        // Disable button and show waiting
        rematchBtn.disabled = true;
        waitingText.style.display = 'block';
        this.isWaitingForRematch = true;

        // Send rematch request to server
        socket.emit('rematchRequest');

        console.log('[MatchEnd] Rematch requested');
    }

    returnToMenu() {
        // Send decline signal if waiting for rematch
        if (this.isWaitingForRematch && socket) {
            socket.emit('rematchDecline');
        }

        // Clean up and return to title screen
        this.hide();
        
        // Stop any playing music and ensure clean state
        audioManager.stopMusic(false); // Immediate stop, no fade
        
        // Clean up socket connection
        cleanupSocket();

        // Show title screen (which will start title music)
        titleScreenUI.showTitleScreen();
    }

    hide() {
        this.screenElement.classList.remove('show');
        this.isWaitingForRematch = false;

        // Reset classes
        const resultText = this.screenElement.querySelector('.result-text');
        const resultContainer = this.screenElement.querySelector('.result-container');

        resultText.classList.remove('victory', 'defeat');
        resultContainer.classList.remove('victory', 'defeat');

        this.screenElement.querySelectorAll('.player-stats').forEach(stat => {
            stat.classList.remove('winner', 'loser');
        });

        // Reset buttons
        const rematchBtn = document.getElementById('rematch-btn');
        if (rematchBtn) {
            rematchBtn.disabled = false;
        }
        this.screenElement.querySelector('.waiting-text').style.display = 'none';
    }

    handleRematchAccepted() {
        console.log('[MatchEnd] Rematch accepted! Returning to character select...');
        this.hide();
    }

    handleRematchDeclined() {
        const waitingText = this.screenElement.querySelector('.waiting-text');
        waitingText.textContent = 'Opponent declined rematch';
        waitingText.style.color = '#FF4444';

        setTimeout(() => {
            this.returnToMenu();
        }, 2000);
    }
}

// Create singleton instance
const matchEndScreen = new MatchEndScreen();

export { matchEndScreen };