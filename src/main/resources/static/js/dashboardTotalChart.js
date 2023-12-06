var dashboardTotalChart = (function (dashboardTotalChart, $) {
    
    function getHuDate(param1, param2, arr){
      var res_day = [];
      var ss_day = new Date(param1);
        var ee_day = new Date(param2);
        res_day.push(param1);
          while(ss_day.getTime() <= ee_day.getTime()){
            var _mon_ = (ss_day.getMonth()+1);
            _mon_ = _mon_ < 10 ? '0'+_mon_ : _mon_;
            var _day_ = ss_day.getDate();
            _day_ = _day_ < 10 ? '0'+_day_ : _day_;
            
            var _hour_ = ss_day.getHours();
            
            var _min_ = ss_day.getMinutes();
            if(_min_ < 59){
              _min_ = _min_ + 1;
              if(_min_ < 10){
                _min_ = '0' + _min_;
              }
            } else {
              _min_ = "00";
            }
            _min_ = "00";
            var resultDay = ss_day.getFullYear() + '-' + _mon_ + '-' +  _day_ + ' ' + _hour_ + ':' + _min_ + ':00';
            var check = false;
            arr.forEach((v) => {
              var t = v.split("|")[0];
              var hu = v.split("|")[1];
              if(t == resultDay){
                check = true;
                res_day.push(hu);
              }
            });
            if(!check){
              res_day.push("-");
            }
            ss_day.setHours(ss_day.getHours() + 1);
        }
        return res_day;
    }
    
    function totalChartDraw(result){
        var sampleList = result.sample;
        var haughUnitList = result.haughUnit;
        var loggerList = result.logger;
        var meteoroList = result.meteoro;
        
        var dom = document.getElementById('container');
        var myChart = echarts.init(dom, null, {
          renderer: 'canvas',
          useDirtyRect: false
        });
        
        /**
        기상청 데이터 x축 셋팅
         */
        var xAxis = {
            type: 'time',
            boundaryGap: false,
            axisTick: {
                        alignWithLabel: true
                    },
            axisLabel: {
                formatter: (function(value){
                    return moment(value).format('YY-MM-DD');
                })
            }
        };
        var baseTemp = [];
        var baseRh = [];
        for(var i=0;i<meteoroList.length;i++){
            var yearV = meteoroList[i].year;
            var monthV = meteoroList[i].month;
            var dayV = meteoroList[i].day;
            var hourV = meteoroList[i].hour;
            var minuteV = meteoroList[i].minute;
            var secondV = meteoroList[i].second;
            baseTemp.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,meteoroList[i].temp]);
            baseRh.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,meteoroList[i].rh]);
        }
        
        var huDataArr = [];
        var huDataArrNw = [];
        for(var i=0;i<haughUnitList.length;i++){
            var levelV = haughUnitList[i].haughUnitLevel;
            var unitOrderV = haughUnitList[i].haughUnitOrder;
            var sampleOrderV = haughUnitList[i].sampleOrder;
            var dateV = haughUnitList[i].deliveryDate;
            
            var yearV = dateV.substring(0,4);
            var monthV = dateV.substring(4,6);
            var dayV = dateV.substring(6,8);
            var hourV = dateV.substring(8,10);
            var minuteV = dateV.substring(10,12);
            var secondV = dateV.substring(12,14);
            
            var wash = false;
            for(var x=0;x<sampleList.length;x++){
                if(sampleOrderV == sampleList[x].sampleOrder){
                    var washYn = sampleList[x].washYn;
                    if(washYn == "Y"){
                        wash = true;
                    }
                }
            }
            
            var timeH = 5+i;
            
            if(!wash){
                huDataArrNw.push([yearV+"-"+monthV+"-"+dayV+" "+timeH+":00:"+secondV,levelV])
            }else{
                huDataArr.push([yearV+"-"+monthV+"-"+dayV+" "+timeH+":00:"+secondV,levelV])
            }
            
        }
        
        var sampleTempArr = [];
        var sampleRhArr = [];
        var sampleTempArrNw = [];
        var sampleRhArrNw = [];
        for(var i=0;i<sampleList.length;i++){
            var temp = sampleList[i].inTemp;
            var rh = sampleList[i].inRh;
            var washYn = sampleList[i].washYn;
            
            var dateV = sampleList[i].collectionDate;
            var yearV = dateV.substring(0,4);
            var monthV = dateV.substring(4,6);
            var dayV = dateV.substring(6,8);
            var hourV = dateV.substring(8,10);
            var minuteV = dateV.substring(10,12);
            var secondV = dateV.substring(12,14);
            if(washYn == "Y"){
                sampleTempArr.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,temp])
                sampleRhArr.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,rh])
            }else{
                sampleTempArrNw.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,temp])
                sampleRhArrNw.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,rh])
            }
            
        }
        
        var nwTemp = [];
        var nwRh = [];
        var w1Temp = [];
        var w1Rh = [];
        var w2Temp = [];
        var w2Rh = [];
        var ctTemp = [];
        
        for(var i=0;i<loggerList.length;i++){
            if(i%60 == 0){
                var yearV = loggerList[i].year;
                var monthV = loggerList[i].month;
                var dayV = loggerList[i].day;
                var hourV = loggerList[i].hour;
                var minuteV = loggerList[i].minute;
                var secondV = loggerList[i].second;
                var tempV = loggerList[i].temp;
                var rhV = loggerList[i].rh;
                var companyIdx = loggerList[i].companyIdx;
                if(companyIdx == 2){
                    w1Temp.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,tempV])
                    w1Rh.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,rhV])
                }else if(companyIdx == 4){
                    w2Temp.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,tempV])
                    w2Rh.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,rhV])
                }else if(companyIdx == 6){
                    nwTemp.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,tempV])
                    nwRh.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,rhV])
                }else{
                    ctTemp.push([yearV+"-"+monthV+"-"+dayV+" "+hourV+":"+minuteV+":"+secondV,tempV])
                }
            }
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
          series: [
            {
              name: '세척란 호우유닛',
              data: huDataArr,
              type: 'bar',
              color:'#DA8B45',
              markArea: {
                label : {position: ['102%', '50%'],color:'#DA8B45'},
                itemStyle: {
                  color: 'rgba(218, 139, 69, 0.1)'
                },
                data: [
                  [
                    {
                      name: 'A grade',
                      yAxis: '72'
                    },
                    {
                      yAxis: '100'
                    }
                  ]
                ]
              }
            },
            {
              name: '비세척란 호우유닛',
              data: huDataArrNw,
              type: 'bar',
              color:'#54B399'
            },
            {
              name: '기상청 온도',
              type: 'line',
              color: '#D36086',
              smooth: false,
              showSymbol: false,
              yAxisIndex: 1,
              data: baseTemp
            },
            /*{
              name: '기상청 습도',
              type: 'line',
              color:'#6092C0',
              smooth: true,
              yAxisIndex: 2,
              data: baseRh
            },*/
            {
              name: '세척란 시료채취 온도',
              data: sampleTempArr,
              type: 'scatter',
              color:'#DA8B45',
              yAxisIndex: 1,
              smooth: true
            },
            /*{
              name: '세척란 시료채취 습도',
              data: sampleRhArr,
              type: 'scatter',
              yAxisIndex: 2,
              smooth: true
            },*/
            {
              name: '비세척란 시료채취 온도',
              data: sampleTempArrNw,
              type: 'scatter',
              color:'#54B399',
              yAxisIndex: 1,
              smooth: true
            },
            /*{
              name: '비세척란 시료채취 습도',
              data: sampleRhArrNw,
              type: 'scatter',
              yAxisIndex: 2,
              smooth: true
            },*/
            {
              name: '비세척란창고 데이터로거 온도',
              data: nwTemp,
              type: 'line',
              yAxisIndex: 1,
              showSymbol: false,
              //color:'#D36086',
              smooth: true
            },
            
            /*{
              name: '비세척란창고 습도',
              data: nwRh,
              type: 'line',
              yAxisIndex: 2,
              //color:'#6092C0',
              smooth: true
            },*/
            {
              name: '세척란1창고 데이터로거 온도',
              data: w1Temp,
              type: 'line',
              yAxisIndex: 1,
              showSymbol: false,
              //color:'#D36086',
              smooth: true
            },
            /*{
              name: '세척란1창고 습도',
              data: w1Rh,
              type: 'line',
              yAxisIndex: 2,
              //color:'#6092C0',
              smooth: true
            },*/
            {
              name: '세척란2창고 데이터로거 온도',
              data: w2Temp,
              type: 'line',
              yAxisIndex: 1,
              showSymbol: false,
              //color:'#D36086',
              smooth: true
            }/*,
            {
              name: '세척란2창고 습도',
              data: w2Rh,
              type: 'line',
              yAxisIndex: 2,
              //color:'#6092C0',
              smooth: true
            }*/
            ,{
              name: '항온기 데이터로거 온도',
              data: ctTemp,
              type: 'line',
              yAxisIndex: 1,
              showSymbol: false,
              //color:'#D36086',
              smooth: true
            }
          ]
        };
        
        if (option && typeof option === 'object') {
          myChart.setOption(option);
        }
    
        window.addEventListener('resize', myChart.resize);
        
    }
    
    
    function settingTotalChart(){
        var option = deepExtend(ajaxOptions);
        option.URL = "/api/dashboard/total";
        option.HEADERS = getCsrfHeader();
        option.TYPE = "GET";
        option.CALLBACK = function (response) {
            totalChartDraw(response);
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            toastr["error"]("대시보드 종합 차트 오류");
        };
        ajaxWrapper.callAjax(option);
    }
    
    
    /**************************************
     * Public 함수
     * ************************************/
    dashboardTotalChart.init = function () {
        settingTotalChart();
    }
    return dashboardTotalChart;
}) (window.dashboardTotalChart || {}, $);