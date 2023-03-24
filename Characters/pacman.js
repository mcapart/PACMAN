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
        //this.sprite = new Sprite(0+8*3, 48+8, 32, 32, 16, t);
        this.sprite.setCollisionBox([6, 6], [22, 22])

        this.speedPacman = 2.5; // In pixels per frame
        this.map = map;
        this.direction = PACMAN_STOP_LEFT;
        this.can_eat_ghost = false;
        this.ghosts = ghosts;
        this.points = 0;
        this.dots = 240;
        this.isCornering = cornering.NONE;
        this.corneringPrev = PACMAN_STOP_LEFT;
        this.dirCornering = directions.LEFT;
        this.corneringX = this.sprite.x;
        this.corneringY = this.sprite.y;
        this.isStart = true;
    

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
        //If we start a direction and our previus direction is not ours or stopped 
        // Then we are cornering
        // I know his new direction -> need to know the previous one!
        // He moves 1 in his old and 1 in his new
        // Until he is in the middle. 
        // Need to know when he is in the middle!


        //TODO si estoy frenado pero no me detecta el cornering y me puedo mover en esa dir => me tengo que mover en esa dir!
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
                if((this.direction != PACMAN_EAT_RIGHT && this.direction != PACMAN_STOP_RIGHT && this.direction != PACMAN_EAT_LEFT && this.direction!= PACMAN_STOP_LEFT)  &&  (this.isCornering == cornering.NONE && this.checkCornering())){

                    this.direction = PACMAN_EAT_RIGHT;    
                    this.updateCorner();              
                    this.sprite.setAnimation(this.direction);
                    
                }else{
                    this.sprite.x -= this.speedPacman;
                    //Siempre si estoy en opuesto puedo irme al otro lado
                    if(this.direction == PACMAN_EAT_RIGHT || this.direction == PACMAN_STOP_LEFT || this.direction == PACMAN_EAT_LEFT){
                        this.direction = PACMAN_EAT_RIGHT;                 
                        if(this.sprite.currentAnimation != PACMAN_EAT_RIGHT){
                            this.sprite.setAnimation(this.direction);
                        } 
                    
                    }
                    this.continueDirection();
                    if(this.isCornering != cornering.NONE && this.map.isInMiddle(this.sprite, this.dirCornering, this.corneringX, this.corneringY, this.isCornering)){
                        this.isCornering = cornering.NONE;
                        console.log('termino, x', this.sprite.x, "y", this.sprite.y)
                    }
                        
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
                if((this.direction != PACMAN_EAT_LEFT && this.direction != PACMAN_STOP_LEFT && this.direction != PACMAN_EAT_RIGHT  && this.direction!= PACMAN_STOP_RIGHT)  &&  (this.isCornering == cornering.NONE && this.checkCornering())){
                    console.log('aca')
                    this.direction = PACMAN_EAT_LEFT;    
                    this.updateCorner();              
                    this.sprite.setAnimation(this.direction);
                    
                }else{
                    this.sprite.x += this.speedPacman;
                    //Siempre si estoy en opuesto puedo irme al otro lado
                    if(this.direction == PACMAN_EAT_LEFT || this.direction == PACMAN_STOP_RIGHT || this.direction == PACMAN_EAT_RIGHT || this.isStart){
                        this.direction = PACMAN_EAT_LEFT;          
                        this.isStart = false;                    
                        if(this.sprite.currentAnimation != PACMAN_EAT_LEFT){
                            this.sprite.setAnimation(this.direction);
                        } 
                    
                    }
                    this.continueDirection();
                    if(this.isCornering != cornering.NONE && this.map.isInMiddle(this.sprite, this.dirCornering, this.corneringX, this.corneringY, this.isCornering))
                        this.isCornering = cornering.NONE;
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
                //No hay colision! Se puede mover en esa dir!
                if(tileId == 41){
                    this.map.replaceTileUp(this.sprite);
                    this.eatDot();
                }
                if(tileId == 43){
                    this.map.replaceTileUp(this.sprite); 
                    this.eatPowerPellet();
                }
                if((this.direction != PACMAN_EAT_UP && this.direction != PACMAN_STOP_UP && this.direction != PACMAN_EAT_DOWN && this.direction!= PACMAN_STOP_DOWN)  &&  (this.isCornering == cornering.NONE && this.checkCornering())){
                    this.direction = PACMAN_EAT_UP;    
                    this.updateCorner();              
                    this.sprite.setAnimation(this.direction);
                    
                }else{
                    this.sprite.y += this.speedPacman;
                    //Siempre si estoy en opuesto puedo irme al otro lado

                    if(this.direction == PACMAN_EAT_UP || this.direction == PACMAN_STOP_DOWN || this.direction == PACMAN_EAT_DOWN ){
                        this.direction = PACMAN_EAT_UP;      
                        if(this.sprite.currentAnimation != PACMAN_EAT_UP){
                            this.sprite.setAnimation(this.direction);
                        } 
                    
                    }
                    this.continueDirection();
                    if(this.isCornering != cornering.NONE && this.map.isInMiddle(this.sprite, this.dirCornering, this.corneringX, this.corneringY, this.isCornering))
                        this.isCornering = cornering.NONE;
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
                if((this.direction != PACMAN_EAT_DOWN && this.direction != PACMAN_STOP_DOWN && this.direction != PACMAN_EAT_UP && this.direction!= PACMAN_STOP_UP)  &&  (this.isCornering == cornering.NONE && this.checkCornering())){
                    this.direction = PACMAN_EAT_DOWN;    
                    this.updateCorner();              
                    this.sprite.setAnimation(this.direction);
                    
                }else{
                    this.sprite.y -= this.speedPacman;
                    //Siempre si estoy en opuesto puedo irme al otro lado

                    if(this.direction == PACMAN_EAT_DOWN || this.direction == PACMAN_STOP_UP || this.direction == PACMAN_EAT_UP ){
                        this.direction = PACMAN_EAT_DOWN;      
                        if(this.sprite.currentAnimation != PACMAN_EAT_DOWN){
                            this.sprite.setAnimation(this.direction);
                        } 
                    
                    }
                    this.continueDirection();
                    if(this.isCornering != cornering.NONE && this.map.isInMiddle(this.sprite, this.dirCornering, this.corneringX, this.corneringY, this.isCornering))
                        this.isCornering = cornering.NONE;
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

    checkCornering(){
        let res = cornering.NONE;
        let dir;
        switch (this.direction) {
            case PACMAN_STOP_LEFT:
            case PACMAN_EAT_LEFT:
                res = this.map.isCornering(this.sprite, directions.LEFT); 
                dir = directions.LEFT;
                break;
            case PACMAN_STOP_RIGHT:
            case PACMAN_EAT_RIGHT:
                res = this.map.isCornering(this.sprite, directions.RIGHT); 
                dir = directions.RIGHT;
                break;
            case PACMAN_STOP_DOWN:
            case PACMAN_EAT_DOWN:
                res = this.map.isCornering(this.sprite, directions.DOWN);
                dir = directions.DOWN;
                break;
            case PACMAN_STOP_UP:
            case PACMAN_EAT_UP:
                res = this.map.isCornering(this.sprite, directions.UP);
                dir = directions.UP;
                break;
            default:
                break;
        }
        if(res != cornering.NONE){
            this.isCornering = res;
            this.corneringPrev = this.direction; 
            this.dirCornering = dir;
            this.corneringX = this.sprite.x;
            this.corneringY = this.sprite.y;
            console.log('cornering, over', res == cornering.OVER)
            return true;
        }else{
            return false;
        }

    }
    updateCorner(){
        console.log('en update corner', this.corneringPrev)
        switch (this.corneringPrev) {
            case PACMAN_STOP_LEFT:
            case PACMAN_EAT_LEFT:
                console.log(this.sprite.x, this.isCornering)
                this.sprite.x -= (this.isCornering  == cornering.PRE? 2.5: -2.5);
                console.log(this.sprite.x)
                if(this.map.isInMiddle(this.sprite, directions.LEFT, this.corneringX, this.corneringY, this.isCornering))
                    this.isCornering = cornering.NONE;
                break;
            case PACMAN_STOP_RIGHT:
            case PACMAN_EAT_RIGHT:
                this.sprite.x += (this.isCornering  == cornering.PRE? 2.5: -2.5);
                if(this.map.isInMiddle(this.sprite, directions.RIGHT, this.corneringX, this.corneringY, this.isCornering))
                {
                    this.isCornering = cornering.NONE;
                    console.log('termino, x', this.sprite.x, "y", this.sprite.y)
                }
                break;
            case PACMAN_STOP_DOWN:
            case PACMAN_EAT_DOWN:
                this.sprite.y += (this.isCornering  == cornering.PRE? 2.5: -2.5);
                if(this.map.isInMiddle(this.sprite, directions.DOWN, this.corneringX, this.corneringY, this.isCornering))
                {
                    this.isCornering = cornering.NONE;
                    console.log('termino, x', this.sprite.x, "y", this.sprite.y)
                }
                break;
            case PACMAN_STOP_UP:
            case PACMAN_EAT_UP:
                this.sprite.y -= (this.isCornering  == cornering.PRE? 2.5: -2.5);
                if(this.map.isInMiddle(this.sprite, directions.UP, this.corneringX, this.corneringY, this.isCornering))
                    this.isCornering = cornering.NONE;
                break;
            default:
                break;
        }
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
        if(tileId == -1){
            this.sprite.x = this.map.map.width * this.map.map.tilewidth - this.sprite.width;
            return;
        }
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
        if(this.isCornering != cornering.NONE){
            this.updateCorner()
        }
    }

     /**
     * @description Function that defines the continues move right
     */
    moveRight(){
        this.sprite.x += this.speedPacman;
        var tileId = this.map.collisionRight(this.sprite);
        if(tileId == -1){
            this.sprite.x = 0;
            return;
        }
    
        if(tileId != 0  && tileId != 41 && tileId != 42 && tileId != 43 && tileId != 49){
            this.sprite.x -= this.speedPacman;
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
        if(this.isCornering != cornering.NONE){
            this.updateCorner()
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
        if(this.isCornering != cornering.NONE){
            this.updateCorner()
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
            this.eatPowerPellet();
        }
        if(this.isCornering != cornering.NONE){
            this.updateCorner()
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

    /**
     * @description Function that defines if Pacman won TODO should take into account the power up!
     */
    hasWon(){
        return this.dots == 0;
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