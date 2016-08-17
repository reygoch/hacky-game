const Enemy = function Enemy (sprite, target) {
	if (!sprite) return

	let radius = 10
	const position = new Point(0, 0)
	const velocity = new Vector(0, 0)
	const maxSpeed = 3

	this.init = function enemyInit (con, data) {
		const w = data.world
		
		position.x = Math.random() * w.width
		position.y = Math.random() * w.height

		velocity.fromPoints(position, target).normalize(maxSpeed)
		sprite.setContext(con)
	}

	this.update = function enemyUpdate (dlt, data) {
		const steering = new Vector(0, 0)
			.fromPoints(position, target)
			.sub(velocity)
			.normalize()
			.scale(3)

		velocity.add(steering).normalize().scale(maxSpeed)

		position.moveByVector(velocity)
	}

	this.render = function enemyRender (con) {
		sprite.draw(position.x, position.y)
	}

	this.position = () => position
}