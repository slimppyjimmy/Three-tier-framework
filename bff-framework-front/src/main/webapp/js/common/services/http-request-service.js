/**
 * Created by wanggb on 2016/7/8.
 */

app.service("httpRequest",httpRequestService)

httpRequestService.$inject=["$q","$http"];

function httpRequestService($q,$http) {
    var returnData = {
        httpRequest: httpRequest,
    }
    return returnData;

    function httpRequest(url,data,method){
        var deferred=$q.defer();
        $http({
            url:url,
            method:method,
            params:data,
        }).success(function(data){
            deferred.resolve(data);
        })
            .error(function(data){
                deferred.reject("Request Failed!")
            })
        return deferred.promise;
    }
}