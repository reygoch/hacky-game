
const player =
	new Player(new Sprite(document.getElementById('player-spritesheet')))

const game = new Hacky()
	  game.addToScene(player)
	  game.start()
	  game.embed()