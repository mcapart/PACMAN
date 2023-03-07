const CLYDE_STOP_RIGHT = 0;
const CLYDE_EAT_RIGHT = 1;
const CLYDE_STOP_LEFT = 2;
const CLYDE_EAT_LEFT = 3;
const CLYDE_STOP_UP = 4;
const CLYDE_EAT_UP = 5;
const CLYDE_STOP_DOWN = 6;
const CLYDE_EAT_DOWN = 7;
const CLYDE_SCARED = 8;
const CLYDE_DEAD = 9;



class Clyde{

    constructor(){
        var t = new Texture("././img/ghosts_sprites.png");
        this.sprite = new Sprite( (448/2) - 48 + 64 , (544/2) - 8, 32, 32, 16, t);
        this.sprite.setCollisionBox([8, 8], [23, 23])
        this.speed = 2.5; // In pixels per frame
    }

    addAnimations(){
        // Add full stop RIGHT
        this.sprite.addAnimation();
        this.sprite.addKeyframe(CLYDE_STOP_RIGHT, [0, 128, 32, 32]);

        this.sprite.addAnimation();
        this.sprite.addKeyframe(CLYDE_EAT_RIGHT, [0, 128, 32, 32]);
        this.sprite.addKeyframe(CLYDE_EAT_RIGHT, [32, 128, 32, 32]);

        // Add movement LEFT
        this.sprite.addAnimation();
        this.sprite.addKeyframe(CLYDE_STOP_LEFT, [64, 128, 32, 32])

        this.sprite.addAnimation();
        this.sprite.addKeyframe(CLYDE_EAT_LEFT, [64, 128, 32, 32]);
        this.sprite.addKeyframe(CLYDE_EAT_LEFT, [96, 128, 32, 32]);

        // Add movement UP
        this.sprite.addAnimation();
        this.sprite.addKeyframe(CLYDE_STOP_UP, [128, 128, 32, 32])

        this.sprite.addAnimation();
        this.sprite.addKeyframe(CLYDE_EAT_UP, [128, 128, 32, 32]);
        this.sprite.addKeyframe(CLYDE_EAT_UP, [160, 128, 32, 32]);

        // Add movement DOWN
        this.sprite.addAnimation();
        this.sprite.addKeyframe(CLYDE_STOP_DOWN, [0, 160, 32, 32])


        this.sprite.addAnimation();
        this.sprite.addKeyframe(CLYDE_EAT_DOWN, [0, 160, 32, 32]);
        this.sprite.addKeyframe(CLYDE_EAT_DOWN, [32, 160, 32, 32]);

        this.sprite.addAnimation();
        this.sprite.addKeyframe(CLYDE_SCARED, [0, 192, 32, 32])
        this.sprite.addKeyframe(CLYDE_SCARED, [32, 192, 32, 32])
        

        this.sprite.setAnimation(CLYDE_EAT_LEFT);
        
        
    }

    handleUpdate(deltaTime){
            // Move right
        if(keyboard[39]) // KEY_RIGHT
        {
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(CLYDE_EAT_RIGHT);
            }
        }else if(keyboard[37]){ // KEY LEFT
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(CLYDE_EAT_LEFT);
            }
        }else if(keyboard[38]){ // KEY UP
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(CLYDE_EAT_UP);
            }
        }else if(keyboard[40]){ // KEY DOWN
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(CLYDE_EAT_DOWN);
            }
        }
        else{
            this.sprite.setAnimation(this.getAnimation(this.sprite.currentAnimation));
        }
        // Update sprite
	    this.sprite.update(deltaTime);

    }

    getAnimation(anim){
        switch (anim) {
            case CLYDE_EAT_RIGHT:
                return CLYDE_STOP_RIGHT
            case CLYDE_EAT_LEFT:
                return CLYDE_STOP_LEFT
            case CLYDE_EAT_UP:
                return CLYDE_STOP_UP
            case CLYDE_EAT_DOWN:
                return CLYDE_STOP_DOWN
            default:
                return anim
                break;
        }
    }
    
    //TODO ask if i should check the other values as well! (like all but the one i'm trying to check)
    wasStopped(anim){
        return anim == CLYDE_STOP_DOWN || anim ==  CLYDE_STOP_LEFT || anim == CLYDE_STOP_UP || anim ==  CLYDE_STOP_RIGHT;
    }

    draw(){
        this.sprite.draw();
    }

    getScared(){
        var direction = this.sprite.currentAnimation;
        this.sprite.setAnimation(CLYDE_SCARED)
        setTimeout(this.returnToNormal, 1000, direction, this.sprite)
    }

    returnToNormal(direction, sprite){
        sprite.setAnimation(direction)
    }
}