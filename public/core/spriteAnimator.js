class SpriteAnimator {
    constructor(spriteSheets, config) {
        this.spriteSheets = spriteSheets;
        this.config = config;
        this.currentAnimation = 'idle';
        this.currentFrame = 0;
        this.frameTimer = 0;

        //track loading across all images
        this._totalSheets = Object.keys(spriteSheets).length;
        this._loadedCount = 0;
        this.isLoaded = false;

        Object.entries(this.spriteSheets).forEach(([name, img]) => {
            if (img.complete && img.naturalWidth !== 0) {
                this._loadedCount++;
            } else {
                img.onload = () => {
                    this._loadedCount++;
                    if (this._loadedCount >= this._totalSheets) {
                        this.isLoaded = true;
                        console.log(`[SpriteAnimator] All sheets loaded: ${this.config.name}`);
                    }
                };
                img.onerror = () => {
                    console.error(`[SpriteAnimator] Failed to load sheet "${name}" for: ${this.config.name}`);
                };
            }
        });

        if (this._loadedCount >= this._totalSheets) {
            this.isLoaded = true;
        }
    }
    
    update(deltaTime) {
        if (!this.isLoaded) return;
        
        const animation = this.config.animations[this.currentAnimation];
        if (!animation) {
            console.warn(`[SpriteAnimator] Animation not found: ${this.currentAnimation}`);
            return;
        }
        
        this.frameTimer += deltaTime;
        
        if (this.frameTimer >= animation.frameDelay) {
            this.frameTimer = 0;
            this.currentFrame++;
            
            if (this.currentFrame >= animation.frames) {
                if (animation.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = animation.frames - 1;
                    if (animation.onComplete) {
                        animation.onComplete();
                    }
                }
            }
        }
    }
    
    setAnimation(animationName, reset = true) {
        if (this.currentAnimation === animationName && !reset) {
            return;
        }
        
        if (!this.config.animations[animationName]) {
            console.warn(`[SpriteAnimator] Animation not found: ${animationName}`);
            return;
        }
        
        this.currentAnimation = animationName;
        if (reset) {
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }
    
    draw(ctx, x, y, facing = 1, scale = 1) {
        if (!this.isLoaded) {
            ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
            ctx.fillRect(x - 25, y - 50, 50, 50);
            return;
        }

        // Declare animation FIRST, then use it to pick the correct sheet image
        const animation = this.config.animations[this.currentAnimation];
        if (!animation) return;

        const sheet = this.spriteSheets[animation.sheet || 'main'];
        if (!sheet) {
            console.warn(`[SpriteAnimator] Sheet "${animation.sheet || 'main'}" not found for animation "${this.currentAnimation}"`);
            return;
        }
        
        const frameWidth = this.config.frameWidth;
        const frameHeight = this.config.frameHeight;
        
        let sourceX, sourceY;
        
        if (this.config.layout === 'horizontal') {
            sourceX = (animation.startFrame + this.currentFrame) * frameWidth;
            sourceY = animation.row * frameHeight;
        } else if (this.config.layout === 'vertical') {
            sourceX = animation.column * frameWidth;
            sourceY = (animation.startFrame + this.currentFrame) * frameHeight;
        } else {
            // Grid layout
            const totalColumns = this.config.columns || 1;
            const absoluteFrame = animation.startFrame + this.currentFrame;
            sourceX = (absoluteFrame % totalColumns) * frameWidth;
            sourceY = Math.floor(absoluteFrame / totalColumns) * frameHeight;
        }
        
        const destWidth = frameWidth * scale;
        const destHeight = frameHeight * scale;
        const destX = x - (destWidth / 2);
        const destY = y - destHeight;
        
        ctx.save();
        
        if (facing < 0) {
            ctx.translate(x, y);
            ctx.scale(-1, 1);
            ctx.translate(-x, -y);
        }
        
        ctx.imageSmoothingEnabled = false;
        
        ctx.drawImage(
            sheet,
            sourceX, sourceY, frameWidth, frameHeight,
            destX, destY, destWidth, destHeight
        );
        
        ctx.restore();
    }
    
    getCurrentAnimation() {
        return this.currentAnimation;
    }
    
    isAnimationFinished() {
        const animation = this.config.animations[this.currentAnimation];
        if (!animation || animation.loop) return false;
        return this.currentFrame >= animation.frames - 1;
    }
}

class SpriteManager {
    constructor() {
        this.sprites = new Map();          // Map<characterId, SpriteAnimator>
        this.characterConfigs = new Map();
    }
    
    loadCharacter(characterId, config) {
        this.characterConfigs.set(characterId, config);

        const images = {};
        let loadCount = 0;
        const totalSheets = Object.keys(config.spriteSheets).length;
        
        Object.entries(config.spriteSheets).forEach(([sheetName, path]) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                loadCount++;
                if (loadCount === totalSheets) {
                    console.log(`[SpriteManager] All sheets loaded for: ${characterId}`);
                }
            };
            images[sheetName] = img;
        });
        
        // One animator per character, holds all its sheet images
        const animator = new SpriteAnimator(images, config);
        this.sprites.set(characterId, animator);   // key = characterId only
        console.log(`[SpriteManager] Loaded character: ${characterId}`);
    }
    
    getAnimator(characterId) {
        return this.sprites.get(characterId);
    }

    unloadCharacter(characterId) {
        this.sprites.delete(characterId);
        this.characterConfigs.delete(characterId);
        console.log(`[SpriteManager] Unloaded character: ${characterId}`);
    }
}

// Create singleton instance
const spriteManager = new SpriteManager();

export { SpriteAnimator, spriteManager };