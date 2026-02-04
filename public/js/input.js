const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    z: false,
    x: false,
    c: false,
    Shift: false,
    ' ': false
};

const actionTriggered = {
    jump: false,
    dash: false,
    basic: false,
    special: false,
    ultimate: false,
    block: false
};

//handle player inputs
window.addEventListener('keydown',(event)=>{
    if(event.key in keys){
        keys[event.key] = true;
    }
});

window.addEventListener('keyup',(event)=>{
    if(event.key in keys){
        keys[event.key] = false;

        if(event.key === 'w' || event.key === ' '){
            actionTriggered.jump = false;
        }
        if(event.key === 'Shift'){
            actionTriggered.dash = false;
        }

        if(event.key === 'z') actionTriggered.basic = false;
        if(event.key === 'x') actionTriggered.special = false;
        if(event.key === 'c') actionTriggered.ultimate = false;
    } 
});

window.addEventListener('blur', () => {
    //reset all keys
    Object.keys(keys).forEach(key => {
        keys[key] = false;
    });
    
    //reset all action triggers
    Object.keys(actionTriggered).forEach(action => {
        actionTriggered[action] = false;
    });
});

export { keys, actionTriggered };