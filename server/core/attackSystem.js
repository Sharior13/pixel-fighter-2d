const ATTACK_CONFIG = {
    luffy: {
        attack1: {
            damage: 8,
            cooldown: 400,
            duration: 560,
            knockback: { x: 8, y: 0 },
            animation: 'attack1'
        },
        attack2: {
            damage: 12,
            cooldown: 600,
            duration: 640,
            knockback: { x: 12, y: 0 },
            animation: 'attack2'
        },
        basic: {
            damage: 15,
            cooldown: 1000,
            duration: 300,
            knockback: { x: 10, y: 0 },
            animation: 'attack_basic'
        },
        special: {
            damage: 35,
            cooldown: 6000,
            duration: 900,
            knockback: { x: 20, y: 0 },
            animation: 'attack_special'
        },
        ultimate: {
            damage: 60,
            cooldown: 25000,
            duration: 1200,
            knockback: { x: 40, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 300
        }
    },
    
    zoro: {
        attack1: {
            damage: 10,
            cooldown: 450,
            duration: 480,
            knockback: { x: 10, y: 0 },
            animation: 'attack1'
        },
        attack2: {
            damage: 14,
            cooldown: 650,
            duration: 720,
            knockback: { x: 8, y: 0 },
            animation: 'attack2'
        },
        basic: {
            damage: 18,
            cooldown: 1200,
            duration: 600,
            knockback: { x: 12, y: 0 },
            animation: 'attack_basic'
        },
        special: {
            damage: 40,
            cooldown: 7000,
            duration: 1200,
            knockback: { x: 25, y: 0 },
            animation: 'attack_special'
        },
        ultimate: {
            damage: 70,
            cooldown: 30000,
            duration: 1200,
            knockback: { x: 50, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 500
        }
    },
    
    naruto: {
        attack1: {
            damage: 9,
            cooldown: 420,
            duration: 480,
            knockback: { x: 7, y: 0 },
            animation: 'attack1'
        },
        attack2: {
            damage: 11,
            cooldown: 580,
            duration: 640,
            knockback: { x: 9, y: 0 },
            animation: 'attack2'
        },
        basic: {
            damage: 16,
            cooldown: 1100,
            duration: 480,
            knockback: { x: 15, y: 0 },
            animation: 'attack_basic'
        },
        special: {
            damage: 38,
            cooldown: 6500,
            duration: 600,
            knockback: { x: 22, y: 0 },
            animation: 'attack_special'
        },
        ultimate: {
            damage: 65,
            cooldown: 28000,
            duration: 720,
            knockback: { x: 45, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 300
        }
    },
    
    kakashi: {
        attack1: {
            damage: 9,
            cooldown: 430,
            duration: 480,
            knockback: { x: 8, y: 0 },
            animation: 'attack1'
        },
        attack2: {
            damage: 11,
            cooldown: 600,
            duration: 640,
            knockback: { x: 10, y: 0 },
            animation: 'attack2'
        },
        basic: {
            damage: 17,
            cooldown: 1150,
            duration: 480,
            knockback: { x: 14, y: 0 },
            animation: 'attack_basic'
        },
        special: {
            damage: 42,
            cooldown: 8000,
            duration: 600,
            knockback: { x: 28, y: 0 },
            animation: 'attack_special'
        },
        ultimate: {
            damage: 75,
            cooldown: 35000,
            duration: 720,
            knockback: { x: 55, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 500
        }
    },

    sasuke: {
        attack1: {
            damage: 9,
            cooldown: 430,
            duration: 480,
            knockback: { x: 8, y: 0 },
            animation: 'attack1'
        },
        attack2: {
            damage: 11,
            cooldown: 600,
            duration: 640,
            knockback: { x: 10, y: 0 },
            animation: 'attack2'
        },
        basic: {
            damage: 17,
            cooldown: 1150,
            duration: 480,
            knockback: { x: 14, y: 0 },
            animation: 'attack_basic'
        },
        special: {
            damage: 42,
            cooldown: 8000,
            duration: 600,
            knockback: { x: 28, y: 0 },
            animation: 'attack_special'
        },
        ultimate: {
            damage: 75,
            cooldown: 35000,
            duration: 720,
            knockback: { x: 55, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 500
        }
    },

    ichigo: {
        attack1: {
            damage: 9,
            cooldown: 430,
            duration: 480,
            knockback: { x: 8, y: 0 },
            animation: 'attack1'
        },
        attack2: {
            damage: 11,
            cooldown: 600,
            duration: 640,
            knockback: { x: 10, y: 0 },
            animation: 'attack2'
        },
        basic: {
            damage: 17,
            cooldown: 1150,
            duration: 480,
            knockback: { x: 14, y: 0 },
            animation: 'attack_basic'
        },
        special: {
            damage: 42,
            cooldown: 8000,
            duration: 600,
            knockback: { x: 28, y: 0 },
            animation: 'attack_special'
        },
        ultimate: {
            damage: 75,
            cooldown: 35000,
            duration: 720,
            knockback: { x: 55, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 300
        }
    },

    rukia: {
        attack1: {
            damage: 9,
            cooldown: 430,
            duration: 480,
            knockback: { x: 8, y: 0 },
            animation: 'attack1'
        },
        attack2: {
            damage: 11,
            cooldown: 600,
            duration: 640,
            knockback: { x: 10, y: 0 },
            animation: 'attack2'
        },
        basic: {
            damage: 17,
            cooldown: 1150,
            duration: 480,
            knockback: { x: 14, y: 0 },
            animation: 'attack_basic'
        },
        special: {
            damage: 42,
            cooldown: 8000,
            duration: 600,
            knockback: { x: 28, y: 0 },
            animation: 'attack_special'
        },
        ultimate: {
            damage: 75,
            cooldown: 35000,
            duration: 720,
            knockback: { x: 55, y: 0 },
            animation: 'attack_ultimate',
            dashDistance: 300
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
            
            // Handle ultimate dash
            if (attackData.config.dashDistance && !attackData.dashComplete && elapsed < attackData.config.duration * 0.5) {
                this.handleUltimateDash(attacker, attackData, deltaTime, gameState);
            }
            
            // Check for hit (only once per attack)
            if (!attackData.hasHit && elapsed >= 100 && elapsed < attackData.config.duration - 100) {
                this.checkHit(gameState, attacker, attackData);
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
        
        // Simple range-based hit detection using player hitboxes
        for (const target of gameState.players) {
            // Skip self and dead players
            if (target.socketId === attacker.socketId || target.isDead) continue;
            
            // Calculate distance between players using their hitboxes
            const distanceX = Math.abs(attacker.position.x - target.position.x);
            const distanceY = Math.abs(attacker.position.y - target.position.y);
            
            // Check if target is in front of attacker
            const inFrontOfAttacker = (target.position.x - attacker.position.x) * attacker.facing > 0;
            
            // Hitbox-based collision (using player size.width and size.height)
            const attackRange = (attacker.size.width + target.size.width) / 2 + 50; // Add 50px attack range
            const verticalRange = Math.max(attacker.size.height, target.size.height);
            
            if (inFrontOfAttacker && distanceX <= attackRange && distanceY <= verticalRange) {
                this.applyHit(gameState, attacker, target, attackData);
                attackData.hasHit = true; // Mark as hit (single hit only)
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