var processor = (function (processor, $) {
    
    var LocalScriptFileList;
    
    var totalComponentsList = [];
    
    var requiredComponentsList = [];
    
    var processorNameList = [];
    
    var defaultList = [];
    
    var schemaVersion = 1;
    
    var templateList = [];
    var selectedPodTomlContent;
    
    function callLocalScriptFileList(nodeAlias, nodeIpAddress){
        var param = {
            nodeIpAddress: nodeIpAddress,
            nodeAlias : nodeAlias
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/script/list";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            LocalScriptFileList = response.fileList;
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("스크립트 파일 리스트 오류.");
            }else{
                toastr["error"]("Failed to load the script file.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    function makeDiv(v,k,requiredList,typesMap){
        var appendHtml = "";
        
        appendHtml += '<div class="mb-3">';
        appendHtml += '    <label class="form-label" for="'+k+'">';
        if(undefined != requiredList && Object.values(requiredList).includes(k)){
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
        }
        
        if(v.enum){
            appendHtml += '    </label>';
            appendHtml += '    <br/>';
            v.enum.forEach(function(item){
                appendHtml += '<div class="form-check form-check-inline">';
                appendHtml += '    <input class="form-check-input" type="radio" name="'+k+'" value="'+item+'"';
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
                        }
                    }
                    appendHtml += '    </label>';
                    appendHtml += '    <input class="form-control" name="'+k+'" type="text" />';
                }
            }else if(v.type == "array"){
                if(v.item_type && v.item_type.startsWith("$")){
                    if(langType == "ko"){
                        appendHtml += '<button class="btn btn-outline-primary mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" onclick="processor.addOutTopic();">신규</button>';
                    }else{
                        appendHtml += '<button class="btn btn-outline-primary mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" onclick="processor.addOutTopic();">Add</button>';
                    }
                    appendHtml += '    </label>';
                    appendHtml += '<div class="mb-3" id="outTopicDiv">';
                    appendHtml += '<div>';
                    appendHtml += '    <label class="form-label" style="width: 40%;">';
                    appendHtml += '    port : <input class="form-control" style="width:73%; display: inline-block;" name="out_topic-port" type="text" />';
                    appendHtml += '    </label>';
                    appendHtml += '    <label class="form-label" style="width: 40%;">';
                    appendHtml += '    topic : <input class="form-control" style="width:73%; display: inline-block;" name="out_topic-topic" type="text" autocomplete="off" list="out_topic-topic_datalist"/>';
                    
                    appendHtml += '<datalist id="out_topic-topic_datalist">';
                    appendHtml += '</datalist>';
                    
                    appendHtml += '    </label>';
                    appendHtml += '</div>';
                    appendHtml += '</div>';
                }else{
                    appendHtml += '<br/>Array Type : Separate multiple values ​​with commas';
                    appendHtml += '    </label>';
                    appendHtml += '    <input class="form-control" name="'+k+'" type="text" />';
                }
            }else{
                appendHtml += '    </label>';
                if(v.type == "boolean"){
                    appendHtml += '<div class="form-check form-switch">';
                    appendHtml += '<input class="form-check-input" name="'+k+'" type="checkbox" value="true" ';
                    if(v.default != undefined && v.default == true){
                        defaultList.push({"key" : k, "val" : v.default});
                        appendHtml += ' checked ';
                    }
                    appendHtml += '/>';
                    appendHtml += '</div>';
                }else{
                    appendHtml += '    <input class="form-control" name="'+k+'" ';
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
                    if(v.default != undefined){
                        defaultList.push({"key" : k, "val" : v.default});
                        appendHtml += ' value="'+v.default+'" ';
                    }
                    if(v.value != undefined){
                        appendHtml += ' value="'+v.value+'" ';
                    }
                    if(k == "in_queue" || k == "out_topic"){
                        appendHtml += ' list="'+k+'_datalist" autocomplete="off"/> ';
                        appendHtml += '<datalist id="'+k+'_datalist">';
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
    
    function attributesMerge(type, commonMap, mainMap){
        var returnMap = new Map();
        
        if(undefined != commonMap && undefined != commonMap.types.processor){
            commonMap = commonMap.types.processor.properties;
            Object.keys(commonMap).forEach(function(key){
                returnMap.set(key, commonMap[key]);
            });
            
            if(commonMap.required){
                commonMap.required.forEach(function(element){
                    requiredComponentsList.push(element);
                });
            }
            
        }
        
        if(undefined != mainMap.types[type] && undefined != mainMap.types[type].properties){
            mainMap = mainMap.types[type].properties;
            Object.keys(mainMap).forEach(function(key){
                if(returnMap.has(key)){
                    var orgMap = returnMap.get(key);
                    Object.keys(mainMap[key]).forEach(function(el){
                        orgMap[el] = mainMap[key][el];
                        returnMap.set(key, orgMap);
                    });
                }else{
                    returnMap.set(key, mainMap[key]);
                }
            });
            
            if(mainMap.required){
                mainMap.required.forEach(function(element){
                    requiredComponentsList.push(element);
                });
            }
            
        }
        return returnMap;
    }
    
    function makeForm(type, commonMap, mainMap, typesMap, podImageVersion){
        schemaVersion = podImageVersion;
        totalComponentsList = [];
        requiredComponentsList = [];
        defaultList = [];
        var componentsMap = attributesMerge(type, commonMap, mainMap);
        var requiredList = componentsMap.get("required");
        componentsMap.delete("required");
        componentsMap.delete("editor");
        componentsMap.delete("kind");
        
        var appendHtml = "";
        $("#form_processor").empty();
        
        appendHtml += '<div class="mb-3">';
        appendHtml += '    <label class="form-label" for="name_processor">';
        appendHtml += '        <span class="text-danger">*</span>';
        appendHtml += '        processor type';
        appendHtml += '    </label>';
        appendHtml += '    <input class="form-control" name="type_processor" type="text" value="'+type+'" readOnly="true" />';
        appendHtml += '</div>';
        
        appendHtml += '<div class="mb-3">';
        appendHtml += '    <label class="form-label" for="name_processor">';
        appendHtml += '        <span class="text-danger">*</span>';
        appendHtml += '        processor name';
        appendHtml += '    </label>';
        appendHtml += '    <input class="form-control" name="name_processor" type="text" placeholder="processor name" value="" />';
        appendHtml += '    <input class="form-control" name="name_processor-org" type="hidden"/>';
        appendHtml += '</div>';
        
        var subMap;
        var subRequiredList;
        componentsMap.forEach((v, k) => {
            if(v.type && v.type.startsWith("$topic")){
                appendHtml += makeDiv(v,k,requiredList,typesMap);
                subMap = attributesMerge(v.type.split("$")[1], null, mainMap);
                subRequiredList = subMap.get("required");
                subMap.delete("required");
                subMap.delete("editor");
                appendHtml += '<div class="mb-3" style="margin-top: -1rem;">';
                subMap.forEach((v1, k1) => {
                    appendHtml += '<div class="form-check form-check-inline">';
                    appendHtml += '    <input class="form-check-input" type="radio" name="'+k+'" value="'+k1+'"';
                    appendHtml += ' />';
                    appendHtml += '    <label class="form-check-label" for="'+k1+'">'+k1+'</label>';
                    appendHtml += '</div>';
                });
                appendHtml += '    <input class="form-control" name="out_topic-val" type="text" placeholder="Out Topic Value" list="out_topic-val_datalist" autocomplete="off" value="" />';
                appendHtml += '<datalist id="out_topic-val_datalist">';
                appendHtml += '</datalist>';
                appendHtml += '</div>';
                totalComponentsList.push("out_topic-val");
            }else{
                appendHtml += makeDiv(v,k,requiredList,typesMap);
            }
            
            totalComponentsList.push(k);
            
        });
        appendHtml += '<div style="text-align: right;">';
        if(langType == "ko"){
            appendHtml += '    <button class="btn btn-info mr-1 mb-1" type="button" onclick="processor.checkValidation();">저장</button>';
        }else{
            appendHtml += '    <button class="btn btn-info mr-1 mb-1" type="button" onclick="processor.checkValidation();">Save</button>';
        }
        appendHtml += '</div>';
        totalComponentsList.push("name_processor-org");
        $("#form_processor").append(appendHtml);
    }
    
    function insertForm(orgTomlMap,pName){
        document.processorViewForm.elements["name_processor-org"].value = pName;
        document.processorViewForm.elements["name_processor"].value = pName;
        var checkType = orgTomlMap.type.split("/")[2];
        Object.keys(orgTomlMap).forEach(function(key){
            if("script-processor" == checkType){
                if(document.processorViewForm.elements[key]){
                    document.processorViewForm.elements[key].value = orgTomlMap[key];
                }
            }else if("label-router-processor" == checkType){
                if(key == "out_topic"){
                    var topicList = orgTomlMap[key];
                    for(var i=0; i<topicList.length;i++){
                        var topicMap = topicList[i];
                        if(i==0){
                            document.processorViewForm.elements["out_topic-port"].value = topicMap["port"];
                            document.processorViewForm.elements["out_topic-topic"].value = topicMap["topic"];
                        }else{
                            var appendHtml = '';
                            appendHtml += '<div>';
                            appendHtml += '    <label class="form-label" style="width: 40%;">';
                            appendHtml += '    port : <input class="form-control" style="width:73%; display: inline-block;" name="out_topic-port" type="text" value="'+topicMap["port"]+'"/>';
                            appendHtml += '    </label>';
                            appendHtml += '    <label class="form-label" style="width: 40%;">';
                            appendHtml += '    topic : <input class="form-control" style="width:73%; display: inline-block;" name="out_topic-topic" type="text" value="'+topicMap["topic"]+'" autocomplete="off" list="out_topic-topic_datalist"/>';
                            
                    
                            appendHtml += '<datalist id="out_topic-topic_datalist">';
                            appendHtml += '</datalist>';
                            
                            appendHtml += '    </label>';
                            if(langType == "ko"){
                                appendHtml += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" onclick="processor.removeDiv(this);">삭제</button>';
                            }else{
                                appendHtml += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" onclick="processor.removeDiv(this);">Delete</button>';
                            }
                            appendHtml += '</div>';
                            $("#outTopicDiv").append(appendHtml);
                        }
                    }
                }else{
                    if(document.processorViewForm.elements[key]){
                        document.processorViewForm.elements[key].value = orgTomlMap[key];
                    }
                }
            }else{
                if(key == "out_topic"){
                    Object.keys(orgTomlMap[key]).forEach(function(topicKey){
                        $("input:radio[name='out_topic']:radio[value='"+topicKey+"']").prop('checked', true); 
                        document.processorViewForm.elements["out_topic-val"].value = orgTomlMap[key][topicKey];
                    });
                }else if(key == "list"){
                    var listList = orgTomlMap[key];
                    var listVal = "";
                    for(var i=0;i<listList.length;i++){
                        if(i == 0){
                            listVal += listList[i];
                        }else{
                            listVal += ","+listList[i];
                        }
                    }
                    document.processorViewForm.elements[key].value = listVal;
                }else{
                    if(document.processorViewForm.elements[key]){
                        document.processorViewForm.elements[key].value = orgTomlMap[key];
                    }
                }
            }
        });
    }
    
    
    function checkValidation(){
        var parameterMap = new Map();
        var processorType = removeSpace(document.processorViewForm.elements["type_processor"].value);
        if(!isDefined(processorType)){
            toastr["error"]("processor type is required.");
            return false;
        }else{
            parameterMap.set("type",processorType);
        }
        var processorName = removeSpace(document.processorViewForm.elements["name_processor"].value);
        if(!isDefined(processorName)){
            toastr["error"]("processor name is required.");
            return false;
        }else{
            parameterMap.set("name",processorName);
        }
        
        totalComponentsList.forEach(function(componentKey){
            if(processorType != "label-router-processor"){
                var componentVal = document.processorViewForm.elements[componentKey].value;
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
            }else{
                if(componentKey == "out_topic"){
                    var outTopicMap = new Map();
                    var portList = new Array();
                   $("input[name=out_topic-port]").each(function(index, item){
                       portList.push($(item).val());
                   });
                   var topicList = new Array();
                   $("input[name=out_topic-topic]").each(function(index, item){
                       topicList.push($(item).val());
                   });
                   outTopicMap.set("portList",portList);
                   outTopicMap.set("topicList",topicList);
                   parameterMap.set(componentKey, Object.fromEntries(outTopicMap));
                }else{
                    var componentVal = document.processorViewForm.elements[componentKey].value;
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
            }
        });
        saveProcessorView(parameterMap, defaultList);
    }
    
    function saveProcessorView(parameterMapData, defaultList){
        var param = {
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val(),
            componentsMap : Object.fromEntries(parameterMapData),
            defaultList : defaultList,
            schemaVersion : schemaVersion+""
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/processor/view/save";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("스키마 toml 저장 성공.");
            }else{
                toastr["success"]("Save the schema Toml Success.");
            }
            $("#processorViewCloseBtn").trigger("click");
            tableSetting(response.orgTomlFile);
            pipelineSetting(response.orgTomlFile);
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
    
    function tableSetting(orgTomlMap){
        if(orgTomlMap && orgTomlMap.processors){
            var processorMapList = orgTomlMap.processors;
            $('#processorTable').DataTable().destroy();
            $("#processorTableTbody").empty();
            var appendHtml = "";
            processorNameList = [];
            Object.keys(processorMapList).forEach(function(key){
                processorNameList.push(key);
                var typeStr = processorMapList[key].type;
                appendHtml += "<tr>";
                appendHtml += "<td>"+typeStr.split("/")[2]+"</td>";
                appendHtml += "<td>"+key+"</td>";
                appendHtml += "<td>";
                if(langType == "ko"){
                    appendHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasProcessor" aria-controls="offcanvasProcessor" type="button" onclick="processor.modifyModalCall(\''+key+'\',\''+typeStr.split("/")[2]+'\');">수정</button>';
                    appendHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="processor.deleteModalCall(\''+key+'\');">삭제</button>';
                }else{
                    appendHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasProcessor" aria-controls="offcanvasProcessor" type="button" onclick="processor.modifyModalCall(\''+key+'\',\''+typeStr.split("/")[2]+'\');">Modify</button>';
                    appendHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="processor.deleteModalCall(\''+key+'\');">Delete</button>';
                }
                appendHtml += "</td>";
                appendHtml += "</tr>";
            });
            $("#processorTableTbody").append(appendHtml);
        }
        $("#processorTable").DataTable({
            order: [ [ 0, "asc" ] ],
            "columnDefs": [
                { "orderable": true, "width": "35%", "targets": [0,1] },
                { "orderable": false, "targets": [2]}
            ],
            autoWidth: false,
            info : false,
            lengthChange: false,
            "oLanguage": {
               "sSearch": "Processor Name : "
             }
             ,destory : true
        });
        var processorTable = $('#processorTable').DataTable();
        $('#processorTable_filter input').unbind().bind('keyup', function () {
            processorTable.column(1).search(this.value).draw();
        });
    }
    
    function pipelineSetting(orgTomlMap){
        var pipelineMap = orgTomlMap.pipeline;
        if(undefined != pipelineMap){
            $("#pipelineList").empty();
            var appendHtml = "";
            Object.keys(pipelineMap).forEach(function(key){
                var pipelineVal = pipelineMap[key];
                appendHtml += '<div>';
                appendHtml += '<div class="row-md-3 d-inline-block" style="width: 25%;">';
                appendHtml += '    <label class="form-label">source</label>';
                appendHtml += '    <select class="form-select" name="pipeSource">';
                appendHtml += '      <option value=""></option>';
                for(var i=0; i<processorNameList.length;i++){
                    if(processorNameList[i] == pipelineVal["source"]){
                        appendHtml += '      <option value="'+processorNameList[i]+'" selected>'+processorNameList[i]+'</option>';
                    }else{
                        appendHtml += '      <option value="'+processorNameList[i]+'">'+processorNameList[i]+'</option>';
                    }
                }
                appendHtml += '    </select>';
                appendHtml += '</div>';
                
                appendHtml += '<div class="row-md-3 d-inline-block" style="width: 25%; margin-left:10px;">';
                appendHtml += '    <label class="form-label">target</label>';
                appendHtml += '    <select class="form-select" name="pipeTarget">';
                appendHtml += '      <option value=""></option>';
                for(var i=0; i<processorNameList.length;i++){
                    if(processorNameList[i] == pipelineVal["target"]){
                        appendHtml += '      <option value="'+processorNameList[i]+'" selected>'+processorNameList[i]+'</option>';
                    }else{
                        appendHtml += '      <option value="'+processorNameList[i]+'">'+processorNameList[i]+'</option>';
                    }
                }
                appendHtml += '    </select>';
                appendHtml += '</div>';
                
                appendHtml += '<div class="row-md-3 d-inline-block" style="width: 25%; margin-left:10px;">';
                appendHtml += '    <label class="form-label">out_port</label>';
                appendHtml += '    <input class="form-control" type="text" name="pipePort" value="'+pipelineVal["out_port"]+'"/>';
                appendHtml += '</div>';
                if(langType == "ko"){
                    appendHtml += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" onclick="processor.removeDiv(this);">삭제</button>';
                }else{
                    appendHtml += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" onclick="processor.removeDiv(this);">Delete</button>';
                }
                appendHtml += '</div>';
            });
            $("#pipelineList").append(appendHtml);
        }
    }
    
    function pipelineAdd(){
        var appendHtml = "";
        appendHtml += '<div>';
        appendHtml += '<div class="row-md-3 d-inline-block" style="width: 25%;">';
        appendHtml += '    <label class="form-label">source</label>';
        appendHtml += '    <select class="form-select" name="pipeSource">';
        appendHtml += '      <option value=""></option>';
        for(var i=0; i<processorNameList.length;i++){
            appendHtml += '      <option value="'+processorNameList[i]+'">'+processorNameList[i]+'</option>';
        }
        appendHtml += '    </select>';
        appendHtml += '</div>';
        
        appendHtml += '<div class="row-md-3 d-inline-block" style="width: 25%; margin-left:10px;">';
        appendHtml += '    <label class="form-label">target</label>';
        appendHtml += '    <select class="form-select" name="pipeTarget">';
        appendHtml += '      <option value=""></option>';
        for(var i=0; i<processorNameList.length;i++){
            appendHtml += '      <option value="'+processorNameList[i]+'">'+processorNameList[i]+'</option>';
        }
        appendHtml += '    </select>';
        appendHtml += '</div>';
        
        appendHtml += '<div class="row-md-3 d-inline-block" style="width: 25%; margin-left:10px;">';
        appendHtml += '    <label class="form-label">out_port</label>';
        appendHtml += '    <input class="form-control" type="text" name="pipePort" value=""/>';
        appendHtml += '</div>';
        if(langType == "ko"){
            appendHtml += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" onclick="processor.removeDiv(this);">삭제</button>';
        }else{
            appendHtml += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" onclick="processor.removeDiv(this);">Delete</button>';
        }
        appendHtml += '</div>';
        $("#pipelineList").append(appendHtml);
    }
    
    function pipelineSave(pipelineMap){
        var param = {
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val(),
            pipelineMap : Object.fromEntries(pipelineMap),
            schemaVersion : schemaVersion+""
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/processor/view/save";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("파이프라인 저장 성공.");
            }else{
                toastr["success"]("Save Pipeline Success.");
            }
            tableSetting(response.orgTomlFile);
            pipelineSetting(response.orgTomlFile);
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
    
    function logLevelSave(){
        var param = {
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val(),
            logLevel : $("select[name=processorLogLevel] option:selected").val()
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
    
    function localValueSetting(){
         var param = {
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val()
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/archive/read";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            schemaVersion = response["image_info.toml"]["version"];
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
    
    function makeVolumeMountForm(yamlCheckList){
        var appendHtml = "";
        if(null != yamlCheckList && undefined != yamlCheckList && yamlCheckList.length > 0){
            var commonCheck = true;
            var firstCheck = true;
            for(var i=0;i<yamlCheckList.length;i++){
                if(yamlCheckList[i].gubun == "common"){
                    commonCheck = false;
                    appendHtml += '<div class="row">';
                    appendHtml += '    <div class="form-check form-check-inline">';
                    appendHtml += '        <select class="form-select d-inline-block" name="pathArrayType" style="width: 14%; padding: 0.3125rem 2rem 0.3125rem 1rem;">';
                    if(yamlCheckList[i].pathType == "localpath"){
                        if(yamlCheckList[i].type == "file-path" || yamlCheckList[i].type == "file-path-string-or-array"){
                            appendHtml += '            <option value="file-path" selected>File</option>';
                            appendHtml += '            <option value="directory">Directory</option>';
                        }else{
                            appendHtml += '            <option value="file-path">File</option>';
                            appendHtml += '            <option value="directory" selected>Directory</option>';
                        }
                    }
                    if(yamlCheckList[i].pathType == "configmap"){
                        appendHtml += '            <option value="configmap" selected>configMap</option>';
                    }else{
                        appendHtml += '            <option value="configmap">configMap</option>';
                    }
                    if(yamlCheckList[i].pathType == "secret"){
                        appendHtml += '            <option value="secret" selected>Secret</option>';
                    }else{
                        appendHtml += '            <option value="secret">Secret</option>';
                    }
                    appendHtml += '        </select>';
                    appendHtml += '        <input class="form-control" type="text" name="pathArrayName" style="width:17%; display:inline-block; margin-top: 10px;" placeholder="name value" value="'+yamlCheckList[i].pathName+'" onkeyup="allowEng(this)" onkeydown="allowEng(this)"/>';
                    appendHtml += '        <input class="form-control" type="text" name="pathArray" style="width:40%; display:inline-block;" placeholder="path value" value="'+yamlCheckList[i].path+'"/>';
                    appendHtml += '        <input class="form-control" type="text" name="pathArraySub" style="width:22%; display:inline-block;" placeholder="sub path value" value="'+yamlCheckList[i].pathSub+'"/>';
                    if(!firstCheck){
                        appendHtml += '        <button type="button" class="btn btn-outline-danger" style="margin-bottom: 5px;" onclick="this.parentNode.parentNode.removeChild(this.parentNode);">';
                        appendHtml += '            <span class="fas fa-minus mr-1"></span>';
                        appendHtml += '        </button>';
                    }else{
                        firstCheck = false;
                        appendHtml += '        <button type="button" class="btn btn-outline-primary" style="margin-bottom: 5px;" onclick="draw.addVolumeMount();">';
                        appendHtml += '            <span class="fas fa-plus mr-1"></span>';
                        appendHtml += '        </button>';
                    }
                    appendHtml += '    </div>';
                    appendHtml += '</div>';
                }
            }
            if(commonCheck){
                appendHtml += volumeMountsDefaultHtml;
            }
        }else{
            appendHtml += volumeMountsDefaultHtml;
        }
        
        $("#volumeMountsBtn").empty();
        $("#volumeMountsReset").empty();
        var btnHtml = '<button class="btn btn-info mr-1 mb-1" type="button" onclick="processor.saveMounts();">Save</button>';
        if(langType == "ko"){
            btnHtml = '<button class="btn btn-info mr-1 mb-1" type="button" onclick="processor.saveMounts();">저장</button>';
        }
        var resetHtml = '<h4 class="mb-1" id="volumeMountModalLabel" style="    display: inline-block;">VolumeMounts Setting</h4>';
        
        if(langType == "ko"){
            resetHtml = '<h4 class="mb-1" id="volumeMountModalLabel" style="    display: inline-block;">볼륨 마운트 셋팅</h4>';
            resetHtml += '<button class="btn btn-danger mr-1 mb-1" type="button" onclick="processor.resetMounts();" style="margin-left:10px;">초기화</button>';
        }else{
            resetHtml += '<button class="btn btn-danger mr-1 mb-1" type="button" onclick="processor.resetMounts();" style="margin-left:10px;">Reset</button>';
        }
        $("#volumeMountsBtn").append(btnHtml);
        $("#volumeMountsReset").append(resetHtml);
        $("#volumeMountsDiv").append(appendHtml);
    }
    
    function saveMounts(volumeMountMap){
        var param = {
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val(),
            volumeMountMap : Object.fromEntries(volumeMountMap)
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/volume/mount/save";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("볼륨 마운트 Json 저장 성공.");
            }else{
                toastr["success"]("Save the volume mount Json Success.");
            }
            $('#volumeMountModal').modal('hide');
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("볼륨 마운트 Json 저장 실패.");
            }else{
                toastr["error"]("Failed to save the volume mount Json.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    function settingOutQueueList(chkType, qList){
        if(qList.length > 0){
            var appendHtml = '';
            for(var i=0;i<qList.length;i++){
                var qInfo = qList[i];
                var qGubun = qInfo.split("|")[0];
                var qType = qInfo.split("|")[1];
                var qApp = qInfo.split("|")[2];
                var qName = qInfo.split("|")[3];
                if(qType != "protocol" && qGubun == "out"){
                    appendHtml += '<option value="'+qName+'">'+qApp+'</option>';
                }
            }
            if(chkType == "script-processor"){
                $("#out_topic_datalist").append(appendHtml);
            }else if(chkType == "label-router-processor"){
                $("#out_topic-topic_datalist").append(appendHtml);
            }else{
                $("#out_topic-val_datalist").append(appendHtml);
            }
        }
    }
    
    function settingInQueueList(chkType, qList){
        if(qList.length > 0){
            var appendHtml = '';
            for(var i=0;i<qList.length;i++){
                var qInfo = qList[i];
                var qGubun = qInfo.split("|")[0];
                var qType = qInfo.split("|")[1];
                var qApp = qInfo.split("|")[2];
                var qName = qInfo.split("|")[3];
                if(qType == "protocol" && qGubun == "out"){
                    appendHtml += '<option value="'+qName+'">'+qApp+'</option>';
                }
            }
            $("#in_queue_datalist").append(appendHtml);
        }
    }
    
    function settingTemplateModal(){
        var param = {
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val()
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
            let selectedPodTypeFull = $("#modalPodNameprocessor").val();
            let selectedPodType = selectedPodTypeFull.split("-")[0]+"-"+selectedPodTypeFull.split("-")[1];
            $("#configTemplateType").val(selectedPodType);
            $("#configTemplateGubun").val($("#modalPodTypeprocessor").val());
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
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val()
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
                processor.openCanvas(response.orgTomlFile);
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
    
    processor.configTemplateSave = function(){
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
    
    processor.configTemplateChangeEvent = function(v){
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
    
    processor.settingTemplateModal = function(){
        settingTemplateModal();
    }
    
    processor.selectInQueue = function(clickVal){
        $("input[name=in_queue]").val(clickVal);
    }
    
    processor.selectOutQueue = function(chkType, clickVal){
        if(chkType == "script-processor"){
            $("input[name=out_topic]").val(clickVal);
        }else if(chkType == "label-router-processor"){
            var lastSize = $("input[name=out_topic-topic]").length;
            document.getElementsByName("out_topic-topic")[lastSize-1].value = clickVal;
        }else{
            $("input[name=out_topic-val]").val(clickVal);
        }
        
    }
    
    processor.resetMounts = function(){
        var volumeMountMap = new Map();
        saveMounts(volumeMountMap);
    }
    
    processor.saveMounts = function(){
        var volumeMountMap = new Map();
        var pathArrayType = [];
        var pathArrayName = [];
        var pathArray = [];
        var pathArraySub = [];
        
        var checkPathArrayName = [];
        var checkPathArray = [];
        
        $("select[name=pathArrayType] option:selected").each(function(i, selected){
            pathArrayType.push($(selected).val());
        });
        $("input[name=pathArrayName]").each(function(i, selected){
            if($(selected).val() != ""){
                pathArrayName.push($(selected).val());
            }else{
                checkPathArrayName.push(i);
            }
        });
        $("input[name=pathArray]").each(function(i, selected){
            if($(selected).val() != ""){
                pathArray.push($(selected).val());
            }else{
                checkPathArray.push(i);
            }
        });
        $("input[name=pathArraySub]").each(function(i, selected){
            pathArraySub.push($(selected).val());
        });
        
        
        if(checkPathArrayName.length > 0){
            for(var i=0;i<checkPathArrayName.length;i++){
                var checkNum = ++checkPathArrayName[i];
                if(langType == "ko"){
                    toastr["error"](checkNum+"번째 이름을 입력해 주세요.");
                    throw new Error(checkNum+"번째 이름을 입력해 주세요.");
                }else{
                    toastr["error"](checkNum+"th name value is required.");
                    throw new Error(checkNum+"th name value is required.");
                }
            }
        }
        
        if(checkPathArray.length > 0){
            for(var i=0;i<checkPathArray.length;i++){
                var checkNum = ++checkPathArray[i];
                if(langType == "ko"){
                    toastr["error"](checkNum+"번째 경로를 입력해 주세요.");
                    throw new Error(checkNum+"번째 경로를 입력해 주세요.");
                }else{
                    toastr["error"](checkNum+"th path value is required.");
                    throw new Error(checkNum+"th path value is required.");
                }
            }
        }
        
        volumeMountMap.set("pathArrayType",pathArrayType);
        volumeMountMap.set("pathArrayName",pathArrayName);
        volumeMountMap.set("pathArray",pathArray);
        volumeMountMap.set("pathArraySub",pathArraySub);
        saveMounts(volumeMountMap);
    }
    
    processor.logLevelSave = function(){
        logLevelSave();
    }
    
    processor.volumeMountModal = function(){
        var param = {
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val()
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/archive/read";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            $('#volumeMountModal').modal('show');
            var yamlCheckList = response["yamlCheckList"];
            $("#volumeMountsDiv").empty();
            $("#volumeMountsBtn").empty();
            makeVolumeMountForm(yamlCheckList);
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
    
    processor.pipelineSave = function(){
        var pipelineMap = new Map();
        var pipeSource = [];
        var pipeTarget = [];
        var pipePort = [];
        $("select[name=pipeSource] option:selected").each(function(i, selected){
            if($(selected).val() == ""){
                var num = ++i;
                toastr["warning"](num+"th source is required.");
                throw new Error(num+"th source is required.");
            }else{
                pipeSource.push($(selected).val());
            }
        });
        $("select[name=pipeTarget] option:selected").each(function(i, selected){
            pipeTarget.push($(selected).val());
        });
        $("input[name=pipePort]").each(function(i, selected){
            pipePort.push($(selected).val());
        });
        
        pipelineMap.set("pipeSource",pipeSource);
        pipelineMap.set("pipeTarget",pipeTarget);
        pipelineMap.set("pipePort",pipePort);
        
        pipelineSave(pipelineMap);
    }
    
    processor.pipelineAdd = function(){
        pipelineAdd();
    }
    
    processor.deleteModalCall = function(pName){
        $("#processorDeleteName").val(pName);
        $('#processorDeleteModal').modal('show');
    }
    
    processor.processorSingleDelete = function(){
        var pName = $("#processorDeleteName").val();
        
        var param = {
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val(),
            deleteName : pName
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/processor/view/save";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            $('#processorDeleteModal').modal('hide');
            tableSetting(response.orgTomlFile);
            pipelineSetting(response.orgTomlFile);
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("스키마 Toml 파일 저장 실패.");
            }else{
                toastr["error"]("Failed to save the schema Toml.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    processor.modifyModalCall = function(pName, chkType){
        var param = {
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val()
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
            var typesToml;
            if(null != response["types-2.toml"] && undefined != response["types-2.toml"]){
                typesToml = response["types-2.toml"];
            }else{
                typesToml = response["types-1.toml"];
            }
            
            var commonSchemaToml;
            if(null != response["processor-2.toml"] && undefined != response["processor-2.toml"]){
                commonSchemaToml = response["processor-2.toml"];
            }else{
                commonSchemaToml = response["processor-1.toml"];
            }
            
            makeForm(chkType, commonSchemaToml, podMainSchemaToml, typesToml, podImageVersion);
            settingOutQueueList(chkType,response["qList"]);
            settingInQueueList(chkType,response["qList"]);
            var orgToml = response.orgTomlFile.processors[pName];
            insertForm(orgToml,pName);
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
    
    processor.checkValidation = function(){
        checkValidation();
    }
    
    processor.openCanvas = function(orgTomlMap){
        callLocalScriptFileList($("#modalNodeAliasprocessor").val(), $("#modalNodeIpAddressprocessor").val());
        tableSetting(orgTomlMap);
        if(undefined != orgTomlMap){
            pipelineSetting(orgTomlMap);
            if(undefined != orgTomlMap.log){
                $("select[name=processorLogLevel]").val(orgTomlMap.log["log_level"]).prop("selected", true);
            }else{
                $("select[name=processorLogLevel]").val("info").prop("selected", true);
            }
        }
        localValueSetting();
        $('#processorBackdrop').modal('show');
    }
    
    processor.openCanvasView = function(){
        var chkType = $("input[name='processorType']:checked").val();
         
         var param = {
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val()
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
            
            var typesToml;
            if(null != response["types-2.toml"] && undefined != response["types-2.toml"]){
                typesToml = response["types-2.toml"];
            }else{
                typesToml = response["types-1.toml"];
            }
            
            var commonSchemaToml;
            if(null != response["processor-2.toml"] && undefined != response["processor-2.toml"]){
                commonSchemaToml = response["processor-2.toml"];
            }else{
                commonSchemaToml = response["processor-1.toml"];
            }
            
            makeForm(chkType, commonSchemaToml, podMainSchemaToml, typesToml, podImageVersion);
            settingOutQueueList(chkType,response["qList"]);
            settingInQueueList(chkType,response["qList"]);
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
    
    processor.deleteToml = function(){
        var param = {
            nodeAlias : $("#modalNodeAliasprocessor").val(),
            nodeIpAddress : $("#modalNodeIpAddressprocessor").val(),
            pipeName : $("#modalPipeNameprocessor").val(),
            podType: $("#modalPodTypeprocessor").val(),
            podName : $("#modalPodNameprocessor").val(),
            nodeAppName : $("#modalNodeAppNameprocessor").val()
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/toml/delete";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            $('#processorTomlDeleteModal').modal('hide');
            $("#processorBackdropCloseBtn").trigger("click");
            draw.selectNodeRemove();
            draw.save();
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
    
    processor.deleteTomlModal = function(){
        $('#processorTomlDeleteModal').modal('show');
    }
    
    processor.addOutTopic = function(){
        var appendHtml = '';
        appendHtml += '<div>';
        appendHtml += '    <label class="form-label" style="width: 40%;">';
        appendHtml += '    port : <input class="form-control" style="width:73%; display: inline-block;" name="out_topic-port" type="text" />';
        appendHtml += '    </label>';
        appendHtml += '    <label class="form-label" style="width: 40%;">';
        appendHtml += '    topic : <input class="form-control" style="width:73%; display: inline-block;" name="out_topic-topic" type="text" autocomplete="off" list="out_topic-topic_datalist"/>';
        appendHtml += '<datalist id="out_topic-topic_datalist">';
        appendHtml += '</datalist>';
        appendHtml += '    </label>';
        if(langType == "ko"){
            appendHtml += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" onclick="processor.removeDiv(this);">삭제</button>';
        }else{
            appendHtml += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="margin-left:10px;" onclick="processor.removeDiv(this);">Delete</button>';
        }
        appendHtml += '</div>';
        $("#outTopicDiv").append(appendHtml);
    }
    
    processor.closeFunc = function(){
        $('#processorTable').DataTable().destroy();
        $("#processorTableTbody").empty();
        $("#pipelineList").empty();
    }
    
    processor.removeDiv = function(e){
        e.parentElement.remove();
    }
    
    return processor;
}) (window.processor || {}, $);