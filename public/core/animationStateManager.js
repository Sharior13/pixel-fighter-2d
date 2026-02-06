class AnimationStateManager {
    // Animation categories for clarity
    static ANIMATIONS = {
        // Match end states
        VICTORY: 'victory',
        DEFEAT: 'defeat',
        
        // Combat states
        ATTACK_BASIC: 'attack_basic',
        ATTACK_SPECIAL: 'attack_special',
        ATTACK_ULTIMATE: 'attack_ultimate',
        ATTACK_1: 'attack1',
        ATTACK_2: 'attack2',
        HIT: 'hit',
        BLOCK: 'block',
        
        // Movement states
        DASH: 'dash',
        JUMP: 'jump',
        WALK: 'walk',
        
        // Default
        IDLE: 'idle'
    };

    // Animations that must complete before transitioning
    static NON_INTERRUPTIBLE = new Set([
        'attack_basic',
        'attack_special',
        'attack_ultimate',
        'attack1',
        'attack2',
        'hit',
        'defeat'
    ]);

    // Attack type to animation mapping
    static ATTACK_MAP = {
        'attack1': 'attack1',
        'attack2': 'attack2',
        'basic': 'attack_basic',
        'special': 'attack_special',
        'ultimate': 'attack_ultimate'
    };

    // Constants for movement detection
    static MOVEMENT_THRESHOLD = 0.5;
    static GROUNDED_VELOCITY_THRESHOLD = 0.1;

    constructor() {
        this.playerAnimators = new Map(); // Map<socketId, animator>
        this.playerStates = new Map();    // Map<socketId, AnimationState>
        this.previousFrameData = new Map(); // Map<socketId, FrameData>
    }

    registerPlayer(socketId, animator) {
        if (!socketId || !animator) {
            console.error('[AnimationStateManager] Invalid registration parameters');
            return;
        }

        this.playerAnimators.set(socketId, animator);
        
        this.playerStates.set(socketId, {
            current: AnimationStateManager.ANIMATIONS.IDLE,
            previous: null
        });
        
        this.previousFrameData.set(socketId, {
            isGrounded: true,
            velocityY: 0,
            velocityX: 0,
            isDashing: false,
            isBlocking: false,
            isAttacking: false
        });
        
        console.log(`[AnimationStateManager] Registered player: ${socketId}`);
    }

    unregisterPlayer(socketId) {
        this.playerAnimators.delete(socketId);
        this.playerStates.delete(socketId);
        this.previousFrameData.delete(socketId);
        console.log(`[AnimationStateManager] Unregistered player: ${socketId}`);
    }

    updatePlayerAnimation(player, deltaTime) {
        if (!player || !player.socketId) {
            console.warn('[AnimationStateManager] Invalid player object');
            return;
        }

        const animator = this.playerAnimators.get(player.socketId);
        if (!animator) {
            console.warn(`[AnimationStateManager] No animator found for player: ${player.socketId}`);
            return;
        }
        
        const currentAnimState = this.playerStates.get(player.socketId);
        const previousFrame = this.previousFrameData.get(player.socketId);
        
        // Determine what animation should be playing
        const targetAnimation = this.determineTargetAnimation(player, previousFrame);
        
        // Check if we can transition to the new animation
        if (this.canTransitionTo(targetAnimation, currentAnimState, animator)) {
            this.transitionToAnimation(player.socketId, targetAnimation, animator, currentAnimState);
        }
        
        // Update the animator
        animator.update(deltaTime);
        
        // Store current frame data for next update
        this.updatePreviousFrameData(player, previousFrame);
    }
    
    determineTargetAnimation(player, previousFrame) {
        // PRIORITY 1: Match end states (highest priority)
        if (player.state === 'victory') {
            return AnimationStateManager.ANIMATIONS.VICTORY;
        }
        if (player.state === 'defeated') {
            return AnimationStateManager.ANIMATIONS.DEFEAT;
        }
        
        // PRIORITY 2: Combat states - Stunned/Hit
        // Check both legacy flags and state property
        if (this.isPlayerStunned(player)) {
            return AnimationStateManager.ANIMATIONS.HIT;
        }
        
        // PRIORITY 3: Combat states - Attacking
        if (this.isPlayerAttacking(player)) {
            const attackType = player.currentAttack || player.attackType;
            return AnimationStateManager.ATTACK_MAP[attackType] || AnimationStateManager.ANIMATIONS.IDLE;
        }
        
        // PRIORITY 4: Combat states - Blocking
        if (this.isPlayerBlocking(player)) {
            return AnimationStateManager.ANIMATIONS.BLOCK;
        }
        
        // PRIORITY 5: Movement states - Dashing
        if (this.isPlayerDashing(player)) {
            return AnimationStateManager.ANIMATIONS.DASH;
        }
        
        // PRIORITY 6: Movement states - Airborne
        if (!this.isPlayerGrounded(player)) {
            return AnimationStateManager.ANIMATIONS.JUMP;
        }
        
        // PRIORITY 7: Movement states - Walking
        if (this.isPlayerWalking(player)) {
            return AnimationStateManager.ANIMATIONS.WALK;
        }
        
        // DEFAULT: Idle
        return AnimationStateManager.ANIMATIONS.IDLE;
    }

    isPlayerStunned(player) {
        return player.isStunned === true || 
               player.state === 'stunned' || 
               player.state === 'hit';
    }

    isPlayerAttacking(player) {
        return player.isAttacking === true && 
               (player.currentAttack || player.attackType);
    }
 
    isPlayerBlocking(player) {
        return player.isBlocking === true;
    }

    isPlayerDashing(player) {
        return player.isDashing === true;
    }

    isPlayerGrounded(player) {
        // Explicit flag takes precedence
        if (player.isGrounded !== undefined) {
            return player.isGrounded;
        }
        
        // Fallback: check velocity
        const velocityY = player.velocity?.y || 0;
        return Math.abs(velocityY) < AnimationStateManager.GROUNDED_VELOCITY_THRESHOLD;
    }

    isPlayerWalking(player) {
        const velocityX = player.velocity?.x || 0;
        return Math.abs(velocityX) > AnimationStateManager.MOVEMENT_THRESHOLD;
    }

    canTransitionTo(targetAnimation, currentAnimState, animator) {
        // No transition needed if already playing target
        if (targetAnimation === currentAnimState.current) {
            return false;
        }
        
        // Check if current animation must finish
        const isNonInterruptible = AnimationStateManager.NON_INTERRUPTIBLE.has(currentAnimState.current);
        
        if (isNonInterruptible) {
            // Can only transition if animation is finished
            return animator.isAnimationFinished();
        }
        
        // Can always interrupt interruptible animations
        return true;
    }

    transitionToAnimation(socketId, targetAnimation, animator, currentAnimState) {
        animator.setAnimation(targetAnimation, true);
        
        console.log(
            `[AnimationState] ${socketId}: ${currentAnimState.current} -> ${targetAnimation}`
        );
        
        currentAnimState.previous = currentAnimState.current;
        currentAnimState.current = targetAnimation;
    }

    updatePreviousFrameData(player, previousFrame) {
        previousFrame.isGrounded = this.isPlayerGrounded(player);
        previousFrame.velocityY = player.velocity?.y || 0;
        previousFrame.velocityX = player.velocity?.x || 0;
        previousFrame.isDashing = player.isDashing || false;
        previousFrame.isBlocking = player.isBlocking || false;
        previousFrame.isAttacking = player.isAttacking || false;
    }
    
    getPlayerAnimator(socketId) {
        return this.playerAnimators.get(socketId) || null;
    }
    
    getPlayerAnimationState(socketId) {
        return this.playerStates.get(socketId) || null;
    }
    
    forceAnimation(socketId, animationName, reset = true) {
        const animator = this.playerAnimators.get(socketId);
        if (!animator) {
            console.warn(`[AnimationStateManager] Cannot force animation: No animator for ${socketId}`);
            return;
        }
        
        animator.setAnimation(animationName, reset);
        
        const state = this.playerStates.get(socketId);
        if (state) {
            state.previous = state.current;
            state.current = animationName;
            console.log(`[AnimationState] ${socketId}: Forced animation -> ${animationName}`);
        }
    }
 
    clear() {
        this.playerAnimators.clear();
        this.playerStates.clear();
        this.previousFrameData.clear();
        console.log('[AnimationStateManager] Cleared all players');
    }

    getDebugInfo(socketId) {
        return {
            hasAnimator: this.playerAnimators.has(socketId),
            state: this.playerStates.get(socketId),
            previousFrame: this.previousFrameData.get(socketId)
        };
    }
}

// Create singleton instance
const animationStateManager = new AnimationStateManager();

export { AnimationStateManager, animationStateManager };