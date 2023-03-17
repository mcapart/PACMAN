
// Tilemap. Draws a tilemap using a texture as a tilesheet.

const directions = {
	LEFT: 1,
	RIGHT: 2,
	UP: 3,
	DOWN: 4
}

const cornering = {
	NONE: 0,
	PRE: 1,
	OVER: 2
}

function Tilemap(tilesheet, tileSize, blockGrid, basePos, map)
{
	this.tileSize = tileSize;
	this.basePos = basePos;
	this.blockGrid = blockGrid;
	this.map = map

	this.tilesheet = tilesheet;
}

Tilemap.prototype.draw = function ()
{
	// Only draw if tilesheet texture already loaded
	if(!this.tilesheet.isLoaded())
		return;
		
	// Size of each block in pixels
	// Va a ser de 16x16
	blockSize = [this.tilesheet.width() / this.blockGrid[0], this.tilesheet.height() / this.blockGrid[1]];
	
	// Compute block positions in tilesheet
	var tilePositions = [];
	for(var y=0, tileId=0; y<this.blockGrid[1]; y++)
		for(var x=0; x<this.blockGrid[0]; x++, tileId++)
			tilePositions.push([x * blockSize[0], y * blockSize[1]]);
			
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Draw the map
	var tileId;
	context.imageSmoothingEnabled = false;
	for(var j=0, pos=0; j<this.map.height; j++)
		for(var i=0; i<this.map.width; i++, pos++)
		{
			tileId = this.map.layers[0].data[pos];
			if(tileId != 0)
				context.drawImage(this.tilesheet.img, tilePositions[tileId-1][0], tilePositions[tileId-1][1], blockSize[0], blockSize[1], 
				                  this.basePos[0] + this.tileSize[0] * i, this.basePos[1] + this.tileSize[1] * j, blockSize[0], blockSize[1]);
		}
}

Tilemap.prototype.collisionLeft = function(sprite)
{
	var tilePos = this.getTilePose(sprite, directions.LEFT)
	
	return tileId = this.map.layers[0].data[tilePos];
}

Tilemap.prototype.collisionRight = function(sprite)
{
	var tilePos = this.getTilePose(sprite, directions.RIGHT)
	console.log(tilePos)
	
	return tileId = this.map.layers[0].data[tilePos];
}

Tilemap.prototype.collisionUp = function(sprite)
{
	var tilePos = this.getTilePose(sprite, directions.UP)
	
	return tileId = this.map.layers[0].data[tilePos];
}

Tilemap.prototype.collisionDown = function(sprite)
{
	var tilePos = this.getTilePose(sprite, directions.DOWN)
	
	return tileId = this.map.layers[0].data[tilePos];
}

Tilemap.prototype.replaceTileLeft = function(sprite)
{
	var tilePos = this.getTilePose(sprite, directions.LEFT)
	this.map.layers[0].data[tilePos] = 0;
}

Tilemap.prototype.replaceTileRight = function(sprite)
{
	var tilePos = this.getTilePose(sprite, directions.RIGHT)
	this.map.layers[0].data[tilePos] = 0;
}

Tilemap.prototype.replaceTileUp = function(sprite)
{
	var tilePos = this.getTilePose(sprite, directions.UP)
	this.map.layers[0].data[tilePos] = 0;
}

Tilemap.prototype.replaceTileDown = function(sprite)
{
	var tilePos = this.getTilePose(sprite, directions.DOWN)
	this.map.layers[0].data[tilePos] = 0;
}

Tilemap.prototype.getTilePose = function(sprite, direction){
	switch (direction) {
		case directions.LEFT:
			var x = Math.floor((sprite.x - this.basePos[0] + sprite.box.min[0]) / this.tileSize[0]);
			var y = Math.floor((sprite.y - this.basePos[1] + (sprite.box.min[1] + sprite.box.max[1]) / 2) / this.tileSize[1]);
			return y * this.map.width + x;
		case directions.RIGHT:
			var x = Math.floor((sprite.x - this.basePos[0] + sprite.box.max[0]) / this.tileSize[0]);
			var y = Math.floor((sprite.y - this.basePos[1] + (sprite.box.min[1] + sprite.box.max[1]) / 2) / this.tileSize[1]);
			console.log("colision, x", x, "y", y)
			return y * this.map.width + x;
		case directions.UP:
			var x = Math.floor((sprite.x - this.basePos[0] + (sprite.box.min[0] + sprite.box.max[0]) / 2) / this.tileSize[0]);
			var y = Math.floor((sprite.y - this.basePos[1] + sprite.box.min[1]) / this.tileSize[1]);
			return y * this.map.width + x;
		case directions.DOWN:
			var x = Math.floor((sprite.x - this.basePos[0] + (sprite.box.min[0] + sprite.box.max[0]) / 2) / this.tileSize[0]);
			var y = Math.floor((sprite.y - this.basePos[1] + sprite.box.max[1]) / this.tileSize[1]);
			return y * this.map.width + x;
	}
}

Tilemap.prototype.getSpriteX = function(sprite, direction){
	x = sprite.x + sprite.width/2;
	console.log("x", x - this.basePos[0])
	switch (direction) {
		case directions.LEFT:
			var x = Math.ceil((x - this.basePos[0] ) / this.tileSize[0]);
			console.log(x)
			return x
		case directions.RIGHT:
			var x = Math.ceil((x - this.basePos[0] ) / this.tileSize[0]);
			return x;
		case directions.UP:
			var x = Math.ceil((x - this.basePos[0] ) / this.tileSize[0]);
			return  x;
		case directions.DOWN:
			var x = Math.ceil((x - this.basePos[0] ) / this.tileSize[0]);
			return x;
	}
}

Tilemap.prototype.getSpriteY = function(sprite, direction){
	y = sprite.y + sprite.width/2;
	console.log("yyy", (y - this.basePos[1] )/this.tileSize[1])
	switch (direction) {
		case directions.LEFT:
			var y = Math.ceil((y - this.basePos[1] ) / this.tileSize[1]);
			console.log(y)
			return y 
		case directions.RIGHT:
			var y = Math.ceil((y - this.basePos[1] ) / this.tileSize[1]);
			return y 
		case directions.UP:
			var y = Math.ceil((y - this.basePos[1]) / this.tileSize[1]);
			return y 
		case directions.DOWN:
			var y = Math.ceil((y - this.basePos[1] ) / this.tileSize[1]);
			return y 
	}
}


/**
 * 
 * @param {Sprite} sprite: el sprite actual
 * @param {Enumerator} direction: la direccion del sprite
 * @param {number} originalX: la posicion original del sprite cuando comenzo a hacer cornering (para calcular el mid)
 * @param {number} originalY: la posicion original del sprite cuando comenzo a hacer cornering (para calcular el mid)
 * @returns 
 */
Tilemap.prototype.isInMiddle = function(sprite, direction, originalX, originalY, corneringP){
	let s =  JSON.parse(JSON.stringify(sprite));
	s.x = originalX;
	s.y = originalY;
	console.log("soriginal.x", s.x, "sprite", sprite.x);

	posX = this.getSpriteX(s, direction);
	posY = this.getSpriteY(s, direction);
	tilePos =  posY * this.map.width + posX;
	//Esquina derecha abajo!
	tileX = posX * this.tileSize[0] + this.basePos[0];
	tileY = posY * this.tileSize[1] + this.basePos[1];
	
	//Middle
	middleX = tileX - this.tileSize[0]/2;
	middleY = tileY - this.tileSize[1]/2;


	x = Math.floor(sprite.x + sprite.width/2);
	y = Math.floor(sprite.y + sprite.width/2);
	console.log("check the middle", middleX, " ", middleY, "x", x, "y", y, "tileX", tileX, "tileY", tileY, "tilePos", tilePos);
	switch (direction) {
		case directions.LEFT:
			if(corneringP == cornering.PRE){
				if(Math.floor(x) <= middleX){
					sprite.x = middleX - sprite.width/2;
					return true;
				}
				return false;
			}else{
				if(Math.floor(x) >= middleX){
					sprite.x = middleX - sprite.width/2;
					return true;
				}
				return false;
			}
		case directions.RIGHT:
			if(corneringP == cornering.PRE){
				if(Math.floor(x) >= middleX){
					sprite.x = middleX - sprite.width/2
					return true;
				}
				return false;
			}else{
				if(Math.floor(x) <= middleX){
					sprite.x = middleX - sprite.width/2;
					return true;
				}
				return false;
			}
		case directions.UP:
			if(corneringP == cornering.PRE){
				if( Math.floor(y) <= middleY){
					sprite.y = middleY - sprite.height/2
					return true;
				}
				return false;
			}else{
				if( Math.floor(y) >= middleY){
					sprite.y = middleY - sprite.height/2
					return true;
				}
				return false;
			}
		case directions.DOWN:
			if(corneringP == cornering.PRE){
				if( Math.floor(y) >= middleY){
					sprite.y = middleY - sprite.height/2
					return true;
				}
				return false;
			}else{
				if( Math.floor(y) <= middleY){
					console.log(middleY, middleY-sprite.height/2, sprite.x)
					sprite.y = middleY - sprite.height/2
					return true;
				}
				return false;
			}
	}

}

Tilemap.prototype.isCornering = function(sprite, direction){
	posX = this.getSpriteX(sprite, direction);
	posY = this.getSpriteY(sprite, direction);
	tilePos =  posY * this.map.width + posX;
	console.log("id", this.map.layers[0].data[tilePos], "posX", posX, "posY", posY )
	this.isCornering2(sprite, direction)

	//Esquina derecha arriba!
	tileX = posX * this.tileSize[0] + this.basePos[0];
	tileY = posY * this.tileSize[1] + this.basePos[1];
	
	//Middle
	middleX = tileX - this.tileSize[0]/2;
	middleY = tileY - this.tileSize[1]/2;
	x = Math.floor(sprite.x + sprite.width/2);
	y = Math.floor(sprite.y + sprite.height/2);
	console.log(sprite.y)
	console.log(middleX, "check de corner ", middleY, "x",x, "y", y, "tileX", tileX, "tileY", tileY, "tilePos", tilePos);
	switch (direction) {
		//Agarro la dif del middle y sprite.x
		case directions.LEFT:
			if(x >= middleX && x <= middleX + 5){
				return cornering.PRE;
			}
			if(x >= middleX - 4 && x <= middleX)
				return cornering.OVER
			return cornering.NONE;
		case directions.RIGHT:
			console.log("right")
			if(x <= middleX && x >= middleX - 5)
				return cornering.PRE;
			if(x <= middleX + 4 && x >= middleX)
				return cornering.OVER
			return cornering.NONE;
		case directions.UP:
			if(y >= middleY && y <= middleY + 5)
				return cornering.PRE;
			if(y >= middleY - 4 && y <= middleY)
				return cornering.OVER
			return cornering.NONE;
		case directions.DOWN:
			if(y <= middleY && y >= middleY - 5)
				return cornering.PRE;
			if(y >= middleY  && y <= middleY + 4)
				return cornering.OVER
			return cornering.NONE;
	}
	
}

Tilemap.prototype.isCornering2 = function(sprite, direction){
	xPacman = sprite.x + sprite.width/2;
	yPacamn = sprite.y + sprite.height/2;
	//console.log(xPacman, yPacamn, sprite.x, sprite.y)
}


