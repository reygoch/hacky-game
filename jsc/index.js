const playerImg =
	document.getElementById('player-spritesheet')

const enemyImg =
	document.getElementById('star')

const player =
	new Player(new Sprite(playerImg))

const enemySprite =
	new Sprite(enemyImg, true)

const game = new Hacky()
	  game.addToScene(player)
	  for (i = 0; i < 10; i++)
	  	game.addToScene(new Enemy(enemySprite, player.position()))
	  game.start()
	  game.embed()
