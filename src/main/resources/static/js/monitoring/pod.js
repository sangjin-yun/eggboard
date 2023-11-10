window.onload = function () {
      pod.init();
};

var pod = (function (pod, $) {
    var startPod = [];
    var stopPod = [];
    /**************************************
     * Private 함수
     * ************************************/
    function getPods(){
        $.ajax({
            url: "/api/node/" + nodeId + "/pipeline",
            success: function (response) {
                var result = response.data.data;
                $("#podTbody").empty();
                var html ="";
                var pipelines = [];
                for(var i=0;i<result.length;i++){
                    var pipeName = result[i].pipename; // 파이프라인 이름
                    pipelines.push(pipeName);
                    var podList = result[i].pods;
                    for(var x=0;x<podList.length;x++){
                        var podName = podList[x].name; // 파드 이름
                        var podStatus = podList[x].status; // 파드 상태
                        var podLabels = podList[x].labels;
                        var podCpu = podList[x].cpu;
                        var podMemory = podList[x].memory;
                        html += '<tr>';
                        html += '   <td>'+pipeName+'</td>';
                        if(podStatus == 1){
                            html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                            html += '       <span class="dot bg-success"></span>'+podName+' ';
                            html += '       <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
                            html += '       title="<b>Label Info</b><br/><span>app : '+podLabels.app+'</span><br/><span>category : '+podLabels.category+'</span><br/><span>pipe : '+podLabels.pipe+'</span>">';
                            html += '       <span class="fas fa-info-circle"></span>';
                            html += '       </button>';
                            html += '   </td>';
                            html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">'+podCpu+'</td>';
                            html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">'+podMemory+'</td>';
                            html += '   <td id="statusBtn_'+pipeName+'_'+podName+'"><button class="btn btn-falcon-success mr-1 mb-1 btn-ssm2" type="button" chkI18n="button.onStatus"></button></td>';
                            html += '   <td>';
                            html += '       <button class="btn btn-outline-success mr-1 mb-1 btn-ssm2" type="button" disabled value="'+podName+'" id="start_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                            html += '       <span class="fas fa-play"></span>';
                            html += '       </button>';
                            html += '       <button class="btn btn-outline-danger mr-1 mb-1 btn-ssm2" type="button" style="margin-left:3px;" value="'+podName+'" id="stop_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                            html += '       <span class="fas fa-stop"></span>';
                            html += '       </button>';
                            html += '       <button class="btn btn-outline-warning mr-1 mb-1 btn-ssm2" type="button" style="margin-left:3px;" value="'+podName+'" id="restart_'+pipeName+'_'+podName+'" onclick="pod.rePodControl(this);">';
                            html += '       <span class="fas fa-redo-alt"></span>';
                            html += '       </button>';
                            html += '   </td>';
                        }else if(podStatus == 2){
                            html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                            html += '       <span class="dot bg-danger"></span>'+podName+' ';
                            html += '   </td>';
                            html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">0</td>';
                            html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">0</td>';
                            html += '   <td id="statusBtn_'+pipeName+'_'+podName+'"><button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" type="button" chkI18n="button.offStatus"></button></td>';
                            html += '   <td>';
                            html += '       <button class="btn btn-outline-success mr-1 mb-1 btn-ssm2" type="button" value="'+podName+'" id="start_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                            html += '       <span class="fas fa-play"></span>';
                            html += '       </button>';
                            html += '       <button class="btn btn-outline-danger mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="stop_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                            html += '       <span class="fas fa-stop"></span>';
                            html += '       </button>';
                            html += '       <button class="btn btn-outline-warning mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="restart_'+pipeName+'_'+podName+'" onclick="pod.rePodControl(this);">';
                            html += '       <span class="fas fa-redo-alt"></span>';
                            html += '       </button>';
                            html += '   </td>';
                        }else{
                            html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                            html += '       <div class="spinner-border2 text-success" role="status"></div>'+podName+' ';
                            html += '   </td>';
                            html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">0</td>';
                            html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">0</td>';
                            html += '   <td id="statusBtn_'+pipeName+'_'+podName+'">';
                            html += '       <button class="btn btn-success btn-ssm2" type="button" disabled>';
                            html += '       <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                            html += '       Running...</button>';
                            html += '   </td>';
                            html += '   <td>';
                            html += '       <button class="btn btn-outline-success mr-1 mb-1 btn-ssm2" type="button" disabled value="'+podName+'" id="start_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                            html += '       <span class="fas fa-play"></span>';
                            html += '       </button>';
                            html += '       <button class="btn btn-outline-danger mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="stop_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                            html += '       <span class="fas fa-stop"></span>';
                            html += '       </button>';
                            html += '       <button class="btn btn-outline-warning mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="restart_'+pipeName+'_'+podName+'" onclick="pod.rePodControl(this);">';
                            html += '       <span class="fas fa-redo-alt"></span>';
                            html += '       </button>';
                            html += '   </td>';
                        }
                        html += '</tr>';
                    }
                }
                $("#podTbody").append(html);
                localize();
                settingPodsDatatable(pipelines);
                settingPodsChartList();
                connectSSE();
            }
            ,error : function(result){
                console.log(result);
                callServerCheck();
            }
        });
    }
    
    function callServerCheck(){
        setTimeout(function() {
          getPods();
        }, 1000);
    }
    
    var checkCountTerm = 0;
    
    function connectSSE(){
        var url = "/sse/api?nodeId="+nodeId+"&type=nodeInfo&apiNo=2";
        var eventSource = new EventSource(url);
        eventSource.onopen = function(){
            
        };
        eventSource.onmessage = function(response){
            if(response.data != null && response.data != ''){
                var responseData = response.data;
                var responseDataCut = responseData.substr(6);
                var responseDataJson = JSON.parse(responseDataCut);
                if(checkCountTerm > 4){
                    reDrawTable(responseDataJson.data);
                    checkCountTerm = 0;
                }else{
                    checkCountTerm++;
                }
                
                podChart.updataCharts(responseDataJson.data);
            }
        };
        eventSource.onerror = function(){
           console.log("An error occurred while connecting to the server.<br/>Please chec REST API 2.3");
           eventSource.close();
           callServerSSECheck();
       };
    }
    
    function callServerSSECheck(){
        setTimeout(function() {
          connectSSE();
        }, 1000);
    }
    
    function reDrawTable(responseData){
        var nowOrder = $('#podTable').DataTable().order();
        var orderColumn = nowOrder[0][0];
        var orderSort = nowOrder[0][1];
        var searchValue = $('#podTable_filter input').val();
        var selectBoxValue = $('#pipelineFilter option:selected').val();
        var showInfo = $("select[name=podTable_length]").val();
        var curPage = $('#podTable').DataTable().page.info().page;
        $('.bs-tooltip-end').remove();
        $('.tooltip-inner').remove();
        $('.tooltip-arrow').remove();
        
        $("#podTable").DataTable().destroy();
        
        var result = responseData;
        $("#podTbody").empty();
        var html ="";
        var pipelines = [];
        for(var i=0;i<result.length;i++){
            var pipeName = result[i].pipename; // 파이프라인 이름
            pipelines.push(pipeName);
            var podList = result[i].pods;
            for(var x=0;x<podList.length;x++){
                var podName = podList[x].name; // 파드 이름
                var podStatus = podList[x].status; // 파드 상태
                var podLabels = podList[x].labels;
                var podCpu = podList[x].cpu;
                var podMemory = podList[x].memory;
                html += '<tr>';
                html += '   <td>'+pipeName+'</td>';
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
                            html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                            html += '       <span class="dot bg-danger"></span>'+podName+' ';
                            html += '   </td>';
                            html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">0</td>';
                            html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">0</td>';
                            html += '   <td id="statusBtn_'+pipeName+'_'+podName+'">';
                            html += '       <button class="btn btn-danger btn-ssm2" type="button" disabled>';
                            html += '       <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                            html += '       Stopped...</button>';
                            html += '   </td>';
                            html += '   <td>';
                            html += '       <button class="btn btn-outline-success mr-1 mb-1 btn-ssm2" type="button" value="'+podName+'" id="start_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                            html += '       <span class="fas fa-play"></span>';
                            html += '       </button>';
                            html += '       <button class="btn btn-outline-danger mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="stop_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                            html += '       <span class="fas fa-stop"></span>';
                            html += '       </button>';
                            html += '       <button class="btn btn-outline-warning mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="restart_'+pipeName+'_'+podName+'" onclick="pod.rePodControl(this);">';
                            html += '       <span class="fas fa-redo-alt"></span>';
                            html += '       </button>';
                            html += '   </td>';
                        }
                    }
                    if(!checkNowStartPod){
                        html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                        html += '       <span class="dot bg-success"></span>'+podName+' ';
                        html += '       <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
                        if(podLabels != null){
                            html += '       title="<b>Label Info</b><br/><span>app : '+podLabels.app+'</span><br/><span>category : '+podLabels.category+'</span><br/><span>pipe : '+podLabels.pipe+'</span>">';
                        }else{
                            html += '       title="<b>Label Info</b><br/><span>app : none</span><br/><span>category : none</span><br/><span>pipe : none</span>">';
                        }
                        html += '       <span class="fas fa-info-circle"></span>';
                        html += '       </button>';
                        html += '   </td>';
                        html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">'+podCpu+'</td>';
                        html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">'+podMemory+'</td>';
                        html += '   <td id="statusBtn_'+pipeName+'_'+podName+'"><button class="btn btn-falcon-success mr-1 mb-1 btn-ssm2" type="button" chkI18n="button.onStatus"></button></td>';
                        html += '   <td>';
                        html += '       <button class="btn btn-outline-success mr-1 mb-1 btn-ssm2" type="button" disabled value="'+podName+'" id="start_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                        html += '       <span class="fas fa-play"></span>';
                        html += '       </button>';
                        html += '       <button class="btn btn-outline-danger mr-1 mb-1 btn-ssm2" type="button" style="margin-left:3px;" value="'+podName+'" id="stop_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                        html += '       <span class="fas fa-stop"></span>';
                        html += '       </button>';
                        html += '       <button class="btn btn-outline-warning mr-1 mb-1 btn-ssm2" type="button" style="margin-left:3px;" value="'+podName+'" id="restart_'+pipeName+'_'+podName+'" onclick="pod.rePodControl(this);">';
                        html += '       <span class="fas fa-redo-alt"></span>';
                        html += '       </button>';
                        html += '   </td>';
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
                            html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                            html += '       <span class="dot bg-success"></span>'+podName+' ';
                            html += '       <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
                            if(podLabels != null){
                                html += '       title="<b>Label Info</b><br/><span>app : '+podLabels.app+'</span><br/><span>category : '+podLabels.category+'</span><br/><span>pipe : '+podLabels.pipe+'</span>">';
                            }else{
                                html += '       title="<b>Label Info</b><br/><span>app : none</span><br/><span>category : none</span><br/><span>pipe : none</span>">';
                            }
                            html += '       <span class="fas fa-info-circle"></span>';
                            html += '       </button>';
                            html += '   </td>';
                            html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">0</td>';
                            html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">0</td>';
                            html += '   <td id="statusBtn_'+pipeName+'_'+podName+'">';
                            html += '       <button class="btn btn-success btn-ssm2" type="button" disabled>';
                            html += '       <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                            html += '       Running...</button>';
                            html += '   </td>';
                            html += '   <td>';
                            html += '       <button class="btn btn-outline-success mr-1 mb-1 btn-ssm2" type="button" disabled value="'+podName+'" id="start_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                            html += '       <span class="fas fa-play"></span>';
                            html += '       </button>';
                            html += '       <button class="btn btn-outline-danger mr-1 mb-1 btn-ssm2" type="button" style="margin-left:3px;" value="'+podName+'" id="stop_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                            html += '       <span class="fas fa-stop"></span>';
                            html += '       </button>';
                            html += '       <button class="btn btn-outline-warning mr-1 mb-1 btn-ssm2" type="button" style="margin-left:3px;" value="'+podName+'" id="restart_'+pipeName+'_'+podName+'" onclick="pod.rePodControl(this);">';
                            html += '       <span class="fas fa-redo-alt"></span>';
                            html += '       </button>';
                            html += '   </td>';
                        }
                    }
                    if(!checkNowStopPod){
                        html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                        html += '       <span class="dot bg-danger"></span>'+podName+' ';
                        html += '   </td>';
                        html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">0</td>';
                        html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">0</td>';
                        html += '   <td id="statusBtn_'+pipeName+'_'+podName+'"><button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" type="button" chkI18n="button.offStatus"></button></td>';
                        html += '   <td>';
                        html += '       <button class="btn btn-outline-success mr-1 mb-1 btn-ssm2" type="button" value="'+podName+'" id="start_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                        html += '       <span class="fas fa-play"></span>';
                        html += '       </button>';
                        html += '       <button class="btn btn-outline-danger mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="stop_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                        html += '       <span class="fas fa-stop"></span>';
                        html += '       </button>';
                        html += '       <button class="btn btn-outline-warning mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="restart_'+pipeName+'_'+podName+'" onclick="pod.rePodControl(this);">';
                        html += '       <span class="fas fa-redo-alt"></span>';
                        html += '       </button>';
                        html += '   </td>';
                    }
                }else{
                    html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                    html += '       <div class="spinner-border2 text-success" role="status"></div>'+podName+' ';
                    html += '   </td>';
                    html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">0</td>';
                    html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">0</td>';
                    html += '   <td id="statusBtn_'+pipeName+'_'+podName+'">';
                    html += '       <button class="btn btn-success btn-ssm2" type="button" disabled>';
                    html += '       <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                    html += '       Running...</button>';
                    html += '   </td>';
                    html += '   <td>';
                    html += '       <button class="btn btn-outline-success mr-1 mb-1 btn-ssm2" type="button" disabled value="'+podName+'" id="start_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                    html += '       <span class="fas fa-play"></span>';
                    html += '       </button>';
                    html += '       <button class="btn btn-outline-danger mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="stop_'+pipeName+'_'+podName+'" onclick="pod.podControl(this);">';
                    html += '       <span class="fas fa-stop"></span>';
                    html += '       </button>';
                    html += '       <button class="btn btn-outline-warning mr-1 mb-1 btn-ssm2" type="button" disabled style="margin-left:3px;" value="'+podName+'" id="restart_'+pipeName+'_'+podName+'" onclick="pod.rePodControl(this);">';
                    html += '       <span class="fas fa-redo-alt"></span>';
                    html += '       </button>';
                    html += '   </td>';
                }
                html += '</tr>';
            }
        }
        $("#podTbody").append(html);
        localize();
        reSettingPodsDatatable(pipelines, orderColumn, orderSort, searchValue, selectBoxValue, showInfo, curPage);
    }
    
    function reSettingPodsDatatable(pipelines, orderColumn, orderSort, searchValue, selectBoxValue, showInfo, curPage){
        $('.podTooltip').tooltip({ boundary: 'window' , html : true});
        
        if(langType == "ko"){
            $("#podTable").DataTable({
                order: [ [ orderColumn, orderSort ] ],
                "columnDefs": [
                    { "orderable": true, "width": "20%", "targets": [0,1] },
                    { "orderable": true, "targets": [2,3,4]},
                    { "orderable": false, "targets": [5]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "파드 이름 : "
                 },
                 language : lang_ko,
                 "pageLength": showInfo
            }); 
        }else{
            $("#podTable").DataTable({
                order: [ [ orderColumn, orderSort ] ],
                "columnDefs": [
                    { "orderable": true, "width": "20%", "targets": [0,1] },
                    { "orderable": true, "targets": [2,3,4]},
                    { "orderable": false, "targets": [5]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "Pod Name : "
                 },
                 language : lang_en,
                 "pageLength": showInfo
            }); 
        }
        
        var html ="";
        html += '<select id="pipelineFilter" class="form-control">';
        if(langType == "ko"){
            html += '<option value="">파이프라인 목록</option>';
        }else{
            html += '<option value="" selected>Pipelines</option>';
        }
        for (var i=0; i<pipelines.length; i++) {
                html += '<option value="'+pipelines[i]+'">'+pipelines[i]+'</option>';
        }
        html += '</select>';
        
        var table = $('#podTable').DataTable();
        
        $('#podTable_filter input').unbind().bind('keyup', function () {
            table.column(1).search(this.value).draw();
        });
    
        $("#podTable_filter.dataTables_filter").append(html);
    
        $('#pipelineFilter').on('change', function () {
            table.column(0).search(this.value).draw();
        });
        table.column(1).search(searchValue).draw();
        table.column(0).search(selectBoxValue).draw();
        $('#pipelineFilter').val(selectBoxValue);
        $('#podTable_filter input').val(searchValue);
        $("select[name=podTable_length]").val(showInfo);
        //table.order( [ orderColumn, orderSort ]).draw();
        table.page(curPage).draw('page');
    }
    
    function settingPodsDatatable(pipelines){
        $('.podTooltip').tooltip({ boundary: 'window' , html : true});
        
        if(langType == "ko"){
            $("#podTable").DataTable({
                order: [ [ 0, "asc" ] ],
                "columnDefs": [
                    { "orderable": true, "width": "20%", "targets": [0,1] },
                    { "orderable": true, "targets": [2,3,4]},
                    { "orderable": false, "targets": [5]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "파드 이름 : "
                 },
                 language : lang_ko
            }); 
        }else{
            $("#podTable").DataTable({
                order: [ [ 0, "asc" ] ],
                "columnDefs": [
                    { "orderable": true, "width": "20%", "targets": [0,1] },
                    { "orderable": true, "targets": [2,3,4]},
                    { "orderable": false, "targets": [5]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "Pod Name : "
                 },
                 language : lang_en
            }); 
        }
        var html ="";
        html += '<select id="pipelineFilter" class="form-control">';
        if(langType == "ko"){
            html += '<option value="">파이프라인 목록</option>';
        }else{
            html += '<option value="" selected>Pipelines</option>';
        }
        for (var i=0; i<pipelines.length; i++) {
                html += '<option value="'+pipelines[i]+'">'+pipelines[i]+'</option>';
        }
        html += '</select>';
        
        var table = $('#podTable').DataTable();
    
        $('#podTable_filter input').unbind().bind('keyup', function () {
            table.column(1).search(this.value).draw();
        });
    
        $("#podTable_filter.dataTables_filter").append(html);
    
        $('#pipelineFilter').on('change', function () {
            table.column(0).search(this.value).draw();
        });
    }
    
    function settingPodsChartList(){
        $.ajax({
            url: "/api/node/" + nodeId + "/pods",
            success: function (data) {
                $("#podChartTbody").empty();
                var html ="";
                 
                for (var i=0; i<data.length; i++) {
                    html += '<tr>';
                    html += '    <td>'+data[i].alias+'</td>';
                    html += '    <td>'+data[i].name+'</td>';
                    html += '    <td><button class="btn btn-falcon-info mr-1 mb-1 btn-ssm2" type="button" onclick="pod.checkLimit(this);" title="'+data[i].name+'" value="'+data[i].podId+'" chkI18n="table.select"></button></td>';
                    html += '</tr>';
                }
                $("#podChartTbody").append(html);
                settingPodsChartDatatable();
                localize();
            }
        });
    }
    
    function settingPodsChartDatatable(){
        if(langType == "ko"){
            $("#podChartTable").DataTable({
                order: [ [ 0, "asc" ] ],
                "columnDefs": [
                    { "orderable": true, "width": "40%", "targets": [0,1] },
                    { "orderable": false, "targets": [2]}
                ],
                autoWidth: false,
                info : false,
                lengthChange: false,
                "oLanguage": {
                   "sSearch": "파드 이름 : "
                 },
                 language : lang_ko
            }); 
        }else{
            $("#podChartTable").DataTable({
                order: [ [ 0, "asc" ] ],
                "columnDefs": [
                    { "orderable": true, "width": "40%", "targets": [0,1] },
                    { "orderable": false, "targets": [2]}
                ],
                autoWidth: false,
                info : false,
                lengthChange: false,
                "oLanguage": {
                   "sSearch": "Pod Name : "
                 },
                 language : lang_en
            }); 
        }
        
        var tableChart = $('#podChartTable').DataTable();
        
        $("#podChartTable_filter.dataTables_filter").prepend($("#chartPipelineFilter"));
        
        $('#chartPipelineFilter').on('change', function () {
            tableChart.column(0).search(this.value).draw();
        });
    }
    
    function podStatucCheck(podName, commandType){
        if(commandType == "start"){
            startPod.push(podName);
        }else if(commandType == "stop"){
            stopPod.push(podName);
        }
    }
    
    /**************************************
     * Public 함수
     * ************************************/
     
    pod.showAndhideArea = function(id){
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
    
    pod.podSelectModal = function(){
        $.ajax({
            url: "/api/node/" + nodeId + "/pods",
            success: function (data) {
                $("#chartPodList").empty();
                var html ="";
                for (var i=0; i<data.length; i++) {
                    if("Y" == data[i].chartYn){
                        html += '<button style="margin-left:5px;" class="btn btn-outline-info mr-1 mb-1 btn-sm" type="button" onclick="javascript:$(this).remove();">';
                        html += '<input type="hidden" name="podChoice" value="'+data[i].podId+'" />';
                        html += ''+data[i].name+'<span class="fas fa-window-close" style="margin-left: 2px;"></span>';
                        html += '</button>';
                    }
                }
                $("#chartPodList").append(html);
                $('#podSelectModal').modal('show');
                $("#podChartMax").val(nodePodChartMax);
            }
        });
    }
    
    pod.checkLimit = function(obj){
        var maxCheck = 5;
        if(langType == "ko"){
            var msg1 = "최대 선택할 수 있는 갯수는 "+maxCheck+"개 입니다.";
            var msg2 = "이미 선택되어 있습니다.";
        }else{
            var msg1 = "You can select up to "+maxCheck;
            var msg2 = "It is already selected.";
        }
        
        var selectPodLength = $("input[name=podChoice]").length; 
        
        if(selectPodLength >= maxCheck){
            toastr["error"](msg1);
        }else{
            var booleanChk = true;
            for(var i=0;i<selectPodLength;i++){
                var podChoiceValue = $("input[name=podChoice]").eq(i).attr("value");
                if(obj.value == podChoiceValue){
                    toastr["warning"](msg2);
                    booleanChk = false;
                }
            }
            if(booleanChk == true){
                var html ="";
                html += '<button style="margin-left:5px;" class="btn btn-outline-info mr-1 mb-1 btn-sm" type="button" onclick="javascript:$(this).remove();">';
                html += '<input type="hidden" name="podChoice" value="'+obj.value+'" />';
                html += ''+obj.title+'<span class="fas fa-window-close" style="margin-left: 2px;"></span>';
                html += '</button>';
                $("#chartPodList").append(html);
            }
        }
    }
    
    pod.chartSettingSave = function(){
        var podCheckIds = [];
        var selectPodLength = $("input[name=podChoice]").length; 
        for(var i=0;i<selectPodLength; i++){      
            var podChoiceValue = $("input[name=podChoice]").eq(i).attr("value");
            podCheckIds.push(podChoiceValue);
        }
        var param = {
            podIds: podCheckIds,
            nodeId : nodeId,
            podChartMax : $("#podChartMax").val()
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/chart";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "PUT";
        option.CALLBACK = function (response) {
            location.reload();
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("저장에 실패하였습니다.");
            }else{
                toastr["error"]("save failed.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    pod.podControl = function(obj){
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
            
            var statusBtnId = "statusBtn_"+obj.id.split("_")[1]+"_"+obj.id.split("_")[2];
            $("#"+statusBtnId).empty();
            var podStatusTdHtml = "";
            
            if(commandType == "start"){
                podStatusTdHtml += '       <button class="btn btn-success btn-ssm2" type="button" disabled>';
                podStatusTdHtml += '       <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                podStatusTdHtml += '       Running...</button>';
                
                podTdHtml += '<div class="spinner-border2 text-success" role="status" id="status_'+pipeName+'_'+podName+'"></div>'+podName+' ';
            }else if(commandType == "stop"){
                podStatusTdHtml += '       <button class="btn btn-danger btn-ssm2" type="button" disabled>';
                podStatusTdHtml += '       <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                podStatusTdHtml += '       Stopped...</button>';
                
                podTdHtml += '<div class="spinner-border2 text-danger" role="status" id="status_'+pipeName+'_'+podName+'"></div>'+podName+' ';
            }else{
                
            }
            $("#"+statusBtnId).html(podStatusTdHtml);
            $("#"+tdStatusId).html(podTdHtml);
            
            podStatucCheck(podName,commandType);
            
            console.log(response);
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
    
    pod.rePodControl = function(obj){
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
            var podTdHtml = "";
            podTdHtml += '<div class="spinner-border2 text-danger" role="status" id="status_'+pipeName+'_'+podName+'"></div>'+podName+' ';
            $("#"+tdStatusId).html(podTdHtml);
            pod.podControl(obj);
            console.log(response);
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
    
    pod.init = function () {
        LoadingWithMask();
        podChart.init();
        getPods();
    }
    return pod;
}) (window.pod || {}, $);