const Player = function Player (sprite) {
	if (!sprite) return
	
	let health = 100
	let active = false

	const radius = 35
	const position = {x : 0, y : 0}
	const spritesheet = new Spritesheet(sprite, 5, 2)

	const contains = (x, y) => Math.sqrt(Math.pow(position.x - x, 2) + Math.pow(position.y - y, 2)) <= radius
	
	this.init = function playerInit (con, data) {
		sprite.setContext(con)
		position.x = data.world.width / 2
		position.y = data.world.height / 2
	}

	this.update = function playerUpdate (dlt, data) {
		const m = data.mouse
		
		// check if player is clicked
		if (m.down && contains(m.x, m.y))
			active = true
		else if (m.up)
			active = false

		if (active) {
			position.x = m.x
			position.y = m.y
		}
	}

	this.render = function playerRender (con) {
		let index = active ? 5 : 0
		spritesheet.draw(index, position.x, position.y)
	}
}