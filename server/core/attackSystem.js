const ATTACK_CONFIG = {
    luffy: {
        attack1: {
            damage: 30,
            cooldown: 2500,
            duration: 560,
            knockback: { x: 8, y: 0 },
            animation: 'attack1',
            range: 60, // Short range punch
            hitboxWidth: 40,
            hitboxHeight: 50
        },
        attack2: {
            damage: 35,
            cooldown: 3000,
            duration: 640,
            knockback: { x: 12, y: 0 },
            animation: 'attack2',
            range: 80, // Medium range kick
            hitboxWidth: 50,
            hitboxHeight: 60
        },
        basic: {
            damage: 20,
            cooldown: 1000,
            duration: 300,
            knockback: { x: 10, y: 0 },
            animation: 'attack_basic',
            range: 100, // Extended punch
            hitboxWidth: 60,
            hitboxHeight: 70
        },
        special: {
            damage: 70,
            cooldown: 10000,
            duration: 900,
            knockback: { x: 20, y: 0 },
            animation: 'attack_special',
            range: 150, // Gomu Gomu extended attack
            hitboxWidth: 80,
            hitboxHeight: 80
        },
        ultimate: {
            damage: 150,
            cooldown: 30000,
            duration: 1200,
            knockback: { x: 40, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 0,
            range: 200, // Gear Fourth range
            hitboxWidth: 100,
            hitboxHeight: 100
        }
    },
    
    zoro: {
        attack1: {
            damage: 37,
            cooldown: 2500,
            duration: 480,
            knockback: { x: 10, y: 0 },
            animation: 'attack1',
            range: 70, // Sword slash
            hitboxWidth: 50,
            hitboxHeight: 60
        },
        attack2: {
            damage: 52,
            cooldown: 3000,
            duration: 720,
            knockback: { x: 8, y: 0 },
            animation: 'attack2',
            range: 90, // Wide sword arc
            hitboxWidth: 60,
            hitboxHeight: 70
        },
        basic: {
            damage: 37,
            cooldown: 1000,
            duration: 600,
            knockback: { x: 12, y: 0 },
            animation: 'attack_basic',
            range: 110, // Three sword style
            hitboxWidth: 70,
            hitboxHeight: 80
        },
        special: {
            damage: 87,
            cooldown: 10000,
            duration: 1200,
            knockback: { x: 25, y: 0 },
            animation: 'attack_special',
            range: 160, // Oni Giri
            hitboxWidth: 90,
            hitboxHeight: 90
        },
        ultimate: {
            damage: 195,
            cooldown: 15000,
            duration: 1200,
            knockback: { x: 50, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 500,
            range: 250, // Asura attack
            hitboxWidth: 120,
            hitboxHeight: 120
        }
    },
    
    naruto: {
        attack1: {
            damage: 33,
            cooldown: 420,
            duration: 480,
            knockback: { x: 7, y: 0 },
            animation: 'attack1',
            range: 55, // Quick punch
            hitboxWidth: 35,
            hitboxHeight: 45
        },
        attack2: {
            damage: 38,
            cooldown: 580,
            duration: 640,
            knockback: { x: 9, y: 0 },
            animation: 'attack2',
            range: 65, // Spinning kick
            hitboxWidth: 45,
            hitboxHeight: 55
        },
        basic: {
            damage: 23,
            cooldown: 1100,
            duration: 480,
            knockback: { x: 15, y: 0 },
            animation: 'attack_basic',
            range: 85, // Shadow clone attack
            hitboxWidth: 55,
            hitboxHeight: 65
        },
        special: {
            damage: 73,
            cooldown: 6500,
            duration: 600,
            knockback: { x: 22, y: 0 },
            animation: 'attack_special',
            range: 120, // Rasengan
            hitboxWidth: 70,
            hitboxHeight: 70
        },
        ultimate: {
            damage: 195,
            cooldown: 28000,
            duration: 720,
            knockback: { x: 45, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 500,
            range: 180, // Rasenshuriken
            hitboxWidth: 100,
            hitboxHeight: 100
        }
    },
    
    kakashi: {
        attack1: {
            damage: 42,
            cooldown: 430,
            duration: 480,
            knockback: { x: 8, y: 0 },
            animation: 'attack1',
            range: 65, // Kunai strike
            hitboxWidth: 40,
            hitboxHeight: 50
        },
        attack2: {
            damage: 48,
            cooldown: 600,
            duration: 640,
            knockback: { x: 10, y: 0 },
            animation: 'attack2',
            range: 75, // Lightning blade thrust
            hitboxWidth: 50,
            hitboxHeight: 60
        },
        basic: {
            damage: 34,
            cooldown: 1150,
            duration: 480,
            knockback: { x: 14, y: 0 },
            animation: 'attack_basic',
            range: 95, // Chidori
            hitboxWidth: 60,
            hitboxHeight: 70
        },
        special: {
            damage: 81,
            cooldown: 8000,
            duration: 600,
            knockback: { x: 28, y: 0 },
            animation: 'attack_special',
            range: 140, // Lightning cutter
            hitboxWidth: 80,
            hitboxHeight: 80
        },
        ultimate: {
            damage: 183,
            cooldown: 35000,
            duration: 720,
            knockback: { x: 55, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 500,
            range: 200, // Kamui
            hitboxWidth: 110,
            hitboxHeight: 110
        }
    },

    sasuke: {
        attack1: {
            damage: 45,
            cooldown: 430,
            duration: 480,
            knockback: { x: 8, y: 0 },
            animation: 'attack1',
            range: 60, // Sword slash
            hitboxWidth: 40,
            hitboxHeight: 50
        },
        attack2: {
            damage: 50,
            cooldown: 600,
            duration: 640,
            knockback: { x: 10, y: 0 },
            animation: 'attack2',
            range: 70, // Kusanagi thrust
            hitboxWidth: 50,
            hitboxHeight: 60
        },
        basic: {
            damage: 35,
            cooldown: 1150,
            duration: 480,
            knockback: { x: 14, y: 0 },
            animation: 'attack_basic',
            range: 90, // Chidori
            hitboxWidth: 60,
            hitboxHeight: 70
        },
        special: {
            damage: 95,
            cooldown: 15000,
            duration: 600,
            knockback: { x: 28, y: 0 },
            animation: 'attack_special',
            range: 130, // Amaterasu
            hitboxWidth: 75,
            hitboxHeight: 75
        },
        ultimate: {
            damage: 225,
            cooldown: 35000,
            duration: 720,
            knockback: { x: 55, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 500,
            range: 190, // Susanoo attack
            hitboxWidth: 105,
            hitboxHeight: 105
        }
    },

    ichigo: {
        attack1: {
            damage: 35,
            cooldown: 430,
            duration: 480,
            knockback: { x: 8, y: 0 },
            animation: 'attack1',
            range: 75, // Zanpakuto slash
            hitboxWidth: 45,
            hitboxHeight: 55
        },
        attack2: {
            damage: 50,
            cooldown: 600,
            duration: 640,
            knockback: { x: 10, y: 0 },
            animation: 'attack2',
            range: 95, // Wide slash
            hitboxWidth: 55,
            hitboxHeight: 65
        },
        basic: {
            damage: 25,
            cooldown: 1150,
            duration: 480,
            knockback: { x: 14, y: 0 },
            animation: 'attack_basic',
            range: 115, // Bankai slash
            hitboxWidth: 65,
            hitboxHeight: 75
        },
        special: {
            damage: 95,
            cooldown: 15000,
            duration: 600,
            knockback: { x: 28, y: 0 },
            animation: 'attack_special',
            range: 150, // Getsuga Tensho
            hitboxWidth: 85,
            hitboxHeight: 85
        },
        ultimate: {
            damage: 200,
            cooldown: 35000,
            duration: 720,
            knockback: { x: 55, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 400,
            range: 220, // Final Getsuga Tensho
            hitboxWidth: 115,
            hitboxHeight: 115
        }
    },

    rukia: {
        attack1: {
            damage: 50,
            cooldown: 430,
            duration: 480,
            knockback: { x: 8, y: 0 },
            animation: 'attack1',
            range: 58, // Ice sword slash
            hitboxWidth: 38,
            hitboxHeight: 48
        },
        attack2: {
            damage: 55,
            cooldown: 600,
            duration: 640,
            knockback: { x: 10, y: 0 },
            animation: 'attack2',
            range: 68, // Ice thrust
            hitboxWidth: 48,
            hitboxHeight: 58
        },
        basic: {
            damage: 40,
            cooldown: 1150,
            duration: 480,
            knockback: { x: 14, y: 0 },
            animation: 'attack_basic',
            range: 88, // Some no mai
            hitboxWidth: 58,
            hitboxHeight: 68
        },
        special: {
            damage: 90,
            cooldown: 15000,
            duration: 600,
            knockback: { x: 28, y: 0 },
            animation: 'attack_special',
            range: 125, // Ice wave
            hitboxWidth: 72,
            hitboxHeight: 72
        },
        ultimate: {
            damage: 250,
            cooldown: 35000,
            duration: 720,
            knockback: { x: 55, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 400,
            range: 170, // Hakka no Togame
            hitboxWidth: 98,
            hitboxHeight: 98
        }
    },
};

class AttackHandler {
    constructor() {
        this.activeAttacks = new Map(); // Map<attackId, attackData>
        this.attackIdCounter = 0;
    }
    
    initiateAttack(gameState, player, attackType) {
        const characterAttacks = ATTACK_CONFIG[player.character];
        if (!characterAttacks) {
            return { success: false, reason: 'invalid_character' };
        }
        
        const attackConfig = characterAttacks[attackType];
        if (!attackConfig) {
            return { success: false, reason: 'invalid_attack' };
        }
        
        // Check cooldown
        if (player.cooldowns[attackType] > 0) {
            return { success: false, reason: 'cooldown' };
        }
        
        // Check if player can attack
        if (player.isStunned || player.isDead || player.isAttacking) {
            return { success: false, reason: 'disabled' };
        }
        
        // Set player state
        player.isAttacking = true;
        player.currentAttack = attackType;
        player.attackStartTime = Date.now();
        player.cooldowns[attackType] = attackConfig.cooldown;
        
        // Create attack instance
        const attackId = `attack_${this.attackIdCounter++}`;
        const attackData = {
            id: attackId,
            attackerId: player.socketId,
            type: attackType,
            config: attackConfig,
            startTime: Date.now(),
            hasHit: false, // Single hit only
            dashComplete: false
        };
        
        this.activeAttacks.set(attackId, attackData);
        
        console.log(`[AttackHandler] ${player.socketId} initiated ${attackType}`);
        
        return {
            success: true,
            attackId,
            duration: attackConfig.duration,
            animation: attackConfig.animation
        };
    }
    
    updateAttacks(gameState, deltaTime) {
        const attacksToRemove = [];
        
        for (const [attackId, attackData] of this.activeAttacks.entries()) {
            const attacker = gameState.players.find(p => p.socketId === attackData.attackerId);
            if (!attacker) {
                attacksToRemove.push(attackId);
                continue;
            }
            
            const elapsed = Date.now() - attackData.startTime;
            
            // Check for hit (only once per attack)
            if (!attackData.hasHit && elapsed >= 100 && elapsed < attackData.config.duration - 100) {
                this.checkHit(gameState, attacker, attackData);
            }

            // Handle ultimate dash
            if (attackData.config.dashDistance && !attackData.dashComplete && elapsed < attackData.config.duration * 0.5) {
                this.handleUltimateDash(attacker, attackData, deltaTime, gameState);
            }
            
            
            // Check if attack is complete
            if (elapsed >= attackData.config.duration) {
                attacker.isAttacking = false;
                attacker.currentAttack = null;
                attacksToRemove.push(attackId);
                console.log(`[AttackHandler] Attack ${attackId} completed`);
            }
        }
        
        // Clean up completed attacks
        attacksToRemove.forEach(id => this.activeAttacks.delete(id));
    }
    
    handleUltimateDash(attacker, attackData, deltaTime, gameState) {
        const dashDistance = attackData.config.dashDistance;
        const dashSpeed = 20; // Fixed dash speed
        const movement = dashSpeed * attacker.facing;
        
        const newX = attacker.position.x + movement;
        if (newX >= gameState.map.boundaries.left && newX <= gameState.map.boundaries.right) {
            attacker.position.x = newX;
        }
        
        // Mark dash as complete after moving the required distance
        const totalMoved = Math.abs(attacker.position.x - (attackData.startPos || attacker.position.x));
        if (!attackData.startPos) {
            attackData.startPos = attacker.position.x;
        } else if (totalMoved >= dashDistance) {
            attackData.dashComplete = true;
        }
    }
    
    checkHit(gameState, attacker, attackData) {
        const config = attackData.config;
        
        // Range-based and hitbox-based hit detection
        for (const target of gameState.players) {
            // Skip self and dead players
            if (target.socketId === attacker.socketId || target.isDead) continue;
            
            // Calculate distance between players
            const distanceX = Math.abs(attacker.position.x - target.position.x);
            const distanceY = Math.abs(attacker.position.y - target.position.y);
            
            // Check if target is in front of attacker
            const inFrontOfAttacker = (target.position.x - attacker.position.x) * attacker.facing > 0;
            
            // Use attack-specific range and hitbox
            const attackRange = config.range || 50; // Use attack's range
            const attackHitboxWidth = config.hitboxWidth || 40;
            const attackHitboxHeight = config.hitboxHeight || 50;
            
            // Calculate effective hit range based on character sizes and attack hitbox
            const horizontalRange = (attacker.size.width / 2) + (target.size.width / 2) + attackRange;
            const verticalRange = Math.max(attackHitboxHeight, target.size.height);
            
            // Check if target is within attack range and hitbox
            if (inFrontOfAttacker && distanceX <= horizontalRange && distanceY <= verticalRange / 2) {
                this.applyHit(gameState, attacker, target, attackData);
                attackData.hasHit = true; // Mark as hit (single hit only)
                console.log(`[AttackHandler] Hit detected - Range: ${attackRange}, Hitbox: ${attackHitboxWidth}x${attackHitboxHeight}`);
                break; // Only hit one target
            }
        }
    }
    
    applyHit(gameState, attacker, target, attackData) {
        const config = attackData.config;
        
        // Apply damage (reduced if blocking)
        const damage = target.isBlocking ? config.damage * 0.3 : config.damage;
        target.health -= damage;
        target.damageReceived += damage;
        
        // Apply knockback (reduced if blocking)
        if (!target.isBlocking) {
            const knockbackDir = target.position.x > attacker.position.x ? 1 : -1;
            target.velocity.x = config.knockback.x * knockbackDir;
            target.velocity.y = -Math.abs(config.knockback.y);
            target.isGrounded = false;
            
            // Apply hitstun
            target.isStunned = true;
            target.stunEndTime = Date.now() + 300;
        }
        
        // Check for death
        if (target.health <= 0) {
            target.health = 0;
            target.isDead = true;
            attacker.killCount++;
        }
        
        // Update attacker stats
        attacker.damage += damage;
        attacker.combo++;
        
        console.log(`[AttackHandler] ${attacker.socketId} hit ${target.socketId} with ${attackData.type} for ${damage.toFixed(1)} damage`);
    }
    
    clear() {
        this.activeAttacks.clear();
        this.attackIdCounter = 0;
    }
}

module.exports = { AttackHandler, ATTACK_CONFIG };