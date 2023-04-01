class Blinky extends Ghost{

    constructor(map, level, startXImg, startYImg, startDirection, startX, startY){
        super(map, level, startXImg, startYImg, startDirection, startX, startY)
        this.inBox = false;
        
    }
    
    canExit(){
        return true;
    }

    getTarget(pacmanTile){
        return pacmanTile;
    }

    getScatterTile(){
        let tileposX = 23;
        let tileposY = 3;
        return tileposY * this.map.map.width + tileposX;
    }

    getDeathTile(){
        let tileposX = 13;
        let tileposY = 14;
        return tileposY * this.map.map.width + tileposX;
    }
}