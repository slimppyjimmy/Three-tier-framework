/**
 * Created by wanggb on 2016/7/7.
 */

app.service("LoadXML",LoadXMLService)

LoadXMLService.$inject=["$q"];

function LoadXMLService($q){
    var returnData={
        loadXML:loadXML,
        checkXMLDocObj:checkXMLDocObj
    }
    return returnData;

    /**
     * @description 加载XML文件
     * @params {} xmlFile 文件名
      * @returns {xmlDoc} xmlDoc返回xmlDoc
     */
    /*    function loadXML(xmlFile){
        var xmlDoc;
        if (window.ActiveXObject) {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');//IE浏览器
            xmlDoc.async = false;
            xmlDoc.load(xmlFile);
        }
        else if (isFirefox=navigator.userAgent.indexOf("Firefox")>0) { //火狐浏览器
            //else if (document.implementation && document.implementation.createDocument) {//这里主要是对谷歌浏览器进行处理
            xmlDoc = document.implementation.createDocument('', '', null);
            xmlDoc.load(xmlFile);
        }
        else{ //谷歌浏览器
            var xmlhttp = new window.XMLHttpRequest();
            xmlhttp.open("GET",xmlFile,false);
            xmlhttp.send(null);
            if(xmlhttp.readyState == 4){
                xmlDoc = xmlhttp.responseXML.documentElement;
            }
        }
        return xmlDoc;
    }*/

    /**
     * @description 加载XML文件jQuery写法
     * @params {} xmlFile 文件名
     * @returns {xmlDoc} xmlDoc返回xmlDoc
     */
    function loadXML(xmlFile){
        var defer=$q.defer();
        $.ajax({
            url: xmlFile,
            type: 'GET',
            dataType: 'xml',
            timeout: 1000,  //设定超时
            cache: false,   //禁用缓存
            error: function(xml) {
                console.log("加载XML文档出错!");
                defer.reject(xml);
            },
            success: function(xml){
                console.log("加载XML文档成功!");
                defer.resolve(xml);
            }   //设置成功后回调函数
        });
        return defer.promise;
    }

    /**
     * @description 加载XML文件 原生写法；
     * @params {} xmlFile 文件名
     * @returns {xmlDoc} xmlDoc返回xmlDoc
     */
    function checkXMLDocObj(xmlFile){
        var xmlDoc = loadXML(xmlFile);
        if (xmlDoc == null) {
            alert('您的浏览器不支持xml文件读取,于是本页面禁止您的操作,推荐使用IE5.0以上可以解决此问题!');
            window.location.href = '../err.html';
        }
        return xmlDoc;
    }
}