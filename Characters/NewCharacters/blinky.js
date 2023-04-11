class Blinky extends Ghost{

    constructor(map, level, startXImg, startYImg, startDirection, startX, startY){
        super(map, level, startXImg, startYImg, startDirection, startX, startY)
        this.inBox = false;
        this.elroySpeed = [[0.8, 0.85], [0.9, 0.95], [1, 1.05]]
        this.elroy = 0;
        
    }

    getSpeedPercentage(){
        if(this.inTunnel){
            return this.speedTunnel[this.level]
        }
        if(this.state == state.FRIGHTENED){
            return this.speedFright[this.level]
        }
        if(this.elroy == 0)
            return this.speedByLevel[this.level]
        return this.elroySpeed[this.level][this.elroy-1]
    }

    setElroy(){
        this.elroy += 1
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
        if(this.elroy == 0)
            return tileposY * this.map.map.width + tileposX;
        return this.map.getTilePos(this.pacaman.sprite); //pacmantile
    }

    getDeathTile(){
        let tileposX = 13;
        let tileposY = 14;
        return tileposY * this.map.map.width + tileposX;
    }
}