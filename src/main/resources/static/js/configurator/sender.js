var sender = (function (sender, $) {
    
    var responseMap;
    var typesMapGlobal;
    
    var totalComponentsList = [];
    var requiredComponentsList = [];
    var tlsComponentsList = [];
    var qTlsComponentsList = [];
    
    var formatterAllList = [];
    var formatterRequiredList = [];
    
    var stringList = [];
    var integerList = [];
    var booleanList = [];
    var arrayList = [];
    
    var defaultList = [];
    
    var checkTypeList = [];
    var reqCheckTypeList = [];
    
    var qCheckTypeList = [];
    var qReqCheckTypeList = [];
    
    var schemaVersion = 1;
    
    var templateList = [];
    var selectedPodTomlContent;
    
    var mainMapTypes;
    var innerItems = [];
    var typesMapLocal;
    
    function makeDiv(v,k,requiredList,typesMap, qTlsCheck){
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
            if(v.properties.editor.properties.display_name) appendHtml += ' - '+v.properties.editor.properties.display_name.value;
            if(v.properties.editor.properties.description) appendHtml += ' <br/>'+v.properties.editor.properties.description.value;
        }else if(v.editor && v.editor.properties){
            if(v.editor.properties.display_name) appendHtml += ' - '+v.editor.properties.display_name.value;
            if(v.editor.properties.description) appendHtml += ' <br/>'+v.editor.properties.description.value;
        }else if(v.properties){
            if(v.properties.display_name) appendHtml += ' - '+v.properties.display_name.value;
            if(v.properties.description) appendHtml += ' <br/>'+v.properties.description.value;
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
            stringList.push(k);
        }else if(v.type){
            if(v.type.startsWith("$")){
                if(v.type.split("/").length > 2){
                    var searchTypeMap = typesMap[v.type.split("/")[1]][v.type.split("/")[2]];
                    if(searchTypeMap.type){
                        if(searchTypeMap.type == "array"){
                            appendHtml += '<br/>Array Type : Separate multiple values ​​with commas';
                            appendHtml += '    </label>';
                            appendHtml += '    <input class="form-control" name="'+k+'" type="text" />';
                            arrayList.push(k);
                        }else{
                            if(!qTlsCheck){
                                checkTypeList.push({"name":k,"type":v.type.split("/")[2]});
                            }
                            qCheckTypeList.push({"name":k,"type":v.type.split("/")[2]});
                            
                            stringList.push(k);
                            appendHtml += '<br/><span style="color: red;">VolumeMounts Setting is required when using</span>';
                            appendHtml += '    </label>';
                            if(v.default){
                                appendHtml += '    <input class="form-control" name="'+k+'" type="text" value="'+v.default+'"/>';
                            }else{
                                appendHtml += '    <input class="form-control" name="'+k+'" type="text" />';
                            }
                            /*
                            stringList.push(k);
                            appendHtml += '    </label>';
                            appendHtml += '<div>';
                            appendHtml += '<select class="form-select d-inline-block" name="'+k+'-select"  style="width: 30%; padding: 0.3125rem 2rem 0.3125rem 1rem;">';
                            appendHtml += '    <option value="localpath" selected>local-path</option>';
                            appendHtml += '    <option value="configmap">configMap</option>';
                            appendHtml += '    <option value="secret">Secret</option>';
                            appendHtml += '</select>';
                            if(v.default){
                                appendHtml += '    <input class="form-control" name="'+k+'" type="text" style="width:69%; display:inline-block;" value="'+v.default+'"/>';
                            }else{
                                appendHtml += '    <input class="form-control" name="'+k+'" type="text" style="width:69%; display:inline-block;" placeholder="path value"/>';
                            }
                            
                            appendHtml += '    <input class="form-control" name="'+k+'-name" type="text" style="width:30%; display:inline-block; margin-top: 10px;" placeholder="name value" onkeyup="allowEng(this)" onkeydown="allowEng(this)"/>';
                            appendHtml += '    <input class="form-control" name="'+k+'-sub" type="text" style="width:69%; display:inline-block;" placeholder="sub path value" />';
                            appendHtml += '</div>';
                            */
                        }
                    }else{
                        stringList.push(k);
                        appendHtml += '    </label>';
                        if(v.default){
                            appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" value="'+v.default+'"/>';
                        }else{
                            appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" />';
                        }
                    }
                }else{
                    stringList.push(k);
                    appendHtml += '    </label>';
                    appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" />';
                }
            }else if(v.type == "array"){
                if(v.item_type){
                    totalComponentsList = totalComponentsList.filter((element) => element !== k);
                    innerItems.push(v.item_type);
                    appendHtml += '    </label>';
                    appendHtml += '    <div id="item-'+v.item_type.split("$")[1]+'" class="border">';
                    appendHtml += '    </div>';
                }else{
                    appendHtml += '<br/>Array Type : Separate multiple values ​​with commas';
                    appendHtml += '    </label>';
                    appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" />';
                    arrayList.push(k);
                }
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
                    booleanList.push(k);
                }else{
                    appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" ';
                    if(v.type == "string"){
                        appendHtml += ' type="text" ';
                        stringList.push(k);
                    }else if(v.type == "integer" || v.type == "number"){
                        appendHtml += ' type="number" ';
                        integerList.push(k);
                    }
                    if(v.max) appendHtml += ' max="'+v.max+'" ';
                    if(v.min) appendHtml += ' min="'+v.min+'" ';
                    if(v.default && k != "quote_string"){
                        defaultList.push({"key" : k, "val" : v.default});
                        appendHtml += ' value="'+v.default+'" ';
                    }
                    if(k == "queue"){
                        appendHtml += ' list="'+k+'_datalist" autocomplete="off"/> ';
                        appendHtml += '<datalist id="'+k+'_datalist">';
                        appendHtml += '</datalist>';
                    }else{
                        appendHtml += ' /> ';
                    }
                    //if(v.regex) appendHtml += ' <input type="hidden" name="regex-'+k+'" value="'+v.regex+'" />';
                }
            }
        }
        appendHtml += '</div>';
        return appendHtml;
    }
    
    function makeSenderForm(type, mainMap, typesMap, tlsMap, podImageVersion){
        typesMapGlobal = typesMap;
        schemaVersion = podImageVersion;
        totalComponentsList = [];
        requiredComponentsList = [];
        tlsComponentsList = [];
        stringList = [];
        integerList = [];
        booleanList = [];
        arrayList = [];
        defaultList = [];
        checkTypeList = [];
        reqCheckTypeList = [];
        innerItems = [];
        $("#pill-tab-sender").empty();
        
        typesMapLocal = typesMap;
        mainMapTypes = mainMap.types;
        
        mainMap = mainMap.types[type].properties;
        var requiredList = mainMap.required;
        var appendHtml = '';
        var tlsCheck = false;
        
        
        if(null != requiredList){
            mainMap.required.forEach(function(element){
                requiredComponentsList.push(element);
            });
        }
        
        appendHtml += '<form id="senderViewForm" name="senderViewForm" method="post">';
        appendHtml += '<input type="hidden" name="senderType" value="'+type+'"/>';
        
        Object.keys(mainMap).forEach(function(k){
            if(k != "required"){
                if(k == "tls_settings"){
                    tlsCheck = true;
                }else{
                    totalComponentsList.push(k);
                    appendHtml += makeDiv(mainMap[k],k,requiredList,typesMap);
                }
            }
        });
        
        if(tlsCheck){
            tlsMap = tlsMap.types.tls_settings.properties;
            appendHtml += '<div class="mb-3 border" style="padding:10px;">';
            appendHtml += '    <span class="form-label" for="script_file">';
            appendHtml += '        TLS Setting Use';
            appendHtml += '    </span><br/>';
            appendHtml += '<div class="form-check form-switch"><input class="form-check-input" name="tls_use" type="checkbox" value="true"></div>';
            Object.keys(tlsMap).forEach(function(k){
                if(k != "editor"){
                    tlsComponentsList.push(k);
                    appendHtml += makeDiv(tlsMap[k],k,requiredList,typesMap);
                }
            });
            appendHtml += '</div>';
        }
        
        appendHtml += '<div style="text-align: right;">';
        if(langType == "ko"){
            appendHtml += '    <button class="btn btn-info mr-1 mb-1" type="button" onclick="sender.senderValidation();">저장</button>';
        }else{
            appendHtml += '    <button class="btn btn-info mr-1 mb-1" type="button" onclick="sender.senderValidation();">Save</button>';
        }
        appendHtml += '</div>';
        appendHtml += '</form>';
        $("#pill-tab-sender").append(appendHtml);
        
        innerItems.forEach(function(innerItem) {
            var itemName = innerItem.split("$")[1];
            var itemMap  = mainMapTypes[itemName].properties;
            var itemRequired = mainMapTypes[itemName].required;
            var itemHtml = "";
            itemHtml += '<ul class="nav nav-tabs" id="tabList-'+itemName+'" role="tablist">';
            itemHtml += '    <li class="nav-item"><a class="nav-link" href="javascript:sender.addTab(\''+itemName+'\');"><span class="fas fa-plus mr-1"></span></a></li>';
            itemHtml += '</ul>';
            itemHtml += '<div class="tab-content border-x border-bottom p-3" id="myTab-'+itemName+'" style="display:none;">';
            itemHtml += '</div>';
            $("#item-"+itemName).append(itemHtml);
        });
        
    }
    
    function addTab(name, clickCheck){
        innerItems.forEach(function(innerItem) {
            var itemName = innerItem.split("$")[1];
            if(name == itemName){
                var classCheck = document.getElementsByClassName('check-'+name);
                var classCheckNum = classCheck.length+1;
                
                var itemMap  = mainMapTypes[itemName].properties;
                var itemRequired = mainMapTypes[itemName].required;
                
                var nameId = name+'-'+classCheckNum;
                if(classCheck.length > 0){
                    var tabName = document.getElementsByClassName('check-'+name)[classCheck.length-1].text;
                    var checkNum = tabName.split("-")[1];
                    var checkNameNum = Number(checkNum)+1;
                    nameId = name+'-'+checkNameNum;
                }
                
                var liHtml = "";
                liHtml += '    <li class="nav-item" id="tabLi_'+nameId+'">';
                liHtml += '        <a class="nav-link check-'+name+'" id="tabId_'+nameId+'" value="'+nameId+'" aria-controls="tabCon_'+nameId+'" href="#tabCon_'+nameId+'" data-bs-toggle="tab" role="tab">';
                liHtml += nameId;
                liHtml += '        </a>';
                liHtml += '    </li>';
                $("#tabList-"+name).append(liHtml);
                
                var htmlAdd = '';
                htmlAdd = '     <div class="tab-pane fade" role="tabpanel" aria-labelledby="tabId_'+nameId+'" id="tabCon_'+nameId+'">';
                htmlAdd += '<form name="form-'+nameId+'" method="post">';
                htmlAdd += '<div class="mb-3">';
                if(langType == "ko"){
                    htmlAdd += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="float: right;" value="'+nameId+'" onclick="sender.deleteTab(this.value);">삭제</button>';
                }else{
                    htmlAdd += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="float: right;" value="'+nameId+'" onclick="sender.deleteTab(this.value);">Delete</button>';
                }
                
                htmlAdd += '</div>';
                Object.keys(itemMap).forEach(function(k){
                    htmlAdd += makeDiv(itemMap[k],k,itemRequired,typesMapLocal);
                });
                htmlAdd += '</form>';
                htmlAdd += '     </div>';
                $("#myTab-"+name).append(htmlAdd);
                $("#myTab-"+name).css("display","");
                if(!clickCheck){
                    document.getElementById('tabId_'+nameId).click();
                }
                
            }
        });
    }
    
    function makeQueueForm(searchType, commonMap, queueMap, typesMap, connectionQList, tlsMap){
        qCheckTypeList = [];
        qReqCheckTypeList = [];
        qTlsComponentsList = [];
        $("#pill-tab-queue").empty();
        
        commonMap = commonMap.types.queue.properties;
        queueMap = queueMap.types.queue.properties;
        
        var requiredList = queueMap.required;
        requiredList.push("queue");
        var appendHtml = '';
        var tlsCheck = false;
        
        appendHtml += '<form id="queueViewForm" name="queueViewForm" method="post">';
        appendHtml += '<input type="hidden" name="senderType" value="'+searchType+'"/>';
        
        Object.keys(queueMap).forEach(function(k){
            if(k != "required"){
                if(k == "tls_settings"){
                    tlsCheck = true;
                }else{
                    appendHtml += makeDiv(queueMap[k],k,requiredList,typesMap);
                }
            }
        });
        
        if(tlsCheck){
            tlsMap = tlsMap.types.tls_settings.properties;
            appendHtml += '<div class="mb-3 border" style="padding:10px;">';
            appendHtml += '    <span class="form-label" for="script_file">';
            appendHtml += '        TLS Setting Use';
            appendHtml += '    </span><br/>';
            appendHtml += '<div class="form-check form-switch"><input class="form-check-input" name="tls_use" type="checkbox" value="true"></div>';
            Object.keys(tlsMap).forEach(function(k){
                if(k != "editor"){
                    qTlsComponentsList.push(k);
                    appendHtml += makeDiv(tlsMap[k],k,requiredList,typesMap, true);
                }
            });
            appendHtml += '</div>';
        }
        
        
        appendHtml += '<div style="text-align: right;">';
        if(langType == "ko"){
            appendHtml += '    <button class="btn btn-info mr-1 mb-1" type="button" onclick="sender.queueValidation();">저장</button>';
        }else{
            appendHtml += '    <button class="btn btn-info mr-1 mb-1" type="button" onclick="sender.queueValidation();">Save</button>';
        }
        appendHtml += '</div>';
        appendHtml += '</form>';
        $("#pill-tab-queue").append(appendHtml);
        settingQueueList(connectionQList);
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
                if(qGubun == "out"){
                    appendHtml += '<option value="'+qName+'">'+qApp+'</option>';
                }
            }
            $("#queue_datalist").append(appendHtml);
        }
    }
    
    function makeFomatterForm(type){
        $("#fomatterArea").empty();
        var appendHtml = '';
        var requiredList;
        var mainMap;
        var searchType = type+"-formatter";
        
        formatterAllList = [];
        formatterRequiredList = [];
        if(type != "json"){
            Object.keys(responseMap).forEach(function(k){
                if(k.startsWith(type)){
                    mainMap = responseMap[k].types[searchType].properties;
                    requiredList = responseMap[k].types[searchType].properties.required;
                }
            });
            
            requiredList.forEach(function(element){
                formatterRequiredList.push(element);
            });
            
        }
        if(undefined != mainMap){
            Object.keys(mainMap).forEach(function(k){
                if(k != "required" && k != "kind" && k != "editor"){
                    formatterAllList.push(k);
                    appendHtml += makeDiv(mainMap[k],k,requiredList,typesMapGlobal);
                }
            });
        }
        
        $("#fomatterArea").append(appendHtml);
    }
    
    function senderValidation(){
        var parameterMap = new Map();
        var tlsMap = new Map();
        reqCheckTypeList=[];
        
        var senderType = removeSpace(document.senderViewForm.elements["senderType"].value);
        parameterMap.set("type",senderType);
        totalComponentsList.forEach(function(componentKey){
            var componentVal = document.senderViewForm.elements[componentKey].value;
            
            if(booleanList.includes(componentKey)){
                if(document.senderViewForm.elements[componentKey].checked){
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
        
        if("file-writer" != senderType){
            if(undefined != document.senderViewForm.elements["tls_use"]){
                if(document.senderViewForm.elements["tls_use"].checked){
                    tlsComponentsList.forEach(function(componentKey){
                        var componentVal = document.senderViewForm.elements[componentKey].value;
                        
                        if(booleanList.includes(componentKey)){
                            if(document.senderViewForm.elements[componentKey].checked){
                                tlsMap.set(componentKey, "true");
                            }else{
                                tlsMap.set(componentKey, "false");
                            }
                        }else{
                            if(isDefined(componentVal)){
                                tlsMap.set(componentKey, componentVal);
                            }
                        }
                    });
                    /*
                    tlsMap.forEach((v, k) => {
                        for(var i=0;i<checkTypeList.length;i++){
                            if(checkTypeList[i].name == k){
                                if(
                                    document.senderViewForm.elements[checkTypeList[i].name+"-name"].value != ""
                                    && document.senderViewForm.elements[checkTypeList[i].name+"-name"].value != null
                                ){
                                    reqCheckTypeList.push({"type":checkTypeList[i].type,"attr":checkTypeList[i].name,"gubun":senderType,"name":senderType
                                    ,"pathType":document.senderViewForm.elements[checkTypeList[i].name+"-select"].value,"pathName":senderType+"-"+document.senderViewForm.elements[checkTypeList[i].name+"-name"].value
                                    ,"path":v, "pathSub":document.senderViewForm.elements[checkTypeList[i].name+"-sub"].value});
                                }else{
                                    reqCheckTypeList = [];
                                    toastr["error"](k+" name value is required.");
                                    throw new Error(k+" name value is required.");
                                }
                            }
                        }
                    });
                    */
                }
            }
            /*
            else{
                parameterMap.forEach((v, k) => {
                    for(var i=0;i<checkTypeList.length;i++){
                        if(checkTypeList[i].name == k){
                            if(
                                document.senderViewForm.elements[checkTypeList[i].name+"-name"].value != ""
                                && document.senderViewForm.elements[checkTypeList[i].name+"-name"].value != null
                            )
                            
                            // document.senderViewForm.elements[checkTypeList[i].name+"-select"].value
                            //if($("input[name="+checkTypeList[i].name+"-name]").val() != "" && $("input[name="+checkTypeList[i].name+"-name]").val() != null)
                            {
                                reqCheckTypeList.push({"type":checkTypeList[i].type,"attr":checkTypeList[i].name,"gubun":senderType,"name":senderType
                                ,"pathType":document.senderViewForm.elements[checkTypeList[i].name+"-select"].value,"pathName":senderType+"-"+document.senderViewForm.elements[checkTypeList[i].name+"-name"].value
                                ,"path":v, "pathSub":document.senderViewForm.elements[checkTypeList[i].name+"-sub"].value});
                            }else{
                                reqCheckTypeList = [];
                                toastr["error"](k+" name value is required.");
                                throw new Error(k+" name value is required.");
                            }
                        }
                    }
                });
            }
            */
        }
        /*
        else{
            parameterMap.forEach((v, k) => {
                for(var i=0;i<checkTypeList.length;i++){
                    if(checkTypeList[i].name == k){
                        if(
                            document.senderViewForm.elements[checkTypeList[i].name+"-name"].value != ""
                            && document.senderViewForm.elements[checkTypeList[i].name+"-name"].value != null
                        )
                        
                        // document.senderViewForm.elements[checkTypeList[i].name+"-select"].value
                        //if($("input[name="+checkTypeList[i].name+"-name]").val() != "" && $("input[name="+checkTypeList[i].name+"-name]").val() != null)
                        {
                            reqCheckTypeList.push({"type":checkTypeList[i].type,"attr":checkTypeList[i].name,"gubun":senderType,"name":senderType
                            ,"pathType":document.senderViewForm.elements[checkTypeList[i].name+"-select"].value,"pathName":senderType+"-"+document.senderViewForm.elements[checkTypeList[i].name+"-name"].value
                            ,"path":v, "pathSub":document.senderViewForm.elements[checkTypeList[i].name+"-sub"].value});
                        }else{
                            reqCheckTypeList = [];
                            toastr["error"](k+" name value is required.");
                            throw new Error(k+" name value is required.");
                        }
                    }
                }
            });
        }
        */
        
        var kind = document.formatterViewForm.elements["kind"].value;
        
        var innerItemValueMap = new Map();
        
        innerItems.forEach(function(innerItem) {
            var itemName = innerItem.split("$")[1];
            var itemMap  = mainMapTypes[itemName].properties;
            var itemRequired = mainMapTypes[itemName].required;
            var classCheck = document.getElementsByClassName('check-'+itemName);
            var classCheckNum = classCheck.length+1;
            
            if(classCheck.length > 0 ){
                
                var checkComponents = [];
                Object.keys(itemMap).forEach(function(k){
                    checkComponents.push(k);
                });
                var beforeCount = 0;
                for(var i=0; i<classCheck.length; i++){
                    var itemValueMap = new Map();
                    checkComponents.forEach(function(key){
                        var componentVal = document.getElementsByName(key)[i].value;
                        if(document.getElementsByName(key)[0].type == "radio"){
                            var ele = document.getElementsByName(key);
                            var count = (ele.length/classCheck.length)*(i+1);
                            var startCount = 0; 
                            if(i > 0){
                                startCount = beforeCount ;
                            }
                            beforeCount = count;
                            for(var x=startCount; x < count; x++) {
                                if(ele[x].checked === true) {
                                    //console.log(key+" ::: "+ele[x].value);
                                    itemValueMap.set(key,ele[x].value);
                                }
                            }
                        }else{
                            if(itemRequired.includes(key)){
                                if(isDefined(componentVal)){
                                    //console.log(key+" ::: "+componentVal)
                                    itemValueMap.set(key,componentVal);
                                }else{
                                    toastr["error"](key+" is required.");
                                    throw new Error(key+" is required.");
                                }
                            }else if(isDefined(componentVal)){
                                //console.log(key+" ::: "+componentVal)
                                itemValueMap.set(key,componentVal);
                            }
                        }
                    });
                    var num = i+1;
                    innerItemValueMap.set(itemName+'-'+num,Object.fromEntries(itemValueMap));
                }
                innerItemValueMap.set("innerItemList",innerItems);
            }
        });
        saveSenderView(parameterMap, tlsMap, defaultList,reqCheckTypeList,kind,stringList, integerList, booleanList, arrayList, innerItemValueMap);
    }
    
    function saveSenderView(parameterMap, tlsMap, defaultList,otherList,kind,stringList, integerList, booleanList, arrayList, innerItemValueMap){
        var param = {
            nodeAlias : $("#modalNodeAliassender").val(),
            nodeIpAddress : $("#modalNodeIpAddresssender").val(),
            pipeName : $("#modalPipeNamesender").val(),
            podType: $("#modalPodTypesender").val(),
            podName : $("#modalPodNamesender").val(),
            nodeAppName : $("#modalNodeAppNamesender").val(),
            componentsMap : Object.fromEntries(parameterMap),
            tlsMap : Object.fromEntries(tlsMap),
            defaultList : defaultList,
            schemaVersion : schemaVersion+"",
            otherList : otherList,
            kind : kind,
            stringList : stringList,
            integerList : integerList,
            booleanList : booleanList,
            arrayList : arrayList,
            innerItemValueMap : Object.fromEntries(innerItemValueMap)
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/sender/view/save";
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
    
    function queueValidation(){
        qReqCheckTypeList=[];
        var parameterMap = new Map();
        var tlsMap = new Map();
        var senderType = removeSpace(document.queueViewForm.elements["senderType"].value);
        parameterMap.set("type",senderType);
        
        var port = removeSpace(document.queueViewForm.elements["port"].value);
        if(!isDefined(port)){
            toastr["error"]("port is required.");
            throw new Error("port is required.");
        }else{
            parameterMap.set("port", port);
        }
        var host = removeSpace(document.queueViewForm.elements["host"].value);
        if(!isDefined(host)){
            toastr["error"]("host is required.");
            throw new Error("host is required.");
        }else{
            parameterMap.set("host", host);
        }
        
        var queue = removeSpace(document.queueViewForm.elements["queue"].value);
        if(!isDefined(queue)){
            toastr["error"]("queue is required.");
            throw new Error("queue is required.");
        }else{
            parameterMap.set("queue", queue);
        }
        
        if(document.queueViewForm.elements["use_tls"].checked){
            parameterMap.set("use_tls", "true");
        }else{
            parameterMap.set("use_tls", "false");
        }
        
        
        if(undefined != document.queueViewForm.elements["tls_use"]){
            if(document.queueViewForm.elements["tls_use"].checked){
                qTlsComponentsList.forEach(function(componentKey){
                    var componentVal = document.queueViewForm.elements[componentKey].value;
                    
                    if(booleanList.includes(componentKey)){
                        if(document.queueViewForm.elements[componentKey].checked){
                            tlsMap.set(componentKey, "true");
                        }else{
                            tlsMap.set(componentKey, "false");
                        }
                    }else{
                        if(isDefined(componentVal)){
                            tlsMap.set(componentKey, componentVal);
                        }
                    }
                });
                /*
                tlsMap.forEach((v, k) => {
                    for(var i=0;i<qCheckTypeList.length;i++){
                        if(qCheckTypeList[i].name == k){
                            if(
                                document.queueViewForm.elements[qCheckTypeList[i].name+"-name"].value != ""
                                && document.queueViewForm.elements[qCheckTypeList[i].name+"-name"].value != null
                            )
                            {
                                qReqCheckTypeList.push({"type":qCheckTypeList[i].type,"attr":qCheckTypeList[i].name,"gubun":senderType,"name":senderType
                                ,"pathType":document.queueViewForm.elements[qCheckTypeList[i].name+"-select"].value,"pathName":senderType+"-"+document.queueViewForm.elements[qCheckTypeList[i].name+"-name"].value
                                ,"path":v, "pathSub":document.queueViewForm.elements[qCheckTypeList[i].name+"-sub"].value});
                            }else{
                                qReqCheckTypeList = [];
                                toastr["error"](k+" name value is required.");
                                throw new Error(k+" name value is required.");
                            }
                        }
                    }
                });
                */
            }
        }
        
        if(tlsMap.size > 0){
            parameterMap.set("tlsMap",Object.fromEntries(tlsMap));
        }
        if(qReqCheckTypeList.length > 0){
            parameterMap.set("checkList",qReqCheckTypeList);
        }
        
        var kind = document.formatterViewForm.elements["kind"].value;
        console.log(parameterMap);
       saveQueueView(parameterMap, defaultList, kind,stringList, integerList, booleanList, arrayList);
    }
    
    function saveQueueView(parameterMap, defaultList, kind,stringList, integerList, booleanList, arrayList){
        var param = {
            nodeAlias : $("#modalNodeAliassender").val(),
            nodeIpAddress : $("#modalNodeIpAddresssender").val(),
            pipeName : $("#modalPipeNamesender").val(),
            podType: $("#modalPodTypesender").val(),
            podName : $("#modalPodNamesender").val(),
            nodeAppName : $("#modalNodeAppNamesender").val(),
            queueMap : Object.fromEntries(parameterMap),
            defaultList : defaultList,
            schemaVersion : schemaVersion+"",
            kind : kind,
            stringList : stringList,
            integerList : integerList,
            booleanList : booleanList,
            arrayList : arrayList
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/sender/view/save";
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
    
    function formatterValidation(){
        var parameterMap = new Map();
        parameterMap.set("type",$("#selectedSenderTypeFormatter").val());
        var kind = document.formatterViewForm.elements["kind"].value;
        parameterMap.set("kind",kind);
        formatterAllList.forEach(function(componentKey){
            var componentVal = document.formatterViewForm.elements[componentKey].value;
            if( undefined != formatterRequiredList && Object.values(formatterRequiredList).includes(componentKey) ){
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
        });
        saveFormatterView(parameterMap, defaultList, kind, stringList, integerList, booleanList, arrayList);
    }
    
    function saveFormatterView(parameterMap, defaultList, kind){
        var param = {
            nodeAlias : $("#modalNodeAliassender").val(),
            nodeIpAddress : $("#modalNodeIpAddresssender").val(),
            pipeName : $("#modalPipeNamesender").val(),
            podType: $("#modalPodTypesender").val(),
            podName : $("#modalPodNamesender").val(),
            nodeAppName : $("#modalNodeAppNamesender").val(),
            formatterMap : Object.fromEntries(parameterMap),
            defaultList : defaultList,
            schemaVersion : schemaVersion+"",
            kind : kind,
            stringList : stringList,
            integerList : integerList,
            booleanList : booleanList,
            arrayList : arrayList
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/sender/view/save";
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
    
    function insertForm(orgTomlFile, searchType, yamlCheckList){
        if(undefined != orgTomlFile){
            if(searchType == "file-writer"){
                searchType = "file_writer"
            }else if(searchType == "opcua"){
                searchType = "opcua-server"
            }
            var senderMap = orgTomlFile[searchType];
            var formatterMap = orgTomlFile.formatter;
            var queueMap = orgTomlFile.queue;
            if(undefined != senderMap){
                Object.keys(senderMap).forEach(function(k){
                    if (typeof(senderMap[k]) === 'number') {
                        document.senderViewForm.elements[k].value = senderMap[k];
                    }else if(typeof(senderMap[k]) === 'boolean'){
                        document.senderViewForm.elements[k].checked = senderMap[k];
                    }else if(typeof(senderMap[k]) === 'string'){
                        document.senderViewForm.elements[k].value = senderMap[k];
                    }else{
                        if(k == "tls_settings"){
                            document.senderViewForm.elements["tls_use"].checked = true;
                            Object.keys(senderMap[k]).forEach(function(tlsKey){
                                if (typeof(senderMap[k][tlsKey]) === 'number') {
                                    document.senderViewForm.elements[tlsKey].value = senderMap[k][tlsKey];
                                }else if(typeof(senderMap[k][tlsKey]) === 'boolean'){
                                    document.senderViewForm.elements[tlsKey].checked = senderMap[k][tlsKey];
                                }else if(typeof(senderMap[k][tlsKey]) === 'string'){
                                    document.senderViewForm.elements[tlsKey].value = senderMap[k][tlsKey];
                                    /*
                                    if(tlsKey != "tls_key_file" && tlsKey != "ca_cert_file" && tlsKey != "tls_cert_file"){
                                        document.senderViewForm.elements[tlsKey].value = senderMap[k][tlsKey];
                                    }else{
                                        if(null != yamlCheckList && undefined != yamlCheckList && yamlCheckList.length > 0){
                                            for(var i=0;i<yamlCheckList.length;i++){
                                                var yamlCheck = yamlCheckList[i];
                                                var yamlPath = yamlCheck.path;
                                                if(senderMap[k][tlsKey] == yamlPath){
                                                    var yamlAttr = yamlCheck.attr;
                                                    var yamlPathName = yamlCheck.pathName;
                                                    var yamlPathSub = yamlCheck.pathSub;
                                                    var yamlPathType = yamlCheck.pathType;
                                                    var yamlPathNameArr = yamlCheck.pathName.split("-");
                                                    
                                                    document.senderViewForm.elements[tlsKey].value = senderMap[k][tlsKey];
                                                    document.senderViewForm.elements[tlsKey+"-name"].value = yamlPathNameArr[1];
                                                    document.senderViewForm.elements[tlsKey+"-sub"].value = yamlPathSub;
                                                    document.senderViewForm.elements[tlsKey+"-select"].value = yamlPathType;
                                                    if(yamlPathType == "localpath"){
                                                        document.senderViewForm.elements[tlsKey+"-sub"].readonly = true;
                                                    }else{
                                                        document.senderViewForm.elements[tlsKey+"-sub"].readonly = false;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    */
                                    
                                }
                            });
                        }
                    }
                });
                
                innerItems.forEach(function(innerItem) {
                    var itemName = innerItem.split("$")[1]+"-list";
                    if(senderMap[itemName]){
                        for(var i=0;i<senderMap[itemName].length;i++){
                            addTab(innerItem.split("$")[1],true);
                            var innerItemMap = senderMap[itemName][i];
                            var formNum = i+1;
                            var formName = document.forms["form-"+innerItem.split("$")[1]+"-"+formNum];
                            
                            Object.keys(innerItemMap).forEach(function(k){
                                if (typeof(innerItemMap[k]) === 'number') {
                                    formName.elements[k].value = innerItemMap[k];
                                }else if(typeof(innerItemMap[k]) === 'boolean'){
                                    formName.elements[k].checked = innerItemMap[k];
                                }else if(typeof(innerItemMap[k]) === 'string'){
                                    formName.elements[k].value = innerItemMap[k];
                                }
                            });
                        }
                    }
                });
                
                
            }
            if(undefined != formatterMap){
                if(Object.keys(formatterMap).length){
                    var selectedType = formatterMap.type.split("/")[1];
                    document.formatterViewForm.elements["kind"].value = selectedType;
                    sender.makeFomatterForm(selectedType);
                    Object.keys(formatterMap).forEach(function(k){
                        if(k != "type"){
                            if("dp_list" == k){
                                var listList = formatterMap[k];
                                var listVal = "";
                                for(var i=0;i<listList.length;i++){
                                    if(i == 0){
                                        listVal += listList[i];
                                    }else{
                                        listVal += ","+listList[i];
                                    }
                                }
                                document.formatterViewForm.elements[k].value = listVal;
                            }else{
                                document.formatterViewForm.elements[k].value = formatterMap[k];
                            }
                        }
                    });
                }else{
                    document.formatterViewForm.elements["kind"].value = "json";
                    sender.makeFomatterForm("json");
                }
            }
            if(undefined != queueMap){
                Object.keys(queueMap).forEach(function(k){
                    if(k == "tls_settings"){
                        document.queueViewForm.elements["tls_use"].checked = true;
                        Object.keys(queueMap[k]).forEach(function(tlsKey){
                            if (typeof(queueMap[k][tlsKey]) === 'number') {
                                document.queueViewForm.elements[tlsKey].value = queueMap[k][tlsKey];
                            }else if(typeof(queueMap[k][tlsKey]) === 'boolean'){
                                document.queueViewForm.elements[tlsKey].checked = queueMap[k][tlsKey];
                            }else if(typeof(queueMap[k][tlsKey]) === 'string'){
                                document.queueViewForm.elements[tlsKey].value = queueMap[k][tlsKey];
                                /*
                                if(tlsKey != "tls_key_file" && tlsKey != "ca_cert_file" && tlsKey != "tls_cert_file"){
                                    document.queueViewForm.elements[tlsKey].value = queueMap[k][tlsKey];
                                }else{
                                    if(null != yamlCheckList && undefined != yamlCheckList && yamlCheckList.length > 0){
                                        for(var i=0;i<yamlCheckList.length;i++){
                                            var yamlCheck = yamlCheckList[i];
                                            var yamlPath = yamlCheck.path;
                                            if(queueMap[k][tlsKey] == yamlPath){
                                                var yamlAttr = yamlCheck.attr;
                                                var yamlPathName = yamlCheck.pathName;
                                                var yamlPathSub = yamlCheck.pathSub;
                                                var yamlPathType = yamlCheck.pathType;
                                                var yamlPathNameArr = yamlCheck.pathName.split("-");
                                                
                                                document.queueViewForm.elements[tlsKey].value = queueMap[k][tlsKey];
                                                document.queueViewForm.elements[tlsKey+"-name"].value = yamlPathNameArr[1];
                                                document.queueViewForm.elements[tlsKey+"-sub"].value = yamlPathSub;
                                                document.queueViewForm.elements[tlsKey+"-select"].value = yamlPathType;
                                                if(yamlPathType == "localpath"){
                                                    document.queueViewForm.elements[tlsKey+"-sub"].readonly = true;
                                                }else{
                                                    document.queueViewForm.elements[tlsKey+"-sub"].readonly = false;
                                                }
                                            }
                                        }
                                    }
                                }
                                */
                            }
                        });
                    }else if (typeof(queueMap[k]) === 'number') {
                        document.queueViewForm.elements[k].value = queueMap[k];
                    }else if(typeof(queueMap[k]) === 'boolean'){
                        document.queueViewForm.elements[k].checked = queueMap[k];
                    }else if(typeof(queueMap[k]) === 'string'){
                        document.queueViewForm.elements[k].value = queueMap[k];
                    }
                });
            }
            /*
            if(null != yamlCheckList && undefined != yamlCheckList && yamlCheckList.length > 0){
                for(var i=0;i<yamlCheckList.length;i++){
                    var yamlCheck = yamlCheckList[i];
                    var yamlAttr = yamlCheck.attr;
                    var yamlPath = yamlCheck.path;
                    var yamlPathName = yamlCheck.pathName;
                    var yamlPathSub = yamlCheck.pathSub;
                    var yamlPathType = yamlCheck.pathType;
                    
                    var yamlPathNameArr = yamlCheck.pathName.split("-");
                    
                    $("input[type=text]").each(function(index, item){
                        if($(item).val() == yamlPath){
                            yamlAttr = $(item).eq('0').attr('name');
                        }
                   });
                    
                    $("input[name="+yamlAttr+"-name]").val(yamlPathNameArr[1]);
                    $("input[name="+yamlAttr+"-sub]").val(yamlPathSub);
                    $("select[name="+yamlAttr+"-select]").val(yamlPathType).prop("selected",true);
                    if(yamlPathType == "localpath"){
                        $("input[name="+yamlAttr+"-sub]").prop("readonly", true);
                    }else{
                        $("input[name="+yamlAttr+"-sub]").prop("readonly", false);
                    }
                }
            }
            */
        }else{
            document.formatterViewForm.elements["kind"].value = "json";
            sender.makeFomatterForm("json");
        }
    }
    
    function logLevelSave(){
        var param = {
            nodeAlias : $("#modalNodeAliassender").val(),
            nodeIpAddress : $("#modalNodeIpAddresssender").val(),
            pipeName : $("#modalPipeNamesender").val(),
            podType: $("#modalPodTypesender").val(),
            podName : $("#modalPodNamesender").val(),
            nodeAppName : $("#modalNodeAppNamesender").val(),
            logLevel : $("select[name=senderLogLevel] option:selected").val()
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
    
    function makeVolumeMountForm(yamlCheckList){
        var appendHtml = "";
        if(yamlCheckList && yamlCheckList.length > 0){
            var commonCheck = true;
            var firstCheck = true;
            for(var i=0;i<yamlCheckList.length;i++){
                //if(yamlCheckList[i].gubun == "common"){
                    //var pathNameArr = yamlCheckList[i].pathName.split("-");
                    
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
                //}
            }
            if(commonCheck){
                appendHtml += volumeMountsDefaultHtml;
            }
        }else{
            appendHtml += volumeMountsDefaultHtml;
        }
        
        $("#volumeMountsBtn").empty();
        $("#volumeMountsReset").empty();
        var btnHtml = '<button class="btn btn-info mr-1 mb-1" type="button" onclick="sender.saveMounts();">Save</button>';
        if(langType == "ko"){
            btnHtml = '<button class="btn btn-info mr-1 mb-1" type="button" onclick="sender.saveMounts();">저장</button>';
        }
        var resetHtml = '<h4 class="mb-1" id="volumeMountModalLabel" style="    display: inline-block;">VolumeMounts Setting</h4>';
        
        if(langType == "ko"){
            resetHtml = '<h4 class="mb-1" id="volumeMountModalLabel" style="    display: inline-block;">볼륨 마운트 셋팅</h4>';
            resetHtml += '<button class="btn btn-danger mr-1 mb-1" type="button" onclick="sender.resetMounts();" style="margin-left:10px;">초기화</button>';
        }else{
            resetHtml += '<button class="btn btn-danger mr-1 mb-1" type="button" onclick="sender.resetMounts();" style="margin-left:10px;">Reset</button>';
        }
        $("#volumeMountsBtn").append(btnHtml);
        $("#volumeMountsReset").append(resetHtml);
        $("#volumeMountsDiv").append(appendHtml);
    }
    
    function saveMounts(volumeMountMap){
        var param = {
            nodeAlias : $("#modalNodeAliassender").val(),
            nodeIpAddress : $("#modalNodeIpAddresssender").val(),
            pipeName : $("#modalPipeNamesender").val(),
            podType: $("#modalPodTypesender").val(),
            podName : $("#modalPodNamesender").val(),
            nodeAppName : $("#modalNodeAppNamesender").val(),
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
    
    function settingTemplateModal(){
        var param = {
            nodeAlias : $("#modalNodeAliassender").val(),
            nodeIpAddress : $("#modalNodeIpAddresssender").val(),
            pipeName : $("#modalPipeNamesender").val(),
            podType: $("#modalPodTypesender").val(),
            podName : $("#modalPodNamesender").val(),
            nodeAppName : $("#modalNodeAppNamesender").val()
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
            $("#configTagName").attr("readonly",false);
            $("#configSelectTemplate").empty();
            if(langType == "ko"){
                $("#configTagName").attr('placeholder','저장할 태그명을 입력해주세요.');
            }else{
                $("#configTagName").attr('placeholder','Enter the tag name to save.');
            }
            let selectedPodTypeFull = $("#modalPodNamesender").val();
            let selectedPodType = selectedPodTypeFull.split("-")[0]+"-"+selectedPodTypeFull.split("-")[1];
            $("#configTemplateType").val(selectedPodType);
            $("#configTemplateGubun").val($("#modalPodTypesender").val());
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
            nodeAlias : $("#modalNodeAliassender").val(),
            nodeIpAddress : $("#modalNodeIpAddresssender").val(),
            pipeName : $("#modalPipeNamesender").val(),
            podType: $("#modalPodTypesender").val(),
            podName : $("#modalPodNamesender").val(),
            nodeAppName : $("#modalNodeAppNamesender").val()
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
                sender.openCanvas(response.orgTomlFile);
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
    
    sender.configTemplateSave = function(){
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
    
    sender.settingTemplateModal = function(){
        settingTemplateModal();
    }
    
    sender.configTemplateChangeEvent = function(v){
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
    
    sender.selectQueue = function(clickVal){
        $("#queueViewForm input[name=queue]").val(clickVal);
    }
    
    sender.resetMounts = function(){
        var volumeMountMap = new Map();
        saveMounts(volumeMountMap);
    }
    
    sender.saveMounts = function(){
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
    
    sender.volumeMountModal = function(){
        var param = {
            nodeAlias : $("#modalNodeAliassender").val(),
            nodeIpAddress : $("#modalNodeIpAddresssender").val(),
            pipeName : $("#modalPipeNamesender").val(),
            podType: $("#modalPodTypesender").val(),
            podName : $("#modalPodNamesender").val(),
            nodeAppName : $("#modalNodeAppNamesender").val()
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/archive/read";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            $("#volumeMountsDiv").empty();
            $("#volumeMountsBtn").empty();
            $('#volumeMountModal').modal('show');
            var yamlCheckList = response["yamlCheckList"];
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
    
    sender.logLevelSave = function(){
        logLevelSave();
    }
    
    sender.senderValidation = function(){
        senderValidation();
    }
    
    sender.queueValidation = function(){
        queueValidation();
    }
    
    sender.formatterValidation = function(){
        formatterValidation();
    }
    
    sender.openCanvas = function(orgTomlFile){
        var param = {
            nodeAlias : $("#modalNodeAliassender").val(),
            nodeIpAddress : $("#modalNodeIpAddresssender").val(),
            pipeName : $("#modalPipeNamesender").val(),
            podType: $("#modalPodTypesender").val(),
            podName : $("#modalPodNamesender").val(),
            nodeAppName : $("#modalNodeAppNamesender").val()
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/archive/read";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            responseMap = response;
            var podMainSchemaTomlName = response["image_info.toml"]["schema"].split("/")[1];
            var podMainSchemaToml = response[podMainSchemaTomlName];
            var searchType = podMainSchemaToml.properties[podMainSchemaToml.properties.required].type.split("$")[1];
            
            var podImageVersion = response["image_info.toml"]["version"];
            var tlsToml = response["tls-"+podImageVersion+".toml"];
            var typesToml = response["types-"+podImageVersion+".toml"];
            var commonSchemaToml = response["sender-"+podImageVersion+".toml"];
            var queueSchemaToml = response["data-queue-"+podImageVersion+".toml"];
            var yamlCheckList = response["yamlCheckList"];
            var connectionQList = response["qList"];
            
            makeSenderForm(searchType, podMainSchemaToml, typesToml, tlsToml, podImageVersion);
            makeQueueForm(searchType, commonSchemaToml, queueSchemaToml, typesToml, connectionQList, tlsToml);
            insertForm(orgTomlFile, searchType, yamlCheckList);
            
            if(orgTomlFile && orgTomlFile.log){
                $("select[name=senderLogLevel]").val(orgTomlFile.log["log_level"]).prop("selected", true);
            }else{
                $("select[name=senderLogLevel]").val("info").prop("selected", true);
            }
            
            $("#selectedSenderTypeFormatter").val(searchType);
            $('#senderBackdrop').modal('show');
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
    
    sender.makeFomatterForm = function(type){
        makeFomatterForm(type);
    }
    
    sender.deleteToml = function(){
        var param = {
            nodeAlias : $("#modalNodeAliassender").val(),
            nodeIpAddress : $("#modalNodeIpAddresssender").val(),
            pipeName : $("#modalPipeNamesender").val(),
            podType: $("#modalPodTypesender").val(),
            podName : $("#modalPodNamesender").val(),
            nodeAppName : $("#modalNodeAppNamesender").val()
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/toml/delete";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            $('#senderTomlDeleteModal').modal('hide');
            $("#senderBackdropCloseBtn").trigger("click");
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
    
    sender.deleteTomlModal = function(){
        $('#senderTomlDeleteModal').modal('show');
    }
    
    sender.addTab = function(name){
        addTab(name);
    }
    
    sender.deleteTab = function(id){
        var type = id.split("-")[0];
        $("#tabCon_"+id).remove();
        $("#tabLi_"+id).remove();
        if(document.getElementsByClassName('check-'+type).length > 0){
            document.getElementsByClassName('check-'+type)[0].click();
        }else{
            $("#myTab-"+type).css("display","none");
        }
    }
    
    return sender;
}) (window.sender || {}, $);