$(document).ready(function () {
    topology.init();
    
    $(window).resize(function() {
        if(this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function() {
            $(this).trigger('resizeEnd');
        }, 500);
    });
    
    $(window).bind('resizeEnd', function() {
        topology.resize();
    });
    
    $("#navBtn").on('click', function(event) {
        topology.resize();
        event.preventDefault();
    });
});

var topology = (function (topology, $) {
    
    var nodes = null;
    var edges = null;
    var network = null;
    var options = null;
    var data = null;
    var container = null;
    
    var nodeInfoSSE = null;
    
    var nodeInfoArray = [];
    
    var selectNodeId = "";
    
    var noticeList = [];
    
    //vis.js 데이터셋 생성
    nodes = new vis.DataSet();
    edges = new vis.DataSet();
    
    var eventName;
    var SSE_NODE;
    var events = {};
    var statusCheck = true;
    
    /**
        토폴로지 캔버스 SSE
     */
    function getAllNodeStatusSSE(){
        eventName = "nodeStatus";
        var eventKey = eventName;
        var responseData;
        SSE_NODE = new SSEObject();
        SSE_NODE.init("/node","", eventKey, 5000, eventCallback, stopCallback, "0", "none");
        
        events[eventKey] = SSE_NODE.start();
        
        function eventCallback(response) {
            responseData = JSON.parse(response.data);
            var alarmList = [];
            for(var i=0;i<responseData.length;i++){
                var alarm = {"nodeId":responseData[i].nodeId, "alarm":responseData[i].notice};
                alarmList.push(alarm);
            }
            noticeList = alarmList;
            var tpMode = localStorage.getItem("topologyMode");
            if(statusCheck){
                $('#mask').remove();
                if( null != tpMode && tpMode == "groupView"){
                    $("#tpModeBox").val(tpMode).prop("selected", true);
                    drawGroup(responseData);
                }else{
                    drawTopology(responseData);
                }
            }else{
                if( null != tpMode && tpMode == "groupView"){
                    updateGroup(responseData);
                }else{
                    updateTopology(responseData);
                }
            }
            statusCheck = false;
        }
       
        function stopCallback() {
            /*if(langType == "ko"){
                toastr["error"]("노드 상태 SSE 오류");
            }else{
                toastr["error"]("Node status SSE error.");
            }*/
        }
    }
    
    function updateGroup(responseData){
        for(var y=0;y<responseData.length;y++){
            var nodeId = responseData[y].nodeId;
            var alias = responseData[y].nodeAlias;
            var name = responseData[y].nodeName;
            var ipAddress = responseData[y].host;
            var status = responseData[y].status;
            var nodeP = "node_"+nodeId;
            $("#"+nodeP).html("");
            var html ="";
            if(status == "on"){
                html += '                        <span class="dot bg-success"></span>';
            }else if(status == "off"){
                html += '                        <span class="dot bg-danger"></span>';
            }else{
                html += '                        <span class="dot bg-warning"></span>';
            }
            if(responseData[y].notice.length > 0){
                html += '                        <span class="fas fa-bell text-danger" style="margin-right: 10px;"></span>'+alias+' ( '+ipAddress+' )';
            }else{
                html += '                        <span class="fas fa-bell" style="margin-right: 10px;"></span>'+alias+' ( '+ipAddress+' )';
            }
            $("#"+nodeP).html(html);
        }
    }
    
    function drawGroup(responseData){
        $.ajax({
            url: "/api/group/list",        
            success: function (data) {
                var html ="";
                html += '<div class="row" style="width: 100%; margin: 5px;" id="groupViewRow">';
                for (var i=0; i<data.length; i++) {
                    html += '<div class="col-lg-3" style="width: 450px;">';
                    html += '<input type="hidden" name="groupViewId" value="'+data[i].groupId+'"/>';
                    html += '    <div class="kanban-items-container border bg-white dark__bg-1000 rounded-2 py-3 mb-3" style="max-height: none;"  >';
                    html += '        <h5 class="mb-0" style="display: inline-block; margin-bottom: 10px !important;">'+data[i].name+'</h5>';
                    html += '        <div id="groupDiv_'+data[i].groupId+'" style="text-align: center;">';
                    for(var y=0;y<responseData.length;y++){
                        var groupId = responseData[y].groupId;
                        if(data[i].groupId == groupId){
                            var nodeId = responseData[y].nodeId;
                            var alias = responseData[y].nodeAlias;
                            var name = responseData[y].nodeName;
                            var ipAddress = responseData[y].host;
                            var status = responseData[y].status;
                            var label = alias;
                            nodeInfoArray.push({"alias":alias, "ipAddress":ipAddress, "nodeId":nodeId,"status":status, "label":label, "groupId" : responseData[y].groupId, "xPosition": responseData[y].xPosition, "yPosition":responseData[y].yPosition});
                            html += '            <div class="card mb-3 kanban-item shadow-sm dark__bg-1100" onclick="topology.showInfo('+nodeId+');">';
                            html += '                <div class="card-body">';
                            html += '                   <input type="hidden" name="groupNodeId" value="'+nodeId+'"/>';
                            html += '                    <p class="fw-medium font-sans-serif mb-0" id="node_'+nodeId+'">';
                            if(status == "on"){
                                html += '                        <span class="dot bg-success"></span>';
                            }else if(status == "off"){
                                html += '                        <span class="dot bg-danger"></span>';
                            }else{
                                html += '                        <span class="dot bg-warning"></span>';
                            }
                            if(undefined != responseData[y].notice){
                                if(responseData[y].notice.length > 0){
                                html += '                        <span class="fas fa-bell text-danger" style="margin-right: 10px;"></span>'+alias+' ( '+ipAddress+' )';
                                }else{
                                    html += '                        <span class="fas fa-bell" style="margin-right: 10px;"></span>'+alias+' ( '+ipAddress+' )';
                                }
                            }else{
                                html += '                        <span class="fas fa-bell" style="margin-right: 10px;"></span>'+alias+' ( '+ipAddress+' )';
                            }
                            
                            html += '                    </p>';
                            html += '                </div>';
                            html += '            </div>';
                        }
                    }
                    html += '        </div>';
                    html += '    </div>';
                    html += '</div>';
                }
                html += '</div>';
                $("#topology").append(html);
                
                new Sortable(document.getElementById('groupViewRow'), {
                    group: 'share',
                    animation: 150
                });
                for (var i=0; i<data.length; i++) {
                    var sortId = "groupDiv_"+data[i].groupId;
                    new Sortable(document.getElementById(sortId), {
                        group: 'shared',
                        animation: 150
                    });
                }
            }
            ,error : function(result){
                console.log(result);
            }
        });
    }
    
    
    function makeGroup(){
        $.ajax({
            url: "/api/group/list",        
            success: function (data) {
                if(data.length > 0){
                    nodes.add({id: 'admin', x:0, y:0, label:'Admin Server', shape: "image", image : "/image/server-admin.png"});
                    
                    for (var i=0; i<data.length; i++) {
                        nodes.add({id: data[i].groupId, x:data[i].xPosition, y:data[i].yPosition, label:data[i].name, shape: "image", image : "/image/server-admin.png"});
                        edges.add({from: 'admin', to: data[i].groupId});
                    }
                    
                    
                }else{
                    if(langType == "ko"){
                        toastr["warning"]("노드 그릅을 먼저 생성해주세요.");
                    }else{
                        toastr["warning"]("Please create a node group first.");
                    }
                }
            }
            ,error : function(result){
                console.log(result);
            }
        });
    }
    
    /**
        토폴로지 그리기
     */
    function drawTopology(responseData){
        makeGroup();
            var result = responseData;
            for(var i=0;i<result.length;i++){
                var nodeId = result[i].nodeId;
                var alias = result[i].nodeAlias;
                var name = result[i].nodeName;
                var ipAddress = result[i].host;
                var status = result[i].status;
                //var label = ipAddress+"\n"+alias;
                var label = alias;
                nodeInfoArray.push({"alias":alias, "ipAddress":ipAddress, "nodeId":nodeId,"status":status, "label":label, "groupId" : result[i].groupId, "xPosition": result[i].xPosition, "yPosition":result[i].yPosition});
                if(status == "on"){
                    if(result[i].notice.length > 0){ 
                        nodes.add({id: nodeId, x:result[i].xPosition, y:result[i].yPosition, label:label, shape: "image", image : "/image/server-green-alarm.png"});
                    }else{
                        nodes.add({id: nodeId, x:result[i].xPosition, y:result[i].yPosition, label:label, shape: "image", image : "/image/server-green.png"});
                    }
                }else if(status == "off"){
                    if(result[i].notice != undefined){
                        if(result[i].notice.length > 0){
                            nodes.add({id: nodeId, x:result[i].xPosition, y:result[i].yPosition, label:label, shape: "image", image : "/image/server-red-alarm.png"});
                        }else{
                            nodes.add({id: nodeId, x:result[i].xPosition, y:result[i].yPosition, label:label, shape: "image", image : "/image/server-red.png"});
                        }
                    }else{
                         nodes.add({id: nodeId, x:result[i].xPosition, y:result[i].yPosition, label:label, shape: "image", image : "/image/server-red.png"});
                    }
                }else{
                    if(result[i].notice.length > 0){
                        nodes.add({id: nodeId, x:result[i].xPosition, y:result[i].yPosition, label:label, shape: "image", image : "/image/server-yellow-alarm.png"});
                    }else{
                        nodes.add({id: nodeId, x:result[i].xPosition, y:result[i].yPosition, label:label, shape: "image", image : "/image/server-yellow.png"});
                    }
                }
                edges.add({from: result[i].groupId, to: nodeId});
            }
            
            container = document.getElementById('topology');
            
            data = {
              nodes: nodes,
              edges: edges
            };
            
            var tpMode = localStorage.getItem("topologyMode");
            if(null != tpMode && tpMode == "hierarchy"){
                $("#tpModeBox").val(tpMode).prop("selected", true);
                //옵션
                options = {
                    width: '100%',
                    height : '100%',
                    locale: 'en',
                    interaction : {
                        dragView : true
                        ,dragNodes : true
                        ,zoomView : true
                        },
                    nodes: {
                        shape: 'dot',
                        borderWidth:5,
                        size:25,
                        color: {
                          border: '#eeeeee',
                          background: '#eeeeee'
                        },
                        font:{color:'#748194', size : 15}
                        //,physics : false
                    },            
                    edges: {
                        color: '#748194',
                        smooth: {
                            type: "vertical",
                            forceDirection: "vertical",
                            roundness: 0
                        }
                    }
                   ,layout: {
                        randomSeed: 'tpSeed',
                        improvedLayout:true,
                        clusterThreshold: 100,
                        hierarchical: {
                          enabled:true,
                          levelSeparation: 200,
                          nodeSpacing: 100,
                          treeSpacing: 100,
                          blockShifting: true,
                          edgeMinimization: true,
                          parentCentralization: true,
                          direction: 'UD',        // UD, DU, LR, RL
                          sortMethod: 'directed',  // hubsize, directed
                          shakeTowards: 'leaves'  // roots, leaves
                        }
                    }
                    ,physics: {
                        enabled: true,
                        solver: "repulsion",
                        repulsion: {
                          nodeDistance: 200
                          ,centralGravity  : 0
                        }
                    }
                };
            }else{
                $("#tpModeBox").val("network").prop("selected", true);
                //옵션
                options = {
                    width: '100%',
                    height : '100%',
                    locale: 'en',
                    interaction : {
                        dragView : true
                        ,dragNodes : true
                        ,zoomView : true
                        },
                    nodes: {
                        shape: 'dot',
                        borderWidth:5,
                        size:25,
                        color: {
                          border: '#eeeeee',
                          background: '#eeeeee'
                        },
                        font:{color:'#748194', size : 15}
                        //,physics : false
                    },            
                    edges: {
                        color: '#748194',
                        smooth: {
                            type: "vertical",
                            forceDirection: "vertical",
                            roundness: 0
                        }
                    }
                   ,layout: {
                        randomSeed: 'tpSeed',
                        improvedLayout:true,
                        clusterThreshold: 100,
                        hierarchical: {
                          enabled:false,
                          levelSeparation: 200,
                          nodeSpacing: 100,
                          treeSpacing: 100,
                          blockShifting: true,
                          edgeMinimization: true,
                          parentCentralization: true,
                          direction: 'UD',        // UD, DU, LR, RL
                          sortMethod: 'directed',  // hubsize, directed
                          shakeTowards: 'leaves'  // roots, leaves
                        }
                    }
                    ,physics: {
                        enabled: true,
                        solver: "repulsion",
                        repulsion: {
                          nodeDistance: 200
                          ,centralGravity  : 1
                        }
                    }
                };
            }
            
            network = new vis.Network(container, data, options);
            network.on("click", function (params) {
                if(params.nodes.length > 0 && params.nodes[0] < 10000){
                    if(nodeInfoSSE != null){
                        sideBoxCheck = true;
                        nodeInfoSSE.close();
                    }
                    LoadingWithMask();
                    $("#nodeInfoDiv").remove();
                    $("#noticeArea").remove();
                    $("#logArea").remove();
                    var html = "<div id='nodeInfoDiv' style='display: inline-block; width: 50%; height: 100%;'></div>";
                    $("#div_dash").append(html);
                    $("#topology").css("width","50%");
                    alarmBox(params.nodes[0]);
                    logBox(params.nodes[0]);
                    sideBoxSSE(params.nodes[0]);
                    callRedraw();
                }else{
                    console.log(params.pointer);
                }
            });
    }
    
    function topologySave(){
        var nodeList = network.clustering.body.nodes;
        var nodeInfos = [];
        for (var node in nodeList) {
            var nodeId = `${node}`;
            var nodeX = network.getPositions([nodeId])[nodeId].x;
            var nodeY = network.getPositions([nodeId])[nodeId].y;
            //var nodeInfo = {"nodeId" : `${node}`, "xPosition" : `${nodeList[node].x}`, "yPosition" : `${nodeList[node].y}`}
            var nodeInfo = {"nodeId" :nodeId, "xPosition" : nodeX, "yPosition" :nodeY}
            if(nodeId != 'admin'){
                nodeInfos.push(nodeInfo);
            }
        }
        
        var param = {
            nodeInfos: nodeInfos
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/node/topology";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("저장되었습니다.");
            }else{
                toastr["success"]("Saved.");
            }
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("서버 에러 발생.");
            }else{
                toastr["error"]("Server Error");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    /**
        토폴로지 상태 수정
     */
    function updateTopology(responseData){
        var result = responseData;
        for(var i=0;i<result.length;i++){
            var nodeId = result[i].nodeId;
            var status = result[i].status;
            if(network.clustering.findNode(nodeId).length > 0){
                if(status == "on"){
                    if(result[i].notice.length > 0){
                        network.clustering.updateClusteredNode(nodeId, {image : '/image/server-green-alarm.png'});
                    }else{
                        network.clustering.updateClusteredNode(nodeId, {image : '/image/server-green.png'});
                    }
                    $("#nodeStatus_"+nodeId).attr('style', 'background-color: #00d27a !important');
                }else if(status == "off"){
                    if(undefined != result[i].notice){
                        if(result[i].notice.length > 0){
                            network.clustering.updateClusteredNode(nodeId, {image : '/image/server-red-alarm.png'});
                        }else{
                            network.clustering.updateClusteredNode(nodeId, {image : '/image/server-red.png'});
                        }
                    }else{
                        network.clustering.updateClusteredNode(nodeId, {image : '/image/server-red.png'});
                    }
                    
                    $("#nodeStatus_"+nodeId).attr('style', 'background-color: #e63757 !important');
                }else{
                    if(result[i].notice.length > 0){
                        network.clustering.updateClusteredNode(nodeId, {image : '/image/server-yellow-alarm.png'});
                    }else{
                        network.clustering.updateClusteredNode(nodeId, {image : '/image/server-yellow.png'});
                    }
                    $("#nodeStatus_"+nodeId).attr('style', 'background-color: #f5803e !important');
                }
            }
        }
    }
    
    /**
        토폴로지 노드 업데이트 후 노드 data 재정의
     */
    function topologyDataUpdate(){
        data = null;
        nodes = new vis.DataSet();
        edges = new vis.DataSet();
        
        makeGroup();
        
        for(var i=0;i<nodeInfoArray.length;i++){
            var nodeId = nodeInfoArray[i].nodeId;
            var label = nodeInfoArray[i].label;
            var status = nodeInfoArray[i].status;
            var groupId = nodeInfoArray[i].groupId;
            var xPosition = nodeInfoArray[i].xPosition;
            var yPosition = nodeInfoArray[i].yPosition;
            for(var j=0;j<noticeList.length;j++){
                var noticeNodeId = noticeList[j].nodeId;
                var alarmList = noticeList[j].alarm;
                
                if(nodeId == noticeNodeId){
                    if(status == "on"){
                        if(alarmList.length > 0){
                            nodes.add({id: nodeId, x:xPosition, y:yPosition, label:label, shape: "image", image : "/image/server-green-alarm.png"});
                        }else{
                            nodes.add({id: nodeId, x:xPosition, y:yPosition, label:label, shape: "image", image : "/image/server-green.png"});
                        }
                    }else if(status == "off"){
                        if(alarmList.length > 0){
                            nodes.add({id: nodeId, x:xPosition, y:yPosition, label:label, shape: "image", image : "/image/server-red-alarm.png"});
                        }else{
                            nodes.add({id: nodeId, x:xPosition, y:yPosition, label:label, shape: "image", image : "/image/server-red.png"});
                        }
                    }else{
                        if(alarmList.length > 0){
                            nodes.add({id: nodeId, x:xPosition, y:yPosition, label:label, shape: "image", image : "/image/server-yellow-alarm.png"});
                        }else{
                            nodes.add({id: nodeId, x:xPosition, y:yPosition, label:label, shape: "image", image : "/image/server-yellow.png"});
                        }
                    }
                }
            }
            edges.add({from: groupId, to: nodeId});
        }
        
        data = {
            nodes: nodes,
            edges: edges
        };
        
        
    }
    
    /**
        알림 확인 후 func -> 알림박스 데이터테이블 재정리
     */
    function confirmAfter(response, nodeId){
        var alarmList = [];
        for(var i=0;i<noticeList.length;i++){
            var checkId = noticeList[i].nodeId;
            if(checkId == nodeId){
                var alarm = {"nodeId":nodeId, "alarm":response};
                alarmList.push(alarm);
            }else{
                var alarm = {"nodeId":checkId, "alarm":noticeList[i].alarm};
                alarmList.push(alarm);
            }
        }
        noticeList = alarmList;
        var tpMode = localStorage.getItem("topologyMode");
        if( tpMode != "groupView"){
            for(var i=0;i<nodeInfoArray.length;i++){
                var arrayStatus = nodeInfoArray[i].status;
                var arrayNodeId = nodeInfoArray[i].nodeId;
                if(arrayNodeId == nodeId){
                    if(network.clustering.findNode(nodeId).length > 0){
                        if(arrayStatus == "on"){
                            if(response.length > 0){
                                network.clustering.updateClusteredNode(nodeId, {image : '/image/server-green-alarm.png'});
                            }else{
                                network.clustering.updateClusteredNode(nodeId, {image : '/image/server-green.png'});
                            }
                            $("#nodeStatus_"+nodeId).attr('style', 'background-color: #00d27a !important');
                        }else if(arrayStatus == "off"){
                            if(response.length > 0){
                                network.clustering.updateClusteredNode(nodeId, {image : '/image/server-red-alarm.png'});
                            }else{
                                network.clustering.updateClusteredNode(nodeId, {image : '/image/server-red.png'});
                            }
                            $("#nodeStatus_"+nodeId).attr('style', 'background-color: #e63757 !important');
                        }else{
                            if(response.length > 0){
                                network.clustering.updateClusteredNode(nodeId, {image : '/image/server-yellow-alarm.png'});
                            }else{
                                network.clustering.updateClusteredNode(nodeId, {image : '/image/server-yellow.png'});
                            }
                            $("#nodeStatus_"+nodeId).attr('style', 'background-color: #f5803e !important');
                        }
                    }
                }
            }
        }else{
            for(var i=0;i<nodeInfoArray.length;i++){
                var nodeId = nodeInfoArray[i].nodeId;
                var label = nodeInfoArray[i].label;
                var status = nodeInfoArray[i].status;
                var ip = nodeInfoArray[i].ipAddress;
                
                var nodeP = "node_"+nodeId;
                $("#"+nodeP).html("");
                var html ="";
                if(status == "on"){
                    html += '                        <span class="dot bg-success"></span>';
                }else if(status == "off"){
                    html += '                        <span class="dot bg-danger"></span>';
                }else{
                    html += '                        <span class="dot bg-warning"></span>';
                }
                if(response.length > 0){
                    html += '                        <span class="fas fa-bell text-danger" style="margin-right: 10px;"></span>'+label+' ( '+ip+' )';
                }else{
                    html += '                        <span class="fas fa-bell" style="margin-right: 10px;"></span>'+label+' ( '+ip+' )';
                }
                $("#"+nodeP).html(html);
                
            }
            
            
        }
        
        var nowOrder = $('#noticeTable').DataTable().order();
        var orderColumn = nowOrder[0][0];
        var orderSort = nowOrder[0][1];
        var curPage = $('#noticeTable').DataTable().page.info().page;
        
        $("#noticeTable").DataTable().destroy();
        $("#noticeTbody").empty();
        
        var html = "";
        for(var j=0;j<response.length;j++){
            html += '               <tr>';
            html += '                   <td>'+convertMsg(response[j].message,response[j].parameter)+'</td>';
            html += '                   <td>'+response[j].createdAt+'</td>';
            html += '                   <td><button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" type="button" value="'+response[j].seq+'" onclick="topology.noticeConfirm(this.value,'+nodeId+');"><span class="far fa-check-circle"></span></button></td>';
            html += '               </tr>';
        }
        $("#noticeTbody").append(html);
        localize();
        reSettingAlarmDatatable(orderColumn, orderSort, curPage);
        if( tpMode != "groupView"){
            topologyDataUpdate();
        }
    }
    
    /**
        토폴로지 클릭 이벤트
     */
    function callRedraw(){
        network = new vis.Network(container, data, options);
        network.on("click", function (params) {
            if(params.nodes.length > 0 && params.nodes[0] < 10000){
                if(nodeInfoSSE != null){
                    sideBoxCheck = true;
                    nodeInfoSSE.close();
                }
                LoadingWithMask();
                $("#nodeInfoDiv").remove();
                $("#noticeArea").remove();
                $("#logArea").remove();
                var html = "<div id='nodeInfoDiv' style='display: inline-block; width: 50%; height: 100%;'></div>";
                $("#div_dash").append(html);
                $("#topology").css("width","50%");
                alarmBox(params.nodes[0]);
                logBox(params.nodes[0]);
                sideBoxSSE(params.nodes[0]);
                callRedraw();
            }
        });
    }
    
    
    function logBox(nodeId){
        var html = "";
        html += '<div class="card" id="logArea" style="margin-top:20px; width: 49.5%; float: right;">';
        html += '   <div class="card-header border-bottom">';
        html += '       <h5 class="mb-0" style="display: inline-block; maring-right:10px;" chkI18n="menu.log"></h5>';
        html += '           <div class="col-sm-3" style="width: 25%; display: inline-block; margin-left: 10px;">';
        html += '               <div class="form-group">';
        html += '                   <select class="form-control" onchange="topology.getPods(this);" id="optionPipe">';
        html += '                       <option value="" selected chkI18n="menu.pipeline"></option>';
        html += '                   </select>';
        html += '               </div>';
        html += '           </div>';
        html += '           <div class="col-sm-3" style="width: 25%; display: inline-block;">';
        html += '                        <div class="form-group">';
        html += '                            <select class="form-control" id="logPodList">';
        html += '                                <option value="" selected chkI18n="menu.pod"></option>';
        html += '                            </select>';
        html += '                        </div>';
        html += '           </div>';
        html += '           <div class="col-sm-3" style="display: inline-block; width: 250px;">';
        html += '                        <div class="form-group">';
        html += '                            <button class="btn btn-outline-success mr-1 mb-1" type="button" id="startBtn" disabled onclick="topology.logSSEStart('+nodeId+');" chkI18n="button.start"></button>';
        html += '                            <button class="btn btn-outline-danger mr-1 mb-1" style="margin-left:3px;" disabled type="button" id="stopBtn" onclick="topology.stopLog();" chkI18n="button.stop"></button>';
        html += '                            <button class="btn btn-outline-primary mr-1 mb-1" style="margin-left:3px;" type="button" onclick="topology.clearLog();" chkI18n="button.clear"></button>';
        html += '                        </div>';
        html += '           </div>';
        html += '   </div>';
        html += '   <div class="card-body" style="padding: 1rem; height: 720px; display: inline-flex; overflow: auto;" id="div_log">';
        html += '       <div class="log-tab-monitoring" id="log-content" style="min-height: 670px; max-height: 670px; width: 100%; overflow: auto; margin-top:1%;">';
        html += '       </div>';
        html += '   </div>';
        html += '</div>';
        $("#wrapperDiv").append(html);
        setOptions(nodeId);
    }
    
    var podList = [];
    
    function setOptions(nodeId){
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
            },
            error : function(result){
                sideBoxClose();
                $('#mask').remove();
                if(langType == "ko"){
                    toastr["error"]("서버에 연결할 수 없습니다.");
                }else{
                    toastr["error"]("Unable to connect to server.");
                }
            }
        });
    }
    
    var logEventName;
    var SSE_LOG;
    var logEvents = {};
    
    function logStart(id){
        logEventName = $("#optionPipe option:selected").val();
        var eventKey = logEventName;
        var responseData;
        if (logEvents[eventKey] != undefined) {
            if(langType == "ko"){
                toastr["warning"]("이미 시작되었습니다.");
            }else{
                toastr["warning"]("Has already started.");
            }
            return;
        }else{
            if(langType == "ko"){
                toastr["success"]("로그가 시작 되었습니다.");
            }else{
                toastr["success"]("Log started.");
            }
            $("#startBtn").attr("disabled", true);
            $("#stopBtn").attr("disabled", false);
            $("#optionPipe").attr("disabled", true);
            $("#logPodList").attr("disabled", true);
            $("#logLevel").attr("disabled", true);
            $("#log-content").append("<span class='line' style='color: #00d27a;'>========== Elasticsearch Log Start ==========</span> <br>");
        }
        SSE_LOG = new SSEObject();
        SSE_LOG.init("/elasticsearch","", eventKey, 1000, eventCallback, stopCallback, id, $("#logPodList option:selected").val());
        
        logEvents[eventKey] = SSE_LOG.start();
        
        function eventCallback(response) {
            responseData = JSON.parse(response.data);
            drawLog(responseData);
        }
        
        function stopCallback() {
            $("#startBtn").attr("disabled", false);
            $("#stopBtn").attr("disabled", true);
            $("#optionPipe").attr("disabled", false);
            $("#logPodList").attr("disabled", false);
            $("#log-content").append("<span class='line' style='color: #e63757;'>========== Elasticsearch Log Stop ==========</span> <br>");
            downScroll("log-content");
            logEventName = $("#optionPipe option:selected").val();
            var eventKey = logEventName;
            var event = logEvents[eventKey];
            if (event === undefined) {
                if(langType == "ko"){
                    toastr["info"]("존재 하지 않는 로그입니다.");
                }else{
                    toastr["info"]("Log does not exist.");
                }
                return;
            }
            delete logEvents[eventKey];
            if(langType == "ko"){
                toastr["success"]("로그가 중지 되었습니다.");
            }else{
                toastr["success"]("Log stopped.");
            }
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
    
    function logStop() {
        logEventName = $("#optionPipe option:selected").val();
        var eventKey = logEventName;
        var event = logEvents[eventKey];
        SSE_LOG.stop(event);
    }
    
    /**
        토폴로지 클릭시 알림박스 그리기
     */
    function alarmBox(nodeId){
        var html = "";
        for(var i=0;i<noticeList.length;i++){
            if(noticeList[i].nodeId == nodeId){
                var resultList = noticeList[i].alarm;
                html += '<div class="card" id="noticeArea" style="margin-top:20px; width: 49.5%; position: absolute;">';
                html += '   <div class="card-header border-bottom"  style="padding: 20px;">';
                html += '       <h5 class="mb-0" style="display: inline-block; " chkI18n="menu.alarm"></h5>';
                html += '       <button class="btn btn-falcon-danger mr-1 mb-1 btn-sm" style="float:right;" type="button" onclick="topology.noticeConfirmALL('+nodeId+');">ALL Check</button>';
                html += '   </div>';
                html += '   <div class="card-body" style="padding: 0.1rem; min-height: 720px; display: inline-flex;" id="div_notice">';
                html += '       <div style="padding: 0px 10px 10px 10px; width: 100%;">';
                html += '           <table class="table table-bordered table-striped fs--1 mb-0" id="noticeTable">';
                html += '               <thead>';
                html += '                   <tr>';
                html += '                       <th chkI18n="table.message"></th>';
                html += '                       <th chkI18n="table.date"></th>';
                html += '                       <th></th>';
                html += '                   </tr>';
                html += '               </thead>';
                html += '               <tbody id="noticeTbody">';
                for(var j=0;j<resultList.length;j++){
                    html += '               <tr>';
                    html += '                   <td>'+convertMsg(resultList[j].message,resultList[j].parameter)+'</td>';
                    html += '                   <td>'+resultList[j].createdAt+'</td>';
                    html += '                   <td><button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" type="button" value="'+resultList[j].seq+'" onclick="topology.noticeConfirm(this.value,'+nodeId+');"><span class="far fa-check-circle"></span></button></td>';
                    html += '               </tr>';
                }
                html += '               </tbody>';
                html += '           </table>';
                html += '       </div>';
                html += '   </div>';
                html += '</div>';
            }
        }
        $("#wrapperDiv").append(html);
        settingAlarmDatatable();
    }
    
    /**
        토폴로지 클릭시 알림박스 데이터테이블 정의
     */
    function settingAlarmDatatable(){
        if(langType == "ko"){
            $("#noticeTable").DataTable({
                order: [ [ 1, "desc" ] ],
                "columnDefs": [
                    { "orderable": true, "width": "63%", "targets": [0] },
                    { "orderable": true, "width": "30%", "targets": [1]},
                    { "orderable": false, "width": "7%", "targets": [2]}
                ],
                autoWidth: false,
                 language : lang_ko,
                 "pageLength": 10,
                 dom: 'rtp'
            }); 
        }else{
            $("#noticeTable").DataTable({
                order: [ [ 1, "desc" ] ],
                "columnDefs": [
                    { "orderable": true, "width": "63%", "targets": [0] },
                    { "orderable": true, "width": "30%", "targets": [1]},
                    { "orderable": false, "width": "7%", "targets": [2]}
                ],
                autoWidth: false,
                 language : lang_en,
                 "pageLength": 10,
                 dom: 'rtp'
            }); 
        }
    }
    
    /**
        노드별 SSE 데이터 수신 -> 알림박스 업데이트
     */
    function alarmBoxUpdate(nodeId){
        var nowOrder = $('#noticeTable').DataTable().order();
        var orderColumn = nowOrder[0][0];
        var orderSort = nowOrder[0][1];
        var curPage = $('#noticeTable').DataTable().page.info().page;
        
        $("#noticeTable").DataTable().destroy();
        $("#noticeTbody").empty();
        
        var html = "";
        for(var i=0;i<noticeList.length;i++){
            if(noticeList[i].nodeId == nodeId){
                var resultList = noticeList[i].alarm;
                for(var j=0;j<resultList.length;j++){
                    html += '               <tr>';
                    html += '                   <td>'+convertMsg(resultList[j].message,resultList[j].parameter)+'</td>';
                    html += '                   <td>'+resultList[j].createdAt+'</td>';
                    html += '                   <td><button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" type="button" value="'+resultList[j].seq+'" onclick="topology.noticeConfirm(this.value,'+nodeId+');"><span class="far fa-check-circle"></span></button></td>';
                    html += '               </tr>';
                }
            }
        }
        $("#noticeTbody").append(html);
        localize();
        reSettingAlarmDatatable(orderColumn, orderSort, curPage);
    }
    
    /**
        노드별 SSE 데이터 수신 -> 알림박스 업데이트 -> 데이터테이블
     */
    function reSettingAlarmDatatable(orderColumn, orderSort, curPage){
        if(langType == "ko"){
            $("#noticeTable").DataTable({
                order: [ [ orderColumn, orderSort ] ],
                "columnDefs": [
                    { "orderable": true, "width": "63%", "targets": [0] },
                    { "orderable": true, "width": "30%", "targets": [1]},
                    { "orderable": false, "width": "7%", "targets": [2]}
                ],
                autoWidth: false,
                 language : lang_ko,
                 "pageLength": 10,
                 dom: 'rtp'
            }); 
        }else{
            $("#noticeTable").DataTable({
                order: [ [ orderColumn, orderSort ] ],
                "columnDefs": [
                    { "orderable": true, "width": "63%", "targets": [0] },
                    { "orderable": true, "width": "30%", "targets": [1]},
                    { "orderable": false, "width": "7%", "targets": [2]}
                ],
                autoWidth: false,
                 language : lang_en,
                 "pageLength": 10,
                 dom: 'rtp'
            }); 
        }
        
        var table = $('#noticeTable').DataTable();
        table.page(curPage).draw('page');
    }
    
    /**
        노드 정보 닫기 func
     */
    function sideBoxClose(){
        if(nodeInfoSSE != null){
            sideBoxCheck = true;
            nodeInfoSSE.close();
        }
        $("#topology").css("width","100%");
        $("#nodeInfoDiv").remove();
        $("#noticeArea").remove();
        $("#logArea").remove();
        var tpMode = localStorage.getItem("topologyMode");
        if( tpMode != "groupView"){
            callRedraw();
        }
    }
    
    var sideBoxCheck = true;
    
    /**
        토폴로지 노드 클릭시 SSE 연결
     */
     
     var checkCountTerm = 0;
     
    function sideBoxSSE(nodeId){
        var url = "/sse/api?nodeId="+nodeId+"&type=nodeInfo&apiNo=2";
        nodeInfoSSE = new EventSource(url);
        nodeInfoSSE.onmessage = function(response){
           if(response.data != null && response.data != ''){
                var responseData = response.data;
                var responseDataCut = responseData.substr(6);
                var responseDataJson = JSON.parse(responseDataCut);
                if(sideBoxCheck){
                    drawNodeInfoDiv(responseDataJson.data, nodeId);
                    sideBoxCheck = false;
                }else{
                    if(checkCountTerm > 4){
                        updateNodeInfoDiv(responseDataJson.data, nodeId);
                        checkCountTerm = 0;
                    }else{
                        checkCountTerm++;
                    }
                }
                alarmBoxUpdate(nodeId);
            }
        };
        nodeInfoSSE.onerror = function(){
           if(langType == "ko"){
                toastr["error"]("서버 연결중 오류가 발생하였습니다.<br/>REST API 2.3를 확인해 주세요.");
            }else{
                toastr["error"]("An error occurred while connecting to the server.<br/>Please check REST API 2.3");
            }
           nodeInfoSSE.close();
           sideBoxClose();
           $('#mask').remove();
       };
    }
    
    /**
        토폴로지 클릭 시 SSE 연결 -> 오른쪽 노드정보 박스 그리기
     */
    function drawNodeInfoDiv(responseData, nodeId){
        var nAlias = "";
        var nIp = "";
        var pipelines = [];
        var nStatus = "";
        
        for(var i=0;i<nodeInfoArray.length;i++){
            if(nodeInfoArray[i].nodeId == nodeId){
                nAlias = nodeInfoArray[i].alias;
                nIp = nodeInfoArray[i].ipAddress;
                selectNodeId = nodeInfoArray[i].nodeId;
                nStatus = nodeInfoArray[i].status;
            }
        }
        
        //if(null == responseData[0].nodecpu || undefined == responseData[0].nodecpu){
        if(responseData.length < 1){
            nodeInfoSSE.close();
            sideBoxClose();
            $('#mask').remove();
            if(langType == "ko"){
                toastr["error"]("Oncue가 구성되지 않았습니다.");
            }else{
                toastr["error"]("Oncue is not configured.");
            }
        }
        if(responseData.length > 0){
            var html = "";
            var nodeCpu = responseData[0].nodecpu;
            var nodeMemory = responseData[0].nodemem; if(nodeMemory == null){nodeMemory = 0}
            var nodeDisk = responseData[0].nodedisk;
            var nodeDiskValue = 0;
            for(var i=0;i<nodeDisk.length;i++){
                nodeDiskValue = (nodeDiskValue+nodeDisk[i].usage);
            }
            nodeDiskValue = nodeDiskValue / nodeDisk.length;
            
            html += '<div style="padding: 10px 10px 20px 10px;">';
            if(nStatus == "on"){
                html += '    <span class="dot bg-success" id="nodeStatus_'+nodeId+'"></span>';
            }else if(nStatus == "off"){
                html += '    <span class="dot bg-danger" id="nodeStatus_'+nodeId+'"></span>';
            }else{
                html += '    <span class="dot bg-warning" id="nodeStatus_'+nodeId+'"></span>';
            }
            html += '    <h4 class="mb-0" style="display: inline-block; vertical-align: middle;">'+nIp+' ('+nAlias+')</h4>';
            html += '    <a href="/node/monitoring/'+nodeId+'/pipeline"><button class="btn btn-falcon-primary mr-1 mb-1 btn-sm" style="margin-left:10px;" type="button" chkI18n="button.detail"></button></a>';
            if(userRole[0].authority != "ROLE_USER"){
            html += '    <button class="btn btn-falcon-warning mr-1 mb-1 btn-sm" style="margin-left:10px;" type="button" chkI18n="button.modify" onclick="nodeInfoById('+nodeId+')"></button>';
            html += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-sm" style="margin-left:10px;" type="button" chkI18n="button.delete" onclick="nodeDeleteModal('+nodeId+',\''+nAlias+'\')"></button>';
            }
            html += '    <button class="ml-1 btn btn-outline-primary rounded-capsule mr-1 mb-1" style="margin-left:10px; float: right;" type="button" onclick="topology.sideBoxClose();"><span class="far fa-window-close"></span></button>';
            html += '</div>';
            
            html += '<div style="padding: 0px 10px 10px 10px;">';
            html += '    <div class="col-auto" style="display: inline-block; width: 15%;">';
            html += '        <h5 class="text-600 mb-0 ms-2" style="display: inline-block; vertical-align: middle; " chkI18n="table.cpu"></h5>';
            html += '    </div>';
            html += '    <div class="col-auto" style="display: inline-block; margin-left: 10px; vertical-align: middle; width: 10%;">';
            html += '        <h5 class="text-primary mb-0" style="color:#55BCB0 !important;" id="nodeCpuPer">'+nodeCpu.toFixed(2)+'%</h5>';
            html += '    </div>';
            html += '    <div class="col-auto" style="display: inline-block; width: 70%; margin-left: 10px; vertical-align: middle;">';
            html += '        <div class="progress rounded-pill" >';
            html += '            <div class="progress-bar bg-success rounded-pill" role="progressbar" id="nodeCpuDiv" ';
            html += '            style="width: '+nodeCpu.toFixed(2)+'%; background-color: #55BCB0 !important;" aria-valuemin="0" aria-valuemax="100"></div>';
            html += '        </div>';
            html += '    </div>';
            html += '</div>';
            
            html += '<div style="padding: 0px 10px 10px 10px;">';
            html += '    <div class="col-auto" style="display: inline-block; width: 15%;">';
            html += '        <h5 class="text-600 mb-0 ms-2" style="display: inline-block; vertical-align: middle; " chkI18n="table.memory"></h5>';
            html += '    </div>';
            html += '    <div class="col-auto" style="display: inline-block; margin-left: 10px; vertical-align: middle; width: 10%;">';
            html += '        <h5 class="text-primary mb-0" style="color:#EC568D !important;" id="nodeMemoryPer">'+nodeMemory.toFixed(2)+'%</h5>';
            html += '    </div>';
            html += '    <div class="col-auto" style="display: inline-block; width: 70%; margin-left: 10px; vertical-align: middle;">';
            html += '        <div class="progress rounded-pill" >';
            html += '            <div class="progress-bar bg-success rounded-pill" role="progressbar" id="nodeMemoryDiv" ';
            html += '            style="width: '+nodeMemory.toFixed(2)+'%; background-color: #EC568D !important;" aria-valuemin="0" aria-valuemax="100"></div>';
            html += '        </div>';
            html += '    </div>';
            html += '</div>';
            
            html += '<div style="padding: 0px 10px 10px 10px;">';
            html += '    <div class="col-auto" style="display: inline-block; width: 15%;">';
            html += '        <h5 class="text-600 mb-0 ms-2" style="display: inline-block; vertical-align: middle; " chkI18n="table.disk"></h5>';
            html += '    </div>';
            html += '    <div class="col-auto" style="display: inline-block; margin-left: 10px; vertical-align: middle; width: 10%;">';
            html += '        <h5 class="text-primary mb-0" style="color:#FEC514 !important;" id="nodeDiskPer">'+nodeDiskValue.toFixed(2)+'%</h5>';
            html += '    </div>';
            html += '    <div class="col-auto" style="display: inline-block; width: 70%; margin-left: 10px; vertical-align: middle;">';
            html += '        <div class="progress rounded-pill" >';
            html += '            <div class="progress-bar bg-success rounded-pill" role="progressbar" id="nodeDiskDiv" ';
            html += '            style="width: '+nodeDiskValue.toFixed(2)+'%; background-color: #FEC514 !important;" aria-valuemin="0" aria-valuemax="100"></div>';
            html += '        </div>';
            html += '    </div>';
            html += '</div>';
            
            html += '<div style="padding: 0px 10px 0px 10px;">';
            html += '    <div class="col-auto" style="display: inline-block;">';
            html += '        <h5 class="text-600 mb-0 ms-2" style="display: inline-block; vertical-align: middle; margin-right:10px;" chkI18n="table.storagestatus"></h5>';
            html += '        <a href="/node/monitoring/'+nodeId+'/logSearch"><button class="btn btn-falcon-primary mr-1 mb-1 btn-sm" type="button" chkI18n="button.detail"></button></a>';
            html += '    </div>';
            html += '    <div class="card-body d-flex align-items-center" style="margin-top: -20px; margin-left: -3px;">';
            html += '        <div class="w-100">';
            html += '            <h6 class="mb-3 text-800" style="display: inline-block; margin-right:5px;" chkI18n="table.storageuse"></h6>';
            html += '            <h6 class="mb-3 text-800" style="display: inline-block;">';
            html += '                <strong class="text-dark" id="usingNow">0</strong> GB of <strong class="text-dark" id="usingMax">0</strong> GB';
            html += '            </h6>';
            html += '            <div class="progress mb-3 rounded-3">';
            html += '                <div class="progress-bar bg-progress-gradient border-end border-white border-2" id="usingBox" style="width: 0%;" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>';
            html += '            </div>';
            html += '        </div>';
            html += '    </div>';
            html += '</div>';
            
            html += '<div style="padding: 0px 10px 10px 10px;">';
            html += '    <div class="col-auto" style="display: inline-block;">';
            html += '        <h5 class="text-600 mb-0 ms-2" style="display: inline-block; vertical-align: middle; margin-right:10px;" chkI18n="table.pods"></h5>';
            html += '        <a href="/node/monitoring/'+nodeId+'/pod"><button class="btn btn-falcon-primary mr-1 mb-1 btn-sm" type="button" chkI18n="button.detail"></button></a>';
            html += '    </div>';
            html += '    <table class="table table-bordered table-striped fs--1 mb-0" id="podTable">';
            html += '      <thead class="bg-200 text-900">';
            html += '        <tr>';
            html += '          <th chkI18n="table.pipeline"></th>';
            html += '          <th chkI18n="table.podname"></th>';
            html += '          <th chkI18n="table.cpu"></th>';
            html += '          <th chkI18n="table.memory"></th>';
            html += '        </tr>';
            html += '      </thead>';
            html += '      <tbody id="podTbody">';
            
            for(var i=0;i<responseData.length;i++){
                var pipeName = responseData[i].pipename; // 파이프라인 이름
                pipelines.push(pipeName);
                var podList = responseData[i].pods;
                for(var x=0;x<podList.length;x++){
                    var podName = podList[x].name; // 파드 이름
                    var podStatus = podList[x].status; // 파드 상태
                    var podLabels = podList[x].labels;
                    var podCpu = podList[x].cpu;
                    var podMemory = podList[x].memory;
                    html += '<tr>';
                    html += '<td>'+pipeName+'</td>';
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
                    }else if(podStatus == 2){
                        html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                        html += '       <span class="dot bg-danger"></span>'+podName+' ';
                        html += '   </td>';
                        html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">0</td>';
                        html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">0</td>';
                    }else{
                        html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                        html += '       <div class="spinner-border2 text-success" role="status" ></div>'+podName+' ';
                        //html += '       <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
                        //html += '       title="<b>Label Info</b><br/><span>app : '+podLabels.app+'</span><br/><span>category : '+podLabels.category+'</span><br/><span>pipe : '+podLabels.pipe+'</span>">';
                        //html += '       <span class="fas fa-info-circle"></span>';
                        //html += '       </button>';
                        html += '   </td>';
                        html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">0</td>';
                        html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">0</td>';
                    }
                    html += '</tr>';
                }
            }
            
            html += '      </tbody>';
            html += '    </table>';
            html += '</div>';
            
            
            $("#nodeInfoDiv").append(html);
            localize();
            settingPodsDatatable(pipelines);
            getOnCueSetting(selectNodeId);
            $('#mask').remove();
        }
    }
    
    /**
        오른쪽 노드정보 박스 pod list 데이터 테이블
     */
    function settingPodsDatatable(pipelines){
        $('.podTooltip').tooltip({ boundary: 'window' , html : true});
        
        if(langType == "ko"){
            $("#podTable").DataTable({
                order: [ [ 0, "asc" ] ],
                dom: 'Bfrtp',
                "columnDefs": [
                    { "orderable": true, "width": "35%", "targets": [0,1] },
                    { "orderable": true, "targets": [2,3]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "파드 이름 : "
                 },
                 "pageLength": 8,
                 language : lang_ko
            }); 
        }else{
            $("#podTable").DataTable({
                order: [ [ 0, "asc" ] ],
                dom: 'Bfrtp',
                "columnDefs": [
                    { "orderable": true, "width": "35%", "targets": [0,1] },
                    { "orderable": true, "targets": [2,3]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "Pod Name : "
                 },
                 "pageLength": 8,
                 language : lang_en
            }); 
        }
        var html ="";
        html += '<select id="pipelineFilter" class="form-control" style="width: 30%; display: inline-block; font-size: 15px;">';
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
    
    /**
        노드정보 SSE 업데이트
     */
    function updateNodeInfoDiv(responseData, nodeId){
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
        
        var nodeCpu = responseData[0].nodecpu;
        var nodeMemory = responseData[0].nodemem; if(nodeMemory == null){nodeMemory = 0}
        var nodeDisk = responseData[0].nodedisk;
        var nodeDiskValue = 0;
        for(var i=0;i<nodeDisk.length;i++){
            nodeDiskValue = (nodeDiskValue+nodeDisk[i].usage);
        }
        nodeDiskValue = nodeDiskValue / nodeDisk.length;
        
        $("#nodeCpuPer").html(nodeCpu.toFixed(2)+"%");
        $("#nodeCpuDiv").css("width",nodeCpu.toFixed(2)+"%");
        $("#nodeMemoryPer").html(nodeMemory.toFixed(2)+"%");
        $("#nodeMemoryDiv").css("width",nodeMemory.toFixed(2)+"%");
        $("#nodeDiskPer").html(nodeDiskValue.toFixed(2)+"%");
        $("#nodeDiskDiv").css("width",nodeDiskValue.toFixed(2)+"%");
        
        for(var i=0;i<result.length;i++){
            var pipeName = result[i].pipename; // 파이프라인 이름
            pipelines.push(pipeName);
            var podList = result[i].pods;
            for(var x=0;x<podList.length;x++){
                var podList = responseData[i].pods;
                for(var x=0;x<podList.length;x++){
                    var podName = podList[x].name; // 파드 이름
                    var podStatus = podList[x].status; // 파드 상태
                    var podLabels = podList[x].labels;
                    var podCpu = podList[x].cpu;
                    var podMemory = podList[x].memory;
                    html += '<tr>';
                    html += '<td>'+pipeName+'</td>';
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
                    }else if(podStatus == 2){
                        html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                        html += '       <span class="dot bg-danger"></span>'+podName+' ';
                        html += '   </td>';
                        html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">0</td>';
                        html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">0</td>';
                    }else{
                        html += '   <td id="tdStatus_'+pipeName+'_'+podName+'">';
                        html += '       <div class="spinner-border2 text-success" role="status"></div>'+podName+' ';
                        //html += '       <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
                        //html += '       title="<b>Label Info</b><br/><span>app : '+podLabels.app+'</span><br/><span>category : '+podLabels.category+'</span><br/><span>pipe : '+podLabels.pipe+'</span>">';
                        //html += '       <span class="fas fa-info-circle"></span>';
                        //html += '       </button>';
                        html += '   </td>';
                        html += '   <td id="resourceCpu_'+pipeName+'_'+podName+'">0</td>';
                        html += '   <td id="resourceMem_'+pipeName+'_'+podName+'">0</td>';
                    }
                    html += '</tr>';
                }
            }
        }
        $("#podTbody").append(html);
        localize();
        reSettingPodsDatatable(pipelines, orderColumn, orderSort, searchValue, selectBoxValue, showInfo, curPage);
        getOnCueSetting(selectNodeId);
    }
    
    /**
        노드정보 SSE 업데이트 pod list 데이터 테이블
     */
    function reSettingPodsDatatable(pipelines, orderColumn, orderSort, searchValue, selectBoxValue, showInfo, curPage){
        $('.podTooltip').tooltip({ boundary: 'window' , html : true});
        
        if(langType == "ko"){
            $("#podTable").DataTable({
                order: [ [ orderColumn, orderSort ] ],
                dom: 'Bfrtp',
                "columnDefs": [
                    { "orderable": true, "width": "35%", "targets": [0,1] },
                    { "orderable": true, "targets": [2,3]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "파드 이름 : "
                 },
                 "pageLength": 8,
                 language : lang_ko
            }); 
        }else{
            $("#podTable").DataTable({
                order: [ [ orderColumn, orderSort ] ],
                dom: 'Bfrtp',
                "columnDefs": [
                    { "orderable": true, "width": "35%", "targets": [0,1] },
                    { "orderable": true, "targets": [2,3]}
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "Pod Name : "
                 },
                 "pageLength": 8,
                 language : lang_en
            }); 
        }
        var html ="";
        html += '<select id="pipelineFilter" class="form-control" style="width: 30%; display: inline-block; font-size: 15px;">';
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
        table.page(curPage).draw('page');
    }
    
    /**
        오른쪽 노드정보 박스 로그 저장상태
     */
    function getOnCueSetting(alias){
        $.ajax({
            url: "/api/notice/config/"+alias,
            success: function (result) {
                var data = result.data;
                var threshol;
                var usingMax = 0;
                if(data.length > 0){
                    for(idx in data){
                        threshol = data[idx]["measure"];
                        if(data[idx]["target"] === "SIZE"){
                            $("#nodeSeqSize").val(data[idx]["seq"]);
                            if(threshol > 0){
                                usingMax = threshol;
                                $("#usingMax").html(threshol);
                            }else{
                                $("#usingMax").html("Unlimited");
                                $("#usingBox").css("width","100%");
                            }
                        }
                    }
                }
                if(undefined != result.log && null != result.log){
                    getUsingSize(result.log,usingMax);
                }else{
                    /*
                    if(langType == "ko"){
                        toastr["error"]("엘라스틱서치 연결 실패");
                    }else{
                        toastr["error"]("Elasticsearch Connect failure");
                    }
                    */
                }
            }, error : function(response){
                console.log(response);
                if(langType == "ko"){
                    toastr["error"]("엘라스틱서치 연결 실패");
                }else{
                    toastr["error"]("Elasticsearch Connect failure");
                }
            }
        });
    }
    
    /**
        오른쪽 노드정보 박스 로그 저장상태 -> 로그 용량
     */
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
    
    function groupViewSave(groupSortInfoList, nodeSortInfoList){
        var param = {
            groupSortInfoList : groupSortInfoList
            ,nodeSortInfoList : nodeSortInfoList
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/node/groupView";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("저장되었습니다.");
            }else{
                toastr["success"]("Saved.");
            }
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("서버 에러");
            }else{
                toastr["error"]("Server Error");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    
    // card area show and hide
    topology.showAndhideArea = function(id){
        if($("#span_"+id).hasClass("fa-plus")){
            $("#div_"+id).css("display","inline-flex");
            $("#span_"+id).removeClass("fa-plus");
            $("#span_"+id).addClass("fa-minus");
        }else{
            $("#div_"+id).css("display","none");
            $("#span_"+id).removeClass("fa-minus");
            $("#span_"+id).addClass("fa-plus");
        }
    }
    
    // 알림박스 전체 확인 
    topology.noticeConfirmALL = function(nodeId){
        var param = {
            nodeId : nodeId
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/notice/confirm/all";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            confirmAfter(response, nodeId);
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("서버 에러");
            }else{
                toastr["error"]("Server Error");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    // 알림박스 로우별 확인
    topology.noticeConfirm = function(seq,nodeId){
        var noticeCheckSeqs = [];
        noticeCheckSeqs.push(seq);
        
        var param = {
            noticeSeqs: noticeCheckSeqs,
            nodeId : nodeId
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/notice/confirm";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            confirmAfter(response, nodeId);
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("서버 에러");
            }else{
                toastr["error"]("Server Error");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    // 토폴로지 노트 클릭시 등장하는 박스 전체 닫기
    topology.sideBoxClose = function(){
        sideBoxClose();
    }
    
    // 창크기 감지 토폴로지 노드 업데이트
    topology.resize = function(){
        var tpMode = localStorage.getItem("topologyMode");
        if( null != tpMode && tpMode != "groupView"){
            callRedraw();
        }
    }
    
    topology.getPods = function(obj){
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
            $("#logPodList").append('<option value="" selected chkI18n="menu.pod"></option>');
            localize();
        }
    }
    
    topology.showInfo = function(nodeId){
        LoadingWithMask();
        $("#nodeInfoDiv").remove();
        $("#noticeArea").remove();
        $("#logArea").remove();
        var html = "<div id='nodeInfoDiv' style='display: inline-block; width: 50%; height: 100%;'></div>";
        $("#div_dash").append(html);
        $("#topology").css("width","50%");
        alarmBox(nodeId);
        logBox(nodeId);
        sideBoxSSE(nodeId);
    }
    
    topology.modeChange = function(mode){
        localStorage.setItem("topologyMode",mode);
        location.reload();
    }
    
    topology.clearLog = function(){
        $("#log-content").empty();
    }
    
    topology.logSSEStart = function(id){
        logStart(id);
    }
    
    topology.nodeTopology = function(){
        var tpMode = localStorage.getItem("topologyMode");
        if( tpMode == "groupView"){
            var groupSortInfoList = [];
            var nodeSortInfoList = [];
            $("input[name=groupViewId]").each(function(idx){    
                var groupId = $(this).val();
                var groupSort = idx;
                var groupSortInfo = {"groupId" : groupId, "groupSort" : groupSort};
                groupSortInfoList.push(groupSortInfo);
            });
            $("input[name=groupNodeId]").each(function(idx){
                var nodeId = $(this).val();
                var nodeSort = idx;
                var groupId = $(this).parent().parent().parent().attr('id').split("_")[1];
                var nodeSortInfo = {"nodeId" : nodeId, "nodeSort" : nodeSort, "groupId" : groupId};
                nodeSortInfoList.push(nodeSortInfo);
            });
            groupViewSave(groupSortInfoList, nodeSortInfoList);
        }else{
            topologySave();
        }
    }
    
    topology.stopLog = function(){
        logStop();
    }
    
    topology.init = function () {
        localize();
        LoadingWithMask();
        getAllNodeStatusSSE();
    }
    return topology;
}) (window.topology || {}, $);