/**
 * 공백, undefined, null 체크 함수
 * @param {string} checkValue check value
 * @returns 값이 존재하면 true / 공백, undefined, null false
 */
function isDefined(checkValue){
    if(checkValue === "" || checkValue === undefined || checkValue === null){
        return false;
    }
    return true;
}

/**
 * 공백 제거 함수
 * @param {string} checkValue check value
 * @returns 공백이 제거된 value
 */
function removeSpace(checkValue){
    checkValue = checkValue.replace(/(\s*)/g, "");
    return checkValue;
}

/**
 * 영어, 숫자, '-' 만 허용 체크 함수
 * @param {Object} obj check value
 * @returns 조건에 걸리면 경고문구 / 조건에 맞으면 소문자 변환 값
 */
function allowEngNumHyphen(obj){
    var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\_+┼<>@\#$%&\'\"\\\(\=ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi;
    if( regExp.test(obj.value) ){
        if(langType == "ko"){
            toastr["warning"]("영문, 숫자, '-' 만 입력 가능합니다.");
        }else{
            toastr["warning"]("Only English, numbers and - can be entered.");
        }
       obj.value = obj.value.substring( 0 , obj.value.length - 1 ); 
    }else{
        obj.value = obj.value.toLowerCase();
    }
}

/**
 * 영어만 허용 체크 함수
 * @param {Object} obj check value
 * @returns 조건에 걸리면 경고문구 / 조건에 맞으면 소문자 변환 값
 */
function allowEng(obj){
    var regExp = /[0-9\-\{\}\[\]\/?.,;:|\)*~`!^\_+┼<>@\#$%&\'\"\\\(\=ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi;
    if( regExp.test(obj.value) ){
        if(langType == "ko"){
            toastr["warning"]("소문자 영문만 입력 가능합니다.");
        }else{
            toastr["warning"]("Only lowercase English letters can be entered.");
        }
       obj.value = obj.value.substring( 0 , obj.value.length - 1 ); 
    }else{
        obj.value = obj.value.toLowerCase();
    }
}

function allowEngKor(obj){
    var regExp = /[~!@\#$%^&*\()\-=+'\;<>\s\/\`:\"\\,\[\]?|{}]/gi;
    if( regExp.test(obj.value) ){
        if(langType == "ko"){
            toastr["warning"]("공백 및 특수문자([,~,!,@,#,$,%,^,&,*,(,),-,=,+,',;,:\") 사용 금지");
        }else{
            toastr["warning"]("([,~,!,@,#,$,%,^,&,*,(,),-,=,+,',;,:\") cannot be used");
        } 
       obj.value = obj.value.substring( 0 , obj.value.length - 1 ); 
    }else{
        obj.value = obj.value.toLowerCase();
    }
}

/**
 * csrf header func
 */
function getCsrfHeader() {
    var csrfHeaderName = $("meta[name='_csrf_header']").attr("content");
    var csrfHeaderToken = $("meta[name='_csrf']").attr("content");
    var header = {};
    header[csrfHeaderName] = csrfHeaderToken;
    return header;
}