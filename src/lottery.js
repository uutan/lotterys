define(function(require, exports, module) {

  var $ = require('jquery');
  var Member = require('./member');
  require('jquery-easing');
  

  var angular = require('angularjs');
  var lottery = angular.module('LotteryApp',[]);
  var members = [];
  
  var HIT_SPEED = 10;
  var RIGIDITY = 4;  

  var showAction = {
	users: [],
	init: function(data){
		this.data = data;
		this.users = data.map(function(index,name) {
			return new Member(name, index);
		});
		this._bindUI();
	},	
    _bindUI: function() {
      var that = this;
      // bind button
      var trigger = $('#go');
      trigger.html(trigger.data('text-start'));
      trigger.click(function(){
		if (trigger.data('action') === 'start') {
          trigger.data('action', 'stop');
          trigger.html(trigger.data('text-stop'));
          that.start();
        }
        else {
          trigger.data('action', 'start');
          trigger.html(trigger.data('text-start'));
          that.stop();
        }
	  });

      // bind keydown
      document.addEventListener('keydown', function(ev) {
        if (ev.keyCode == '32') {
          trigger.trigger('click');
        }
        /*else if (ev.keyCode == '27') {
          that.moveLucky();
          $('.lucky_member_list li').eq(0).click();
        }*/
      }, false);

    },

    start: function() {
      this.timer && clearTimeout(this.timer);
      this.moveLucky();

      this.users.forEach(function(user) {
        user.start();
      });
    },

    stop: function() {
      var users = this.users;
      var z = 0, lucky = users[0];

      users.forEach(function(user) {
        user.stop();
        if (z < user.zIndex) {
          lucky = user;
          z = user.zIndex;
        }
      })

      lucky.bang();
      this.hit();
      this.luckyUser = lucky;
    },

    removeItem: function(item) {
      for (var i = 0; i < this.users.length; i++) {
        var user = this.users[i];
        if (user === item) {
          this.users.splice(i, 1);
        }
      }
    },

    addItem: function(name) {
      this.users.push(new Member(name));
    },

    moveLucky: function() {
      var luckyUser = this.luckyUser;
      if (luckyUser) {
        luckyUser.el[0].style.cssText = '';
        luckyUser.el.prependTo('.lucky_member_list');
        this.removeItem(luckyUser);
        this.luckyUser = null;
      }
    },

    setLucky: function(item) {
      this.users.forEach(function(user) {
        user.stop();
      });
      this.luckyUser = item;
      item.bang();
      this.hit();
    },

    hit: function() {
      var that = this;
      var hitCount = 0;
      var users = this.users;

      users.forEach(function(user) {
        user.beginHit();
      })

      for (var i = 0; i < users.length; i++) {
        for (var j = i + 1; j < users.length; j++) {
          if (isOverlap(users[i], users[j])) {
            hit(users[i], users[j]);
            hitCount++;
          }
        }
      }

      users.forEach(function(user) {
        user.hitMove();
      })

      if (hitCount > 0) {
        this.timer = setTimeout(function() {
          that.hit();
        }, HIT_SPEED);
      }
    }
	
  };	
  
  
  
  lottery.controller('MainCtrl', ['$scope', '$http', function($scope,$http) {
  	// 拉取抽奖数据
	$http.get('/api/default/get_user_list.html',{})
	.success(function(data){
		data = data.data;
		$scope.members = data;
		
		$(function(){
		showAction.init(data);	
		});
		
		
		
	}).error(function(){
		alert('数据载入失败，请检查API数据源提供是否正常。');
	});
	
  }]);
  
    return {
	  	init: function() {
			angular.bootstrap(document.body, ['LotteryApp']);
		}
  }
  

  // Helpers
  function getOffset(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
  }

  function isOverlap(a, b) {
    return getOffset(a, b) <= (a.width + b.width) / 2;
  }

  function hit(a, b) {
    var yOffset = b.y - a.y;
    var xOffset = b.x - a.x;

    var offset = getOffset(a, b);

    var power = Math.ceil(((a.width + b.width) / 2 - offset) / RIGIDITY);
    var yStep = yOffset > 0 ? Math.ceil(power * yOffset / offset) : Math.floor(power * yOffset / offset);
    var xStep = xOffset > 0 ? Math.ceil(power * xOffset / offset) : Math.floor(power * xOffset / offset);

    if (a.lucky) {
      b._xMove += xStep * 2;
      b._yMove += yStep * 2;
    }
    else if (b.lucky) {
      a._xMove += xStep * -2;
      a._yMove += yStep * -2;
    }
    else {
      a._yMove += -1 * yStep;
      b._yMove += yStep;

      a._xMove += -1 * xStep;
      b._xMove += xStep;
    }
  }
    
});
