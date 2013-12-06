define(function(require, exports, module){
	var $ = require('$');
	module.exports = function(){
		var members = [];
		
		$http.get('/api/default/get_user_list.html',{})
		.success(function(data){
			members = $.param(data.data);
		})
		.error(function(){
			alert('数据载入失败，请检查API数据源提供是否正常。');
		});
		
		return {
			// 获取数据
			getMembers: function(filter){
				if(filter){
					return members.filter(function(member){
						if( filter.completed === '') return true;
						return member.completed === filter.completed
					})
				}else{
					return members;
				}
			},
			
			// 删除中奖用户数据
			delMember:function(index){
				members.splice(index,1)
			},
			
			// 删除全部用户
			clearCompleted: function(){
				for(var i = members.length -1; i > -1; i--){
					if(todos[i].completed){
						this.delMember(i)
					}
				}
			}
			
		}
	}

});