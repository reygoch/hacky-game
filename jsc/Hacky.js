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
	const init = () => {scn.forEach((x) => {x.init(con, data)})}

	const update = (dlt) => {scn.forEach((x) => {x.update(dlt, data)})}
	const render = (con) => {this.clear(); scn.forEach((x) => {x.render(con)})}

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

		render()

		frameID = requestAnimationFrame(mloopy)
	}

	// utility functions
	this.embed = () => {doc.body.appendChild(can)}
	this.start = () => {init(); frameID = requestAnimationFrame(mloopy)}
	this.clear = () => {con.clearRect(0, 0, can.width, can.height)}

	this.addToUI = (entity) => {ui.push(entity)}
	this.addToScene = (entity) => {scn.push(entity)}

	this.test = () => {
		let starSprite = new Sprite(doc.getElementById('star'), con, true)
		let playerSprite = new Sprite(doc.getElementById('player-spritesheet'), con)
		let playerSpritesheet = new Spritesheet(playerSprite, 5, 2)

		playerSpritesheet.draw(0, 35, 35)
		starSprite.draw(80, 80)
	}

	// event handlers
	const mouseup = (e) => {data.mouse.down = false; data.mouse.up = true}
	const mousedown = (e) => {data.mouse.down = true; data.mouse.up = false}
	const mousemove = (e) => {data.mouse.position.moveTo(e.offsetX, e.offsetY)}

	const touchmove = (e) => {
		const rect = e.target.getBoundingClientRect()
		const touch = e.changedTouches[0]
		data.mouse.position.moveTo(touch.pageX - rect.left, touch.pageY - rect.top)
	}

	// mouse event subscriptions
	can.addEventListener('mouseup', mouseup)
	can.addEventListener('mousedown', mousedown)
	can.addEventListener('mousemove', mousemove)

	// touch event subscriptions
	/*
	can.addEventListener('touchend', mouseup)
	can.addEventListener('touchstart', mousedown)
	can.addEventListener('touchmove', touchmove)
	*/
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

Point.prototype.moveTo = function (x, y) {this.x = x; this.y = y; return this}
Point.prototype.moveToPoint = function (point) {this.x = point.x; this.y = point.y; return this}
Point.prototype.moveByVector = function (v) {this.x += v.x; this.y += v.y; return this}

// vector class
function Vector (x, y) {
	this.x = x
	this.y = y
}

Vector.prototype.scalar = function () {return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))}
Vector.prototype.add = function (v) {this.x += v.x; this.y += v.y; return this}
Vector.prototype.sub = function (v) {this.x -= v.x; this.y -= v.y; return this}
Vector.prototype.scale = function (s) {this.x *= s; this.y *= s; return this}
Vector.prototype.fromPoints = function (p1, p2) {this.x = p2.x - p1.x; this.y = p2.y - p1.y; return this}
Vector.prototype.reflect = function (direction) {
	if (direction == 'horizontal')
		this.y *= -1
	else if (direction == 'vertical')
		this.x *= -1

	return this
}
Vector.prototype.normalize = function () {
	const scalar = this.scalar()
	this.x /= scalar
	this.y /= scalar
	return this
}