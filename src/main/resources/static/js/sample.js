window.onload = function () {
    sample.init();
    
    
    
    $('input[name="spawningDate"]').daterangepicker({
        singleDatePicker: true,
        locale: {
            "separator": " ~ ",                     // 시작일시와 종료일시 구분자
            "format": 'YYYYMMDD',     // 일시 노출 포맷
            "applyLabel": "확인",                    // 확인 버튼 텍스트
            "cancelLabel": "취소",                   // 취소 버튼 텍스트
            "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
            "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
        }
    });
    $('input[name="collectionDate"]').daterangepicker({
        singleDatePicker: true,
        locale: {
            "separator": " ~ ",                     // 시작일시와 종료일시 구분자
            "format": 'YYYYMMDDHHmmss',     // 일시 노출 포맷
            "applyLabel": "확인",                    // 확인 버튼 텍스트
            "cancelLabel": "취소",                   // 취소 버튼 텍스트
            "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
            "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
        },
        timePicker24Hour: true,
        timePicker: true
    });
};

var sample = (function (sample, $) {
    /**************************************
     * Private 함수
     * ************************************/
    function getSampleList(){
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/sample";
        option.HEADERS = getCsrfHeader();
        option.TYPE = "GET";
        option.CALLBACK = function (response) {
            var data = response;
            $("#dynamicTbody").empty();
            var html ="";
            for (var i=0; i<data.length; i++) {
                html += '<tr>';
                html += '   <td>'+Number(Number(i)+Number(1))+'</td>';
                html += '   <td>'+data[i].sampleNumber+'</td>';
                html += '   <td>'+data[i].eggFarmName+'('+data[i].eggNumber+')'+'</td>';
                html += '   <td>'+data[i].eggGrade+'</td>';
                html += '   <td>'+yyyymmdd(data[i].spawningDate)+'</td>';
                html += '   <td>'+yyyymmddhhmmss(data[i].collectionDate)+'</td>';
                html += '   <td>';
                html += '   <button value="'+data[i].sampleOrder+'" class="btn btn-outline-info mr-1 mb-1" type="button" onclick="sample.showModal(\'U\',this);">수정</button>';
                html += '   <button value="'+data[i].sampleOrder+'" class="btn btn-outline-danger mr-1 mb-1" type="button" onclick="sample.showModal(\'D\',this);">삭제</button>';
                html += '   </td>';
                html += '</tr>';
            }
            $("#dynamicTbody").append(html);
            settingDatatable();
        };
        option.ERROR_CALLBACK = function (response) {
            toastr["error"]("시료 결과 목록 호출 오류");
        };
        ajaxWrapper.callAjax(option);
    }
    
    function yyyymmdd(str) {
        var y = str.substr(0, 4);    
        var m = str.substr(4, 2);    
        var d = str.substr(6, 2);    
        return y+"-"+m+"-"+d;
    }
    
    function yyyymmddhhmmss(str) {
        var y = str.substr(0, 4);    
        var m = str.substr(4, 2);    
        var d = str.substr(6, 2);
        var h = str.substr(8, 2);
        var mi = str.substr(10, 2);
        var s = str.substr(12, 2);    
        return y+"-"+m+"-"+d+" "+h+":"+mi+":"+s;
    }
    
    function settingDatatable(){
        $("#downTable").DataTable({
            order: [ [ 0, "desc" ] ],
            "columnDefs": [ 
                { "orderable": true, "width": "10%", "targets": [1,3] },
                { "orderable": true, "width": "20%", "targets": [2] },
                { "orderable": true, "width": "7%", "targets": [0] },
                { "orderable": true, "width": "15%", "targets": [4,5]},
                { "orderable": false, "width": "20%", "targets": [6]}
            ],
            autoWidth: false,
            "oLanguage": {
               "sSearch": "찾기 : "
             },
            language : lang_ko
        }); 
    }
    
    function getSample(sampleOrder){
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/sample/"+sampleOrder;
        option.HEADERS = getCsrfHeader();
        option.TYPE = "GET";
        option.CALLBACK = function (response) {
            console.log(response);
            $("#sampleOrder").val(response.sample.sampleOrder);
            document.forms["sampleForm"]["companyIdx"].value = response.sample.companyIdx;
            document.forms["sampleForm"]["washYn"].value = response.sample.washYn;
            document.forms["sampleForm"]["sampleNumber"].value = response.sample.sampleNumber;
            document.forms["sampleForm"]["eggGrade"].value = response.sample.eggGrade;
            document.forms["sampleForm"]["spawningDate"].value = response.sample.spawningDate;
            document.forms["sampleForm"]["eggNumber"].value = response.sample.eggNumber;
            document.forms["sampleForm"]["eggFarmName"].value = response.sample.eggFarmName;
            document.forms["sampleForm"]["eggFarmAddr"].value = response.sample.eggFarmAddr;
            document.forms["sampleForm"]["collectionDate"].value = response.sample.collectionDate;
            document.forms["sampleForm"]["collectionInfo"].value = response.sample.collectionInfo;
            document.forms["sampleForm"]["inTemp"].value = response.sample.inTemp;
            document.forms["sampleForm"]["inRh"].value = response.sample.inRh;
            document.forms["sampleForm"]["deliveryTemp"].value = response.sample.deliveryTemp;
            document.forms["sampleForm"]["deliveryRh"].value = response.sample.deliveryRh;
            callHaughForm(response.haughUnit);
            callGermForm(response.germ);
            $('#saveModal').modal('show');
        };
        option.ERROR_CALLBACK = function (response) {
            toastr["error"]("시료채취 확인서 호출 오류");
        };
        ajaxWrapper.callAjax(option);
    }
    
    function callHaughForm(data){
        for(var i=0;i<data.length;i++){
            var result = data[i];
            var html = "";
            html += '<div class="modal-body add-haugh">';
            html += '  <div class="form-group" style="display:inline-block; width:13%;">';
            html += '    <label for="haughUnitOrder" class="col-form-label"><span style="color: red;">*</span>측정차수</label>';
            html += '    <select class="form-control" name="haughUnitOrder">';
            for(var x=1;x<11;x++){
                if(result.haughUnitOrder == x){
                    html += '        <option value="'+x+'" selected>'+x+'차</option>';
                }else{
                    html += '        <option value="'+x+'">'+x+'차</option>';
                }
            }
            html += '    </select>';
            html += '  </div>';
            html += '  <div class="form-group" style="display:inline-block; width:22%;">';
            html += '    <label for="deliveryDate" class="col-form-label"><span style="color: red;">*</span>시료전달 일시</label>';
            html += '    <input type="text" class="form-control" name="deliveryDate" value="'+result.deliveryDate+'" placeholder="20231227150000" readonly>';
            html += '  </div>';
            html += '  <div class="form-group" style="display:inline-block; width:13%;">';
            html += '    <label for="haughUnitLevel" class="col-form-label"><span style="color: red;">*</span>측정값</label>';
            html += '    <input type="text" class="form-control" name="haughUnitLevel" value="'+result.haughUnitLevel+'" placeholder="86.5">';
            html += '  </div>';
            html += '  <div class="form-group" style="display:inline-block; width:35%;">';
            html += '    <label for="experimenterInfo" class="col-form-label">측정자</label>';
            html += '    <input type="text" class="form-control" name="experimenterInfo" value="'+result.experimenterInfo+'" placeholder="에스디영농조합법인">';
            html += '  </div>';
            html += '  <div class="form-group" style="display:inline-block;">';
            html += '    <button type="button" class="btn btn-outline-danger" style="vertical-align: baseline;" onclick="sample.removeDiv(this);">삭제</button>';
            html += '  </div>';
            html += '</div>';
            $("#haughForm").append(html);
        }
        $('input[name="deliveryDate"]').daterangepicker({
            singleDatePicker: true,
            locale: {
                "separator": " ~ ",                     // 시작일시와 종료일시 구분자
                "format": 'YYYYMMDDHHmmss',     // 일시 노출 포맷
                "applyLabel": "확인",                    // 확인 버튼 텍스트
                "cancelLabel": "취소",                   // 취소 버튼 텍스트
                "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
                "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
            },
            timePicker24Hour: true,
            timePicker: true
        });
    }
    
    function addHaughForm(){
        var html = "";
        html += '<div class="modal-body add-haugh">';
        html += '  <div class="form-group" style="display:inline-block; width:13%;">';
        html += '    <label for="haughUnitOrder" class="col-form-label"><span style="color: red;">*</span>측정차수</label>';
        html += '    <select class="form-control" name="haughUnitOrder">';
        html += '        <option value="1" selected>1차</option>';
        html += '        <option value="2">2차</option>';
        html += '        <option value="3">3차</option>';
        html += '        <option value="4">4차</option>';
        html += '        <option value="5">5차</option>';
        html += '        <option value="6">6차</option>';
        html += '        <option value="7">7차</option>';
        html += '        <option value="8">8차</option>';
        html += '        <option value="9">9차</option>';
        html += '        <option value="10">10차</option>';
        html += '    </select>';
        html += '  </div>';
        html += '  <div class="form-group" style="display:inline-block; width:22%;">';
        html += '    <label for="deliveryDate" class="col-form-label"><span style="color: red;">*</span>시료전달 일시</label>';
        html += '    <input type="text" class="form-control" name="deliveryDate" placeholder="20231227150000" readonly>';
        html += '  </div>';
        html += '  <div class="form-group" style="display:inline-block; width:13%;">';
        html += '    <label for="haughUnitLevel" class="col-form-label"><span style="color: red;">*</span>측정값</label>';
        html += '    <input type="text" class="form-control" name="haughUnitLevel" placeholder="86.5">';
        html += '  </div>';
        html += '  <div class="form-group" style="display:inline-block; width:35%;">';
        html += '    <label for="experimenterInfo" class="col-form-label">측정자</label>';
        html += '    <input type="text" class="form-control" name="experimenterInfo" placeholder="에스디영농조합법인">';
        html += '  </div>';
        html += '  <div class="form-group" style="display:inline-block;">';
        html += '    <button type="button" class="btn btn-outline-danger" style="vertical-align: baseline;" onclick="sample.removeDiv(this);">삭제</button>';
        html += '  </div>';
        html += '</div>';
        $("#haughForm").append(html);
        
        $('input[name="deliveryDate"]').daterangepicker({
            singleDatePicker: true,
            locale: {
                "separator": " ~ ",                     // 시작일시와 종료일시 구분자
                "format": 'YYYYMMDDHHmmss',     // 일시 노출 포맷
                "applyLabel": "확인",                    // 확인 버튼 텍스트
                "cancelLabel": "취소",                   // 취소 버튼 텍스트
                "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
                "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
            },
            timePicker24Hour: true,
            timePicker: true
        });
    }
    
    function callGermForm(data){
        for(var i=0;i<data.length;i++){
            var result = data[i];
            var html = "";
            html += '<div class="modal-body add-germ">';
            html += '  <div class="form-group" style="display:inline-block; width:13%;">';
            html += '    <label for="haughUnitOrder" class="col-form-label"><span style="color: red;">*</span>측정차수</label>';
            html += '    <select class="form-control" name="germOrder">';
            for(var x=1;x<11;x++){
                if(result.germOrder == x){
                    html += '        <option value="'+x+'" selected>'+x+'차</option>';
                }else{
                    html += '        <option value="'+x+'">'+x+'차</option>';
                }
            }
            html += '    </select>';
            html += '  </div>';
            html += '  <div class="form-group" style="display:inline-block; width:22%;">';
            html += '    <label for="deliveryDate" class="col-form-label"><span style="color: red;">*</span>시료전달 일시</label>';
            html += '    <input type="text" class="form-control" name="deliveryDate" value="'+result.deliveryDate+'" placeholder="20231227150000" readonly>';
            html += '  </div>';
            html += '  <div class="form-group" style="display:inline-block; width:13%;">';
            html += '    <label for="normalLevel" class="col-form-label"><span style="color: red;">*</span>일반균</label>';
            html += '    <input type="text" class="form-control" name="normalLevel" value="'+result.normalLevel+'" placeholder="86.5">';
            html += '  </div>';
            html += '  <div class="form-group" style="display:inline-block; width:13%;">';
            html += '    <label for="salmonellaLevel" class="col-form-label"><span style="color: red;">*</span>살모넬라균</label>';
            html += '    <input type="text" class="form-control" name="salmonellaLevel" value="'+result.salmonellaLevel+'" placeholder="86.5">';
            html += '  </div>';
            html += '  <div class="form-group" style="display:inline-block; width:25%;">';
            html += '    <label for="experimenterInfo" class="col-form-label">측정자</label>';
            html += '    <input type="text" class="form-control" name="experimenterInfo" value="'+result.experimenterInfo+'" placeholder="에스디영농조합법인">';
            html += '  </div>';
            html += '  <div class="form-group" style="display:inline-block;">';
            html += '    <button type="button" class="btn btn-outline-danger" style="vertical-align: baseline;" onclick="sample.removeDiv(this);">삭제</button>';
            html += '  </div>';
            html += '</div>';
            $("#germForm").append(html);
        }
        $('input[name="deliveryDate"]').daterangepicker({
            singleDatePicker: true,
            locale: {
                "separator": " ~ ",                     // 시작일시와 종료일시 구분자
                "format": 'YYYYMMDDHHmmss',     // 일시 노출 포맷
                "applyLabel": "확인",                    // 확인 버튼 텍스트
                "cancelLabel": "취소",                   // 취소 버튼 텍스트
                "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
                "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
            },
            timePicker24Hour: true,
            timePicker: true
        });
    }
    
    function addGermForm(){
        var html = "";
        html += '<div class="modal-body add-germ">';
        html += '  <div class="form-group" style="display:inline-block; width:13%;">';
        html += '    <label for="haughUnitOrder" class="col-form-label"><span style="color: red;">*</span>측정차수</label>';
        html += '    <select class="form-control" name="germOrder">';
        html += '        <option value="1" selected>1차</option>';
        html += '        <option value="2">2차</option>';
        html += '        <option value="3">3차</option>';
        html += '        <option value="4">4차</option>';
        html += '        <option value="5">5차</option>';
        html += '        <option value="6">6차</option>';
        html += '        <option value="7">7차</option>';
        html += '        <option value="8">8차</option>';
        html += '        <option value="9">9차</option>';
        html += '        <option value="10">10차</option>';
        html += '    </select>';
        html += '  </div>';
        html += '  <div class="form-group" style="display:inline-block; width:22%;">';
        html += '    <label for="deliveryDate" class="col-form-label"><span style="color: red;">*</span>시료전달 일시</label>';
        html += '    <input type="text" class="form-control" name="deliveryDate" placeholder="20231227150000" readonly>';
        html += '  </div>';
        html += '  <div class="form-group" style="display:inline-block; width:13%;">';
        html += '    <label for="normalLevel" class="col-form-label"><span style="color: red;">*</span>일반균</label>';
        html += '    <input type="text" class="form-control" name="normalLevel" placeholder="86.5">';
        html += '  </div>';
        html += '  <div class="form-group" style="display:inline-block; width:13%;">';
        html += '    <label for="salmonellaLevel" class="col-form-label"><span style="color: red;">*</span>살모넬라균</label>';
        html += '    <input type="text" class="form-control" name="salmonellaLevel" placeholder="86.5">';
        html += '  </div>';
        html += '  <div class="form-group" style="display:inline-block; width:25%;">';
        html += '    <label for="experimenterInfo" class="col-form-label">측정자</label>';
        html += '    <input type="text" class="form-control" name="experimenterInfo" placeholder="에스디영농조합법인">';
        html += '  </div>';
        html += '  <div class="form-group" style="display:inline-block;">';
        html += '    <button type="button" class="btn btn-outline-danger" style="vertical-align: baseline;" onclick="sample.removeDiv(this);">삭제</button>';
        html += '  </div>';
        html += '</div>';
        $("#germForm").append(html);
        
        $('input[name="deliveryDate"]').daterangepicker({
            singleDatePicker: true,
            locale: {
                "separator": " ~ ",                     // 시작일시와 종료일시 구분자
                "format": 'YYYYMMDDHHmmss',     // 일시 노출 포맷
                "applyLabel": "확인",                    // 확인 버튼 텍스트
                "cancelLabel": "취소",                   // 취소 버튼 텍스트
                "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
                "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
            },
            timePicker24Hour: true,
            timePicker: true
        });
    }
    
    function sampleSave(){
        var param = {};
        
        var sampleFormSerializeArray = $('#sampleForm').serializeArray();
        var sampleParam = {};
        for(var i = 0; i < sampleFormSerializeArray.length; i++){
            sampleParam[sampleFormSerializeArray[i]['name']] = sampleFormSerializeArray[i]['value'];
        }
        if(isDefined($("#sampleOrder").val())){
            sampleParam["sampleOrder"] = $("#sampleOrder").val();
        }
        param["sample"] = sampleParam;
        
        var haughArray = [];
        for(var i=0;i<$(".add-haugh").length;i++){
            haughArray.push(
                {
                    haughUnitOrder : $("select[name='haughUnitOrder']").eq(i).val()
                    ,haughUnitLevel : $("#haughForm input[name='haughUnitLevel']").eq(i).val()
                    ,experimenterInfo : $("#haughForm input[name='experimenterInfo']").eq(i).val()
                    ,deliveryDate : $("#haughForm input[name='deliveryDate']").eq(i).val()
                }
            )
        }
        param["haugh"] = haughArray;
        
        var germArray = [];
        for(var i=0;i<$(".add-germ").length;i++){
            germArray.push(
                {
                    germOrder : $("select[name='germOrder']").eq(i).val()
                    ,normalLevel : $("#germForm input[name='normalLevel']").eq(i).val()
                    ,salmonellaLevel : $("#germForm input[name='salmonellaLevel']").eq(i).val()
                    ,experimenterInfo : $("#germForm input[name='experimenterInfo']").eq(i).val()
                    ,deliveryDate : $("#germForm input[name='deliveryDate']").eq(i).val()
                }
            )
        }
        param["germ"] = germArray;
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/sample/save";
        option.HEADERS = getCsrfHeader();
        option.PARAM = JSON.stringify(param);
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            location.reload();
        };
        option.ERROR_CALLBACK = function (response) {
            toastr["error"]("오류 발생");
        };
        ajaxWrapper.callAjax(option);
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    
    sample.validateForm = function(){
        
        if (!isDefined(document.forms["sampleForm"]["companyIdx"].value)) {
            toastr["warning"]("업체를 선택해 주세요.");
            return false;
        }
        if (!isDefined(document.forms["sampleForm"]["sampleNumber"].value)) {
            toastr["warning"]("시료번호를 입력해 주세요.");
            return false;
        }
        if (!isDefined(document.forms["sampleForm"]["spawningDate"].value)) {
            toastr["warning"]("산란일자를 선택해 주세요.");
            return false;
        }
        if (!isDefined(document.forms["sampleForm"]["eggNumber"].value)) {
            toastr["warning"]("난각번호를 입력해 주세요.");
            return false;
        }
        if (!isDefined(document.forms["sampleForm"]["eggFarmName"].value)) {
            toastr["warning"]("생산농가를 입력해 주세요.");
            return false;
        }
        if (!isDefined(document.forms["sampleForm"]["collectionDate"].value)) {
            toastr["warning"]("시료채취 일시를 선택해 주세요.");
            return false;
        }
        if (!isDefined(document.forms["sampleForm"]["collectionInfo"].value)) {
            toastr["warning"]("시료채취자를 입력해 주세요.");
            return false;
        }
        if (!isDefined(document.forms["sampleForm"]["inTemp"].value)) {
            toastr["warning"]("내기온도를 입력해 주세요.");
            return false;
        }else if(isNaN(document.forms["sampleForm"]["inTemp"].value)){
            toastr["warning"]("내기온도를 숫자로 입력해 주세요.");
            return false;
        }
        if (!isDefined(document.forms["sampleForm"]["inRh"].value)) {
            toastr["warning"]("내기습도를 입력해 주세요.");
            return false;
        }else if(isNaN(document.forms["sampleForm"]["inRh"].value)){
            toastr["warning"]("내기습도를 숫자로 입력해 주세요.");
            return false;
        }
        
        if(isNaN(document.forms["sampleForm"]["deliveryTemp"].value)){
            toastr["warning"]("배송온도를 숫자로 입력해 주세요.");
            return false;
        }
        if(isNaN(document.forms["sampleForm"]["deliveryRh"].value)){
            toastr["warning"]("배송습도를 숫자로 입력해 주세요.");
            return false;
        }
        
        if($(".add-haugh").length > 0){
            var isValid = true;
            $("input[name=haughUnitLevel]").each(function(i, selected){
                if(!isDefined($(selected).val())){
                    var num = i+1;
                    toastr["warning"](num+"번째 호우유닛 측정값을 입력해 주세요.");
                    isValid = false;
                }
            });
            if(!isValid){
                return false;
            }
        }
        
        if($(".add-germ").length > 0){
            var isValid = true;
            $("input[name=normalLevel]").each(function(i, selected){
                if(!isDefined($(selected).val())){
                    var num = i+1;
                    toastr["warning"](num+"번째 일반균을 입력해 주세요.");
                    isValid = false;
                }
            });
             $("input[name=salmonellaLevel]").each(function(i, selected){
                if(!isDefined($(selected).val())){
                    var num = i+1;
                    toastr["warning"](num+"번째 살모넬라균을 입력해 주세요.");
                    isValid = false;
                }
            });
            if(!isValid){
                return false;
            }
        }
        
        sampleSave();
    }
    
    sample.showModal = function(type,obj){
        $("#sampleOrder").val("");
        $("#deleteId").val("");
        if(type == "D"){
            $("#deleteId").val(obj.value);
            $('#deleteModal').modal('show');
        }else if(type == "I"){
            $('#saveModal').modal('show');
            document.getElementById('sampleForm').reset();
            document.getElementById('haughForm').reset();
            document.getElementById('germForm').reset();
            $(".add-germ").remove();
            $(".add-haugh").remove();
        }else if(type == "U"){
            document.getElementById('sampleForm').reset();
            document.getElementById('haughForm').reset();
            document.getElementById('germForm').reset();
            $(".add-germ").remove();
            $(".add-haugh").remove();
            getSample(obj.value);
        }
    }
    
    sample.delete = function(){
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/sample/delete/"+$("#deleteId").val();
        option.HEADERS = getCsrfHeader();
        option.TYPE = "DELETE";
        option.CALLBACK = function (response) {
            location.reload();
        };
        option.ERROR_CALLBACK = function (response) {
            toastr["error"]("오류 발생");
        };
        ajaxWrapper.callAjax(option);
    }
    
    sample.addHaughForm = function(){
        addHaughForm();
    }
    
    sample.addGermForm = function(){
        addGermForm();
    }
    
    sample.removeDiv = function(e){
        e.parentElement.parentElement.remove();
    }
     
    sample.init = function () {
        getSampleList();
    }
    return sample;
}) (window.sample || {}, $);