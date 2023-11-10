var dataControl = (function (dataControl, $) {
    
    var totalComponentsList = [];
    var requiredComponentsList = [];
    var defaultList = [];
    
    var dpRequired = [];
    var dpAllList = [];
    
    var schemaVersion = 1;
    
    var templateList = [];
    var selectedPodTomlContent;
    
    function addDp(){
        var appendHtml = '';
        appendHtml += '<div>';
        appendHtml += '<form name="procDpForm" method="post">';
        appendHtml += '<div class="row-md-3 d-inline-block" style="width: 205px; margin-right:20px;">';
        appendHtml += '    <label class="form-label">dp_name';
        appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
        appendHtml += '                                       title="<b>Datapoint</b><br/><span>Datapoint name including datapoint group, dpg1.dp1</span>">';
        appendHtml += '                                       <span class="fas fa-info-circle"></span>';
        appendHtml += '                                   </button>';
        appendHtml += '    </label>';
        appendHtml += '    <input class="form-control procDpCheck" type="text" name="dp_name" value=""/>';
        appendHtml += '</div>';
        
        appendHtml += '<div class="row-md-3 d-inline-block" style="width: 205px; margin-right:20px;">';
        appendHtml += '    <label class="form-label">missing_value_replacement';
        appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
        appendHtml += '                                       title="<b>Missing value replacement</b><br/><span>Method to use to replace missing value</span>">';
        appendHtml += '                                       <span class="fas fa-info-circle"></span>';
        appendHtml += '                                   </button>';
        appendHtml += '    </label>';
        appendHtml += '    <select class="form-select" name="missing_value_replacement">';
        appendHtml += '      <option value="min" selected>min</option>';
        appendHtml += '      <option value="max">max</option>';
        appendHtml += '      <option value="mean">mean</option>';
        appendHtml += '      <option value="median">median</option>';
        appendHtml += '      <option value="mode">mode</option>';
        appendHtml += '    </select>';
        appendHtml += '</div>';
        
        appendHtml += '<div class="row-md-3 d-inline-block" style="width: 140px; margin-right:20px;">';
        appendHtml += '    <label class="form-label">enable_threshold';
        appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
        appendHtml += '                                       title="<b>Outler treatment</b><br/><span>Whether to replace outlier with threshold values</span>">';
        appendHtml += '                                       <span class="fas fa-info-circle"></span>';
        appendHtml += '                                   </button>';
        appendHtml += '    </label>';
        appendHtml += '     <div class="form-switch" style="margin-top: 5px;">';
        appendHtml += '         <input class="form-check-input" type="checkbox" name="enable_threshold" value="true"/>';
        appendHtml += '     </div>';
        appendHtml += '</div>';
        
        appendHtml += '<div class="row-md-3 d-inline-block" style="width: 120px; margin-right:20px;">';
        appendHtml += '    <label class="form-label">window_size';
        appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
        appendHtml += '                                       title="<b>Window size</b><br/><span>Number of samples to use for missing value replacement</span>">';
        appendHtml += '                                       <span class="fas fa-info-circle"></span>';
        appendHtml += '                                   </button>';
        appendHtml += '    </label>';
        appendHtml += '    <input class="form-control" type="number" name="window_size" value=""/>';
        appendHtml += '</div>';
        
        appendHtml += '<div class="row-md-3 d-inline-block" style="width: 120px; margin-right:20px;">';
        appendHtml += '    <label class="form-label">threshold_low';
        appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
        appendHtml += '                                       title="<b>Low threshold</b><br/><span>Low threshold value</span>">';
        appendHtml += '                                       <span class="fas fa-info-circle"></span>';
        appendHtml += '                                   </button>';
        appendHtml += '    </label>';
        appendHtml += '    <input class="form-control" type="number" name="threshold_low" value=""/>';
        appendHtml += '</div>';
        
        appendHtml += '<div class="row-md-3 d-inline-block" style="width: 125px;">';
        appendHtml += '    <label class="form-label">threshold_high';
        appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
        appendHtml += '                                       title="<b>High threshold</b><br/><span>High threshold value</span>">';
        appendHtml += '                                       <span class="fas fa-info-circle"></span>';
        appendHtml += '                                   </button>';
        appendHtml += '    </label>';
        appendHtml += '    <input class="form-control" type="number" name="threshold_high" value=""/>';
        appendHtml += '</div>';
        
        if(langType == "ko"){
            appendHtml += '<button class="btn btn-outline-danger mr-1 mb-1 btn-ssm" type="button" style="margin-left:10px; height: 30px;" onclick="dataControl.removeDiv(this);">삭제</button>';
        }else{
            appendHtml += '<button class="btn btn-outline-danger mr-1 mb-1 btn-ssm" type="button" style="margin-left:10px; height: 30px;" onclick="dataControl.removeDiv(this);">Delete</button>';
        }
        appendHtml += '</form>';
        appendHtml += '</div>';
        
        $("#datapointsList").append(appendHtml);
    }
    
    function makeDiv(v,k,typesMap){
        var appendHtml = "";
        appendHtml += '<div class="mb-3">';
        appendHtml += '    <label class="form-label" for="'+k+'">';
        if(Object.values(requiredComponentsList).includes(k)){
            appendHtml += '        <span class="text-danger">*</span> ';
        }else if(k == "conn_url"){
            appendHtml += '        <span class="text-danger">*</span> ';
        }else if(v.item_count_min && v.item_count_min > 0){
            appendHtml += '        <span class="text-danger">*</span> ';
        }
        appendHtml += k;
        if(v.properties && v.properties.editor && v.properties.editor.properties){
            if(v.properties.editor.properties.display_name){
                appendHtml += ' - '+v.properties.editor.properties.display_name.value;
            }
            if(v.properties.editor.properties.description){
                appendHtml += ' <br/>'+v.properties.editor.properties.description.value;
            }
        }else if(v.editor && v.editor.properties){
            if(v.editor.properties.display_name){
                appendHtml += ' - '+v.editor.properties.display_name.value;
            }
            if(v.editor.properties.description){
                appendHtml += ' <br/>'+v.editor.properties.description.value;
            }
        }else{
            if(v.properties){
                if(v.properties.display_name){
                    appendHtml += ' - '+v.properties.display_name.value;
                }
                if(v.properties.description){
                    appendHtml += ' <br/>'+v.properties.description.value;
                }
            }
        }
        
        if(v.enum){
            appendHtml += '    </label>';
            appendHtml += '    <br/>';
            v.enum.forEach(function(item){
                appendHtml += '<div class="form-check form-check-inline">';
                appendHtml += '    <input class="form-check-input" type="radio" id="'+item+'" name="'+k+'" value="'+item+'"';
                if(v.default){
                    if(v.default == item){
                        defaultList.push({"key" : k, "val" : v.default});
                        appendHtml += ' checked ';
                    }
                }
                appendHtml += ' />';
                appendHtml += '    <label class="form-check-label" for="'+item+'">'+item+'</label>';
                appendHtml += '</div>';
            });
        }else if(v.type){
            if(v.type.startsWith("$")){
                if(v.type.split("/").length > 2){
                    var searchTypeMap = typesMap[v.type.split("/")[1]][v.type.split("/")[2]];
                    if(searchTypeMap.type){
                        if(searchTypeMap.type == "array"){
                            appendHtml += '<br/>Array Type : Separate multiple values ​​with commas';
                            appendHtml += '    </label>';
                            appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" />';
                        }else{
                            checkTypeList.push({"name":k,"type":v.type.split("/")[2]});
                            appendHtml += '    </label>';
                            appendHtml += '<div>';
                            appendHtml += '<select class="form-select d-inline-block" id="'+k+'" name="'+k+'-select" onchange="protocol.changeOtherType(this)" style="width: 30%; padding: 0.3125rem 2rem 0.3125rem 1rem;">';
                            appendHtml += '    <option value="localpath" selected>local-path</option>';
                            appendHtml += '    <option value="configmap">configMap</option>';
                            appendHtml += '    <option value="secret">Secret</option>';
                            appendHtml += '</select>';
                            appendHtml += '    <input class="form-control" name="'+k+'" type="text" style="width:69%; display:inline-block;" placeholder="path value"/>';
                            appendHtml += '    <input class="form-control" name="'+k+'-name" type="text" style="width:30%; display:inline-block; margin-top: 10px;" placeholder="name value" onkeyup="allowEng(this)" onkeydown="allowEng(this)"/>';
                            appendHtml += '    <input class="form-control" name="'+k+'-sub" type="text" style="width:69%; display:inline-block;" placeholder="sub path value" readonly="true"/>';
                            appendHtml += '</div>';
                        }
                    }else if(v.type.split("/")[2] == "numeric-value"){
                        appendHtml += '    </label>';
                        appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="number" />';
                    }else{
                        appendHtml += '    </label>';
                        if(k =="out_topic"){
                            appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" ';
                            appendHtml += ' list="'+k+'_proc_datalist" autocomplete="off"/> ';
                            appendHtml += '<datalist id="'+k+'_proc_datalist">';
                            appendHtml += '</datalist>';
                        }else{
                            appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" />';
                        }
                        
                    }
                }else{
                    appendHtml += '    </label>';
                    appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" />';
                }
                
            }else if(v.type == "array"){
                appendHtml += '<br/>Array Type : Separate multiple values ​​with commas';
                appendHtml += '    </label>';
                appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" />';
            }else{
                appendHtml += '    </label>';
                if(v.type == "boolean"){
                    appendHtml += '<div class="form-check form-switch">';
                    appendHtml += '<input class="form-check-input" id="'+k+'" name="'+k+'" type="checkbox" value="true" ';
                    if(v.default != undefined && v.default == true){
                        defaultList.push({"key" : k, "val" : v.default});
                        appendHtml += ' checked ';
                    }
                    appendHtml += '/>';
                    appendHtml += '</div>';
                }else{
                    appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" ';
                    if(v.type == "string"){
                        appendHtml += ' type="text" ';
                    }else if(v.type == "integer" || v.type == "number"){
                        appendHtml += ' type="number" ';
                    }
                    if(v.max != undefined){
                        appendHtml += ' max="'+v.max+'" ';
                    }
                    if(v.min != undefined){
                        appendHtml += ' min="'+v.min+'" ';
                    }
                    if(v.default != undefined && k != "quote_string"){
                        defaultList.push({"key" : k, "val" : v.default});
                        appendHtml += ' value="'+v.default+'" ';
                    }
                    if(k == "in_queue"){
                        appendHtml += ' list="'+k+'_proc_datalist" autocomplete="off"/> ';
                        appendHtml += '<datalist id="'+k+'_proc_datalist">';
                        appendHtml += '</datalist>';
                    }else{
                        appendHtml += ' /> ';
                    }
                    if(v.regex){
                        appendHtml += ' <input type="hidden" name="regex-'+k+'" value="'+v.regex+'" />';
                    }
                }
            }
        }
        
        appendHtml += '</div>';
        return appendHtml;
    }
    
    function makeForm(searchType, mainMap, typesMap, podImageVersion){
        $("#form_dataControl").empty();
        schemaVersion = podImageVersion;
        totalComponentsList = []; // 전체 항목
        requiredComponentsList = []; // 필수 항목
        defaultList = [];
        
        dpRequired = [];
        dpAllList = [];
        
        var mainTypeMap = mainMap.types[searchType].properties;
        var requiredList = mainMap.types[searchType].properties.required;
        var appendHtml = '<input type="hidden" name="processorType" value="'+searchType+'"/>';
        
        /* 저장 시 필수 값 목록 */
        requiredList.forEach(function(element){
            requiredComponentsList.push(element);
        });
        
        Object.keys(mainTypeMap).forEach(function(k){
            if(k != "required" && k != "datapoints"){
                appendHtml += makeDiv(mainTypeMap[k],k,typesMap);
                totalComponentsList.push(k);
            }
        });
        
        otherHtml = '';
        if("data-cleanser" == searchType){
            var otherMap = mainMap.types["cleasing-params"].properties;
            dpRequired.push("dp_name");
            Object.keys(otherMap).forEach(function(k){
                if(k != "required"){
                    dpAllList.push(k);
                }
            });
            appendHtml += '<div class="mb-3">';
            appendHtml += '     <span class="form-label" for="datapoints">';
            appendHtml += '         <span class="text-danger">*</span> datapoints';
            appendHtml += '     </span>';
            appendHtml += '     <button class="btn btn-outline-primary mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" onclick="dataControl.addDp();">Add';
            appendHtml += '     </button>';
            
            appendHtml += '     <div class="tab-content border-x border-bottom p-3" id="datapointsList">';
            
            appendHtml += '<div>';
            appendHtml += '<form name="procDpForm" method="post">';
            appendHtml += '<div class="row-md-3 d-inline-block" style="width: 205px; margin-right:20px;">';
            appendHtml += '    <label class="form-label">dp_name';
            appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
            appendHtml += '                                       title="<b>Datapoint</b><br/><span>Datapoint name including datapoint group, dpg1.dp1</span>">';
            appendHtml += '                                       <span class="fas fa-info-circle"></span>';
            appendHtml += '                                   </button>';
            appendHtml += '    </label>';
            appendHtml += '    <input class="form-control procDpCheck" type="text" name="dp_name" value=""/>';
            appendHtml += '</div>';
            
            appendHtml += '<div class="row-md-3 d-inline-block" style="width: 205px; margin-right:20px;">';
            appendHtml += '    <label class="form-label">missing_value_replacement';
            appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
            appendHtml += '                                       title="<b>Missing value replacement</b><br/><span>Method to use to replace missing value</span>">';
            appendHtml += '                                       <span class="fas fa-info-circle"></span>';
            appendHtml += '                                   </button>';
            appendHtml += '    </label>';
            appendHtml += '    <select class="form-select" name="missing_value_replacement">';
            appendHtml += '      <option value="min" selected>min</option>';
            appendHtml += '      <option value="max">max</option>';
            appendHtml += '      <option value="mean">mean</option>';
            appendHtml += '      <option value="median">median</option>';
            appendHtml += '      <option value="mode">mode</option>';
            appendHtml += '    </select>';
            appendHtml += '</div>';
            
            appendHtml += '<div class="row-md-3 d-inline-block" style="width: 140px; margin-right:20px;">';
            appendHtml += '    <label class="form-label">enable_threshold';
            appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
            appendHtml += '                                       title="<b>Outler treatment</b><br/><span>Whether to replace outlier with threshold values</span>">';
            appendHtml += '                                       <span class="fas fa-info-circle"></span>';
            appendHtml += '                                   </button>';
            appendHtml += '    </label>';
            appendHtml += '     <div class="form-switch" style="margin-top: 5px;">';
            appendHtml += '         <input class="form-check-input" type="checkbox" name="enable_threshold" value="true"/>';
            appendHtml += '     </div>';
            appendHtml += '</div>';
            
            appendHtml += '<div class="row-md-3 d-inline-block" style="width: 120px; margin-right:20px;">';
            appendHtml += '    <label class="form-label">window_size';
            appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
            appendHtml += '                                       title="<b>Window size</b><br/><span>Number of samples to use for missing value replacement</span>">';
            appendHtml += '                                       <span class="fas fa-info-circle"></span>';
            appendHtml += '                                   </button>';
            appendHtml += '    </label>';
            appendHtml += '    <input class="form-control" type="number" name="window_size" value=""/>';
            appendHtml += '</div>';
            
            appendHtml += '<div class="row-md-3 d-inline-block" style="width: 120px; margin-right:20px;">';
            appendHtml += '    <label class="form-label">threshold_low';
            appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
            appendHtml += '                                       title="<b>Low threshold</b><br/><span>Low threshold value</span>">';
            appendHtml += '                                       <span class="fas fa-info-circle"></span>';
            appendHtml += '                                   </button>';
            appendHtml += '    </label>';
            appendHtml += '    <input class="form-control" type="number" name="threshold_low" value=""/>';
            appendHtml += '</div>';
            
            appendHtml += '<div class="row-md-3 d-inline-block" style="width: 125px;">';
            appendHtml += '    <label class="form-label">threshold_high';
            appendHtml += '                                   <button type="button" class="btn btn-falcon-default btn-ssm podTooltip" data-toggle="tooltip" data-html="true"';
            appendHtml += '                                       title="<b>High threshold</b><br/><span>High threshold value</span>">';
            appendHtml += '                                       <span class="fas fa-info-circle"></span>';
            appendHtml += '                                   </button>';
            appendHtml += '    </label>';
            appendHtml += '    <input class="form-control" type="number" name="threshold_high" value=""/>';
            appendHtml += '</div>';
            appendHtml += '</form>';
            appendHtml += '</div>';
            
            appendHtml += '     </div>';
            
            appendHtml += '</div>';
        }
        
        appendHtml += '<div style="text-align: right;">';
        if(langType == "ko"){
            appendHtml += '    <button class="btn btn-info mr-1 mb-1" type="button" value="'+searchType+'" onclick="dataControl.saveValidation(this.value);">저장</button>';
        }else{
            appendHtml += '    <button class="btn btn-info mr-1 mb-1" type="button" value="'+searchType+'" onclick="dataControl.saveValidation(this.value);">Save</button>';
        }
        appendHtml += '</div>';
        $("#form_dataControl").append(appendHtml);
        $('.podTooltip').tooltip({ boundary: 'window' , html : true});
    }
    
    function settingQueueList(qList){
        if(qList.length > 0){
            var appendHtml = '';
            for(var i=0;i<qList.length;i++){
                var qInfo = qList[i];
                var qGubun = qInfo.split("|")[0];
                var qType = qInfo.split("|")[1];
                var qApp = qInfo.split("|")[2];
                var qName = qInfo.split("|")[3];
                appendHtml += '<option value="'+qName+'">'+qApp+'</option>';
            }
            $("#in_queue_proc_datalist").append(appendHtml);
            $("#out_topic_proc_datalist").append(appendHtml);
        }
    }
    
    function save(parameterMap, dpList, defaultList, type){
        var param = {
            nodeAlias : $("#modalNodeAliasdataControl").val(),
            nodeIpAddress : $("#modalNodeIpAddressdataControl").val(),
            pipeName : $("#modalPipeNamedataControl").val(),
            podType: $("#modalPodTypedataControl").val(),
            podName : $("#modalPodNamedataControl").val(),
            nodeAppName : $("#modalNodeAppNamedataControl").val(),
            componentsMap : Object.fromEntries(parameterMap),
            dpList : dpList,
            defaultList : defaultList,
            schemaVersion : schemaVersion+"",
            type : type
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/"+type+"/view/save";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("스키마 toml 저장 성공.");
            }else{
                toastr["success"]("Save the schema Toml Success.");
            }
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("스키마 toml 저장 실패.");
            }else{
                toastr["error"]("Failed to save the schema Toml.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    function insertForm(orgTomlFile, searchType){
        var orgMap = orgTomlFile[searchType];
        var formName = document.forms["dataControlViewForm"];
        var arrayType = [];
        Object.keys(orgMap).forEach(function(k){
            var v = orgMap[k];
            if(typeof(v) === 'string' || typeof(v) === 'number'){
                formName.elements[k].value = v;
            }else if(typeof(v) === 'boolean'){
                formName.elements[k].checked = v;
            }else if(typeof(v) === typeof(arrayType)){
                Object.keys(v).forEach(function(vk,index){
                    if(index > 0){
                        addDp();
                    }
                    var dpMap = v[vk];
                    var dpForm = document.procDpForm;
                    var dpClassCheck = document.getElementsByClassName('procDpCheck').length;
                    if(dpClassCheck > 1){
                        dpForm = document.procDpForm[dpClassCheck-1];
                    }
                    Object.keys(dpMap).forEach(function(dpKey){
                        var dpV = dpMap[dpKey];
                        if (typeof(dpV) === 'number') {
                            dpForm.elements[dpKey].value = dpV;
                        }else if(typeof(dpV) === 'boolean'){
                            dpForm.elements[dpKey].checked = dpV;
                        }else if(typeof(dpV) === 'string'){
                            dpForm.elements[dpKey].value = dpV;
                        }
                    });
                });
            }
        });
    }
    
    function logLevelSave(){
        var param = {
            nodeAlias : $("#modalNodeAliasdataControl").val(),
            nodeIpAddress : $("#modalNodeIpAddressdataControl").val(),
            pipeName : $("#modalPipeNamedataControl").val(),
            podType: $("#modalPodTypedataControl").val(),
            podName : $("#modalPodNamedataControl").val(),
            nodeAppName : $("#modalNodeAppNamedataControl").val(),
            logLevel : $("select[name=dataControlLogLevel] option:selected").val()
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/log/level/save";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("스키마 로그 레벨 저장 성공.");
            }else{
                toastr["success"]("Save the schema Toml Log Level Success.");
            }
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("스키마 로그 레벨 저장 실패.");
            }else{
                toastr["error"]("Failed to save the schema Toml Log Level.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    function settingTemplateModal(){
        var param = {
            nodeAlias : $("#modalNodeAliasdataControl").val(),
            nodeIpAddress : $("#modalNodeIpAddressdataControl").val(),
            pipeName : $("#modalPipeNamedataControl").val(),
            podType: $("#modalPodTypedataControl").val(),
            podName : $("#modalPodNamedataControl").val(),
            nodeAppName : $("#modalNodeAppNamedataControl").val()
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/template/setting";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            templateList = [];
            selectedPodTomlContent = "";
            $("#configTagName").val("");
            $("#configSelectTemplate").empty();
            $("#configTagName").attr("readonly",false);
            if(langType == "ko"){
                $("#configTagName").attr('placeholder','저장할 태그명을 입력해주세요.');
            }else{
                $("#configTagName").attr('placeholder','Enter the tag name to save.');
            }
            let selectedPodTypeFull = $("#modalPodNamedataControl").val();
            let selectedPodType = selectedPodTypeFull.split("-")[0]+"-"+selectedPodTypeFull.split("-")[1];
            $("#configTemplateType").val(selectedPodType);
            $("#configTemplateGubun").val($("#modalPodTypedataControl").val());
            var editor1 = ace.edit("configContentBox");
            editor1.destroy();
            $("#configContentBox").html("");
            if(response.orgTomlFile){
                selectedPodTomlContent = response.orgTomlFile;
                $("#configContentBox").html(response.orgTomlFile);
            }
            let html ="";
            if(langType == "ko"){
                html += '<option value="" selected>(선택된 파드 Toml)</option>';
            }else{
                html += '<option value="" selected>(Selected Pod Toml)</option>';
            }
            if(response.templateList){
                for(idx in response.templateList){
                    if(selectedPodType == response.templateList[idx].type){
                        templateList.push(response.templateList[idx]);
                        html += '<option value="'+response.templateList[idx].tag+'">'+response.templateList[idx].tag+'</option>';
                    }
                }
            }
            $("#configSelectTemplate").append(html);
            var editor = ace.edit("configContentBox");
            if(themeType == "light"){
                editor.setTheme("ace/theme/github");
            }else{
                editor.setTheme("ace/theme/nord_dark");
            }
            editor.session.setMode("ace/mode/toml");
            $("#configTemplateModal").modal('show');
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("스키마 파일 읽기 실패.");
            }else{
                toastr["error"]("Failed to load the schema Toml.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    function revertTemplate(){
        $("#configContentBox").html(selectedPodTomlContent);
    }
    
    function callTemplate(v){
        for(idx in templateList){
            if(v == templateList[idx].tag){
                $("#configContentBox").html(templateList[idx].content);
            }
        }
    }
    
    function configTemplateSave(type, tag, content, gubun){
        let param = {
            type : type,
            tag : tag,
            content : content,
            gubun: gubun,
            nodeAlias : $("#modalNodeAliasdataControl").val(),
            nodeIpAddress : $("#modalNodeIpAddressdataControl").val(),
            pipeName : $("#modalPipeNamedataControl").val(),
            podType: $("#modalPodTypedataControl").val(),
            podName : $("#modalPodNamedataControl").val(),
            nodeAppName : $("#modalNodeAppNamedataControl").val()
        };
        let option = deepExtend({}, ajaxOptions);
        option.URL = "/api/template/apply";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(response.error){
                if(response.error == "overlap"){
                    if(langType == "ko"){
                        toastr["error"]("타입과 태그가 동일한 데이터가 존재합니다.");
                    }else{
                        toastr["error"]("Data with the same type and tag exists.");
                    }
                }
            }else{
                if(langType == "ko"){
                    toastr["success"]("toml 저장 성공.");
                }else{
                    toastr["success"]("Save the Toml Success.");
                }
                $('#configTemplateModal').modal('hide');
                dataControl.openCanvas(response.orgTomlFile);
            }
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("Toml 문법에 맞게 작성해 주세요.");
            }else{
                toastr["error"]("Please write according to the Toml syntax.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    dataControl.configTemplateSave = function(){
        let selectedTagValue = $("#configSelectTemplate").val();
        let selectedTypeValue = $("#configTemplateType").val();
        
        let newTagValue = $("#configTagName").val();
        
        let editValue = ace.edit("configContentBox").getValue();
        
        if(!isDefined(removeSpace(ace.edit("configContentBox").getValue()))){
            if(langType == "ko"){
                toastr["warning"]("내용을 입력해 주세요.");
            }else{
                toastr["warning"]("Please enter the content.");
            }
        }else{
            if(!isDefined(selectedTagValue)){
                // 신규
                if(!isDefined(newTagValue)){
                    if(langType == "ko"){
                        toastr["warning"]("명칭을 입력해 주세요.");
                    }else{
                        toastr["warning"]("Please enter the name.");
                    }
                }else{
                    // 저장
                    configTemplateSave(selectedTypeValue, newTagValue, editValue, "new");
                }
            }else{
                // 저장
                configTemplateSave(selectedTypeValue, selectedTagValue, editValue, "exist");
            }
        }
    }
    
    dataControl.configTemplateChangeEvent = function(v){
        var editor1 = ace.edit("configContentBox");
        editor1.destroy();
        $("#configContentBox").html("");
        if(!isDefined(v)){
            revertTemplate();
        }else{
            callTemplate(v);
        }
        var editor = ace.edit("configContentBox");
        if(themeType == "light"){
            editor.setTheme("ace/theme/github");
        }else{
            editor.setTheme("ace/theme/nord_dark");
        }
        editor.session.setMode("ace/mode/toml");
    }
    
    dataControl.settingTemplateModal = function(){
        settingTemplateModal();
    }
    
    dataControl.saveValidation = function(type){
        if("data-cleanser" == type){
            var parameterMap = new Map();
            var formName = document.forms["dataControlViewForm"];
            var dpList = [];
            var dpClassCheck = document.getElementsByClassName('procDpCheck');
            if(dpClassCheck.length == 1){
                for(var i=0;i<dpClassCheck.length;i++){
                    var dpMap = new Map();
                    dpAllList.forEach(function(dpKey){
                        var dpVal = document.procDpForm.elements[dpKey].value;
                        if(dpKey == "enable_threshold"){
                            if(document.procDpForm.elements[dpKey].checked){
                                dpMap.set(dpKey, "true");
                            }else{
                                dpMap.set(dpKey, "false");
                            }
                        }else{
                            if( undefined != dpRequired && Object.values(dpRequired).includes(dpKey) ){
                                if(dpKey == "length"){
                                    if($("input[name=length]").val() != ""){
                                        dpMap.set(dpKey, $("input[name=length]").val());
                                    }else{
                                        toastr["error"](dpKey+" is required.");
                                        throw new Error(dpKey+" is required.");
                                    }
                                }else{
                                    if(!isDefined(dpVal)){
                                        toastr["error"](dpKey+" is required.");
                                        throw new Error(dpKey+" is required.");
                                    }else{
                                        dpMap.set(dpKey, dpVal);
                                    }
                                }
                            }else{
                                if(isDefined(dpVal)){
                                    dpMap.set(dpKey, dpVal);
                                }
                            }
                        }
                    });
                    dpList.push(Object.fromEntries(dpMap));
                }
            }else{
                for(var i=0;i<dpClassCheck.length;i++){
                    var dpMap = new Map();
                    dpAllList.forEach(function(dpKey){
                        var dpVal = document.procDpForm[i].elements[dpKey].value;
                        if(dpKey == "enable_threshold"){
                            if(document.procDpForm[i].elements[dpKey].checked){
                                dpMap.set(dpKey, "true");
                            }else{
                                dpMap.set(dpKey, "false");
                            }
                        }else{
                            if( undefined != dpRequired && Object.values(dpRequired).includes(dpKey) ){
                                if(dpKey == "length"){
                                    if($("input[name=length]")[i].value != ""){
                                        dpMap.set(dpKey, $("input[name=length]")[i].value);
                                    }else{
                                        toastr["error"](dpKey+" is required.");
                                        throw new Error(dpKey+" is required.");
                                    }
                                }else{
                                    if(!isDefined(dpVal)){
                                        toastr["error"](dpKey+" is required.");
                                        throw new Error(dpKey+" is required.");
                                    }else{
                                        dpMap.set(dpKey, dpVal);
                                    }
                                }
                            }else{
                                if(isDefined(dpVal)){
                                    dpMap.set(dpKey, dpVal);
                                }
                            }
                        }
                        
                    });
                    dpList.push(Object.fromEntries(dpMap));
                }
            }
            
             totalComponentsList.forEach(function(componentKey){
                var componentVal = formName.elements[componentKey].value;
                if("enable" == componentKey || "accura_uid_zero_based" == componentKey || "length_include_header" == componentKey){
                    if(formName.elements[componentKey].checked){
                        parameterMap.set(componentKey, "true");
                    }else{
                        parameterMap.set(componentKey, "false");
                    }
                }else{
                    if( undefined != requiredComponentsList && Object.values(requiredComponentsList).includes(componentKey) ){
                        if(!isDefined(componentVal)){
                            toastr["error"](componentKey+" is required.");
                            throw new Error(componentKey+" is required.");
                        }else{
                            parameterMap.set(componentKey, componentVal);
                        }
                    }else{
                        if(isDefined(componentVal)){
                            parameterMap.set(componentKey, componentVal);
                        }
                    }
                }
            });
        }
        save(parameterMap, dpList, defaultList, type);
    }
    
    dataControl.openCanvas = function(orgTomlFile){
         var param = {
            nodeAlias : $("#modalNodeAliasdataControl").val(),
            nodeIpAddress : $("#modalNodeIpAddressdataControl").val(),
            pipeName : $("#modalPipeNamedataControl").val(),
            podType: $("#modalPodTypedataControl").val(),
            podName : $("#modalPodNamedataControl").val(),
            nodeAppName : $("#modalNodeAppNamedataControl").val()
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/archive/read";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            var podMainSchemaTomlName = response["image_info.toml"]["schema"].split("/")[1];
            var podImageVersion = response["image_info.toml"]["version"];
            var podMainSchemaToml = response[podMainSchemaTomlName];
            var typesToml = response["types-"+podImageVersion+".toml"];
            var searchType = podMainSchemaToml._id_.split("/")[1];
            $('#dataControlBackdrop').modal('show');
            makeForm(searchType, podMainSchemaToml, typesToml, podImageVersion);
            settingQueueList(response["qList"]);
            if(undefined != orgTomlFile){
                insertForm(orgTomlFile,searchType);
                if(undefined != orgTomlFile.log){
                    $("select[name=dataControlLogLevel]").val(orgTomlFile.log["log_level"]).prop("selected", true);
                }else{
                    $("select[name=dataControlLogLevel]").val("info").prop("selected", true);
                }
            }
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("스키마 파일 읽기 실패.");
            }else{
                toastr["error"]("Failed to load the schema Toml.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    dataControl.logLevelSave = function(){
        logLevelSave();
    }
    
    dataControl.deleteToml = function(){
        var param = {
            nodeAlias : $("#modalNodeAliasdataControl").val(),
            nodeIpAddress : $("#modalNodeIpAddressdataControl").val(),
            pipeName : $("#modalPipeNamedataControl").val(),
            podType: $("#modalPodTypedataControl").val(),
            podName : $("#modalPodNamedataControl").val(),
            nodeAppName : $("#modalNodeAppNamedataControl").val()
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/toml/delete";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            $('#processorDataTomlDeleteModal').modal('hide');
            $("#dataControlBackdropCloseBtn").trigger("click");
            draw.selectNodeRemove();
            draw.save();
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("스키마 Toml 파일 삭제 실패.");
            }else{
                toastr["error"]("Failed to delete the schema Toml.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    dataControl.deleteTomlModal = function(){
        $('#processorDataTomlDeleteModal').modal('show');
    }
    
    dataControl.addDp = function(){
        addDp();
    }
    
    dataControl.removeDiv = function(e){
        e.parentElement.remove();
    }
    
    return dataControl;
}) (window.dataControl || {}, $);