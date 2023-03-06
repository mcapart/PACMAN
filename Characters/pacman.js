const PACMAN_STOP_RIGHT = 0;
const PACMAN_EAT_RIGHT = 1;
const PACMAN_STOP_LEFT = 2;
const PACMAN_EAT_LEFT = 3;
const PACMAN_STOP_UP = 4;
const PACMAN_EAT_UP = 5;
const PACMAN_STOP_DOWN = 6;
const PACMAN_EAT_DOWN = 7;



class Pacman{

    constructor(){
        var t = new Texture("././img/pacman_sprite.png");
        this.sprite = new Sprite(448/2 - 16, 408, 32, 32, 16, t);
        // Move right
        this.speedPacman = 2.5; // In pixels per frame
    }

    addAnimations(){
        // Add full stop RIGHT
        this.sprite.addAnimation();
        this.sprite.addKeyframe(PACMAN_STOP_RIGHT, [64, 0, 32, 32]);

        this.sprite.addAnimation();
        this.sprite.addKeyframe(PACMAN_EAT_RIGHT, [0, 64, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_RIGHT, [64, 0, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_RIGHT, [96, 0, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_RIGHT, [64, 0, 32, 32]);

        // Add movement LEFT
        this.sprite.addAnimation();
        this.sprite.addKeyframe(PACMAN_STOP_LEFT, [0, 0, 32, 32])

        this.sprite.addAnimation();
        this.sprite.addKeyframe(PACMAN_EAT_LEFT, [0, 64, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_LEFT, [0, 0, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_LEFT, [32, 0, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_LEFT, [0, 0, 32, 32]);

        // Add movement UP
        this.sprite.addAnimation();
        this.sprite.addKeyframe(PACMAN_STOP_UP, [32, 32, 32, 32])

        this.sprite.addAnimation();
        this.sprite.addKeyframe(PACMAN_EAT_UP, [0, 64, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_UP, [0, 32, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_UP, [32, 32, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_UP, [0, 32, 32, 32]);

        // Add movement DOWN
        this.sprite.addAnimation();
        this.sprite.addKeyframe(PACMAN_STOP_DOWN, [64, 32, 32, 32])


        this.sprite.addAnimation();
        this.sprite.addKeyframe(PACMAN_EAT_DOWN, [0, 64, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_DOWN, [64, 32, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_DOWN, [96, 32, 32, 32]);
        this.sprite.addKeyframe(PACMAN_EAT_DOWN, [64, 32, 32, 32]);
        

        this.sprite.setAnimation(PACMAN_EAT_LEFT);
        
        
    }

    handleUpdate(deltaTime){
            // Move right
        if(keyboard[39]) // KEY_RIGHT
        {
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(PACMAN_EAT_RIGHT);
            }
                
            this.sprite.x += this.speedPacman;
        }else if(keyboard[37]){ // KEY LEFT
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(PACMAN_EAT_LEFT);
            }
            this.sprite.x -= this.speedPacman;
        }else if(keyboard[38]){ // KEY UP
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(PACMAN_EAT_UP);
            }
            this.sprite.y -= this.speedPacman;

        }else if(keyboard[40]){ // KEY DOWN
            if(this.wasStopped(this.sprite.currentAnimation)){
                this.sprite.setAnimation(PACMAN_EAT_DOWN);
            }
                
            this.sprite.y += this.speedPacman;

        }
        else{
            this.sprite.setAnimation(this.getAnimation(this.sprite.currentAnimation));
        }
            
        
        // Reset pacman
        if(keyboard[32]){
            this.sprite.x = 448/2 - 16;
            this.sprite.y = 408;
        }
            

        // Update sprite
	    this.sprite.update(deltaTime);

    }

    getAnimation(anim){
        switch (anim) {
            case PACMAN_EAT_RIGHT:
                return PACMAN_STOP_RIGHT
            case PACMAN_EAT_LEFT:
                return PACMAN_STOP_LEFT
            case PACMAN_EAT_UP:
                return PACMAN_STOP_UP
            case PACMAN_EAT_DOWN:
                return PACMAN_STOP_DOWN
            default:
                return anim
                break;
        }
    }
    
    wasStopped(anim){
        return anim == PACMAN_STOP_DOWN || anim ==  PACMAN_STOP_LEFT || anim == PACMAN_STOP_UP || anim ==  PACMAN_STOP_RIGHT;
    }

    draw(){
        this.sprite.draw();
    }
}