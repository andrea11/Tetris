/*jshint esversion: 6 */
"use strict";
// Constants
const KEY     	= { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
    TYPE 		= [ "I", "O", "L", "L_INVERSE", "T", "U", "EMPTY"],
    COLOR 		= { "I": "red", "O": "blue", "L": "yellow", "L_INVERSE": "green", "T": "orange", "U": "indigo", "EMPTY": "empty"},
    STRUCTURE 	= { "I":
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
    WIDTH 		= 12,
    HEIGHT 		= 24,
    CELL_SIZE	= 15,
    ITERATIONS 	= 5;

// Globals
var grilha,
	speed = 1000,
	frames,
	peca;

// Class Grid \\
/*
	x
	y
*/
class grid {
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

		this.grid = document.createElement("div");
		this.grid.id = "matrix";

		var matrixHeight = this.matrix.length,
			matrixWidth; 
		for (var h = 0; h < matrixHeight; h++) {
			matrixWidth = this.matrix[h].length;
			for (var w = 0; w < matrixWidth; w++) {
				this.grid.appendChild(this.matrix[h][w].HTML);
			}
		}

	}

	checkLines() {
		var lines = 0;
		var matrixHeight = this.matrix.length,
			matrixWidth;
		loop:
		for (var h = matrixHeight - 1; h >= matrixHeight - 4; h--) {
			matrixWidth = this.matrix[h].length;
			for (var w = matrixWidth - 1; w >= 0; w--) {
				if (this.matrix[h][w].status()) {
					break loop;
				}
			}
			lines++;
		}

		if (lines !== 0) {
			this.removeLines(lines);
			// Points
		}
	}

	removeLines(lines) {
		var matrixHeight = this.matrix.length,
			matrixWidth;
		for (var h = 0; h < matrixHeight - lines; h++) {
			matrixWidth = this.matrix[h].length;
			for (var w = 0; w < matrixWidth; w++) {
				this.matrix[h][w].changeType(this.matrix[h+lines][w].type);
			}
		}

		for (var h = 0; h < lines; h++) {
			matrixWidth = this.matrix[h].length;
			for (var w = 0; w < matrixWidth; w++) {
				this.matrix[h][w].changeType(TYPE.EMPTY);
			}
		}
	}

	draw(peca) {
		this.grid.appendChild(peca.HTML);
	}

	collision(peca) {

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

		this.matrix = STRUCTURE[id_type].map(function(arr) {
			return arr.slice();
		});

		this.grid = document.createElement("div");
		this.grid.id = "peca";
		this.grid.style.position = "absolute";

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

	rotateToLeft() {
		var temp = STRUCTURE["EMPTY"].map(function(arr) {
				return arr.slice();
			}),
			length = this.matrix.length;
		for (var h = 0; h < length; h++){
		    for (var w = 0; w < length; w++){
		    	temp[h][w] = this.matrix[w][length - h - 1].status ? 1 : 0;
		    }
		}
		for (var h = 0; h < length; h++){
		    for (var w = 0; w < length; w++){
		    	if (temp[h][w] === 1) {
		        	this.matrix[h][w].type = this.id_type;
		        } else {
		        	this.matrix[h][w].initalize();
		        }
		    }
		}
		this.translate();
	}

	rotateToRight() {
		var temp = STRUCTURE["EMPTY"].map(function(arr) {
				return arr.slice();
			}),
			length = this.matrix.length;
		for (var h = 0; h < length; h++){
		    for (var w = 0; w < length; w++){
		        temp[h][w] = this.matrix[length - w - 1][h].status ? 1 : 0;
		    }
		}
		for (var h = 0; h < length; h++){
		    for (var w = 0; w < length; w++){
		    	if (temp[h][w] === 1) {
		        	this.matrix[h][w].type = this.id_type;
		        } else {
		        	this.matrix[h][w].initalize();
		        }
		    }
		}
		this.translate();
	}

	translate() {
		var temp = STRUCTURE["EMPTY"].map(function(arr) {
				return arr.slice();
			}),
			length = this.matrix.length,
			emptyLine = 0,
			emptyColumn = 0;

		// Check if there is one or more empty line
		lines:
		for (var h = length - 1; h >= 0 ; h--) {
			for (var w = length - 1; w >= 0 ; w--) {
				if (this.matrix[h][w].status) {
					break lines;
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
		for (var h = 0; h < length; h++){
		    for (var w = 0; w < length; w++){
		    	if (temp[h][w] === 1) {
		        	this.matrix[h][w].type = this.id_type;
		        } else {
		        	this.matrix[h][w].initalize();
		        }
		    }
		}
	}

	moveDown() {
		this.grid.offsetTop += CELL_SIZE;
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

	initalize() {
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

// Main
document.onreadystatechange = function () {
	var state = document.readyState
	if (state == 'complete') {
		initGame();
		updateGame();		
	}
}

function initGame() {
	grilha = new grid(WIDTH, HEIGHT);
	document.body.appendChild(grilha.HTML);
	frames = 0;
	setTimeout(function(){console.log(peca.matrix)}, 5000);
	// document.getElementById('matrix').style.display = 'none';
	// document.getElementById('matrix').style.display = 'block';
}

function updateGame() {
	var type = TYPE[Math.floor(Math.random() * 7)];
	if (!peca) {
		peca = new Peca(0, 0, type);
		grilha.draw(peca);
	}
	peca.rotateToRight();
	// peca.moveDown();
	grilha.matrix[10][10].type = type;

	// Variable speed 
	if (frames++ / (ITERATIONS * HEIGHT) % 1 == 0) {
		// 1/n
		speed -= speed > 300 ? 20 : 0;
	}
	setTimeout(updateGame, speed);
}