window.onload = function () {
    userManage.init();
};

const userManage = (function (userManage, $) {
    let userIdList = [];
    /**************************************
     * Private 함수
     * ************************************/
     function getUserSetting(){
        $.ajax({
            url: "/api/userManage",
            success: function (data) {
                $("#dynamicTbody").empty();
                let html ="";
                for (let i=0; i<data.length; i++) {
                    html += '<tr>';
                    html += '<td>' + Number(Number(i)+Number(1)) + '</td>';
                    html += '<td>' + data[i].userId +'</td>';
                    html += '<td>' + data[i].name +'</td>';
                    html += '<td>' + data[i].role+ '</td>';
                    if(data[i].lastLoginAt != null){
                        html += '<td>'+data[i].lastLoginAt+'</td>'
                    }else{
                        html += '<td>정보가 없습니다.</td>'
                    }
                    html += '<td>';
                    html += '<button class="btn btn-outline-info mr-1 mb-1" onclick="userManage.modifyModal(this.value);" type="button" value="'+data[i].userId+'" style="margin-right: 10px;">수정</button>';
                    html += '<button class="btn btn-outline-danger mr-1 mb-1" onclick="userManage.deleteModal(this.value);" type="button" value="'+data[i].userId+'" style="margin-right: 10px;">삭제</button>';
                    html += '</td>';
                    html +='</tr>';
                    userIdList.push(data[i].userId);
                }
                $("#dynamicTbody").append(html);
            }
        });
    }
    
    function userDeleteModal(e){
        let confirmMsg = e+"를 삭제하시겠습니까 ?"
        $('#userDeleteModal').modal('show');
        $("#userDeleteP").text(confirmMsg);
        $("#userDeleteId").val(e);
    }
    
    function userDelete(){
        let userId = $("#userDeleteId").val();
        let param = {
            userId: userId
        };
        
        let option = deepExtend({}, ajaxOptions);
        option.URL = "/api/userManage/delete";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "DELETE";
        option.CALLBACK = function (response) {
            toastr["success"]("삭제 되었습니다.");
            $('#userDeleteModal').modal('hide');
            getUserSetting();
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            toastr["error"]("오류 발생");
        };
        ajaxWrapper.callAjax(option);
        
    }
    
    function userSaveModal(){
        $('#userSaveModal').modal('show');
        $("#userSaveModalLabel").text("사용자 등록");
        $("#userId").val("");
        $("#name").val("");
        $("#password").val("");
        $("#actionType").val("I");
        $("#userId").prop("readonly",false);
    }
    
    function userSave(){
        let userId = $("#userId").val();
        let name = $("#name").val();
        let password = $("#password").val();
        let orgPassword = $("#orgPassword").val();
        let role = $("#role option:selected").val();
        let actionType = $("#actionType").val();
        let chkValue = true;
        
        for(const element of userIdList){
            if(element == userId || userId == "admin"){
                chkValue = false;
            }
        }
        
        if("U" == actionType){
            chkValue = true;
        }
        
        if(chkValue){
            let param = {
                userId: userId,
                name: name,
                role: role,
                password :password,
                orgPassword : orgPassword,
                type : actionType
            };
        
            let option = deepExtend({}, ajaxOptions);
            option.URL = "/api/userManage/save";
            option.PARAM = JSON.stringify(param);
            option.HEADERS = getCsrfHeader();
            option.TYPE = "POST";
            option.CALLBACK = function (response) {
                $('#userSaveModal').modal('hide');
                toastr["success"]("저장되었습니다.");
                getUserSetting();
            };
            option.ERROR_CALLBACK = function (response) {
                console.log(response);
                toastr["error"]("Error");
            };
            ajaxWrapper.callAjax(option);
        }else{
            toastr["error"]("사용할 수 없는 ID입니다.");
            $("#userId").focus();
            $("#userId").val("");
        }
    }
    
    
    function userModifyModal(userId){
        $.ajax({
            url: "/api/userManage/"+userId,
            success: function (data) {
                console.log(data);
                $('#userSaveModal').modal('show');
                $("#userSaveModalLabel").text("사용자 수정");
                $("#userId").val(data.userId);
                $("#userId").prop("readonly",true);
                $("#name").val(data.name);
                $("#orgPassword").val(data.password);
                $("#password").val("");
                $("#actionType").val("U");
                $("#role").val(data.role).prop("selected",true);
            }
        });
    }
    
    /**************************************
     * Public 함수
     * ************************************/
     
     // user delete modal
    userManage.deleteModal = function(e){
        userDeleteModal(e);
    }
    
    // user delete
    userManage.delete = function(){
        userDelete();
    }
    
    // user modify
    userManage.modifyModal = function(userId){
        userModifyModal(userId);
    }
     
     // user add modal
     userManage.addModal = function(){
        userSaveModal();
    }
    
    // user add
    userManage.save = function(){
        let userId = $("#userId").val();
        let password =  $("#password").val();
        let name = $("#name").val();
        let actionType = $("#actionType").val();
        
        
        if(userId.length < 3){
            toastr["error"]("ID는 최소길이가 3입니다.");
            return false;
        }
        if(actionType != "U"){
            if(password.length < 6){
                toastr["error"]("비밀번호는 최소길이가 6입니다.");
                return false;
            }
        }
        if(name.length < 3){
            toastr["error"]("이름는 최소길이가 3입니다.");
            return false;
        }
        userSave();
    }
     
     // user list
    userManage.init = function () {
        getUserSetting();
    }
    
    return userManage;
}) (window.userManage || {}, $);