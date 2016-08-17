const Player = function Player (sprite) {
	if (!sprite) return
	
	let health = 100
	let active = false

	const radius = 35
	const deceleration = 0.95
	const position = new Point(0, 0)
	const velocity = new Vector(0, 0)
	const spritesheet = new Spritesheet(sprite, 5, 2)

	const contains = (point) => Math.sqrt(Math.pow(position.x - point.x, 2) + Math.pow(position.y - point.y, 2)) <= radius
	
	this.init = function playerInit (con, data) {
		sprite.setContext(con)
		position.x = data.world.width / 2
		position.y = data.world.height / 2
	}

	this.update = function playerUpdate (dlt, data) {
		const m = data.mouse
		const w = data.world

		if (active)
			velocity.fromPoints(position, m.position)
		else
			velocity.scale(deceleration)

		if (position.x - radius < 0 || position.x + radius > w.width)
			velocity.reflect('vertical')

		if (position.y - radius < 0 || position.y + radius > w.height)
			velocity.reflect('horizontal')

		// begin -- glitch fix
		if (position.y - radius < 0)
			position.y = radius
		else if (position.y + radius > w.height)
			position.y = w.height - radius

		if (position.x - radius <= 0)
			position.x = radius
		else if (position.x + radius > w.width)
			position.x = w.width - radius
		// end -- glitch fix

		// check if player is clicked
		if (m.down && contains(m.position))
			active = true
		else if (m.up)
			active = false

		if (active)
			position.moveToPoint(m.position)
		else
			position.moveByVector(velocity)
	}

	this.render = function playerRender (con) {
		let index = active ? 5 : 0
		spritesheet.draw(index, position.x, position.y)
	}

	this.position = () => position
}