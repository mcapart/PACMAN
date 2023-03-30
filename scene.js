// Scene. Updates and draws a single scene of the game.


function Scene()
{
	// Loading texture to use in a TileMap
	this.tilesheet = new Texture("img/tiles.png");
	this.tilesheetWhite = new Texture("img/tiles2.png")
	this.level = 1;
	this.timeBlink = 250;
	this.ghost_points = [200, 400, 800, 1600];
	this.eatSoud = AudioFX('audios/eat.mp3');
	this.eatFruitSound = AudioFX('audios/pacman_eatfruit.wav');
	this.eatGhostSound = AudioFX('audios/pacman_eatghost.wav');
	this.deathSound = AudioFX('audios/pacman_death.wav');
	this.pacman_sounds = {
		eat: this.eatFruitSound,
		fruit: this.eatFruitSound,
		ghost: this.eatGhostSound,
		death: this.eatGhostSound
	}
	this.setBase(0);


	var imgs = new Texture("img/pacman_sprite.png")
	this.lives = new Array();
	this.lives.push(new TexturedQuad(0, 0, 32, 32, 32, 544, 32, 32, imgs));
	this.lives.push(new TexturedQuad(0, 0, 32, 32, 64, 544, 32, 32, imgs));

	var fruits = new Texture("img/fruit.png")
	this.fruitsLevel = new Array();
	this.fruitsLevel.push(new TexturedQuad(0, 0, 16, 16, 400, 544, 32, 32, fruits))
	this.fruitsLevel.push(new TexturedQuad(16, 0, 16, 16, 368, 544, 32, 32, fruits))
	this.fruitsLevel.push(new TexturedQuad(0, 16, 16, 16, 336, 544, 32, 32, fruits))
	this.fruitsEat = new Array();
	this.fruitsEat.push(new TexturedQuad(0, 0, 16, 16, 13*this.map.tileSize[0] + this.map.basePos[0], 17*this.map.tileSize[1] + this.map.basePos[1] - 8, 32, 32, fruits))
	this.fruitsEat.push(new TexturedQuad(16, 0, 16, 16, 13*this.map.tileSize[0] + this.map.basePos[0], 17*this.map.tileSize[1] + this.map.basePos[1] - 8, 32, 32, fruits))
	this.fruitsEat.push(new TexturedQuad(0, 16, 16, 16, 13*this.map.tileSize[0] + this.map.basePos[0], 17*this.map.tileSize[1] + this.map.basePos[1] - 8, 32, 32, fruits))

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

	if(this.isWining == this.timeBlink){
		this.newLevel(this.pacmanSprite.points);
	}


}



Scene.prototype.draw = function ()
{
	if(!this.canEat && this.pacmanSprite.can_eat_ghost){
		this.canEat = true;
	}
	if(this.canEat && ! this.pacmanSprite.can_eat_ghost){
		this.canEat = false;
		this.ghostEaten = 0;
	}
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Clear background
	context.fillStyle = "rgb(66, 40, 51)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	// Draw tilemap
	if(this.isWining > 0 && this.isWining <= this.timeBlink){
		this.map.tilesheet = (this.isWining % 80 <= 40)? this.tilesheet : this.tilesheetWhite;
	}
	
	this.map.draw();

	// Draw text
	var text = "HIGH SCORE";
	if(this.pacmanSprite.hasWon()){
		text = "GANASTE!!"
		this.pacmanSprite.won();
		this.ghosts.forEach(g => g.canMove = false)
		this.isWining += 1;
	}
	context.font = "20px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 448/2 - textSize.width/2, 20);
	

	// Draw Score
	var text = "0";
	context.font = "20px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 448/2 - textSize.width/2, 20*2);

	var text = this.pacmanSprite.getPoints().toString();
	context.font = "20px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 16, 20*2);

	//Draw level

	for(let i = 0; i<this.level; i++){
		this.fruitsLevel[i].draw();
	}
	var text = this.level.toString();
	context.font = "16px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "Grey";
	context.fillText(text, 432, 568);

	//Draw Fruit

	if(this.pacmanSprite.canEatFruit){
		this.fruitsEat[this.level - 1].draw();
	}

	//when killing ghosts show points!!!!!

	if(!this.pacmanSprite.gameOver()){
		//Draw lives
		for(var n = 0; n<this.pacmanSprite.lives -1; n++){
			this.lives[n].draw()
		}
		//this.lives.forEach(l => l.draw())

		

		// Draw pacman sprite
		this.pacmanSprite.draw();

		this.blinkySprite.draw();

		this.pinkySprite.draw();

		this.inkySprite.draw();

		this.clydeSprite.draw();
	}else{
		text = "Game    Over"
		var textSize = context.measureText(text); 
		context.fillStyle = "Red";
		//context.fillText(text, 448/2 - textSize.width/2, 24);
		context.fillText(text, 448/2 - textSize.width/2, (17*16 + 48) + 20)
	}
	
	
	

}


Scene.prototype.newLevel = function(){
	if(this.level < 3){
		this.level += 1;
		this.isWining = 0;

		this.setBase(this.pacmanSprite.points);

	}
}

Scene.prototype.setBase = function(points){
	// Create tilemap
	//El base pose desplaza para no dibujar en el 0, 0. En el packman tiene que dibujar para que quede con [0, 48]. 
	this.map = new Tilemap(this.tilesheet, [16, 16], [7, 7], [0, 48], JSON.parse(JSON.stringify(PacmanTiles)));


	// ------------------------------------------------ PERSONAJES ------------------------------------------------ //


	this.blinkySprite = new Blinky(this.map, this.level - 1);
	this.pinkySprite = new Pinky(this.map, this.level - 1 );
	this.inkySprite = new Inky(this.map, this.level -1);
	this.clydeSprite = new Clyde(this.map, this.level -1);

	this.ghosts = [this.blinkySprite, this.pinkySprite, this.inkySprite, this.clydeSprite]

	this.pacmanSprite = new Pacman(this.map, this.ghosts, this.level - 1, this.pacman_sounds);
	this.pacmanSprite.points = points
	this.pacmanSprite.addAnimations();

	this.blinkySprite.setPacman(this.pacmanSprite);
	this.pinkySprite.setPacman(this.pacmanSprite);
	this.inkySprite.setPacman(this.pacmanSprite)
	this.clydeSprite.setPacman(this.pacmanSprite)
	
	this.blinkySprite.addAnimations();
	this.pinkySprite.addAnimations();
	this.inkySprite.addAnimations();
	this.clydeSprite.addAnimations();



	// Store current time
	this.currentTime = 0

	this.isWining = 0;

	this.ghostEaten = 0;
	this.canEat = false;

}


