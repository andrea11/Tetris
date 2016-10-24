/*jshint esversion: 6 */
"use strict";
// Constants
var KEY     	= { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
    TYPE 		= { I: 1, O: 2, L: 3, L_INVERSE: 4, T: 5, U: 6, EMPTY: 7},
    WIDTH 		= 12,
    HEIGHT 		= 24,
    SPEED		= 500,
    CELL_SIZE	= 15;

// Globals
var matrix;

// Class Grid \\
class grid {
	constructor(x, y) {
		this.x = typeof x !== 'undefined' ? x : 12;
		this.y = typeof y !== 'undefined' ? y : 24;

		var matrix = [];

		for (var h = 0; h < y; h++) {
			matrix[h] = [];
			for (var w = 0; w < x; w++) {
				matrix[h][w] = new Casa(w,h);
			}
		}

		this.matrix = matrix;

		this.grid = document.createElement("div");
		this.grid.id = "matrix";

		var matrixHeight = this.matrix.length;
		var matrixWidth; 
		for (var h = 0; h < matrixHeight; h++) {
			matrixWidth = this.matrix[h].length;
			for (var w = 0; w < matrixWidth; w++) {
				this.grid.appendChild(this.matrix[h][w].HTML);
			}
		}

	}

	checkLines() {
		var lines = 0;
		var matrixHeight = this.matrix.length;
		var matrixWidth;
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
		var matrixHeight = this.matrix.length;
		var matrixWidth;
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

	get HTML() {
		return this.grid;
	}
}

// Class Peca \\
class Peca {
	constructor(id_type, x, y, matrix) {
		this.id_type = id_type;
		this.x = x;
		this.y = y;
		this.matrix = matrix;
	}

	rotateToLeft() {

	}

	rotateToRight() {

	}

	translate() {

	}
}

// Class Casa \\
class Casa {
	constructor(x, y, id_type, id_html) {
		this.x = x;
		this.y = y;
		this.id_type = typeof id_type !== 'undefined' ? id_type : TYPE.EMPTY;
		this.id_html = typeof id_html !== 'undefined' ? id_html : x + "_" + y;
		this.casa = document.createElement("div");
		this.casa.id = this.y + "_" + this.x;
		this.casa.class = "red";

	}

	changeType(id_type) {
		this.id_type = id_type;
		var color;
		switch (id_type) {
			case 1:
				color = "red";
				break;
			case 2:
				color = "blue";
				break;
			default:
				color = "green";
				break;
		}
		this.casa.setAttribute("class", color);
	}

	get status() {
		return this.id_type === TYPE.EMPTY ? false : true;
	}

	get type() {
		return this.id_type;
	}

	get HTML() {
		return this.casa;
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
	matrix = new grid(WIDTH, HEIGHT);
	document.body.appendChild(matrix.HTML);
	// document.getElementById('matrix').style.display = 'none';
	// document.getElementById('matrix').style.display = 'block';
}

function updateGame() {
	var n = Math.floor(Math.random() * 2 + 1);
	matrix.matrix[10][10].changeType(n);
	setTimeout(updateGame, SPEED);
}