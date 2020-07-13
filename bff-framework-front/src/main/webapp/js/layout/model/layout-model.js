/**
 * Created by Xiaoma on 2016/7/17.
 */
(function(){

    obj.addSidebar=function(originalItems,newItem){
        var targetItems={"targetItem":originalItems,"status":false,"prompt":""}
        if(newItem==null||newItem.name==null||newItem.level==null||newItem.title==null){  //增加项为空
            targetItems.prompt="增加项目有误！";
            targetItems.status=false;
            targetItems.targetItem=originalItems;
            return targetItems;
        }else{
            var searchRow=null;
            for(var i=0;i<originalItems.length;i++){
                if(originalItems[i].name==newItem.name){
                    searchRow=i;
                    break;
                }
            }
            if(searchRow==null){
                if(newItem.level=="level-1"){
                    originalItems.push(newItem);
                    targetItems={"targetItem":originalItems,"status":true,"prompt":"添加成功！"}
                }else{
                    targetItems={"targetItem":originalItems,"status":false,"prompt":"请先添加父级菜单！"}
                }
            }else{
                switch(newItem.level){
                    case "level-1":
                        targetItems={"targetItem":originalItems,"status":false,"prompt":"父级菜单已存在！"};
                        break;
                    case "level-2":
                        if(originalItems[searchRow].submenu){
                            var repeatItem=false;
                            for(var i=0;i<originalItems[searchRow].submenu;i++){
                                if(originalItems[searchRow].submenu[i].title==newItem.title){
                                    repeatItem=true;
                                };
                            }
                            if(repeatItem){
                                targetItems={"targetItem":originalItems,"status":false,"prompt":"菜单已存在！"};
                            }else{
                                originalItems[searchRow].submenu.push(newItem);
                                targetItems={"targetItem":originalItems,"status":true,"prompt":"已添加！"};
                            }
                        }else{
                            originalItems[searchRow].submenu=newItem;
                            targetItems={"targetItem":originalItems,"status":true,"prompt":"已添加！"};
                        };
                    case "level-3":
                        if(originalItems[searchRow].submenu){
                            var repeatItem=false;
                            for(var i=0;i<originalItems[searchRow].submenu;i++){
                                if(originalItems[searchRow].submenu[i].title==newItem.title){
                                    repeatItem=true;
                                };
                            }
                            if(repeatItem){
                                targetItems={"targetItem":originalItems,"status":false,"prompt":"菜单已存在！"};
                            }else{
                                originalItems[searchRow].submenu.push(newItem);
                                targetItems={"targetItem":originalItems,"status":true,"prompt":"已添加！"};
                            }
                        }else{
                            originalItems[searchRow].submenu=newItem;
                            targetItems={"targetItem":originalItems,"status":true,"prompt":"已添加！"};
                        }

                }

            }



        }

    }

}())