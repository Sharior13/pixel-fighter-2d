const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    q: false, // attack1
    e: false, // attack2
    z: false, // basic
    x: false, // special
    c: false, // ultimate
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

// Normalize key to lowercase (except for special keys)
function normalizeKey(key) {
    if (key === ' ' || key === 'Shift') {
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
        if (normalizedKey === 'q') actionTriggered.attack1 = false;
        if (normalizedKey === 'e') actionTriggered.attack2 = false;
        if (normalizedKey === 'z') actionTriggered.basic = false;
        if (normalizedKey === 'x') actionTriggered.special = false;
        if (normalizedKey === 'c') actionTriggered.ultimate = false;
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