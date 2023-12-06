$(document).ready(function () {
    dashboard.init();
});

window.onload = function () {
    $('#totalBox').click(function(){
        if($(this).is(':checked')){
            $('.other').prop("checked",false);
        }
    });
    $('.other').click(function(){
        if($(this).is(':checked')){
            $('#totalBox').prop("checked",false);
        }
    });
};

var dashboard = (function (dashboard, $) {
    function goSearch(){
        var dom = document.getElementById('container');
        var myChart = echarts.init(dom, null, {
          renderer: 'canvas',
          useDirtyRect: false
        });
        myChart.clear();
        var checkArr = [];
        $(".other:checked").each(function() {
            checkArr.push($(this).val());
        });
        
        var option = deepExtend(ajaxOptions);
        option.URL = "/api/dashboard/search";
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.PARAM = JSON.stringify(checkArr);
        option.CALLBACK = function (response) {
            drawChart(response);
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            toastr["error"]("대시보드 차트 오류");
        };
        ajaxWrapper.callAjax(option);
    }
    
    function drawChart(data){
        var dom = document.getElementById('container');
        var myChart = echarts.init(dom, null, {
          renderer: 'canvas',
          useDirtyRect: false
        });
        var xAxis = {
            type: 'time',
            boundaryGap: false,
            axisTick: {
                        alignWithLabel: true
                    },
            axisLabel: {
                formatter: (function(value){
                    return moment(value).format('YY-MM-DD hh:mm');
                })
            }
        };
        var callData = [];
        var companyTempList = data.companyTempList;
        var companyRhList = data.companyRhList;
        var sampleTempList = data.sampleTempList;
        var sampleRhList = data.sampleRhList;
        var haughList = data.haughList;
        
        for(var i=0;i<haughList.length;i++){
            var ctData = haughList[i].result;
            var dateV = ctData.deliveryDate;
            var yearV = dateV.substring(0,4);
            var monthV = dateV.substring(4,6);
            var dayV = dateV.substring(6,8);
            var hourV = dateV.substring(8,10);
            var minuteV = dateV.substring(10,12);
            var secondV = dateV.substring(12,14);
            var insertData = [];
            insertData.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,ctData.haughUnitLevel]);
            callData.push(
                {
                    name: haughList[i].gubun+'-'+ctData.haughUnitOrder+'차 호우유닛',
                      type: 'bar',
                      data: insertData
                }
            );
        }
        
        for(var i=0;i<companyTempList.length;i++){
            var ctData = companyTempList[i].result;
            var insertData = [];
            for(var x=0;x<ctData.length;x++){
                insertData.push([ctData[x].year+"-"+ctData[x].month+"-"+ctData[x].day+" "+ctData[x].hour+":00:00",ctData[x].temp]);
            }
            callData.push(
                {
                    name: companyTempList[i].gubun+'-기상청 온도',
                      type: 'line',
                      smooth: false,
                      showSymbol: false,
                      yAxisIndex: 1,
                      data: insertData
                }
            );
        }
        
        for(var i=0;i<companyRhList.length;i++){
            var ctData = companyRhList[i].result;
            var insertData = [];
            for(var x=0;x<ctData.length;x++){
                insertData.push([ctData[x].year+"-"+ctData[x].month+"-"+ctData[x].day+" "+ctData[x].hour+":00:00",ctData[x].rh]);
            }
            callData.push(
                {
                    name: companyRhList[i].gubun+'-기상청 습도',
                      type: 'line',
                      smooth: false,
                      showSymbol: false,
                      yAxisIndex: 2,
                      data: insertData
                }
            );
        }
        
        for(var i=0;i<sampleTempList.length;i++){
            var ctData = sampleTempList[i].result;
            var dateV = ctData.collectionDate;
            var yearV = dateV.substring(0,4);
            var monthV = dateV.substring(4,6);
            var dayV = dateV.substring(6,8);
            var hourV = dateV.substring(8,10);
            var minuteV = dateV.substring(10,12);
            var secondV = dateV.substring(12,14);
            var insertData = [];
            insertData.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,ctData.inTemp]);
            callData.push(
                {
                    name: sampleTempList[i].gubun+'-시료채취 온도',
                      type: 'scatter',
                      smooth: false,
                      showSymbol: false,
                      yAxisIndex: 1,
                      data: insertData
                }
            );
        }
        
        for(var i=0;i<sampleRhList.length;i++){
            var ctData = sampleRhList[i].result;
            var dateV = ctData.collectionDate;
            var yearV = dateV.substring(0,4);
            var monthV = dateV.substring(4,6);
            var dayV = dateV.substring(6,8);
            var hourV = dateV.substring(8,10);
            var minuteV = dateV.substring(10,12);
            var secondV = dateV.substring(12,14);
            var insertData = [];
            insertData.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,ctData.inRh]);
            callData.push(
                {
                    name: sampleRhList[i].gubun+'-시료채취 습도',
                      type: 'scatter',
                      smooth: false,
                      showSymbol: false,
                      yAxisIndex: 2,
                      data: insertData
                }
            );
        }
        
        var app = {};
        var option;
        option = {
          legend: {
                data: null,
                type: 'scroll',
                top: "0%",
                width:'95%'
            },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          toolbox: {
            show: true,
            top:"3%",
            right:"5%",
            feature: {
                saveAsImage: { show: true }
            }
          },
          xAxis: xAxis,
          yAxis: [
            {
              type: 'value',
              name: '호우유닛',
              position: 'right',
              alignTicks: true,
              axisLabel: {
                formatter: '{value}'
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#DA8B45'
                }
              },
              splitNumber:10,
              min:50,
              max:100
            }
            ,{
            type: 'value',
            name: '온도',
            position: 'left',
            alignTicks: true,
            axisLabel: {
              formatter: '{value} °C'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#D36086'
              }
            },
            splitNumber:20,
            min:0,
            max:40
            }
            ,{
              type: 'value',
              name: '습도',
              position: 'left',
              alignTicks: true,
              offset: 50,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#6092C0'
                }
              },
              axisLabel: {
                formatter: '{value} %RH'
              },
              min:0,
              max:100
            }
          ],
          dataZoom: [
                {
                show: true,
                realtime: true,
                start: 0,
                end: 100,
                xAxisIndex: [0, 1],
                },
                {
                type: 'inside',
                realtime: true,
                start: 0,
                end: 100,
                xAxisIndex: [0, 1]
                }
            ],
          series: callData
        };
        
        if (option && typeof option === 'object') {
          myChart.setOption(option);
        }
    
        window.addEventListener('resize', myChart.resize);
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    dashboard.searchChart = function(){
        if(!$(".other").is(":checked") && !$("#totalBox").is(":checked")){
            toastr["error"]("조회할 항목을 선택해주세요.");
            return false;
        }
        
        if($("#totalBox").is(":checked")){
            location.reload();
        }else{
            goSearch();
        }
        
        
    }
    
    dashboard.init = function () {
        dashboardTotalChart.init();
    }
    return dashboard;
}) (window.dashboard || {}, $);