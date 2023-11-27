$(document).ready(function () {
    dashboard.init();
});

window.onload = function () {
    
};

var dashboard = (function (dashboard, $) {
    
    /**************************************
     * Public 함수
     * ************************************/
    dashboard.init = function () {
        dashboardTotalChart.init();
    }
    return dashboard;
}) (window.dashboard || {}, $);