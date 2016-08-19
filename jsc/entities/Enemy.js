const Enemy = function Enemy (sprite, player) {
	if (!sprite || !player) return

	let position = new Point(0, 0)
	let velocity = new Vector(0, 0)

	const radius = 10
	const maxSpeed = 6

	const randomPosition = (w, h) => {
		return new Point(Math.random() * w, Math.random() * h)
	}

	this.init = function enemyInit (con, data) {
		const w = data.world
		position = randomPosition(w.width, w.height)
		velocity = Vector.fromPoints(position, player.position()).normalize(maxSpeed)
		sprite.setContext(con)
	}

	this.update = function enemyUpdate (dlt, data) {
		const w = data.world

		if (player.circleColided(position, radius))
			position = randomPosition(w.width, w.height)

		const steering = Vector
			.fromPoints(position, player.position())
			.sub(velocity)
			.normalize()
			.scaleBy(1)

		velocity = velocity.add(steering).normalize().scaleBy(maxSpeed)

		position = position.moveByVector(velocity)
	}

	this.render = function enemyRender (con) {
		sprite.draw(position.x, position.y)
	}

	this.position = () => position
}