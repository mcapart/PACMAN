const PACMAN_STOP_RIGHT = 0;
const PACMAN_EAT_RIGHT = 1;
const PACMAN_STOP_LEFT = 2;
const PACMAN_EAT_LEFT = 3;
const PACMAN_STOP_UP = 4;
const PACMAN_EAT_UP = 5;
const PACMAN_STOP_DOWN = 6;
const PACMAN_EAT_DOWN = 7;



class Pacman{

    constructor(map, ghosts){
        var t = new Texture("././img/pacman_sprite.png");
        this.sprite = new Sprite(448/2 - 16, 408, 32, 32, 16, t);
        this.sprite.setCollisionBox([6, 6], [22, 22])

        this.speedPacman = 2.5; // In pixels per frame
        this.map = map;
        this.direction = PACMAN_STOP_LEFT;
        this.can_eat_ghost = false;
        this.ghosts = ghosts;

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
        this.sprite.addKeyframe(PACMAN_STOP_UP, [0, 32, 32, 32])

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
        

        this.sprite.setAnimation(PACMAN_STOP_LEFT);
        
        
    }

    handleUpdate(deltaTime){
          
        
        if(keyboard[39]) // KEY_RIGHT
        {
            this.sprite.x += this.speedPacman;
            var tileId = this.map.collisionRight(this.sprite);
            if((tileId == 0  || tileId == 41 || tileId == 42 || tileId == 43 || tileId == 49))
            {
                if(tileId == 41){
                    this.map.replaceTileRight(this.sprite);
                }
                if(tileId == 43){
                    this.map.replaceTileRight(this.sprite); 
                    this.can_eat_ghost = true;
                    this.ghosts.forEach(ghost => {
                        ghost.getScared();
                    });
                }
                this.direction = PACMAN_EAT_RIGHT;
                if(this.sprite.currentAnimation != PACMAN_EAT_RIGHT){
                    this.sprite.setAnimation(this.direction);
                } 
            }else{
                this.sprite.x -= this.speedPacman;
                if(this.direction == PACMAN_EAT_RIGHT){
                    this.direction == PACMAN_STOP_RIGHT
                }else{
                    this.continueDirection()
                }
            } 
        }else if(keyboard[37]){ // KEY LEFT
            this.sprite.x -= this.speedPacman;
            var tileId = this.map.collisionLeft(this.sprite);

            if((tileId == 0  || tileId == 41 || tileId == 42 || tileId == 43 || tileId == 49))
            {
                if(tileId == 41){
                    this.map.replaceTileLeft(this.sprite);
                }
                if(tileId == 43){
                    this.map.replaceTileLeft(this.sprite); 
                    this.can_eat_ghost = true;
                    this.ghosts.forEach(ghost => {
                        ghost.getScared();
                    });
                }
                this.direction = PACMAN_EAT_LEFT;
                if(this.sprite.currentAnimation != PACMAN_EAT_LEFT){
                    this.sprite.setAnimation(this.direction);
                } 

            }else{
                this.sprite.x += this.speedPacman;
                if(this.direction == PACMAN_EAT_LEFT){
                    this.direction == PACMAN_STOP_LEFT
                }else{
                    this.continueDirection()
                } 
            } 
        
        }else if(keyboard[38]){ // KEY UP
            this.sprite.y -= this.speedPacman;
            var tileId = this.map.collisionUp(this.sprite);
            if((tileId == 0  || tileId == 41 || tileId == 42 || tileId == 43 || tileId == 49))
            {
                if(tileId == 41){
                    this.map.replaceTileUp(this.sprite);
                }
                if(tileId == 43){
                    this.map.replaceTileUp(this.sprite); 
                    this.can_eat_ghost = true;
                    this.ghosts.forEach(ghost => {
                        ghost.getScared();
                    });
                }
                this.direction = PACMAN_EAT_UP;
                if(this.sprite.currentAnimation != PACMAN_EAT_UP){
                    this.sprite.setAnimation(this.direction);
                } 
            }else{
                this.sprite.y += this.speedPacman;
                if(this.direction == PACMAN_EAT_UP){
                    this.direction == PACMAN_STOP_UP
                }else{
                    this.continueDirection()
                }
            } 
        }else if(keyboard[40]){ // KEY DOWN
            this.sprite.y += this.speedPacman;
            var tileId = this.map.collisionDown(this.sprite);
            if((tileId == 0  || tileId == 41 || tileId == 42 || tileId == 43 || tileId == 49))
            {
                if(tileId == 41){
                    this.map.replaceTileDown(this.sprite);
                }
                if(tileId == 43){
                    this.map.replaceTileDown(this.sprite); 
                    this.can_eat_ghost = true;
                    this.ghosts.forEach(ghost => {
                        ghost.getScared();
                    });
                }
                this.direction = PACMAN_EAT_DOWN;
                if(this.sprite.currentAnimation != PACMAN_EAT_DOWN){
                    this.sprite.setAnimation(this.direction);
                } 
            }else{
                this.sprite.y -= this.speedPacman;
                if(this.direction == PACMAN_EAT_DOWN){
                    this.direction = PACMAN_STOP_DOWN
                }else{
                    this.continueDirection();
                }
               
            }    
        }else{
            this.continueDirection();
        }
        

        // else{
        //     this.sprite.setAnimation(this.getAnimation(this.sprite.currentAnimation));
        // }

            
        
        // Reset pacman
        if(keyboard[32]){
            this.sprite.x = 448/2 - 16;
            this.sprite.y = 408;
            this.sprite.setAnimation(PACMAN_STOP_LEFT)
            this.direction = PACMAN_STOP_LEFT
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

    moveLeft(){
        this.sprite.x -= this.speedPacman;
        var tileId = this.map.collisionLeft(this.sprite);
        if(tileId != 0  && tileId != 41 && tileId != 42 && tileId != 43 && tileId != 49){
            this.sprite.x += this.speedPacman;
            this.direction = PACMAN_STOP_LEFT;
            this.sprite.setAnimation(this.direction);
        }
        if(tileId == 41){
            this.map.replaceTileLeft(this.sprite);
        }
        if(tileId == 43){
            this.map.replaceTileLeft(this.sprite); 
            this.can_eat_ghost = true;
            this.ghosts.forEach(ghost => {
                ghost.getScared();
            });
        }
    }

    moveRight(){
        this.sprite.x += this.speedPacman;
        var tileId = this.map.collisionRight(this.sprite);
        if(tileId != 0  && tileId != 41 && tileId != 42 && tileId != 43 && tileId != 49){
            this.sprite.x += this.speedPacman;
            this.direction = PACMAN_STOP_RIGHT;
            this.sprite.setAnimation(this.direction);
        }
        if(tileId == 41){
            this.map.replaceTileRight(this.sprite);
        }
        if(tileId == 43){
            this.map.replaceTileRight(this.sprite); 
            this.can_eat_ghost = true;
            this.ghosts.forEach(ghost => {
                ghost.getScared();
            });
        }
    }

    moveUp(){
        this.sprite.y -= this.speedPacman;
        var tileId = this.map.collisionUp(this.sprite);
        if(tileId != 0  && tileId != 41 && tileId != 42 && tileId != 43 && tileId != 49){
            this.sprite.x += this.speedPacman;
            this.direction = PACMAN_STOP_UP;
            this.sprite.setAnimation(this.direction);
        }
        if(tileId == 41){
            this.map.replaceTileUp(this.sprite);
        }
        if(tileId == 43){
            this.map.replaceTileUp(this.sprite); 
            this.can_eat_ghost = true;
            this.ghosts.forEach(ghost => {
                ghost.getScared();
            });
        }
    }

    moveDown(){
        this.sprite.y += this.speedPacman;
        var tileId = this.map.collisionDown(this.sprite);
        if(tileId != 0  && tileId != 41 && tileId != 42 && tileId != 43 && tileId != 49){
            this.sprite.x += this.speedPacman;
            this.direction = PACMAN_STOP_DOWN;
            this.sprite.setAnimation(this.direction);
        }
        if(tileId == 41){
            this.map.replaceTileDown(this.sprite);
        }
        if(tileId == 43){
            this.map.replaceTileDown(this.sprite); 
            this.can_eat_ghost = true;
            this.ghosts.forEach(ghost => {
                ghost.getScared();
            });
        }
    }

    continueDirection(){
        switch (this.direction) {
            case PACMAN_EAT_LEFT:
                this.moveLeft();
                break;
            case PACMAN_EAT_RIGHT:
                this.moveRight();
                break;
            case PACMAN_EAT_UP:
                this.moveUp();
                break;
            case PACMAN_EAT_DOWN:
                this.moveDown();
                break;
            default:
                break;
        }
    }
}