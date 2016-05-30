//Función que contiene el tablero, el estado y el mensaje que se muestra del juego.
MemoryGame = function (gs) {

	//Asignamos el sistema gráfico introducido.
	this.graphicSystem = gs;

	//Array que contendrá las cartas del tablero y como están colocadas.
	this.boardCards = [
		new Card("8-ball"),
		new Card("potato"),
		new Card("dinosaur"),
		new Card("kronos"),
		new Card("rocket"),
		new Card("unicorn"),
		new Card("guy"),
		new Card("zeppelin"),
		new Card("8-ball"),
		new Card("potato"),
		new Card("dinosaur"),
		new Card("kronos"),
		new Card("rocket"),
		new Card("unicorn"),
		new Card("guy"),
		new Card("zeppelin")
	];

	//Guarda el estado actual del juego.
	this.gameState = "started";

	//Guarda el mensaje que se muestra por pantalla.
	this.message = "Memory Game";

	//Cuenta el número de cartas destapadas(Una o ninguna).
	this.uncoveredCount = 0;

	/*Guarda la posición de la carta destapada si la hay, sino guarda -1.
	Esto es muy útil para evitar recorrer el tablero en busca de la otra cara boca arriba.*/
	this.uncoveredCardPosition = -1;

	//Flag que sirve para controlar si se permite el uso de click o no.
	this.dontClick = false;

	//Inicializamos el juego añadiendo las cartas desordenadas y comenzando el bucle del juego.
	this.initGame = function() {
		this.boardCards = mergeCards(this.boardCards);
		//Inicio del bucle de juego.
		this.loop();	
	}

	//Dibuja el mensaje correspondiente y las cartas según su estado.
	this.draw = function() {
		gs.drawMessage(this.message);
		for (var i=0; i<this.boardCards.length; i++) {
			this.boardCards[i].draw(gs, i);
		}
	}

	this.loop = function() {
		//Dibuja el tablero cada 16 milisegundos
		var self = this;
		var timer = setInterval(function() {
			self.draw();
		}, 16);
	}

	this.onClick = function(cardId) {
		//Sólo si hay permiso de hacer click funcionará esta función.
		if (!this.dontClick) {
			//Sólo admite cartas válidas del tablero, si el usuario hace click en otro sitio no tendrá efecto.
			if ((cardId != null) && (cardId >= 0)) {
				//Si la carta no está boca abajo no tiene efecto al hacer click.
				if (this.boardCards[cardId].cardState == "facedown") {
					this.boardCards[cardId].flip();
					//Si no hay otra carta destapada, se marca esta como tal y termina la función a la espera de otro click.
					if (this.uncoveredCardPosition == -1) {
						this.uncoveredCardPosition = cardId;
					}

					//Si ya había una carta destapada, se compara con la que se acaba de destapar
					else {
						//Si son iguales se marcan como encontradas y se muestra el mensaje correspondiente.
						if (this.boardCards[cardId].compareTo(this.boardCards[this.uncoveredCardPosition].cardName)) {
							this.boardCards[cardId].found();
							this.boardCards[this.uncoveredCardPosition].found();
							this.uncoveredCount = this.uncoveredCount + 2;
							//Si se han encontrado todas, es decir, las 16 cartas acaba el juego.
							if (this.uncoveredCount == 16) {
								this.message = "You Win!!";
								this.gameState = "finalized";
							}

							else
								this.message = "Match found!!";
						}

						/*Si no coinciden, se mantienen durante 1 segundo antes de volverse a poner boca abajo.
						En este intervalo, se bloquea el uso de click en el tablero.*/
						else {
							var self = this;
							var pos = self.uncoveredCardPosition;
							setTimeout(function() {
								self.cover(cardId,pos);
							}, 1000);
							this.message = "Try Again";
							this.dontClick = true;
						}

						//Desmarca la posicion de la carta que estaba destapada.
						this.uncoveredCardPosition = -1;
					}
				}
			}
		}
	}

	//Funcion auxiliar que pone boca abajo dos cartas y desbloquea el flag que impedía hacer click.
	this.cover = function(pos1,pos2) {
		this.boardCards[pos1].flip();
		this.boardCards[pos2].flip();
		this.dontClick = false;
	}
}

//Función que representa una carta. Tiene un nombre y un estado.
Card = function(sprite) {
	this.cardName = sprite;

	//Inicializamos el estado de la carta a 'boca abajo'.
	this.cardState = "facedown";

	//Da la vuelta a la carta, cambiando el estado de la misma.
	this.flip = function() {
		if (this.cardState == "facedown")
			this.cardState = "faceup";

		else if (this.cardState == "faceup")
			this.cardState = "facedown";
	}

	//Marca una carta como encontrada
	this.found = function() {
		this.cardState = "found";
	}

	//Calcula si dos cartas son iguales o no.
	this.compareTo = function(otherCard) {
		return (this.cardName == otherCard);
	}

	//Dibuja la carta según su estado
	this.draw = function(gs, pos) {
		//Si está boca abajo se dibuja la imagen de 'back'.
		if (this.cardState == "facedown")
			gs.draw("back", pos);

		else
			gs.draw(this.cardName, pos);
	}
}

//Función que devuelve un array desordenado. Lo usamos para desordenar el tablero.
function mergeCards(cardList) {
	return cardList.sort(function() {
		return Math.random() - 0.5;
	});
}