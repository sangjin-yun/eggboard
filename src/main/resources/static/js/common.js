/*
 * object copy 메소드
 */
var deepExtend = function (out) {
    out = out || {};
    for (var i = 1, len = arguments.length; i < len; ++i) {
        var obj = arguments[i];
        if (!obj) {
            continue;
        }
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
                out[key] = deepExtend(out[key], obj[key]);
                continue;
            }
            out[key] = obj[key];
        }
    }
    return out;
}

var ajaxWrapper = {
    /**
     * Ajax Wrapper
     *
     * Parameter Option Object
     * 필수) URL - 전송 URL (String)
     * 필수) PARAM - 전송 파라미터 (String or Object)
     * 필수) HEADERS - 전송 헤더 (Json Object)
     * 필수) CALLBACK - 콜백함수 (Function)
     * 필수) TYPE - 전송 방식 (POST, GET, PUT, DELETE)
     * 선택) DATA_TYPE - 응답받을 데이터 타입 (String)
     * 선택) CONTENT_TYPE - 전송할 데이터 타입 (String)
     * 선택) ASYNC - 비동기 여부 (boolean : 미지정시 true)
     * 선택) ERROR_CALLBACK - 전송 실패 시 콜백 함수 (Function)
     * 선택) ERRORMSG - 전송 실패시 메시지 (String)
     * 선택) RETURN_INCLUDE - 요청시 포함시키면 결과에 포함됨 (Object)
     */
    callAjax: function (options) {
        if (options.URL != null) {
            if (options.ASYNC == null) {
                options.ASYNC = true;
            }
            $.ajax({
                type: options.TYPE,
                url: options.URL,
                traditional: true,
                data: options.PARAM,
                headers: options.HEADERS,
                async: options.ASYNC,
                dataType: options.DATA_TYPE,
                contentType: options.CONTENT_TYPE,
                success: function (result) {
                    options.CALLBACK(result, options.RETURN_INCLUDE || {});
                },
                error: function (result) {
                    if (options.ERROR_CALLBACK != undefined) {
                        if (result.responseJSON != undefined) {
                            options.ERROR_CALLBACK(result.responseJSON);
                        } else {
                            options.ERROR_CALLBACK(result);
                        }
                    } else if (options.ERRORMSG != undefined) {
                        alert(options.ERRORMSG);
                    } else {
                        alert("서버에 요청중 문제가 발생했습니다.\n관리자에게 문의하여 주십시오.");
                    }
                }
            });
        } else {
            alert("올바른 요청이 아닙니다.");
            return false;
        }
    }
}

// 복사해서 사용해야 함.
var ajaxOptions = {
    URL: "",
    PARAM: null, // TYPE get 을 제외하고 JSON.stringify 처리 필요
    HEADERS: null, // CSRF 보안을 위해 필요
    CALLBACK: function (response) {
        if (response.success) {
            console.log(response);
        } else {
            alert(response);
        }
    },
    ERROR_CALLBACK: function (response) {
        alert(response);
    },
    ASYNC: null, // 기본값 true, false 시 중복 요청 X
    TYPE: null, // 설정해줘야 함 (POST, GET, PUT, DELETE)
    DATA_TYPE: "json",
    CONTENT_TYPE: "application/json; charset=utf-8;"
}

var SSEObject = function () {
    // member variable
    var startEventUrl = "/sse/start";
    var stopEventUrl = "/sse/stop";

    var eventKey;
    var startParam;
    var stopParam;

    var startCallback;

    var stopSuccess = function (response) {
        if (response.success) {
            alert("조회를 종료했습니다.");
        }
    };
    var stopFailure = function (error) {
        alert(error);
    };

    var QueueStatus = function (sseQueue, timer, tabStartFlag, layerStartFlag) {
        this.sseQueue = sseQueue;
        this.timer = timer;
        this.tabStartFlag = tabStartFlag;
        this.layerStartFlag = layerStartFlag;

        return this;
    };

    // private function
    function init(pEventName, pDelay, pCallback, pStopCallback, etcParam1, etcParam2) {
        eventKey = pEventName;
        startParam = startEventUrl + "?&eventName=" + pEventName + "&delay=" + pDelay + "&etc1=" + etcParam1+ "&etc2=" + etcParam2;
        startCallback = pCallback;
        stopCallback = pStopCallback;
        stopParam = {
            URL: stopEventUrl + "?eventKey=" + eventKey,
            TYPE: "get",
            CALLBACK: pStopCallback,
            ERROR_CALLBACK: stopFailure
        };
    }

    function start() {
        var source = new EventSource(startParam);
        
        source.onmessage = function(event) {
            startCallback(event);
        };
        
        source.onerror = function () {
            stopCallback();
            source.close();
        };
        
        var queueStatus = new QueueStatus([], null, false, false);
        var result = {"eventSource": source, "stopParam": stopParam, "queueStatus": queueStatus};
        return result;
    }

    function stop(eventObject) {
        eventObject.eventSource.close();
        stopCallback();
    }

    // public function
    this.init = function (startUrl, stopUrl, eventName, delay, callback, stopCallback, etcParam1, etcParam2) {
        startEventUrl = "/sse" + startUrl;
        stopEventUrl = "/sse" + stopUrl;
        // console.log(ipAddress);
        if (stopCallback == null || stopCallback == undefined) {
            stopCallback = stopSuccess;
        }
        init(eventName, delay, callback, stopCallback, etcParam1, etcParam2);
    }
    this.start = function () {
        return start();
    }
    this.stop = function (eventObject) {
        stop(eventObject);
    }
    return this;
}

/* datatable lang */
var lang_en = {        
        "decimal" : ""
,        "emptyTable" : "No data available in table"
,        "info" : "Showing _START_ to _END_ of _TOTAL_ entries"
,        "infoEmpty" : "Showing 0 to 0 of 0 entries"
,        "infoFiltered" : "(filtered from _MAX_ total entries)"
,        "infoPostFix" : ""
,        "thousands" : ","
,        "lengthMenu" : "Show _MENU_ entries"
,        "loadingRecords" : "Loading..."
,        "processing" : "Processing..."
,        "zeroRecords" : "No matching records found"
,        "paginate" : {
                "first" : "First",
                "last" : "Last",
                "next" : "Next",
                "previous" : "Previous"        
        }
,        "aria" : {
                "sortAscending" : " :  activate to sort column ascending",
                "sortDescending" : " :  activate to sort column descending"        
        }    
};
var lang_ko = {        
        "decimal" : ""
,        "emptyTable" : "데이터가 없습니다."
,        "info" : "_START_ - _END_ (총 _TOTAL_ 개)"
,        "infoEmpty" : "0명"
,        "infoFiltered" : "(전체 _MAX_ 명 중 검색결과)"
,        "infoPostFix" : ""
,        "thousands" : ","
,        "lengthMenu" : "_MENU_ 개씩 보기"
,        "loadingRecords" : "로딩중..."
,        "processing" : "처리중..."
,        "zeroRecords" : "검색된 데이터가 없습니다."
,        "paginate" : {
                "first" : "첫 페이지",
                "last" : "마지막 페이지",
                "next" : "다음",
                "previous" : "이전"
         }
,        "aria" : {
                "sortAscending" : " :  오름차순 정렬",
                "sortDescending" : " :  내림차순 정렬"
         }
};
/* datatable lang */