(function(){
  if (typeof SnakeGame === "undefined"){
    window.SnakeGame = {};
  }

  var Controller = SnakeGame.Controller = function () {
    this.gameView = new SnakeGame.View(this);
    console.log("preparing from index");
    this.gameView.prepareGame();
  };

  Controller.prototype.resetGame = function () {
    window.off();
    this.gameView = new SnakeGame.View(this);
    this.gameView.prepareGame();
  };

})();
