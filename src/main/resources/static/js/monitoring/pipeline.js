$(document).ready(function () {
    
});

window.onload = function () {
      pipeline.init();
};

var pipeline = (function (pipeline, $) {
    var connectIp;
    
    var startPod = [];
    var stopPod = [];
    
    var pipeAndPod = [];
    
    /**************************************
     * Private 함수
     * ************************************/
    function getPipeline(){
        $.ajax({
            url: "/api/node/" + nodeId + "/pipeline",
            success: function (response) {
                var result = response.data.data;
                
                result = result.sort((a, b) => a.pipename.toLowerCase() < b.pipename.toLowerCase() ? -1 : 1);
                
                $("#drawArea").empty();
                var html = "";
                for(var i=0;i<result.length;i++){
                    var pipeName = result[i].pipename;
                    if(result[i].pods){
                    html += '<div class="card" style="margin-bottom: 10px;" id="parent_'+pipeName+'">';
                    html += '   <div class="card-body overflow-hidden p-lg-6" style="padding: 1rem !important;">';
                    html += '       <div class="row align-items-center">';
                    /* pipe top start */
                    html += '           <div class="card-header" style="padding: 0 20px 0px 20px;">';
                    html += '               <div class ="col-auto align-self-center">';
                    var onStatus = 0; // On
                    var offStatus = 0; // Off
                    for(var q=0;q<result[i].pods.length;q++){
                        var statusChk = result[i].pods[q].status;
                        if(statusChk == 1){
                            onStatus++;
                        }else if(statusChk == 2){
                            offStatus++;
                        }
                    }
                    
                    pipeAndPod.push({"pipeName":pipeName, "podList" : result[i].pods});
                    
                    if(onStatus == result[i].pods.length){
                    html += '                   <h5 class="mb-0" style="display: inline-block;" id="status_'+pipeName+'"><span class="dot bg-success"></span>'+pipeName+'</h5>';
                    }else if(offStatus == result[i].pods.length){
                    html += '                   <h5 class="mb-0" style="display: inline-block;" id="status_'+pipeName+'"><span class="dot bg-danger"></span>'+pipeName+'</h5>';
                    }else{
                    html += '                   <h5 class="mb-0" style="display: inline-block;" id="status_'+pipeName+'"><span class="dot bg-warning"></span>'+pipeName+'</h5>';
                    }
                    html += '                   <div style="display: inline-block; margin-left:10px;">';
                    html += '                       <button class="btn btn-outline-success mr-1 mb-1 btn-sm" type="button" value="'+pipeName+'" id="start_'+pipeName+'" onclick="pipeline.pipeControl(this);"><span class="fas fa-play"></span></button>';
                    html += '                       <button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" value="'+pipeName+'" id="stop_'+pipeName+'" style="margin-left:5px;" onclick="pipeline.pipeControl(this);"><span class="fas fa-stop"></span></button>';
                    html += '                       <button class="btn btn-outline-warning mr-1 mb-1 btn-sm" type="button" value="'+pipeName+'" id="restart_'+pipeName+'" style="margin-left:5px;" onclick="pipeline.pipeControl(this);"><span class="fas fa-redo-alt"></span></button>';
                    
                    if(userRole[0].authority != "ROLE_USER"){
                        html += '<button class="btn btn-outline-secondary mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" value="'+pipeName+'" onclick="pipeline.podDeleteModal(this.value);">';
                        html += '<span class="far fa-trash-alt"></span>';
                        html += '</button>';
                    }
                    
                    html += '                   </div>';
                    html += '                   <a href="javascript:pipeline.showAndhideArea('+i+');" style="float: right;">';
                    html += '                       <span class="fas fa-minus mr-1" id="pipeSpan_'+i+'" data-fa-transform="shrink-3"></span>';
                    html += '                   </a>';
                    html += '               </div>';
                    html += '           </div>';
                    /* pipe top end */
                     
                    html += '           <div id="pipeDiv_'+i+'" style="display: flex;">';
                    html += '               <div class="table-responsive scrollbar" style="display: inline-block; padding: 10px; width: 45%;">';
                    html += '                   <div class ="col-auto align-self-center"><h5 class="mb-0" chkI18n="table.pods"></h5></div>';
                    html += '                   <table class="table overflow-hidden">';
                    html += '                       <thead>';
                    html += '                           <tr class="btn-reveal-trigger">';
                    html += '                               <th scope="col" style="width:40%" chkI18n="table.username"></th>';
                    html += '                               <th scope="col" chkI18n="table.queuename"></th>';
                    html += '                               <th scope="col" style="width:13%" chkI18n="table.datacount"></th>';
                    html += '                               <th scope="col" style="width:23%" chkI18n="table.control"></th>';
                    html += '                           </tr>';
                    html += '                       </thead>';
                    html += '                       <tbody>';
                    /* Pod List Start */
                    var podList = result[i].pods;
                    podList = podList.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
                    for(var x=0;x<podList.length;x++){
                        var podQueueOtherList = [];
                        var podName = podList[x].name;
                        var podCategory = podList[x].category;
                        var podStatus = podList[x].status;
                        var podMount = podList[x].mount;
                        var podCpu = podList[x].cpu;
                        var podMemory = podList[x].memory;
                        var podLabels = podList[x].labels;
                    html += '                           <tr id="podTr_'+pipeName+'_'+podName+'">';
                    html += '                               <td id="tdStatus_'+pipeName+'_'+podName+'">';
                        if(podStatus == 1){
                    html += '                                   <span class="dot bg-success" id="status_'+pipeName+'_'+podName+'"></span>'+podName+' ';
                    html += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
                    html += '                                       title="<b>Label Info</b><br/><span>app : '+podLabels.app+'</span><br/><span>category : '+podLabels.category+'</span><br/><span>pipe : '+podLabels.pipe+'</span>">';
                    html += '                                       <span class="fas fa-info-circle"></span>';
                    html += '                                   </button>';
                        }else if(podStatus == 2){
                    html += '                                   <span class="dot bg-danger" id="status_'+pipeName+'_'+podName+'"></span>'+podName+' ';
                        }else{
                    html += '                                   <div class="spinner-border2 text-success" role="status" id="status_'+pipeName+'_'+podName+'"></div>'+podName+' ';
                        }
                    html += '                               </td>';
                        /* Pod Queue List Start */
                        var podQueueList = podList[x].queue; // Array [{"name" : "modbus-q1","count" : 1},{...},{...}]
                        var podQueueCount = [];
                        if(podQueueList != null){
                            for(var y=0;y<podQueueList.length;y++){
                                podQueueCount.push(podQueueList[y]);
                            }
                            podQueueCount.sort(function(a, b) {
                              return b.count - a.count;
                            });
                            var topQueue = false;
                            for(var y=0;y<podQueueCount.length;y++){
                                var queueName = podQueueCount[y].name.replace(":","");
                                if(queueName){
                                    var queueCount = podQueueCount[y].count;
                                    var queueStatus = podQueueCount[y].status;
                                    if(topQueue == false){
                                        topQueue = true;
                                        if("running" == queueStatus){
                            html += '                               <td id="qname_'+pipeName+'_'+podName+'"><span class="dot bg-success"></span>'+queueName+'</td>';
                                        }else{
                            html += '                               <td id="qname_'+pipeName+'_'+podName+'"><span class="dot bg-danger"></span>'+queueName+'</td>';
                                        }
                            html += '                               <td id="qcount_'+pipeName+'_'+podName+'">';
                            html += '                                   <span>'+queueCount+'</span>';
                                    if(podQueueCount.length > 1){
                                        html += '                                   <button class="btn btn-outline-info mr-1 mb-1 btn-ssm" type="button" value="'+pipeName+'_'+podName+'" onclick="pipeline.showQInfo(this.value,'+y+');">';
                                        html += '                                   <span class="fas fa-plus mr-1" id="qspan_'+pipeName+'_'+podName+'_'+y+'" data-fa-transform="shrink-3"></span>';
                                        html += '                                   </button>';
                                    }
                            html += '                               </td>';
                                    }else{
                                        var podQueueOther = {"name" : queueName, "count" : queueCount, "status" : queueStatus};
                                        podQueueOtherList.push(podQueueOther);
                                    }
                                }
                            }
                        }else{
                            html += '                               <td id="qname_'+pipeName+'_'+podName+'"></td>';
                            html += '                               <td id="qcount_'+pipeName+'_'+podName+'">';
                            html += '                                   <span></span>';
                            html += '                               </td>';
                        }
                        if(podStatus == 1){
                    html += '                               <td>';
                    html += '                                   <button class="btn btn-outline-success mr-1 mb-1 btn-ssm2" type="button" disabled value="'+podName+'" id="start_'+pipeName+'_'+podName+'" onclick="pipeline.podControl(this);">';
                    html += '                                       <span class="fas fa-play"></span>';
                    html += '                                   </button>';
                    html += '                                   <button class="btn btn-outline-danger mr-1 mb-1 btn-ssm2" type="button" style="margin-left:3px;" value="'+podName+'" id="stop_'+pipeName+'_'+podName+'" onclick="pipeline.podControl(this);">';
                    html += '                                       <span class="fas fa-stop"></span>';
                    html += '                                   </button>';
                    html += '                                   <button class="btn btn-outline-warning mr-1 mb-1 btn-ssm2" type="button" style="margin-left:3px;" value="'+podName+'" id="restart_'+pipeName+'_'+podName+'" onclick="pipeline.rePodControl(this);">';
                    html += '                                       <span class="fas fa-redo-alt"></span>';
                    html += '                                   </button>';
                    html += '                               </td>';
                        }else if(podStatus == 2){
                    html += '                               <td>';
                    html += '                                   <button class="btn btn-outline-success mr-1 mb-1 btn-ssm2" type="button" value="'+podName+'" id="start_'+pipeName+'_'+podName+'" onclick="pipeline.podControl(this);">';
                    html += '                                       <span class="fas fa-play"></span>';
                    html += '                                   </button>';
                    html += '                                   <button class="btn btn-outline-danger mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="stop_'+pipeName+'_'+podName+'" onclick="pipeline.podControl(this);">';
                    html += '                                       <span class="fas fa-stop"></span>';
                    html += '                                   </button>';
                    html += '                                   <button class="btn btn-outline-warning mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="restart_'+pipeName+'_'+podName+'" onclick="pipeline.rePodControl(this);">';
                    html += '                                       <span class="fas fa-redo-alt"></span>';
                    html += '                                   </button>';
                    html += '                               </td>';
                        }else{
                    html += '                               <td>';
                    html += '                                   <button class="btn btn-outline-success mr-1 mb-1 btn-ssm2" type="button" disabled value="'+podName+'" id="start_'+pipeName+'_'+podName+'" onclick="pipeline.podControl(this);">';
                    html += '                                       <span class="fas fa-play"></span>';
                    html += '                                   </button>';
                    html += '                                   <button class="btn btn-outline-danger mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="stop_'+pipeName+'_'+podName+'" onclick="pipeline.podControl(this);">';
                    html += '                                       <span class="fas fa-stop"></span>';
                    html += '                                   </button>';
                    html += '                                   <button class="btn btn-outline-warning mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="restart_'+pipeName+'_'+podName+'" onclick="pipeline.rePodControl(this);">';
                    html += '                                       <span class="fas fa-redo-alt"></span>';
                    html += '                                   </button>';
                    html += '                               </td>';
                        }
                        /* Pod Queue List End */
                    html += '                           </tr>';
                        for(var y=0;y<podQueueOtherList.length;y++){
                            var queueName = podQueueOtherList[y].name;
                            var queueCount = podQueueOtherList[y].count;
                            var queueStatus = podQueueOtherList[y].status;
                    html += '                           <tr class="qlist_'+pipeName+'_'+podName+'" style="display: none;">';
                    html += '                               <td></td>';
                            if("running" == queueStatus){
                                html += '                               <td><span class="dot bg-success"></span>'+queueName+'</td>';
                            }else{
                                html += '                               <td><span class="dot bg-danger"></span>'+queueName+'</td>';
                            }
                    html += '                               <td>'+queueCount+'</td>';
                    html += '                               <td></td>';
                    html += '                           </tr>';
                        }
                    }
                    /* Pod List End */
                    html += '                       </tbody>';
                    html += '                   </table>';
                    html += '               </div>';
                    
                    html += '               <div class="table-responsive scrollbar" style="display: inline-block; padding: 10px; width:65%;">';
                    html += '                   <div class ="col-auto align-self-center" style="margin-bottom: 20px;">';
                    html += '                       <h5 class="mb-0" chkI18n="table.connection"></h5>';
                    html += '                   </div>';
                    html += '                   <ul class="nav nav-tabs connTab" role="tablist">';
                    var firstTab = true;
                    for(var x=0;x<podList.length;x++){
                        var podName = podList[x].name;
                        var podCategory = podList[x].category;
                        if(podCategory != "processing" && podName.search("processing") == -1){
                    html += '                       <li class="nav-item" id="connInfo-'+pipeName+'-'+podName+'">';
                            if(firstTab == true){
                                firstTab = false;
                    html += '                           <a class="nav-link active" data-toggle="tab" href="#pill-tab-'+pipeName+'-'+podName+'" role="tab" aria-controls="pill-tab-'+pipeName+'-'+podName+'" aria-selected="true">'+podName+'</a>';
                            }else{
                    html += '                           <a class="nav-link" data-toggle="tab" href="#pill-tab-'+pipeName+'-'+podName+'" role="tab" aria-controls="pill-tab-'+pipeName+'-'+podName+'" aria-selected="false">'+podName+'</a>';
                            }
                    html += '                       </li>';
                        }
                    }
                    html += '                   </ul>';
                    
                    html += '                   <div class="tab-content border p-3 mt-3" >';
                    var firstTabCont = true;
                    for(var x=0;x<podList.length;x++){
                        var podName = podList[x].name;
                        var podMount = podList[x].mount;
                        var podStatus = podList[x].status;
                        var podCpu = podList[x].cpu;
                        if(null == podCpu){podCpu == 0;}
                        var podMemory = podList[x].memory;
                        if(null == podMemory){podMemory == 0;}
                        var podCategory = podList[x].category;
                        var podVersion = podList[x].version;
                        if(podCategory != "processing" && podName.search("processing") == -1){
                            if(firstTabCont == true){
                                firstTabCont = false;
                    html += '                       <div class="tab-pane fade show active" id="pill-tab-'+pipeName+'-'+podName+'" role="tabpanel">';
                            }else{
                    html += '                       <div class="tab-pane fade" id="pill-tab-'+pipeName+'-'+podName+'" role="tabpanel">';
                            }
                        var podDeviceList = podList[x].devices; // Array
                    html += '                           <h5 class="mb-0" style="display:inline-block;" chkI18n="table.devices"></h5>';
                    if(null != podDeviceList){
                        html += '                           <h5 class="mb-0" style="display:inline-block;">( '+podDeviceList.length+' )';
                    }else{
                        html += '                           <h5 class="mb-0" style="display:inline-block;">( 0 )';
                    }
                    if(null != podDeviceList && podDeviceList.length > 3){
                        html += '                               <button class="btn btn-outline-info mr-1 mb-1 btn-sm" type="button" style="margin-left: 5px;" value="'+pipeName+'_'+podName+'" onclick="pipeline.makeShowDevice(this.value);">';
                        html += '                                   <span class="fas fa-plus mr-1"  data-fa-transform="shrink-3" id="deviceSpan_'+pipeName+'_'+podName+'"></span>';
                        html += '                               </button>';
                    }
                    html += '                           </h5>';
                    
                    html += '                           <table class="table table-striped overflow-hidden">';
                    html += '                               <thead style="display: table; width: 100%;">';
                    html += '                                   <tr class="btn-reveal-trigger">';
                    html += '                                       <th style="width:22%;" chkI18n="table.username"></th>';
                    html += '                                       <th style="width:20%;" chkI18n="table.protocol"></th>';
                    html += '                                       <th style="width:10%;" chkI18n="table.version"></th>';
                    html += '                                       <th style="width:28%;" chkI18n="table.url"></th>';
                    html += '                                       <th style="width:9%;" chkI18n="table.conn"></th>';
                    html += '                                       <th style="width:10%;" chkI18n="table.disconn"></th>';
                    html += '                                   </tr>';
                    html += '                               </thead>';
                    html += '                               <tbody style="display: block; height: 145px; overflow: auto;" id="deviceTbody_'+pipeName+'_'+podName+'">';
                    if(null != podDeviceList){
                        for(var z=0;z<podDeviceList.length;z++){
                            var deviceName = podDeviceList[z].name;
                            var deviceProtocol = podDeviceList[z].protocol;
                            var deviceVersion = podDeviceList[z].version;
                            var deviceUrl = podDeviceList[z].url;
                            var deviceConn = podDeviceList[z].connected;
                            var deviceDisconn = podDeviceList[z].disconnected;
                    html += '                                   <tr style="display: table; width: 100%;">';
                    html += '                                       <td style="width:22%;">'+deviceName+'</td>';
                    html += '                                       <td style="width:20%;">'+podCategory+'</td>';
                    html += '                                       <td style="width:10%;">'+podVersion+'</td>';
                    html += '                                       <td style="width:28%;">'+deviceUrl+'</td>';
                    html += '                                       <td style="width:9%;" id="deviceConn_'+pipeName+'_'+podName+'_'+deviceName+'">'+deviceConn+'</td>';
                    html += '                                       <td style="width:10%;" id="deviceDisconn_'+pipeName+'_'+podName+'_'+deviceName+'">'+deviceDisconn+'</td>';
                    html += '                                   </tr>';
                        }
                    }else{
                        html += '                                   <tr style="display: table; width: 100%;">';
                        if(langType == "ko"){
                            html += '                                       <td colspan="6" style="text-align:center;">장치정보가 없습니다.</td>';
                        }else{
                            html += '                                       <td colspan="6" style="text-align:center;">No device information.</td>';
                        }
                        html += '                                   </tr>';
                    }
                    html += '                               </tbody>';
                    html += '                           </table>';
                    
                    html += '                           <div style="display: flex; margin-top:10px;">';
                    html +='<table class="table table-sm mb-0">';
                    html +='    <tbody>';
                    
                    html +='        <tr>';
                    html +='            <td style="vertical-align: middle;"><h5 class="text-600 mb-0 ms-2" chkI18n="button.mounting"></h5></td>';
                    html +='            <td colspan="3" id="mountInfo_'+pipeName+'_'+podName+'">';
                    if(null != podMount && "" != podMount){
                    html +='                <div style="display: flex;" title="'+pipeName+'_'+podName+'" onclick="pipeline.copyAction(this);">';
                    html += '                   <input class="form-control is-valid" style="border: none;" type="text" value="'+podMount+'" id="mount_'+pipeName+'_'+podName+'" readonly>';
                    html += '               </div>';
                    }else{
                        html +='                <div style="display: flex;">';
                        if(langType == "ko"){
                            html += '                   <input class="form-control is-invalid" style="border: none;" type="text" value="마운트 정보가 없습니다." readonly>';
                        }else{
                            html += '                   <input class="form-control is-invalid" style="border: none;" type="text" value="No Mount information." readonly>';
                        }
                        html += '               </div>';
                    }
                    html +='            </td>';
                    html +='        </tr>';
                    
                    html +='        <tr>';
                    html +='            <td class="py-3" style="width: 13%;">';
                    html +='                <div class="d-flex align-items-center">';
                    html +='                    <img src="/image/cpu.png" alt="" width="30"><h5 class="text-600 mb-0 ms-2" chkI18n="table.cpu"></h5>'; 
                    html +='                </div>';
                    html +='            </td>'; 
                    if(podStatus == 1){
                        html +='            <td class="py-3" style="width: 35%;">';
                        html +='                <div class="col-auto" style="display: inline-block; margin-top: 3px;">';
                        html +='                    <h5 class="text-primary mb-0" style="color:#55BCB0 !important;" id="resourceCpu_'+pipeName+'_'+podName+'">'+podCpu.toFixed(2)+'%</h5>';
                        html +='                </div>';
                        html +='                <div class="col-auto" style="display: inline-block; width: 70%; margin-left: 10px;">';
                        html +='                    <div class="progress rounded-pill" style="height: 0.5625rem;">';
                        html +='                        <div class="progress-bar bg-success rounded-pill" role="progressbar" id="resourceCpuBar_'+pipeName+'_'+podName+'" style="width: '+podCpu.toFixed(2)+'%; background-color: #55BCB0 !important;" aria-valuemin="0" aria-valuemax="100"></div>';
                        html +='                    </div>';
                        html +='                </div>';
                        html +='            </td>';
                        html +='            <td class="py-3" style="width: 15%;">';
                        html +='                <div class="d-flex align-items-center">';
                        html +='                    <img src="/image/memory.png" alt="" width="30"><h5 class="text-600 mb-0 ms-2" chkI18n="table.memory"></h5>'; 
                        html +='                </div>';
                        html +='            </td>'; 
                        html +='            <td class="py-3" style="width: 35%;">';
                        html +='                <div class="col-auto" style="display: inline-block; margin-top: 3px;">';
                        html +='                    <h5 class="text-primary mb-0" style="color:#EC568D !important;" id="resourceMem_'+pipeName+'_'+podName+'">'+podMemory.toFixed(2)+'%</h5>';
                        html +='                </div>';
                        html +='                <div class="col-auto" style="display: inline-block; width: 70%; margin-left: 10px;">';
                        html +='                    <div class="progress rounded-pill" style="height: 0.5625rem;">';
                        html +='                        <div class="progress-bar bg-success rounded-pill" role="progressbar" id="resourceMemBar_'+pipeName+'_'+podName+'" style="width: '+podMemory.toFixed(2)+'%; background-color: #EC568D !important;" aria-valuemin="0" aria-valuemax="100"></div>';
                        html +='                    </div>';
                        html +='                </div>';
                        html +='            </td>';
                    }else{
                        html +='            <td class="py-3" style="width: 35%;">';
                        html +='                <div class="col-auto" style="display: inline-block; margin-top: 3px;">';
                        html +='                    <h5 class="text-primary mb-0" style="color:#55BCB0 !important;" id="resourceCpu_'+pipeName+'_'+podName+'">0%</h5>';
                        html +='                </div>';
                        html +='                <div class="col-auto" style="display: inline-block; width: 70%; margin-left: 10px;">';
                        html +='                    <div class="progress rounded-pill" style="height: 0.5625rem;">';
                        html +='                        <div class="progress-bar bg-success rounded-pill" role="progressbar" id="resourceCpuBar_'+pipeName+'_'+podName+'" style="width: 0%; background-color: #55BCB0 !important;" aria-valuemin="0" aria-valuemax="100"></div>';
                        html +='                    </div>';
                        html +='                </div>';
                        html +='            </td>';
                        html +='            <td class="py-3" style="width: 15%;">';
                        html +='                <div class="d-flex align-items-center">';
                        html +='                    <img src="/image/memory.png" alt="" width="30"><h5 class="text-600 mb-0 ms-2" chkI18n="table.memory"></h5>'; 
                        html +='                </div>';
                        html +='            </td>'; 
                        html +='            <td class="py-3" style="width: 35%;">';
                        html +='                <div class="col-auto" style="display: inline-block; margin-top: 3px;">';
                        html +='                    <h5 class="text-primary mb-0" style="color:#EC568D !important;" id="resourceMem_'+pipeName+'_'+podName+'">0%</h5>';
                        html +='                </div>';
                        html +='                <div class="col-auto" style="display: inline-block; width: 70%; margin-left: 10px;">';
                        html +='                    <div class="progress rounded-pill" style="height: 0.5625rem;">';
                        html +='                        <div class="progress-bar bg-success rounded-pill" role="progressbar" id="resourceMemBar_'+pipeName+'_'+podName+'" style="width: 0%; background-color: #EC568D !important;" aria-valuemin="0" aria-valuemax="100"></div>';
                        html +='                    </div>';
                        html +='                </div>';
                        html +='            </td>';
                    }
                    html +='        </tr>';
                    html +='    </tbody>';
                    html +='</table>';
                    html += '                           </div>';
                    
                    
                    html += '                       </div>';
                        }
                    }
                    html += '                   </div>';
                    
                    html += '               </div>';
                    
                    html += '           </div>';
                    
                    html += '       </div>';
                    html += '   </div>';
                    html += '</div>';
                    }
                }
                $("#drawArea").append(html);
                localize();
                $('.connTab a').on('click', function (e) {
                  e.preventDefault()
                  $(this).tab('show')
                });
                $('.podTooltip').tooltip({ boundary: 'window' , html : true});
                connectIp = response.data.nodeIpAddress;
                connectSSE(connectIp);
                $('#mask').remove();
            }
            ,error : function(result){
                console.log(result);
                if(langType == "ko"){
                    toastr["error"]("서버 연결중 오류가 발생하였습니다.<br/>REST API 1.2를 확인해 주세요.");
                }else{
                    toastr["error"]("An error occurred while connecting to the server.<br/>Please check REST API 1.2");
                }
                callServerCheck();
            }
        });
        
    }
    
    function callServerCheck(){
        setTimeout(function() {
            /*
            if(langType == "ko"){
                toastr["warning"]("재연결 시도중...");
            }else{
                toastr["warning"]("Reconnecting...");
            }
            */
          getPipeline();
        }, 1000);
    }
    function connectSSE(ip){
        var url = "/sse/api?nodeId="+nodeId+"&type=nodeInfo&apiNo=2";
        var eventSource = new EventSource(url);
        eventSource.onopen = function(){
            /*
            if(langType == "ko"){
                toastr["success"]("파이프라인 SSE 연결 성공");
            }else{
                toastr["success"]("Pipeline SSE Connect Success");
            }
            */
        };
        eventSource.onmessage = function(response){
           if(response.data != null && response.data != ''){
                var responseData = response.data;
                var responseDataCut = responseData.substr(6);
                var responseDataJson = JSON.parse(responseDataCut);
                updatePipeline(responseDataJson.data);
            }
        };
        eventSource.onerror = function(){
            console.log("An error occurred while connecting to the server.<br/>Please check REST API 2.3");
            /*
               if(langType == "ko"){
                    toastr["error"]("서버 연결중 오류가 발생하였습니다.<br/>REST API 2.3를 확인해 주세요.");
                }else{
                    toastr["error"]("An error occurred while connecting to the server.<br/>Please check REST API 2.3");
                }
                */
               eventSource.close();
               callServerSSECheck();
       };
    }
    
    function callServerSSECheck(){
        setTimeout(function() {
            /*
            if(langType == "ko"){
                toastr["warning"]("재연결 시도중...");
            }else{
                toastr["warning"]("Reconnecting...");
            }
            */
          connectSSE(connectIp);
        }, 3000);
    }
    
    function updatePipeline(responseData){
        var result = responseData.sort((a, b) => a.pipename.toLowerCase() < b.pipename.toLowerCase() ? -1 : 1);
        for(var i=0;i<result.length;i++){
            var pipeName = result[i].pipename; // 파이프라인 이름
            if(result[i].pods){
            /* 파이프라인 상태 = 파드의 종합상태 수정 시작 */
            var onStatus = 0; // On
            var offStatus = 0; // Off
            for(var q=0;q<result[i].pods.length;q++){
                var statusChk = result[i].pods[q].status;
                if(statusChk == 1){
                    onStatus++;
                }else if(statusChk == 2){
                    offStatus++;
                }
            }
            var pipelineStatusId = "status_"+pipeName;
            if(onStatus == result[i].pods.length){
                $("#"+pipelineStatusId).html('<span class="dot bg-success"></span>'+pipeName);
            }else if(offStatus == result[i].pods.length){
                $("#"+pipelineStatusId).html('<span class="dot bg-danger"></span>'+pipeName);
            }else{
                $("#"+pipelineStatusId).html('<span class="dot bg-warning"></span>'+pipeName);
            }
            /* 파이프라인 상태 = 파드의 종합상태 수정 종료 */
            var podList = result[i].pods; // 해당 파이프라인의 파드 리스트
            for(var x=0;x<podList.length;x++){
                var podName = podList[x].name; // 파드 이름
                var podStatus = podList[x].status; // 파드 상태
                var podLabels = podList[x].labels;
                var podCategory = podList[x].category;
                var podVersion = podList[x].version;
                var podMount = podList[x].mount;
                /* 파드 상태 수정 시작 */
                var podTdStatusId = "tdStatus_"+pipeName+"_"+podName;
                $("#"+podTdStatusId).empty();
                var podTdHtml = "";
                if(podStatus == 1){
                    
                    for( var p = 0; p < startPod.length; p++){ 
                        if ( startPod[p] == podName) { 
                            startPod.splice(p, 1); 
                        }
                    }
                    
                    var checkNowStartPod = false;
                    for( var p = 0; p < stopPod.length; p++){ 
                        if ( stopPod[p] == podName) { 
                            checkNowStartPod = true;
                            podTdHtml += '<div class="spinner-border2 text-danger" role="status" id="status_'+pipeName+'_'+podName+'"></div>'+podName+' ';
                        }
                    }
                    if(!checkNowStartPod){
                        podTdHtml += '<span class="dot bg-success" id="status_'+pipeName+'_'+podName+'"></span>'+podName+' ';
                        podTdHtml += '<button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
                        if(podLabels != null){
                            podTdHtml += 'title="<b>Label Info</b><br/><span>app : '+podLabels.app+'</span><br/><span>category : '+podLabels.category+'</span><br/><span>pipe : '+podLabels.pipe+'</span>">';
                        }else{
                            podTdHtml += 'title="<b>Label Info</b><br/><span>app : none</span><br/><span>category : none</span><br/><span>pipe : none</span>">';
                        }
                        podTdHtml += '<span class="fas fa-info-circle"></span>';
                        podTdHtml += '</button>';
                    }
                    
                    
                }else if(podStatus == 2){
                    for( var p = 0; p < stopPod.length; p++){ 
                        if ( stopPod[p] == podName) { 
                            stopPod.splice(p, 1); 
                        }
                    }
                    
                    var checkNowStopPod = false;
                    for( var p = 0; p < startPod.length; p++){ 
                        if ( startPod[p] == podName) { 
                            checkNowStopPod = true;
                            podTdHtml += '<div class="spinner-border2 text-success" role="status" id="status_'+pipeName+'_'+podName+'"></div>'+podName+' ';
                        }
                    }
                    if(!checkNowStopPod){
                        podTdHtml += '<span class="dot bg-danger" id="status_'+pipeName+'_'+podName+'"></span>'+podName+' ';
                    }
                }else{
                    podTdHtml += '<div class="spinner-border2 text-success" role="status" id="status_'+pipeName+'_'+podName+'"></div>'+podName+' ';
                }
                
                $("#"+podTdStatusId).html(podTdHtml);
                /* 파드 상태 수정 종료 */
                var podQueueList = podList[x].queue; // 파드 큐 리스트
                if(podQueueList != null){
                    for(var p=0;p<podQueueList.length;p++){
                        if(!isDefined(podQueueList[p].name)){
                            podQueueList = podQueueList.splice(p+1);
                        }
                    }
                }
                /* 파드 큐 정렬 시작 DESC */
                var podQueueOtherList = [];
                var podQueueCount = [];
                var qlistClass = "qlist_"+pipeName+"_"+podName;
                if(podQueueList != null){
                    for(var y=0;y<podQueueList.length;y++){
                        podQueueCount.push(podQueueList[y]);
                    }
                    if(podQueueList.length > 1){
                        podQueueCount = podQueueCount.sort(function(a, b) {
                            return b.count - a.count;
                        });
                    }
                     
                    /* 파드 큐 정렬 종료 DESC */
                    var topQueue = false;
                    var showQStatus = false; // 현재 큐 리스트를 보고있는지 판단
                    
                    if ( $("."+qlistClass).css('display') !== 'none' ) {
                        showQStatus = true;
                    }
                    for(var y=0;y<podQueueCount.length;y++){
                        
                        var queueName = podQueueCount[y].name.replace(":",""); // 큐 이름
                        var queueCount = podQueueCount[y].count; // 큐 카운트
                        var queueStatus = podQueueCount[y].status; // 큐 상태
                        if(!topQueue){
                            topQueue = true;
                            var qnameTdId = "qname_"+pipeName+"_"+podName;
                            var qcountTdId = "qcount_"+pipeName+"_"+podName;
                            if("running" == queueStatus){
                                $("#"+qnameTdId).html('<span class="dot bg-success"></span>'+queueName);
                            }else{
                                $("#"+qnameTdId).html('<span class="dot bg-danger"></span>'+queueName);
                            }
                            $("#"+qcountTdId).empty();
                            var qcountTdHtml = "";
                            qcountTdHtml += '<span>'+queueCount+'</span>';
                            if(podQueueCount.length > 1){
                                qcountTdHtml += '<button class="btn btn-outline-info mr-1 mb-1 btn-ssm" type="button" style="margin-left: 5px;" value="'+pipeName+'_'+podName+'" onclick="pipeline.showQInfo(this.value,'+y+');">';
                                if(showQStatus){
                                    qcountTdHtml += '<span class="fas fa-minus mr-1" id="qspan_'+pipeName+'_'+podName+'_'+y+'" data-fa-transform="shrink-3"></span>';
                                }else{
                                    qcountTdHtml += '<span class="fas fa-plus mr-1" id="qspan_'+pipeName+'_'+podName+'_'+y+'" data-fa-transform="shrink-3"></span>';
                                }
                                qcountTdHtml += '</button>';
                            }
                            $("#"+qcountTdId).html(qcountTdHtml);
                        }else{
                            var podQueueOther = {"name" : queueName, "count" : queueCount, "status" : queueStatus};
                            podQueueOtherList.push(podQueueOther);
                        }
                    }
                }else{
                    var qnameTdId = "qname_"+pipeName+"_"+podName;
                    var qcountTdId = "qcount_"+pipeName+"_"+podName;
                    $("#"+qnameTdId).html("");
                    $("#"+qcountTdId).empty();
                }
                
                $("."+qlistClass).remove(); // 더보기 큐 리스트 제거
                var podTrId = "podTr_"+pipeName+"_"+podName;
                var podTrHtml = "";
                for(var y=0;y<podQueueOtherList.length;y++){
                    var queueName = podQueueOtherList[y].name;
                    var queueCount = podQueueOtherList[y].count;
                    var queueStatus = podQueueOtherList[y].status;
                    if(showQStatus){
                        podTrHtml += '<tr class="qlist_'+pipeName+'_'+podName+'" style="">';
                    }else{
                        podTrHtml += '<tr class="qlist_'+pipeName+'_'+podName+'" style="display: none;">';
                    }
                    podTrHtml += '<td></td>';
                    if("running" == queueStatus){
                    podTrHtml += '<td><span class="dot bg-success"></span>'+queueName+'</td>';
                    }else{
                    podTrHtml += '<td><span class="dot bg-danger"></span>'+queueName+'</td>';
                    }
                    podTrHtml += '<td>'+queueCount+'</td>';
                    podTrHtml += '<td></td>';
                    podTrHtml += '</tr>';
                }
                if(podQueueOtherList.length > 0){
                    $("#"+podTrId).after(podTrHtml);
                }
                
                var podStartBtnId = "start_"+pipeName+"_"+podName;
                var podStopBtnId = "stop_"+pipeName+"_"+podName;
                var podRestartBtnId = "restart_"+pipeName+"_"+podName;
                
                var checkBtnPod = false;
                for( var p = 0; p < startPod.length; p++){ 
                    if ( startPod[p] == podName) { 
                        checkBtnPod = true;
                    }
                }
                for( var p = 0; p < stopPod.length; p++){ 
                    if ( stopPod[p] == podName) { 
                        checkBtnPod = true;
                    }
                }
                
                if(checkBtnPod){
                    $("#"+podStartBtnId).attr("disabled", true);
                    $("#"+podStopBtnId).attr("disabled", true);
                    $("#"+podRestartBtnId).attr("disabled", true);
                    //$("."+qlistClass).remove(); // 더보기 큐 리스트 제거
                }else{
                    if(podStatus == 1){
                        $("#"+podStartBtnId).attr("disabled", true);
                        $("#"+podStopBtnId).attr("disabled", false);
                        $("#"+podRestartBtnId).attr("disabled", false);
                    }else if(podStatus == 2){
                        $("#"+podStartBtnId).attr("disabled", false);
                        $("#"+podStopBtnId).attr("disabled", true);
                        $("#"+podRestartBtnId).attr("disabled", true);
                    }else{
                        $("#"+podStartBtnId).attr("disabled", true);
                        $("#"+podStopBtnId).attr("disabled", true);
                        $("#"+podRestartBtnId).attr("disabled", true);
                    }
                }
                
                var podDeviceList = podList[x].devices; // 파드에 연결된 디바이스 리스트
                var podDeviceTrId =  "deviceTbody_"+pipeName+"_"+podName;
                $("#"+podDeviceTrId).html("");
                var deviceHtml = "";
                if(null != podDeviceList){
                    for(var z=0;z<podDeviceList.length;z++){
                        var deviceName = podDeviceList[z].name;
                        var deviceUrl = podDeviceList[z].url;
                        var deviceConn = podDeviceList[z].connected;
                        var deviceDisconn = podDeviceList[z].disconnected;
                        deviceHtml += '                                   <tr style="display: table; width: 100%;">';
                        deviceHtml += '                                       <td style="width:22%;">'+deviceName+'</td>';
                        deviceHtml += '                                       <td style="width:20%;">'+podCategory+'</td>';
                        deviceHtml += '                                       <td style="width:10%;">'+podVersion+'</td>';
                        deviceHtml += '                                       <td style="width:28%;">'+deviceUrl+'</td>';
                        deviceHtml += '                                       <td style="width:9%;" id="deviceConn_'+pipeName+'_'+podName+'_'+deviceName+'">'+deviceConn+'</td>';
                        deviceHtml += '                                       <td style="width:10%;" id="deviceDisconn_'+pipeName+'_'+podName+'_'+deviceName+'">'+deviceDisconn+'</td>';
                        deviceHtml += '                                   </tr>';
                    }
                }else{
                    deviceHtml += '                                   <tr style="display: table; width: 100%;">';
                    if(langType == "ko"){
                        deviceHtml += '                                       <td colspan="6" style="text-align:center;">장치정보가 없습니다.</td>';
                    }else{
                        deviceHtml += '                                       <td colspan="6" style="text-align:center;">No device information.</td>';
                    }
                    deviceHtml += '                                   </tr>';
                }
                $("#"+podDeviceTrId).html(deviceHtml);
                
                var mountInfoId = "mountInfo_"+pipeName+"_"+podName;
                $("#"+mountInfoId).html("");
                var mountHtml = "";
                if(null != podMount && "" != podMount){
                    mountHtml +='                <div style="display: flex;" title="'+pipeName+'_'+podName+'" onclick="pipeline.copyAction(this);">';
                    mountHtml += '                   <input class="form-control is-valid" style="border: none;" type="text" value="'+podMount+'" id="mount_'+pipeName+'_'+podName+'" readonly>';
                    mountHtml += '               </div>';
                }else{
                    mountHtml +='                <div style="display: flex;">';
                    if(langType == "ko"){
                        mountHtml += '                   <input class="form-control is-invalid" style="border: none;" type="text" value="마운트 정보가 없습니다." readonly>';
                    }else{
                        mountHtml += '                   <input class="form-control is-invalid" style="border: none;" type="text" value="No Mount information." readonly>';
                    }
                    mountHtml += '               </div>';
                }
                $("#"+mountInfoId).html(mountHtml);
                
                var podCpu = podList[x].cpu;
                var podMemory = podList[x].memory;
                var podResourceCpuId = "resourceCpu_"+pipeName+"_"+podName;
                var podResourceCpuBarId = "resourceCpuBar_"+pipeName+"_"+podName;
                var podResourceMemId = "resourceMem_"+pipeName+"_"+podName;
                var podResourceMemBarId = "resourceMemBar_"+pipeName+"_"+podName;
                if(null == podCpu){
                    $("#"+podResourceCpuId).html("0%");
                    $("#"+podResourceCpuBarId).css("width","0%");
                }else{
                    $("#"+podResourceCpuId).html(podCpu.toFixed(2)+"%");
                    $("#"+podResourceCpuBarId).css("width",podCpu.toFixed(2)+"%");
                }
                if(null == podMemory){
                    $("#"+podResourceMemId).html("0%");
                    $("#"+podResourceMemBarId).css("width","0%");
                }else{
                    $("#"+podResourceMemId).html(podMemory.toFixed(2)+"%");
                    $("#"+podResourceMemBarId).css("width",podMemory.toFixed(2)+"%");
                }
                
            }
            }
        }
        $('.podTooltip').tooltip({ boundary: 'window' , html : true});
        $('.bs-tooltip-end').remove();
        $('.tooltip-inner').remove();
        $('.tooltip-arrow').remove();
    }
    
    function podStatucCheck(podName, commandType){
        if(commandType == "start"){
            startPod.push(podName);
        }else if(commandType == "stop"){
            stopPod.push(podName);
        }
    }
    
    function controlTypeCheck(id, val){
        var commandType = id.split("_")[0];
        var pipeCheckName = val;
        
        for(var i=0;i<pipeAndPod.length;i++){
            if(pipeCheckName == pipeAndPod[i].pipeName){
                var podList = pipeAndPod[i].podList;
                for(var x=0;x<podList.length;x++){
                    var clickId = commandType+"_"+pipeCheckName+"_"+podList[x].name;
                    $("#"+clickId).trigger("click");
                }
            }
        }
        
    }
    
    function podDeleteModal(pipeName){
        $("#podDeletePipeName").val(pipeName);
        var title = pipeName+" pipeline pod delete";
        if(langType == "ko"){
            title = pipeName+" 파이프라인 파드 삭제";
        }
        for(var i=0;i<pipeAndPod.length;i++){
            if(pipeAndPod[i] && pipeName == pipeAndPod[i].pipeName){
                let podSelectList = document.querySelector("#podSelectList");
                var podList = pipeAndPod[i].podList;
                $(podSelectList).empty();
                for(var x=0;x<podList.length;x++){
                    var objOption = document.createElement("option");
                    objOption.text = podList[x].name;
                    objOption.value = podList[x].name;
                    podSelectList.options.add(objOption);
                }
            }
        }
        $('#podDeleteModal').modal('show');
        $("#podDeleteTitle").html(title);
    }
    
    function deletePodAfterFunc(podName, pipeName){
        for(var i=0;i<pipeAndPod.length;i++){
            if(pipeAndPod[i] && pipeName == pipeAndPod[i].pipeName){
                var podList = pipeAndPod[i].podList;
                const idx = podList.findIndex(function(item) {return item.name == podName})
                if (idx > -1) podList.splice(idx, 1)
                
                if(podList.length < 1){
                    delete pipeAndPod[i];
                    $("#parent_"+pipeName).remove();
                }
            }
        }
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    
    pipeline.deletePod = function(){
        var podName = $("#podSelectList").val();
        var pipeName = $("#podDeletePipeName").val();
        
        var param = {
            nodeId : nodeId,
            podName: podName,
            pipeName : pipeName
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/delete";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "DELETE";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("파드가 삭제 되었습니다.");
            }else{
                toastr["success"]("Pod has been deleted.");
            }
            deletePodAfterFunc(podName, pipeName);
            $("#podTr_"+$("#podDeletePipeName").val()+"_"+$("#podSelectList").val()).remove();
            $("#connInfo-"+$("#podDeletePipeName").val()+"-"+$("#podSelectList").val()).remove();
            $("#pill-tab-"+$("#podDeletePipeName").val()+"-"+$("#podSelectList").val()).remove();
            $('#podDeleteModal').modal('hide');
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("서버 오류 발생");
            }else{
                toastr["error"]("Server Error.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    pipeline.showAndhideArea = function(pipeId){
        if($("#pipeSpan_"+pipeId).hasClass("fa-plus")){
            $("#pipeDiv_"+pipeId).css("display","flex");
            $("#pipeSpan_"+pipeId).removeClass("fa-plus");
            $("#pipeSpan_"+pipeId).addClass("fa-minus");
        }else{
            $("#pipeDiv_"+pipeId).css("display","none");
            $("#pipeSpan_"+pipeId).removeClass("fa-minus");
            $("#pipeSpan_"+pipeId).addClass("fa-plus");
        }
    }
    
    pipeline.showQInfo = function(val,count){
        var id = val+"_"+count;
        if($("#qspan_"+id).hasClass("fa-plus") ){
            $(".qlist_"+val).css("display","");
            $("#qspan_"+id).removeClass("fa-plus");
            $("#qspan_"+id).addClass("fa-minus");
        }else{
            $(".qlist_"+val).css("display","none");
            $("#qspan_"+id).addClass("fa-plus");
            $("#qspan_"+id).removeClass("fa-minus");
        }
    }
    
    pipeline.makeShowDevice = function(id){
        if( $("#deviceSpan_"+id).hasClass("fa-plus") ){
            $("#deviceTbody_"+id).css("height","auto");
            $("#deviceSpan_"+id).removeClass("fa-plus");
            $("#deviceSpan_"+id).addClass("fa-minus");
        }else{
            $("#deviceTbody_"+id).css("height","145px");
            $("#deviceSpan_"+id).addClass("fa-plus");
            $("#deviceSpan_"+id).removeClass("fa-minus");
        }
    }
     
     pipeline.copyAction = function(obj){
        var copyId = "mount_"+obj.title;
        copyToClipboard($("#"+copyId).val());
        if(langType == "ko"){
            toastr["success"]("복사 성공");
        }else{
            toastr["success"]("Copy Success");
        }
    }
    
    pipeline.podControl = function(obj){
        var podName = obj.value;
        var commandType = obj.id.split("_")[0];
        if(commandType == "restart"){
            commandType = "start";
        }
        
        var param = {
            nodeId : nodeId,
            podName: podName,
            command : commandType
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/control";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "PUT";
        option.CALLBACK = function (response) {
            var startBtnId = "start_"+obj.id.split("_")[1]+"_"+obj.id.split("_")[2];
            var stopBtnId = "stop_"+obj.id.split("_")[1]+"_"+obj.id.split("_")[2];
            var restartBtnId = "restart_"+obj.id.split("_")[1]+"_"+obj.id.split("_")[2];
            
            var tdStatusId = "tdStatus_"+obj.id.split("_")[1]+"_"+obj.id.split("_")[2];
            var pipeName = obj.id.split("_")[1];
            var podName = obj.id.split("_")[2];
            
            $("#"+startBtnId).attr("disabled", true);
            $("#"+stopBtnId).attr("disabled", true);
            $("#"+restartBtnId).attr("disabled", true);
            $("#"+tdStatusId).empty();
            var podTdHtml = "";
            if(commandType == "start"){
                podTdHtml += '<div class="spinner-border2 text-success" role="status" id="status_'+pipeName+'_'+podName+'"></div>'+podName+' ';
            }else if(commandType == "stop"){
                var qlistClass = "qlist_"+pipeName+"_"+podName;
                var qnameTdId = "qname_"+pipeName+"_"+podName;
                var qcountTdId = "qcount_"+pipeName+"_"+podName;
                $("#"+qnameTdId).html("");
                $("#"+qcountTdId).empty();
                $("."+qlistClass).remove(); // 더보기 큐 리스트 제거
                podTdHtml += '<div class="spinner-border2 text-danger" role="status" id="status_'+pipeName+'_'+podName+'"></div>'+podName+' ';
            }else{
                var qlistClass = "qlist_"+pipeName+"_"+podName;
                $("."+qlistClass).remove(); // 더보기 큐 리스트 제거
            }
            
            $("#"+tdStatusId).html(podTdHtml);
            
            podStatucCheck(podName,commandType);
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("서버 오류 발생");
            }else{
                toastr["error"]("Server Error.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    pipeline.rePodControl = function(obj){
        var podName = obj.value;
        var param = {
            nodeId : nodeId,
            podName: podName,
            command : "stop"
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/control";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "PUT";
        option.CALLBACK = function (response) {
            var startBtnId = "start_"+obj.id.split("_")[1]+"_"+obj.id.split("_")[2];
            var stopBtnId = "stop_"+obj.id.split("_")[1]+"_"+obj.id.split("_")[2];
            var restartBtnId = "restart_"+obj.id.split("_")[1]+"_"+obj.id.split("_")[2];
            
            var tdStatusId = "tdStatus_"+obj.id.split("_")[1]+"_"+obj.id.split("_")[2];
            var pipeName = obj.id.split("_")[1];
            var podName = obj.id.split("_")[2];
            
            $("#"+startBtnId).attr("disabled", true);
            $("#"+stopBtnId).attr("disabled", true);
            $("#"+restartBtnId).attr("disabled", true);
            $("#"+tdStatusId).empty();
            var qlistClass = "qlist_"+pipeName+"_"+podName;
            //$("."+qlistClass).remove(); // 더보기 큐 리스트 제거
            var podTdHtml = "";
            podTdHtml += '<div class="spinner-border2 text-danger" role="status" id="status_'+pipeName+'_'+podName+'"></div>'+podName+' ';
            $("#"+tdStatusId).html(podTdHtml);
            podStatucCheck(podName,"start");
            setTimeout(() => pipeline.podControl(obj), 2000);
            //pipeline.podControl(obj);
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("서버 오류 발생");
            }else{
                toastr["error"]("Server Error.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    pipeline.pipeControl = function(obj){
        controlTypeCheck(obj.id, obj.value);
    }
    
    pipeline.podDeleteModal = function(pipeName){
        podDeleteModal(pipeName);
    }
     
    pipeline.init = function () {
        LoadingWithMask();
        getPipeline();
    }
    return pipeline;
}) (window.pipeline || {}, $);