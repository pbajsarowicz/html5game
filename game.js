var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');

var canvasCharacter = document.getElementById('canvasCharacter');
var ctxCharacter = canvasCharacter.getContext('2d');

var canvasAlien = document.getElementById('canvasAlien');
var ctxAlien = canvasAlien.getContext('2d');

var canvasResult = document.getElementById('canvasResult');
var ctxResult = canvasResult.getContext('2d');
ctxResult.fillStyle = "hsla(0, 100%, 100%, 1)";
ctxResult.font = "bold 36px Arial";

var score = 0;
var d = new Date();
var start = d.getTime();

var ch1 = new Character();
var alien = new Alien();
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;

var isPlaying = false;
var requestAnimFrame = window.requestAnimationFrame ||
					   window.webkitRequestAnimationFrame ||
					   window.mozRequestAnimationFrame ||
					   window.oRequestAnimationFrame ||
					   window.msRequestAnimationFrame ||
					   function(callback) {
					   		window.setTimeout(callback, 100 / 60);
					   };

var imgSprite = new Image();
imgSprite.src = 'images/sprite.png';
imgSprite.addEventListener('load',init,false);

//START main
function init() {
	drawBg();
	startLoop();
	document.addEventListener('keydown',checkKeyDown,false);
	document.addEventListener('keyup',checkKeyUp,false);
}

function loop() {
	if (isPlaying) {
		d = new Date();
		score = Math.floor((d.getTime() - start)/1000);
		updateResult();
		ch1.draw();
		alien.draw();
		requestAnimFrame(loop); //repeat
	}
}

function startLoop() {
	isPlaying = true;
	loop();
}

function stopLoop() {
	isPlaying = false;
}


function drawBg() {
	ctxBg.clearRect(0,0,gameWidth,gameHeight);
	ctxBg.drawImage(imgSprite,0,0,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
}

function updateResult() {
	ctxResult.clearRect(0,0,gameWidth,gameHeight);
	ctxResult.fillText(score, 0.485*this.gameWidth, 30);
}
//END main

//BEGIN Character
function clearCtxCharacter(){
	ctxCharacter.clearRect(0,0,gameWidth,gameHeight);
	
}

function Character() {
	this.srcX = 0;
	this.srcY = 500;
	this.drawX = 100;
	this.drawY = 100;
	this.leftX = this.drawX;
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
	this.width = 40;
	this.height = 40;
	this.centerX = this.drawX + this.width/2;
	this.centerY = this.drawY + this.height/2;
	this.speed = 10;
	this.isUpKey = false;
	this.isRightKey = false;
	this.isDownKey = false;
	this.isLeftKey = false;
}

Character.prototype.draw = function() {
	clearCtxCharacter();
	this.checkDirection();
	this.updateCoors();
	this.fail();
	ctxCharacter.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};

Character.prototype.updateCoors = function() {
	this.leftX = this.drawX;
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
}

Character.prototype.checkDirection = function() {
	if(this.isUpKey && this.topY>50) {
		if(this.topY == 300) {
			if((this.leftX>=360 && this.leftX<=440) || (this.rightX<=440 && this.rightX>=360)) this.drawY = 300;
			else this.drawY -= this.speed;
		} else this.drawY -= this.speed;
	}
	if(this.isRightKey){
		if(this.topY<300 && ((this.leftX>=50 && this.rightX<360) || (this.leftX>=440 && this.rightX<gameWidth-50))) { //>= gdy jestesmy przy granicy = nie ogarniczamy ruchu
			this.drawX += this.speed;
		} else if (this.topY>=300 && this.rightX<gameWidth-50) {
			this.drawX += this.speed;
		}
	}
	if(this.isDownKey && this.bottomY<gameHeight-50) {
		this.drawY += this.speed;
	}
	if(this.isLeftKey){
		if(this.topY<300 && ((this.leftX>50 && this.rightX<=360) || (this.leftX>445 && this.rightX<=gameWidth-50))) {
			this.drawX -= this.speed;
		} else if (this.topY>=300 && this.leftX>50) {
			this.drawX -= this.speed;
		}
	}
	this.centerX = this.drawX + this.width/2;
	this.centerY = this.drawY + this.height/2;
};

Character.prototype.fail = function() {
	if(this.centerX == alien.centerX &&
		this.centerY == alien.centerY)
		isPlaying = false;
}


//START Alien
function clearCtxAlien(){
	ctxAlien.clearRect(0,0,gameWidth,gameHeight);
	
};

function Alien() {
	this.srcX = 0;
	this.srcY = 540;
	this.drawX = Math.floor((Math.random()*30)+6)*10;
	this.drawY = Math.floor((Math.random()*40)+6)*10;
	this.leftX = this.drawX;
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
	this.width = 40;
	this.height = 40;
	this.centerX = this.drawX + this.width/2;
	this.centerY = this.drawY + this.height/2;
	this.speed = 5;
	this.isUpKey = false;
	this.isRightKey = false;
	this.isDownKey = false;
	this.isLeftKey = false;
	this.moveLeft = 0;
	this.moveRight = 0;
	this.moveUp = 0;
	this.moveDown = 0;
	this.direction = 0;
	this.moveLR = 0;
	this.moveUD = 0;
}

Alien.prototype.draw = function() {
	clearCtxAlien();
	this.chooseDirection();
	this.checkDirection();
	this.updateCoors();
	ctxAlien.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};

Alien.prototype.updateCoors = function() {
	this.leftX = this.drawX;
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
};

Alien.prototype.chooseDirection = function() {
	
	if (ch1.topY<=300 && ch1.centerX<460 &&
		this.centerY>=70 && this.centerY<=320 && 
		this.centerX>=460 && this.centerX<=465) {
		this.isDownKey = true;
		this.isUpKey = false;
		this.isLeftKey = false;
		this.isRightKey = false;
	} else {

	if(this.centerX == ch1.centerX){ //stop shaking
		this.isLeftKey = false;
		this.isRightKey = false;
	} else if (this.centerX<ch1.centerX) { 
		this.isLeftKey = false;
		this.isRightKey = true;
	} else {
		this.isLeftKey = true;
		this.isRightKey = false;
	}

	if(this.centerY == ch1.centerY){
		this.isUpKey = false;
		this.isDownKey = false;
	} else if (this.centerY<ch1.centerY) {
		this.isUpKey = false;
		this.isDownKey = true;
	} else if (this.centerY>=ch1.centerY) {
		this.isUpKey = true;
		this.isDownKey = false;
	}

	}
};

Alien.prototype.checkDirection = function() {
	if(this.isUpKey && this.topY>50) {
		if(this.topY == 300) {
			if((this.leftX>=360 && this.leftX<=440) || (this.rightX<=440 && this.rightX>=360)) this.drawY = 300;
			else this.drawY -= this.speed;
		} else this.drawY -= this.speed;
	}
	if(this.isRightKey){
		if(this.topY<300 && ((this.leftX>=50 && this.rightX<360) || (this.leftX>=440 && this.rightX<gameWidth-50))) { //>= gdy jestesmy przy granicy = nie ogarniczamy ruchu
			this.drawX += this.speed;
		} else if (this.topY>=300 && this.rightX<gameWidth-50) {
			this.drawX += this.speed;
		}
	}
	if(this.isDownKey && this.bottomY<gameHeight-50) {
		this.drawY += this.speed;
	}
	if(this.isLeftKey){
		if(this.topY<300 && ((this.leftX>50 && this.rightX<=360) || (this.leftX>445 && this.rightX<=gameWidth-50))) {
			this.drawX -= this.speed;
		} else if (this.topY>=300 && this.leftX>50) {
			this.drawX -= this.speed;
		}
	}
	this.centerX = this.drawX + this.width/2;
	this.centerY = this.drawY + this.height/2;
};
//STOP Alien

//START event
function checkKeyDown(e) {	//jezeli wcisniety przy rysowaniu w grę wchodzi this.checkDirection(); od Jet
							//np. wcisniety [->] => jet1.isRightKey = true => przy rysowaniu spelniony warunek dla 
							//intrukcji warunkowej i w efekcie operacja this.drawX += this.speed;
	var keyID = e.keyCode || e.which;
	if (keyID === 38 || keyID === 87) { //up and W
		//alert('up arrow was pressed');
		ch1.isUpKey = true;
		e.preventDefault();
	}
	if (keyID === 39 || keyID === 68) { //right and D
		ch1.isRightKey = true;
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83) { //down and S
		ch1.isDownKey = true;
		e.preventDefault();
	}
	if (keyID === 37 || keyID === 65) { //left and A
		ch1.isLeftKey = true;
		e.preventDefault();
	}
	if (keyID === 32) { //Space bar
		ch1.isSpaceBar = true;
		e.preventDefault();
	}
}

function checkKeyUp(e) {
	var keyID = e.keyCode || e.which; //(e.keyCode) ? e.keyCode :e.which;
	if (keyID === 38 || keyID === 87) { //up and W
		ch1.isUpKey = false;
		e.preventDefault();
	}
	if (keyID === 39 || keyID === 68) { //right and D
		ch1.isRightKey = false;
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83) { //down and S
		ch1.isDownKey = false;
		e.preventDefault();
	}
	if (keyID === 37 || keyID === 65) { //left and A
		ch1.isLeftKey = false;
		e.preventDefault();
	}
	if (keyID === 32) { //Space bar
		ch1.isSpaceBar = false;
		e.preventDefault();
	}
}
//END event
