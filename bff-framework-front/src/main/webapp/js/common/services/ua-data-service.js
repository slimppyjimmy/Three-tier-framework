/**
 * Created by Wanggb on 2016/8/31.
 */
angular.module("AceApp")
    .factory("UADataService",UADataService)

UADataService.$inject=["$timeout","$http","$rootScope","$q"];

function UADataService($timeout,$http,$rootScope,$q){

    var serviceData={
        httpRequest:httpRequest,
        httpSaveData:httpSaveData
    }

    return serviceData;


    /**
     * @description httpRequest http请求借口;
     * @params {Object} data http请求数据
     * @return promise
     * */
    function httpRequest(data){
        var deferred=$q.defer();
        $http({
            url:data.url,
            params:data.params,
            method:data.method||'post'
        }).then(function(data){
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };


    /**
     * @description saveAdminNew 保存数据接口;
     * @params {Object} data 待保存的参数
     * @return promise
     * */
    function httpSaveData(data,url,method){
        var deferred=$q.defer();
        var saveData=null;
        try{
            saveData=JSON.stringify(data);
        }catch(e){
            console.log(e);
        };
        var questData={
            "url":url||"/debug",
            "params":saveData,
            "method":method||'post'
        }
        httpRequest(questData).then(function(data){
            deferred.resolve(data);
            layer.alert("保存成功！",{
                icon:1,
                shadeClose:true,
                title:"操作提示"
            })
        },function(data){
            deferred.reject(data);
            layer.alert("保存失败！",{
                icon:2,
                shadeClose:true,
                title:"操作提示"
            })
        });
        return deferred.promise;
    }



}