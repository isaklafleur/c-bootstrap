'use strict';

function init () {
  var parentElement = document.getElementById('game-container');
  var game = new Game(parentElement);
  game.init();

  window.addEventListener('resize', function () {
    game.resize();
  });
}

document.addEventListener('DOMContentLoaded', init);
