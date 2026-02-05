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

// Handle player inputs
window.addEventListener('keydown', (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;

        // Reset action triggers
        if (event.key === 'w' || event.key === ' ') {
            actionTriggered.jump = false;
        }
        if (event.key === 'Shift') {
            actionTriggered.dash = false;
        }
        if (event.key === 'q') actionTriggered.attack1 = false;
        if (event.key === 'e') actionTriggered.attack2 = false;
        if (event.key === 'z') actionTriggered.basic = false;
        if (event.key === 'x') actionTriggered.special = false;
        if (event.key === 'c') actionTriggered.ultimate = false;
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