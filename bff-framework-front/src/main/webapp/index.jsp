<%--
  Created by IntelliJ IDEA.
  User: wanggb
  Date: 2016/7/1
  Time: 16:26
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
    String contextPath = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + contextPath + "/";
%>

<html lang="en" ng-app="AceApp">
<head>
    <%--<base href="<%=basePath%>" target="_blank">--%>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="utf-8" />
    <title ng-bind-template="{{pageTitle || 'Welcome'}} - 统一用户认证">Welcome - Ace Admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link type="text/css" rel="stylesheet" href="css/main.css"/>

</head>
<body ng-controller="MainController" ng-class="bodySkin(4)">

<%--<div class="navbar navbar-default" ng-class="{'navbar-fixed-top': ace.settings.navbar}" ng-include="'template/layout/navbar.html'"></div>--%>

<wi-navbar nav-data="vm.navbar" config-data="vm.configData" ng-class="{'navbar-fixed-top': ace.settings.navbar}"></wi-navbar>


<div class="main-container" ng-class="{'container': ace.settings.container}">

    <%--<div id="sidebar" class="sidebar responsive" ng-controller="SidebarCtrl" ace-sidebar props="ace.sidebar" scroll="true" hover="true" ng-class="{'menu-min': ace.sidebar.minimized, 'sidebar-fixed': ace.settings.sidebar, 'compact': ace.settings.compact}" ng-include="'template/layout/sidebar.html'"></div>--%>

    <wi-side-bar sidebar="sidebar" side-config="sideConfig"  skin-style="bodystyle" callbacks="callbacks"></wi-side-bar>

    <div class="main-content">
      <div class="main-content-inner">
         <%--<div ng-if="true" class="breadcrumbs" ng-class="{'breadcrumbs-fixed': ace.settings.breadcrumbs}" ng-include="'template/layout/breadcrumbs.html'"></div>--%>

         <div ng-show="tabbarShow" class=" breadcrumbs" ng-class="{'breadcrumbs-fixed': ace.settings.breadcrumbs}" ng-include="'template/layout/buttonbar.html'"></div>
             <div class="page-content">
             <%--<div class="ace-settings-container" ng-controller="SettingsCtrl" ng-include="'template/layout/settings.html'"></div>--%>
             <ui-view ng-show="!viewContentLoading"></ui-view>
         </div>
      </div>
    </div>

    <%--<div ng-if="true" class="fix-buttonbar" ng-class="{'fix-buttonbar-fixed': ace.settings.breadcrumbs}" ng-include="'template/layout/buttonbar.html'"></div>--%>
    <div class="footer" ng-include="'template/layout/footer.html'"></div>

    <a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse">
        <i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i>
    </a>

</div>

<div ng-show="viewContentLoading" class="ajax-loading-overlay ajax-overlay-body"><i class="ajax-loading-icon fa fa-spin fa-spinner fa-2x orange"></i> </div>
<%--lib--%>
<script type="text/javascript"  src="_lib/jquery/dist/jquery.js"></script>
<script type="text/javascript"  src="framework/dist.platform.lib/jquery.i18n.properties.min.js"></script>
<script type="text/javascript"  src="_lib/angular/angular-1.5.7/angular.min.js"></script>


<script type="text/javascript" src="_lib/_lib-package/release/js/dist-platform-lib-all-1.0.0.min.js"></script>

<script type="text/javascript" src="framework/dist.platform.com-1.0.0/release/dist-ui-com-all-1.0.0.js"></script>


<%--<script type="text/javascript" src="_lib/jQuery-mCustomScrollbar/jquery.mCustomScrollbar.concat.min.js"></script>--%>

<!-- ACE ANGULAR -->
<script type="text/javascript"  src="js/app.main.js"></script>

<%--models--%>
<script type="text/javascript" src="js/common/global/global-object.js"></script>
<script type="text/javascript" src="js/layout/model/layout-model.js"></script>

 <%--services--%>
<script type="text/javascript" src="framework/dist.platform.event/dist-data-service.js"></script>
<script type="text/javascript"  src="js/layout/service/sidebar-list-service.js"></script>
<script type="text/javascript"  src="js/layout/service/storage-get-service.js"></script>
<script type="text/javascript"  src="js/common/services/loadXML-service.js"></script>
<script type="text/javascript"  src="js/common/services/http-request-service.js"></script>
<script type="text/javascript" src="js/debug/factoryCommunication/factory-communication-service.js"></script>


<%--controllers--%>
<%--<script type="text/javascript"  src="js/layout/controller/settings-ctrl.js"></script>--%>
<%--<script type="text/javascript"  src="js/layout/controller/sidebar-ctrl.js"></script>--%>
<script type="text/javascript"  src="js/layout/main-ctrl.js"></script>
<%--<script type="text/javascript" src="template/debug/wisidebar/wisidebar.js"></script>--%>


<script type="text/javascript" src="js/debug/factoryCommunication/factory-communication-ctrl.js"></script>
<script type="text/javascript" src="js/debug/iframe/iframe-ctrl.js"></script>
<script type="text/javascript" src="js/debug/table/smartTable/smart-table-ctrl.js"></script>
<script type="text/javascript" src="js/debug/table/uiGrid/ui-grid-ctrl.js"></script>
<script type="text/javascript" src="js/debug/pagination/pagination-ctrl.js"></script>
<script type="text/javascript" src="js/content/appHome/controller/home-ctrl.js"></script>
<script type="text/javascript" src="js/config/config.js"></script>
<script type="text/javascript" src="js/config/run.js"></script>
<script type="text/javascript" src="js/config/router.js"></script>
<%--components--%>
<script type="text/javascript" src="framework/dist.platform.com/table/smart-table/smart-table.js"></script>
<script type="text/javascript" src="framework/dist.platform.com/table/ui-grid/3.2.1/ui-grid.min.js"></script>
<script type="text/javascript" src="framework/dist.platform.com/pagination/dist-pagination-1.0.0.js"></script>
<script type="text/javascript" src="framework/dist.platform.com/dist.ui.com.js"></script>

<%--<script type="text/javascript" src="template/debug/tabbar/wi-tab-bar.js"></script>--%>
<script type="text/javascript" src="js/debug/debug.js"></script>




<!-- INSERT TEMPLATE CACHE -->
<%--<script type="text/javascript"  src="_lib/angular-ace/js/ace.js"></script>--%>

<%--platform--%>
<%--<script type="text/javascript"  src="_lib/jquery/dist/jquery.js"></script>--%>
<%--<script type="text/javascript"  src="_lib/angular/angular-1.5.7/angular.min.js"></script>--%>
<%--<script type="text/javascript"  src="_lib/angular-touch/angular-touch.min.js"></script>--%>
<%--<script type="text/javascript"  src="_lib/angular-ui-router/release/angular-ui-router.js"></script>--%>
<%--<script type="text/javascript"  src="_lib/angular-bootstrap/ui-bootstrap-tpls.js"></script>--%>
<%--<script type="text/javascript"  src="_lib/ngstorage/ngStorage.js"></script>--%>
<%--<script type="text/javascript"  src="_lib/bootstrap/js/transition.js"></script><!-- for sidebar transition events -->--%>
<%--<!-- ACE -->--%>
<%--<script type="text/javascript"  src="_lib/angular-ace/js/ace-small.js"></script><!-- slimmer version of ace.js -->--%>
<%--<script type="text/javascript"  src="_lib/angular-ace/js/ace-elements.js"></script>--%>
<%--<script type="text/javascript" src="../UserApprove/dist.platform/dist.prompt/layer/layer.js"></script>--%>
<%--<script type="text/javascript" src="framework/dist.platform.com/chart/angular-chart/Chart.min.js"></script>--%>
<%--<script type="text/javascript" src="framework/dist.platform.com/pagination/ui-bootstrap-tpls-2.0.0.js"></script>--%>
<%--<script type="text/javascript" src="framework/dist.platform.com/chart/angular-chart/angular-chart.min.js"></script>--%>
<%--<script type="text/javascript" src="_lib/layer-v2.4/layer/layer.js"></script>--%>
<%--<script type="text/javascript" data-main="js/main" src="js/require.min.js" ></script>--%>

</body>
</html>
