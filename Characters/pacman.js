const PACMAN_STOP_RIGHT = 0;
const PACMAN_EAT_RIGHT = 1;
const PACMAN_STOP_LEFT = 2;
const PACMAN_EAT_LEFT = 3;
const PACMAN_STOP_UP = 4;
const PACMAN_EAT_UP = 5;
const PACMAN_STOP_DOWN = 6;
const PACMAN_EAT_DOWN = 7;
const PACMAN_DEAD = 8;



class Pacman{

    constructor(map, ghosts, level, pacman_sounds, lives){
        var t = new Texture("././img/pacman_sprite.png");
        this.sprite = new Sprite(448/2 - 16, 408, 32, 32, 16, t);
        this.sprite.setCollisionBox([6, 6], [26, 26])
        this.pacman_sounds = pacman_sounds

        this.speedPacman = 2.5; // In pixels per frame
        this.speedByLevel = [0.8, 0.9, 1]
        this.speedChase = [0.9, 0.95, 1]

        this.map = map;

        this.direction = PACMAN_STOP_LEFT;
        this.can_eat_ghost = false;
        this.ghost_points = [200, 400, 800, 1600]
        this.ghosts_eaten = 0
        this.ghosts_dead = [ {times: 0, x: 0, y:0, points: 0}, {times: 0, x: 0, y:0, points: 0}, {times: 0, x: 0, y:0, points: 0}, {times: 0, x: 0, y:0, points: 0}]
        this.ghosts = ghosts;

        this.points = 0;
        this.dots = 240;

        this.isCornering = cornering.NONE;
        this.corneringPrev = PACMAN_STOP_LEFT;
        this.dirCornering = directions.LEFT;
        this.corneringX = this.sprite.x;
        this.corneringY = this.sprite.y;

        this.isStart = true;
        this.lives = lives;
        this.canMove = true;
        this.timeFruit = 9.5 * 1000;
        this.time = 0;

        this.canEatFruit = false;
        this.fruitsPoints = [100, 300, 500]
        this.tilePosFruit = 17*this.map.map.width + 13;
        this.fruitEaten = 0;
        this.fruitTime = 0;

        this.level = level;
        this.eatSound;

        this.timer = 0;
        this.limiteByLeve = [4, 4, 3]
        this.timeLimit = this.limiteByLeve[this.level]*1000
        this.globalCounter = 0;

        this.inminue = false;
        this.isPressing = false;

        this.elroyDots = [[20, 10], [30, 15 ], [40, 20]]
    

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

        //Add death
        this.sprite.addAnimation();
        this.sprite.addKeyframe(PACMAN_DEAD, [0, 64, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [32, 64, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [64, 64, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [96, 64, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [0, 96, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [32, 96, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [64, 96, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [96, 96, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [0, 128, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [32, 128, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [64, 128, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [96, 128, 32, 32])
        this.sprite.addKeyframe(PACMAN_DEAD, [0, 64, 32, 32])
        

        this.sprite.setAnimation(PACMAN_STOP_LEFT);
        
        
    }

    getSpeedPercentage(){
        if(this.can_eat_ghost){
            return this.speedChase[this.level]
        }
        return this.speedByLevel[this.level]
    }

    /**
     * @description Function that handles update depending on the key pressed
     */
    handleUpdate(deltaTime){
        if(keyboard[71] && !this.isPressing){
            this.isPressing = true;
            this.inminue = !this.inminue
        }
        if(!keyboard[71]){
            this.isPressing = false;
        }


        if(this.canMove){
            if(keyboard[39]) // KEY_RIGHT
            {
                if(this.isStart){
                    this.isStart = false;  
                    this.ghosts.forEach(g => g.startGame())  
                }
                this.sprite.x += this.speedPacman * this.getSpeedPercentage();
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
                        this.sprite.x -= this.speedPacman * this.getSpeedPercentage();;
                        if(this.direction == PACMAN_EAT_RIGHT || this.direction == PACMAN_STOP_LEFT || this.direction == PACMAN_EAT_LEFT){
                            this.direction = PACMAN_EAT_RIGHT;                 
                            if(this.sprite.currentAnimation != PACMAN_EAT_RIGHT){
                                this.sprite.setAnimation(this.direction);
                            } 
                        
                        }
                        this.continueDirection();
                        if(this.isCornering != cornering.NONE && this.map.isInMiddle(this.sprite, this.dirCornering, this.corneringX, this.corneringY, this.isCornering)){
                            this.isCornering = cornering.NONE;
                        }
                            
                    }
    
    
                }else{
                    this.sprite.x -= this.speedPacman * this.getSpeedPercentage();
                    if(this.direction == PACMAN_EAT_RIGHT){
                        this.direction == PACMAN_STOP_RIGHT
                    }else{
                        this.continueDirection()
                    }
                } 
            }else if(keyboard[37]){ // KEY LEFT 
                this.sprite.x -= this.speedPacman* this.getSpeedPercentage();
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
                        this.direction = PACMAN_EAT_LEFT;    
                        this.updateCorner();              
                        this.sprite.setAnimation(this.direction);
                        
                    }else{
                        this.sprite.x += this.speedPacman * this.getSpeedPercentage();
                        //Siempre si estoy en opuesto puedo irme al otro lado
                        if(this.direction == PACMAN_EAT_LEFT || this.direction == PACMAN_STOP_RIGHT || this.direction == PACMAN_EAT_RIGHT || this.isStart){
                            this.direction = PACMAN_EAT_LEFT;          
                            if(this.isStart){
                                this.isStart = false;  
                                this.ghosts.forEach(g => g.startGame())
                            }    
                            if(this.sprite.currentAnimation != PACMAN_EAT_LEFT){
                                this.sprite.setAnimation(this.direction);
                            } 
                        
                        }
                        this.continueDirection();
                        if(this.isCornering != cornering.NONE && this.map.isInMiddle(this.sprite, this.dirCornering, this.corneringX, this.corneringY, this.isCornering))
                            this.isCornering = cornering.NONE;
                    }
    
                }else{
                    this.sprite.x += this.speedPacman * this.getSpeedPercentage();
                    if(this.direction == PACMAN_EAT_LEFT){
                        this.direction == PACMAN_STOP_LEFT
                    }else{
                        this.continueDirection()
                    } 
                } 
            
            }else if(keyboard[38]){ // KEY UP
                this.sprite.y -= this.speedPacman * this.getSpeedPercentage();
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
                    if((this.direction != PACMAN_EAT_UP && this.direction != PACMAN_STOP_UP && this.direction != PACMAN_EAT_DOWN && this.direction!= PACMAN_STOP_DOWN)  &&  (this.isCornering == cornering.NONE && this.checkCornering())){
                        this.direction = PACMAN_EAT_UP;    
                        this.updateCorner();              
                        this.sprite.setAnimation(this.direction);
                        
                    }else{
                        this.sprite.y += this.speedPacman * this.getSpeedPercentage();    
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
                    this.sprite.y += this.speedPacman * this.getSpeedPercentage();
                    if(this.direction == PACMAN_EAT_UP){
                        this.direction == PACMAN_STOP_UP
                    }else{
                        this.continueDirection()
                    }
                } 
            }else if(keyboard[40]){ // KEY DOWN
                this.sprite.y += this.speedPacman * this.getSpeedPercentage();
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
                        this.sprite.y -= this.speedPacman * this.getSpeedPercentage();    
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
                    this.sprite.y -= this.speedPacman * this.getSpeedPercentage();
                    if(this.direction == PACMAN_EAT_DOWN){
                        this.direction = PACMAN_STOP_DOWN
                    }else{
                        this.continueDirection();
                    }
                   
                }    
            }else{
                this.continueDirection();
            }
            if(!this.isStart)
                this.timer += deltaTime;
            if(this.timer >= this.timeLimit){
                this.timer = 0;
                for(var i = 0; i<this.ghosts.length; i++){
                    if(this.ghosts[i].inBox){
                        this.ghosts[i].canMove = true;
                        this.ghosts[i].exit = true;
                        break;
                    }
                }
            }
    
            this.checkColision();
        }
        
        // Update sprite
	    this.sprite.update(deltaTime);
        if(this.canEatFruit)
            this.time += deltaTime;
        if(this.time >= this.timeFruit && this.canEatFruit){
            this.canEatFruit = false;
            if(this.fruitEaten = 0){
                this.fruitEaten += 1;
            }
        }

        let tilePos = this.map.getTilePos(this.sprite);
        if(tilePos == this.tilePosFruit && this.canEatFruit){
    
            this.eatFruit()
        }


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
            return true;
        }else{
            return false;
        }

    }
    updateCorner(){
        switch (this.corneringPrev) {
            case PACMAN_STOP_LEFT:
            case PACMAN_EAT_LEFT:
                this.sprite.x -= (this.isCornering  == cornering.PRE? 2.5: -2.5);
                if(this.map.isInMiddle(this.sprite, directions.LEFT, this.corneringX, this.corneringY, this.isCornering))
                    this.isCornering = cornering.NONE;
                break;
            case PACMAN_STOP_RIGHT:
            case PACMAN_EAT_RIGHT:
                this.sprite.x += (this.isCornering  == cornering.PRE? 2.5: -2.5);
                if(this.map.isInMiddle(this.sprite, directions.RIGHT, this.corneringX, this.corneringY, this.isCornering))
                    this.isCornering = cornering.NONE;
                break;
            case PACMAN_STOP_DOWN:
            case PACMAN_EAT_DOWN:
                this.sprite.y += (this.isCornering  == cornering.PRE? 2.5: -2.5);
                if(this.map.isInMiddle(this.sprite, directions.DOWN, this.corneringX, this.corneringY, this.isCornering))
                this.isCornering = cornering.NONE;
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
        this.ghosts_dead.forEach(g => {
            var times = g.times;
            if(times>= 1 && times <= 100){
                g.times += 1;
                var canvas = document.getElementById("game-layer");
                var context = canvas.getContext("2d");
                var text = g.points.toString();
                context.font = "15px Verdana"; 
                var textSize = context.measureText(text); 
                context.fillStyle = "White";
                context.fillText(text, g.x, g.y + 15);
            }
        })

        if(this.fruitTime > 0 && this.fruitTime <= 100){
            this.fruitTime += 1
            var canvas = document.getElementById("game-layer");
            var context = canvas.getContext("2d");
            var text = (this.fruitsPoints[this.level] + ((this.fruitEaten == 1)? 0: 100)).toString();
            context.font = "15px Verdana"; 
            var textSize = context.measureText(text); 
            context.fillStyle = "White";
            context.fillText(text, 13*this.map.tileSize[0] + this.map.basePos[0], 17*this.map.tileSize[1] + this.map.basePos[1] - 8 + 15);
        }

    }

    /**
     * @description Function that defines the continues move left
     */
    moveLeft(){
        this.sprite.x -= this.speedPacman * this.getSpeedPercentage();
        var tileId = this.map.collisionLeft(this.sprite);
        if(tileId == -1){
            this.sprite.x = this.map.map.width * this.map.map.tilewidth - this.sprite.width;
            return;
        }
        if(tileId != 0  && tileId != 41 && tileId != 42 && tileId != 43 && tileId != 49){
            this.sprite.x += this.speedPacman * this.getSpeedPercentage();
            this.direction = PACMAN_STOP_LEFT;
            this.sprite.setAnimation(this.direction);
        }
        if(tileId == 41){
            this.map.replaceTileLeft(this.sprite);
            this.eatDot();
        }
        if(tileId == 43){
            this.map.replaceTileLeft(this.sprite); 
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
        this.sprite.x += this.speedPacman * this.getSpeedPercentage();
        var tileId = this.map.collisionRight(this.sprite);
        if(tileId == -1){
            this.sprite.x = 0;
            return;
        }
    
        if(tileId != 0  && tileId != 41 && tileId != 42 && tileId != 43 && tileId != 49){
            this.sprite.x -= this.speedPacman * this.getSpeedPercentage();
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
        this.sprite.y -= this.speedPacman * this.getSpeedPercentage();
        var tileId = this.map.collisionUp(this.sprite);
        if(tileId != 0  && tileId != 41 && tileId != 42 && tileId != 43 && tileId != 49){
            this.sprite.x += this.speedPacman * this.getSpeedPercentage();
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
        this.sprite.y += this.speedPacman * this.getSpeedPercentage();
        var tileId = this.map.collisionDown(this.sprite);
        if(tileId != 0  && tileId != 41 && tileId != 42 && tileId != 43 && tileId != 49){
            this.sprite.x += this.speedPacman * this.getSpeedPercentage();
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
        this.timer = 0;
        this.points += 10;
        this.dots -= 1;
        this.pacman_sounds.eat.setPlayback(5)
        this.pacman_sounds.eat.play()
        if(this.dots == this.elroyDots[this.level][0] || this.dots == this.elroyDots[this.level][1] ){
            this.ghosts[0].setElroy()
        }
        if(240 - this.dots == 70 || 240 - this.dots == 170){
            this.canEatFruit = true;
            this.fruitTime = 0;
        }

        if(this.lives < 3){
            this.globalCounter += 1;
        }
        this.ghosts.forEach(g => g.updateCounter())
        if(this.globalCounter == 32 && this.ghosts[3].inBox){
            this.globalCounter = 0
            let flag = true;
            this.ghosts.forEach(g => {
                g.globalCounter = 0;
                g.globalActive = false;
                if(g.inBox & flag){
                    g.active = true
                    flag = false 
                }
            })
        }
    }

    /**
     * @description Function that defines if Pacman won TODO should take into account the power up!
     */
    hasWon(){
        return this.dots == 0;
    }

    won(){
        this.canMove = false;
        this.sprite.setAnimation(PACMAN_STOP_DOWN)
    }

    eatFruit(){
        this.canEatFruit = false;
        this.points += this.fruitsPoints[this.level] + (240 - this.dots >= 170)? 100 : 0
        this.fruitTime = 1;
        this.fruitEaten += 1;
        this.pacman_sounds.fruit.play()
    }

    eatPowerPellet(){
        this.points += 50;
        this.can_eat_ghost = true;
        this.ghosts_eaten = 0;
        this.ghosts_dead = [ {times: 0, x: 0, y:0, points: 0}, {times: 0, x: 0, y:0, points: 0}, {times: 0, x: 0, y:0, points: 0}, {times: 0, x: 0, y:0, points: 0}]
        this.ghosts.forEach(ghost => {
            if(ghost.state != state.DEAD)
                ghost.getScared();
        });
    }

    returnToNormal(){
        this.can_eat_ghost = false;
    }


    checkColision(){
        this.ghosts.forEach(ghost => {
            if(this.colision(ghost)){
                if(ghost.state != state.FRIGHTENED && ghost.state != state.DEAD && !this.inminue){
                    this.canMove = false;
                    this.isStart = true;
                    this.globalCounter = 0
                    this.pacman_sounds.death.play()
                    this.ghosts.forEach(g => {
                        g.active = false;
                        g.globalActive = true;
                        g.globalCounter = 0;
                        g.killed()})
                    setTimeout(this.erase, 500, this)
                }else if(ghost.state == state.FRIGHTENED){
                    this.pacman_sounds.ghost.play()
                    this.points += this.ghost_points[this.ghosts_eaten];
                    ghost.isDead();
                    var elem = this.ghosts_dead.find( g => g.times == 0);
                    elem.x = ghost.sprite.x;
                    elem.y = ghost.sprite.y
                    elem.times = 1;
                    elem.points = this.ghost_points[this.ghosts_eaten]
                    this.ghosts_eaten += 1;
                }
                return;
            }
        })
    }

    erase(pacman){
        pacman.ghosts.forEach(g => g.erase())
        setTimeout(pacman.beginDeath, 500, pacman)
    }
    beginDeath(pacman){
        pacman.sprite.setAnimation(PACMAN_DEAD);
        setTimeout(pacman.done, pacman.sprite.timePerKeyframe*13, pacman)
    }

    done(pacman){
        pacman.sprite.x = 448/2 - 16;
        pacman.sprite.y = 408;
        pacman.lives -= 1;
        pacman.canMove = true;
        pacman.sprite.setAnimation(PACMAN_STOP_LEFT)
        pacman.direction = PACMAN_STOP_LEFT;
        pacman.isCornering = cornering.NONE;
        pacman.corneringPrev = PACMAN_STOP_LEFT;
        pacman.dirCornering = directions.LEFT;
        pacman.ghosts.forEach(g => g.reset(g))
    }

    colision(ghost){
        //Para pacman
        let pacmanX = this.sprite.x;
        let pacamanY = this.sprite.y;
        let borderPLeft = pacmanX + this.sprite.box.min[0];
        let borderPRight = pacmanX + this.sprite.box.max[0];
        let borderPTop = pacamanY + this.sprite.box.min[1];
        let borderPBottom = pacamanY + this.sprite.box.max[1];
        //Para ghost
        let ghostX = ghost.sprite.x;
        let ghostY = ghost.sprite.y;
        let borderGLeft = ghostX + ghost.sprite.box.min[0];
        let borderGRight = ghostX + ghost.sprite.box.max[0];
        let borderGTop = ghostY + ghost.sprite.box.min[1];
        let borderGBottom = ghostY + ghost.sprite.box.max[1];

        //Me fijo si se superpone
        //Si borderGLeft esta entre los bordes del pacman
        let superRight =borderGRight >= borderPLeft && borderGRight <= borderPRight;
        let superTop = borderGTop >= borderPTop && borderGTop <= borderPBottom;
        let superLeft = borderGLeft >= borderPLeft && borderGLeft <= borderPRight;
        let superBottom = borderGBottom >= borderPTop && borderGBottom <= borderPBottom;

        //Right y top o bottom 
        //Left y top o bottom
        if((superRight && (superTop || superBottom)) || (superLeft  && (superTop || superBottom))){
            return true;
        }
        return false;

    }

    gameOver(){
        if(this.lives == 0){
            this.canMove = false;
            this.ghosts.forEach(g => g.killed())
        }
        return this.lives == 0;
    }

    getDots(){
        return 240 - this.dots;
    }


}