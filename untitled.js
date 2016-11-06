/*jshint esversion: 6 */
"use strict";
// Constants
const KEY     		= { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
    TYPE 			= [ "I", "O", "L", "L_INVERSE", "T", "U", "EMPTY"],
    COLOR 			= { "I": "red", "O": "blue", "L": "yellow", "L_INVERSE": "green", "T": "orange", "U": "indigo", "EMPTY": "empty"},
    STRUCTURE 		= { "I":
	    	 				 [[1, 0, 0, 0],
	    					  [1, 0, 0, 0],
	    					  [1, 0, 0, 0],
	    					  [1, 0, 0, 0]],
	    				"O":
	    					 [[0, 0, 0, 0],
	    					  [0, 0, 0, 0],
	    					  [1, 1, 0, 0],
	    					  [1, 1, 0, 0]],
	    				"L":
	    					 [[0, 0, 0, 0],
	    					  [1, 0, 0, 0],
	    					  [1, 0, 0, 0],
	    					  [1, 1, 0, 0]], 
	    				"L_INVERSE":
	    					 [[0, 0, 0, 0],
	    					  [0, 1, 0, 0],
	    					  [0, 1, 0, 0],
	    					  [1, 1, 0, 0]], 
	    				"T":
	    					 [[0, 0, 0, 0],
	    					  [0, 0, 0, 0],
	    					  [0, 1, 0, 0],
	    					  [1, 1, 1, 0]], 
	    				"U":
	    					 [[0, 0, 0, 0],
	    					  [0, 0, 0, 0],
	    					  [1, 0, 1, 0],
	    					  [1, 1, 1, 0]],
	    				"EMPTY" :
	    					 [[0, 0, 0, 0],
	    					  [0, 0, 0, 0],
	    					  [0, 0, 0, 0],
	    					  [0, 0, 0, 0]]
	    			},
    WIDTH 			= 12,
    HEIGHT 			= 24,
    CELL_SIZE		= 19,
    MAX_WIDTH 		= WIDTH * CELL_SIZE,
    MAX_HEIGHT		= HEIGHT * CELL_SIZE,
    POINTSCALE		= 500,
    STARTINGSPEED 	= 300;

// Globals
var grilha,
	speed,
	piece,
	game,
	chronometer,
	score,
	gameState;

// Class Grid \\
/*
	x
	y
*/
class Grid {
	constructor(x, y) {
		this.x = typeof x !== 'undefined' ? x : 12;
		this.y = typeof y !== 'undefined' ? y : 24;

		var matrix = [];

		for (var h = 0; h < y; h++) {
			matrix[h] = [];
			for (var w = 0; w < x; w++) {
				matrix[h][w] = new CasaGrid(w,h, "EMPTY");
			}
		}

		this.matrix = matrix;

		this.grid = document.getElementById("matrix");

		for (var h = 0; h < HEIGHT; h++) {
			for (var w = 0; w < WIDTH; w++) {
				this.grid.appendChild(this.matrix[h][w].HTML);
			}
		}

		this.time = document.getElementById("chrono");
		this.point = document.getElementById("score");
	}

	checkRows(piece) { //check how many rows need to be deleted
		var rowsFilled = [];
		for (var i = piece.y - 1; i >= piece.y - 4 && i>=0 ; i--) {
			for (var j = 0; j < WIDTH; j++) {
				if (!this.matrix[i][j].status) {
					break;
				}else if (j == WIDTH - 1){
					rowsFilled[rowsFilled.length] = i;
				}
			}
		}
		if(rowsFilled.length){
			this.removeRows(rowsFilled); //delete these rows
		}
		return rowsFilled.length; //return how many rows were deleted
	}
	removeRows(rows){ //delete these rows from the matrix
		for (var i = rows.length - 1; i >= 0; i--) {
			var end = 1;

			for (var j = rows[i]; j > 0; j--) {
				for (var k = 0; k < WIDTH; k++) {
					if (this.matrix[j-1][k].status) {
						end = 0;
					}
					this.matrix[j][k].type = this.matrix[j-1][k].type;
					this.matrix[j-1][k].initialize();
				}
				if(end) break;
			}
		}


	}
	create(piece) {
		this.grid.appendChild(piece.HTML);
	}

	destroy(piece) {
		this.grid.removeChild(piece.HTML);
	}

	draw(piece) {
		var x = piece.x,
			y = piece.y,
			length = piece.matrix.length;
		for (var h = 0; h < length; h++) {
		    for (var w = 0; w < length; w++) {
		    	if (piece.matrix[h][w].status) {
		    		this.matrix[y + h - 4][x + w].type = piece.matrix[h][w].type;
		    	}
		    }
		}
	}

	collisionTop(piece) { //check if the piece is colliding with matrix's top
		var x = piece.x,
			y = piece.y,
			length = piece.matrix.length;
		for (var h = 0; h < length; h++) {
		    for (var w = 0; w < length; w++) {
				if (y - 4 + h < 0 && piece.matrix[h][w].status) {
		    		return true;
			    }
			}
		}
		return false;
	}

	collisionBottom(piece) { //check if the piece is colliding with matrix's bottom
		var x = piece.x,
			y = piece.y,
			length = piece.matrix.length;
		if (y === 24) {
			return true;
		}
		for (var h = 0; h < length; h++) {
		    for (var w = 0; w < length; w++) {
				if (y - 3 + h > 0) {
			    	if (piece.matrix[h][w].status && this.matrix[y - 3 + h][x + w].status) {
			    		return true;
			    	}
			    }
			}
		}
		return false;
	}

	collisionBorderLeft(piece) { //check if the piece is colliding with matrix's left
		var x = piece.x,
			y = piece.y,
			length = piece.matrix.length;
		if (x===0){
			return true;
		}
		for (var h = 0; h < length; h++) {
		    for (var w = 0; w < length; w++) {
				if (y - 4 + h > 0 && x + w - 1 >= 0) {
			    	if (piece.matrix[h][w].status && this.matrix[y - 4 + h][x + w - 1].status) {
			    		return true;
			    	}
			    }
			}
		}
		return false;
	}

	collisionBorderRight(piece) { //check if the piece is colliding with matrix's right
		if (parseInt(piece.grid.style.right) >= MAX_WIDTH) {
			return true;
		}
		var x = piece.x,
			y = piece.y,
			length = piece.matrix.length;
		for (var h = 0; h < length; h++) {
		    for (var w = 0; w < length; w++) {
				if (y - 4 + h > 0) {
			    	if (piece.matrix[h][w].status && this.matrix[y - 4 + h][x + w + 1].status) {
			    		return true;
			    	}
			    }
			}
		}
		return false;
	}

	collisionRotationRight(piece) { //check if the piece is colliding with matrix's right when rotating
		var matrixTemp = piece.simulateRotationToRight(),
			x = piece.x,
			y = piece.y,
			length = matrixTemp.length;

		for (var h = 0; h < length; h++) {
		    for (var w = 0; w < length; w++) {
				if (y - 4 + h > 0) {
			    	if (matrixTemp[h][w] == 1 && (x + w >= WIDTH || this.matrix[y - h - 1][x + w].status)) {
			    		return true;
			    	}
			    }
			}
		}
		return false;
	}

	get HTML() {
		return this.grid;
	}
}

// Class Peca \\
/*
	x : 
	y : 
	id_type : 7 tipos possiveis (ver TYPE)
*/
class Peca {
	constructor(x, y, id_type) {
		this.id_type = id_type;
		this.x = x;
		this.y = y;

		this.matrix = STRUCTURE[id_type].map(function(arr) {
			return arr.slice();
		});

		this.grid = document.createElement("div");
		this.grid.id = "piece";
		this.grid.style.position = "absolute";
		this.grid.style.top = (y - 4) * CELL_SIZE + "px";
		this.grid.style.left = x * CELL_SIZE + "px";
		if (id_type == "I") {
			this.grid.style.right = (x + 1) * CELL_SIZE + "px";
		} else if (id_type == "O" || id_type == "L" || id_type == "L_INVERSE") {
			this.grid.style.right = (x + 2) * CELL_SIZE + "px";
		} else if (id_type == "T" || id_type == "U") {
			this.grid.style.right = (x + 3) * CELL_SIZE + "px";
		}

		var length = this.matrix.length;
		for (var h = 0; h < length; h++) {
			for (var w = 0; w < length; w++) {
				// Change 1 and 0 for Casa Object
				this.matrix[h][w] = this.matrix[h][w] ? new Casa(id_type) : new Casa("EMPTY");
				// Fill graphic variable grid
				this.grid.appendChild(this.matrix[h][w].HTML);
			}
		}
	}

	simulateRotationToRight() { //simulate how the piece is going to be when rotated
		var temp = STRUCTURE["EMPTY"].map(function(arr) {
				return arr.slice();
			}),
			length = this.matrix.length;
		for (var h = 0; h < length; h++) {
		    for (var w = 0; w < length; w++) {
		        temp[h][w] = this.matrix[length - w - 1][h].status ? 1 : 0;
		    }
		}
		return temp;
	}

	rotateToRight() { //rotate the piece to right
		var temp = STRUCTURE["EMPTY"].map(function(arr) {
				return arr.slice();
			}),
			length = this.matrix.length;
		for (var h = 0; h < length; h++) {
		    for (var w = 0; w < length; w++) {
		        temp[h][w] = this.matrix[length - w - 1][h].status ? 1 : 0;
		    }
		}
		for (var h = 0; h < length; h++) {
		    for (var w = 0; w < length; w++) {
		    	if (temp[h][w] === 1) {
		        	this.matrix[h][w].type = this.id_type;
		        } else {
		        	this.matrix[h][w].initialize();
		        }
		    }
		}
		this.translate();
	}

	translate() { //translate the piece matrix to the new position
		var temp = STRUCTURE["EMPTY"].map(function(arr) {
				return arr.slice();
			}),
			length = this.matrix.length,
			emptyLine = 0,
			emptyColumn = 0;

		// Check if there is one or more empty line
		rows:
		for (var h = length - 1; h >= 0 ; h--) {
			for (var w = length - 1; w >= 0 ; w--) {
				if (this.matrix[h][w].status) {
					break rows;
				}
			}
			emptyLine++;
		}
		// Check if there is one or more empty column
		columns:
		for (var w = 0; w < length; w++) {
			for (var h = 0; h < length; h++) {
				if (this.matrix[h][w].status) {
					break columns;
				}
			}
			emptyColumn++;
		}

		for (var h = length - 1; h >= 0; h--) {
			for (var w = length - 1; w >= 0; w--) {
				if (h - emptyLine >= 0 && w + emptyColumn < length) {
					temp[h][w] = this.matrix[h - emptyLine][w + emptyColumn].status ? 1 : 0;
				}
			}
		}
		var left = parseInt(this.grid.style.left);
		this.grid.style.right = 0 + "px"; //reset the property because the piece is now turned
		for (var h = 0; h < length; h++) {
		    for (var w = 0; w < length; w++) {
		    	if (temp[h][w] === 1) {
		        	this.matrix[h][w].type = this.id_type;
					if ((left + ((w + 1) * CELL_SIZE)) > parseInt(this.grid.style.right)) { //find the new value to the property right
						this.grid.style.right = left + ((w + 1) * CELL_SIZE) + "px";
					}
		        } else {
		        	this.matrix[h][w].initialize();
		        }
		    }
		}
	}

	moveDown() { //move the piece to down
		var top = isNaN(parseInt(this.grid.style.top)) ? 0 : parseInt(this.grid.style.top);
		if (top >= - 4 * CELL_SIZE && top < MAX_HEIGHT - 4 * CELL_SIZE) {
			this.grid.style.top = top + CELL_SIZE + "px";
			if (this.y < HEIGHT) this.y++;
		}
	}

	moveRight() { //move the piece to right
		var left = parseInt(this.grid.style.left);
		var right = parseInt(this.grid.style.right);
		this.grid.style.left = left + CELL_SIZE + "px";
		this.grid.style.right = right + CELL_SIZE + "px";
		this.x++;
	}

	moveLeft() { //move the piece to left
		var left = parseInt(this.grid.style.left);
		var right = parseInt(this.grid.style.right);
		this.grid.style.left = left - CELL_SIZE + "px";
		this.grid.style.right = right - CELL_SIZE + "px";
		this.x--;
	}

	get HTML() {
		return this.grid;
	}
}

// Class Casa \\
/*
	x
	y
	id_type : 7 tipos possiveis (ver TYPE)
*/
class Casa {
	constructor(id_type) {
		this.casa = document.createElement("div");
		this.type = typeof id_type !== 'undefined' ? id_type : TYPE.EMPTY;
	}

	initialize() {
		this.type = "EMPTY";
	}

	get color() {
		return this.casa.getAttribute("class");
	}

	set color(color) {
		this.casa.setAttribute("class", color);
	}

	get status() {
		return this.id_type === "EMPTY" ? false : true;
	}

	get type() {
		return this.id_type;
	}

	set type(id_type) {
		this.id_type = id_type;
		this.color = COLOR[id_type];
	}

	get HTML() {
		return this.casa;
	}
}

class CasaGrid extends Casa {
	constructor(x, y, id_type) {
		super(id_type);
		this.x = x;
		this.y = y;
	}

	move(x, y) {
		this.x = x;
		this.y = y;
	}
}

class ScoreBoard {
	constructor() {
		this.score = 0;
		this.level = 1;
		this.deletedRows = 0;
		this.scoreLabel = document.getElementById("scoreLabel");
		this.scoreLabel.innerHTML = "Pontuacao: " + this.score;
		this.levelLabel = document.getElementById("levelLabel");
		this.levelLabel.innerHTML = "Nivel: " + this.level;
		this.rowsLabel = document.getElementById("rowsLabel");
		this.rowsLabel.innerHTML = "Linhas eliminadas: " + this.deletedRows;
	}

	calculateScore(rows) {
		var scored = (rows * 10) * rows;
		this.score += scored;
		this.deletedRows += rows;
		this.level = parseInt(this.score / POINTSCALE) + 1;
		this.rowsLabel.innerHTML = "Linhas eliminadas: " + this.deletedRows;
		this.scoreLabel.innerHTML = "Pontuacao: " + this.score;
		this.levelLabel.innerHTML = "Nivel: " + this.level;
	}

	getPoints(){
		return this.score;
	}

	getDeletedRows(){
		return this.deletedRows;
	}
}

class Chronometer {
	constructor() {
		this.startTime = new Date();
		this.chrono = document.getElementById("chrono");
	}

	start() {
		this.actualTime = new Date();
		this.time = this.actualTime - this.startTime;
		this.time = new Date(this.time);
		var sec = this.time.getSeconds();
		var min = this.time.getMinutes();
		if (min < 10){
			min = "0" + min;
		}
		if (sec < 10){
			sec = "0" + sec;
		}
		this.chrono.innerHTML = "Tempo: " + min + ":" + sec;
		var temp = this;
		this.timerID = setTimeout(function () {
     		temp.start();
		}, 1000);
	}

	stop(){
		clearTimeout(this.timerID);
	}
}

// Main
document.onreadystatechange = function () {
	var state = document.readyState
	if (state == 'complete') {
		initGame();
		updateGame();		
	}
}

function initGame() {
	grilha = new Grid(WIDTH, HEIGHT);
	document.body.appendChild(grilha.HTML);
	score = document.getElementById("scoreLabel");
	speed = STARTINGSPEED;
	score = new ScoreBoard();
	chronometer = new Chronometer();
	chronometer.start();
	gameState = 1;
}

function updateGame() {
	if(gameState){
		var type = TYPE[Math.floor(Math.random() * 6)]; //randomize a new piece
		if (!piece) {
			piece = new Peca(4, 0, type);
			grilha.create(piece);
		}

		if (grilha.collisionBottom(piece)) {
			if (grilha.collisionTop(piece)) {
				endGame();
				return;
			}
			grilha.draw(piece);
			grilha.destroy(piece);
			var rows = grilha.checkRows(piece);
			if (rows) score.calculateScore(rows);
			piece = null;
		} else {
			piece.moveDown();
		}
		
		var futureSpeed = STARTINGSPEED - (parseInt(score.getPoints() / POINTSCALE) * 50);
		speed = futureSpeed > 30 ? futureSpeed : 30;
	}
	game = setTimeout(updateGame, speed);
}

function endGame() {
	document.body.onkeydown = null;
	chronometer.stop();
	clearTimeout(game);
	alert("Fim de jogo! Pressione OK para jogar novamente");
	location.reload();
}

function keyEvent(event) {
	if (piece !== null) {
		var key = event.keyCode || event.which;
		if (key == KEY.UP) {
			if (!grilha.collisionRotationRight(piece)) {
				piece.rotateToRight();
			}
		} else if (key == KEY.DOWN) {
			if (grilha.collisionBottom(piece)) {
				if (grilha.collisionTop(piece)) {
					grilha.gameOver();
					return;
				}
				grilha.draw(piece);
				grilha.destroy(piece);
				var rows = grilha.checkRows(piece);
				if (rows) score.calculateScore(rows);
				piece = null;
			} else {
				piece.moveDown();
			}
		} else if (key == KEY.RIGHT) {
			if (!grilha.collisionBorderRight(piece)) {
				piece.moveRight();
			}
		} else if (key == KEY.LEFT) {
			if (!grilha.collisionBorderLeft(piece)) {
				piece.moveLeft();
			}
		}
	}
}

function pausarJogo(){
	gameState = 0;
}
function continuarJogo(){
	gameState = 1;
}