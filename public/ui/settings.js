// Default settings
const defaultSettings = {
    audio: {
        master: 100,
        music: 80,
        sfx: 90
    },
    controls: {
        moveLeft: 'A',
        moveRight: 'D',
        jump: 'SPACE',
        crouch: 'S',
        lightAttack: 'J',
        heavyAttack: 'K',
        specialMove: 'L',
        blockDodge: 'SHIFT'
    }
};

// Current settings object
let currentSettings = JSON.parse(JSON.stringify(defaultSettings));

// Load saved settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('pixelFighterSettings');
    if (saved) {
        try {
            currentSettings = JSON.parse(saved);
            applySettings();
        } catch (e) {
            console.error('Error loading settings:', e);
            currentSettings = JSON.parse(JSON.stringify(defaultSettings));
        }
    }
}

// Apply settings to UI
function applySettings() {
    // Apply audio settings
    document.getElementById('masterVolume').value = currentSettings.audio.master;
    document.getElementById('musicVolume').value = currentSettings.audio.music;
    document.getElementById('sfxVolume').value = currentSettings.audio.sfx;
    
    updateVolumeDisplay('masterValue', currentSettings.audio.master);
    updateVolumeDisplay('musicValue', currentSettings.audio.music);
    updateVolumeDisplay('sfxValue', currentSettings.audio.sfx);

    // Apply control settings
    Object.keys(currentSettings.controls).forEach(action => {
        const btn = document.querySelector(`[data-action="${action}"]`);
        if (btn) {
            btn.textContent = currentSettings.controls[action];
        }
    });
}

// Update volume display
function updateVolumeDisplay(elementId, value) {
    document.getElementById(elementId).textContent = value + '%';
}

// Save settings to localStorage
function saveSettings() {
    try {
        localStorage.setItem('pixelFighterSettings', JSON.stringify(currentSettings));
        showSaveSuccess();
        console.log('Settings saved successfully!');
    } catch (e) {
        console.error('Error saving settings:', e);
        alert('Failed to save settings. Please try again.');
    }
}

// Show save success animation
function showSaveSuccess() {
    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.textContent;
    
    saveBtn.classList.add('success');
    saveBtn.textContent = 'SAVED!';
    
    setTimeout(() => {
        saveBtn.classList.remove('success');
        saveBtn.textContent = originalText;
    }, 1500);
}

// Initialize audio controls
function initAudioControls() {
    const masterSlider = document.getElementById('masterVolume');
    const musicSlider = document.getElementById('musicVolume');
    const sfxSlider = document.getElementById('sfxVolume');

    masterSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        currentSettings.audio.master = parseInt(value);
        updateVolumeDisplay('masterValue', value);
        updateSliderColor(e.target, value);
        playTestSound('sfx'); // Optional: play sound on change
    });

    musicSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        currentSettings.audio.music = parseInt(value);
        updateVolumeDisplay('musicValue', value);
        updateSliderColor(e.target, value);
    });

    sfxSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        currentSettings.audio.sfx = parseInt(value);
        updateVolumeDisplay('sfxValue', value);
        updateSliderColor(e.target, value);
        playTestSound('sfx'); // Optional: play sound on change
    });

    // Initialize slider colors
    updateSliderColor(masterSlider, masterSlider.value);
    updateSliderColor(musicSlider, musicSlider.value);
    updateSliderColor(sfxSlider, sfxSlider.value);
}

// Update slider background color based on value
function updateSliderColor(slider, value) {
    const percentage = value;
    slider.style.background = `linear-gradient(to right, #ff3333 0%, #ff3333 ${percentage}%, #333 ${percentage}%, #333 100%)`;
}

// Optional: Play test sound (implement with your audio system)
function playTestSound(type) {
    // Implement your audio system here
    // This is just a placeholder for future integration
    console.log(`Playing ${type} sound at volume:`, currentSettings.audio[type]);
}

// Key binding system
let isBinding = false;
let currentAction = null;

function initKeyBinding() {
    const keyButtons = document.querySelectorAll('.key-btn');
    const modal = document.getElementById('keyModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const bindingAction = document.getElementById('bindingAction');

    keyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isBinding) return;
            
            currentAction = btn.dataset.action;
            isBinding = true;
            
            btn.classList.add('binding');
            modal.classList.add('active');
            bindingAction.textContent = `Binding: ${btn.closest('.control-item').querySelector('.control-label').textContent}`;
            
            // Focus on window to capture keypress
            window.focus();
        });
    });

    // Cancel binding
    cancelBtn.addEventListener('click', () => {
        cancelBinding();
    });

    // Listen for key press
    window.addEventListener('keydown', (e) => {
        if (!isBinding) return;
        
        e.preventDefault();
        
        const key = getKeyName(e);
        
        // Don't allow ESC for binding (reserved for cancel)
        if (e.key === 'Escape') {
            cancelBinding();
            return;
        }

        // Check if key is already in use
        const existingAction = Object.keys(currentSettings.controls).find(
            action => currentSettings.controls[action] === key && action !== currentAction
        );

        if (existingAction) {
            if (confirm(`"${key}" is already bound to ${formatActionName(existingAction)}. Replace it?`)) {
                // Swap the keys
                const oldKey = currentSettings.controls[currentAction];
                currentSettings.controls[existingAction] = oldKey;
                updateKeyButton(existingAction, oldKey);
            } else {
                cancelBinding();
                return;
            }
        }

        // Set new key
        currentSettings.controls[currentAction] = key;
        updateKeyButton(currentAction, key);
        
        cancelBinding();
    });
}

// Get formatted key name
function getKeyName(event) {
    const key = event.key;
    const code = event.code;
    
    // Special keys mapping
    const specialKeys = {
        ' ': 'SPACE',
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'ArrowLeft': '←',
        'ArrowRight': '→',
        'Control': 'CTRL',
        'Shift': 'SHIFT',
        'Alt': 'ALT',
        'Enter': 'ENTER',
        'Escape': 'ESC',
        'Tab': 'TAB',
        'Backspace': 'BACKSPACE'
    };

    if (specialKeys[key]) {
        return specialKeys[key];
    }

    // Return uppercase letter or number
    if (key.length === 1) {
        return key.toUpperCase();
    }

    // Function keys
    if (code.startsWith('Key')) {
        return code.replace('Key', '');
    }

    if (code.startsWith('Digit')) {
        return code.replace('Digit', '');
    }

    return key.toUpperCase();
}

// Update key button display
function updateKeyButton(action, key) {
    const btn = document.querySelector(`[data-action="${action}"]`);
    if (btn) {
        btn.textContent = key;
    }
}

// Cancel key binding
function cancelBinding() {
    isBinding = false;
    currentAction = null;
    
    const modal = document.getElementById('keyModal');
    modal.classList.remove('active');
    
    document.querySelectorAll('.key-btn').forEach(btn => {
        btn.classList.remove('binding');
    });
}

// Format action name for display
function formatActionName(action) {
    return action
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}


// Back button functionality
function goBack() {
    // You can modify this to navigate to your main menu
    if (confirm('Any unsaved changes will be lost. Go back?')) {
        window.location.href = 'index.html'; // Change to your main menu page
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initAudioControls();
    initKeyBinding();

    // Back button
    document.getElementById('backBtn').addEventListener('click', goBack);

    // Save button
    document.getElementById('saveBtn').addEventListener('click', saveSettings);

    // Reset controls button
    document.getElementById('resetControls').addEventListener('click', resetControls);

    // Close modal on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !isBinding) {
            const modal = document.getElementById('keyModal');
            if (modal.classList.contains('active')) {
                cancelBinding();
            }
        }
    });

    console.log('Settings page loaded successfully!');
});

// Export settings for use in game (optional)
window.getGameSettings = function() {
    return currentSettings;
};

// Function to get actual volume values (master * specific)
window.getVolume = function(type) {
    const master = currentSettings.audio.master / 100;
    const specific = currentSettings.audio[type] / 100;
    return master * specific;
};

// Function to check if a key is pressed (for game integration)
window.isKeyBound = function(key, action) {
    return currentSettings.controls[action]?.toUpperCase() === key.toUpperCase();
};
