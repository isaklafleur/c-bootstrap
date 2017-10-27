'use strict';

var SIZE = 0.05;
var Y_SPEED = 0.1;

function Enemy (ctx, width, height) {
  var self = this;

  self.ctx = ctx;
  self.width = width;
  self.height = height;

  self.x = Math.random();
  self.y = -0.1;
  self.onDieCallback = null;

  self.onDie = function (onDieCallback) {
    self.onDieCallback = onDieCallback;
  };

  self.update = function () {
    self.y = self.y + Y_SPEED;
    if (self.y > 1) {
      self.onDieCallback();
    }
  };

  self.render = function () {
    var x = Math.round(self.x * self.width);
    var y = Math.round(self.y * self.height);
    var width = Math.round(SIZE * self.width);
    var height = Math.round(SIZE * self.height);

    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fillRect(x, y, width, height);
  };

  self.destroy = function () {
    self.ctx = null;
    self.onDieCallback = null;
  };
}
