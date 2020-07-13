/**
 * Created by wanggb on 2016/7/25.
 */


angular.module("AceApp")
    .controller("UiGridDemo1Controller",UiGridDemo1Controller)

UiGridDemo1Controller.$inject=["$scope","$q","ngTableSimpleList","NgTableParams"];

function UiGridDemo1Controller($scope,$q,simpleList,NgTableParams){




    var originalData = angular.copy(simpleList);

    $scope.cols = [{
        field: "name",
        title: "Name",
        filter: {
            name: "text"
        },
        sortable: "name",
        dataType: "text"
    }, {
        field: "age",
        title: "Age",
        filter: {
            age: "number"
        },
        sortable: "age",
        dataType: "number"
    }, {
        field: "money",
        title: "Money",
        filter: {
            money: "number"
        },
        sortable: "money",
        dataType: "number"
    }, {
        field: "action",
        title: "",
        dataType: "command"
    }];
    $scope.tableParams = new NgTableParams({}, {
        dataset: angular.copy(simpleList)
    });

    $scope.deleteCount = 0;

    $scope.add = add;
    $scope.cancelChanges = cancelChanges;
    $scope.del = del;
    $scope.hasChanges = hasChanges;
    $scope.saveChanges = saveChanges;

    //////////

    function add() {
        $scope.isEditing = true;
        $scope.isAdding = true;
        $scope.tableParams.settings().dataset.unshift({
            name: "",
            age: null,
            money: null
        });
        // we need to ensure the user sees the new row we've just added.
        // it seems a poor but reliable choice to remove sorting and move them to the first page
        // where we know that our new item was added to
        $scope.tableParams.sorting({});
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    }

    function cancelChanges() {
        resetTableStatus();
        var currentPage = $scope.tableParams.page();
        $scope.tableParams.settings({
            dataset: angular.copy(originalData)
        });
        // keep the user on the current page when we can
        if (!$scope.isAdding) {
            $scope.tableParams.page(currentPage);
        }
    }

    function del(row) {
        _.remove($scope.tableParams.settings().dataset, function(item) {
            return row === item;
        });
        $scope.deleteCount++;
        $scope.tableTracker.untrack(row);
        $scope.tableParams.reload().then(function(data) {
            if (data.length === 0 && $scope.tableParams.total() > 0) {
                $scope.tableParams.page($scope.tableParams.page() - 1);
                $scope.tableParams.reload();
            }
        });
    }

    function hasChanges() {
        return $scope.tableForm.$dirty || $scope.deleteCount > 0
    }

    function resetTableStatus() {
        $scope.isEditing = false;
        $scope.isAdding = false;
        $scope.deleteCount = 0;
        $scope.tableTracker.reset();
        $scope.tableForm.$setPristine();
    }

    function saveChanges() {
        resetTableStatus();
        var currentPage = $scope.tableParams.page();
        originalData = angular.copy($scope.tableParams.settings().dataset);
    }

}