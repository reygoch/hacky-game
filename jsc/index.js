const game = new Hacky({init : init})

var everythingLoaded = setInterval(function() {
  if (/loaded|complete/.test(document.readyState)) {
    clearInterval(everythingLoaded);
    game.start()
    game.embed()
  }
}, 10);


function init (con, data) {
	const playerImg =
	document.getElementById('player-spritesheet')

	const enemyImg =
		document.getElementById('star')

	const player =
		new Player(new Sprite(playerImg))

	const enemySprite =
		new Sprite(enemyImg, true)

	game.addToScene(player)

	for (i = 0; i < 20; i++)
	  	game.addToScene(new Enemy(enemySprite, player))
}