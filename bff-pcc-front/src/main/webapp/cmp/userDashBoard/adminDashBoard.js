var app = angular.module('AceApp');
app.controller("adminDashBoard", function ($scope,$q, $uibModal, $stateParams, HttpService, BroadcastService) {
    var vm = $scope;
    //初始化函数
    vm._init=function () {
        var myCustomer = document.getElementById("myCustomer");
        var options={};
        var lineData={
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        }
        var myLineChart=new Chart(myCustomer, {
            type: "line",
            data:lineData ,
            options: options

        });
    };
    vm._init()
})
;