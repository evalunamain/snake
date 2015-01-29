(function () {
  if (typeof SnakeGame === "undefined"){
    window.SnakeGame = {};
  }

  var View = SnakeGame.View = function () {
    this.$gameEl = $("#game");

    this.$boardEl = this.$gameEl.find(".board");
    this.$settingsEl = this.$gameEl.find("#difficulty-settings");
    this.$scoreEl = this.$gameEl.find(".game-score");

    this.$messageEl = this.$gameEl.find(".message");
    this.$resetEl = this.$messageEl.find("#reset-game");

    this.board = new SnakeGame.Board(25, this);
    this.setUpBoard();
    this.render();

    $(window).on("keydown", this.handleKey.bind(this));
  };

  View.NAVKEYS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W"
  };

  View.SPEEDS = {
    "worm": 200,
    "rattlesnake": 100,
    "black-mamba": 50
  };

  View.prototype.prepareGame = function () {
    this.score = 0;
    this.speed = 0;

    var that = this;

    this.$settingsEl.on("submit", function() {
      that.$settingsEl.off();
      event.preventDefault();

      that.speed = View.SPEEDS[event.target.difficulty.value];
      $("#start-game").blur();

      that.startInterval();
    });
  };

  View.prototype.handleKey = function (event) {
    if (View.NAVKEYS[event.keyCode]) {
      this.board.snake.turn(View.NAVKEYS[event.keyCode]);
    } else if (event.which === 32) {
      if (this.pause) {
        this.startInterval();
      } else {
        this.stopInterval();
      }
    }
  };

  View.prototype.render = function () {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");
  };

  View.prototype.updateClasses = function(coords, className) {
    this.$li.filter("." + className).removeClass();

    coords.forEach(function(coord){
      var flatCoord = (coord.i * this.board.SIZE) + coord.j;
      this.$li.eq(flatCoord).addClass(className);
    }.bind(this));
  };

  View.prototype.setUpBoard = function () {
    var html = "";

    for (var i = 0; i < this.board.SIZE; i++) {
      html += "<ul class='group'>";
      for (var j = 0; j < this.board.SIZE; j++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$boardEl.html(html);
    this.$li = this.$boardEl.find("li");
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      this.stopInterval();
      this.resetGame();
    }
  };

  View.prototype.addScore = function () {
    this.score += 50;
    this.$scoreEl.text(this.score);
  };

  View.prototype.startInterval = function () {
    this.pause = false;
    var that = this;

    SnakeGame.interval = window.setInterval(
      that.step.bind(that),
      that.speed
    );
  };

  View.prototype.stopInterval = function () {
    this.pause = true;

    window.clearInterval(SnakeGame.interval);
  };

  View.prototype.resetGame = function () {
    this.$messageEl.addClass("active");
    var that = this;

    this.$resetEl.on("click", function (event)  {
      event.preventDefault();

      that.$resetEl.off();

      that.$messageEl.removeClass("active");

      that.$scoreEl.text(0);
      that.board.snake.center();
      that.board.apple.replace();
      that.render();

      that.prepareGame();

    })
  }

})();
