var UiGridDemo1Controller = ['$scope',function($scope) {
    $scope.gridOptions = {
        showGridFooter:false,
        showColumnFooter:true,
       enableRowSelection:true,
        enableRowHeaderSelection: false,
        multiSelect:false,
        enableSorting: true,
        rowHeight:30,
        enableGridMenu:true,
        columnDefs: [
            { field: '项目编号', width: '10%',footerCellTemplate: '<div class="ui-grid-cell-contents" >总数：4</div>' },
            { field: '项目名称', width: '25%',  },
            { field: '当前环节', width: '10%' },
            { field: '建设单位', width: '25%',  },
            { field: '承诺办结日期', width: '10%' },
            { field: '剩余时间', width: '10%',footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: Red;color: White">超期：4</div>'  },
            { field: '操作', width: '10%', footerCellTemplate: '<div class="ui-grid-cell-contents" >代办：4</div>'}
        ]
    };

	var data=[{
  "项目编号": "TJ2016043",
  "项目名称": "XX市宁杭南路甲城地块综XX市宁杭南路甲城地块综",
  "当前环节": "窗口收件",
  "建设单位":"(未命名)",
  "承诺办结日期":"2016-07-22",
  "剩余时间":"超期11天5.7小时",
  "操作":"办理"
},
  {
    "项目编号": "TJ2016043",
    "项目名称": "XX市宁杭南路甲城地块综XX市宁杭南路甲城地块综",
    "当前环节": "窗口收件",
    "建设单位":"(未命名)",
    "承诺办结日期":"2016-07-22",
    "剩余时间":"超期11天5.7小时",
    "操作":"办理"
  },
  {
    "项目编号": "TJ2016043",
    "项目名称": "(未命名)",
    "当前环节": "窗口收件",
    "建设单位":"(未命名)",
    "承诺办结日期":"2016-07-22",
    "剩余时间":"超期11天5.7小时",
    "操作":"办理"
  },
  {
    "项目编号": "TJ2016043",
    "项目名称": "XX市宁杭南路甲城地块综XX市宁杭南路甲城地块综",
    "当前环节": "窗口收件",
    "建设单位":"春城控股集团公司",
    "承诺办结日期":"2016-07-22",
    "剩余时间":"超期11天5.7小时",
    "操作":"办理"
  },
  {
    "项目编号": "TJ2016043",
    "项目名称": "(未命名)",
    "当前环节": "窗口收件",
    "建设单位":"(未命名)",
    "承诺办结日期":"2016-07-22",
    "剩余时间":"超期11天5.7小时",
    "操作":"办理"
  }]

    $scope.gridOptions.data = data;
   

    $scope.getTableHeight = function() {
        var rowHeight = 30; // your row height
        var headerHeight = 30; // your header height
        var scrollHeight=50;
        return {
            height: ($scope.gridOptions.data.length * rowHeight + headerHeight+scrollHeight) + "px"
        };
    };
}];

angular.module('dist.ui').controller('UiGridDemo1Controller',UiGridDemo1Controller);