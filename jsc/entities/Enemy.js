const Enemy = function Enemy (sprite, player) {
	if (!sprite || !player) return

	let position = new Point(0, 0)
	let velocity = new Vector(0, 0)

	const speed = 3
	const radius = 10
	const attack = 20

	const randomPosition = (w, h) => {
		return new Point(Math.random() * w, Math.random() * h)
	}

	this.init = function enemyInit (con, data) {
		const w = data.world
		position = randomPosition(w.width, w.height)
		velocity = Vector.fromPoints(position, player.position()).normalize(speed)
		sprite.setContext(con)
	}

	this.update = function enemyUpdate (dlt, data) {
		const w = data.world

		let target = player.position()

		if (Math.random()*100 <= 70)
			target = randomPosition(w.width, w.height)

		if (player.circleColided(position, radius)) {
			player.takeDamage(attack)
			position = randomPosition(w.width, w.height)
		}

		const steering = Vector
			.fromPoints(position, target)
			.sub(velocity)
			.normalize()
			.scaleBy(0.2)

		velocity = velocity.add(steering).normalize().scaleBy(speed)

		position = position.moveByVector(velocity)
	}

	this.render = function enemyRender (con) {
		sprite.draw(position.x, position.y)
	}

	this.position = () => position
}