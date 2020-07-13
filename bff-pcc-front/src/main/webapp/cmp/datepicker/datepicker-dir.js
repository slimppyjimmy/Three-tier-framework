var app = angular.module('AceApp');
app.directive("datepicker", function () {
    return {
        restrict: 'AE'
        , replace: false
        , scope: {
            param: "="
            , value: "="
            , default: "="
        }
        , templateUrl: 'cmp/datepicker/datepicker-tpl.html'
        , controller: function ($scope) {
            console.log(">>>datepicker scope=", $scope);
            var vm = $scope;
            console.log(vm.value);
            if (vm.value && vm.value !== "") {
                vm.date = new Date(vm.value);
            } else if (vm.default && vm.default === true) {
                vm.date = new Date();
            } else {
                vm.date = null;
            }

            vm.format = "yyyy-MM-dd";
            vm.altInputFormats = ['yyyy/M!/d!'];
            vm.popup1 = {
                opened: false
            };
            vm.open1 = function () {
                vm.popup1.opened = true;
            };
            //坚挺时间变化，变化后自动绑定到som中newdata上
            vm.dateChange = function () {
                vm.$emit("toChangeDate", vm.date)
            };
            console.log("<<<datepicker");
        }
    }
});