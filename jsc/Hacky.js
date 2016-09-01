const Hacky = function Hacky (options) {
	const opt = options || {}

	const win = window
	const doc = document

	const can = doc.createElement('canvas')
		  can.width = opt.width || 800
		  can.height = opt.height || 550

	const con = can.getContext('2d')

	// game ui
	const ui = []

	// game scene
	const scn = []

	// environment variables
	let frameID = 0

	const maxFPS = 60,
		  timeStep = 1000 / 60

	const data = {
		delta : 0,
		curTime : 0,
		prevTime : 0,

		mouse : {
			position : new Point(0, 0),
			up : false,
			down : false
		},

		world : {
			width : can.width,
			height : can.height
		}
	}

	this.mouse = () => data.mouse.position

	// engine loop functions
	const init = opt.init || (() => {})

	const initialise = () => {
		init(con, data)
		
		scn.forEach(
			x => {x.init(con, data)}
		)

		ui.forEach(
			x => {x.init(con, data)}
		)
	}

	const update = (dlt) => {
		scn.forEach((x) => {x.update(dlt, data)})
		ui.forEach((x) => {x.update(dlt, data)})
	}

	const render = (con) => {
		this.clear()

		scn.forEach(
			x => {x.render(con)}
		)

		ui.forEach(
			x => {x.render(con)}
		)
	}

	// main game loop
	const mloopy = (timeStamp) => {
		data.curTime = timeStamp
		data.delta = data.curTime - data.prevTime

		if (data.curTime < data.prevTime + timeStep) {
			frameID = requestAnimationFrame(mloopy)
			return
		}

		data.prevTime = data.curTime

		update(data.delta)

		render(con)

		frameID = requestAnimationFrame(mloopy)
	}

	// utility functions
	this.embed = () => {doc.body.appendChild(can)}
	this.start = () => {initialise(); frameID = requestAnimationFrame(mloopy)}
	this.clear = () => {con.clearRect(0, 0, can.width, can.height)}

	this.addToUI = (entity) => {ui.push(entity)}
	this.addToScene = (entity) => {scn.push(entity)}

	// event handlers
	const mouseup = (e) => {data.mouse.down = false; data.mouse.up = true}
	const mousedown = (e) => {data.mouse.down = true; data.mouse.up = false}
	const mousemove = (e) => {data.mouse.position = new Point(e.offsetX, e.offsetY)}

	// mouse event subscriptions
	can.addEventListener('mouseup', mouseup)
	can.addEventListener('mousedown', mousedown)
	can.addEventListener('mousemove', mousemove)
}

// utility for simply drawing images on canvas
function Sprite (img, center, con) {
	center = !!center

	const x = (sx) => sx - (center ? img.width / 2 : 0),
		  y = (sy) => sy - (center ? img.height / 2 : 0)

	this.drawOn = function (con, sx, sy, sWidth, sHeight, dx, xy, dWidth, dHeight) {
		if (arguments.length == 3)
			con.drawImage(img, x(sx), y(sy))
		else if (arguments.length == 5)
			con.drawImage(img, sx, sy, sWidth, sHeight)
		else if (arguments.length == 9)
			con.drawImage(img, sx, sy, sWidth, sHeight, dx, xy, dWidth, dHeight)
	}

	this.draw = function (sx, sy, sWidth, sHeight, dx, xy, dWidth, dHeight) {
		const args = Array.prototype.slice.call(arguments)
		if (con != null)
			this.drawOn.apply(this, [con].concat(args))
	}

	this.width = () => img.width
	this.height = () => img.height
	this.setContext = (context) => {con = context}
}

// utility for drawing spritesheets
function Spritesheet (sprite, columns, rows) {
	const w = sprite.width() / columns,
		  h = sprite.height() / rows

	const sx = (index) => (index % columns) * w
		  sy = (index) => Math.floor(index / columns) * h

	this.draw = (index, x, y) => {
		const dx = x - w / 2,
			  dy = y - h / 2

		sprite.draw(sx(index), sy(index), w, h, dx, dy, w, h)
	}
}

// point class, for when I want to make a point ;D
function Point (x, y) {
	this.x = x
	this.y = y
}

Point.prototype.moveByVector = function (v) {
	return new Point (this.x += v.x, this.y += v.y)
}

Point.prototype.distanceTo = function (point) {
	return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2))
}

// vector class
function Vector (x, y) {
	this.x = x
	this.y = y
}

Vector.prototype.magnitude = function () {
	return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
}

Vector.prototype.add = function (vector) {
	return new Vector(this.x + vector.x, this.y + vector.y)
}

Vector.prototype.sub = function (vector) {
	return new Vector(this.x - vector.x, this.y - vector.y)
}

Vector.prototype.scaleBy = function (scalar) {
	return new Vector(this.x * scalar, this.y * scalar)
}

Vector.fromPoints = function (p1, p2) {
	return new Vector(p2.x - p1.x, p2.y - p1.y)
}

Vector.prototype.reflect = function (direction) {
	let x = this.x,
		y = this.y

	if (direction == 'horizontal')
		y *= -1
	else if (direction == 'vertical')
		x *= -1

	return new Vector(x, y)
}

Vector.prototype.normalize = function () {
	const magnitude = this.magnitude()
	return new Vector(this.x /= magnitude, this.y /= magnitude)
}