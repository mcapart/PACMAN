class Inky extends Ghost{

    constructor(map, level, startXImg, startYImg, startDirection, startX, startY){
        super(map, level, startXImg, startYImg, startDirection, startX, startY)
        this.dotLimitByLevel = [30, 0, 0]
        this.dotLimit = this.dotLimitByLevel[this.level];
        this.globalLimit = 17;
        this.active = false;
        
    }
    setPacman(pacaman){
        this.pacaman = pacaman;
        this.blinky = pacaman.ghosts[0]
    }

    canExit(){
        if(!this.started)
            return false
        if(this.exit){
            return true;
        }
        if(this.globalActive){
            if(this.globalCounter >= this.globalLimit){
                this.pacaman.ghosts[3].canMove = true;
                return true;
            }else{
                return false;
            }
        }   
        if(this.dotCounter == this.dotLimit){
            this.active = false;
            this.pacaman.ghosts[3].active = true;
            this.pacaman.ghosts[3].canMove = true;
            return true
        }
        return false;
    }

    getTarget(pacmanTile){
        let posY = Math.floor(pacmanTile / this.map.map.width);
	    let posX = (pacmanTile - posY * this.map.map.width);
        switch(this.pacaman.direction){
            case PACMAN_STOP_RIGHT:
            case PACMAN_EAT_RIGHT:
                posX += 2
                break;
            case PACMAN_STOP_LEFT:
            case PACMAN_EAT_LEFT:
                posX -= 2
                break;
            case PACMAN_STOP_DOWN:
            case PACMAN_EAT_DOWN:
                posY += 2
                break;
            case PACMAN_STOP_UP:
            case PACMAN_EAT_UP:
                posY -= 2
                break;
        }
        let blinkyY = Math.floor(this.blinky.currentTile / this.map.map.width);
	    let blinkyX = (this.blinky.currentTile  - blinkyY * this.map.map.width);
        let difX = posX - blinkyX;
        let difY = posY - blinkyY
        posY += difY;
        posX += difX;

        return  posY * this.map.map.width + posX;
    }

    getScatterTile(){
        let tileposX = 18;
        let tileposY = 30;
        return tileposY * this.map.map.width + tileposX;
    }

    getDeathTile(){
        let tileposX = 11;
        let tileposY = 14;
        return tileposY * this.map.map.width + tileposX;
    }
}