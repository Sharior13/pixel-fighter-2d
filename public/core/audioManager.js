class AudioManager {
    constructor() {
        this.sfxVolume = 0.9;
        this.musicVolume = 0.8;
        this.masterVolume = 1.0;
        
        // Audio pools for reusable sound effects
        this.sfxPool = new Map(); // Map<soundPath, Audio[]>
        this.activeMusic = null;
        this.currentMusicPath = null;
        
        // Pre-load common sounds
        this.preloadedSounds = new Map();
        
        // Volume fade intervals
        this.fadeInterval = null;
        
        console.log('[AudioManager] Initialized');
    }
    
    // ==================== VOLUME CONTROL ====================
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
        console.log(`[AudioManager] Master volume: ${this.masterVolume}`);
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.activeMusic) {
            this.activeMusic.volume = this.musicVolume * this.masterVolume;
        }
        console.log(`[AudioManager] Music volume: ${this.musicVolume}`);
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        console.log(`[AudioManager] SFX volume: ${this.sfxVolume}`);
    }
    
    updateAllVolumes() {
        if (this.activeMusic) {
            this.activeMusic.volume = this.musicVolume * this.masterVolume;
        }
    }
    
    loadSettingsFromStorage() {
        try {
            const savedSettings = localStorage.getItem('gameSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                if (settings.masterVolume !== undefined) {
                    this.setMasterVolume(settings.masterVolume / 100);
                }
                if (settings.musicVolume !== undefined) {
                    this.setMusicVolume(settings.musicVolume / 100);
                }
                if (settings.sfxVolume !== undefined) {
                    this.setSFXVolume(settings.sfxVolume / 100);
                }
                
                console.log('[AudioManager] Settings loaded from storage');
            }
        } catch (error) {
            console.error('[AudioManager] Failed to load settings:', error);
        }
    }
    
    // ==================== MUSIC PLAYBACK ====================
    
    playMusic(musicPath, loop = true, fadeIn = true) {
        // Don't restart if same music is playing
        if (this.currentMusicPath === musicPath && this.activeMusic && !this.activeMusic.paused) {
            console.log(`[AudioManager] Music already playing: ${musicPath}`);
            return;
        }
        
        // Stop current music
        this.stopMusic(fadeIn);
        
        try {
            const music = new Audio(musicPath);
            music.loop = loop;
            music.volume = fadeIn ? 0 : (this.musicVolume * this.masterVolume);
            
            music.play().then(() => {
                console.log(`[AudioManager] Playing music: ${musicPath}`);
                this.activeMusic = music;
                this.currentMusicPath = musicPath;
                
                if (fadeIn) {
                    this.fadeInMusic(music);
                }
            }).catch(error => {
                console.error('[AudioManager] Failed to play music:', error);
            });
        } catch (error) {
            console.error('[AudioManager] Error creating music audio:', error);
        }
    }
    
    stopMusic(fadeOut = true) {
        if (!this.activeMusic) return;
        
        if (fadeOut) {
            this.fadeOutMusic(this.activeMusic, () => {
                this.activeMusic = null;
                this.currentMusicPath = null;
            });
        } else {
            this.activeMusic.pause();
            this.activeMusic.currentTime = 0;
            this.activeMusic = null;
            this.currentMusicPath = null;
        }
    }
    
    fadeInMusic(music, duration = 1000) {
        const targetVolume = this.musicVolume * this.masterVolume;
        const steps = 20;
        const stepDuration = duration / steps;
        const volumeStep = targetVolume / steps;
        let currentStep = 0;
        
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }
        
        this.fadeInterval = setInterval(() => {
            currentStep++;
            music.volume = Math.min(volumeStep * currentStep, targetVolume);
            
            if (currentStep >= steps) {
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
            }
        }, stepDuration);
    }
    
    fadeOutMusic(music, onComplete, duration = 500) {
        const startVolume = music.volume;
        const steps = 10;
        const stepDuration = duration / steps;
        const volumeStep = startVolume / steps;
        let currentStep = 0;
        
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }
        
        this.fadeInterval = setInterval(() => {
            currentStep++;
            music.volume = Math.max(startVolume - (volumeStep * currentStep), 0);
            
            if (currentStep >= steps) {
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
                music.pause();
                music.currentTime = 0;
                if (onComplete) onComplete();
            }
        }, stepDuration);
    }
    
    // ==================== MAP MUSIC ====================
    
    playMapMusic(mapId) {
        const musicPath = `../assets/music/${mapId}.ogg`;
        this.playMusic(musicPath, true, true);
    }
    
    playTitleMusic() {
        this.playMusic('../assets/music/forest.ogg', true, true);
    }
    
    // ==================== CHARACTER SFX ====================
    
    playSFX(soundPath, volume = 1.0) {
        try {
            const audio = new Audio(soundPath);
            audio.volume = this.sfxVolume * this.masterVolume * volume;
            
            audio.play().catch(error => {
                console.warn(`[AudioManager] Failed to play SFX: ${soundPath}`, error);
            });
            
            return audio;
        } catch (error) {
            console.error(`[AudioManager] Error creating SFX audio: ${soundPath}`, error);
            return null;
        }
    }
    
    playCharacterSound(characterId, action) {
        const soundMap = {
            'attack1': 'attack',
            'attack2': 'attack',
            'basic': 'basic',
            'special': 'special',
            'ultimate': 'ultimate',
            'hit': 'hit',
            'jump': 'jump'
        };
        
        const soundFile = soundMap[action];
        if (!soundFile) {
            console.warn(`[AudioManager] No sound mapping for action: ${action}`);
            return;
        }
        
        const soundPath = `../assets/characters/${characterId}/${characterId}-${soundFile}.ogg`;
        this.playSFX(soundPath);
    }
    
    playAttackSound(characterId, attackType) {
        this.playCharacterSound(characterId, attackType);
    }
    
    playHitSound(characterId) {
        this.playCharacterSound(characterId, 'hit');
    }
    
    playJumpSound(characterId) {
        this.playCharacterSound(characterId, 'jump');
    }
    
    // ==================== PRELOADING ====================
    
    preloadCharacterSounds(characterId) {
        const sounds = ['attack', 'basic', 'special', 'ultimate', 'hit', 'jump'];
        
        sounds.forEach(sound => {
            const soundPath = `../assets/characters/${characterId}/${characterId}-${sound}.ogg`;
            const audio = new Audio(soundPath);
            audio.preload = 'auto';
            
            const key = `${characterId}_${sound}`;
            this.preloadedSounds.set(key, audio);
        });
        
        console.log(`[AudioManager] Preloaded sounds for: ${characterId}`);
    }
    
    unloadCharacterSounds(characterId) {
        const sounds = ['attack', 'basic', 'special', 'ultimate', 'hit', 'jump'];
        
        sounds.forEach(sound => {
            const key = `${characterId}_${sound}`;
            this.preloadedSounds.delete(key);
        });
        
        console.log(`[AudioManager] Unloaded sounds for: ${characterId}`);
    }
    
    // ==================== CLEANUP ====================
    
    stopAllSounds() {
        this.stopMusic(false);
        this.preloadedSounds.clear();
        this.sfxPool.clear();
        console.log('[AudioManager] All sounds stopped');
    }
    
    reset() {
        this.stopAllSounds();
        console.log('[AudioManager] Reset complete');
    }
}

// Create singleton instance
const audioManager = new AudioManager();

// Make globally available
if (typeof window !== 'undefined') {
    window.AudioManager = audioManager;
}

export { audioManager };