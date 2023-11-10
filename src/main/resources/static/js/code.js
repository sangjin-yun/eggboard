window.onload = function () {
      actionLog.init();
};

var actionLog = (function (actionLog, $) {
    /**************************************
     * Private 함수
     * ************************************/
    function getNoticeInfo(){
        var option = deepExtend(ajaxOptions);
        option.URL = "/api/notice/box";
        option.HEADERS = getCsrfHeader();
        option.TYPE = "get";
        option.CALLBACK = function (response) {
            setNoticeInfo(response);
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("오류발생");
            }else{
                toastr["error"]("error");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    function setNoticeInfo(response){
        var html = "";
        $("#alarmList").empty();
        for(idx in response){
            html += '<tr>';
            html += '<td>'+ convertType(response[idx].target) +'</td>';
            html += '<td>'+ convertMsg(response[idx].message,response[idx].parameter) +'</td>';
            html += '<td>'+ response[idx].createdAt +'</td>';
            html +='</tr>';
        }
        $("#alarmList").append(html);
        settingDatatable();
    }
    
    function settingDatatable(){
        if(langType == "ko"){
            $("#alarmTable").DataTable({
                order: [ [ 2, "desc" ] ],
                "columnDefs": [
                    { "orderable": true, "width": "20%", "targets": [0,2] },
                    { "orderable": true, "targets": [1]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "내용 : "
                 },
                 language : lang_ko
            }); 
        }else{
            $("#alarmTable").DataTable({
                order: [ [ 2, "desc" ] ],
                "columnDefs": [
                    { "orderable": true, "width": "20%", "targets": [0,2] },
                    { "orderable": true, "targets": [1]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "Message : "
                 },
                 language : lang_en
            }); 
        }
    
        var table = $('#alarmTable').DataTable();
    
        $('#alarmTable_filter input').unbind().bind('keyup', function () {
            table.column(1).search(this.value).draw();
        });
    
        $("#alarmTable_filter.dataTables_filter").append($("#alarmFilter"));
    
        $('#alarmFilter').on('change', function () {
            table.column(0).search(this.value).draw();
        });
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    actionLog.init = function () {
        getNoticeInfo();
        if(langType == "ko"){
            $("#alarmFilter").append('<option value="" selected>구분 선택</option>');
            $("#alarmFilter").append("<option value='사용자 로그인' >사용자 로그인</option>");
            $("#alarmFilter").append("<option value='스케쥴 설정' >스케쥴 설정</option>");
            $("#alarmFilter").append("<option value='사용자 관리' >사용자 관리</option>");
            $("#alarmFilter").append("<option value='로그 관리' >로그 관리</option>");
            $("#alarmFilter").append("<option value='파드 관리' >파드 관리</option>");
            $("#alarmFilter").append("<option value='노드 관리' >노드 관리</option>");
            $("#alarmFilter").append("<option value='노드 그룹 관리' >노드 그룹 관리</option>");
            $("#alarmFilter").append("<option value='스케쥴러' >스케쥴러</option>");
            $("#alarmFilter").append("<option value='컨피그레이터' >컨피그레이터</option>");
          }else{
            $("#alarmFilter").append('<option value="" selected>Type Select</option>');
            $("#alarmFilter").append("<option value='SCHEDULE_SETTING' >SCHEDULE_SETTING</option>");
            $("#alarmFilter").append("<option value='USER_MANAGE' >USER_MANAGE</option>");
            $("#alarmFilter").append("<option value='LOG_MANAGE' >LOG_MANAGE</option>");
            $("#alarmFilter").append("<option value='POD_MANAGE' >POD_MANAGE</option>");
            $("#alarmFilter").append("<option value='NODE_MANAGE' >NODE_MANAGE</option>");
            $("#alarmFilter").append("<option value='NODE_GROUP_MANAGE' >NODE_GROUP_MANAGE</option>");
            $("#alarmFilter").append("<option value='SCHEDULER' >SCHEDULER</option>");
            $("#alarmFilter").append("<option value='CONFIGURATOR' >CONFIGURATOR</option>");
        }
        localize();
    }
    return actionLog;
}) (window.actionLog || {}, $);