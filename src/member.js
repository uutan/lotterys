define(function(require, exports, module) {

  var $ = require('jquery');

  var CANVAS_HEIGHT = 500;
  var CANVAS_WIDTH = 800;

  var BALL_WIDTH = 80;
  var BALL_HEIGHT = 80;
  var LUCKY_BALL_WIDTH = 400;
  var LUCKY_BALL_HEIGHT = 400;
  var MAX_ZINDEX = 100;

  var DURATION_MIN = 100;
  var DURATION_MAX = 500;
  var ZOOM_DURATION = 500;


  function Member(name, options) {
    this.name = name;
    this.options = options || {};

    this.el = null;
    this.width = 0;
    this.height = 0;
    this.left = 0;
    this.top = 0;
    this.x = 0;
    this.y = 0;

    this.moving = false;
    this.lucky = false;

    this.createEl();
    this.move();
  }

  module.exports = Member;

  Member.prototype.createEl = function() {
    var html = "<li><img src="+this.options.face+" width='180' height='180'><div>"+this.options.realname+"</div></li>";
	this.el = $(html).appendTo('#member_lottery');
	this.width = 80;
    this.height = 80;
  }

  Member.prototype.move = function(callback) {
    this.left = r(0, CANVAS_WIDTH - this.width);
    this.top = r(0, CANVAS_HEIGHT - this.height);
    this.zIndex = r(0, MAX_ZINDEX);
	this.reflow(callback);
  }

  Member.prototype.reflow = function(callback, direct) {
    this.x = this.left + this.width / 2;
    this.y = this.top + this.height / 2;
    this.el[0].style.zIndex = this.zIndex;
	
    if (direct) {
		this.el[0].style.left = this.left;
        this.el[0].style.top = this.top;
    }else {
      this.el.animate({
        'left': this.left,
        'top': this.top
      }, r(DURATION_MIN, DURATION_MAX), 'easeOutBack', callback);
    }
  }

  Member.prototype.start = function() {
    this.reset();
    this.moving = true;
    this.autoMove();
  }

  Member.prototype.reset = function() {
    this.el.stop(true, true);
    this.lucky = false;
	
	this.el[0].className = '';
	this.width = this.el.width();
    this.height = this.el.height();

    this._maxTop = CANVAS_HEIGHT - this.height;
    this._maxLeft = CANVAS_WIDTH - this.width;
  }

  Member.prototype.autoMove = function() {
    var that = this;

    if (this.moving) {
      this.move(function() {
        that.autoMove();
      });
    }
  }

  Member.prototype.stop = function() {
    this.el.stop(true, true);
    this.moving = false;
  }

  Member.prototype.bang = function() {
    this.lucky = true;
	this.el[0].className = 'active';
    this.width = LUCKY_BALL_WIDTH;
    this.height = LUCKY_BALL_HEIGHT;
    this.left = (CANVAS_WIDTH - this.width) / 2;
    this.top = (CANVAS_HEIGHT - this.height) / 2;

    this.el.animate({
      'left': this.left,
      'top': this.top
    }, ZOOM_DURATION);
  }

  Member.prototype.beginHit = function() {
    this._xMove = 0;
    this._yMove = 0;
  }

  Member.prototype.hitMove = function() {
    this.left += this._xMove;
    this.top += this._yMove;

    this.top = this.top < 0 ? 0 : (this.top > this._maxTop ? this._maxTop : this.top);
    this.left = this.left < 0 ? 0 : (this.left > this._maxLeft ? this._maxLeft : this.left);

    this.reflow(null, false);
  }


  // Helpers
  function r(from, to) {
    from = from || 0;
    to = to || 1;
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

});

