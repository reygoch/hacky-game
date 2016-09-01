const ScoreDisplay = function ScoreDisplay (player) {

	this.init   = function scoreDisplayInit (con, data) {
		con.font = "bold 20px Arial"
		con.fillStyle = "#fff"
	}

	this.update = function scoreDisplayUpdate (dlt) {}

	this.render = function scoreDisplayRender (con) {
		con.fillText("score : " + player.score(), 10, 25)
	}
}