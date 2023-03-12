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
        this.points = 0;

    }

     /**
     * @description Function that handles defines pacaman animation TODO dead pacman
     */
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

    /**
     * @description Function that handles update depending on the key pressed
     */
    handleUpdate(deltaTime){
          
        
        if(keyboard[39]) // KEY_RIGHT
        {
            this.sprite.x += this.speedPacman;
            var tileId = this.map.collisionRight(this.sprite);
            if((tileId == 0  || tileId == 41 || tileId == 42 || tileId == 43 || tileId == 49))
            {
                if(tileId == 41){
                    this.map.replaceTileRight(this.sprite);
                    this.eatDot();
                }
                if(tileId == 43){
                    this.map.replaceTileRight(this.sprite); 
                    this.eatPowerPellet();
                    
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
                    this.eatDot();
                }
                if(tileId == 43){
                    this.map.replaceTileLeft(this.sprite); 
                    this.eatPowerPellet();
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
                    this.eatDot();
                }
                if(tileId == 43){
                    this.map.replaceTileUp(this.sprite); 
                    this.eatPowerPellet();
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
                    this.eatDot();
                }
                if(tileId == 43){
                    this.map.replaceTileDown(this.sprite); 
                    this.eatPowerPellet();
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

    /**
     * @description Wrapper for the draw function
     */
    draw(){
        this.sprite.draw();
    }


    /**
     * @description Function that defines the continues move left
     */
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
            this.eatDot();
        }
        if(tileId == 43){
            this.map.replaceTileLeft(this.sprite); 
            this.can_eat_ghost = true;
            this.eatPowerPellet();
        }
    }

     /**
     * @description Function that defines the continues move right
     */
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
            this.eatDot();
        }
        if(tileId == 43){
            this.map.replaceTileRight(this.sprite); 
            this.eatPowerPellet();
        }
    }

    /**
     * @description Function that defines the continues move up
     */
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
            this.eatDot();
        }
        if(tileId == 43){
            this.map.replaceTileUp(this.sprite); 
            this.eatPowerPellet();
        }
    }

    /**
     * @description Function that defines the continues move down
     */
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
            this.eatDot();
        }
        if(tileId == 43){
            this.map.replaceTileDown(this.sprite); 
            tthis.eatPowerPellet();
        }
    }

    /**
     * @description Function that defines in which direction to continue moving
     */
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

     /**
     * @description Function that returns Pacmans points
     */
     getPoints(){
        return this.points;
    }

    /**
     * @description Function that handles eating a dot TODO implement deletion here
     */
    eatDot(){
        this.points += 10;
        this.dots -= 1;
    }

    eatPowerPellet(){
        this.points += 50;
        //TODO change eat_ghost_temp
        this.can_eat_ghost = true;
        this.ghosts.forEach(ghost => {
            ghost.getScared();
        });
    }
}