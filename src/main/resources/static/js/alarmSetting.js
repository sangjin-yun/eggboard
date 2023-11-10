window.onload = function () {
      alarmSetting.init(); // DB 설정값 호출
};

var alarmSetting = (function (alarmSetting, $) {
    /**************************************
     * Private 함수
     * ************************************/
    
    function getOnCueSetting(){
         var selectNode = $("#nodeList option:selected").val();
        $.ajax({
            url: "/api/notice/config/"+selectNode,
            success: function (result) {
                var data = result.data;
                var cpuSlider = $("#oncueCpuThreshol").data("ionRangeSlider");
                var memorySlider = $("#oncueMemThreshol").data("ionRangeSlider");
                var diskSlider = $("#oncueDiskThreshol").data("ionRangeSlider");
                var threshol;
                var usingMax = 0;
                $("#input_storagePeriod").val("");
                $("#input_storageSize").val("");
                $("#nodeSeqPeriod").val("");
                $("#nodeSeqSize").val("");
                $("#storagePeriod").prop("checked", false);
                $("#input_storagePeriod").attr("readonly",false);
                $("#storageSize").prop("checked", false);
                $("#input_storageSize").attr("readonly",false);
                $("#usingNow").html("0");
                $("#usingMax").html("0");
                $("#usingBox").css("width","0%");
                $("#nodeSeqLow").val("");
                $("#nodeSeqHigh").val("");
                $("#nodeSeqStage").val("");
                $("#nodeSeqInterval").val("");
                /*
                $("#input_watermarkLow").val("");
                $("#input_watermarkHigh").val("");
                $("#input_floodStage").val("");
                $("#input_checkInterval").val("");
                */
                if(data.length > 0){
                    for(idx in data){
                        threshol = data[idx]["measure"];
                        if(data[idx]["target"] === 'CPU'){
                            $("#nodeSeqCpu").val(data[idx]["seq"]);
                            cpuSlider.update({
                                from: threshol
                            });
                        }else if(data[idx]["target"] === 'MEMORY'){
                            $("#nodeSeqMemory").val(data[idx]["seq"]);
                            memorySlider.update({
                                from: threshol
                            });
                        }else if(data[idx]["target"] === 'DISK'){
                            $("#nodeSeqDisk").val(data[idx]["seq"]);
                            diskSlider.update({
                                from: threshol
                            });
                        }else if(data[idx]["target"] === "PERIOD"){
                            $("#nodeSeqPeriod").val(data[idx]["seq"]);
                            if(threshol > 0){
                                $("#storagePeriod").prop("checked", false);
                                $("#input_storagePeriod").attr("readonly",false);
                                $("#input_storagePeriod").val(threshol);
                            }else{
                                $("#input_storagePeriod").val("");
                                $("#storagePeriod").prop("checked", true);
                                $("#input_storagePeriod").attr("readonly",true);
                            }
                        }else if(data[idx]["target"] === "SIZE"){
                            $("#nodeSeqSize").val(data[idx]["seq"]);
                            if(threshol > 0){
                                usingMax = threshol;
                                $("#usingMax").html(threshol);
                                $("#storageSize").prop("checked", false);
                                $("#input_storageSize").attr("readonly",false);
                                $("#input_storageSize").val(threshol);
                            }else{
                                $("#usingMax").html("Unlimited");
                                $("#usingBox").css("width","100%");
                                $("#input_storageSize").val("");
                                $("#storageSize").prop("checked", true);
                                $("#input_storageSize").attr("readonly",true);
                            }
                        }/*else if(data[idx]["target"] === "LOW"){
                            $("#nodeSeqLow").val(data[idx]["seq"]);
                            $("#input_watermarkLow").val(threshol);
                        }else if(data[idx]["target"] === "HIGH"){
                            $("#nodeSeqHigh").val(data[idx]["seq"]);
                            $("#input_watermarkHigh").val(threshol);
                        }else if(data[idx]["target"] === "STAGE"){
                            $("#nodeSeqStage").val(data[idx]["seq"]);
                            $("#input_floodStage").val(threshol);
                        }else if(data[idx]["target"] === "INTERVAL"){
                            $("#nodeSeqInterval").val(data[idx]["seq"]);
                            $("#input_checkInterval").val(threshol);
                        }*/
                    }
                }else{
                    $("#nodeSeqCpu").val("");
                    $("#nodeSeqMemory").val("");
                    $("#nodeSeqDisk").val("");
                    $("#nodeSeqPeriod").val("");
                    $("#nodeSeqSize").val("");
                    
                    $("#nodeSeqLow").val("");
                    $("#nodeSeqHigh").val("");
                    $("#nodeSeqStage").val("");
                    $("#nodeSeqInterval").val("");
                    /*$("#input_watermarkLow").val("");
                    $("#input_watermarkHigh").val("");
                    $("#input_floodStage").val("");
                    $("#input_checkInterval").val("");*/
                    
                    $("#storagePeriod").prop("checked", false);
                    $("#input_storagePeriod").attr("readonly",false);
                    $("#input_storagePeriod").val("");
                    $("#storageSize").prop("checked", false);
                    $("#input_storageSize").attr("readonly",false);
                    $("#input_storageSize").val("");
                    cpuSlider.update({from: 0});
                    memorySlider.update({from: 0});
                    diskSlider.update({from: 0});
                }
                if(undefined != result.log && null != result.log){
                    getUsingSize(result.log,usingMax);
                }else{
                    if(langType == "ko"){
                        toastr["error"]("엘라스틱서치 연결 실패");
                    }else{
                        toastr["error"]("Elasticsearch Connect failure");
                    }
                }
            }
        });
    }
    
    function getUsingSize(log, usingMax){
        var sizeList = [];
        for (var i=0; i<log.length; i++) {
            sizeList.push(log[i].storeSize);
        }
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
        var gbValue = (totalSize / (1000 * 1000 * 1000)).toFixed(3);
        $("#usingNow").html(gbValue);
        if(usingMax > 0){
            var boxWidth = ((gbValue/usingMax)*100);
            $("#usingBox").css("width",boxWidth+"%");
        }
    }
    
    function saveAlarmSetting(){
        var alias = $("#nodeList option:selected").val();
        var seqCpu = $("#nodeSeqCpu").val();
        var seqMemory = $("#nodeSeqMemory").val();
        var seqDisk = $("#nodeSeqDisk").val();
        var seqPeriod = $("#nodeSeqPeriod").val();
        var seqSize = $("#nodeSeqSize").val();
        
        var seqLow = $("#nodeSeqLow").val();
        var seqHigh = $("#nodeSeqHigh").val();
        var seqStage = $("#nodeSeqStage").val();
        var seqInterval = $("#nodeSeqInterval").val();
        
        var fromCpu = $("#oncueCpuThreshol").data("ionRangeSlider").result.from;
        var fromMemory = $("#oncueMemThreshol").data("ionRangeSlider").result.from;
        var fromDisk = $("#oncueDiskThreshol").data("ionRangeSlider").result.from;
        var fromPeriod = $("#input_storagePeriod").val();
        var fromSize = $("#input_storageSize").val();
        
        //var fromLow = $("#input_watermarkLow").val();
        //var fromHigh = $("#input_watermarkHigh").val();
        //var fromStage = $("#input_floodStage").val();
        //var fromInterval = $("#input_checkInterval").val();
        
        if($("#storagePeriod").prop("checked")){fromPeriod = 0;}
        if($("#storageSize").prop("checked")){fromSize = 0;}
        
        
        var option = deepExtend(ajaxOptions);
        option.URL = "/api/notice/config";
        option.PARAM = JSON.stringify([
                                                    {"seq": seqCpu, "alias" : alias, "target" : "CPU", "measure" : fromCpu}
                                                     , {"seq": seqMemory, "alias" : alias, "target" : "MEMORY", "measure" : fromMemory}
                                                     , {"seq": seqDisk, "alias" : alias, "target" : "DISK", "measure" : fromDisk}
                                                     , {"seq": seqPeriod, "alias" : alias, "target" : "PERIOD", "measure" : fromPeriod}
                                                     , {"seq": seqSize, "alias" : alias, "target" : "SIZE", "measure" : fromSize}
                                                     //, {"seq": seqLow, "alias" : alias, "target" : "LOW", "measure" : fromLow}
                                                     //, {"seq": seqHigh, "alias" : alias, "target" : "HIGH", "measure" : fromHigh}
                                                     //, {"seq": seqStage, "alias" : alias, "target" : "STAGE", "measure" : fromStage}
                                                     //, {"seq": seqInterval, "alias" : alias, "target" : "INTERVAL", "measure" : fromInterval}
                                                     ]);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "post";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("설정값이 저장되었습니다.");
            }else{
                toastr["success"]("Setting Save.");
            }
            getOnCueSetting()
        };
        option.ERROR_CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["error"]("오류발생");
            }else{
                toastr["error"]("Error");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    function checkValidation(){
        var check1 = false;
        var check2 = false;
        
        if($("#storagePeriod").prop("checked")){
            check1 = true;
        }else{
            if($("#input_storagePeriod").val() != '' && $("#input_storagePeriod").val() > 0){
                check1 = true;
            }else{
                toastr["warning"]("Please enter the storage period.");
                $("#input_storagePeriod").val("");
            }
        }
        
        if($("#storageSize").prop("checked")){
            check2 = true;
        }else{
            if($("#input_storageSize").val() != '' && $("#input_storageSize").val() > 0){
                check2 = true;
            }else{
                toastr["warning"]("Please enter the storage size limit.");
                $("#input_storageSize").val("");
            }
        }
        
        /*
        var check3 = false;
        var check4 = false;
        var check5 = false;
        var check6 = false;
        
        if($("#input_watermarkLow").val() != '' && $("#input_watermarkLow").val() > 0){
            check3 = true;
        }else{
            toastr["warning"]("Please enter the Watermark Low.");
            $("#input_watermarkLow").val("");
        }
        
        if($("#input_watermarkHigh").val() != '' && $("#input_watermarkHigh").val() > 0){
            check4 = true;
        }else{
            toastr["warning"]("Please enter the Watermark High.");
            $("#input_watermarkHigh").val("");
        }
        
        if($("#input_floodStage").val() != '' && $("#input_floodStage").val() > 0){
            check5 = true;
        }else{
            toastr["warning"]("Please enter the Flood Stage.");
            $("#input_floodStage").val("");
        }
        
        if($("#input_checkInterval").val() != '' && $("#input_checkInterval").val() > 9){
            check6 = true;
        }else{
            toastr["warning"]("Please enter the Check Interval.\n This value minimum 10 Seconds");
            $("#input_checkInterval").val("");
        }
        */
        
        //if(check1 && check2 && check3 && check4 && check5 && check6){
        if(check1 && check2){
            return true;
        }else{
            return false;
        }
        
    }
    
    /**************************************
     * Public 함수
     * ************************************/
     
     // OnCue 선택에 따른 CPU, Memory, Disk 값 셋팅
     alarmSetting.changeOnCue = function(){
        getOnCueSetting();
    }
    
    // Setting Save Func
    alarmSetting.saveAlarmSetting = function(){
        if(checkValidation()){
            saveAlarmSetting();
        }
    }
    
    alarmSetting.limitCheck = function(obj){
        if($(obj).prop("checked")){
            $("#input_"+obj.id).attr("readonly",true);
            $("#input_"+obj.id).val("");
        }else{
            $("#input_"+obj.id).attr("readonly",false);
        }
    }
     
    alarmSetting.showAndhideArea = function(id){
        if($("#span_"+id).hasClass("fa-plus")){
            $("#div_"+id).css("display","");
            $("#span_"+id).removeClass("fa-plus");
            $("#span_"+id).addClass("fa-minus");
        }else{
            $("#div_"+id).css("display","none");
            $("#span_"+id).removeClass("fa-minus");
            $("#span_"+id).addClass("fa-plus");
        }
    }
     
    // DB 설정값 셋팅 
    alarmSetting.init = function () {
        $("#oncueCpuThreshol").ionRangeSlider({
            type: "single",
            min: 0,
            max: 100,
            from: 0,
            grid: true,
            postfix: ''
        });
        $("#oncueMemThreshol").ionRangeSlider({
            type: "single",
            min: 0,
            max: 100,
            from: 0,
            grid: true,
            postfix: ''
        });
        $("#oncueDiskThreshol").ionRangeSlider({
            type: "single",
            min: 0,
            max: 100,
            from: 0,
            grid: true,
            postfix: ''
        });
        getOnCueSetting();
        localize();
    }
    return alarmSetting;
}) (window.alarmSetting || {}, $);