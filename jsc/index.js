const playerImg =
	document.getElementById('player-spritesheet')

const player =
	new Player(new Sprite(playerImg))

const game = new Hacky()
	  game.addToScene(player)
	  game.start()
	  game.embed()
