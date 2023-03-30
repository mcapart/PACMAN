class Blinky{

    constructor(map, level){
        var t = new Texture("././img/ghosts_sprites.png");
        //this.sprite = new Sprite((448/2) - 16 , (544/2) - 56, 32, 32, 16, t);
        this.sprite = new Sprite(13* (map.tileSize[0]) + map.basePos[0] - 8 , 11*(map.tileSize[1]) + map.basePos[1] - 8, 32, 32, 16, t);
        this.sprite.setCollisionBox([6, 6], [22, 22])
        this.speed = 2.5; 
        this.speedByLevel = [0.75, 0.85, 0.95]
        this.speedFright = [0.5, 0.55, 0.6]
        this.speedTunnel = [0.4, 0.45, 0.5]

        this.level = level;
        this.state = state.SCATTER;
        this.nextTile = 0; //TODO CHANGE
        this.nexDir = 0;
        this.targetTile = 0;
        this.map = map;
        this.currentTile = this.map.getTilePos(this.sprite);

        this.canDraw = true;
        this.canMove = false;

        this.inTunnel = false;
        this.inScatter = 4;
        this.scatterTimes = [[7, 7, 5, 5], [7, 7, 5, 1/60], [5, 5, 5, 1/60] ]
        this.timeScatter = this.scatterTimes[this.level][4 - this.inScatter] * 1000
        this.chaseTimes = [[20, 20, 20], [20, 20, 1033], [20, 20, 1037]]
        this.inChase = 0;
        this.timeChase = this.chaseTimes[this.level][this.inChase] * 1000
        this.flashes = 8*4;
        this.scaredTimes = [4, 3, 2]
        this.timeScared = this.scaredTimes[this.level]*1000;
        this.prevState = this.state;
        this.time = 0;
        this.timeInState = 0;
        this.inBlink = false;
        this.inBox = false;
        this.awaitTile = true;
    }

    setPacman(pacaman){
        this.pacaman = pacaman;
    }

    addAnimations(){
        // Add full stop RIGHT

        this.sprite.addAnimation();
        this.sprite.addKeyframe(ghost_directions.EAT_RIGHT, [0, 0, 32, 32]);
        this.sprite.addKeyframe(ghost_directions.EAT_RIGHT, [32, 0, 32, 32]);

        // Add movement LEFT

        this.sprite.addAnimation();
        this.sprite.addKeyframe(ghost_directions.EAT_LEFT, [64, 0, 32, 32]);
        this.sprite.addKeyframe(ghost_directions.EAT_LEFT, [96, 0, 32, 32]);

        // Add movement UP

        this.sprite.addAnimation();
        this.sprite.addKeyframe(ghost_directions.EAT_UP, [128, 0, 32, 32]);
        this.sprite.addKeyframe(ghost_directions.EAT_UP, [160, 0, 32, 32]);

        // Add movement DOWN


        this.sprite.addAnimation();
        this.sprite.addKeyframe(ghost_directions.EAT_DOWN, [0, 32, 32, 32]);
        this.sprite.addKeyframe(ghost_directions.EAT_DOWN, [32, 32, 32, 32]);

        this.sprite.addAnimation();
        this.sprite.addKeyframe(ghost_directions.SCARED, [0, 192, 32, 32])
        this.sprite.addKeyframe(ghost_directions.SCARED, [32, 192, 32, 32])

        this.sprite.addAnimation();
        this.sprite.addKeyframe(ghost_directions.DEAD_RIGHT, [64, 160, 32, 32])
        this.sprite.addAnimation();
        this.sprite.addKeyframe(ghost_directions.DEAD_LEFT, [96, 160, 32, 32])
        this.sprite.addAnimation();
        this.sprite.addKeyframe(ghost_directions.DEAD_UP, [128, 160, 32, 32])
        this.sprite.addAnimation();
        this.sprite.addKeyframe(ghost_directions.DEAD_DOWN, [160, 160, 32, 32])

        this.sprite.addAnimation();
        this.sprite.addKeyframe(ghost_directions.BLINK, [0, 192, 32, 32])
        this.sprite.addKeyframe(ghost_directions.BLINK, [32, 192, 32, 32])
        this.sprite.addKeyframe(ghost_directions.BLINK, [0, 192, 32, 32])
        this.sprite.addKeyframe(ghost_directions.BLINK, [32, 192, 32, 32])
        this.sprite.addKeyframe(ghost_directions.BLINK, [64, 192, 32, 32])
        this.sprite.addKeyframe(ghost_directions.BLINK, [96, 192, 32, 32])
        this.sprite.addKeyframe(ghost_directions.BLINK, [64, 192, 32, 32])
        this.sprite.addKeyframe(ghost_directions.BLINK, [96, 192, 32, 32])
        

        //Should decide based on the pos of pacman
        this.sprite.setAnimation(ghost_directions.EAT_LEFT);
        this.direction = ghost_directions.EAT_LEFT
        this.nexDir = this.direction
        this.getNextTile()

        
    }


    getSpeedPercentage(){
        if(this.inTunnel){
            return this.speedTunnel[this.level]
        }
        if(this.state == state.FRIGHTENED){
            return this.speedFright[this.level]
        }
        return this.speedByLevel[this.level]
       
        //return 1
    }

    handleUpdate(deltaTime){

        this.time += deltaTime;

        if(this.canMove){
            this.timeInState += deltaTime;
           //IF esta en la proxima tile 
            //Solo me intersa cuando esta en current Tile y esta en la mitad
            this.move();
            let currentTile =this.map.getTilePos(this.sprite);
            // En x tiene mitad en un tile y mitad en el otr

            if(!this.awaitTile && this.checkMiddle(currentTile) ){
                //console.log(this.direction, this.sprite.currentAnimation)
                if(this.state != state.FRIGHTENED && this.state != state.DEAD)
                    this.sprite.setAnimation(this.nexDir)
                if(this.state == state.DEAD){
                    this.sprite.setAnimation(this.getDeadDirection(this.nexDir))
                }
                //this.currentTile = this.map.getTilePos(this.sprite);
                //Esto solo se debe hacer cuando esta en el centro del tile
                this.direction = this.nexDir;
                this.awaitTile = true;
                //this.getNextTile();
                
            }
            if(this.checkTile(currentTile) && this.awaitTile){
                this.currentTile = currentTile
                this.awaitTile = false;
                this.getNextTile();
            }
            
            // if(this.checkTile(currentTile) ){
            //     // this.currentTile = currentTile;
            //     // //Esto solo se debe hacer cuando esta en el centro del tile
            //     // this.direction = this.nexDir;
            //     // this.getNextTile();
            // } 
            this.sprite.update(deltaTime)
            if(this.inBlink && this.sprite.currentKeyframe == 0 ){
                this.flashes -= 1
            }
            this.checkState();
        }
        if(this.inBox){
            let posX = 13;
            let posY = 11;
            let posX2 = 14;
            if(this.currentTile == posY * this.map.map.width + posX || this.currentTile == posY * this.map.map.width + posX2 ){
                this.inBox = false;
            }
        }

        

    }

    setSpeed(ghost){
        ghost.inTunnel = false;
    }


    draw(){
        if(this.canDraw)
            this.sprite.draw();
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
      }

    getNextTile(){
       // console.log('SPEED',this.speed)
        if(this.state == state.CHASE){
            let pacmanTile = this.map.getTilePos(this.pacaman.sprite);
            this.targetTile = pacmanTile;
        }
        if(this.state == state.SCATTER){
            let tileposX = 23;
            let tileposY = 3;
            this.targetTile = tileposY * this.map.map.width + tileposX;
        }
        if(this.state == state.DEAD){
            let tileposX = 13;
            let tileposY = 14;
            this.targetTile = tileposY * this.map.map.width + tileposX;
        }
        let availableDirs = this.map.getAvailableDirections(this.currentTile, this.direction, this.nexDir, this);
        availableDirs = availableDirs.sort((a, b) => this.tileComparator(a, b));
        if(this.state == state.FRIGHTENED){
            let direction = this.getRandomInt(0, 4)

            availableDirs = availableDirs.sort((a, b) => this.dirComparator(a, b, direction));
        }

        if(availableDirs.length == 0){
            console.log('no more')
            //console.log('check middle')
            //Si estos en la x=27 y=14 o si estoy en x=0 y=14;
            let pos = this.map.getTilePos(this.sprite);
            let posLeft = 14*this.map.map.width;
            let posRight = 14*this.map.map.width + 27;
           // console.log(pos, posLeft, posRight)
            if(pos == posLeft){
                //In left tunnel
                this.nexDir = ghost_directions.EAT_LEFT;
                this.sprite.x = this.map.map.width * this.map.map.tilewidth - this.sprite.width;
                this.nextTile = posRight - 1;
                this.inTunnel = true;
                setTimeout(this.setSpeed, 1000, this)
            }
            if(pos == posRight){
                //In right tunnel
                this.nexDir = ghost_directions.EAT_RIGHT
                this.sprite.x = 0;
                this.nextTile = posLeft + 1;
                this.inTunnel = true;
                setTimeout(this.setSpeed, 1000, this)
                
            }
            return;
        }
         
        //I wanto to go from currentTile to pacman tile
        //First I have to check direction

        //Me fijo la dir!
        //Mayor dif en x o en y 
        //  up, left, down, and right
        //Si alguno es 0 se mueve en el otro
        //Lo ordeno basandome en la distancia de la tile al target, mejor los tiles
       
        //console.log(availableDirs)

        this.nexDir = availableDirs[0].dir;
        this.nextTile = availableDirs[0].tile;
        //this.sprite.setAnimation(this.direction)


        

        
        //Scatter
        //Frightened
        //Chase
    }

    move(){
        //console.log(this.speed * this.getSpeedPercentage())
        switch(this.direction){
            case ghost_directions.EAT_DOWN:  this.sprite.y += this.speed * this.getSpeedPercentage(); break;
            case ghost_directions.EAT_UP: this.sprite.y -= this.speed * this.getSpeedPercentage(); break;
            case ghost_directions.EAT_RIGHT: this.sprite.x += this.speed * this.getSpeedPercentage(); break;
            case ghost_directions.EAT_LEFT: this.sprite.x -= this.speed * this.getSpeedPercentage(); break;
        }
    }

    getDistance(tile1, tile2){
        let posY1 = Math.floor(tile1 / this.map.map.width);
        let posX1 = tile1 - posY1 * this.map.map.width;

        let posY2 = Math.floor(tile2 / this.map.map.width);
        let posX2 = tile2 - posY2 * this.map.map.width;
        
        return Math.sqrt(Math.pow(posX2 - posX1, 2) + Math.pow(posY2 - posY1, 2))

    }

    tileComparator(a , b){
        let dis1 = this.getDistance(a.tile, this.targetTile);
        let dis2 = this.getDistance(b.tile, this.targetTile);
        //console.log(a, dis1, b, dis2)
        if(dis1 < dis2)
            return -1;
        if(dis1 > dis2)
            return 1;
        return this.compareDir(a, b)
    }

    dirComparator(a , b, random){
        if(a.dir == random){
            return -1
        }
        if(b.dir == random){
            return 1
        }
        return this.compareDir(a, b)
    }

    compareDir(a, b){
        //up, left, down, and right
        let priority = [ghost_directions.EAT_UP, ghost_directions.EAT_LEFT, ghost_directions.EAT_DOWN, ghost_directions.EAT_RIGHT]
        let p = priority.findIndex(v => v == a.dir)
        let p2 = priority.findIndex(v => v == b.dir)
        if(p <= p2)
            return 1;
        else
            return -1;
    }

    checkTile(currentTile){
        //console.log('checking tile nextDir', this.nexDir, 'dir', this.direction, 'currentTile', currentTile, 'nextTile', this.nextTile)

        if(this.nexDir != this.direction){
            switch(this.nexDir){
                case ghost_directions.EAT_DOWN:  return currentTile == this.nextTile-this.map.map.width;
                case ghost_directions.EAT_UP: return currentTile == this.nextTile+this.map.map.width;
                case ghost_directions.EAT_RIGHT: return currentTile == this.nextTile-1
                case ghost_directions.EAT_LEFT: return currentTile == this.nextTile + 1
            }
        }else{
            return currentTile  == this.nextTile
        }
    }

    checkMiddle(currentTile){
        let posY = Math.floor(currentTile / this.map.map.width);
        let posX = currentTile - posY * this.map.map.width;
        //Esquina derecha abajo!
        let tileX = posX * this.map.tileSize[0] + this.map.basePos[0];
        let tileY = posY * this.map.tileSize[1] + this.map.basePos[1];
        
        //Middle
        let middleX = tileX + this.map.tileSize[0]/2;
        let middleY = tileY + this.map.tileSize[1]/2;

        let x = Math.floor(this.sprite.x + this.sprite.width/2);
        let y = Math.floor(this.sprite.y + this.sprite.width/2);
        let a = this.map.getTilePos(this.sprite)
        //Voy a conciderar el centro cuando esta en el borde del tile
        //console.log('checking middle x', x, 'y', y, 'middleX', middleX, 'middleY', middleY, 'posX', posX, 'posY', posY)
        switch(this.direction){
            case ghost_directions.EAT_LEFT:{
                //console.log('L')
                if(x > middleX )
                    return false;
                if(!this.awaitTile)
                    this.sprite.x = middleX - this.sprite.width/2;
                break;
            }
            case ghost_directions.EAT_RIGHT:{
                //console.log('R')
                if(x  < middleX )
                    return false;
                if(!this.awaitTile)
                    this.sprite.x = middleX - this.sprite.width/2;
                break;
            }
            case ghost_directions.EAT_UP:{
               // console.log('U')
                if(y  > middleY )
                    return false;
                if(!this.awaitTile)
                    this.sprite.y = middleY - this.sprite.width/2;
                break;
            }
            case ghost_directions.EAT_DOWN:{
                //console.log('D')
                if(y < middleY )
                    return false;
                if(!this.awaitTile)
                    this.sprite.y = middleY - this.sprite.width/2;
                break;
            }
        }
       // console.log('MIDDLE!')
        return true;

    }

    killed(){
        //this.canDraw = false;
        this.canMove = false;
    }

    erase(){
        this.canDraw = false;
    }

    reset(ghost){
        ghost.sprite.x = 13* (ghost.map.tileSize[0]) + ghost.map.basePos[0] - 8;
        ghost.sprite.y = 11*(ghost.map.tileSize[1]) + ghost.map.basePos[1] - 8;
        this.sprite.setAnimation(ghost_directions.EAT_LEFT);
        this.direction = ghost_directions.EAT_LEFT
        this.nexDir = this.direction
        this.currentTile = this.map.getTilePos(this.sprite);
        this.getNextTile()

        ghost.canDraw = true;
        ghost.canMove = false;
    }

    startGame(){
        this.canMove = true;
        console.log('start')
    }

    chase(){
        console.log('chase')
        this.inScatter -= 1
        this.timeScatter = this.scatterTimes[this.level][4 - this.inScatter] * 1000
        this.timeInState = 0;
        this.state = state.CHASE
        this.direction = this.reversed();
        this.nexDir = this.direction;
        this.getNextTile();
    }

    scatter(){
        console.log('scatter')
        this.timeInState = 0;
        this.inChase += 1
        if(this.inChase < 3)
            this.timeChase = this.chaseTimes[this.level][this.inChase] * 1000
        this.state = state.SCATTER
        this.direction = this.reversed();
        this.nexDir = this.direction;
        this.getNextTile();
    }

    getScared(){
        this.sprite.setAnimation(ghost_directions.SCARED)
        if(this.state != state.FRIGHTENED)
            this.prevState = this.state;
        this.timeInState = 0;
        this.inBlink = false;
        this.direction = this.reversed();
        this.nexDir = this.direction;
       
        this.state = state.FRIGHTENED;
        this.getNextTile();

        //setTimeout(this.blink, this.timeScared, this)
    }

    reversed(){
        if(this.direction == ghost_directions.EAT_DOWN)
            return ghost_directions.EAT_UP
        if(this.direction == ghost_directions.EAT_UP)
            return ghost_directions.EAT_DOWN
        if(this.direction == ghost_directions.EAT_LEFT)
            return ghost_directions.EAT_RIGHT
        if(this.direction == ghost_directions.EAT_RIGHT)
            return ghost_directions.EAT_LEFT
    }

    reverseTile(){
        if(this.direction == ghost_directions.EAT_DOWN || this.direction == ghost_directions.EAT_RIGHT){
            this.targetTile -= 2;
        }else{
            this.targetTile += 2;
        }
        
        
    }

    blink(){
        console.log('blink', this.timeInState/1000)
       
        this.inBlink = true;
        this.sprite.setAnimation(ghost_directions.BLINK)
        
        
    }

    returnToNormal(){
        console.log('normal', this.timeInState/1000)
        this.state = this.prevState;
        this.timeInState = 0;
        this.flashes = 8*4;
        this.inBlink = false;
        this.direction = this.reversed();
        this.nexDir = this.direction;
        this.getNextTile();
        this.sprite.setAnimation(this.direction)
        this.pacaman.returnToNormal();

    }
    checkState(){
        switch (this.state) {
            case state.CHASE:
                if(this.inScatter >= 0 && this.timeInState >= this.timeChase){
                    this.scatter();
                }
                break;
            case state.SCATTER:
                if(this.timeInState >= this.timeScatter)
                    this.chase();
                break;
            case state.FRIGHTENED:
                if(this.timeInState >= this.timeScared && !this.inBlink){
                    this.blink();
                    break;
                }  
                if(this.inBlink && this.flashes == 0){
                    this.returnToNormal();
                    break;
                }
                break;
                
            case state.DEAD:
                if(this.currentTile == this.targetTile && this.checkMiddle(this.currentTile) ){
                    this.inBox = true;
                    this.sprite.setAnimation(ghost_directions.EAT_UP);
                    this.direction = ghost_directions.EAT_UP
                    this.nexDir = this.direction
                    this.currentTile = this.map.getTilePos(this.sprite);
                    if(this.inScatter > 0){
                        this.scatter()
                    }else{
                        this.chase();
                    }
                    this.getNextTile();
                }
                break;
                
            default:
                break;
        }
    }

    isDead(){
        this.state = state.DEAD;
        //this.direction = this.getDeadDirection(this.direction)
        this.sprite.setAnimation(this.getDeadDirection(this.direction))
        //this.getNextTile();
        
    }

    getDeadDirection(direction){
        switch(direction){
            case ghost_directions.EAT_DOWN: {
                return ghost_directions.DEAD_DOWN
            }
            case ghost_directions.EAT_UP: {
                return ghost_directions.DEAD_UP
            }
            case ghost_directions.EAT_RIGHT: {
                return ghost_directions.DEAD_RIGHT
            }
            case ghost_directions.EAT_LEFT: {
                return ghost_directions.DEAD_LEFT
            }
        }
    }

    updateCounter(){
        //No hace nada porque blinky no tiene counter
    }

}