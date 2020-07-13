/**
 * Created by wanggb on 2016/7/28.
 */
(function(root,factory){
    'use strict';
    if(typeof define==='function' && define.amd){
        define(['angular'],factory);
    }else if(typeof exports==='object'){
        module.exports=factory(require('angular'));
    }

}(this,function(angular){
    'use strict';


}))