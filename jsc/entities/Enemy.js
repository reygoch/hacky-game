const Enemy = function Enemy (sprite, player) {
	if (!sprite || !player) return

	const target = player.position()

	let radius = 10
	const position = new Point(0, 0)
	const velocity = new Vector(0, 0)
	const maxSpeed = 3

	const randomPosition = (w, h) => {
		position.x = Math.random() * w
		position.y = Math.random() * h
	}

	this.init = function enemyInit (con, data) {
		const w = data.world
		randomPosition(w.width, w.height)
		velocity.fromPoints(position, target).normalize(maxSpeed)
		sprite.setContext(con)
	}

	this.update = function enemyUpdate (dlt, data) {
		const w = data.world

		if (player.circleColided(position, radius))
			randomPosition(w.width, w.height)

		const steering = new Vector(0, 0)
			.fromPoints(position, target)
			.sub(velocity)
			.normalize()
			.scale(2)

		velocity.add(steering).normalize().scale(maxSpeed)

		position.moveByVector(velocity)
	}

	this.render = function enemyRender (con) {
		sprite.draw(position.x, position.y)
	}

	this.position = () => position
}