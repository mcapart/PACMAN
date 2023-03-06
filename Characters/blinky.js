const BLINKY_STOP_RIGHT = 0;
const BLINKY_EAT_RIGHT = 1;
const BLINKY_STOP_LEFT = 2;
const BLINKY_EAT_LEFT = 3;
const BLINKY_STOP_UP = 4;
const BLINKY_EAT_UP = 5;
const SBLINKY_STOP_DOWN = 6;
const BLINKY_EAT_DOWN = 7;



class Blinky{

    constructor(){
        var t = new Texture("././img/zombie_ghosts3.png");
        this.sprite = new Sprite((448/2) - 16, (544/2) - 56, 32, 32, 16, t);
        // Move right
        this.speed = 2.5; // In pixels per frame
    }

    addAnimations(){
        // Add full stop RIGHT
        this.sprite.addAnimation();
        this.sprite.addKeyframe(BLINKY_STOP_RIGHT, [0, 0, 32, 32]);

        this.sprite.addAnimation();
        this.sprite.addKeyframe(BLINKY_EAT_RIGHT, [0, 0, 32, 32]);
        this.sprite.addKeyframe(BLINKY_EAT_RIGHT, [32, 0, 32, 32]);

        // Add movement LEFT
        this.sprite.addAnimation();
        this.sprite.addKeyframe(BLINKY_STOP_LEFT, [64, 0, 32, 32])

        this.sprite.addAnimation();
        this.sprite.addKeyframe(BLINKY_EAT_LEFT, [64, 0, 32, 32]);
        this.sprite.addKeyframe(BLINKY_EAT_LEFT, [96, 0, 32, 32]);

        // Add movement UP
        this.sprite.addAnimation();
        this.sprite.addKeyframe(BLINKY_STOP_UP, [128, 0, 32, 32])

        this.sprite.addAnimation();
        this.sprite.addKeyframe(BLINKY_EAT_UP, [128, 0, 32, 32]);
        this.sprite.addKeyframe(BLINKY_EAT_UP, [160, 0, 32, 32]);

        // Add movement DOWN
        this.sprite.addAnimation();
        this.sprite.addKeyframe(SBLINKY_STOP_DOWN, [0, 32, 32, 32])


        this.sprite.addAnimation();
        this.sprite.addKeyframe(BLINKY_EAT_DOWN, [0, 32, 32, 32]);
        this.sprite.addKeyframe(BLINKY_EAT_DOWN, [32, 32, 32, 32]);
        

        this.sprite.setAnimation(BLINKY_EAT_LEFT);
        
        
    }

    handleUpdate(deltaTime){
            // Move right
        if(keyboard[39]) // KEY_RIGHT
        {
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(BLINKY_EAT_RIGHT);
            }
        }else if(keyboard[37]){ // KEY LEFT
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(BLINKY_EAT_LEFT);
            }
        }else if(keyboard[38]){ // KEY UP
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(BLINKY_EAT_UP);
            }
        }else if(keyboard[40]){ // KEY DOWN
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(BLINKY_EAT_DOWN);
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
            case BLINKY_EAT_RIGHT:
                return BLINKY_STOP_RIGHT
            case BLINKY_EAT_LEFT:
                return BLINKY_STOP_LEFT
            case BLINKY_EAT_UP:
                return BLINKY_STOP_UP
            case BLINKY_EAT_DOWN:
                return SBLINKY_STOP_DOWN
            default:
                return anim
                break;
        }
    }
    
    //TODO ask if i should check the other values as well! (like all but the one i'm trying to check)
    wasStopped(anim){
        return anim == SBLINKY_STOP_DOWN || anim ==  BLINKY_STOP_LEFT || anim == BLINKY_STOP_UP || anim ==  BLINKY_STOP_RIGHT;
    }

    draw(){
        this.sprite.draw();
    }
}