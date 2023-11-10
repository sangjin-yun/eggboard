$(document).ready(function () {
    
});

window.onload = function () {
      group.init();
};

var group = (function (group, $) {
    
    function getGroups(){
        $.ajax({
            url: "/api/group/list",        
            success: function (data) {
                $("#dynamicTbody").empty();
                var html ="";
                for (var i=0; i<data.length; i++) {
                    html += '<tr>';
                    html += '<td>' + Number(Number(i)+Number(1)) + '</td>';
                    html += '<td>' + data[i].name +'</td>';
                    html += '<td>';
                    html += '<button class="btn btn-falcon-primary mr-1 mb-1" onclick="group.modifyModal(this.value,'+data[i].groupId+');" type="button" value="'+data[i].name+'" style="margin-right: 10px;" chkI18n="button.modify"></button>';
                    html += '<button class="btn btn-falcon-danger mr-1 mb-1" onclick="group.deleteModal(this.value);" type="button" value="'+data[i].groupId+'" style="margin-right: 10px;" chkI18n="button.delete"></button>';
                    html += '</td>';
                    html +='</tr>';
                }
                $("#dynamicTbody").append(html);
                localize();
            }
            ,error : function(result){
                console.log(result);
            }
        });
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    
    group.deleteModal = function(id){
        $('#deleteModal').modal('show');
        var confirmMsg = "Are you sure you want to delete Node Group?";
        if(langType == "ko"){
            confirmMsg = "해당 노드 그룹을 삭제하시겠습니까 ?"
            $("#deleteModalLabel").text("노드 그룹 삭제");
        }else{
            $("#deleteModalLabel").text("Node Group Delete");
        }
        $("#groupDeleteP").text(confirmMsg);
        $("#groupDeleteId").val(id);
    }
    
    group.groupDelete = function(){
        var groupId = $("#groupDeleteId").val();
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/group/"+groupId+"/delete";
        option.HEADERS = getCsrfHeader();
        option.TYPE = "DELETE";
        option.CALLBACK = function (response) {
            location.reload();
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("노드 그룹 삭제에 실패하였습니다.");
            }else{
                toastr["error"]("Node Group delete failed.");
            }
            $('#deleteModal').modal('hide');
        };
        ajaxWrapper.callAjax(option);
    }
    
    group.modifyModal = function(name,id){
        $('#saveModal').modal('show');
        if(langType == "ko"){
            $("#saveModalLabel").text("노드 그룹 수정");
        }else{
            $("#saveModalLabel").text("Node Group Modify");
        }
        $("#groupId").val(id);
        $("#groupName").val(name);
        $("#actionType").val("U");
    }
    
    group.addModal = function(){
        $('#saveModal').modal('show');
        if(langType == "ko"){
            $("#saveModalLabel").text("노드 그룹 등록");
        }else{
            $("#saveModalLabel").text("Node Group Add");
        }
        $("#groupId").val("");
        $("#groupName").val("");
        $("#actionType").val("I");
    }
    
    group.save = function(){
        var name = $("#groupName").val();
        
        if(name.length < 3){
            if(langType == "ko"){
                toastr["error"]("이름는 최소길이가 3입니다.");
            }else{
                toastr["error"]("Name has a minimum length of 4.");
            }
            return false;
        }else{
            var param = {
                groupId : $("#groupId").val(),
                name: name,
                type : actionType
            };
        
            var option = deepExtend({}, ajaxOptions);
            option.URL = "/api/group/save";
            option.PARAM = JSON.stringify(param);
            option.HEADERS = getCsrfHeader();
            option.TYPE = "POST";
            option.CALLBACK = function (response) {
                location.reload();
            };
            option.ERROR_CALLBACK = function (response) {
                console.log(response);
                if(langType == "ko"){
                    toastr["error"]("Error");
                }else{
                    toastr["error"]("오류 발생");
                }
            };
            ajaxWrapper.callAjax(option);
        }
    }
    
    group.init = function () {
        getGroups();
        localize();
    }
    
    return group;
}) (window.group || {}, $);