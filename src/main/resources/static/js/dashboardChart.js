var dashboardChart = (function (dashboardChart, $) {
    var CpuChart;
    var MemoryChart;
    var DiskChart;
    var nodeCount = 0;
    var selectNode = [];
    
    /**************************************
     * Private 함수
     * ************************************/
    function setChart(){
        $.ajax({
            url: "/api/node/all",        
            success: function (data) {
                var response = [];
                for(var i=0; i<data.length;i++){
                    if("Y" == data[i].chartYn){
                        selectNode.push({"nodeName" : data[i].alias, "nodeId" : data[i].nodeId});
                        var pushData = {"nodeName" : data[i].alias};
                        response.push(pushData);
                        nodeCount++;
                        connectSSE(data[i].ipAddress,data[i].nodeId,nodeCount);
                    }
                }
                if(nodeCount > 0){
                    drawChartCpu(response);
                    drawChartMem(response);
                    drawChartDisk(response);
                    setInterval(drawingSSE, 1000);
                }else{
                    $('#mask').remove();
                    if(langType == "ko"){
                        toastr["warning"]("차트에 선택된 노드가 없습니다.");
                    }else{
                        toastr["warning"]("There are no Nodes selected in the chart.");
                    }
                }
                
            }
        });
    }
    
    var sse_1 = [];
    var sse_2 = [];
    var sse_3 = [];
    var sse_4 = [];
    var sse_5 = [];
    
    function connectSSE(ip,nodeId,count){
        var url = "/sse/api?nodeId="+nodeId+"&type=nodeResource&apiNo=1";
        var eventSource = new EventSource(url);
        eventSource.onopen = function(){
            
        };
        eventSource.onmessage = function(response){
            if(response.data != null && response.data != ''){
                var responseData = response.data;
                var responseDataCut = responseData.substr(6);
                var responseDataJson = JSON.parse(responseDataCut);
                convertSSEResponse(responseDataJson.data, count);
            }
        };
        eventSource.onerror = function(){
           if(langType == "ko"){
                toastr["error"](ip+" 서버 연결중 오류가 발생하였습니다.<br/>REST API 2.1를 확인해 주세요.");
            }else{
                toastr["error"]("An error occurred while connecting to "+ip+".<br/>Please check REST API 2.1");
            }
           eventSource.close();
           $('#mask').remove();
           callServerSSECheck(ip,count);
       };
    }
    
    function callServerSSECheck(ip,count){
        setTimeout(function() {
            if(langType == "ko"){
                toastr["warning"](ip+" 리소스 차트 재연결 시도중...");
            }else{
                toastr["warning"](ip+" Resource Chart Reconnecting...");
            }
          connectSSE(ip,count);
        }, 1000);
    }
    
    function convertSSEResponse(data, count){
        if(count == 1){sse_1.push(data);}
        if(count == 2){sse_2.push(data);}
        if(count == 3){sse_3.push(data);}
        if(count == 4){sse_4.push(data);}
        if(count == 5){sse_5.push(data);}
    }
    function drawingSSE(){
        var responseData = [];
        if(nodeCount == 1 && sse_1.length > 1){
            responseData.push(sse_1[0]);
            updateChartCpu(responseData);
            updateChartMem(responseData);
            updateChartDisk(responseData);
            sse_1.shift();
            $('#mask').remove();
        }
        if(nodeCount == 2 && sse_1.length > 1 && sse_2.length > 1){
            responseData.push(sse_1[0]);
            responseData.push(sse_2[0]);
            updateChartCpu(responseData);
            updateChartMem(responseData);
            updateChartDisk(responseData);
            sse_1.shift();
            sse_2.shift();
            $('#mask').remove();
        }
        if(nodeCount == 3 && sse_1.length > 1 && sse_2.length > 1 && sse_3.length > 1){
            responseData.push(sse_1[0]);
            responseData.push(sse_2[0]);
            responseData.push(sse_3[0]);
            updateChartCpu(responseData);
            updateChartMem(responseData);
            updateChartDisk(responseData);
            sse_1.shift();
            sse_2.shift();
            sse_3.shift();
            $('#mask').remove();
        }
        if(nodeCount == 4 && sse_1.length > 1 && sse_2.length > 1 && sse_3.length > 1 && sse_4.length > 1){
            responseData.push(sse_1[0]);
            responseData.push(sse_2[0]);
            responseData.push(sse_3[0]);
            responseData.push(sse_4[0]);
            updateChartCpu(responseData);
            updateChartMem(responseData);
            updateChartDisk(responseData);
            sse_1.shift();
            sse_2.shift();
            sse_3.shift();
            sse_4.shift();
            $('#mask').remove();
        }
        if(nodeCount == 5 && sse_1.length > 1 && sse_2.length > 1 && sse_3.length > 1 && sse_4.length > 1 && sse_5.length > 1){
            responseData.push(sse_1[0]);
            responseData.push(sse_2[0]);
            responseData.push(sse_3[0]);
            responseData.push(sse_4[0]);
            responseData.push(sse_5[0]);
            updateChartCpu(responseData);
            updateChartMem(responseData);
            updateChartDisk(responseData);
            sse_1.shift();
            sse_2.shift();
            sse_3.shift();
            sse_4.shift();
            sse_5.shift();
            $('#mask').remove();
        }
    }
    
    var disk_1 = [];
    var disk_2 = [];
    var disk_3 = [];
    var disk_4 = [];
    var disk_5 = [];
    
    function settingDataDisk(v, now) {
        var diskValue = 0;
        for(var i=0;i<v.length;i++){
            diskValue = (diskValue+v[i].usage);
        }
        var returnValue = parseInt(diskValue/v.length);
        return {
            name: now.toString(),
            value: [
                now,
                Math.round(returnValue)
            ]
        };
    }
    let nowDisk = new Date();
    function settingValueDisk(){
        nowDisk = new Date(nowDisk);
        return {
            name: nowDisk.toString(),
            value: [
                nowDisk,
                0
            ]
        };
    }
    
    function updateChartDisk(responseData){
        var now = new Date();
        var one = 360;
        now = new Date(+now + one);
        
        if(nodeCount == 1){
            disk_1.shift();
            disk_1.push(settingDataDisk(responseData[0].disk,now));
        }else if(nodeCount == 2){
            disk_1.shift();
            disk_2.shift();
            disk_1.push(settingDataDisk(responseData[0].disk,now));
            disk_2.push(settingDataDisk(responseData[1].disk,now));
        }else if(nodeCount == 3){
            disk_1.shift();
            disk_2.shift();
            disk_3.shift();
            disk_1.push(settingDataDisk(responseData[0].disk,now));
            disk_2.push(settingDataDisk(responseData[1].disk,now));
            disk_3.push(settingDataDisk(responseData[2].disk,now));
        }else if(nodeCount == 4){
            disk_1.shift();
            disk_2.shift();
            disk_3.shift();
            disk_4.shift();
            disk_1.push(settingDataDisk(responseData[0].disk,now));
            disk_2.push(settingDataDisk(responseData[1].disk,now));
            disk_3.push(settingDataDisk(responseData[2].disk,now));
            disk_4.push(settingDataDisk(responseData[3].disk,now));
        }else if(nodeCount == 5){
            disk_1.shift();
            disk_2.shift();
            disk_3.shift();
            disk_4.shift();
            disk_5.shift();
            disk_1.push(settingDataDisk(responseData[0].disk,now));
            disk_2.push(settingDataDisk(responseData[1].disk,now));
            disk_3.push(settingDataDisk(responseData[2].disk,now));
            disk_4.push(settingDataDisk(responseData[3].disk,now));
            disk_5.push(settingDataDisk(responseData[4].disk,now));
        }
        
        var chartSeries = [];
        for(var i=0;i<responseData.length;i++){
            if(i < nodeCount){
                if(i == 0)var seriesData = {"data": disk_1};
                if(i == 1)var seriesData = {"data": disk_2};
                if(i == 2)var seriesData = {"data": disk_3};
                if(i == 3)var seriesData = {"data": disk_4};
                if(i == 4)var seriesData = {"data": disk_5};
                chartSeries.push(seriesData);
            }
        }
        
        DiskChart.setOption({
            series: chartSeries
        });
    }
    
    function drawChartDisk(responseData){
        var chartDom = document.getElementById('chart3');
        DiskChart = echarts.init(chartDom);
        var option;
        for (var i = 0; i < 60; i++) {
            if(nodeCount == 1){
                disk_1.push(settingValueDisk());
            }else if(nodeCount == 2){
                disk_1.push(settingValueDisk());
                disk_2.push(settingValueDisk());
            }else if(nodeCount == 3){
                disk_1.push(settingValueDisk());
                disk_2.push(settingValueDisk());
                disk_3.push(settingValueDisk());
            }else if(nodeCount == 4){
                disk_1.push(settingValueDisk());
                disk_2.push(settingValueDisk());
                disk_3.push(settingValueDisk());
                disk_4.push(settingValueDisk());
            }else if(nodeCount == 5){
                disk_1.push(settingValueDisk());
                disk_2.push(settingValueDisk());
                disk_3.push(settingValueDisk());
                disk_4.push(settingValueDisk());
                disk_5.push(settingValueDisk());
            }
        }
        
        var chartDataName = [];
        var chartSeries = [];
        
        for(var i=0;i<responseData.length;i++){
            if(i < nodeCount){
                if(i == 0)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": disk_1,smooth: true};
                if(i == 1)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": disk_2,smooth: true, yAxisIndex : 1};
                if(i == 2)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": disk_3,smooth: true};
                if(i == 3)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": disk_4,smooth: true};
                if(i == 4)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": disk_5,smooth: true};
                chartDataName.push(responseData[i].nodeName);
                chartSeries.push(seriesData);
            }
        }
        
        option = resourceChartOption;
        option.legend.data = chartDataName;
        option.series = chartSeries;
        option && DiskChart.setOption(option);
        
        DiskChart.on('click', 'series', function (params) {
            selectNode.forEach(function(item,index,arr2){
                if(item.nodeName == params.seriesName){
                    window.location.href = "/node/"+item.nodeId+"/pipeline";
                }
            });
        });
    }
    
    var mem_1 = [];
    var mem_2 = [];
    var mem_3 = [];
    var mem_4 = [];
    var mem_5 = [];
    
    function settingDataMem(v, now) {
        return {
            name: now.toString(),
            value: [
                now,
                Math.round(v)
            ]
        };
    }
    let nowMem = new Date();
    function settingValueMem(){
        nowMem = new Date(nowMem);
        return {
            name: nowMem.toString(),
            value: [
                nowMem,
                0
            ]
        };
    }
    
    function updateChartMem(responseData){
        var now = new Date();
        var one = 360;
        now = new Date(+now + one);
        
        if(nodeCount == 1){
            mem_1.shift();
            mem_1.push(settingDataMem(responseData[0].memory,now));
        }else if(nodeCount == 2){
            mem_1.shift();
            mem_2.shift();
            mem_1.push(settingDataMem(responseData[0].memory,now));
            mem_2.push(settingDataMem(responseData[1].memory,now));
        }else if(nodeCount == 3){
            mem_1.shift();
            mem_2.shift();
            mem_3.shift();
            mem_1.push(settingDataMem(responseData[0].memory,now));
            mem_2.push(settingDataMem(responseData[1].memory,now));
            mem_3.push(settingDataMem(responseData[2].memory,now));
        }else if(nodeCount == 4){
            mem_1.shift();
            mem_2.shift();
            mem_3.shift();
            mem_4.shift();
            mem_1.push(settingDataMem(responseData[0].memory,now));
            mem_2.push(settingDataMem(responseData[1].memory,now));
            mem_3.push(settingDataMem(responseData[2].memory,now));
            mem_4.push(settingDataMem(responseData[3].memory,now));
        }else if(nodeCount == 5){
            mem_1.shift();
            mem_2.shift();
            mem_3.shift();
            mem_4.shift();
            mem_5.shift();
            mem_1.push(settingDataMem(responseData[0].memory,now));
            mem_2.push(settingDataMem(responseData[1].memory,now));
            mem_3.push(settingDataMem(responseData[2].memory,now));
            mem_4.push(settingDataMem(responseData[3].memory,now));
            mem_5.push(settingDataMem(responseData[4].memory,now));
        }
        
        var chartSeries = [];
        for(var i=0;i<responseData.length;i++){
            if(i < nodeCount){
                if(i == 0)var seriesData = {"data": mem_1};
                if(i == 1)var seriesData = {"data": mem_2};
                if(i == 2)var seriesData = {"data": mem_3};
                if(i == 3)var seriesData = {"data": mem_4};
                if(i == 4)var seriesData = {"data": mem_5};
                chartSeries.push(seriesData);
            }
        }
        
        MemoryChart.setOption({
            series: chartSeries
        });
    }
    
    function drawChartMem(responseData){
        var chartDom = document.getElementById('chart2');
        MemoryChart = echarts.init(chartDom);
        var option;
        for (var i = 0; i < 60; i++) {
            if(nodeCount == 1){
                mem_1.push(settingValueMem());
            }else if(nodeCount == 2){
                mem_1.push(settingValueMem());
                mem_2.push(settingValueMem());
            }else if(nodeCount == 3){
                mem_1.push(settingValueMem());
                mem_2.push(settingValueMem());
                mem_3.push(settingValueMem());
            }else if(nodeCount == 4){
                mem_1.push(settingValueMem());
                mem_2.push(settingValueMem());
                mem_3.push(settingValueMem());
                mem_4.push(settingValueMem());
            }else if(nodeCount == 5){
                mem_1.push(settingValueMem());
                mem_2.push(settingValueMem());
                mem_3.push(settingValueMem());
                mem_4.push(settingValueMem());
                mem_5.push(settingValueMem());
            }
        }
        
        var chartDataName = [];
        var chartSeries = [];
        
        for(var i=0;i<responseData.length;i++){
            if(i < nodeCount){
                if(i == 0)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": mem_1,smooth: true};
                if(i == 1)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": mem_2,smooth: true, yAxisIndex : 1};
                if(i == 2)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": mem_3,smooth: true};
                if(i == 3)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": mem_4,smooth: true};
                if(i == 4)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": mem_5,smooth: true};
                chartDataName.push(responseData[i].nodeName);
                chartSeries.push(seriesData);
            }
        }

        option = resourceChartOption;
        option.legend.data = chartDataName;
        option.series = chartSeries;
        option && MemoryChart.setOption(option);
        
        MemoryChart.on('click', 'series', function (params) {
            selectNode.forEach(function(item,index,arr2){
                if(item.nodeName == params.seriesName){
                    window.location.href = "/node/"+item.nodeId+"/pipeline";
                }
            });
        });
    }
    
    var cpu_1 = [];
    var cpu_2 = [];
    var cpu_3 = [];
    var cpu_4 = [];
    var cpu_5 = [];
    
    function settingDataCpu(v,now) {
        return {
            name: now.toString(),
            value: [
                now,
                Math.round(v)
            ]
        };
    }
    let nowCpu = new Date();
    function settingValueCpu(){
        nowCpu = new Date(nowCpu);
        return {
            name: nowCpu.toString(),
            value: [
                nowCpu,
                0
            ]
        };
    }
    
     function updateChartCpu(responseData){
        var now = new Date();
        var one = 360;
        now = new Date(+now + one);
        
        if(nodeCount == 1){
            cpu_1.shift();
            cpu_1.push(settingDataCpu(responseData[0].cpu, now));
        }else if(nodeCount == 2){
            cpu_1.shift();
            cpu_2.shift();
            cpu_1.push(settingDataCpu(responseData[0].cpu, now));
            cpu_2.push(settingDataCpu(responseData[1].cpu, now));
        }else if(nodeCount == 3){
            cpu_1.shift();
            cpu_2.shift();
            cpu_3.shift();
            cpu_1.push(settingDataCpu(responseData[0].cpu, now));
            cpu_2.push(settingDataCpu(responseData[1].cpu, now));
            cpu_3.push(settingDataCpu(responseData[2].cpu, now));
        }else if(nodeCount == 4){
            cpu_1.shift();
            cpu_2.shift();
            cpu_3.shift();
            cpu_4.shift();
            cpu_1.push(settingDataCpu(responseData[0].cpu, now));
            cpu_2.push(settingDataCpu(responseData[1].cpu, now));
            cpu_3.push(settingDataCpu(responseData[2].cpu, now));
            cpu_4.push(settingDataCpu(responseData[3].cpu, now));
        }else if(nodeCount == 5){
            cpu_1.shift();
            cpu_2.shift();
            cpu_3.shift();
            cpu_4.shift();
            cpu_5.shift();
            cpu_1.push(settingDataCpu(responseData[0].cpu, now));
            cpu_2.push(settingDataCpu(responseData[1].cpu, now));
            cpu_3.push(settingDataCpu(responseData[2].cpu, now));
            cpu_4.push(settingDataCpu(responseData[3].cpu, now));
            cpu_5.push(settingDataCpu(responseData[4].cpu, now));
        }
        
        var chartSeries = [];
        for(var i=0;i<responseData.length;i++){
            if(i < nodeCount){
                if(i == 0)var seriesData = {"data": cpu_1};
                if(i == 1)var seriesData = {"data": cpu_2};
                if(i == 2)var seriesData = {"data": cpu_3};
                if(i == 3)var seriesData = {"data": cpu_4};
                if(i == 4)var seriesData = {"data": cpu_5};
                chartSeries.push(seriesData);
            }
        }
        
        CpuChart.setOption({
            series: chartSeries
        });
    }
    
    function drawChartCpu(responseData){
        var chartDom = document.getElementById('chart1');
        CpuChart = echarts.init(chartDom);
        var option;
        for (var i = 0; i < 60; i++) {
            if(nodeCount == 1){
                cpu_1.push(settingValueCpu());
            }else if(nodeCount == 2){
                cpu_1.push(settingValueCpu());
                cpu_2.push(settingValueCpu());
            }else if(nodeCount == 3){
                cpu_1.push(settingValueCpu());
                cpu_2.push(settingValueCpu());
                cpu_3.push(settingValueCpu());
            }else if(nodeCount == 4){
                cpu_1.push(settingValueCpu());
                cpu_2.push(settingValueCpu());
                cpu_3.push(settingValueCpu());
                cpu_4.push(settingValueCpu());
            }else if(nodeCount == 5){
                cpu_1.push(settingValueCpu());
                cpu_2.push(settingValueCpu());
                cpu_3.push(settingValueCpu());
                cpu_4.push(settingValueCpu());
                cpu_5.push(settingValueCpu());
            }
        }
        
        var chartDataName = [];
        var chartSeries = [];
        
        for(var i=0;i<responseData.length;i++){
            if(i < nodeCount){
                if(i == 0)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": cpu_1,smooth: true};
                if(i == 1)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": cpu_2,smooth: true, yAxisIndex : 1};
                if(i == 2)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": cpu_3,smooth: true};
                if(i == 3)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": cpu_4,smooth: true};
                if(i == 4)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": cpu_5,smooth: true};
/*                Thredhold version
                if(i == 0)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": cpu_1,smooth: true, "markLine" : { data: [{ name: "", yAxis: 50, label: {formatter: '{b}', position: "middle"}, lineStyle : {type: "solid"} }] }};
                if(i == 1)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": cpu_2,smooth: true, yAxisIndex : 1, "markLine" : { data: [{ name: "", yAxis: 60, label: {formatter: '{b}', position: "middle"}, lineStyle : {type: "solid"} }] }};
                if(i == 2)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": cpu_3,smooth: true, "markLine" : { data: [{ name: "", yAxis: 70, label: {formatter: '{b}', position: "middle"}, lineStyle : {type: "solid"} }] }};
                if(i == 3)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": cpu_4,smooth: true, "markLine" : { data: [{ name: "", yAxis: 80, label: {formatter: '{b}', position: "middle"}, lineStyle : {type: "solid"} }] }};
                if(i == 4)var seriesData = {"name" : responseData[i].nodeName, "type":"line","data": cpu_5,smooth: true, "markLine" : { data: [{ name: "", yAxis: 90, label: {formatter: '{b}', position: "middle"}, lineStyle : {type: "solid"} }] }};
*/
                chartDataName.push(responseData[i].nodeName);
                chartSeries.push(seriesData);
            }
        }
        
        option = resourceChartOption;
        option.legend.data = chartDataName;
        option.series = chartSeries;
        option && CpuChart.setOption(option);
        
        CpuChart.on('click', 'series', function (params) {
            selectNode.forEach(function(item,index,arr2){
                if(item.nodeName == params.seriesName){
                    window.location.href = "/node/"+item.nodeId+"/pipeline";
                }
            });
        });
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    dashboardChart.init = function () {
        LoadingWithMask();
        setChart();
    }
    return dashboardChart;
}) (window.dashboardChart || {}, $);