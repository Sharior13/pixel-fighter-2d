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
    Shift: false
};

const actionTriggered = {
    jump: false,
    basic: false,
    special: false,
    ultimate: false,
    block: false
};

//handle player inputs
window.addEventListener('keydown',(event)=>{
    if(event.key in keys){
        keys[event.key] = true;
        
        //stop movement on window losing focus
        window.addEventListener('blur',()=>{
            keys[event.key] = false;
            Object.keys(actionTriggered).forEach(action => actionTriggered[action] = false);
        });
    }
});

window.addEventListener('keyup',(event)=>{
    if(event.key in keys){
        keys[event.key] = false;

        if(event.key === 'w' || event.key === 'ArrowUp') {
            actionTriggered.jump = false;
        }
        if(event.key === 'z') actionTriggered.basic = false;
        if(event.key === 'x') actionTriggered.special = false;
        if(event.key === 'c') actionTriggered.ultimate = false;
        if(event.key === 'Shift') actionTriggered.block = false;
    } 
});

export { keys, actionTriggered };