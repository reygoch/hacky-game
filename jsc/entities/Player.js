const Player = function Player (sprite) {
	if (!sprite) return

	let active = false
	const position = {x : 0, y : 0}
	const spritesheet = new Spritesheet(sprite, 5, 2)
	
	this.init = function playerInit (con, data) {
		sprite.setContext(con)
		position.x = data.world.width / 2
		position.y = data.world.height / 2
	}

	this.update = function playerUpdate (dlt, data) {
		if (position.x < data.world.width)
		position.x += 0.05*dlt
	}

	this.render = function playerRender (con) {
		spritesheet.draw(0, position.x, position.y)
	}
}