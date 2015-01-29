(function () {
  if (typeof SnakeGame === "undefined"){
    window.SnakeGame = {};
  }

  var View = SnakeGame.View = function($el) {
    this.$el = $el;

    this.board = new SnakeGame.Board(25);
    this.setUpBoard();
    this.speed = 200;

  };

  View.NAVKEYS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W"
  };

  View.SPEEDS = {
    "worm": 300,
    "rattlesnake": 200,
    "black-mamba": 300
  };

  View.prototype.prepareGame = function (options) {
    var that = this;
    options.find("#difficulty-settings").submit(function() {
      $("#start-game").blur();
      event.preventDefault();
      that.speed = View.SPEEDS[event.currentTarget.difficulty.value];
      that.startInterval();
      $(window).on("keydown", that.handleKey.bind(that));
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

  View.prototype.render = function(){
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

  View.prototype.setUpBoard = function(){
    var html = "";

    for (var i = 0; i < this.board.SIZE; i++) {
      html += "<ul class='group'>";
      for (var j = 0; j < this.board.SIZE; j++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = this.$el.find("li");
  };

  View.prototype.step = function(){
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      console.log("You lose!");
      this.stopInterval();
    }
  };

  View.prototype.startInterval = function () {
    this.pause = false;

    SnakeGame.interval = window.setInterval(
      this.step.bind(this),
      this.speed
    );
  };

  View.prototype.stopInterval = function () {
    this.pause = true;
    window.clearInterval(SnakeGame.interval);
  };

})();
