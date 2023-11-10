$(document).ready(function () {
    document.addEventListener("dragstart", function(event) {
      event.dataTransfer.setData("dataId", event.target.id);
      event.dataTransfer.setData("dataName", event.target.name);
      event.dataTransfer.setData("dataValue", event.target.value);
    });
    
    var drop = document.getElementById('drawItemDiv');
    drop.ondragover = function(event) {
      event.preventDefault();
    };
    drop.ondrop = function(e) {
        var id = e.dataTransfer.getData('dataId');
        var name = e.dataTransfer.getData('dataName');
        var val = e.dataTransfer.getData('dataValue');
        pipeline.drawPod(id,name,val,e.layerX,e.layerY);
    };
    pipeline.init();
});
 
window.onload = function () {
    
};

var pipeline = (function (pipeline, $) {
    /**************************************
     * Private 함수
     * ************************************/
    
    function podObjectSetting(){
        var param = {
            nodeAlias: nodeAlias,
            nodeIpAddress : nodeIpAddress
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/setting";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            for(idx in response){
                var podCategory = response[idx].category;
                var podName = response[idx].podName;
                var podImage = response[idx].image;
                var podSchema = response[idx].schema;
                var appendHtml = "";
                var appendDivId = "";
                if(podCategory == "protocol"){
                    appendDivId = "protocolPodDiv";
                    appendHtml += '<button class="btn btn-outline-primary mr-1 mb-1 rounded-pill draggable" style="margin-right:10px;" type="button" draggable="true" ';
                }else if(podCategory == "processor"){
                    appendDivId = "processorPodDiv";
                    appendHtml += '<button class="btn btn-outline-warning mr-1 mb-1 rounded-pill draggable" style="margin-right:10px;" type="button" draggable="true" ';
                }else if(podCategory == "sender"){
                    appendDivId = "senderPodDiv";
                    appendHtml += '<button class="btn btn-outline-success mr-1 mb-1 rounded-pill draggable" style="margin-right:10px;" type="button" draggable="true" ';
                }
                appendHtml += '     name="'+podCategory+'" id="'+podName+'" value="'+podSchema+'|'+podImage+'">';
                appendHtml += '    <span class="fas fa-plus mr-1" data-fa-transform="shrink-3"></span>  '+podName;
                appendHtml += '</button>';
                $("#"+appendDivId).append(appendHtml);
            }
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("파드 정보 오류.");
            }else{
                toastr["error"]("pod setting error.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    function checkAppName(podAppName){
        var param = {
            nodeAlias: nodeAlias,
            nodeIpAddress : nodeIpAddress,
            pipeName : pipeName,
            podAppName : podAppName
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/duplicate";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(undefined != response.overlap){
                if(langType == "ko"){
                    toastr["error"]("중복된 앱 이름입니다. .");
                }else{
                    toastr["error"]("Duplicate App name.");
                }
            }else{
                var podAppId = $("#podAppId").val();
                var podAppType = $("#podAppType").val();
                var podAppValue = $("#podAppValue").val();
                var podAppX = Number($("#podAppX").val());
                var podAppY = Number($("#podAppY").val());
                draw.makePodDiv(podAppId,podAppType,podAppValue,podAppX,podAppY,podAppName);
                $('#podAppModal').modal('hide');
            }
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("앱 이름 중복확인 오류.");
            }else{
                toastr["error"]("app name check error.");
            }
            
        };
        ajaxWrapper.callAjax(option);
    }

    /**************************************
     * Public 함수
     * ************************************/
    
    pipeline.drawPod = function(id, name,val,x,y){
        if(langType == "ko"){
            $("#podAppModalLabel").html("파드 오브젝트 정보");
        }else{
            $("#podAppModalLabel").html("Pod Object Info");
        }
        
        $("#podAppId").val(id);
        $("#podAppType").val(name);
        $("#podAppValue").val(val);
        $("#podAppX").val(x);
        $("#podAppY").val(y);
        $("#podAppName").val("");
        $('#podAppModal').modal('show');
    };
    
    pipeline.appModalAfter = function(){
        var podAppName = removeSpace($("#podAppName").val());
        if(!isDefined(podAppName)){
            if(langType == "ko"){
                toastr["warning"]("앱 이름을 입력해 주세요.");
            }else{
                toastr["warning"]("App Name is required.");
            }
            $("#podAppName").val("");
        }else{
            checkAppName(podAppName);
        }
    };
    
    pipeline.showAndhideArea = function(id){
        if(document.querySelector("#span_"+id).classList.contains("fa-plus")){
            document.getElementById("div_"+id).style.display = "";
            document.getElementById("span_"+id).classList.remove("fa-plus");
            document.getElementById("span_"+id).classList.add("fa-minus");
        }else{
            document.getElementById("div_"+id).style.display = "none";
            document.getElementById("span_"+id).classList.remove("fa-minus");
            document.getElementById("span_"+id).classList.add("fa-plus");
        }
    };
    
    pipeline.init = function () {
        podObjectSetting();
        localize();
    };
    
    return pipeline;
}) (window.pipeline || {}, $);