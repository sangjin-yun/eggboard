$(document).ready(function () {
    
});

window.onload = function () {
      company.init();
};

var company = (function (company, $) {
    /**************************************
     * Private 함수
     * ************************************/
    function getCompanyList(){
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/company";
        option.HEADERS = getCsrfHeader();
        option.TYPE = "GET";
        option.CALLBACK = function (response) {
            var data = response;
            $("#dynamicTbody").empty();
            var html ="";
            for (var i=0; i<data.length; i++) {
                html += '<tr>';
                html += '   <td>'+Number(Number(i)+Number(1))+'</td>';
                html += '   <td>'+data[i].name+'</td>';
                html += '   <td>'+data[i].alias+'</td>';
                html += '   <td>'+data[i].gpYn+'</td>';
                html += '   <td>'+data[i].addrSi+' '+data[i].addrGu+' '+data[i].addrDong+'</td>';
                html += '   <td>';
                html += '   <button value="'+data[i].companyIdx+'" class="btn btn-outline-info mr-1 mb-1" type="button" onclick="company.showModal(\'U\',this);">수정</button>';
                html += '   <button value="'+data[i].companyIdx+'" class="btn btn-outline-danger mr-1 mb-1" type="button" onclick="company.showModal(\'D\',this);">삭제</button>';
                html += '   </td>';
                html += '</tr>';
            }
            $("#dynamicTbody").append(html);
            settingDatatable();
        };
        option.ERROR_CALLBACK = function (response) {
            toastr["error"]("업체 목록 호출 오류");
        };
        ajaxWrapper.callAjax(option);
    }
    
    function settingDatatable(){
        $("#downTable").DataTable({
            order: [ [ 0, "desc" ] ],
            "columnDefs": [ 
                { "orderable": true, "width": "20%", "targets": [1,2] },
                { "orderable": false, "width": "7%", "targets": [0] },
                { "orderable": true, "targets": [4] },
                { "orderable": true, "width": "10%", "targets": [3]},
                { "orderable": false, "width": "20%", "targets": [5]}
            ],
            autoWidth: false,
            "oLanguage": {
               "sSearch": "찾기 : "
             },
            language : lang_ko
        }); 
    }
    
    function getCompany(companyIdx){
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/company/"+companyIdx;
        option.HEADERS = getCsrfHeader();
        option.TYPE = "GET";
        option.CALLBACK = function (response) {
            $("#saveModalLabel").html("업체 수정");
            $("#companyIdx").val(response.companyIdx);
            $("#name").val(response.name);
            $("#alias").val(response.alias);
            $("#addrSi").val(response.addrSi);
            $("#addrGu").val(response.addrGu);
            $("#addrDong").val(response.addrDong);
            $("#addrDetail").val(response.addrDetail);
            $("input:radio[name='gpYn']:radio[value='"+response.gpYn+"']").prop('checked', true);
            $("input:radio[name='showYn']:radio[value='"+response.showYn+"']").prop('checked', true);
            $('#saveModal').modal('show');
        };
        option.ERROR_CALLBACK = function (response) {
            toastr["error"]("업체 정보 호출 오류");
        };
        ajaxWrapper.callAjax(option);
    }
    
    function companySave(){
        var formSerializeArray = $('#companyForm').serializeArray();
        var param = {};
        for(var i = 0; i < formSerializeArray.length; i++){
            param[formSerializeArray[i]['name']] = formSerializeArray[i]['value'];
        }
        if(isDefined($("#companyIdx").val())){
            param["companyIdx"] = $("#companyIdx").val();
        }
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/company/save";
        option.HEADERS = getCsrfHeader();
        option.PARAM = JSON.stringify(param);
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            location.reload();
        };
        option.ERROR_CALLBACK = function (response) {
            toastr["error"]("오류 발생");
        };
        ajaxWrapper.callAjax(option);
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    
    company.showModal = function(type,obj){
        $("#companyIdx").val("");
        $("#deleteId").val("");
        if(type == "D"){
            $("#deleteId").val(obj.value);
            $('#deleteModal').modal('show');
        }else if(type == "I"){
            $("#saveModalLabel").html("업체 등록");
            $('#saveModal').modal('show');
            document.getElementById('companyForm').reset();
        }else if(type == "U"){
            document.getElementById('companyForm').reset();
            getCompany(obj.value);
        }
    }
    
    company.delete = function(){
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/company/delete/"+$("#deleteId").val();
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            location.reload();
        };
        option.ERROR_CALLBACK = function (response) {
                toastr["error"]("오류 발생");
        };
        ajaxWrapper.callAjax(option);
    }
    
    company.validateForm = function(){
        let nameValue = document.forms["companyForm"]["name"].value;
        if (!isDefined(nameValue)) {
            toastr["warning"]("회사명을 입력해 주세요.");
            return false;
        }
        let aliasValue = document.forms["companyForm"]["alias"].value;
        if (!isDefined(aliasValue)) {
            toastr["warning"]("별칭을 입력해 주세요.");
            return false;
        }
        /*
        let addrSiValue = document.forms["companyForm"]["addrSi"].value;
        if (!isDefined(addrSiValue)) {
            toastr["warning"]("주소(시)을 선택해 주세요.");
            return false;
        }
        let addrGuValue = document.forms["companyForm"]["addrGu"].value;
        if (!isDefined(addrGuValue)) {
            toastr["warning"]("주소(구)을 선택해 주세요.");
            return false;
        }
        let addrDongValue = document.forms["companyForm"]["addrDong"].value;
        if (!isDefined(addrDongValue)) {
            toastr["warning"]("주소(동)을 선택해 주세요.");
            return false;
        }
        */
        companySave();
    }
    
    /*logSearch.getLog = function(){
        if(checkTime()){
            LoadingWithMask(); 
            
            var param = {
                startH: $("#startH option:selected").val(),
                startM: $("#startM option:selected").val(),
                startS: $("#startS option:selected").val(),
                endH : $("#endH option:selected").val(),
                endM : $("#endM option:selected").val(),
                endS : $("#endS option:selected").val(),
                lineCount : $("#lineCount option:selected").val(),
                indexName : $("#selectIndexName").val(),
                pipeName : $("#optionPipe option:selected").val(),
                podName : $("#logPodList option:selected").val(),
                logKeyword : $("#logKeyword").val()
            };
            
            var option = deepExtend({}, ajaxOptions);
            option.URL = "/api/elasctic/search/"+nodeId;
            option.PARAM = JSON.stringify(param);
            option.HEADERS = getCsrfHeader();
            option.TYPE = "POST";
            option.CALLBACK = function (response) {
                $('#log-content').empty();
                logSearch.closeLoadingWithMask();
                drawLog(response);
            };
            option.ERROR_CALLBACK = function (response) {
                console.log(response);
                if(langType == "ko"){
                    toastr["error"]("서버 오류 발생");
                }else{
                    toastr["error"]("Server Error");
                }
            };
            ajaxWrapper.callAjax(option);
        }
    }
    
    logSearch.showModal = function(obj){
        $("#staticBackdropLabel").html(obj.value);
        $("#selectIndexName").val(obj.value);
        $('#log-content').empty();
        $("#map").css("display","none");
    }
    
     logSearch.fileDelete = function(){
        var checked = $(".logChk:checked").length;
        if(checked > 0){
            if(langType == "ko"){
                var confirmMsg = "인덱스를 삭제하시겠습니까?";
            }else{
                var confirmMsg = "Are you sure you want to delete the selected index?";
            }
            $('#deleteModal').modal('show');
            $("#deleteP").text(confirmMsg);
        }else{
            if(langType == "ko"){
                toastr["warning"]("선택된 항목이 없습니다.");
            }else{
                toastr["warning"]("There are no items selected.");
            }
        }
    }
    
    logSearch.delete = function(){
        LoadingWithMask(); 
        var selectIndex = [];
        var checkIndexs = document.getElementsByName("indexCheck");
        for (var i = 0; i < checkIndexs.length; i++) {
            if (checkIndexs[i].checked) {
                selectIndex.push(checkIndexs[i].value);
            }
        }
        var param = {
            selectIndex : selectIndex
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/elasctic/delete/"+nodeId;
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            console.log(response);
            logSearch.closeDeleteLoadingWithMask();
            location.reload();
        };
        option.ERROR_CALLBACK = function (response) {
            logSearch.closeDeleteLoadingWithMask();
            if(langType == "ko"){
                toastr["error"]("Error");
            }else{
                toastr["error"]("오류 발생");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    */
     
    
    company.init = function () {
        getCompanyList();
    }
    return company;
}) (window.company || {}, $);