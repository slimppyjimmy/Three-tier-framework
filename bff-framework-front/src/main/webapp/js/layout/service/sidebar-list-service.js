/**
 * Created by wanggb on 2016/7/7.
 */

//nothing important, just a snippet to convert ui.router states into an array of sidebar items to be used in the partial template (sidebar.html)
//make a list of sidebar items using router states in angular/js/app.js
angular.module("AceApp").service('SidebarList', SidebarList)


function SidebarList() {
    //parent name for a state
    var getParentName = function(name) {
        var name = (/^(.+)\.[^.]+$/.exec(name) || [null, null])[1];
        return name;
    };
    //how many parents does this state have?
    var getParentCount = function(name) {
        return name.split('.').length;
    };

    this.getList = function(uiStateList) {

        var sidebar = {'root': []};//let's start with root and call it root! (see views/layouts/default/partial/sidebar.html)
        var parentList = {};//each node(item) can be a parent, so we add it to this list, and later if we find its children we know where to find the parent!

        for(var i = 0 ; i < uiStateList.length ; i++) {
            var state = uiStateList[i];
            if(!state.name) continue;

            //copy state to 'item' (so state is not changed)
            var item = {};
            angular.copy(state, item);
            delete item['resolve']; delete item['templateUrl'];//delete these, we don't need them

            //item.name is state's name (dashboard, ui.elements, etc)
            item.url = item.name || '';

            parentList[item.name] = item;//save this item as a possible parent, and later we add possible children to it as submenu

            var parentName = getParentName(item.name);
            if(!parentName) {
                //no parent, so a root item
                sidebar.root.push(item);
                item['level-1'] = true;
            }
            else {
                //get the parent and add this item as a submenu element of parent
                var parentNode = parentList[parentName];
                if ( !('submenu' in parentNode) ) parentNode['submenu'] = [];
                parentNode['submenu'].push(item);
                item['level-'+getParentCount(item.name)] = true;
            }
        }

        parentList = null;
        console.log(sidebar);
        var object={"root":[{"controller":"","icon":"fa fa-tachometer","level-1":true,"name":"item1","title":"item1","url":"item1"},{"controller":"","icon":"fa fa-list","level-1":true,"name":"item3","title":"item3","url":"item3"}]}

        sidebar.root.pop();
        return sidebar;
    };

};
