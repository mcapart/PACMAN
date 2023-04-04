// Scene. Updates and draws a single scene of the game.


function Scene()
{
	// Loading texture to use in a TileMap
	this.tilesheet = new Texture("img/tiles.png");
	this.tilesheetWhite = new Texture("img/tiles2.png")
	this.level = 1;
	this.timeBlink = 250;
	this.ghost_points = [200, 400, 800, 1600];
	this.introSound = AudioFX('audios/pacman_beginning.wav', {loop: true});
	this.isIntroPlaying = false;
	this.playSound =  AudioFX('audios/siren.mp3', {loop: true});
	this.isPlaying = false;
	this.eatSoud = AudioFX('audios/pacman_chomp.wav');
	this.eatFruitSound = AudioFX('audios/pacman-eating-cherry.mp3');
	this.eatGhostSound = AudioFX('audios/pacman_eatghost.wav');
	this.deathSound = AudioFX('audios/pacman_death.wav');
	this.pacman_sounds = {
		eat: this.eatFruitSound,
		fruit: this.eatFruitSound,
		ghost: this.eatGhostSound,
		death: this.deathSound,
	}
	this.inMenu = true;
	this.inCredits = false;
	this.inIntructions = false;
	this.inGame = false;

	this.timer = 0;
	this.setBase(0, 3);
	this.highScore = localStorage.getItem('highscore');
	
	if(this.highScore == null){
		this.highScore = 0;
	}


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

	this.loadInstructions();

}

Scene.prototype.loadInstructions = function(){
	this.characters = new Array();
	var imgs = new Texture("img/ghosts_sprites.png")
	var y = 100
	var x =  48
	this.characters.push(new TexturedQuad(0, 0, 32, 32, x, y, 32, 32, imgs));
	this.characters.push(new TexturedQuad(64, 32, 32, 32, x, y + 32 + 4, 32, 32, imgs));
	this.characters.push(new TexturedQuad(128, 64, 32, 32, x, y + 64 + 8, 32, 32, imgs));
	this.characters.push(new TexturedQuad(0, 128, 32, 32, x, y + 96 + 16, 32, 32, imgs));


	this.characterSpriteInstructions = new Array();
	var imgs = new Texture("img/pacman_sprite.png")
	var img2 = new Texture("img/ghosts_sprites.png");
	var x = 0;
	var y = 75;
	var offest = 194
	var size = 64
	this.characterSpriteInstructions.push(new TexturedQuad(0, 0, 32, 32, x, y, size, size, imgs));
	this.characterSpriteInstructions.push(new TexturedQuad(64, 0, 32, 32, x + offest, y, size, size, img2));
	this.characterSpriteInstructions.push(new TexturedQuad(160, 32, 32, 32, x + offest + size , y, size, size, img2));
	this.characterSpriteInstructions.push(new TexturedQuad(0, 96, 32, 32, x + offest + size*2, y, size, size, img2));
	this.characterSpriteInstructions.push(new TexturedQuad(64, 128, 32, 32, x + offest + size*3, y, size, size, img2));

	var x = 0
	var y = 220;
	this.characterSpriteInstructions.push(new TexturedQuad(64, 0, 32, 32, x, y, size, size, imgs));
	this.characterSpriteInstructions.push(new TexturedQuad(0, 192, 32, 32, x + offest, y, size, size, img2));
	this.characterSpriteInstructions.push(new TexturedQuad(64, 192, 32, 32, x + offest + size, y, size, size, img2));
	this.characterSpriteInstructions.push(new TexturedQuad(0, 192, 32, 32, x + offest + size*2, y, size, size, img2));
	this.characterSpriteInstructions.push(new TexturedQuad(64, 192, 32, 32, x + offest + size*3, y, size, size, img2));
	

	this.dots = new Array();
	var imgs = new Texture("img/tiles.png")
	var y = 300
	var x =  448/2 - 96
	this.dots.push(new TexturedQuad(80, 80, 16, 16, x, y, 32, 32, imgs));
	this.dots.push(new TexturedQuad(0, 96, 16, 16, x, y + 32 + 16, 32, 32, imgs));
	x = 448/2 + 10
	y = this.characterSpriteInstructions[0].y + this.characterSpriteInstructions[0].height + 14.5
	this.dots.push(new TexturedQuad(0, 96, 16, 16, x, y, 32, 32, imgs))

	var fruits = new Texture("img/fruit.png")
	this.fruitsInstructions = new Array();
	x = 5
	y = 380
	size = 45
	offset = 5
	this.fruitsInstructions.push(new TexturedQuad(0, 0, 16, 16, x, y, size, size, fruits))
	this.fruitsInstructions.push(new TexturedQuad(16, 0, 16, 16, x, y + size + offset, size, size, fruits))
	this.fruitsInstructions.push(new TexturedQuad(0, 16, 16, 16, x, y + size*2 + offset, size, size, fruits))

}


Scene.prototype.update = function(deltaTime)
{
	if(interacted && !this.inGame){
		this.introSound.play();
		this.isIntroPlaying = true;
	}
	// Keep track of time
	if(this.inGame){
		if(!this.pacmanSprite.isStart){
			this.introSound.stop()
			this.isIntroPlaying = false;
		}
		if(this.pacmanSprite.canMove && !this.isPlaying && !this.isIntroPlaying && !this.pacmanSprite.can_eat_ghost){
			this.playSound.play();
			this.isPlaying = true;
		}
		if((!this.pacmanSprite.canMove  || this.pacmanSprite.can_eat_ghost || this.pacmanSprite.isStart) && this.isPlaying){
			this.playSound.stop();
			this.isPlaying = false;
		}
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
	


}



Scene.prototype.draw = function ()
{
	if(this.inMenu){
		this.drawMenu();
	}else if(this.inCredits){
		this.drawCredits();
	}else if(this.inIntructions){
		this.drawInstructions();
	}
	else{
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
			if(this.isWining == 0){
				if(this.pacmanSprite.points > this.highScore){
					localStorage.setItem('highscore', this.pacmanSprite.points)
					this.highScore = this.pacmanSprite.points;
				}
			}
			text = "GANASTE!!"
			this.pacmanSprite.won();
			this.ghosts.forEach(g => g.canMove = false)
			this.isWining += 1;
			if(this.isWining == this.timeBlink && this.level == 3){
				this.inMenu = true;
				this.timer = 0;
				this.level = 1;
				this.setBase(0, 3)
				context.clearRect(0, 0, canvas.width, canvas.height);
			}
		}
		context.font = "20px Verdana"; 
		var textSize = context.measureText(text); 
		context.fillStyle = "White";
		context.fillText(text, 448/2 - textSize.width/2, 20);
		
	
		// Draw Score
		var text = this.highScore.toString();
		context.font = "20px Verdana"; 
		var textSize = context.measureText(text); 
		context.fillStyle = "White";
		context.fillText(text, 448/2 - textSize.width/2, 20*2);
	
		var text = this.pacmanSprite.getPoints().toString();
		context.font = "20px Verdana"; 
		var textSize = context.measureText(text); 
		context.fillStyle = "White";
		context.fillText(text, 16, 20*2);

		if(this.pacmanSprite.inminue){
			var text = "God Mode On"
			context.font = "18px Verdana"; 
		}else{
			var text = "God Mode Off"
			context.font = "15px Verdana"; 
		}
		
		context.fillStyle = "rgb(228, 213, 163)"
		var textSize = context.measureText(text); 
		context.fillText(text, canvas.width - textSize.width - 8, 44 );
	
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

	
		if(!this.pacmanSprite.gameOver()){
			//Draw lives
			for(var n = 0; n<this.pacmanSprite.lives -1; n++){
				this.lives[n].draw()
			}
	
			
	
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
			context.fillText(text, 448/2 - textSize.width/2, (17*16 + 48) + 20)
			if(this.timer == 0){
				if(this.pacmanSprite.points > this.highScore){
					localStorage.setItem('highscore', this.pacmanSprite.points)
					this.highScore = this.pacmanSprite.points;
				}
			}
			this.timer += 1
			if(this.timer == 200){
				this.inMenu = true;
				this.timer = 0;
				this.level = 1;
				this.setBase(0, 3)
				context.clearRect(0, 0, canvas.width, canvas.height);
			}
		}

	}
	
	
	
	

}


Scene.prototype.newLevel = function(){
	if(this.level < 3){
		this.level += 1;
		this.isWining = 0;

		this.setBase(this.pacmanSprite.points, this.pacmanSprite.lives);

	}
}

Scene.prototype.setBase = function(points, lives){
	// Create tilemap
	//El base pose desplaza para no dibujar en el 0, 0. En el packman tiene que dibujar para que quede con [0, 48]. 
	this.map = new Tilemap(this.tilesheet, [16, 16], [7, 7], [0, 48], JSON.parse(JSON.stringify(PacmanTiles)));


	// ------------------------------------------------ PERSONAJES ------------------------------------------------ //


	this.blinkySprite = new Blinky(this.map, this.level - 1, 0, 0, ghost_directions.EAT_LEFT, 13, 11);
	this.pinkySprite = new Pinky(this.map, this.level - 1, 64, 32, ghost_directions.EAT_UP, 13, 14);
	this.inkySprite = new Inky(this.map, this.level -1, 128, 64, ghost_directions.EAT_RIGHT, 11, 14);
	this.clydeSprite = new Clyde(this.map, this.level -1, 0, 128, ghost_directions.EAT_LEFT, 15, 14);

	this.ghosts = [this.blinkySprite, this.pinkySprite, this.inkySprite, this.clydeSprite]

	this.pacmanSprite = new Pacman(this.map, this.ghosts, this.level - 1, this.pacman_sounds, lives);
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




Scene.prototype.drawMenu = function(){
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");
	var _self = this;

	context.fillStyle = "rgb(66, 40, 51)";
	context.fillRect(0, 0, canvas.width, canvas.height);


	var text = "HIGH SCORE " +this.highScore.toString();
	context.font = "16px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 448/2 - textSize.width/2, 20);

	var text = "CHARACTER" 
	context.font = "16px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 64 + 32, 80);

	var text = " / " 
	context.font = "16px Verdana"; 
	var textSize2 = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 64 + 32 + textSize.width + 15, 80);
	var text = "NICKNAME" 
	context.font = "16px Verdana"; 
	context.fillStyle = "White";
	context.fillText(text, 64 + 32 + textSize.width + 15 + textSize2.width + 15 , 80);

	var texts = [["- SHADOW", "\"BLINKY\""], ["- SPEEDY", "\"PINKY\""], ["- BASHFUL", "\"INKY\""], ["- POKEY", "\"CLYDE\""]]
	var colors = ["#ff0002", "#ffb8ff", "#03ffff", "#ffb853" ]

	for(var i = 0; i< this.characters.length;i++){
		c = this.characters[i]
		c.draw()
		var text = texts[i][0]
		context.font = "16px Verdana"; 
		context.fillStyle = colors[i]
		context.fillText(text, 64 + 32, c.y + 16 + 8);
		var text = texts[i][1]
		context.font = "16px Verdana"; 
		context.fillStyle = colors[i]
		context.fillText(text, 64 + 32 + textSize.width + 15 + textSize2.width + 15, c.y + 16 + 8);
	}

	var texts = ["10 PTS", "50 PTS"]

	for(var i = 0; i< this.dots.length - 1;i++){
		d = this.dots[i]
		d.draw()
		var text = texts[i]
		context.font = "16px Verdana";
		context.fillStyle = "White"
		var textSize = context.measureText(text); 
		context.fillText(text,  448/2 - textSize.width/2, d.y + 16 + 8);
	}

	var text1 = "Start";
	context.font = "30px Verdana"; 
	var text3 = "Instructions";
	var text2 = "Credits";
	var textSize = context.measureText(text3); 

	var button = {
		x: canvas.width/2 - (textSize.width + 10)/2,
		y: canvas.height - 60,
		w: textSize.width + 10,
		h: 50
	}
	context.fillStyle = "rgb(200, 99, 104)";
	context.strokeStyle = "rgb(200, 99, 104)";
	context.beginPath();
	context.roundRect(button.x, button.y, button.w, button.h, [20]);
	context.fill();
	context.stroke();
	context.fillStyle = "White";
	var textSize2 = context.measureText(text1); 
	context.fillText(text1, button.x + button.w/2 - textSize2.width/2 , button.y + 35);

	var button2 = {
		x: canvas.width/2 - (textSize.width + 10)/2,
		y: button.y - 60,
		w: textSize.width + 10,
		h: 50
	}
	context.fillStyle = "rgb(200, 99, 104)";
	context.strokeStyle = "rgb(200, 99, 104)";
	context.beginPath();
	context.roundRect(button2.x, button2.y, button2.w, button2.h, [20]);
	context.fill();
	context.stroke();
	context.fillStyle = "White";
	var textSize2 = context.measureText(text2); 
	context.fillText(text2, button2.x + button2.w/2 - textSize2.width/2 , button2.y + 35);

	var button3 = {
		x: canvas.width/2 - (textSize.width + 10)/2,
		y: button2.y - 60,
		w: textSize.width + 10,
		h: 50
	}
	context.fillStyle = "rgb(200, 99, 104)";
	context.strokeStyle = "rgb(200, 99, 104)";
	context.beginPath();
	context.roundRect(button3.x, button3.y, button3.w, button3.h, [20]);
	context.fill();
	context.stroke();
	context.fillStyle = "White";
	var textSize2 = context.measureText(text3); 
	context.fillText(text3, button3.x + button3.w/2 - textSize2.width/2 , button3.y + 35);





	function handdleClick(ev){
		var canvas = document.getElementById("game-layer");
		var rect = canvas.getBoundingClientRect()
		var x = ev.clientX - rect.left
		var y = ev.clientY - rect.top
		
		if(button.x <= x && x <= button.x+button.w && button.y <= y && y <= button.y+button.h) {
		  _self.inMenu = false;
		  _self.inGame = true;
		  canvas.removeEventListener('click', handdleClick, true)
		  canvas.removeEventListener('mousemove', handdleMouseOver, true)
		  canvas.style.cursor = "default";
		}
		if(button2.x <= x && x <= button2.x+button2.w && button2.y <= y && y <= button2.y+button2.h) {
			_self.inMenu = false;
			_self.inCredits = true;
			canvas.removeEventListener('click', handdleClick, true)
			canvas.removeEventListener('mousemove', handdleMouseOver, true)
			canvas.style.cursor = "default";
		}
		if(button3.x <= x && x <= button3.x+button3.w && button3.y <= y && y <= button3.y+button3.h) {
			_self.inMenu = false;
			_self.inIntructions = true;
			canvas.removeEventListener('click', handdleClick, true)
			canvas.removeEventListener('mousemove', handdleMouseOver, true)
			canvas.style.cursor = "default";
		}

	}

	canvas.addEventListener('click', handdleClick, true);


	function handdleMouseOver(ev){
		var canvas = document.getElementById("game-layer");
		var rect = canvas.getBoundingClientRect();
		
		x = ev.clientX - rect.left,
		y = ev.clientY - rect.top
		if(button.x <= x && x <= button.x+button.w && button.y <= y && y <= button.y+button.h) {
			canvas.style.cursor = "pointer";
		}else if(button2.x <= x && x <= button2.x+button2.w && button2.y <= y && y <= button2.y+button2.h){
			canvas.style.cursor = "pointer";
		}else if(button3.x <= x && x <= button3.x+button3.w && button3.y <= y && y <= button3.y+button.h){
			canvas.style.cursor = "pointer";
		}
		else{
			canvas.style.cursor = "default";
		}
	}  
	canvas.addEventListener('mousemove', handdleMouseOver, true);

	

}

Scene.prototype.drawCredits = function(){
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");
	var _self = this;
	context.fillStyle = "rgb(66, 40, 51)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	var text = "CREDITS";
	context.font = "30px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 448/2 - textSize.width/2, 30);

	var texts = ["Created by Micaela Capart", "Based on the original arcade game", "PACMAN by Toru Iwatani from Namco"]
	context.font = "20px Verdana";  
	context.fillStyle = "White";
	y = 100;
	texts.forEach(t => {
		var textSize = context.measureText(t);
		context.fillText(t, 448/2 - textSize.width/2, y + 20);
		y += 30

	})

	context.font = "30px Verdana"; 
	var text1 = "Back";
	var text3 = "Instructions";
	var textSize = context.measureText(text3); 

	var button = {
		x: canvas.width/2 - (textSize.width + 10)/2,
		y: canvas.height - 60,
		w: textSize.width + 10,
		h: 50
	}
	context.fillStyle = "rgb(200, 99, 104)";
	context.strokeStyle = "rgb(200, 99, 104)";
	context.beginPath();
	context.roundRect(button.x, button.y, button.w, button.h, [20]);
	context.fill();
	context.stroke();
	context.fillStyle = "White";
	var textSize2 = context.measureText(text1); 
	context.fillText(text1, button.x + button.w/2 - textSize2.width/2 , button.y + 35);

	function handdleClick(ev){
		var canvas = document.getElementById("game-layer");
		var rect = canvas.getBoundingClientRect()
		var x = ev.clientX - rect.left
		var y = ev.clientY - rect.top
		
		if(button.x <= x && x <= button.x+button.w && button.y <= y && y <= button.y+button.h) {
		  _self.inMenu = true;
		  _self.inCredits = false;
		  canvas.removeEventListener('click', handdleClick, true)
		  canvas.removeEventListener('mousemove', handdleMouseOver, true)
		  canvas.style.cursor = "default";
		}

	}

	canvas.addEventListener('click', handdleClick, true);


	function handdleMouseOver(ev){
		var canvas = document.getElementById("game-layer");
		var rect = canvas.getBoundingClientRect();
		
		x = ev.clientX - rect.left,
		y = ev.clientY - rect.top
		if(button.x <= x && x <= button.x+button.w && button.y <= y && y <= button.y+button.h) {
			canvas.style.cursor = "pointer";
		}
		else{
			canvas.style.cursor = "default";
		}
	}  
	canvas.addEventListener('mousemove', handdleMouseOver, true);

}

Scene.prototype.drawInstructions = function(){
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");
	var _self = this;
	context.fillStyle = "rgb(66, 40, 51)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	var text = "INSTRUCTIONS";
	context.font = "30px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 448/2 - textSize.width/2, 30);

	context.font = "30px Verdana"; 
	var text1 = "Back";
	var text3 = "Instructions";
	var textSize = context.measureText(text3); 

	var button = {
		x: 5,
		y: canvas.height - 50,
		w: textSize.width + 10,
		h: 40
	}
	context.fillStyle = "rgb(200, 99, 104)";
	context.strokeStyle = "rgb(200, 99, 104)";
	context.beginPath();
	context.roundRect(button.x, button.y, button.w, button.h, [20]);
	context.fill();
	context.stroke();
	context.fillStyle = "White";
	var textSize2 = context.measureText(text1); 
	context.fillText(text1, button.x + button.w/2 - textSize2.width/2 , button.y + 30);



	for(i = 0; i< this.characterSpriteInstructions.length; i++){
		c = this.characterSpriteInstructions[i];
		c.draw();
	}

	var text = "AVOIDS";
	context.font = "30px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 64, this.characterSpriteInstructions[0].y + 64/2 + 15);

	var y =this.characterSpriteInstructions[0].y + this.characterSpriteInstructions[0].height + 5
	context.beginPath();
	context.moveTo(0, y);
	context.lineTo(canvas.width, y);
	context.lineWidth = 5;
	context.stroke(); 

	var y =this.characterSpriteInstructions[5].y - 5 - 20
	context.beginPath();
	context.moveTo(0, y);
	context.lineTo(canvas.width, y);
	context.lineWidth = 5;
	context.stroke();

	var y1 =this.characterSpriteInstructions[0].y + this.characterSpriteInstructions[0].height + 5
	var y2 =this.characterSpriteInstructions[5].y - 5 - 20
	context.beginPath();
	context.moveTo(canvas.width/2, y1);
	context.lineTo(canvas.width/2, y2);
	context.lineWidth = 5;
	context.stroke();

	var text = "CAN EAT";
	context.font = "30px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 64, this.characterSpriteInstructions[5].y + 64/2 + 15);

	var text = "\"Pac-Dots\" 10 points";
	context.font = "20px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 5, y1 + 20 + 5);

	var text = "Eat all dots to clear stage";
	context.font = "15px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, 5, y1 + 20 + 15 + 5);

	var text = "\"Power Pellets\"";
	context.font = "23px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	var x = canvas.width - textSize.width
	context.fillText(text, x, y1 + 23);

	var text = "4 flashing dots which";
	context.font = "10px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, x + 5, y1 + 20 + 10 + 5);

	var text = "score 50 points";
	context.font = "10px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, x + 5, y1 + 20 + 10 + 10 + 5);

	this.dots[2].draw()

	var text = "AFTER EATING A POWER PELLET:";
	context.font = "20px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, canvas.width/2 - textSize.width/2, y2 + 20);


	var text = "But only for a few seconds, after which";
	context.font = "15px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, canvas.width/2 - textSize.width/2, y2 + 25 + 20 + this.characterSpriteInstructions[5].height);
	var text = "they will flash and change back";
	var textSize = context.measureText(text); 
	context.fillText(text, canvas.width/2 - textSize.width/2, y2 + 25 + 20 + this.characterSpriteInstructions[5].height + 20);

	var y = y2 + 25 + 20 + this.characterSpriteInstructions[5].height + 20 + 5
	context.beginPath();
	context.moveTo(0, y);
	context.lineTo(canvas.width, y);
	context.stroke();

	var text = "BONUS FRUIT!";
	context.font = "35px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "White";
	context.fillText(text, canvas.width/2 - textSize.width/2, y + 40);

	var texts = ["100 Pts; Appears in stage 1", "300 Pts; Appears in stage 2", "500 Pts; Appears in stage 3"]

	for(var i = 0; i< this.fruitsInstructions.length; i ++){
		var f = this.fruitsInstructions[i];
		f.draw()
		var text =texts[i]
		context.font = "20px Verdana"; 
		var textSize = context.measureText(text); 
		context.fillStyle = "White";
		context.fillText(text, f.x + f.width + 5, f.y + 30 );
	}

	var text = "Press G to enter";
	context.font = "20px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "rgb(228, 213, 163)"
	var x = canvas.width/2 + canvas.width/4 - textSize.width/2
	context.fillText(text, x, canvas.height - 50 + 20);

	var text = "GOD mode";
	context.font = "20px Verdana"; 
	var textSize = context.measureText(text); 
	context.fillStyle = "rgb(228, 213, 163)"
	var x = canvas.width/2 + canvas.width/4 - textSize.width/2
	context.fillText(text, x, canvas.height - 50 + 20 + 20);



	function handdleClick(ev){
		var canvas = document.getElementById("game-layer");
		var rect = canvas.getBoundingClientRect()
		var x = ev.clientX - rect.left
		var y = ev.clientY - rect.top
		
		if(button.x <= x && x <= button.x+button.w && button.y <= y && y <= button.y+button.h) {
		  _self.inMenu = true;
		  _self.inIntructions = false;
		  canvas.removeEventListener('click', handdleClick, true)
		  canvas.removeEventListener('mousemove', handdleMouseOver, true)
		  canvas.style.cursor = "default";
		}

	}

	canvas.addEventListener('click', handdleClick, true);


	function handdleMouseOver(ev){
		var canvas = document.getElementById("game-layer");
		var rect = canvas.getBoundingClientRect();
		
		x = ev.clientX - rect.left,
		y = ev.clientY - rect.top
		if(button.x <= x && x <= button.x+button.w && button.y <= y && y <= button.y+button.h) {
			canvas.style.cursor = "pointer";
		}
		else{
			canvas.style.cursor = "default";
		}
	}  
	canvas.addEventListener('mousemove', handdleMouseOver, true);


}


