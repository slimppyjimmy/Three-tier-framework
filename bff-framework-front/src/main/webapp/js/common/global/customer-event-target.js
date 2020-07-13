/**
 * Created by wanggb on 2016/7/21.
 */

function EventTarget(){
    this.handlers={};
}

EventTarget.prototype={
    constructor:EventTarget,
    addHandler:function(type,handler){
        if(typeof this.handlers[type]=="undefined"){
            this.handlers[type]=[];
        }
        this.handlers[type].push(handler);
    },
    fire:function(event){
        if(!event.target){
            event.target=this;
        };
        if(this.handlers[event.type] instanceof Array){

        }
    }
}