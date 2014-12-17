(function(){
  if (typeof SnakeGame === "undefined"){
    window.SnakeGame = {};
  }

  var Snake = SnakeGame.Snake = function(options){
    this.dir = options.dir;
    this.segments = options.segments; // array of grid coords
    this.board = options.board;
    };

  Snake.prototype.move = function(){
    var snake = this;

    var newSegment = [this.segments[0][0], this.segments[0][1]];

    var incr = Snake.DIRS[snake.dir];
    newSegment[0] += incr[0];
    newSegment[1] += incr[1];
    console.log("Before segments: " + JSON.stringify(this.segments));

    this.segments.unshift(newSegment);
    this.segments.pop();
    console.log("New segment: " + JSON.stringify(newSegment));
    console.log("All segments: " + JSON.stringify(this.segments));

    this.board.anyCollisions();
  };


  Snake.prototype.turn = function(newDir){
    this.dir = newDir;
  };

  Snake.DIRS = {"N" : [0,-1], "E" : [1,0], "S" : [0,1], "W" : [-1, 0]};


  var Board = SnakeGame.Board = function(){

    var options = {
      dir: "N",
      segments: [[Math.floor(Board.SIZE/2), Math.floor(Board.SIZE/2)],
      [Math.floor(Board.SIZE/2)+1, Math.floor(Board.SIZE/2)],
      [Math.floor(Board.SIZE/2)+2, Math.floor(Board.SIZE/2)]],
      board: this
    };

    this.snake = new SnakeGame.Snake(options);

    this.apples = [];
  };

  Board.SIZE = 25;

  Board.prototype.anyCollisions = function(coord){
    var snakeFront = this.snake.segments[0];
    var length = this.snake.segments.length;
    var snakePenultimate = this.snake.segments[length-2];
    var snakeEnd = this.snake.segments[length-1];
    var diffX = snakeEnd[0] - snakePenultimate[0];
    var diffY = snakeEnd[1] - snakePenultimate[1];
    var otherSegments = this.snake.segments.slice(1);
    var board = this;

    // console.log("Other segments: " + JSON.stringify(otherSegments));

    this.apples.forEach(function (apple) {
      if (snakeFront[0] === apple[0] && snakeFront[1] === apple[1]) {
        var idx = board.apples.indexOf(apple);
        board.apples.splice(idx, 1);
        var newSegment = [snakeEnd[0] + diffX, snakeEnd[1] + diffY];
        board.snake.segments.push(newSegment);
      }
    });

    if (snakeFront[0] > Board.SIZE || snakeFront[1] > Board.SIZE ||
        snakeFront[0] < 0 || snakeFront[1] < 0) {
          console.log("You ran out of bounds!! " + JSON.stringify(snakeFront));
          throw new SnakeError("You lost!!");
    }

    otherSegments.forEach(function(seg) {
      if (seg[0] === snakeFront[0] && seg[1] === snakeFront[1]) {
        throw new SnakeError("You hit yourself dummy!");
      }
    });

  }

  var SnakeError = SnakeGame.SnakeError = function(msg){
    this.msg = msg;
  }

})();
