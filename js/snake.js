(function(){
  if (typeof SnakeGame === "undefined"){
    window.SnakeGame = {};
  }

  var Coord = SnakeGame.Coord = function (i, j) {
    this.i = i;
    this.j = j;
  };

  Coord.prototype.equals = function (coord2) {
    return (this.i == coord2.i) && (this.j == coord2.j);
  };

  Coord.prototype.isOpposite = function (coord2) {
    return (this.i == (-1 * coord2.i)) && (this.j == (-1 * coord2.j));
  };

  Coord.prototype.plus = function (coord2) {
    return new Coord(this.i + coord2.i, this.j + coord2.j);
  };

  var Apple = SnakeGame.Apple = function (board) {
    this.board = board;
    this.replace();
  };

  Apple.prototype.replace = function () {
    var x = Math.floor(Math.random() * this.board.SIZE);
    var y = Math.floor(Math.random() * this.board.SIZE);

    this.position = new Coord(x,y);
    this.board.snake && this.overlapSnake();
  };

  Apple.prototype.overlapSnake = function () {
    var snakeSegments = this.board.snake.segments;
    var length = snakeSegments.length;

    for (var i = 0; i < length; i++) {
      if (snakeSegments[i].equals(this.position)) {
        this.replace2();
        return;
      }
    }
  };

  var Snake = SnakeGame.Snake = function (board) {
    this.board = board;
    this.center();
    this.growth = 0;
  };

  Snake.prototype.center = function () {
    var centerCoord = Math.floor(this.board.SIZE/2)
    var center = new Coord(centerCoord, centerCoord);
    this.segments = [center];
    this.dir = "N";
  };

  Snake.DIRS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };

  Snake.prototype.eatApple = function () {
    if (this.head().equals(this.board.apple.position)) {
      this.growth += 2;
      this.board.view.addScore();
      return true;
    } else {
      return false;
    }
  };

  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.isValidMove = function () {
    if (!this.board.validPosition(this.head())) {
      return false;
    }

    for (var i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(this.head())) {
        return false;
      }
    }

    return true;
  };

  Snake.prototype.move = function () {
    this.segments.push(this.head().plus(Snake.DIRS[this.dir]));

    if (this.eatApple()) {
      this.board.apple.replace();
    }

    if (this.growth > 0) {
      this.growth -= 1;
    } else {
      this.segments.shift();
    }

    if (!this.isValidMove()) {
      this.segments = [];
      this.board.view.over = true;
    }
  };

  Snake.prototype.turn = function (newDir) {
    if ((this.segments.length > 1) &&
    Snake.DIRS[this.dir].isOpposite(Snake.DIRS[newDir])) {
      return;
    } else {
      this.dir = newDir;
    }
  };

  var Board = SnakeGame.Board = function (size, view) {
    console.log("new board");
    this.SIZE = size;
    this.view = view;

    this.apple = new Apple(this);
    this.snake = new Snake(this);
  };


  Board.prototype.validPosition = function (coord) {
    return (coord.i >= 0) && (coord.i < this.SIZE) && (coord.j >= 0) && (coord.j < this.SIZE);
  };

})();
