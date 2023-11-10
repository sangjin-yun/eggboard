$(document).ready(function () {
    
});

window.onload = function () {
      logMonitoring.init();
      localize();
};

var logMonitoring = (function (logMonitoring, $) {
    var eventName;
    var SSE_LOG;
    var events = {};
    var podList = [];
    
    /**************************************
     * Private 함수
     * ************************************/
     
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
    
    function getPods(obj){
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
                    $("#startBtn").attr("disabled", false);
                    $("#logPodList").append(html);
                }
                
            }
            
        }else{
            $("#startBtn").attr("disabled", true);
            $("#stopBtn").attr("disabled", true);
            $("#logPodList").empty();
            $("#logPodList").append('<option value="" selected chkI18n="table.select"></option>');
            localize();
        }
    }
     
    function sseStart(){
        eventName = $("#optionPipe option:selected").val();
        var eventKey = eventName;
        var responseData;
        if (events[eventKey] != undefined) {
            if(langType == "ko"){
                toastr["warning"]("이미 시작되었습니다.");
            }else{
                toastr["warning"]("Has already started.");
            }
            return;
        }else{
            $("#startBtn").attr("disabled", true);
            $("#stopBtn").attr("disabled", false);
            $("#optionPipe").attr("disabled", true);
            $("#logPodList").attr("disabled", true);
            $("#logLevel").attr("disabled", true);
            $("#firstDiv").addClass("on_log");
            $("#log-content").append("<span class='line' style='color: #00d27a;'>========== Elasticsearch Log Start ==========</span> <br>");
        }
        SSE_LOG = new SSEObject();
        SSE_LOG.init("/elasticsearch","", eventKey, 1000, eventCallback, stopCallback, nodeId, $("#logPodList option:selected").val());
        
        events[eventKey] = SSE_LOG.start();
        
        function eventCallback(response) {
            responseData = JSON.parse(response.data);
            drawLog(responseData);
        }
        
        function stopCallback() {
            $("#startBtn").attr("disabled", false);
            $("#stopBtn").attr("disabled", true);
            $("#optionPipe").attr("disabled", false);
            $("#logPodList").attr("disabled", false);
            $("#logLevel").attr("disabled", false);
            $("#firstDiv").removeClass("on_log");
            $("#log-content").append("<span class='line' style='color: #e63757;'>========== Elasticsearch Log Stop ==========</span> <br>");
            downScroll("log-content");
            eventName = $("#optionPipe option:selected").val();
            var eventKey = eventName;
            delete events[eventKey];
        }
    }
    
    function drawLog(responseData){
        for(idx in responseData){
            $("#log-content").append("<span class='line'>" + responseData[idx] + "</span> <br>");
        }
        downScroll("log-content");
    }
    
    function downScroll(element){
        var content = document.getElementById(element);
        content.scrollTop = content.scrollHeight;
    }
    
    function sseStop() {
        eventName = $("#optionPipe option:selected").val();
        var eventKey = eventName;
        console.log("sseStop eventKey :: "+eventKey);
        var event = events[eventKey];
        if (event === undefined) {
            /*if(langType == "ko"){
                toastr["info"]("존재 하지 않는 로그입니다.");
            }else{
                toastr["info"]("Log does not exist.");
            }*/
            return;
        }
        SSE_LOG.stop(event);
        delete events[eventKey];
        /*if(langType == "ko"){
            toastr["success"]("로그가 중지 되었습니다.");
        }else{
            toastr["success"]("Log stopped.");
        }*/
        $("#startBtn").attr("disabled", false);
        $("#stopBtn").attr("disabled", true);
        $("#optionPipe").attr("disabled", false);
        $("#logPodList").attr("disabled", false);
        $("#logLevel").attr("disabled", false);
        $("#firstDiv").removeClass("on_log");
    }
    
    /**************************************
     * Public 함수
     * ************************************/
     
    logMonitoring.sseStart = function(){
        sseStart();
    }
    
    logMonitoring.stopLog = function(){
        sseStop();
    }
     
     logMonitoring.getPods = function(obj){
        getPods(obj);
    }
     
    logMonitoring.init = function () {
        setOptions();
    }
    return logMonitoring;
}) (window.logMonitoring || {}, $);