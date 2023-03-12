
// Tilemap. Draws a tilemap using a texture as a tilesheet.

const directions = {
	LEFT: 1,
	RIGHT: 2,
	UP: 3,
	DOWN: 4
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
	switch (direction) {
		case directions.LEFT:
			var x = Math.floor((sprite.x - this.basePos[0] + sprite.box.min[0]) / this.tileSize[0]);
			return x
		case directions.RIGHT:
			var x = Math.floor((sprite.x - this.basePos[0] + sprite.box.max[0]) / this.tileSize[0]);
			return x;
		case directions.UP:
			var x = Math.floor((sprite.x - this.basePos[0] + (sprite.box.min[0] + sprite.box.max[0]) / 2) / this.tileSize[0]);
			return  x;
		case directions.DOWN:
			var x = Math.floor((sprite.x - this.basePos[0] + (sprite.box.min[0] + sprite.box.max[0]) / 2) / this.tileSize[0]);
			return x;
	}
}

Tilemap.prototype.getSpriteY = function(sprite, direction){
	switch (direction) {
		case directions.LEFT:
			var y = Math.floor((sprite.y - this.basePos[1] + (sprite.box.min[1] + sprite.box.max[1]) / 2) / this.tileSize[1]);
			return y 
		case directions.RIGHT:
			var y = Math.floor((sprite.y - this.basePos[1] + (sprite.box.min[1] + sprite.box.max[1]) / 2) / this.tileSize[1]);
			return y 
		case directions.UP:
			var y = Math.floor((sprite.y - this.basePos[1] + sprite.box.min[1]) / this.tileSize[1]);
			return y 
		case directions.DOWN:
			var y = Math.floor((sprite.y - this.basePos[1] + sprite.box.max[1]) / this.tileSize[1]);
			return y 
	}
}

Tilemap.prototype.isInMiddle = function(sprite, direction){
	posX = this.getSpriteX(sprite, direction)
	posY = this.getSpriteY(sprite, direction)
	tilePos =  posY * this.map.width + posX;

	//Esquina derecha abajo!
	tileX = posX* this.tileSize[0] + this.basePos[0];
	tileY = posY * this.tileSize[1] + this.basePos[1];
	
	//Middle
	middleX = tileX - this.tileSize[0]/2;
	middleY = tileY - this.tileSize[1]/2;

	console.log("2", middleX, " ", middleY, "x", sprite.x, "y", sprite.y);
	switch (direction) {
		case directions.LEFT:
			return Math.floor(sprite.x) == middleX;
		case directions.RIGHT:
			return sprite.x <= middleX && sprite.x >= middleX - 4;
		case directions.UP:
			return sprite.y >= middleY && sprite.y <= middleY + 5;
		case directions.DOWN:
			return sprite.y >= middleY && sprite.y <= middleY - 4;
	}

}

Tilemap.prototype.isCornering = function(sprite, direction){
	posX = this.getSpriteX(sprite, direction)
	posY = this.getSpriteY(sprite, direction)
	tilePos =  posY * this.map.width + posX;

	//Esquina derecha abajo!
	tileX = posX * this.tileSize[0] + this.basePos[0];
	tileY = posY * this.tileSize[1] + this.basePos[1];
	
	//Middle
	middleX = tileX - this.tileSize[0]/2;
	middleY = tileY - this.tileSize[1]/2;
	console.log(middleX, "check de corner ", middleY, " ", sprite.x, " ", sprite.y);
	switch (direction) {
		case directions.LEFT:
			return sprite.x >= middleX && sprite.x <= middleX + 5;
		case directions.RIGHT:
			return sprite.x <= middleX && sprite.x >= middleX - 4;
		case directions.UP:
			return sprite.y >= middleY && sprite.y <= middleY + 5;
		case directions.DOWN:
			return sprite.y >= middleY && sprite.y <= middleY - 4;
	}
	
}


