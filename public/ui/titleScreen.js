import { initializeRender, canvas } from "../core/render.js";
import { initializeSocket } from "../core/socket.js";
import "./characterSelect.js";
import "../core/input.js";

class TitleScreenUI {
    constructor() {
        // UI Containers
        this.titleDiv = document.getElementById('title-screen');
        this.roomDiv = document.getElementById('main-container');
        this.settingsContainer = document.querySelector('.settings-container');
        this.profileContainer = document.querySelector('.profile-container');
        
        // Settings elements
        this.backBtn = document.getElementById('backBtn');
        this.masterVolumeSlider = document.getElementById('masterVolume');
        this.musicVolumeSlider = document.getElementById('musicVolume');
        this.sfxVolumeSlider = document.getElementById('sfxVolume');
        this.masterValueDisplay = document.getElementById('masterValue');
        this.musicValueDisplay = document.getElementById('musicValue');
        this.sfxValueDisplay = document.getElementById('sfxValue');
        
        // Profile elements
        this.avatarImage = document.getElementById('avatarImage');
        this.usernameInput = document.querySelector('.username');
        
        this.initialize();
    }
    
    initialize() {
        this.setupTitleScreen();
        this.setupSettingsScreen();
        this.setupProfileScreen();
        this.showTitleScreen();
    }
    
    // ==================== TITLE SCREEN ====================
    
    setupTitleScreen() {
        // Listen to player clicking buttons and react accordingly
        this.titleDiv.addEventListener('click', (event) => {
            if (!event.target.classList.contains('btn')) {
                return;
            }

            switch (event.target.id) {
                case "quick-start-btn":
                    this.startGame("quickStart");
                    break;
                case "room-btn":
                    // Show custom room UI
                    this.hideTitleScreen();
                    this.roomDiv.style.display = 'flex';
                    break;
                case "settings-btn":
                    // Show settings
                    this.hideTitleScreen();
                    this.showSettings();
                    break;
                case "profile-btn":
                    // Show profile
                    this.hideTitleScreen();
                    this.showProfile();
                    break;
                default:
                    break;
            }
        });

        // Custom room back button
        document.getElementById('room-back').addEventListener('click', () => {
            this.roomDiv.style.display = "none";
            this.showTitleScreen();
        });

        // Create room button
        document.getElementById('room-create-btn').addEventListener('click', () => {
            const roomNameInput = document.querySelector('#main-container .join:nth-child(2) input');
            const roomName = roomNameInput.value.trim();
            
            if (!roomName) {
                alert("Please enter a room name");
                return;
            }

            this.hideTitleScreen();
            this.roomDiv.style.display = "none";
            this.startGame("createCustomRoom");
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

            this.hideTitleScreen();
            this.roomDiv.style.display = "none";
            this.startGame("joinCustomRoom", roomId);
        });
    }
    
    startGame(mode, roomId) {
        this.hideTitleScreen();
        initializeSocket(mode, roomId);
        initializeRender();
    }
    
    hideTitleScreen() {
        this.titleDiv.style.display = 'none';
    }
    
    showTitleScreen() {
        canvas.style.backgroundImage = "url('../assets/background/title-bg.gif')";
        this.titleDiv.style.display = "flex";
        
        // Hide other screens
        if (this.settingsContainer) {
            this.settingsContainer.classList.add('hidden');
        }
        if (this.profileContainer) {
            this.profileContainer.classList.add('hidden');
        }
        if (this.roomDiv) {
            this.roomDiv.style.display = 'none';
        }
    }
    
    // ==================== SETTINGS SCREEN ====================
    
    setupSettingsScreen() {
        // Load saved settings from localStorage
        this.loadSettings();
        
        // Setup volume slider listeners
        if (this.masterVolumeSlider) {
            this.masterVolumeSlider.addEventListener('input', (e) => {
                this.updateVolume('master', e.target.value);
            });
        }
        
        if (this.musicVolumeSlider) {
            this.musicVolumeSlider.addEventListener('input', (e) => {
                this.updateVolume('music', e.target.value);
            });
        }
        
        if (this.sfxVolumeSlider) {
            this.sfxVolumeSlider.addEventListener('input', (e) => {
                this.updateVolume('sfx', e.target.value);
            });
        }
        
        // Setup back button
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
                this.hideSettings();
                this.showTitleScreen();
            });
        }
        
        console.log('[TitleScreenUI] Settings initialized');
    }
    
    showSettings() {
        if (this.settingsContainer) {
            this.settingsContainer.classList.remove('hidden');
            console.log('[TitleScreenUI] Settings shown');
        }
    }
    
    hideSettings() {
        if (this.settingsContainer) {
            this.settingsContainer.classList.add('hidden');
            console.log('[TitleScreenUI] Settings hidden');
        }
    }
    
    updateVolume(type, value) {
        const percentage = value + '%';
        
        switch(type) {
            case 'master':
                if (this.masterValueDisplay) {
                    this.masterValueDisplay.textContent = percentage;
                }
                this.saveSettings();
                this.applyMasterVolume(value / 100);
                break;
                
            case 'music':
                if (this.musicValueDisplay) {
                    this.musicValueDisplay.textContent = percentage;
                }
                this.saveSettings();
                this.applyMusicVolume(value / 100);
                break;
                
            case 'sfx':
                if (this.sfxValueDisplay) {
                    this.sfxValueDisplay.textContent = percentage;
                }
                this.saveSettings();
                this.applySFXVolume(value / 100);
                break;
        }
    }
    
    applyMasterVolume(volume) {
        // This would apply to all audio elements
        console.log('[TitleScreenUI] Master volume set to:', volume);
    }
    
    applyMusicVolume(volume) {
        // This would apply to background music
        console.log('[TitleScreenUI] Music volume set to:', volume);
    }
    
    applySFXVolume(volume) {
        // This would apply to sound effects
        console.log('[TitleScreenUI] SFX volume set to:', volume);
    }
    
    saveSettings() {
        const settings = {
            masterVolume: this.masterVolumeSlider?.value || 100,
            musicVolume: this.musicVolumeSlider?.value || 80,
            sfxVolume: this.sfxVolumeSlider?.value || 90
        };
        
        try {
            localStorage.setItem('gameSettings', JSON.stringify(settings));
            console.log('[TitleScreenUI] Settings saved');
        } catch (error) {
            console.error('[TitleScreenUI] Failed to save settings:', error);
        }
    }
    
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('gameSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                if (this.masterVolumeSlider && settings.masterVolume !== undefined) {
                    this.masterVolumeSlider.value = settings.masterVolume;
                    this.masterValueDisplay.textContent = settings.masterVolume + '%';
                    this.applyMasterVolume(settings.masterVolume / 100);
                }
                
                if (this.musicVolumeSlider && settings.musicVolume !== undefined) {
                    this.musicVolumeSlider.value = settings.musicVolume;
                    this.musicValueDisplay.textContent = settings.musicVolume + '%';
                    this.applyMusicVolume(settings.musicVolume / 100);
                }
                
                if (this.sfxVolumeSlider && settings.sfxVolume !== undefined) {
                    this.sfxVolumeSlider.value = settings.sfxVolume;
                    this.sfxValueDisplay.textContent = settings.sfxVolume + '%';
                    this.applySFXVolume(settings.sfxVolume / 100);
                }
                
                console.log('[TitleScreenUI] Settings loaded');
            }
        } catch (error) {
            console.error('[TitleScreenUI] Failed to load settings:', error);
        }
    }
    
    // ==================== PROFILE SCREEN ====================
    
    setupProfileScreen() {
        // Load saved profile data
        this.loadProfile();
        
        // Setup username input listener
        if (this.usernameInput) {
            this.usernameInput.addEventListener('input', (e) => {
                this.updateUsername(e.target.value);
            });
            
            // Save on blur
            this.usernameInput.addEventListener('blur', () => {
                this.saveProfile();
            });
        }
        
        // Setup back button (inline onclick in HTML)
        window.backToMenu = () => {
            this.hideProfile();
            this.showTitleScreen();
        };
        
        console.log('[TitleScreenUI] Profile initialized');
    }
    
    showProfile() {
        if (this.profileContainer) {
            this.profileContainer.classList.remove('hidden');
            this.profileContainer.style.display = "flex";
            console.log('[TitleScreenUI] Profile shown');
        }
    }
    
    hideProfile() {
        if (this.profileContainer) {
            this.profileContainer.classList.add('hidden');
            this.profileContainer.style.display = "none";
            console.log('[TitleScreenUI] Profile hidden');
        }
    }
    
    updateUsername(username) {
        // Trim and limit username length
        const trimmedUsername = username.trim().substring(0, 12);
        
        if (this.usernameInput && this.usernameInput.value !== trimmedUsername) {
            this.usernameInput.value = trimmedUsername;
        }
        
        console.log('[TitleScreenUI] Username updated:', trimmedUsername);
    }
    
    saveProfile() {
        const profile = {
            username: this.usernameInput?.value || 'user-name',
            avatarUrl: this.avatarImage?.src || ''
        };
        
        try {
            localStorage.setItem('userProfile', JSON.stringify(profile));
            console.log('[TitleScreenUI] Profile saved:', profile.username);
        } catch (error) {
            console.error('[TitleScreenUI] Failed to save profile:', error);
        }
    }
    
    loadProfile() {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                
                if (this.usernameInput && profile.username) {
                    this.usernameInput.value = profile.username;
                }
                
                if (this.avatarImage && profile.avatarUrl) {
                    this.avatarImage.src = profile.avatarUrl;
                }
                
                console.log('[TitleScreenUI] Profile loaded');
            } else {
                // Set default avatar
                this.setDefaultAvatar();
            }
        } catch (error) {
            console.error('[TitleScreenUI] Failed to load profile:', error);
            this.setDefaultAvatar();
        }
    }
    
    setDefaultAvatar() {
        if (this.avatarImage) {
            // Set a default avatar or placeholder
            this.avatarImage.src = './assets/characters/rukia/rukia-icon.png';
            this.avatarImage.onerror = () => {
                console.warn('[TitleScreenUI] Failed to load avatar image');
                // Set a simple colored background instead
                this.avatarImage.style.display = 'none';
                this.avatarImage.parentElement.style.background = '#8B4513';
            };
        }
    }
    
    getUsername() {
        return this.usernameInput?.value || 'Player';
    }
}

// Create singleton instance and initialize
const titleScreenUI = new TitleScreenUI();

// Export helper function to get username
export const getPlayerUsername = () => {
    return titleScreenUI.getUsername();
};

export { titleScreenUI };