
// TexturedQuad. Draws a rectangle using part of an image (texture).
// la imagen en el fondo tambien es un quad. 
function TexturedQuad(sx, sy, sWidth, sHeight, x, y, width, height, texture, smoothing = false)
{
	//Tengo por un lado la imagen que contiene multiples subimagenes. 
	// Quiero solo un trozo que lo quiero dibujar dentro del canvas. 
	// Quiero la subimagen en tal coordenada

	// Que trozo se utiliza
	this.sx = sx
	this.sy = sy
	this.sWidth = sWidth
	this.sHeight = sHeight

	// DOnde se dibuja, los tamaños no tienen porque ser iguales. Las puedo agrandar. (escalado) Ampliacion suavizado
	this.x = x
	this.y = y
	this.width = width
	this.height = height
	
	this.texture = texture
	
	// no nos importa suavizar solo ampliamos los pixeles. 
	this.smoothing = smoothing;
}

TexturedQuad.prototype.draw = function ()
{
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Draw the rectangle
	context.imageSmoothingEnabled = this.smoothing;
	context.drawImage(this.texture.img, this.sx, this.sy, this.sWidth, this.sHeight, this.x, this.y, this.width, this.height);
}


