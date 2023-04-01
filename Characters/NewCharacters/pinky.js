class Pinky extends Ghost{

    constructor(map, level, startXImg, startYImg, startDirection, startX, startY){
        super(map, level, startXImg, startYImg, startDirection, startX, startY)
        this.dotLimitByLevel = [0, 0, 0]
        this.dotLimit = this.dotLimitByLevel[this.level];
        this.globalLimit = 7;
        this.active = false;
        
    }

    canExit(){
         if(!this.started)
            return false
        if(this.exit){
            return true;
        }
        if(this.globalActive){
            if(this.globalCounter >= this.globalLimit){
                this.pacaman.ghosts[2].canMove = true;
                return true;
            }else{
                return false;
            }
        }
       
        if(this.dotCounter == this.dotLimit){
            this.active = false;
            this.pacaman.ghosts[2].canMove = true;
            this.pacaman.ghosts[2].active = true;
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
                posX += 4
                break;
            case PACMAN_STOP_LEFT:
            case PACMAN_EAT_LEFT:
                posX -= 4
                break;
            case PACMAN_STOP_DOWN:
            case PACMAN_EAT_DOWN:
                posY += 4
                break;
            case PACMAN_STOP_UP:
            case PACMAN_EAT_UP:
                posY -= 4
                break;
        }
        return  posY * this.map.map.width + posX;
    }

    getScatterTile(){
        let tileposX = 3;
        let tileposY = 3;
        return tileposY * this.map.map.width + tileposX;
    }

    getDeathTile(){
        let tileposX = 13;
        let tileposY = 14;
        return tileposY * this.map.map.width + tileposX;
    }
}