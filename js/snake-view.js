(function () {
  if (typeof SnakeGame === "undefined"){
    window.SnakeGame = {};
  }

  var View = SnakeGame.View = function($el) {
    this.over = false;
    this.pause = true;
    this.canvas = $el;
    this.board = new SnakeGame.Board();
    this.generateApples();
    this.startGame();
  };

  View.prototype.bindKeys = function(){
    var board = this.board;
    var view = this;

    $(window).on('keydown', function(event){
      if (event.which === 38) { // up
        board.snake.turn("N");
      } else if (event.which === 39) { // right
        console.log("you pressed right");
        board.snake.turn("E");
      } else if (event.which === 40) { // down
        board.snake.turn("S");
      } else if (event.which === 37) { // left
        board.snake.turn("W");
      }  else if (event.which === 32) {
        if (view.pause) {
          view.startIntervals();
        } else {
          view.stopIntervals();
        }
      }
    });

  };

  View.prototype.generateApples = function () {
    var board = this.board;
    var numApples = Math.floor(Math.random() * SnakeGame.Board.SIZE) + 1 ;
    console.log(numApples);

    board.apples = [];

    for (var i = 0; i < numApples ; i++) {
      var apple1 = Math.random() * SnakeGame.Board.SIZE
      var apple2 = Math.random() * SnakeGame.Board.SIZE
      var apple = [Math.floor(apple1), Math.floor(apple2)];
      board.apples.push(apple);
    }
  };

  View.prototype.startIntervals = function () {
    this.pause = false;

    if (!this.over) {
      SnakeGame.interval1 = window.setInterval(function(){
        this.step();
      }.bind(this), 100);

      SnakeGame.interval2 = window.setInterval(function(){
        this.generateApples();
      }.bind(this), 5000);
    }
  };

  View.prototype.stopIntervals = function () {
    this.pause = true;
    window.clearInterval(SnakeGame.interval1);
    window.clearInterval(SnakeGame.interval2);
  };

  // call snake move and redraw whole board
  View.prototype.startGame = function (){
    this.setUpBoard();
    this.render();
    this.bindKeys();
  },

  View.prototype.step = function(){
    this.setUpBoard();
    this.render();
    this.bindKeys();
    try {
      this.board.snake.move();
    } catch (e) {
      alert(e.msg);
      this.stopIntervals();
      this.over = true;
    }

  };

  View.prototype.render = function(){
    var $lis = $("li");
    var board = this.board;

    $.each($lis, function (i, li) {
      var $li = $(li);
      var pos = $li.data("id");

      $.each(board.snake.segments, function(i, segment) {
        if (pos[0] === segment[0] && pos[1] === segment[1]) {
          $li.toggleClass("snake");
        }
      });

      $.each(board.apples, function(i, segment) {
        if (pos[0] === segment[0] && pos[1] === segment[1]) {
          $li.toggleClass("apple");
        }
      });

    });
  };

  View.prototype.setUpBoard = function(){
    this.canvas.empty();

    for (var i = 0; i < SnakeGame.Board.SIZE; i++) {
      var $ul = $("<ul class='group'></ul");
      for (var j = 0; j < SnakeGame.Board.SIZE; j++) {
        var $li = $("<li></li>");
        $li.data("id", [i,j]);
        $ul.append($li);
      }
      this.canvas.append($ul);
    }
  };

})();
