class Blinky{

    constructor(map){
        var t = new Texture("././img/ghosts_sprites.png");
        //this.sprite = new Sprite((448/2) - 16 , (544/2) - 56, 32, 32, 16, t);
        this.sprite = new Sprite(13* (map.tileSize[0]) + map.basePos[0] - 8 , 11*(map.tileSize[1]) + map.basePos[1] - 8, 32, 32, 16, t);
        this.sprite.setCollisionBox([6, 6], [22, 22])
        this.speed = 2; 
        this.state = state.SCATTER;
        this.nextTile = 0; //TODO CHANGE
        this.nexDir = 0;
        this.targetTile = 0;
        this.map = map;
        this.currentTile = this.map.getTilePos(this.sprite);
        this.canDraw = true;
        this.canMove = false;
        this.inScatter = 3;
        this.timeScatter = 7*1000;
        this.timeChase = 20*1000;
        this.timeScared = 4*1000;
        this.timeBlink = 8*1000;
        this.prevState = this.state;
        this.time = 0;
        this.timeInState = 0;
        this.inBlink = false;
        this.inBox = false;
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
        this.sprite.addKeyframe(ghost_directions.DEAD, [64, 160, 32, 32])

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

    handleUpdate(deltaTime){

        this.time += deltaTime;
        this.timeInState += deltaTime;
        
        if(this.canMove){
           //IF esta en la proxima tile 
            //Solo me intersa cuando esta en current Tile y esta en la mitad
            this.move();
            let currentTile =this.map.getTilePos(this.sprite);
            // En x tiene mitad en un tile y mitad en el otr

            if(this.checkMiddle(currentTile)){
                //console.log(this.direction, this.sprite.currentAnimation)
                if(this.state != state.FRIGHTENED && this.state != state.DEAD)
                    this.sprite.setAnimation(this.nexDir)
                
                //this.currentTile = this.map.getTilePos(this.sprite);
                //Esto solo se debe hacer cuando esta en el centro del tile
                this.direction = this.nexDir;
                //this.getNextTile();
            }
            if(this.checkTile(currentTile) && currentTile != this.currentTile){
                this.currentTile = currentTile
                this.getNextTile();
            }
            
            // if(this.checkTile(currentTile) ){
            //     // this.currentTile = currentTile;
            //     // //Esto solo se debe hacer cuando esta en el centro del tile
            //     // this.direction = this.nexDir;
            //     // this.getNextTile();
            // } 
            this.sprite.update(deltaTime)
        }
        if(this.inBox){
            let posX = 13;
            let posY = 11;
            let posX2 = 14;
            if(this.currentTile == posY * this.map.map.width + posX || this.currentTile == posY * this.map.map.width + posX2 ){
                this.inBox = false;
            }
        }

        this.checkState();

    }



    draw(){
        if(this.canDraw)
            this.sprite.draw();
    }

    getScared(){
        this.sprite.setAnimation(ghost_directions.SCARED)
        this.prevState = this.state;
        this.timeInState = 0;
        this.state = state.FRIGHTENED;

        //setTimeout(this.blink, this.timeScared, this)
    }

    blink(){
        console.log('blink')
       
        this.inBlink = true;
        this.sprite.setAnimation(ghost_directions.BLINK)
        
        
    }

    returnToNormal(){
        console.log('normal')
        this.state = this.prevState;
        this.timeInState = 0;
        this.sprite.setAnimation(this.direction)
    }

    setSpeed(sprite, speed){
        sprite.speed = speed;
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
            availableDirs = availableDirs.sort((a, b) => 0.5 - Math.random());
        }

        if(availableDirs.length == 0){
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
                this.nextTile = posRight;
                this.setSpeed(this, 1)
                setTimeout(this.setSpeed, 1000, this, 2)
            }
            if(pos == posRight){
                //In right tunnel
                this.nexDir = ghost_directions.EAT_RIGHT
                this.sprite.x = 0;
                this.nextTile = posLeft;
                this.setSpeed(this, 1)
                setTimeout(this.setSpeed, 1000, this, 2)
                
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
        switch(this.direction){
            case ghost_directions.EAT_DOWN:  this.sprite.y += this.speed; break;
            case ghost_directions.EAT_UP: this.sprite.y -= this.speed; break;
            case ghost_directions.EAT_RIGHT: this.sprite.x += this.speed; break;
            case ghost_directions.EAT_LEFT: this.sprite.x -= this.speed; break;
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

    compareDir(a, b){
        //up, left, down, and right
        let priority = [ghost_directions.EAT_UP, ghost_directions.EAT_LEFT, ghost_directions.EAT_DOWN, ghost_directions.EAT_RIGHT]
        let p = priority.find(v => v == a.dir)
        let p2 = priority.find(v => v == b.dir)
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
                if(x != middleX)
                    return false;
                break;
            }
            case ghost_directions.EAT_RIGHT:{
                //console.log('R')
                if(x  != middleX)
                    return false;
                break;
            }
            case ghost_directions.EAT_UP:{
               // console.log('U')
                if(y  != middleY)
                    return false;
                break;
            }
            case ghost_directions.EAT_DOWN:{
                //console.log('D')
                if(y != middleY)
                    return false;
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
        ghost.canMove = true;
    }

    startGame(){
        this.canMove = true;
        console.log('start')
    }

    chase(){
        console.log('chase')
        this.inScatter -= 1
        if(this.inScatter == 1){
            this.timeScatter = 5*1000;
        }
        this.timeInState = 0;
        this.state = state.CHASE
        this.getNextTile();
    }

    scatter(){
        console.log('scatter')
        this.timeInState = 0;
        this.state = state.SCATTER
        this.getNextTile();
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
                if(this.timeInState >= this.timeBlink + this.timeScared){
                    this.returnToNormal();
                    break;
                }
                if(this.timeInState >= this.timeScatter && !this.inBlink)
                    this.blink();
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
                }
                break;
                
            default:
                break;
        }
    }

    isDead(){
        this.state = state.DEAD;
        this.direction = ghost_directions.DEAD;
        this.sprite.setAnimation(ghost_directions.DEAD)
        this.getNextTile();
        
    }

}