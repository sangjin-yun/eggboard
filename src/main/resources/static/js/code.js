window.onload = function () {
      code.init();
};

var code = (function (code, $) {
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
    code.init = function () {
        
    }
    return code;
}) (window.code || {}, $);