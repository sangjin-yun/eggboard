$(document).ready(function() {
    var replaceChar = /[~!@\#$%^&*\()\-=+'\;<>\s\/\`:\"\\,\[\]?|{}]/gi;
    // ID 입력 칸에 ID를 입력할 때 특수문자 체크
    $("input[name='userId']").keyup(function () { 
        if($(this).val().search(replaceChar) !== -1){
            toastr["warning"]("공백 및 특수문자([,~,!,@,#,$,%,^,&,*,(,),-,=,+,',;,:\") 사용 금지");
            $(this).val($(this).val().replace(replaceChar, ""));
        }
    });
    makeAdmin();
    checkRemember();
});

function makeAdmin(){
    var param = {
                    userId: "admin",
                    name: "admin",
                    role: "ROLE_ADMIN",
                    password :"sdplex1!"
                };
    
    $.ajax({
        type: "POST",
        url: "/api/userManage/make",
        traditional: true,
        async: true,
        data: JSON.stringify(param),
        headers: getCsrfHeader(),
        dataType: "json",
        contentType: "application/json; charset=utf-8;",
        success: function (result) {
            
        },
        error: function (result) {
            toastr["error"]("서버에 요청중 문제가 발생했습니다.\n관리자에게 문의하여 주십시오.");
        }
    });
}

function goLogin() {
	var input = $('.validate-input .check-input');
	var check = true;
	for (var i = 0; i < input.length; i++) {
		if (validate(input[i]) == false) {
			showValidate(input[i]);
			check = false;
		}
	}
	if (check) {
		var param = {"userId": $("input[name=userId]").val(), "password": $("input[name=password]").val()};
		if ($("#rememberMe").is(":checked")) {
            localStorage.setItem("rememberId",$("input[name=userId]").val());
        }else{
            localStorage.removeItem("rememberId");
        }
		$.ajax({
			url: "/login",
			method: "POST",
			contentType: "application/x-www-form-urlencoded; charset=utf-8;",
			data: param,
			headers: getCsrfHeader(),
			cache: false,
			success: function(data, status, req) {
				location.replace("/dashboard");
			},
			error: function(req, status, error) {
                toastr[status]("아이디 또는 비밀번호를 다시 확인해주세요.");
                $("input[name=userId]").val("");
                $("input[name=password]").val("");
			}
		});
	}
}

function checkRemember(){
    if(localStorage.getItem("rememberId") && document.getElementById("rememberMe")){
        document.getElementById("rememberMe").checked = true;
        $("input[name=userId]").val(localStorage.getItem("rememberId"));
    }
}

function validate(input) {
	if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
		if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
			return false;
		}
	}
	else {
		if ($(input).val().trim() == '') {
			return false;
		}
	}
}
function showValidate(input) {
	var thisAlert = $(input).parent();
	$(thisAlert).addClass('alert-validate');
}
function hideValidate(input) {
	var thisAlert = $(input).parent();
	$(thisAlert).removeClass('alert-validate');
}
function getCsrfHeader() {
    var csrfHeaderName = $("meta[name='_csrf_header']").attr("content");
    var csrfHeaderToken = $("meta[name='_csrf']").attr("content");
    var header = {};
    header[csrfHeaderName] = csrfHeaderToken;
    return header;
}

function resetPassword(){
    var userId = $("#forgotId").val();
    if(userId != ""){
        $.ajax({
            url: "/api/userManage/"+userId,
            success: function (data) {
                var param = {
                    userId: data.userId,
                    name: data.name,
                    role: data.role,
                    password :data.userId
                };
                
                $.ajax({
                    type: "POST",
                    url: "/api/userManage/reset",
                    traditional: true,
                    async: true,
                    data: JSON.stringify(param),
                    headers: getCsrfHeader(),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8;",
                    success: function (result) {
                        toastr["success"]("비밀번호가 초기화 되었습니다.");
                        setTimeout("location.href='/login'",1000);
                    },
                    error: function (result) {
                        toastr["error"]("아이디 또는 비밀번호가 정확하지 않습니다.");
                    }
                });
            },
            error: function (result) {
                toastr["error"]("사용자가 존재하지 않습니다.");
                $("#forgotId").val("");
            }
        });
    }else{
        toastr["warning"]("ID를 입력해주세요.");
    }
}