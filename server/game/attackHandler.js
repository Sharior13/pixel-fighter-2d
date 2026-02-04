// attackHandler.js - Server-side attack processing

const { CHARACTER_ATTACKS } = require('./attackSystem.js');

class AttackHandler {
    constructor() {
        this.activeAttacks = new Map(); // Map<attackId, attackData>
        this.attackIdCounter = 0;
    }
    
    // Initiate an attack
    initiateAttack(gameState, player, attackType) {
        const characterAttacks = CHARACTER_ATTACKS[player.character];
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
        player.attackFrame = 0;
        player.cooldowns[attackType] = attackConfig.cooldown;
        
        // Create attack instance
        const attackId = `attack_${this.attackIdCounter++}`;
        const attackData = {
            id: attackId,
            attackerId: player.socketId,
            type: attackType,
            config: attackConfig,
            startTime: Date.now(),
            currentFrame: 0,
            hitPlayers: new Set(),
            lastHitTime: new Map(),
            dashActive: false,
            dashStartPos: null,
            dashProgress: 0
        };
        
        this.activeAttacks.set(attackId, attackData);
        
        // Handle dash phase initialization
        if (attackConfig.dashPhase && attackConfig.dashPhase.enabled) {
            attackData.dashStartPos = { x: player.position.x, y: player.position.y };
        }
        
        console.log(`[AttackHandler] ${player.socketId} initiated ${attackType}`);
        
        return {
            success: true,
            attackId,
            duration: attackConfig.duration,
            animation: attackConfig.animation
        };
    }
    
    // Update all active attacks
    updateAttacks(gameState, deltaTime) {
        const attacksToRemove = [];
        
        for (const [attackId, attackData] of this.activeAttacks.entries()) {
            const attacker = gameState.players.find(p => p.socketId === attackData.attackerId);
            if (!attacker) {
                attacksToRemove.push(attackId);
                continue;
            }
            
            const elapsed = Date.now() - attackData.startTime;
            const config = attackData.config;
            
            // Calculate current frame
            const animation = require('./characterData.js').characterSpriteConfigs[attacker.character]?.animations[config.animation];
            const frameDelay = animation?.frameDelay || 100;
            attackData.currentFrame = Math.floor(elapsed / frameDelay);
            attacker.attackFrame = attackData.currentFrame;
            
            // Handle dash phase
            if (config.dashPhase && config.dashPhase.enabled && !attackData.dashComplete) {
                this.handleDashPhase(attacker, attackData, deltaTime, gameState);
            }
            
            // Check for hitbox activation
            this.checkHitboxes(gameState, attacker, attackData);
            
            // Check if attack is complete
            if (elapsed >= config.duration) {
                attacker.isAttacking = false;
                attacker.currentAttack = null;
                attacker.attackFrame = 0;
                attacksToRemove.push(attackId);
                console.log(`[AttackHandler] Attack ${attackId} completed`);
            }
        }
        
        // Clean up completed attacks
        attacksToRemove.forEach(id => this.activeAttacks.delete(id));
    }
    
    // Handle dash mechanics during attacks
    handleDashPhase(attacker, attackData, deltaTime, gameState) {
        const dashPhase = attackData.config.dashPhase;
        const currentFrame = attackData.currentFrame;
        
        if (currentFrame >= dashPhase.startFrame && currentFrame <= dashPhase.endFrame) {
            if (!attackData.dashActive) {
                attackData.dashActive = true;
                attackData.dashProgress = 0;
            }
            
            const dashSpeed = dashPhase.speed;
            const direction = attacker.facing;
            const movement = dashSpeed * direction;
            
            // Check boundaries
            const newX = attacker.position.x + movement;
            if (newX >= gameState.map.boundaries.left && newX <= gameState.map.boundaries.right) {
                attacker.position.x = newX;
                attackData.dashProgress += Math.abs(movement);
            }
            
            if (attackData.dashProgress >= dashPhase.distance) {
                attackData.dashComplete = true;
            }
        } else if (currentFrame > dashPhase.endFrame) {
            attackData.dashComplete = true;
            attackData.dashActive = false;
        }
    }
    
    // Check hitboxes for current frame
    checkHitboxes(gameState, attacker, attackData) {
        const config = attackData.config;
        const currentFrame = attackData.currentFrame;
        
        // Find hitboxes for current frame
        const activeHitboxes = config.hitboxes.filter(hb => hb.frame === currentFrame);
        
        if (activeHitboxes.length === 0) return;
        
        const now = Date.now();
        
        // Check each hitbox against all opponents
        for (const hitbox of activeHitboxes) {
            const hitboxWorld = this.getWorldHitbox(attacker, hitbox);
            
            for (const target of gameState.players) {
                // Skip self and dead players
                if (target.socketId === attacker.socketId || target.isDead) continue;
                
                // Multi-hit interval check
                if (config.multiHit) {
                    const lastHit = attackData.lastHitTime.get(target.socketId) || 0;
                    if (now - lastHit < config.hitInterval) {
                        continue;
                    }
                } else {
                    // Single hit check
                    if (attackData.hitPlayers.has(target.socketId)) {
                        continue;
                    }
                }
                
                // Check collision
                if (this.checkCollision(hitboxWorld, target)) {
                    this.applyHit(gameState, attacker, target, attackData);
                    
                    if (config.multiHit) {
                        attackData.lastHitTime.set(target.socketId, now);
                    } else {
                        attackData.hitPlayers.add(target.socketId);
                    }
                }
            }
        }
    }
    
    // Get hitbox in world coordinates
    getWorldHitbox(attacker, hitbox) {
        const direction = attacker.facing;
        return {
            x: attacker.position.x + (hitbox.x * direction),
            y: attacker.position.y + hitbox.y,
            width: hitbox.width,
            height: hitbox.height
        };
    }
    
    // Check collision between hitbox and target
    checkCollision(hitbox, target) {
        const targetBox = {
            x: target.position.x - target.size.width / 2,
            y: target.position.y - target.size.height,
            width: target.size.width,
            height: target.size.height
        };
        
        return (
            hitbox.x < targetBox.x + targetBox.width &&
            hitbox.x + hitbox.width > targetBox.x &&
            hitbox.y < targetBox.y + targetBox.height &&
            hitbox.y + hitbox.height > targetBox.y
        );
    }
    
    // Apply hit effects
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
            target.velocity.y = config.knockback.y;
            target.isGrounded = false;
            
            // Apply hitstun
            target.isStunned = true;
            target.stunEndTime = Date.now() + 200;
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
        
        return {
            targetSocketId: target.socketId,
            damage: damage,
            knockback: config.knockback,
            healthRemaining: target.health,
            blocked: target.isBlocking
        };
    }
    
    // Clear all attacks
    clear() {
        this.activeAttacks.clear();
        this.attackIdCounter = 0;
    }
    
    // Get active attack for a player
    getPlayerAttack(socketId) {
        for (const [attackId, attackData] of this.activeAttacks.entries()) {
            if (attackData.attackerId === socketId) {
                return attackData;
            }
        }
        return null;
    }
}

module.exports = { AttackHandler };