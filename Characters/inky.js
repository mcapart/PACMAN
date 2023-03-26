const INKY_STOP_RIGHT = 0;
const INKY_EAT_RIGHT = 1;
const INKY_STOP_LEFT = 2;
const INKY_EAT_LEFT = 3;
const INKY_STOP_UP = 4;
const INKY_EAT_UP = 5;
const INKY_STOP_DOWN = 6;
const INKY_EAT_DOWN = 7;
const INKY_SCARED = 8;
const INK_DEAD = 9;



class Inky{

    constructor(){
        var t = new Texture("././img/ghosts_sprites.png");
        this.sprite = new Sprite((448/2) - 48 , (544/2) - 8, 32, 32, 16, t);
        this.sprite.setCollisionBox([8, 8], [23, 23])
        this.speed = 2.5; // In pixels per frame
        this.canDraw = true;
        this.canMove = true;
    }

    addAnimations(){
        // Add full stop RIGHT
        this.sprite.addAnimation();
        this.sprite.addKeyframe(INKY_STOP_RIGHT, [128, 64, 32, 32]);

        this.sprite.addAnimation();
        this.sprite.addKeyframe(INKY_EAT_RIGHT, [128, 64, 32, 32]);
        this.sprite.addKeyframe(INKY_EAT_RIGHT, [160, 64, 32, 32]);

        // Add movement LEFT
        this.sprite.addAnimation();
        this.sprite.addKeyframe(INKY_STOP_LEFT, [0, 96, 32, 32])

        this.sprite.addAnimation();
        this.sprite.addKeyframe(INKY_EAT_LEFT, [0, 96, 32, 32]);
        this.sprite.addKeyframe(INKY_EAT_LEFT, [32, 96, 32, 32]);

        // Add movement UP
        this.sprite.addAnimation();
        this.sprite.addKeyframe(INKY_STOP_UP, [64, 96, 32, 32])

        this.sprite.addAnimation();
        this.sprite.addKeyframe(INKY_EAT_UP, [64, 96, 32, 32]);
        this.sprite.addKeyframe(INKY_EAT_UP, [96, 96, 32, 32]);

        // Add movement DOWN
        this.sprite.addAnimation();
        this.sprite.addKeyframe(INKY_STOP_DOWN, [128, 96, 32, 32])


        this.sprite.addAnimation();
        this.sprite.addKeyframe(INKY_EAT_DOWN, [128, 96, 32, 32]);
        this.sprite.addKeyframe(INKY_EAT_DOWN, [160, 96, 32, 32]);

        this.sprite.addAnimation();
        this.sprite.addKeyframe(INKY_SCARED, [0, 192, 32, 32])
        this.sprite.addKeyframe(INKY_SCARED, [32, 192, 32, 32])
        

        this.sprite.setAnimation(INKY_EAT_LEFT);
        
        
    }

    handleUpdate(deltaTime){
            // Move right
        if(keyboard[39]) // KEY_RIGHT
        {
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(INKY_EAT_RIGHT);
            }
        }else if(keyboard[37]){ // KEY LEFT
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(INKY_EAT_LEFT);
            }
        }else if(keyboard[38]){ // KEY UP
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(INKY_EAT_UP);
            }
        }else if(keyboard[40]){ // KEY DOWN
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(INKY_EAT_DOWN);
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
            case INKY_EAT_RIGHT:
                return INKY_STOP_RIGHT
            case INKY_EAT_LEFT:
                return INKY_STOP_LEFT
            case INKY_EAT_UP:
                return INKY_STOP_UP
            case INKY_EAT_DOWN:
                return INKY_STOP_DOWN
            default:
                return anim
                break;
        }
    }
    
    //TODO ask if i should check the other values as well! (like all but the one i'm trying to check)
    wasStopped(anim){
        return anim == INKY_STOP_DOWN || anim ==  INKY_STOP_LEFT || anim == INKY_STOP_UP || anim ==  INKY_STOP_RIGHT;
    }

    draw(){
        if(this.canDraw)
            this.sprite.draw();
    }
    getScared(){
        var direction = this.sprite.currentAnimation;
        this.sprite.setAnimation(INKY_SCARED)
        setTimeout(this.returnToNormal, 1000, direction, this.sprite)
    }

    returnToNormal(direction, sprite){
        sprite.setAnimation(direction)
    }

    killed(){
        this.canMove = false;
    }
    erase(){
        this.canDraw = false;
    }


    reset(ghost){
        ghost.sprite.x = (448/2) - 48 
        ghost.sprite.y = (544/2) - 8, 32
        ghost.canDraw = true;
        ghost.canMove = true;
    }
}