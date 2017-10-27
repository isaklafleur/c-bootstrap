'use strict';

var INTERVAL_MS = 100;

var GAME_OVER_SEC = 3;
var ENEMIES_MSEC = 1000;

function Game (containerElement) {
  var self = this;

  self.containerElement = containerElement;
  self.canvas = null;
  self.ctx = null;

  self.width = null;
  self.height = null;

  self.state = null;
  self.objects = [];

  // timeouts/intervals/animationFrame
  self.intervalId = null;
  self.frameId = null;

  // -- private

  self.clearCallbacks = function () {
    window.clearInterval(self.intervalId);
    window.cancelAnimationFrame(self.frameId);
  };

  self.setCallbacks = function () {
    self.intervalId = window.setInterval(function () {
      self.update();
    }, INTERVAL_MS);
    self.frameId = window.requestAnimationFrame(function () {
      self.render();
    });
  };

  self.destroyObject = function (object) {
    var index = self.objects.indexOf(object);
    if (index !== -1) {
      self.objects.splice(index, 1);
    }
  };

  self.update = function () {
    self.objects.forEach(function (obj) {
      obj.update();
    });
  };

  self.render = function () {
    self.ctx.clearRect(0, 0, self.width, self.height);
    self.objects.forEach(function (obj) {
      obj.render();
    });
    self.frameId = window.requestAnimationFrame(function () {
      self.render();
    });
  };

  self.resize = function () {
    self.clearCallbacks();
    window.setTimeout(function () {
      self.width = self.containerElement.clientWidth;
      self.height = self.containerElement.clientHeight;
      self.ctx.canvas.width = self.width;
      self.ctx.canvas.height = self.height;
      self.objects.forEach(function (object) {
        object.setScale(self.width, self.height);
      });
      self.setCallbacks();
    });
  };

  // - dom events

  self.handleDocClick = function (event) {
    self.start();
  };
  self.handleDocKeyPress = function () {
    self.player.toggle();
  };
  // -- public

  self.init = function () {
    if (self.state) {
      self.objects.forEach(function (obj) {
        obj.destroy();
      });
      self.objects.splice(0);
    } else {
      self.canvas = document.createElement('canvas');
      self.canvas.id = 'stage';
      self.containerElement.appendChild(self.canvas);
      self.ctx = self.canvas.getContext('2d');
      self.resize();
    }

    document.addEventListener('click', self.handleDocClick);

    self.state = 'splash';
  };

  self.start = function () {
    self.deaths = 0;
    self.player = new Player(self.ctx, self.width, self.height);
    self.objects.push(self.player);
    self.player.onDie(function () {
      self.deaths++;
    });
    self.player.onWin(function () {
      self.gameOver();
    });
    self.enemiesIntervalId = window.setInterval(function () {
      var enemy = new Enemy(self.ctx, self.width, self.height);
      self.objects.push(enemy);
      enemy.onDie(function () {
        self.destroyObject(enemy);
      });
    }, ENEMIES_MSEC);

    document.addEventListener('keypress', self.handleDocKeyPress);

    document.removeEventListener('click', self.handleDocClick);
  };

  self.gameOver = function () {
    self.player = null;
    window.clearInterval(self.enemiesIntervalId);

    document.removeEventListener('keypress', self.handleDocKeyPress);

    window.setTimeout(function () {
      self.init();
    }, GAME_OVER_SEC * 1000);
  };
}
