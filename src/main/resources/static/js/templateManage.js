window.onload = function () {
    templateManage.init();
};

const templateManage = (function (templateManage, $) {
    let templateData;
    /**************************************
     * Private 함수
     * ************************************/
     function getTemplateSetting(){
        $.ajax({
            url: "/api/template",
            success: function (data) {
                templateData = data;
                $("#dynamicTbody").empty();
                let html ="";
                for (let i=0; i<data.length; i++) {
                    html += '<tr>';
                    html += '<td>' + data[i].type +'</td>';
                    html += '<td>' + data[i].tag +'</td>';
                    html += '<td>' + data[i].updatedDate+'</td>'
                    html += '<td>';
                    html += '<button class="btn btn-falcon-primary mr-1 mb-1" onclick="templateManage.modifyModal(\''+data[i].type+'\',\''+data[i].tag+'\');" type="button" style="margin-right: 10px;" chkI18n="button.modify"></button>';
                    html += '<button class="btn btn-falcon-danger mr-1 mb-1" onclick="templateManage.deleteModal(\''+data[i].type+'\',\''+data[i].tag+'\');" type="button" style="margin-right: 10px;" chkI18n="button.delete"></button>';
                    html += '</td>';
                    html +='</tr>';
                }
                $("#dynamicTbody").append(html);
                settingDatatable();
                localize();
            }
        });
    }
    
    function settingDatatable(){
        if(langType == "ko"){
            $("#templateTable").DataTable({
                order: [ [ 0, "asc" ] ],
                "columnDefs": [
                    { "orderable": true, "targets": [0,1,2] },
                    { "orderable": false, "targets": [3] }
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "검색 : "
                 },
                 language : lang_ko
            }); 
        }else{
            $("#templateTable").DataTable({
                order: [ [ 0, "asc" ] ],
                "columnDefs": [
                    { "orderable": true, "targets": [0,1,2] },
                    { "orderable": false, "targets": [3] }
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "Search : "
                 },
                 language : lang_en
            }); 
        }
    }
    
    function save(){
        let templatePod = $("#templatePod").val();
        let tagName = $("#tagName").val();
        let editValue = ace.edit("contentBox").getValue();
        
        if(!isDefined(templatePod)){
            if(langType == "ko"){
                toastr["warning"]("타입을 선택해 주세요.");
            }else{
                toastr["warning"]("Please select a Type");
            }
        }else if(!isDefined(tagName)){
            if(langType == "ko"){
                toastr["warning"]("명칭을 입력해 주세요.");
            }else{
                toastr["warning"]("Please enter the name.");
            }
        }else if(!isDefined(removeSpace(ace.edit("contentBox").getValue()))){
            if(langType == "ko"){
                toastr["warning"]("내용을 입력해 주세요.");
            }else{
                toastr["warning"]("Please enter the content.");
            }
        }else{
            let param = {
                type : templatePod,
                tag : tagName,
                content : editValue,
                gubun: $("#templateActionType").val(),
                templateOrgType: $("#templateOrgType").val(),
                templateOrgTag: $("#templateOrgTag").val()
            };
            let option = deepExtend({}, ajaxOptions);
            option.URL = "/api/template/save";
            option.PARAM = JSON.stringify(param);
            option.HEADERS = getCsrfHeader();
            option.TYPE = "POST";
            option.CALLBACK = function (response) {
                if(response.error){
                    if(response.error == "overlap"){
                        if(langType == "ko"){
                            toastr["error"]("타입과 명칭이 동일한 데이터가 존재합니다.");
                        }else{
                            toastr["error"]("Data with the same type and name exists.");
                        }
                    }
                }else{
                    location.reload();
                }
            };
            option.ERROR_CALLBACK = function (response) {
                console.log(response);
                if(langType == "ko"){
                    toastr["error"]("Toml 문법에 맞게 작성해 주세요.");
                }else{
                    toastr["error"]("Please write according to the Toml syntax.");
                }
            };
            ajaxWrapper.callAjax(option);
        }
    }
    
    function modifyModal(type, tag){
        for(idx in templateData){
            if(templateData[idx].type == type && templateData[idx].tag == tag){
                var editor1 = ace.edit("contentBox");
                editor1.destroy();
                $("#contentBox").html("");
                $("#contentBox").html(templateData[idx].content);
                var editor = ace.edit("contentBox");
                if(themeType == "light"){
                    editor.setTheme("ace/theme/github");
                }else{
                    editor.setTheme("ace/theme/nord_dark");
                }
                editor.session.setMode("ace/mode/toml");
            }
        }
        $('#templateSaveModal').modal('show');
        $("#tagName").val(tag);
        $("#templateOrgTag").val(tag);
        $("#templateOrgType").val(type);
        $("#templatePod").val(type).prop("selected",true);
        $("#templateActionType").val("U");
        if(langType == "ko"){
            $("#templateSaveModalLabel").text("템블릿 수정");
        }else{
            $("#templateSaveModalLabel").text("Template Modify");
        }
    }
    
    /**************************************
     * Public 함수
     * ************************************/
     
     templateManage.delete = function(){
        let param = {
            type: $("#templateDeleteType").val(),
            tag: $("#templateDeleteTag").val()
        };
        
        let option = deepExtend({}, ajaxOptions);
        option.URL = "/api/template/delete";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "DELETE";
        option.CALLBACK = function (response) {
            location.reload();
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("오류 발생");
            }else{
                toastr["error"]("Error");
            }
        };
        ajaxWrapper.callAjax(option);
    }
     
     templateManage.deleteModal = function(type, tag){
        let confirmMsg = "Are you sure you want to delete?"
        let labelMsg = "Template Delete"
        if(langType == "ko"){
            confirmMsg = "삭제하시겠습니까 ?"
            labelMsg = "템플릿 삭제"
        }
        $("#templateDeleteP").text(confirmMsg);
        $("#templateDeleteModalLabel").text(labelMsg);
        
        $('#templateDeleteModal').modal('show');
        $("#templateDeleteType").val(type);
        $("#templateDeleteTag").val(tag);
    }
     
     templateManage.save = function(){
        save();
    }
    
    templateManage.modifyModal = function(type, tag){
        modifyModal(type, tag);
    }
    
     templateManage.addModal = function(){
        $("#templateActionType").val("I");
        $('#templateSaveModal').modal('show');
        if(langType == "ko"){
            $("#templateSaveModalLabel").text("템블릿 등록");
        }else{
            $("#templateSaveModalLabel").text("Template Add");
        }
        var editor1 = ace.edit("contentBox");
        editor1.destroy();
        $("#tagName").val("");
        $("#templatePod").val("").prop("selected",true);
        $("#contentBox").html("");
        var editor = ace.edit("contentBox");
        if(themeType == "light"){
            editor.setTheme("ace/theme/github");
        }else{
            editor.setTheme("ace/theme/nord_dark");
        }
        editor.session.setMode("ace/mode/toml");
    }
    
    templateManage.init = function () {
        getTemplateSetting();
    }
    
    return templateManage;
}) (window.templateManage || {}, $);