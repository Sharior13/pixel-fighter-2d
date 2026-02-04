// attackSystem.js - Complete attack configurations for all characters

const ATTACK_TYPES = {
    ATTACK1: 'attack1',
    ATTACK2: 'attack2',
    BASIC: 'basic',
    SPECIAL: 'special',
    ULTIMATE: 'ultimate'
};

const CHARACTER_ATTACKS = {
    luffy: {
        attack1: {
            id: 'gum_pistol',
            damage: 8,
            cooldown: 400,
            range: 60,
            knockback: { x: 8, y: -3 },
            duration: 560,
            hitboxes: [
                { frame: 3, x: 40, y: -50, width: 50, height: 40 },
                { frame: 4, x: 45, y: -50, width: 55, height: 40 }
            ],
            animation: 'attack1',
            priority: 1
        },
        attack2: {
            id: 'gum_whip',
            damage: 12,
            cooldown: 600,
            range: 80,
            knockback: { x: 12, y: -5 },
            duration: 640,
            hitboxes: [
                { frame: 4, x: 50, y: -60, width: 60, height: 50 },
                { frame: 5, x: 55, y: -60, width: 65, height: 50 }
            ],
            animation: 'attack2',
            priority: 2
        },
        basic: {
            id: 'gum_punch',
            damage: 15,
            cooldown: 1000,
            range: 70,
            knockback: { x: 10, y: -4 },
            duration: 300,
            hitboxes: [
                { frame: 1, x: 45, y: -55, width: 55, height: 45 },
                { frame: 2, x: 50, y: -55, width: 60, height: 45 }
            ],
            animation: 'attack_basic',
            priority: 3
        },
        special: {
            id: 'gum_gatling',
            damage: 35,
            cooldown: 6000,
            range: 90,
            knockback: { x: 20, y: -8 },
            duration: 900,
            hitboxes: [
                { frame: 3, x: 50, y: -60, width: 70, height: 60 },
                { frame: 4, x: 55, y: -60, width: 75, height: 60 },
                { frame: 5, x: 55, y: -60, width: 75, height: 60 },
                { frame: 6, x: 50, y: -60, width: 70, height: 60 }
            ],
            animation: 'attack_special',
            priority: 4,
            multiHit: true,
            hitInterval: 100
        },
        ultimate: {
            id: 'king_kong_gun',
            damage: 60,
            cooldown: 25000,
            range: 150,
            knockback: { x: 40, y: -15 },
            duration: 1200,
            hitboxes: [
                { frame: 6, x: 70, y: -80, width: 100, height: 80 },
                { frame: 7, x: 75, y: -80, width: 105, height: 80 },
                { frame: 8, x: 75, y: -80, width: 105, height: 80 }
            ],
            animation: 'attack_ultimate',
            priority: 5,
            dashPhase: {
                enabled: true,
                startFrame: 2,
                endFrame: 5,
                speed: 15,
                distance: 120
            }
        }
    },
    
    zoro: {
        attack1: {
            id: 'slash_horizontal',
            damage: 10,
            cooldown: 450,
            range: 65,
            knockback: { x: 10, y: -4 },
            duration: 480,
            hitboxes: [
                { frame: 2, x: 45, y: -55, width: 60, height: 45 },
                { frame: 3, x: 50, y: -55, width: 65, height: 45 }
            ],
            animation: 'attack1',
            priority: 1
        },
        attack2: {
            id: 'slash_vertical',
            damage: 14,
            cooldown: 650,
            range: 70,
            knockback: { x: 8, y: -8 },
            duration: 720,
            hitboxes: [
                { frame: 4, x: 45, y: -70, width: 65, height: 70 },
                { frame: 5, x: 50, y: -75, width: 65, height: 75 }
            ],
            animation: 'attack2',
            priority: 2
        },
        basic: {
            id: 'oni_giri',
            damage: 18,
            cooldown: 1200,
            range: 75,
            knockback: { x: 12, y: -5 },
            duration: 600,
            hitboxes: [
                { frame: 2, x: 50, y: -60, width: 70, height: 60 },
                { frame: 3, x: 55, y: -60, width: 75, height: 60 },
                { frame: 4, x: 55, y: -60, width: 75, height: 60 }
            ],
            animation: 'attack_basic',
            priority: 3
        },
        special: {
            id: 'tatsumaki',
            damage: 40,
            cooldown: 7000,
            range: 100,
            knockback: { x: 25, y: -10 },
            duration: 1200,
            hitboxes: [
                { frame: 5, x: 60, y: -70, width: 90, height: 70 },
                { frame: 6, x: 65, y: -70, width: 95, height: 70 },
                { frame: 7, x: 70, y: -70, width: 100, height: 70 },
                { frame: 8, x: 70, y: -70, width: 100, height: 70 },
                { frame: 9, x: 65, y: -70, width: 95, height: 70 }
            ],
            animation: 'attack_special',
            priority: 4,
            multiHit: true,
            hitInterval: 150
        },
        ultimate: {
            id: 'asura',
            damage: 70,
            cooldown: 30000,
            range: 180,
            knockback: { x: 50, y: -20 },
            duration: 1200,
            hitboxes: [
                { frame: 8, x: 80, y: -90, width: 120, height: 90 },
                { frame: 9, x: 85, y: -90, width: 125, height: 90 },
                { frame: 10, x: 85, y: -90, width: 125, height: 90 }
            ],
            animation: 'attack_ultimate',
            priority: 5,
            dashPhase: {
                enabled: true,
                startFrame: 3,
                endFrame: 7,
                speed: 18,
                distance: 150
            }
        }
    },
    
    naruto: {
        attack1: {
            id: 'punch_combo',
            damage: 9,
            cooldown: 420,
            range: 55,
            knockback: { x: 7, y: -3 },
            duration: 480,
            hitboxes: [
                { frame: 2, x: 40, y: -50, width: 50, height: 40 },
                { frame: 3, x: 45, y: -50, width: 55, height: 40 }
            ],
            animation: 'attack1',
            priority: 1
        },
        attack2: {
            id: 'kick_combo',
            damage: 11,
            cooldown: 580,
            range: 60,
            knockback: { x: 9, y: -4 },
            duration: 640,
            hitboxes: [
                { frame: 3, x: 45, y: -55, width: 60, height: 50 },
                { frame: 4, x: 50, y: -55, width: 65, height: 50 }
            ],
            animation: 'attack2',
            priority: 2
        },
        basic: {
            id: 'rasengan',
            damage: 16,
            cooldown: 1100,
            range: 65,
            knockback: { x: 15, y: -6 },
            duration: 480,
            hitboxes: [
                { frame: 2, x: 45, y: -55, width: 60, height: 55 },
                { frame: 3, x: 50, y: -55, width: 65, height: 55 },
                { frame: 4, x: 50, y: -55, width: 65, height: 55 }
            ],
            animation: 'attack_basic',
            priority: 3
        },
        special: {
            id: 'shadow_clone_barrage',
            damage: 38,
            cooldown: 6500,
            range: 95,
            knockback: { x: 22, y: -9 },
            duration: 600,
            hitboxes: [
                { frame: 2, x: 55, y: -65, width: 80, height: 65 },
                { frame: 3, x: 60, y: -65, width: 85, height: 65 },
                { frame: 4, x: 60, y: -65, width: 85, height: 65 }
            ],
            animation: 'attack_special',
            priority: 4,
            multiHit: true,
            hitInterval: 120
        },
        ultimate: {
            id: 'nine_tails_chakra',
            damage: 65,
            cooldown: 28000,
            range: 160,
            knockback: { x: 45, y: -18 },
            duration: 720,
            hitboxes: [
                { frame: 3, x: 75, y: -85, width: 110, height: 85 },
                { frame: 4, x: 80, y: -85, width: 115, height: 85 },
                { frame: 5, x: 80, y: -85, width: 115, height: 85 }
            ],
            animation: 'attack_ultimate',
            priority: 5,
            dashPhase: {
                enabled: true,
                startFrame: 1,
                endFrame: 3,
                speed: 20,
                distance: 100
            }
        }
    },
    
    kakashi: {
        attack1: {
            id: 'palm_strike',
            damage: 9,
            cooldown: 430,
            range: 58,
            knockback: { x: 8, y: -3 },
            duration: 480,
            hitboxes: [
                { frame: 2, x: 42, y: -52, width: 52, height: 42 },
                { frame: 3, x: 47, y: -52, width: 57, height: 42 }
            ],
            animation: 'attack1',
            priority: 1
        },
        attack2: {
            id: 'kunai_strike',
            damage: 11,
            cooldown: 600,
            range: 65,
            knockback: { x: 10, y: -4 },
            duration: 640,
            hitboxes: [
                { frame: 3, x: 48, y: -58, width: 62, height: 48 },
                { frame: 4, x: 52, y: -58, width: 66, height: 48 }
            ],
            animation: 'attack2',
            priority: 2
        },
        basic: {
            id: 'chidori',
            damage: 17,
            cooldown: 1150,
            range: 70,
            knockback: { x: 14, y: -5 },
            duration: 480,
            hitboxes: [
                { frame: 2, x: 48, y: -58, width: 68, height: 58 },
                { frame: 3, x: 52, y: -58, width: 72, height: 58 },
                { frame: 4, x: 52, y: -58, width: 72, height: 58 }
            ],
            animation: 'attack_basic',
            priority: 3
        },
        special: {
            id: 'lightning_blade',
            damage: 42,
            cooldown: 8000,
            range: 105,
            knockback: { x: 28, y: -12 },
            duration: 600,
            hitboxes: [
                { frame: 2, x: 58, y: -68, width: 88, height: 68 },
                { frame: 3, x: 62, y: -68, width: 92, height: 68 },
                { frame: 4, x: 62, y: -68, width: 92, height: 68 }
            ],
            animation: 'attack_special',
            priority: 4
        },
        ultimate: {
            id: 'kamui',
            damage: 75,
            cooldown: 35000,
            range: 200,
            knockback: { x: 55, y: -22 },
            duration: 720,
            hitboxes: [
                { frame: 3, x: 85, y: -95, width: 130, height: 95 },
                { frame: 4, x: 90, y: -95, width: 135, height: 95 },
                { frame: 5, x: 90, y: -95, width: 135, height: 95 }
            ],
            animation: 'attack_ultimate',
            priority: 5,
            dashPhase: {
                enabled: true,
                startFrame: 1,
                endFrame: 3,
                speed: 22,
                distance: 130
            }
        }
    }
};

module.exports = { ATTACK_TYPES, CHARACTER_ATTACKS };