const characterSpriteConfigs = {
    luffy: {
        name: 'Luffy',
        frameWidth: 96,
        frameHeight: 96,
        layout: 'horizontal',
        scale: 4,
        
        spriteSheets: {
            main: '../assets/characters/luffy/luffy-idle.png',
            walk: '../assets/characters/luffy/luffy-walk.png',
            jump: '../assets/characters/luffy/luffy-jump.png',
            hit: '../assets/characters/luffy/luffy-hit.png',
            dash: '../assets/characters/luffy/luffy-dash.png',
            block: '../assets/characters/luffy/luffy-block.png',
            defeat: '../assets/characters/luffy/luffy-lose.png',
            victory: '../assets/characters/luffy/luffy-win.png',
            attack1: '../assets/characters/luffy/luffy-attack1.png',
            attack2: '../assets/characters/luffy/luffy-attack2.png',
            attack_basic:   '../assets/characters/luffy/luffy-basic.png',
            attack_special: '../assets/characters/luffy/luffy-special.png',
            attack_ultimate: '../assets/characters/luffy/luffy-ultimate.png'
        },
        
        animations: {
            idle: {
                sheet: 'main',
                startFrame: 0,
                frames: 6,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            walk: {
                sheet: 'walk',
                startFrame: 0,
                frames: 8,
                frameDelay: 80,
                loop: true,
                row: 0
            },
            dash: {
                sheet: 'dash',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            jump: {
                sheet: 'jump',  
                startFrame: 0,
                frames: 9,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            fall: {
                sheet: 'jump', 
                startFrame: 4,
                frames: 5,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            attack1: {
                sheet: 'attack1', 
                startFrame: 0,
                frames: 7,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack2: {
                sheet: 'attack2', 
                startFrame: 0,
                frames: 8,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_basic: {
                sheet: 'attack_basic', 
                startFrame: 0,
                frames: 3,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            attack_special: {
                sheet: 'attack_special',
                startFrame: 0,
                frames: 9,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            attack_ultimate: {
                sheet: 'attack_ultimate',
                startFrame: 0,
                frames: 10,
                frameDelay: 120,
                loop: false,
                row: 0
            },
            hit: {
                sheet: 'hit',
                startFrame: 0,
                frames: 4,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            block: {
                sheet: 'block',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            victory: {
                sheet: 'victory',
                startFrame: 0,
                frames: 4,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            defeat: {
                sheet: 'defeat',
                startFrame: 0,
                frames: 4,
                frameDelay: 150,
                loop: false,
                row: 0
            }
        }
    },
    
    zoro: {
        name: 'Zoro',
        frameWidth: 96,
        frameHeight: 96,
        layout: 'horizontal',
        scale: 3.5,
        
        spriteSheets: {
            main: '../assets/characters/zoro/zoro-idle.png',
            walk: '../assets/characters/zoro/zoro-walk.png',
            jump: '../assets/characters/zoro/zoro-jump.png',
            hit: '../assets/characters/zoro/zoro-hit.png',
            dash: '../assets/characters/zoro/zoro-dash.png',
            block: '../assets/characters/zoro/zoro-block.png',
            defeat: '../assets/characters/zoro/zoro-lose.png',
            victory: '../assets/characters/zoro/zoro-win.png',
            attack1: '../assets/characters/zoro/zoro-attack1.png',
            attack2: '../assets/characters/zoro/zoro-attack2.png',
            attack_basic: '../assets/characters/zoro/zoro-basic.png',
            attack_special: '../assets/characters/zoro/zoro-special.png',
            attack_ultimate: '../assets/characters/zoro/zoro-ultimate.png'
        },
        
        animations: {
            idle: {
                sheet: 'main',
                startFrame: 0,
                frames: 4,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            walk: {
                sheet: 'walk',
                startFrame: 0,
                frames: 8,
                frameDelay: 80,
                loop: true,
                row: 0
            },
            dash: {
                sheet: 'dash',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            jump: {
                sheet: 'jump',  
                startFrame: 0,
                frames: 6,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            fall: {
                sheet: 'jump', 
                startFrame: 3,
                frames: 3,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            attack1: {
                sheet: 'attack1', 
                startFrame: 0,
                frames: 6,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack2: {
                sheet: 'attack2', 
                startFrame: 0,
                frames: 9,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_basic: {
                sheet: 'attack_basic', 
                startFrame: 0,
                frames: 6,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            attack_special: {
                sheet: 'attack_special',
                startFrame: 0,
                frames: 15,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_ultimate: {
                sheet: 'attack_ultimate',
                startFrame: 0,
                frames: 15,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            hit: {
                sheet: 'hit',
                startFrame: 0,
                frames: 4,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            block: {
                sheet: 'block',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            victory: {
                sheet: 'victory',
                startFrame: 0,
                frames: 6,
                frameDelay: 150,
                loop: false,
                row: 0
            },
            defeat: {
                sheet: 'defeat',
                startFrame: 0,
                frames: 5,
                frameDelay: 150,
                loop: false,
                row: 0
            }
        }
    },
    
    naruto: {
        name: 'Naruto',
        frameWidth: 96,
        frameHeight: 96,
        layout: 'horizontal',
        scale: 3.5,
        
        spriteSheets: {
            main: '../assets/characters/naruto/naruto-idle.png',
            walk: '../assets/characters/naruto/naruto-walk.png',
            jump: '../assets/characters/naruto/naruto-jump.png',
            hit: '../assets/characters/naruto/naruto-hit.png',
            dash: '../assets/characters/naruto/naruto-dash.png',
            block: '../assets/characters/naruto/naruto-block.png',
            defeat: '../assets/characters/naruto/naruto-lose.png',
            victory: '../assets/characters/naruto/naruto-win.png',
            attack1: '../assets/characters/naruto/naruto-attack1.png',
            attack2: '../assets/characters/naruto/naruto-attack2.png',
            attack_basic: '../assets/characters/naruto/naruto-basic.png',
            attack_special: '../assets/characters/naruto/naruto-special.png',
            attack_ultimate: '../assets/characters/naruto/naruto-ultimate.png'
        },
        
        animations: {
            idle: {
                sheet: 'main',
                startFrame: 0,
                frames: 4,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            walk: {
                sheet: 'walk',
                startFrame: 0,
                frames: 8,
                frameDelay: 80,
                loop: true,
                row: 0
            },
            dash: {
                sheet: 'dash',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            jump: {
                sheet: 'jump',  
                startFrame: 0,
                frames: 8,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            fall: {
                sheet: 'jump', 
                startFrame: 3,
                frames: 3,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            attack1: {
                sheet: 'attack1', 
                startFrame: 0,
                frames: 7,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack2: {
                sheet: 'attack2', 
                startFrame: 0,
                frames: 11,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_basic: {
                sheet: 'attack_basic', 
                startFrame: 0,
                frames: 4,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            attack_special: {
                sheet: 'attack_special',
                startFrame: 0,
                frames: 10,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            attack_ultimate: {
                sheet: 'attack_ultimate',
                startFrame: 0,
                frames: 17,
                frameDelay: 120,
                loop: false,
                row: 0
            },
            hit: {
                sheet: 'hit',
                startFrame: 0,
                frames: 4,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            block: {
                sheet: 'block',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            victory: {
                sheet: 'victory',
                startFrame: 0,
                frames: 6,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            defeat: {
                sheet: 'defeat',
                startFrame: 0,
                frames: 6,
                frameDelay: 150,
                loop: false,
                row: 0
            }
        }
    },
    
    kakashi: {
        name: 'Kakashi',
        frameWidth: 96,
        frameHeight: 96,
        layout: 'horizontal',
        scale: 3.5,
        
        spriteSheets: {
            main: '../assets/characters/kakashi/kakashi-idle.png',
            walk: '../assets/characters/kakashi/kakashi-walk.png',
            jump: '../assets/characters/kakashi/kakashi-jump.png',
            hit: '../assets/characters/kakashi/kakashi-hit.png',
            dash: '../assets/characters/kakashi/kakashi-dash.png',
            block: '../assets/characters/kakashi/kakashi-block.png',
            defeat: '../assets/characters/kakashi/kakashi-lose.png',
            victory: '../assets/characters/kakashi/kakashi-win.png',
            attack1: '../assets/characters/kakashi/kakashi-attack1.png',
            attack2: '../assets/characters/kakashi/kakashi-attack2.png',
            attack_basic: '../assets/characters/kakashi/kakashi-basic.png',
            attack_special: '../assets/characters/kakashi/kakashi-special.png',
            attack_ultimate: '../assets/characters/kakashi/kakashi-ultimate.png'
        },
        
        animations: {
            idle: {
                sheet: 'main',
                startFrame: 0,
                frames: 4,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            walk: {
                sheet: 'walk',
                startFrame: 0,
                frames: 8,
                frameDelay: 80,
                loop: true,
                row: 0
            },
            dash: {
                sheet: 'dash',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            jump: {
                sheet: 'jump',  
                startFrame: 0,
                frames: 9,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            fall: {
                sheet: 'jump', 
                startFrame: 3,
                frames: 3,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            attack1: {
                sheet: 'attack1', 
                startFrame: 0,
                frames: 6,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack2: {
                sheet: 'attack2', 
                startFrame: 0,
                frames: 8,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_basic: {
                sheet: 'attack_basic', 
                startFrame: 0,
                frames: 4,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_special: {
                sheet: 'attack_special',
                startFrame: 0,
                frames: 14,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            attack_ultimate: {
                sheet: 'attack_ultimate',
                startFrame: 0,
                frames: 16,
                frameDelay: 120,
                loop: false,
                row: 0
            },
            hit: {
                sheet: 'hit',
                startFrame: 0,
                frames: 4,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            block: {
                sheet: 'block',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            victory: {
                sheet: 'victory',
                startFrame: 0,
                frames: 6,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            defeat: {
                sheet: 'defeat',
                startFrame: 0,
                frames: 10,
                frameDelay: 150,
                loop: false,
                row: 0
            }
        }
    },

    sasuke: {
        name: 'Sasuke',
        frameWidth: 96,
        frameHeight: 96,
        layout: 'horizontal',
        scale: 3.5,
        
        spriteSheets: {
            main: '../assets/characters/sasuke/sasuke-idle.png',
            walk: '../assets/characters/sasuke/sasuke-walk.png',
            jump: '../assets/characters/sasuke/sasuke-jump.png',
            hit: '../assets/characters/sasuke/sasuke-hit.png',
            dash: '../assets/characters/sasuke/sasuke-dash.png',
            block: '../assets/characters/sasuke/sasuke-block.png',
            defeat: '../assets/characters/sasuke/sasuke-lose.png',
            victory: '../assets/characters/sasuke/sasuke-win.png',
            attack1: '../assets/characters/sasuke/sasuke-attack1.png',
            attack2: '../assets/characters/sasuke/sasuke-attack2.png',
            attack_basic: '../assets/characters/sasuke/sasuke-basic.png',
            attack_special: '../assets/characters/sasuke/sasuke-special.png',
            attack_ultimate: '../assets/characters/sasuke/sasuke-ultimate.png'
        },
        
        animations: {
            idle: {
                sheet: 'main',
                startFrame: 0,
                frames: 4,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            walk: {
                sheet: 'walk',
                startFrame: 0,
                frames: 7,
                frameDelay: 80,
                loop: true,
                row: 0
            },
            dash: {
                sheet: 'dash',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            jump: {
                sheet: 'jump',  
                startFrame: 0,
                frames: 9,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            fall: {
                sheet: 'jump', 
                startFrame: 3,
                frames: 3,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            attack1: {
                sheet: 'attack1', 
                startFrame: 0,
                frames: 9,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack2: {
                sheet: 'attack2', 
                startFrame: 0,
                frames: 7,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_basic: {
                sheet: 'attack_basic', 
                startFrame: 0,
                frames: 6,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_special: {
                sheet: 'attack_special',
                startFrame: 0,
                frames: 10,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            attack_ultimate: {
                sheet: 'attack_ultimate',
                startFrame: 0,
                frames: 9,
                frameDelay: 120,
                loop: false,
                row: 0
            },
            hit: {
                sheet: 'hit',
                startFrame: 0,
                frames: 4,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            block: {
                sheet: 'block',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            victory: {
                sheet: 'victory',
                startFrame: 0,
                frames: 5,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            defeat: {
                sheet: 'defeat',
                startFrame: 0,
                frames: 6,
                frameDelay: 150,
                loop: false,
                row: 0
            }
        }
    },

    ichigo: {
        name: 'Ichigo',
        frameWidth: 96,
        frameHeight: 96,
        layout: 'horizontal',
        scale: 3.5,
        
        spriteSheets: {
            main: '../assets/characters/ichigo/ichigo-idle.png',
            walk: '../assets/characters/ichigo/ichigo-walk.png',
            jump: '../assets/characters/ichigo/ichigo-jump.png',
            hit: '../assets/characters/ichigo/ichigo-hit.png',
            dash: '../assets/characters/ichigo/ichigo-dash.png',
            block: '../assets/characters/ichigo/ichigo-block.png',
            defeat: '../assets/characters/ichigo/ichigo-lose.png',
            victory: '../assets/characters/ichigo/ichigo-win.png',
            attack1: '../assets/characters/ichigo/ichigo-attack1.png',
            attack2: '../assets/characters/ichigo/ichigo-attack2.png',
            attack_basic: '../assets/characters/ichigo/ichigo-basic.png',
            attack_special: '../assets/characters/ichigo/ichigo-special.png',
            attack_ultimate: '../assets/characters/ichigo/ichigo-ultimate.png'
        },
        
        animations: {
            idle: {
                sheet: 'main',
                startFrame: 0,
                frames: 4,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            walk: {
                sheet: 'walk',
                startFrame: 0,
                frames: 8,
                frameDelay: 80,
                loop: true,
                row: 0
            },
            dash: {
                sheet: 'dash',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            jump: {
                sheet: 'jump',  
                startFrame: 0,
                frames: 9,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            fall: {
                sheet: 'jump', 
                startFrame: 3,
                frames: 3,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            attack1: {
                sheet: 'attack1', 
                startFrame: 0,
                frames: 6,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack2: {
                sheet: 'attack2', 
                startFrame: 0,
                frames: 8,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_basic: {
                sheet: 'attack_basic', 
                startFrame: 0,
                frames: 4,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_special: {
                sheet: 'attack_special',
                startFrame: 0,
                frames: 8,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            attack_ultimate: {
                sheet: 'attack_ultimate',
                startFrame: 0,
                frames: 12,
                frameDelay: 120,
                loop: false,
                row: 0
            },
            hit: {
                sheet: 'hit',
                startFrame: 0,
                frames: 4,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            block: {
                sheet: 'block',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            victory: {
                sheet: 'victory',
                startFrame: 0,
                frames: 7,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            defeat: {
                sheet: 'defeat',
                startFrame: 0,
                frames: 5,
                frameDelay: 150,
                loop: false,
                row: 0
            }
        }
    },

    rukia: {
        name: 'Rukia',
        frameWidth: 96,
        frameHeight: 96,
        layout: 'horizontal',
        scale: 3.5,
        
        spriteSheets: {
            main: '../assets/characters/rukia/rukia-idle.png',
            walk: '../assets/characters/rukia/rukia-walk.png',
            jump: '../assets/characters/rukia/rukia-jump.png',
            hit: '../assets/characters/rukia/rukia-hit.png',
            dash: '../assets/characters/rukia/rukia-dash.png',
            block: '../assets/characters/rukia/rukia-block.png',
            defeat: '../assets/characters/rukia/rukia-lose.png',
            victory: '../assets/characters/rukia/rukia-win.png',
            attack1: '../assets/characters/rukia/rukia-attack1.png',
            attack2: '../assets/characters/rukia/rukia-attack2.png',
            attack_basic: '../assets/characters/rukia/rukia-basic.png',
            attack_special: '../assets/characters/rukia/rukia-special.png',
            attack_ultimate: '../assets/characters/rukia/rukia-ultimate.png'
        },
        
        animations: {
            idle: {
                sheet: 'main',
                startFrame: 0,
                frames: 4,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            walk: {
                sheet: 'walk',
                startFrame: 0,
                frames: 6,
                frameDelay: 80,
                loop: true,
                row: 0
            },
            dash: {
                sheet: 'dash',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            jump: {
                sheet: 'jump',  
                startFrame: 0,
                frames: 8,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            fall: {
                sheet: 'jump', 
                startFrame: 3,
                frames: 3,
                frameDelay: 100,
                loop: true,
                row: 0
            },
            attack1: {
                sheet: 'attack1', 
                startFrame: 0,
                frames: 6,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack2: {
                sheet: 'attack2', 
                startFrame: 0,
                frames: 8,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_basic: {
                sheet: 'attack_basic', 
                startFrame: 0,
                frames: 5,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            attack_special: {
                sheet: 'attack_special',
                startFrame: 0,
                frames: 12,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            attack_ultimate: {
                sheet: 'attack_ultimate',
                startFrame: 0,
                frames: 10,
                frameDelay: 150,
                loop: false,
                row: 0
            },
            hit: {
                sheet: 'hit',
                startFrame: 0,
                frames: 4,
                frameDelay: 80,
                loop: false,
                row: 0
            },
            block: {
                sheet: 'block',
                startFrame: 0,
                frames: 2,
                frameDelay: 100,
                loop: false,
                row: 0
            },
            victory: {
                sheet: 'victory',
                startFrame: 0,
                frames: 4,
                frameDelay: 150,
                loop: true,
                row: 0
            },
            defeat: {
                sheet: 'defeat',
                startFrame: 0,
                frames: 6,
                frameDelay: 150,
                loop: false,
                row: 0
            }
        }
    }
};

export { characterSpriteConfigs };