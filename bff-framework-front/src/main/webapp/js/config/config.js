/**
 * Created by Wanggb on 2016/9/25.
 */

angular.module("AceApp")
    .config(function ($logProvider,$provide) { //配置$log控制台输出样式
        /*
        * 级数0 debug ;1 log;2 info; 3 warn ; 4 error;
        *  0 全部显示 ；
        *  1 log 及以上显示；
        *  2 info 及以上显示；
        *  3 warn 及以上显示
        *  4 error 及以上显示
        *  5 全部禁止
        * */
        var enableLevel=0;

        //重写$log服务,实现功能：当$logProvider.debugEnabled(false)时关闭所有的$log
        $provide.decorator('$log', function ($delegate) {
            try{
                    $logProvider.debugEnabled(false);
                    //Original methods
                    var origInfo = $delegate.info,//2
                        origLog = $delegate.log,//1
                        origWarn = $delegate.warn,//3
                        origError= $delegate.error,//4
                        origDebug= $delegate.debug;//0
                    var tempLevel=enableLevel||0;
                    if(tempLevel<=0){ $logProvider.debugEnabled(true); };//0 全部显示 ；
                    if(tempLevel>=1){//1 log 及以上显示；
                        $delegate.debug = function () {
                            if ($logProvider.debugEnabled())
                                origDebug.apply(null, arguments)
                        };
                    };
                    if(tempLevel>=2){//2 info 及以上显示；
                        $delegate.log = function () {
                            if ($logProvider.debugEnabled())
                                origLog.apply(null, arguments)
                        };
                    };
                    if(tempLevel>=3){// 3 warn 及以上显示
                        //Override the default behavior
                        $delegate.info = function () {
                            console.warn($delegate.custom)
                            if ($logProvider.debugEnabled())
                                origInfo.apply(null, arguments)
                        };
                    };
                    if(tempLevel>=4){//4 error 及以上显示
                        //Override the default behavior
                        $delegate.warn = function () {
                            if ($logProvider.debugEnabled())
                                origWarn.apply(null, arguments)
                        };
                    };
                    if(tempLevel>=5){//5全部禁止
                        //Override the default behavior
                        $delegate.error = function () {
                            if ($logProvider.debugEnabled())
                                origError.apply(null, arguments)
                        };
                    };
            }catch(e){
                    console.log(e);
            };
             return $delegate;
        });
    })
