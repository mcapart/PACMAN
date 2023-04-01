class Clyde extends Ghost{

    constructor(map, level, startXImg, startYImg, startDirection, startX, startY){
        super(map, level, startXImg, startYImg, startDirection, startX, startY)
        this.dotLimitByLevel = [60, 50, 0]
        this.dotLimit = this.dotLimitByLevel[this.level];
        this.globalLimit = 32;
        this.active = false;
        
    }

    canExit(){
        if(!this.started)
            return false
        if(this.exit)
            return true;
        if(this.globalActive)
            return this.globalCounter >= this.globalLimit
        if(this.dotCounter == this.dotLimit){
            this.active = false;
            return true
        }
        return false;
    }

    getTarget(pacmanTile){
        if(this.getDistance(pacmanTile, this.currentTile) <= 8){
            let tileposX = 4;
            let tileposY = 30;
            return tileposY * this.map.map.width + tileposX;
        }else{
            return pacmanTile;
        }
    }

    getScatterTile(){
        let tileposX = 4;
        let tileposY = 30;
        return tileposY * this.map.map.width + tileposX;
    }

    getDeathTile(){
        let tileposX = 15;
        let tileposY = 14;
        return tileposY * this.map.map.width + tileposX;
    }
}