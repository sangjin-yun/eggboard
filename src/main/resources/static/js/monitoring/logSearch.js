$(document).ready(function () {
    
});

window.onload = function () {
      logSearch.init();
      localize();
      var replaceChar = /[~!@\#$%^&*\()\-=+'\;<>\s\/\`:\"\\,\[\]?|{}]/gi;
      $("#logKeyword").keyup(function () { 
        if($(this).val().search(replaceChar) !== -1){
            if(langType == "ko"){
                toastr["warning"]("공백 및 특수문자([,~,!,@,#,$,%,^,&,*,(,),-,=,+,',;,:\") 사용 금지");
            }else{
                toastr["warning"]("([,~,!,@,#,$,%,^,&,*,(,),-,=,+,',;,:\") cannot be used");
            } 
            $(this).val($(this).val().replace(replaceChar, ""));
        }
    });
};

var logSearch = (function (logSearch, $) {
    var podList = [];
    /**************************************
     * Private 함수
     * ************************************/
    function getLogFile(){
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/elasctic/list/"+nodeId;
        option.HEADERS = getCsrfHeader();
        option.TYPE = "GET";
        option.CALLBACK = function (response) {
            var data = response;
            $("#downTbody").empty();
            var html ="";
            var sizeList = [];
            for (var i=0; i<data.length; i++) {
                html += '<tr>';
                html += '   <td><div class="form-check"><input type="checkbox" name="indexCheck" value="'+data[i].index+'" class="form-check-input logChk" onclick="logSearch.checkControl(this)"/></div></td>';
                html += '   <td>'+data[i].index+'</td>';
                html += '   <td>'+data[i].uuid+'</td>';
                html += '   <td>';
                if("yellow" == data[i].health){
                    html += '   <span class="dot bg-warning"></span>';
                }else if("green" == data[i].health){
                    html += '   <span class="dot bg-success"></span>';
                }else{
                    html += '   <span class="dot bg-danger"></span>';
                }
                html += '   '+data[i].health+'</td>';
                html += '   <td>';
                if("open" == data[i].status){
                    html += '   <button class="btn btn-falcon-success mr-1 mb-1 btn-ssm2" type="button">Open</button>';
                }else{
                    html += '   <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" type="button">Close</button>';
                }
                html += '   </td>';
                html += '   <td>'+data[i].docsCount+'</td>';
                html += '   <td>'+data[i].storeSize+'</td>';
                if(langType == "ko"){
                    html += '   <td><button value="'+data[i].index+'" class="btn btn-outline-info mr-1 mb-1" style="margin-left: 10px; color: #55BCB0; border-color: #55BCB0;" type="button" onclick="logSearch.showModal(this);" data-bs-toggle="modal" data-bs-target="#staticBackdrop">보기</button></td>';
                }else{
                    html += '   <td><button value="'+data[i].index+'" class="btn btn-outline-info mr-1 mb-1" style="margin-left: 10px; color: #55BCB0; border-color: #55BCB0;" type="button" onclick="logSearch.showModal(this);" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Show</button></td>';
                }
                html += '</tr>';
                sizeList.push(data[i].storeSize);
            }
            $("#downTbody").append(html);
            settingDatatable();
            totalSizeMake(sizeList);
            settingTime();
            setOptions();
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
        };
        ajaxWrapper.callAjax(option);
    }
    
    function setOptions(){
        $.ajax({
            url: "/api/node/" + nodeId + "/pipeline",
            success: function (response) {
                var result = response.data.data;
                var html ="";
                
                result = result.sort((a, b) => a.pipename.toLowerCase() < b.pipename.toLowerCase() ? -1 : 1);
                
                for(var i=0;i<result.length;i++){
                    var pipeName = result[i].pipename;
                    html += '<option value="'+pipeName+'">'+pipeName+'</option>';
                    var pods = result[i].pods;
                    var pod = {"pipename" : pipeName, "podList" : pods};
                    podList.push(pod);
                }
                $("#optionPipe").append(html);
            }
        });
    }
    
    function settingTime(){
        var hourHtml = "";
        var hval;
        for(var i=0;i<24;i++){
            hval = i;
            if(hval < 10){
                hval = "0"+i;
            }
            if(i == 0){
                hourHtml += "<option value='"+hval+"' seleted>"+hval+"</option>";
            }else{
                hourHtml += "<option value='"+hval+"'>"+hval+"</option>";
            }
        }
        $(".hourClass").html(hourHtml);
        
        var minHtml = "";
        var mval;
        for(var i=0;i<60;i++){
            mval = i;
            if(mval < 10){
                mval = "0"+i;
            }
            if(i == 0){
                minHtml += "<option value='"+mval+"' seleted>"+mval+"</option>";
            }else{
                minHtml += "<option value='"+mval+"'>"+mval+"</option>";
            }
        }
        $(".minuteClass").html(minHtml);
        
        var secHtml = "";
        var sval;
        for(var i=0;i<60;i++){
            sval = i;
            if(sval < 10){
                sval = "0"+i;
            }
            if(i == 0){
                secHtml += "<option value='"+sval+"' seleted>"+sval+"</option>";
            }else{
                secHtml += "<option value='"+sval+"'>"+sval+"</option>";
            }
        }
        $(".secondClass").html(secHtml);
    }
    
    function totalSizeMake(sizeList){
        var totalSize = 0;
        for(var i=0;i<sizeList.length;i++){
            var size = sizeList[i];
            var unit = size.slice(-2);
            var sizeNum = size.substr(0,size.length-2);
            if(unit == "kb"){
                totalSize += parseFloat((sizeNum * 1024));
            }else if(unit == "mb"){
                totalSize += parseFloat((sizeNum * 1048576));
            }else if(unit == "gb"){
                totalSize += parseFloat((sizeNum * 1073741824));
            }
        }
        if(langType == "ko"){
            $("#totalSize").html("전체 용량 : "+formatBytes(totalSize));
        }else{
            $("#totalSize").html("Total Size : "+formatBytes(totalSize));
        }
    }
    
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    function settingDatatable(){
        if(langType == "ko"){
            $("#downTable").DataTable({
                order: [ [ 1, "desc" ] ],
                "columnDefs": [
                    { "orderable": true, "width": "23%", "targets": [1] },
                    { "orderable": true, "targets": [2] },
                    { "orderable": true, "width": "12%", "targets": [3,4,5,6]},
                    { "orderable": false, "width": "5%", "targets": [0]},
                    { "orderable": false, "width": "10%", "targets": [7]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "인덱스 검색: "
                 },
                 drawCallback: function(){
                    $('.paginate_button:not(.disabled)', this.api().table().container()).on('click', function(){
                        $("#checkAll").prop("checked", false);
                        $(".logChk").prop("checked", false);
                    });
                },
                language : lang_ko
            }); 
        }else{
            $("#downTable").DataTable({
                order: [ [ 1, "desc" ] ],
                "columnDefs": [
                    { "orderable": true, "width": "23%", "targets": [1] },
                    { "orderable": true, "targets": [2] },
                    { "orderable": true, "width": "12%", "targets": [3,4,5,6]},
                    { "orderable": false, "width": "5%", "targets": [0]},
                    { "orderable": false, "width": "10%", "targets": [7]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "Index Search: "
                 },
                 drawCallback: function(){
                    $('.paginate_button:not(.disabled)', this.api().table().container()).on('click', function(){
                        $("#checkAll").prop("checked", false);
                        $(".logChk").prop("checked", false);
                    });
                },
                language : lang_en
            }); 
        }
        var table = $('#downTable').DataTable();
        $('#downTable_filter input').unbind().bind('keyup', function () {
            table.column(1).search(this.value).draw();
        });
        
        var removeBtnHtml = "";
        removeBtnHtml += '<button class="btn btn-outline-info mr-1 mb-1 other" style="margin-left: 10px; color: #EC568D; border-color: #EC568D;" type="button" onclick="logSearch.fileDelete();">';
        if(langType == "ko"){
            removeBtnHtml += '삭제</button>';
        }else{
            removeBtnHtml += 'Delete</button>';
        }
        if(userRole[0].authority != "ROLE_USER"){
            $("#downTable_filter label").append(removeBtnHtml);
        }
    }
    
    function drawLog(responseData){
        var highValue = $("#logHigh").val();
        
        if(responseData.length < 1){
            $("#log-content").append("<span class='line'>No Result</span> <br>");
        }else{
            for(idx in responseData){
                if(responseData[idx].includes(highValue) && highValue != ""){
                    $("#log-content").append("<p class='line' style='margin-bottom: 0px !important; color: #55BCB0; width:88%;'><span style='color:#FF0000'>***   </span>" + responseData[idx] + "</p>");
                }else{
                    $("#log-content").append("<span class='line' style='display:inline-block;  width:88%;'>" + responseData[idx] + "</span> <br>");
                }
            }
            downScroll("log-content");
        }
    }
    
    function downScroll(element){
        
        $("#map").css("display","");
        var content = document.getElementById(element);
        content.scrollTop = content.scrollHeight;
        
        pagemap(document.querySelector('#map'), {
            viewport: document.querySelector('#log-content')
            ,styles: {
                //'span': 'rgba(0,0,1,1)',
                'p' : 'rgba(255,0,0,1)'
            }
            ,view: 'rgba(124,100,79,0.4)'
            ,drag: 'rgba(124,100,79,0.7)'
            ,interval: null
        });
    }
    
    function checkTime(){
        var startHour = $("#startH option:selected").val();
        var startMin = $("#startM option:selected").val();
        var startSec = $("#startS option:selected").val();
        var endHour = $("#endH option:selected").val();
        var endMin = $("#endM option:selected").val();
        var endSec = $("#endS option:selected").val();
        
        if(endHour == "00" 
            || (startHour >= endHour && startMin == endMin && startSec == endSec)
            || (startHour == endHour && startMin >= endMin && startSec >= endSec)
            || (startHour >= endHour && startMin == endMin && startSec >= endSec)
            ){
            if(langType == "ko"){
                toastr["error"]("시작 기간은 종료 기간보다 작아야 합니다.");
            }else{
                toastr["error"]("The start term must be less than the end term.");
            }
            return false;
        }
        
        return true;
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    
    logSearch.getLog = function(){
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
    
    logSearch.checkAllControl = function(){
        if($("#checkAll").is(":checked")){
            $(".logChk").prop("checked", true);
        }else{
            $(".logChk").prop("checked", false);
        }
    }
    
    logSearch.checkControl = function(obj){
        var total = $(".logChk").length;
        var checked = $(".logChk:checked").length;
        if(total != checked){
            $("#checkAll").prop("checked", false);
         }else {
            $("#checkAll").prop("checked", true);
        }
    }
    
    logSearch.fileDown = function(){
        var checked = $(".logChk:checked").length;
        if(checked > 0){
            LoadingWithMask();    
            setTimeout("logSearch.closeLoadingWithMask()", 3000);
        }else{
            if(langType == "ko"){
                toastr["warning"]("선택된 항목이 없습니다.");
            }else{
                toastr["warning"]("There are no items selected.");
            }
        }
    }
    
    logSearch.closeLoadingWithMask = function(){
        $('#mask').remove();
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
    
    logSearch.closeDeleteLoadingWithMask = function(){
        $('#mask').remove();
        $(".logChk").prop("checked", false);
        $("#checkAll").prop("checked", false);
        $('#deleteModal').modal('hide');
    }
    
    logSearch.getPods = function(obj){
        var selectPipeline = obj.value;
        if(selectPipeline != ''){
            for(var i=0;i<podList.length;i++){
                if(podList[i].pipename == selectPipeline){
                    var pods = podList[i].podList;
                    $("#logPodList").empty();
                    var html = "";
                    if(langType == "ko"){
                        html += '<option value="ALL" selected>전체</option>';
                    }else{
                        html += '<option value="ALL" selected>ALL</option>';
                    }
                    for (var j=0; j<pods.length; j++) {
                        html += '<option value="'+pods[j].name+'">'+pods[j].name+'</option>';
                    }
                    $("#modalSearch").attr("disabled", false);
                    $("#logKeyword").attr("readonly", false);
                    $("#logHigh").attr("readonly", false);
                    $("#logPodList").append(html);
                }
            }
        }else{
            $("#modalSearch").attr("disabled", true);
            $("#logKeyword").attr("readonly", true);
            $("#logHigh").attr("readonly", true);
            $("#logPodList").empty();
            $("#logPodList").append('<option value="" selected chkI18n="table.select"></option>');
            localize();
        }
    }
     
    logSearch.enterkey = function(){
        if (window.event.keyCode == 13) {
            logSearch.getLog();
        }
    }
     
    
    logSearch.init = function () {
        getLogFile();
    }
    return logSearch;
}) (window.logSearch || {}, $);