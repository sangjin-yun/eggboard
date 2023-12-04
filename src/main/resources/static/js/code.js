window.onload = function () {
      code.init();
};

var code = (function (code, $) {
    /**************************************
     * Private 함수
     * ************************************/
    function getCodeList(){
        var option = deepExtend(ajaxOptions);
        option.URL = "/api/code";
        option.HEADERS = getCsrfHeader();
        option.TYPE = "get";
        option.CALLBACK = function (response) {
            var data = response;
            $("#dynamicTbody").empty();
            var html ="";
            for (var i=0; i<data.length; i++) {
                html += '<tr>';
                html += '   <td>'+Number(Number(i)+Number(1))+'</td>';
                html += '   <td>'+data[i].name+'</td>';
                html += '   <td>';
                html += '   <button value="'+data[i].codeIdx+'" class="btn btn-outline-info mr-1 mb-1" type="button" onclick="code.showModal(\'U\',this);">수정</button>';
                html += '   <button value="'+data[i].codeIdx+'" class="btn btn-outline-danger mr-1 mb-1" type="button" onclick="code.showModal(\'D\',this);">삭제</button>';
                html += '   </td>';
                html += '</tr>';
            }
            $("#dynamicTbody").append(html);
            settingDatatable();
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            toastr["error"]("오류발생");
        };
        ajaxWrapper.callAjax(option);
    }
    
    function settingDatatable(){
        $("#downTable").DataTable({
            order: [ [ 0, "desc" ] ],
            "columnDefs": [ 
                { "orderable": true, "width": "10%", "targets": [0] },
                { "orderable": false, "width": "20%", "targets": [2] },
                { "orderable": true, "targets": [1] }
            ],
            autoWidth: false,
            "oLanguage": {
               "sSearch": "찾기 : "
             },
            language : lang_ko
        }); 
    }
    
    function getCode(codeIdx){
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/code/"+codeIdx;
        option.HEADERS = getCsrfHeader();
        option.TYPE = "GET";
        option.CALLBACK = function (response) {
            console.log(response);
            $("#codeIdx").val(response.parentResult.codeIdx);
            document.forms["parentForm"]["parentName"].value = response.parentResult.name;
            callChildForm(response.childResult);
            $('#saveModal').modal('show');
        };
        option.ERROR_CALLBACK = function (response) {
            toastr["error"]("코드 호출 오류");
        };
        ajaxWrapper.callAjax(option);
    }
    
    function callChildForm(data){
        for(var i=0;i<data.length;i++){
            var result = data[i];
            var html = "";
            html += '<div class="modal-body add-child" style="padding-bottom: 0; padding-top: 0;">';
            html += '  <input type="hidden" name="deleteYn" value="N"/>';
            html += '  <div class="form-group" style="display:inline-block; width:20%;">';
            html += '    <label for="childSortOrder" class="col-form-label"><span style="color: red;">*</span>코드순서</label>';
            html += '    <input type="text" class="form-control" name="childSortOrder" value="'+result.sortOrder+'" placeholder="1"/>';
            html += '  </div>';
            html += '  <div class="form-group" style="display:inline-block; width:60%;">';
            html += '    <label for="childName" class="col-form-label"><span style="color: red;">*</span>코드명</label>';
            html += '    <input type="text" class="form-control" name="childName" value="'+result.name+'" placeholder="1등급"/>';
            html += '  </div>';
            html += '  <div class="form-group" style="display:inline-block;">';
            html += '    <button type="button" class="btn btn-outline-danger" style="vertical-align: baseline;" onclick="code.removeDiv(this);">삭제</button>';
            html += '  </div>';
            html += '</div>';
            $("#childForm").append(html);
        }
    }
    
    function addChildForm(){
        var html = "";
        html += '<div class="modal-body add-child" style="padding-bottom: 0; padding-top: 0;">';
        html += '  <input type="hidden" name="deleteYn" value="N"/>';
        html += '  <div class="form-group" style="display:inline-block; width:20%;">';
        html += '    <label for="childSortOrder" class="col-form-label"><span style="color: red;">*</span>코드순서</label>';
        html += '    <input type="text" class="form-control" name="childSortOrder" placeholder="1"/>';
        html += '  </div>';
        html += '  <div class="form-group" style="display:inline-block; width:60%;">';
        html += '    <label for="childName" class="col-form-label"><span style="color: red;">*</span>코드명</label>';
        html += '    <input type="text" class="form-control" name="childName" placeholder="1등급"/>';
        html += '  </div>';
        html += '  <div class="form-group" style="display:inline-block;">';
        html += '    <button type="button" class="btn btn-outline-danger" style="vertical-align: baseline;" onclick="code.removeDiv(this);">삭제</button>';
        html += '  </div>';
        html += '</div>';
        $("#childForm").append(html);
    }
    
    function codeSave(){
        var param = {};
        
        var parentFormSerializeArray = $('#parentForm').serializeArray();
        var parentParam = {};
        for(var i = 0; i < parentFormSerializeArray.length; i++){
            parentParam[parentFormSerializeArray[i]['name']] = parentFormSerializeArray[i]['value'];
        }
        if(isDefined($("#codeIdx").val())){
            parentParam["codeIdx"] = $("#codeIdx").val();
        }
        param["parentCode"] = parentParam;
        
        var childArray = [];
        for(var i=0;i<$(".add-child").length;i++){
            childArray.push(
                {
                    sortOrder : $("#childForm input[name='childSortOrder']").eq(i).val()
                    ,name : $("#childForm input[name='childName']").eq(i).val()
                }
            )
        }
        param["childCode"] = childArray;
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/code/save";
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
    code.validateForm = function(){
        
        if (!isDefined(document.forms["parentForm"]["parentName"].value)) {
            toastr["warning"]("코드 그룹명을 입력해 주세요.");
            return false;
        }
        
        if($(".add-child").length > 0){
            var isValid = true;
            $("input[name=childSortOrder]").each(function(i, selected){
                if(!isDefined($(selected).val())){
                    var num = i+1;
                    toastr["warning"](num+"번째 코드순서를 입력해 주세요.");
                    isValid = false;
                }
            });
            if(!isValid){
                return false;
            }
            $("input[name=childName]").each(function(i, selected){
                if(!isDefined($(selected).val())){
                    var num = i+1;
                    toastr["warning"](num+"번째 코드명을 입력해 주세요.");
                    isValid = false;
                }
            });
            if(!isValid){
                return false;
            }
        }else{
            toastr["warning"]("1개 이상의 하위 코드를 생성해 주세요.");
            return false;
        }
        
        codeSave();
    }
     
    code.removeDiv = function(e){
        e.parentElement.parentElement.remove();
    }
    
    code.showModal = function(type,obj){
        $("#codeIdx").val("");
        $("#deleteId").val("");
        if(type == "D"){
            $("#deleteId").val(obj.value);
            $('#deleteModal').modal('show');
        }else if(type == "I"){
            $('#saveModal').modal('show');
            document.getElementById('parentForm').reset();
            $(".add-child").remove();
        }else if(type == "U"){
            document.getElementById('parentForm').reset();
            $(".add-child").remove();
            getCode(obj.value);
        }
    }
    
    code.delete = function(){
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/code/delete/"+$("#deleteId").val();
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
    
    code.addChildForm = function(){
        addChildForm();
    }
    
    code.init = function () {
        getCodeList();
    }
    return code;
}) (window.code || {}, $);