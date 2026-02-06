const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    ArrowLeft: false, // attack1
    ArrowRight: false, // attack2
    ArrowUp: false, // basic
    ArrowDown: false, // special
    v: false, // ultimate
    Shift: false,
    ' ': false
};

const actionTriggered = {
    jump: false,
    dash: false,
    attack1: false,
    attack2: false,
    basic: false,
    special: false,
    ultimate: false,
    block: false
};

// Normalize key to lowercase (except for special keys and arrow keys)
function normalizeKey(key) {
    // Don't normalize arrow keys, space, or Shift
    if (key === ' ' || key === 'Shift' || key.startsWith('Arrow')) {
        return key;
    }
    return key.toLowerCase();
}

// Handle player inputs
window.addEventListener('keydown', (event) => {
    const normalizedKey = normalizeKey(event.key);
    if (normalizedKey in keys) {
        keys[normalizedKey] = true;
    }
});

window.addEventListener('keyup', (event) => {
    const normalizedKey = normalizeKey(event.key);
    if (normalizedKey in keys) {
        keys[normalizedKey] = false;

        // Reset action triggers
        if (normalizedKey === 'w' || normalizedKey === ' ') {
            actionTriggered.jump = false;
        }
        if (normalizedKey === 'Shift') {
            actionTriggered.dash = false;
        }
        if (normalizedKey === 'ArrowLeft') actionTriggered.attack1 = false;
        if (normalizedKey === 'ArrowRight') actionTriggered.attack2 = false;
        if (normalizedKey === 'ArrowUp') actionTriggered.basic = false;
        if (normalizedKey === 'ArrowDown') actionTriggered.special = false;
        if (normalizedKey === 'v') actionTriggered.ultimate = false;
    }
});

window.addEventListener('blur', () => {
    // Reset all keys
    Object.keys(keys).forEach(key => {
        keys[key] = false;
    });
    
    // Reset all action triggers
    Object.keys(actionTriggered).forEach(action => {
        actionTriggered[action] = false;
    });
});

export { keys, actionTriggered };