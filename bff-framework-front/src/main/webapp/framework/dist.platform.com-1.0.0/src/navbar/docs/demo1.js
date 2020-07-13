var MainController=['$scope',function ($scope) {
  var vm=$scope.vm={};
   
     vm.configData={
	 userImage:'../../themes/default/images/navbar/user.jpg',
	 
	 }
     vm.navbar={
	"tasks": {
		"count": 2,
		"latest": [{
			"title": "业务审批",
			"percentage": 65
		},
		{
			"title": "在办事项",
			"percentage": 35,
			"progress-bar-type": "danger"
		}]
	},

	"notifications": {
		"count": 4,
		"latest": [{
			"title": "新接事项",
			"icon": "fa fa-comment",
			"icon-class": "btn-pink",
			"badge": "+12",
			"badge-class": "badge-info"
		},
		{
			"title": "监察预警",
			"icon": "fa fa-user",
			"icon-class": "btn-primary"
		},
		{
			"title": "决策报告",
			"icon": "fa fa-shopping-cart",
			"icon-class": "btn-success",
			"badge": "+8",
			"badge-class": "badge-success"
		},
		{
			"title": "公文通知",
			"icon": "fa fa-twitter",
			"icon-class": "btn-info",
			"badge": "+11",
			"badge-class": "badge-info"
		}]
	},

	"messages": {
		"count": 5,
		"latest": [{
			"name": "张三",
			"img": "avatar.png",
			"time": "1分钟以前",
			"summary": "相关会议通知已发送给您，请注意查收 ..."
		},
		{
			"name": "李四",
			"img": "avatar3.png",
			"time": "20分钟以前",
			"summary": "办理审批业务通知已收到，预计xx年xx月 ..."
		},
		{
			"name": "王五",
			"img": "avatar4.png",
			"time": "3:15 pm",
			"summary": "相关会议通知已发送给您，请注意查收 ..."
		},
		{
			"name": "王薇",
			"img": "avatar2.png",
			"time": "1:33 pm",
			"summary": "办理审批业务通知已收到，预计xx年xx月 ..."
		},
		{
			"name": "坦克",
			"img": "avatar5.png",
			"time": "10:09 am",
			"summary": "相关会议通知已发送给您，请注意查收  ..."
		}]
	}
}
}];
angular.module('dist.ui').controller('MainController',MainController);