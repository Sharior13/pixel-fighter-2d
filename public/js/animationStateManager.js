class AnimationStateManager {
    constructor() {
        this.playerAnimators = new Map(); // Map<socketId, animator>
        this.playerStates = new Map(); // Map<socketId, state>
        this.previousStates = new Map(); // Track previous states for transitions
    }
    
    registerPlayer(socketId, animator) {
        this.playerAnimators.set(socketId, animator);
        this.playerStates.set(socketId, {
            animation: 'idle',
            previousAnimation: null
        });
        this.previousStates.set(socketId, {
            isGrounded: true,
            velocityY: 0,
            velocityX: 0,
            isDashing: false,
            isBlocking: false
        });
        
        console.log(`[AnimationStateManager] Registered player: ${socketId}`);
    }
    
    unregisterPlayer(socketId) {
        this.playerAnimators.delete(socketId);
        this.playerStates.delete(socketId);
        this.previousStates.delete(socketId);
    }
    
    updatePlayerAnimation(player, deltaTime) {
        const animator = this.playerAnimators.get(player.socketId);
        if (!animator) return;
        
        const previousState = this.previousStates.get(player.socketId);
        
        // Determine the appropriate animation based on player state
        let targetAnimation = this.determineAnimation(player, previousState);
        
        // Get current animation info
        const currentState = this.playerStates.get(player.socketId);
        
        // Handle animation transitions
        if (targetAnimation !== currentState.animation) {
            // Check if current animation must finish before transitioning
            const mustFinish = this.mustFinishAnimation(currentState.animation);
            
            if (!mustFinish || animator.isAnimationFinished()) {
                // Transition to new animation
                animator.setAnimation(targetAnimation, true);
                currentState.previousAnimation = currentState.animation;
                currentState.animation = targetAnimation;
                
                console.log(`[AnimationState] ${player.socketId}: ${currentState.previousAnimation} -> ${targetAnimation}`);
            }
        }
        
        // Update the animator
        animator.update(deltaTime);
        
        // Update previous state for next frame
        previousState.isGrounded = this.isPlayerGrounded(player);
        previousState.velocityY = player.velocity?.y || 0;
        previousState.velocityX = player.velocity?.x || 0;
        previousState.isDashing = player.isDashing || false;
        previousState.isBlocking = player.isBlocking || false;
    }
    

    determineAnimation(player, previousState) {
        // Priority order: attack animations > movement states > idle
        
        // Check for attack states (highest priority)
        if (player.state === 'attacking') {
            if (player.currentAttack === 'ultimate') {
                return 'attack_ultimate';
            } else if (player.currentAttack === 'special') {
                return 'attack_special';
            } else {
                return 'attack_basic';
            }
        }
        
        // Check for hit/stun state
        if (player.state === 'stunned' || player.state === 'hit') {
            return 'hit';
        }
        
        // Check for blocking
        if (player.isBlocking) {
            return 'block';
        }

        if(player.isDashing){
            return 'dash';
        }
        
        // Check for victory/defeat (match end states)
        if (player.state === 'victory') {
            return 'victory';
        }
        if (player.state === 'defeated') {
            return 'defeat';
        }
        
        // Movement-based animations
        const isGrounded = this.isPlayerGrounded(player);
        const velocityY = player.velocity?.y || 0;
        const velocityX = player.velocity?.x || 0;
        const isMoving = Math.abs(velocityX) > 0.5;
        
        // Aerial states
        if (!isGrounded) {
            return 'jump'; // Moving up
        }
        
        // Ground movement
        if (isMoving) { 
            return 'walk';
        }
        
        // Default to idle
        return 'idle';
    }
    
    isPlayerGrounded(player) {
        // Check if player is at ground level or has isGrounded flag
        if (player.isGrounded !== undefined) {
            return player.isGrounded;
        }
        
        // Fallback: check if velocity Y is near zero and position is at ground
        const velocityY = player.velocity?.y || 0;
        return Math.abs(velocityY) < 0.1;
    }
    

    mustFinishAnimation(animationName) {
        // Attack animations should complete before transitioning
        const mustFinishList = [
            'attack_basic',
            'attack_special',
            'attack_ultimate',
            'hit',
            'defeat'
        ];
        
        return mustFinishList.includes(animationName);
    }

    getPlayerAnimator(socketId) {
        return this.playerAnimators.get(socketId) || null;
    }
    

    forceAnimation(socketId, animationName, reset = true) {
        const animator = this.playerAnimators.get(socketId);
        if (animator) {
            animator.setAnimation(animationName, reset);
            const state = this.playerStates.get(socketId);
            if (state) {
                state.previousAnimation = state.animation;
                state.animation = animationName;
            }
        }
    }
    
    clear() {
        this.playerAnimators.clear();
        this.playerStates.clear();
        this.previousStates.clear();
        console.log('[AnimationStateManager] Cleared all players');
    }
}

// Create singleton instance
const animationStateManager = new AnimationStateManager();

export { AnimationStateManager, animationStateManager };