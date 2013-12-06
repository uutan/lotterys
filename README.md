# lotterys 现场抽奖系统

---

应公司需求，加上最近在学习seajs和angularjs，便将seajs示例中的lucky程序修改为现场抽奖系统。结合网站开放的数据，将生命绿州网站的注册并有头像的会员，全部调出来作为抽奖人员。由空隔键和手标控制是否开奖。

---

## 使用说明
看示例
```javascript
seajs.use('uutan/lotterys/1.0.0/lottery',function(main){
	main.init();
});
```
```html
<div class="ctrl_nav">
    <button id="go" data-text-start="开始抽奖" data-text-stop="停止抽奖" data-action="start" class="ui-button ui-button-lorange">开始抽奖</button>
</div>

<div class="member_content">
	
	<ul id="member_show" class="member_list" style="display:none;">
		<li ng-repeat="member in members" id="li_{{member.id}}">
		<img ng-src="{{member.face}}" width="180" height="180">
		<div ng-bind="member.realname||member.username"></div>
		</li>
	</ul>


	<ul id="member_lottery" class="member_list">
	</ul>
</div>
    

<div class="lucky_member_content">
	<ul class="lucky_member_list">
	</ul>
</div>
```


## API