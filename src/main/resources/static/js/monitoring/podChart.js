var podChart = (function (podChart, $) {
    var CpuChart;
    var MemoryChart;
    var podCount = 0;
    var selectPodResponse = [];
    /**************************************
     * Private 함수
     * ************************************/
    function setPodChart(){
        $.ajax({
            url: "/api/node/" + nodeId + "/pods",
            success: function (data) {
                for (var i=0; i<data.length; i++) {
                    if("Y" == data[i].chartYn){
                        var pushData = {"podName" : data[i].name};
                        podCount++;
                        selectPodResponse.push(pushData);
                    }
                }
                if(selectPodResponse.length > 0){
                    drawChartCpu(selectPodResponse);
                    drawChartMem(selectPodResponse);
                    $('#mask').remove();
                }else{
                    $('#mask').remove();
                    if(langType == "ko"){
                        toastr["warning"]("차트에 선택된 파드가 없습니다.");
                    }else{
                        toastr["warning"]("There are no pods selected in the chart.");
                    }
                }
            }
        });
    }
    
    function updataCharts(responseData){
        var responsePodInfoList = [];
        for(var i=0;i<responseData.length;i++){
            var resPods = responseData[i].pods;
            for(var x=0;x<resPods.length;x++){
                var resPodName = resPods[x].name;
                var resPodCpu = resPods[x].cpu;
                var resPodMem = resPods[x].memory;
                
                if(null != resPodCpu && undefined != resPodCpu){
                    var pushData = {"name" : resPodName, "cpu" : resPodCpu, "memory" : resPodMem};
                    responsePodInfoList.push(pushData);
                }else{
                    var pushData = {"name" : resPodName, "cpu" : 0, "memory" : 0};
                    responsePodInfoList.push(pushData);
                }
                
            }
        }
        filterPod(responsePodInfoList, selectPodResponse);
    }
    
    function filterPod(responsePod, selectPod){
        var selectedInfo = [];
        for(var i=0;i<selectPod.length;i++){
            for(var y=0;y<responsePod.length;y++){
                var resName = responsePod[y].name;
                if(resName.startsWith(selectPod[i].podName)){
                    selectedInfo.push(responsePod[y]);
                }
            }
        }
        drawingSSE(selectedInfo);
    }
    
    function drawingSSE(selectedInfo){
        updateChartCpu(selectedInfo);
        updateChartMem(selectedInfo);
    }
    
    var podYAxis = [
        {
            type: 'value',
            position: 'right',
            max:nodePodChartMax,
            min : 0,
            alignTicks: false,
            axisLine: {
                show: true,
                lineStyle: {
                    color: "rgb(255, 255, 255)"
                }
            },
            splitLine: {
                show: true,
                lineStyle:{
                    color: 'rgba(142, 142, 142, 1)',
                    type: "dashed"
                }
            },
            axisLabel: {
                formatter: '{value}',
                color: "rgb(255, 255, 255)",
                fontSize: 12,
                fontWeight : "bolder",
                textBorderColor : "#333",
                textBorderType : "solid",
                textBorderWidth: 2
            }
        },
        {
            type: 'value',
            position: 'left',
            max:nodePodChartMax,
            min : 0,
            alignTicks: false,
            axisLine: {
                show: true,
                lineStyle: {
                    color: "rgb(255, 255, 255)"
                }
            },
            splitLine: {
                show: false,
                lineStyle:{
                    color: 'rgba(142, 142, 142, 1)',
                    type: "dashed"
                }
            },
            axisLabel: {
                formatter: '{value}',
                color: "rgb(255, 255, 255)",
                fontSize: 12,
                fontWeight : "bolder",
                textBorderColor : "#333",
                textBorderType : "solid",
                textBorderWidth: 2
            }
        }
    ];
    
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
                v
            ]
        };
    }
    var nowCpu = new Date();
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
    
    function drawChartCpu(responseData){
        var chartDom = document.getElementById('chart1');
        CpuChart = echarts.init(chartDom);
        var option;
        for (var i = 0; i < 60; i++) {
            if(podCount == 1){
                cpu_1.push(settingValueCpu());
            }else if(podCount == 2){
                cpu_1.push(settingValueCpu());
                cpu_2.push(settingValueCpu());
            }else if(podCount == 3){
                cpu_1.push(settingValueCpu());
                cpu_2.push(settingValueCpu());
                cpu_3.push(settingValueCpu());
            }else if(podCount == 4){
                cpu_1.push(settingValueCpu());
                cpu_2.push(settingValueCpu());
                cpu_3.push(settingValueCpu());
                cpu_4.push(settingValueCpu());
            }else if(podCount == 5){
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
                if(i == 0)var seriesData = {"name" : responseData[i].podName, "type":"line","data": cpu_1,smooth: true};
                if(i == 1)var seriesData = {"name" : responseData[i].podName, "type":"line","data": cpu_2, smooth: true,yAxisIndex : 1};
                if(i == 2)var seriesData = {"name" : responseData[i].podName, "type":"line","data": cpu_3, smooth: true};
                if(i == 3)var seriesData = {"name" : responseData[i].podName, "type":"line","data": cpu_4, smooth: true};
                if(i == 4)var seriesData = {"name" : responseData[i].podName, "type":"line","data": cpu_5, smooth: true};
                chartDataName.push(responseData[i].podName);
                chartSeries.push(seriesData);
        }

        option = resourceChartOption;
        option.legend.data = chartDataName;
        option.series = chartSeries;
        option.yAxis = podYAxis;
        option && CpuChart.setOption(option);
    }
    
    function updateChartCpu(responseData){
        var now = new Date();
        var one = 360;
        now = new Date(+now + one);
        if(podCount == 1){
            cpu_1.shift();
            if(responseData[0] != null){
                cpu_1.push(settingDataCpu(responseData[0].cpu, now));
            }else{
                cpu_1.push(settingDataCpu(0, now));
            }
        }else if(podCount == 2){
            cpu_1.shift();
            cpu_2.shift();
            if(responseData[0] != null){
                cpu_1.push(settingDataCpu(responseData[0].cpu, now));
            }else{
                cpu_1.push(settingDataCpu(0, now));
            }
            if(responseData[1] != null){
                cpu_2.push(settingDataCpu(responseData[1].cpu, now));
            }else{
                cpu_2.push(settingDataCpu(0, now));
            }
        }else if(podCount == 3){
            cpu_1.shift();
            cpu_2.shift();
            cpu_3.shift();
            if(responseData[0] != null){
                cpu_1.push(settingDataCpu(responseData[0].cpu, now));
            }else{
                cpu_1.push(settingDataCpu(0, now));
            }
            if(responseData[1] != null){
                cpu_2.push(settingDataCpu(responseData[1].cpu, now));
            }else{
                cpu_2.push(settingDataCpu(0, now));
            }
            if(responseData[2] != null){
                cpu_3.push(settingDataCpu(responseData[2].cpu, now));
            }else{
                cpu_3.push(settingDataCpu(0, now));
            }
        }else if(podCount == 4){
            cpu_1.shift();
            cpu_2.shift();
            cpu_3.shift();
            cpu_4.shift();
            if(responseData[0] != null){
                cpu_1.push(settingDataCpu(responseData[0].cpu, now));
            }else{
                cpu_1.push(settingDataCpu(0, now));
            }
            if(responseData[1] != null){
                cpu_2.push(settingDataCpu(responseData[1].cpu, now));
            }else{
                cpu_2.push(settingDataCpu(0, now));
            }
            if(responseData[2] != null){
                cpu_3.push(settingDataCpu(responseData[2].cpu, now));
            }else{
                cpu_3.push(settingDataCpu(0, now));
            }
            if(responseData[3] != null){
                cpu_4.push(settingDataCpu(responseData[3].cpu, now));
            }else{
                cpu_4.push(settingDataCpu(0, now));
            }
        }else if(podCount == 5){
            cpu_1.shift();
            cpu_2.shift();
            cpu_3.shift();
            cpu_4.shift();
            cpu_5.shift();
            if(responseData[0] != null){
                cpu_1.push(settingDataCpu(responseData[0].cpu, now));
            }else{
                cpu_1.push(settingDataCpu(0, now));
            }
            if(responseData[1] != null){
                cpu_2.push(settingDataCpu(responseData[1].cpu, now));
            }else{
                cpu_2.push(settingDataCpu(0, now));
            }
            if(responseData[2] != null){
                cpu_3.push(settingDataCpu(responseData[2].cpu, now));
            }else{
                cpu_3.push(settingDataCpu(0, now));
            }
            if(responseData[3] != null){
                cpu_4.push(settingDataCpu(responseData[3].cpu, now));
            }else{
                cpu_4.push(settingDataCpu(0, now));
            }
            if(responseData[4] != null){
                cpu_5.push(settingDataCpu(responseData[4].cpu, now));
            }else{
                cpu_5.push(settingDataCpu(0, now));
            }
        }
        
        var chartSeries = [];
        for(var i=0;i<responseData.length;i++){
            if(i == 0)var seriesData = {"data": cpu_1};
            if(i == 1)var seriesData = {"data": cpu_2};
            if(i == 2)var seriesData = {"data": cpu_3};
            if(i == 3)var seriesData = {"data": cpu_4};
            if(i == 4)var seriesData = {"data": cpu_5};
            chartSeries.push(seriesData);
        }
        if(podCount > 0){
        CpuChart.setOption({
            series: chartSeries
        });
        }
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
                v
            ]
        };
    }
    var nowMem = new Date();
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
    
    function drawChartMem(responseData){
        var chartDom = document.getElementById('chart2');
        MemoryChart = echarts.init(chartDom);
        var option;
        for (var i = 0; i < 60; i++) {
            if(podCount == 1){
                mem_1.push(settingValueMem());
            }else if(podCount == 2){
                mem_1.push(settingValueMem());
                mem_2.push(settingValueMem());
            }else if(podCount == 3){
                mem_1.push(settingValueMem());
                mem_2.push(settingValueMem());
                mem_3.push(settingValueMem());
            }else if(podCount == 4){
                mem_1.push(settingValueMem());
                mem_2.push(settingValueMem());
                mem_3.push(settingValueMem());
                mem_4.push(settingValueMem());
            }else if(podCount == 5){
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
                if(i == 0)var seriesData = {"name" : responseData[i].podName, "type":"line","data": mem_1,smooth: true};
                if(i == 1)var seriesData = {"name" : responseData[i].podName, "type":"line","data": mem_2,smooth: true, yAxisIndex : 1};
                if(i == 2)var seriesData = {"name" : responseData[i].podName, "type":"line","data": mem_3,smooth: true};
                if(i == 3)var seriesData = {"name" : responseData[i].podName, "type":"line","data": mem_4,smooth: true};
                if(i == 4)var seriesData = {"name" : responseData[i].podName, "type":"line","data": mem_5,smooth: true};
                chartDataName.push(responseData[i].podName);
                chartSeries.push(seriesData);
        }

        option = resourceChartOption;
        option.legend.data = chartDataName;
        option.series = chartSeries;
        option.yAxis = podYAxis;
        option && MemoryChart.setOption(option);
    }
    
    function updateChartMem(responseData){
        var now = new Date();
        var one = 360;
        now = new Date(+now + one);
        
        if(podCount == 1){
            mem_1.shift();
            if(responseData[0] != null){
                mem_1.push(settingDataMem(responseData[0].memory,now));
            }else{
                mem_1.push(settingDataMem(0,now));
            }
        }else if(podCount == 2){
            mem_1.shift();
            mem_2.shift();
            if(responseData[0] != null){
                mem_1.push(settingDataMem(responseData[0].memory,now));
            }else{
                mem_1.push(settingDataMem(0,now));
            }
            if(responseData[1] != null){
                mem_2.push(settingDataMem(responseData[1].memory,now));
            }else{
                mem_2.push(settingDataMem(0,now));
            }
        }else if(podCount == 3){
            mem_1.shift();
            mem_2.shift();
            mem_3.shift();
            if(responseData[0] != null){
                mem_1.push(settingDataMem(responseData[0].memory,now));
            }else{
                mem_1.push(settingDataMem(0,now));
            }
            if(responseData[1] != null){
                mem_2.push(settingDataMem(responseData[1].memory,now));
            }else{
                mem_2.push(settingDataMem(0,now));
            }
            if(responseData[2] != null){
                mem_3.push(settingDataMem(responseData[2].memory,now));
            }else{
                mem_3.push(settingDataMem(0,now));
            }
        }else if(podCount == 4){
            mem_1.shift();
            mem_2.shift();
            mem_3.shift();
            mem_4.shift();
            if(responseData[0] != null){
                mem_1.push(settingDataMem(responseData[0].memory,now));
            }else{
                mem_1.push(settingDataMem(0,now));
            }
            if(responseData[1] != null){
                mem_2.push(settingDataMem(responseData[1].memory,now));
            }else{
                mem_2.push(settingDataMem(0,now));
            }
            if(responseData[2] != null){
                mem_3.push(settingDataMem(responseData[2].memory,now));
            }else{
                mem_3.push(settingDataMem(0,now));
            }
            if(responseData[3] != null){
                mem_4.push(settingDataMem(responseData[3].memory,now));
            }else{
                mem_4.push(settingDataMem(0,now));
            }
        }else if(podCount == 5){
            mem_1.shift();
            mem_2.shift();
            mem_3.shift();
            mem_4.shift();
            mem_5.shift();
            if(responseData[0] != null){
                mem_1.push(settingDataMem(responseData[0].memory,now));
            }else{
                mem_1.push(settingDataMem(0,now));
            }
            if(responseData[1] != null){
                mem_2.push(settingDataMem(responseData[1].memory,now));
            }else{
                mem_2.push(settingDataMem(0,now));
            }
            if(responseData[2] != null){
                mem_3.push(settingDataMem(responseData[2].memory,now));
            }else{
                mem_3.push(settingDataMem(0,now));
            }
            if(responseData[3] != null){
                mem_4.push(settingDataMem(responseData[3].memory,now));
            }else{
                mem_4.push(settingDataMem(0,now));
            }
            if(responseData[4] != null){
                mem_5.push(settingDataMem(responseData[4].memory,now));
            }else{
                mem_5.push(settingDataMem(0,now));
            }
        }
        
        var chartSeries = [];
        for(var i=0;i<responseData.length;i++){
                if(i == 0)var seriesData = {"data": mem_1};
                if(i == 1)var seriesData = {"data": mem_2};
                if(i == 2)var seriesData = {"data": mem_3};
                if(i == 3)var seriesData = {"data": mem_4};
                if(i == 4)var seriesData = {"data": mem_5};
                chartSeries.push(seriesData);
        }
        if(podCount > 0){
        MemoryChart.setOption({
            series: chartSeries
        });
        }
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    
    podChart.updataCharts = function (responseData){
        updataCharts(responseData);
    }
    
    podChart.init = function () {
        setPodChart();
    }
    return podChart;
}) (window.podChart || {}, $);