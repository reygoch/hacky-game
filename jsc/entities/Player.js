const Player = function Player (sprite) {
	if (!sprite) return
	
	let score = 0
	let health = 100
	let active = false
	let position = new Point(0, 0)
	let velocity = new Vector(0, 0)

	const radius = 35
	const deceleration = 0.95
	const spritesheet = new Spritesheet(sprite, 5, 2)

	const healthGain = 1
	const healthLoss = 0.6
	const healthLevels = [20, 40, 60, 80, 100]

	const contains = (point) => Math.sqrt(Math.pow(position.x - point.x, 2) + Math.pow(position.y - point.y, 2)) <= radius
	
	this.init = function playerInit (con, data) {
		sprite.setContext(con)

		position = new Point(
			data.world.width / 2,
			data.world.height / 2
		)
	}

	this.takeDamage = function playerTakeDamage(x) {
		if (active)
			health = Math.max(0, health - x)
		else
			score += 1
	}

	this.update = function playerUpdate (dlt, data) {
		const m = data.mouse
		const w = data.world

		if (active)
			velocity = Vector.fromPoints(position, m.position)
		else
			velocity = velocity.scaleBy(deceleration)

		if (position.x - radius < 0 || position.x + radius > w.width)
			velocity = velocity.reflect('vertical')

		if (position.y - radius < 0 || position.y + radius > w.height)
			velocity = velocity.reflect('horizontal')

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

		if (active) {
			health = Math.min(health + healthGain, 100)
			position = new Point(m.position.x, m.position.y)
		} else {
			health = Math.max(0, health - healthLoss)
			position = position.moveByVector(velocity)
		}

	}

	this.circleColided = (p, r) => r + radius >= position.distanceTo(p)

	this.render = function playerRender (con) {
		let stuff = healthLevels.filter(x => health <= x)[0]
		let index = 5 - (stuff / 20)
			index += active ? 5 : 0

		spritesheet.draw(index, position.x, position.y)
	}


	this.position = () => position
	this.score = () => score
}