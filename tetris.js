"use strict";

// Classe Grid \\
class grid {
	constructor(x, y) {
		this.x = typeof x !== 'undefined' ? x : 12;
		this.y = typeof y !== 'undefined' ? y : 24;

		var matrix = [];

		for (var i = x; i > 0; i--) {
			for (var j = y; i > 0; i--) {
				matrix[x][y] = false;
			}
		}

		this.matrix = matrix;
	}

	checkline() {
		for (var h = Things.length - 1; i >= 0; i--) {
			for (var l = this[this.length].length - 1; i >= 0; i--) {
				Things[i]
			}
		}
	}
}

// Classe Peca \\
class Peca {
	constructor(id_tipo, x, y, matrix) {
		this.id_tipo = id_tipo;
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

// Classe Casa \\
class Casa {
	constructor(x, y, id_tipo, id_html) {
		this.x = x;
		this.y = y;
		this.id_tipo = id_tipo;
		this.id_html = id_html;	
	}
}

