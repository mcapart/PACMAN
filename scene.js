// Scene. Updates and draws a single scene of the game.


function Scene()
{
	// Loading texture to use in a TileMap
	var tilesheet = new Texture("img/tiles2.png");
	
	// Create tilemap
	//El base pose desplaza para no dibujar en el 0, 0. En el packman tiene que dibujar para que quede con [0, 48]. 
	// El level01 es el mapa que se construye con tiled. 
	this.map = new Tilemap(tilesheet, [16, 16], [7, 7], [0, 48], PacmanTiles);

	var imgs = new Texture("img/pacman_imgs_full2.png")
	this.lives = new Array();
	this.lives.push(new TexturedQuad(0, 0, 32, 32, 32, 544, 32, 32, imgs));
	this.lives.push(new TexturedQuad(0, 0, 32, 32, 64, 544, 32, 32, imgs));


	// ------------------------------------------------


	this.pacmanSprite = new Pacman();
	this.pacmanSprite.addAnimations();

	this.blinkySprite = new Blinky();
	this.blinkySprite.addAnimations();

	this.pinkySprite = new Pinky();
	this.pinkySprite.addAnimations();

	this.inkySprite = new Inky();
	this.inkySprite.addAnimations();

	this.clydeSprite = new Clyde();
	this.clydeSprite.addAnimations();



	// Store current time
	this.currentTime = 0
}


Scene.prototype.update = function(deltaTime)
{
	// Keep track of time
	this.currentTime += deltaTime;

	this.pacmanSprite.handleUpdate(deltaTime);

	this.blinkySprite.handleUpdate(deltaTime);

	this.pinkySprite.handleUpdate(deltaTime);

	this.inkySprite.handleUpdate(deltaTime);
	
	this.clydeSprite.handleUpdate(deltaTime);


}



Scene.prototype.draw = function ()
{
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Clear background
	context.fillStyle = "rgb(66, 40, 51)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	// Draw tilemap
	this.map.draw();

	//Draw lives
	this.lives.forEach(l => l.draw())

	// Draw text
	var text = "HIGH SCORE";
	context.font = "24px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 448/2 - textSize.width/2, 24);

	// Draw Score
	var text = "0";
	context.font = "24px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 448/2 - textSize.width/2, 24*2);

	// Draw pacman sprite
	this.pacmanSprite.draw();

	this.blinkySprite.draw();

	this.pinkySprite.draw();

	this.inkySprite.draw();

	this.clydeSprite.draw();
	

}



