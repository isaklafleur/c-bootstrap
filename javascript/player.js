'use strict';

var SIZE = 0.05;
var X_SPEED = 0.01;
var INITIAL_HEALTH = 1000;
var HEALTH_DEC = 10;
var HEALTH_INTERVAL_MSEC = 30;

function Player (ctx, width, height) {
  var self = this;

  self.ctx = ctx;
  self.width = width;
  self.height = height;

  self.x = 0;
  self.y = 0.9;
  self.onDieCallback = null;
  self.onWinCallback = null;

  self.paused = null;
  self.health = INITIAL_HEALTH;
  self.healthIntervalId = null;

  self.toggle = function () {
    if (self.paused) {
      self.paused = false;
      window.clearInterval(self.healthIntervalId);
    } else {
      self.paused = true;
      self.healthIntervalId = window.setInterval(function () {
        self.health -= HEALTH_DEC;
        if (self.health < 0) {
          self.onDieCallback();
          self.health = INITIAL_HEALTH;
          self.x = 0;
          self.toggle();
        }
      }, HEALTH_INTERVAL_MSEC);
    }
  };

  self.onDie = function (onDieCallback) {
    self.onDieCallback = onDieCallback;
  };

  self.onWin = function (onWinCallback) {
    self.onWinCallback = onWinCallback;
  };

  self.update = function () {
    if (!self.paused) {
      self.x = self.x + X_SPEED; // * (self.heath / INITIAL_HEALTH);
    }
    if (self.x > 1) {
      self.onWinCallback();
    }
  };

  self.render = function () {
    var x = Math.round(self.x * self.width);
    var y = Math.round(self.y * self.height);
    var width = Math.round(SIZE * self.width);
    var height = Math.round(SIZE * self.height);

    var alpha = self.health / INITIAL_HEALTH;
    ctx.fillStyle = 'rgba(0,0,0,' + alpha + ')';
    ctx.fillRect(x, y, width, height);
  };

  self.destroy = function () {
    self.ctx = null;
    self.onDieCallback = null;
    self.onWinCallback = null;
  };
}
