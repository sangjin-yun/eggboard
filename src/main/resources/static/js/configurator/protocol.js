var protocol = (function (protocol, $) {
    
    var LocalScriptFileList;
    var dpHtml;
    
    var deviceHtml;
    var deviceRequired = [];
    var deviceAllList = [];
    
    var totalComponentsList = [];
    
    var requiredComponentsList = [];
    
    var stringList = [];
    var integerList = [];
    var booleanList = [];
    var arrayList = [];
    
    var dpRequired = [];
    var dpAllList = [];
    
    var defaultList = [];
    
    var checkTypeList = [];
    var reqCheckTypeList = [];
    
    var podName;
    
    var extraOrgToml;
    var convertersCheck = true;
    
    var templateList = [];
    var selectedPodTomlContent;
    
    /**************************************
     * Private 함수
     * ************************************/
    
    function dpDataTableSetting(orgTomlFile){
        if(null != orgTomlFile && undefined != orgTomlFile){
            orgMap = orgTomlFile.dpg_list[$("#name_dpg").val()];
            $('#dpList').DataTable().destroy();
            $("#dpListTbody").empty();
            var dpsHtml = "";
            Object.keys(orgMap).forEach(function(k){
                if(k == "dp_list"){
                    var v = orgMap[k];
                    var vSorting = Object.keys(v).sort().reduce(
                        (obj, key) => { 
                          obj[key] = v[key]; 
                          return obj;
                        }, 
                        {}
                      );
                      v = vSorting;
                  
                      Object.keys(v).forEach(function(vk,index){
                          dpsHtml += "<tr class='dpCheck'>";
                          dpsHtml += "<td>"+vk+"</td>";
                          dpsHtml += "<td>";
                          if(langType == "ko"){
                              dpsHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" type="button" onclick="protocol.modifyDpModalCall(\''+vk+'\');">수정</button>';
                              dpsHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteDpModalCall(\''+vk+'\');">삭제</button>';
                          }else{
                              dpsHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" type="button" onclick="protocol.modifyDpModalCall(\''+vk+'\');">Modify</button>';
                              dpsHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteDpModalCall(\''+vk+'\');">Delete</button>';
                          }
                          dpsHtml += "</td>";
                          dpsHtml += "</tr>";
                      });
                  }
            });
        }
        $("#dpListTbody").append(dpsHtml);
        
        $("#dpList").DataTable({
            order: [ [ 0, "asc" ] ],
            "columnDefs": [
                { "orderable": true, "width": "60%", "targets": [0] },
                { "orderable": false, "targets": [1]}
            ],
            autoWidth: false,
            info : false,
            lengthChange: false,
            "oLanguage": {
               "sSearch": "Dp Name : "
             }
             ,destory : true
        });
        var dpTable = $('#dpList').DataTable();
        $('#dpList_filter input').unbind().bind('keyup', function () {
            dpTable.column(0).search(this.value).draw();
        });
    }
    
    function tableSetting(orgTomlMap){
        if(undefined != orgTomlMap && undefined != orgTomlMap.connections){
            var connections = orgTomlMap.connections;
            $('#connectionList').DataTable().destroy();
            $("#connectionListTbody").empty();
            var connectionsHtml = "";
            Object.keys(connections).forEach(function(key){
                connectionsHtml += "<tr>";
                connectionsHtml += "<td>"+key+"</td>";
                connectionsHtml += "<td>"+connections[key].conn_url+"</td>";
                connectionsHtml += "<td>";
                if(langType == "ko"){
                    connectionsHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling"type="button" onclick="protocol.modifyModalCall(\''+key+'\',\'connection\');">수정</button>';
                    connectionsHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteModalCall(\''+key+'\',\'connection\');">삭제</button>';
                }else{
                    connectionsHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling"type="button" onclick="protocol.modifyModalCall(\''+key+'\',\'connection\');">Modify</button>';
                    connectionsHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteModalCall(\''+key+'\',\'connection\');">Delete</button>';
                }
                connectionsHtml += "</td>";
                connectionsHtml += "</tr>";
            });
            $("#connectionListTbody").append(connectionsHtml);
        }
        $("#connectionList").DataTable({
            order: [ [ 0, "asc" ] ],
            "columnDefs": [
                { "orderable": true, "width": "35%", "targets": [0] },
                { "orderable": true, "width": "40%", "targets": [1] },
                { "orderable": false, "targets": [2]}
            ],
            autoWidth: false,
            info : false,
            lengthChange: false,
            "oLanguage": {
               "sSearch": "Connection Name : "
             }
             ,destory : true
        });
        var connTable = $('#connectionList').DataTable();
        $('#connectionList_filter input').unbind().bind('keyup', function () {
            connTable.column(0).search(this.value).draw();
        });
        
        if(undefined != orgTomlMap && undefined != orgTomlMap.converters){
            var converters = orgTomlMap.converters;
            $('#converterList').DataTable().destroy();
            $("#converterListTbody").empty();
            var fileList = converters.script_file;
            
            for(var idx in fileList){
                var fileName = fileList[idx].split("/")[5];
                var script_length = document.getElementsByName("converter_script_file").length;
                for (var i=0; i<script_length; i++) {
                   if (document.getElementsByName("converter_script_file")[i].value == fileName) {
                       document.getElementsByName("converter_script_file")[i].checked = true;
                   }
                }
            }
            var convertersHtml = "";
            if(undefined != converters.defs){
                Object.keys(converters.defs).forEach(function(key){
                    convertersHtml += "<tr>";
                    convertersHtml += "<td>"+key+"</td>";
                    convertersHtml += "<td>"+converters.defs[key].function+"</td>";
                    convertersHtml += "<td>";
                    if(langType == "ko"){
                        convertersHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasConverter" aria-controls="offcanvasConverter" type="button" onclick="protocol.modifyModalCall(\''+key+'\',\'converter\');">수정</button>';
                        convertersHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteModalCall(\''+key+'\',\'converter\');">삭제</button>';
                    }else{
                        convertersHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasConverter" aria-controls="offcanvasConverter" type="button" onclick="protocol.modifyModalCall(\''+key+'\',\'converter\');">Modify</button>';
                        convertersHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteModalCall(\''+key+'\',\'converter\');">Delete</button>';
                    }
                    convertersHtml += "</td>";
                    convertersHtml += "</tr>";
                });
            }
            $("#converterListTbody").append(convertersHtml);
        }
        $("#converterList").DataTable({
            order: [ [ 0, "asc" ] ],
            "columnDefs": [
                { "orderable": true, "width": "35%", "targets": [0] },
                { "orderable": true, "width": "35%", "targets": [1] },
                { "orderable": false, "targets": [2]}
            ],
            autoWidth: false,
            info : false,
            lengthChange: false,
            "oLanguage": {
               "sSearch": "Converter Name : "
             }
             ,destory : true
        });
        var converterTable = $('#converterList').DataTable();
        $('#converterList_filter input').unbind().bind('keyup', function () {
            converterTable.column(0).search(this.value).draw();
        });
        
        if(undefined != orgTomlMap && undefined != orgTomlMap.dpg_list){
            var dpgs = orgTomlMap.dpg_list;
            $('#dpgList').DataTable().destroy();
            $("#dpgListTbody").empty();
            var dpgsHtml = "";
            Object.keys(dpgs).forEach(function(key){
                var dpCount = Object.keys(dpgs[key].dp_list).length;
                dpgsHtml += "<tr>";
                dpgsHtml += "<td>"+key+"</td>";
                dpgsHtml += "<td>"+dpCount+"</td>";
                dpgsHtml += "<td>";
                if(langType == "ko"){
                    dpgsHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDpg" aria-controls="offcanvasDpg"type="button" onclick="protocol.modifyModalCall(\''+key+'\',\'dpg\');">수정</button>';
                    dpgsHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteModalCall(\''+key+'\',\'dpg\');">삭제</button>';
                }else{
                    dpgsHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDpg" aria-controls="offcanvasDpg"type="button" onclick="protocol.modifyModalCall(\''+key+'\',\'dpg\');">Modify</button>';
                    dpgsHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteModalCall(\''+key+'\',\'dpg\');">Delete</button>';
                }
                dpgsHtml += "</td>";
                dpgsHtml += "</tr>";
            });
            $("#dpgListTbody").append(dpgsHtml);
        }
        $("#dpgList").DataTable({
            order: [ [ 0, "asc" ] ],
            "columnDefs": [
                { "orderable": true, "width": "50%", "targets": [0] },
                { "orderable": true, "width": "20%", "targets": [1] },
                { "orderable": false, "targets": [2]}
            ],
            autoWidth: false,
            info : false,
            lengthChange: false,
            "oLanguage": {
               "sSearch": "Dpg Name : "
             }
             ,destory : true
        });
        var dgpTable = $('#dpgList').DataTable();
        $('#dpgList_filter input').unbind().bind('keyup', function () {
            dgpTable.column(0).search(this.value).draw();
        });
        
        if(undefined != orgTomlMap && undefined != orgTomlMap.readers){
            var readers = orgTomlMap.readers;
            $('#readerList').DataTable().destroy();
            $("#readerListTbody").empty();
            var readersHtml = "";
            Object.keys(readers).forEach(function(key){
                readersHtml += "<tr>";
                readersHtml += "<td>"+key+"</td>";
                readersHtml += "<td>"+readers[key].connection_name+"</td>";
                readersHtml += "<td>";
                if(langType == "ko"){
                    readersHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasReader" aria-controls="offcanvasReader"type="button" onclick="protocol.modifyModalCall(\''+key+'\',\'reader\');">수정</button>';
                    readersHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteModalCall(\''+key+'\',\'reader\');">삭제</button>';
                }else{
                    readersHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasReader" aria-controls="offcanvasReader"type="button" onclick="protocol.modifyModalCall(\''+key+'\',\'reader\');">Modify</button>';
                    readersHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteModalCall(\''+key+'\',\'reader\');">Delete</button>';
                }
                readersHtml += "</td>";
                readersHtml += "</tr>";
            });
            $("#readerListTbody").append(readersHtml);
        }
        $("#readerList").DataTable({
            order: [ [ 0, "asc" ] ],
            "columnDefs": [
                { "orderable": true, "width": "35%", "targets": [0] },
                { "orderable": true, "width": "35%", "targets": [1] },
                { "orderable": false, "targets": [2]}
            ],
            autoWidth: false,
            info : false,
            lengthChange: false,
            "oLanguage": {
               "sSearch": "Reader Name : "
             }
             ,destory : true
        });
        var readerTable = $('#readerList').DataTable();
        $('#readerList_filter input').unbind().bind('keyup', function () {
            readerTable.column(0).search(this.value).draw();
        });
    }
    
    function callLocalScriptFileList(nodeAlias, nodeIpAddress, orgTomlMap){
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
            
            if(undefined != LocalScriptFileList){
                $("#scriptDivArea").empty();
                var scriptHtml = '';
                if(LocalScriptFileList.length > 0){
                    scriptHtml += '<div>';
                }else{
                    scriptHtml += '<div style="margin-bottom:15px;">';
                }
                scriptHtml += '    <span class="form-label" >';
                scriptHtml += '        <span class="text-danger">*</span> script_file - Converter script file<br/>Absolute path to converter script file';
                scriptHtml += '    </span><br/>';
                if(LocalScriptFileList.length > 0){
                    var firstCheck = true;
                    LocalScriptFileList.forEach(function(fileName) {
                        scriptHtml += '<div class="form-check form-check-inline">';
                        if(firstCheck){
                            scriptHtml += '    <input class="form-check-input"  type="checkbox" name="converter_script_file" id="'+fileName+'" value="'+fileName+'" checked/>';
                            firstCheck = false;
                        }else{
                            scriptHtml += '    <input class="form-check-input"  type="checkbox" name="converter_script_file" id="'+fileName+'" value="'+fileName+'"/>';
                        }
                        scriptHtml += '    <label class="form-check-label" for="'+fileName+'">'+fileName+'</label>';
                        scriptHtml += '</div>';
                    });
                }else{
                    if(langType == "ko"){
                        scriptHtml += '<span style="color:red;">스크립트 파일이 없습니다.</span>';
                    }else{
                        scriptHtml += '<span style="color:red;">There is no saved script file.</span>';
                    }
                }
                scriptHtml += '</div>';
                $("#scriptDivArea").append(scriptHtml);
            }
            
            tableSetting(orgTomlMap);
            
            $("input[name=converter_script_file]").on('click',function () {
                var script_length = document.getElementsByName("converter_script_file").length;
                var checkCount = 0;
                for (var i=0; i<script_length; i++) {
                   if (document.getElementsByName("converter_script_file")[i].checked == true) {
                       checkCount++;
                   }
                }
                if(checkCount < 1){
                    if(langType == "ko"){
                        toastr["error"]("최소 1개의 파일이 필요합니다.");
                    }else{
                        toastr["error"]("At least one script file must be selected.");
                    }
                    return false;
                }
            });
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
     
    function attributesMerge(type, commonMap, mainMap, subMap, otherMap){
        var returnMap = new Map();
        
        if(undefined != commonMap.types[type]){
            commonMap = commonMap.types[type].properties;
            Object.keys(commonMap).forEach(function(key){
                returnMap.set(key, commonMap[key]);
            });
            
            if(commonMap.required && type != "dp"){
                commonMap.required.forEach(function(element){
                    requiredComponentsList.push(element);
                });
            }
        }
        
        if(undefined != subMap && undefined != subMap.types[type]){
            subMap = subMap.types[type].properties;
            Object.keys(subMap).forEach(function(key){
                if(returnMap.has(key)){
                    var orgMap = returnMap.get(key);
                    Object.keys(subMap[key]).forEach(function(el){
                        orgMap[el] = subMap[key][el];
                        returnMap.set(key, orgMap);
                    });
                }else{
                    returnMap.set(key, subMap[key]);
                }
            });
            
            if(subMap.required && type != "dp"){
                subMap.required.forEach(function(element){
                    requiredComponentsList.push(element);
                });
            }
            
        }
        
        if(undefined != otherMap && undefined != otherMap.types[type]){
            otherMap = otherMap.types[type].properties;
            Object.keys(otherMap).forEach(function(key){
                if(returnMap.has(key)){
                    var orgMap = returnMap.get(key);
                    Object.keys(otherMap[key]).forEach(function(el){
                        orgMap[el] = otherMap[key][el];
                        returnMap.set(key, orgMap);
                    });
                }else{
                    returnMap.set(key, otherMap[key]);
                }
            });
            
            if(otherMap.required && type != "dp"){
                otherMap.required.forEach(function(element){
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
            
            if(mainMap.required && type != "dp"){
                mainMap.required.forEach(function(element){
                    requiredComponentsList.push(element);
                });
            }
            
        }
        return returnMap;
    }
    
    function makeDiv(v,k,requiredList,typesMap){
        var appendHtml = "";
        
        appendHtml += '<div class="mb-3">';
        appendHtml += '    <label class="form-label" for="'+k+'">';
        if(undefined != requiredList && Object.values(requiredList).includes(k)){
            appendHtml += '        <span class="text-danger">*</span> ';
        }else if(k == "conn_url" || k == "connection_name"){
            appendHtml += '        <span class="text-danger">*</span> ';
        }else if(v && v.item_count_min && v.item_count_min > 0){
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
                appendHtml += '    <input class="form-check-input" type="radio" name="'+k+'" value="'+item+'"';
                if(v.default && v.default == item){
                    defaultList.push({"key" : k, "val" : v.default});
                    appendHtml += ' checked ';
                }else if(undefined != v.default){
                    defaultList.push({"key" : k, "val" : v.default});
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
                            if(k == "dpg_list"){
                                appendHtml += ' <input class="form-control" id="'+k+'" name="'+k+'" type="email" list="'+k+'_datalist" autocomplete="off"  multiple/> ';
                                appendHtml += '<datalist id="'+k+'_datalist">';
                                appendHtml += '</datalist>';
                            }else{
                                appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" />';
                            }
                            arrayList.push(k);
                        }else{
                            checkTypeList.push({"name":k,"type":v.type.split("/")[2]});
                            stringList.push(k);
                            appendHtml += '<br/><span style="color: red;">VolumeMounts Setting is required when using</span>';
                            appendHtml += '    </label>';
                            if(v.default){
                                appendHtml += '    <input class="form-control" name="'+k+'" type="text" value="'+v.default+'"/>';
                            }else{
                                appendHtml += '    <input class="form-control" name="'+k+'" type="text" />';
                            }
                            
                            /*
                            appendHtml += '    </label>';
                            appendHtml += '<div>';
                            appendHtml += '<select class="form-select d-inline-block" name="'+k+'-select" onchange="protocol.changeOtherType(this)" style="width: 30%; padding: 0.3125rem 2rem 0.3125rem 1rem;">';
                            appendHtml += '    <option value="localpath" selected>local-path</option>';
                            appendHtml += '    <option value="configmap">configMap</option>';
                            appendHtml += '    <option value="secret">Secret</option>';
                            appendHtml += '</select>';
                            appendHtml += '    <input class="form-control" name="'+k+'" type="text" style="width:69%; display:inline-block;" placeholder="path value"/>';
                            appendHtml += '    <input class="form-control" name="'+k+'-name" type="text" style="width:30%; display:inline-block; margin-top: 10px;" placeholder="name value" onkeyup="allowEng(this)" onkeydown="allowEng(this)"/>';
                            appendHtml += '    <input class="form-control" name="'+k+'-sub" type="text" style="width:69%; display:inline-block;" placeholder="sub path value" readonly="true"/>';
                            appendHtml += '</div>';
                            */
                        }
                    }else{
                        stringList.push(k);
                        appendHtml += '    </label>';
                        appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" />';
                    }
                }else{
                    stringList.push(k);
                    appendHtml += '    </label>';
                    appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" />';
                }
            }else if(v.type == "array"){
                appendHtml += '<br/>Array Type : Separate multiple values ​​with commas';
                appendHtml += '    </label>';
                if(k == "dpg_list"){
                    appendHtml += ' <input class="form-control" id="'+k+'" name="'+k+'" type="email" list="'+k+'_datalist" autocomplete="off" multiple/> ';
                    appendHtml += '<datalist id="'+k+'_datalist">';
                    appendHtml += '</datalist>';
                }else{
                    appendHtml += '    <input class="form-control" id="'+k+'" name="'+k+'" type="text" />';
                }
                arrayList.push(k);
            }else{
                appendHtml += '    </label>';
                if(v.type == "boolean"){
                    appendHtml += '<div class="form-check form-switch">';
                    appendHtml += '<input class="form-check-input" id="'+k+'" name="'+k+'" type="checkbox" value="true" ';
                    if(v.default && v.default == true){
                        defaultList.push({"key" : k, "val" : v.default});
                        appendHtml += ' checked ';
                    }else if(undefined != v.default){
                        defaultList.push({"key" : k, "val" : v.default});
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
                    if(v.default){
                        defaultList.push({"key" : k, "val" : v.default});
                        appendHtml += ' value="'+v.default+'" ';
                    }
                    if(k == "connection_name" || k == "write_converter" || k == "read_converter" || k == "out_topic"){
                        appendHtml += ' list="'+k+'_datalist" autocomplete="off"/> ';
                        appendHtml += '<datalist id="'+k+'_datalist">';
                        appendHtml += '</datalist>';
                    }else{
                        appendHtml += ' /> ';
                    }
                    if(v.regex) appendHtml += ' <input type="hidden" name="regex-'+k+'" value="'+v.regex+'" />';
                }
            }
        }
        appendHtml += '</div>';
        return appendHtml;
    }
    
    function makeForm(type, commonMap, mainMap, subMap, typesMap, selectedPodName, otherMap){
        podName = selectedPodName;
        totalComponentsList = [];
        requiredComponentsList = [];
        stringList = [];
        integerList = [];
        booleanList = [];
        arrayList = [];
        dpAllList = [];
        dpRequired = [];
        
        defaultList = [];
        
        checkTypeList = [];
        reqCheckTypeList = [];
        
        deviceHtml = '';
        deviceRequired = [];
        deviceAllList = [];
        
        var componentsMap = attributesMerge(type, commonMap, mainMap, subMap, otherMap);
        var requiredList = componentsMap.get("required");
        componentsMap.delete("required");
        componentsMap.delete("dp_list");
        
        var appendHtml = "";
        var deviceHtmlAdd = "";
        $("#form_"+type).empty();
        
        appendHtml += '<form id="formView_'+type+'" name="formView_'+type+'" method="post">';
        appendHtml += '<div class="mb-3">';
        appendHtml += '    <label class="form-label" for="name_'+type+'">';
        appendHtml += '        <span class="text-danger">*</span>';
        appendHtml += '        '+type+' name';
        appendHtml += '    </label>';
        appendHtml += '    <input class="form-control" id="name_'+type+'" name="name_'+type+'" type="text" placeholder="'+type+' Name" value="" />';
        appendHtml += '    <input class="form-control" id="name_'+type+'-org" name="name_'+type+'-org" type="hidden"/>';
        appendHtml += '</div>';
        componentsMap.forEach((v, k) => {
            if(k == "device_mapping"){
                
                var deviceMap = attributesMerge("device-mapping", commonMap, mainMap, subMap, otherMap);
                var deviceRequiredList = deviceMap.get("required");
                deviceAllList.push("device_name");
                if(undefined != deviceRequiredList){
                    deviceRequiredList.push("device_name");
                    deviceRequired = deviceRequiredList;
                }else{
                    deviceRequired.push("device_name");
                }
                deviceMap.delete("required");
                
                deviceHtmlAdd += '<div class="mb-3">';
                deviceHtmlAdd += '    <label class="form-label" >';
                deviceHtmlAdd += '        Device Mapping';
                deviceHtmlAdd += '    </label><br/>';
                deviceHtmlAdd += '<ul class="nav nav-tabs" id="deviceTabList" role="tablist">';
                deviceHtmlAdd += '    <li class="nav-item"><a class="nav-link" href="javascript:protocol.addDeviceTab();"><span class="fas fa-plus mr-1"></span></a></li>';
                deviceHtmlAdd += '</ul>';
                deviceHtmlAdd += '<div class="tab-content border-x border-bottom p-3" id="myTabDevice" style="display:none;">';
                
                deviceMap.forEach((v, k) => {
                    deviceHtml += makeDiv(v,k,deviceRequiredList,typesMap);
                    deviceAllList.push(k);
                });
                
                deviceHtmlAdd += '</div>';
                deviceHtmlAdd += '</div>';
                
            }else{
                appendHtml += makeDiv(v,k,requiredList,typesMap);
                totalComponentsList.push(k);
            }
        });
        
        if(deviceHtmlAdd != ''){
            appendHtml += deviceHtmlAdd;
        }
        
        appendHtml += '</form>';
        
        if(type == "dpg"){
            var dpMap = attributesMerge("dp", commonMap, mainMap, subMap, otherMap);
            var dpRequiredList = dpMap.get("required");
            dpAllList.push("dp_name");
            if(undefined != dpRequiredList){
                dpRequiredList.push("dp_name");
                dpRequired = dpRequiredList;
            }else{
                dpRequired.push("dp_name");
            }
            dpMap.delete("required");
            appendHtml += '<div class="mb-3">';
            appendHtml += '    <span class="form-label" >';
            appendHtml += '        <span class="text-danger">*</span> Dp List';
            if(langType == "ko"){
                appendHtml += '    <button class="btn btn-primary mr-1 mb-1 btn-sm" style="margin-left: 10px;" type="button" onclick="protocol.addDpTab();">신규</button>';
            }else{
                appendHtml += '    <button class="btn btn-primary mr-1 mb-1 btn-sm" style="margin-left: 10px;" type="button" onclick="protocol.addDpTab();">New</button>';
            }
            appendHtml += '    </span>';
            //appendHtml += '<ul class="nav nav-tabs" id="dpTabList" role="tablist">';
            //appendHtml += '    <li class="nav-item"><a class="nav-link" href="javascript:protocol.addDpTab();"><span class="fas fa-plus mr-1"></span></a></li>';
            //appendHtml += '</ul>';
            appendHtml += '<div class="table-responsive scrollbar" id="myTabDp">';
            appendHtml += '<table class="table table-bordered table-striped fs--1 mb-0" id="dpList">';
            appendHtml += '  <thead class="bg-200 text-900">';
            appendHtml += '    <tr>';
            appendHtml += '      <th>Dp Name</th>';
            appendHtml += '      <th>Manage</th>';
            appendHtml += '    </tr>';
            appendHtml += '  </thead>';
            appendHtml += '  <tbody id="dpListTbody">';
            appendHtml += '  </tbody>';
            appendHtml += '</table>';
            appendHtml += '</div>';
            
            appendHtml += '</div>';
            
            dpHtml = '';
            convertersCheck = true;
            dpMap.forEach((v, k) => {
                dpHtml += makeDiv(v,k,dpRequiredList,typesMap);
                dpAllList.push(k);
            });
        }
        
        appendHtml += '<div style="text-align: right;">';
        if(langType == "ko"){
            appendHtml += '    <button class="btn btn-info mr-1 mb-1" type="button" value="'+type+'" onclick="protocol.checkValidation(this.value);">저장</button>';
        }else{
            appendHtml += '    <button class="btn btn-info mr-1 mb-1" type="button" value="'+type+'" onclick="protocol.checkValidation(this.value);">Save</button>';
        }
        appendHtml += '</div>';
        
        totalComponentsList.push("name_"+type+"-org");
        
        $("#form_"+type).append(appendHtml);
        
        if(type == "dpg"){
            dpDataTableSetting();
        }
    }
    
    function settingCovrtMapping(){
        if(undefined != extraOrgToml){
            if(undefined != extraOrgToml.converters){
                var convertMap = extraOrgToml.converters.defs;
                if(undefined != convertMap){
                    if(convertersCheck){
                        var connAppendHtml = "";
                        Object.keys(convertMap).forEach(function(key){
                            connAppendHtml += '<option>'+key+'</option>';
                        });
                        $("#write_converter_datalist").append(connAppendHtml);
                        $("#read_converter_datalist").append(connAppendHtml);
                        convertersCheck = false;
                    }
                }
            }
        }
    }
    
    function addDeviceTab(){
        var deviceName = $("#deviceName").val();
        var appendHtml = '';
        appendHtml += '    <li class="nav-item" id="tabLi_'+deviceName+'">';
        appendHtml += '        <a class="nav-link deviceCheck" id="tabId_'+deviceName+'" aria-controls="tabCon_'+deviceName+'" href="#tabCon_'+deviceName+'" data-bs-toggle="tab" role="tab">';
        appendHtml += deviceName;
        appendHtml += '        </a>';
        appendHtml += '    </li>';
        $("#deviceTabList").append(appendHtml);
        var dpHtmlAdd = '';
        dpHtmlAdd = '     <div class="tab-pane fade" role="tabpanel" aria-labelledby="tabId_'+deviceName+'" id="tabCon_'+deviceName+'">';
        dpHtmlAdd += '<form name="deviceForm" method="post">';
        dpHtmlAdd += '<div class="mb-3">';
        dpHtmlAdd += '    <label class="form-label" for="device_name" style="width:100%;">';
        dpHtmlAdd += '        <span class="text-danger">*</span>';
        dpHtmlAdd += '        device_name';
        if(langType == "ko"){
            dpHtmlAdd += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="float: right;" value="'+deviceName+'" onclick="protocol.deleteDevice(this.value);">삭제</button>';
        }else{
            dpHtmlAdd += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="float: right;" value="'+deviceName+'" onclick="protocol.deleteDevice(this.value);">Delete</button>';
        }
        
        dpHtmlAdd += '    </label>';
        dpHtmlAdd += '    <input class="form-control" name="device_name" type="text" placeholder="device Name" value="'+deviceName+'" />';
        dpHtmlAdd += '</div>';
        dpHtmlAdd += deviceHtml;
        dpHtmlAdd += '</form>';
        dpHtmlAdd += '     </div>';
        $("#myTabDevice").append(dpHtmlAdd);
        $("#myTabDevice").css("display","");
        $('#deviceSaveModal').modal('hide');
        document.getElementById('tabId_'+deviceName).click();
    }
    
    function addDpTab(){
        if(isDefined($("#name_dpg").val())){
            if(langType == "ko"){
                $("#dpSaveModalLabel").html("Data Point 등록");
            }else{
                $("#dpSaveModalLabel").html("Add Data Point");
            }
            $("#dpSaveDiv").empty();
            $("#dpSaveDiv").append(dpHtml);
            $("#dp_name").val("");
            $("#dp_name").attr("readonly",false);
            $('#dpSaveModal').modal('show');
        }else{
            if(langType == "ko"){
                toastr["warning"]("dpg name을 입력해 주세요.");
            }else{
                toastr["warning"]("Please enter the dpg name.");
            }
        }
    }
    
    function deleteDp(){
        var dpMap = new Map();
        var deleteDpName = $("#dpDeleteName").val();
        var dpgName = $("#name_dpg").val();
        var dpgNameOrg = $("#name_dpg-org").val();
        
        var dpgClassCheck = document.getElementsByClassName('dpCheck');
        if(dpgClassCheck.length < 2 ){
            if(langType == "ko"){
                toastr["error"]("최소 1개 dp가 필요합니다.");
            }else{
                toastr["error"]("At least one dp is required.");
            }
            throw new Error("At least one dp is required.");
        }
        
        dpSave(dpgName, dpgNameOrg, dpMap,deleteDpName);
    }
    
    function dpSaveValidation(){
        var dpMap = new Map();
        dpAllList.forEach(function(dpKey){
            var dpVal = document.dpForm.elements[dpKey].value;
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
        });
        var dpgName = $("#name_dpg").val();
        var dpgNameOrg = $("#name_dpg-org").val();
        dpSave(dpgName, dpgNameOrg, dpMap,"");
    }
    
    function dpSave(nowDpgName, orgDpgName, dpMap, deleteDpName){
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val(),
            dpMap : Object.fromEntries(dpMap),
            stringList : stringList,
            integerList : integerList,
            booleanList : booleanList,
            arrayList : arrayList,
            nowPodName : podName,
            nowDpgName : nowDpgName,
            orgDpgName : orgDpgName,
            defaultList : defaultList,
            deleteDpName : deleteDpName
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/dp/view/save";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("스키마 toml 저장 성공.");
            }else{
                toastr["success"]("Save the schema Toml Success.");
            }
            $('#dpSaveModal').modal('hide');
            $("#dpDeleteName").val("");
            $("#dpDeleteModal").modal('hide');
            tableSetting(response.orgTomlFile);
            dpDataTableSetting(response.orgTomlFile);
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
    
    function checkValidation(type){
        var parameterMap = new Map();
        var formName = document.forms["formView_"+type];
        var dpList = [];
        var deviceList = [];
        var typeName = removeSpace(formName.elements["name_"+type].value);
        if(!isDefined(typeName)){
            toastr["error"](type+" name is required.");
            return false;
        }else{
            parameterMap.set("name",typeName);
        }
        
        totalComponentsList.forEach(function(componentKey){
            var componentVal = formName.elements[componentKey].value;
            if(booleanList.includes(componentKey)){
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
        
        if(type == "converter"){
            var script_length = document.getElementsByName("converter_script_file").length;
            var scriptList = [];
            for (var i=0; i<script_length; i++) {
               if (document.getElementsByName("converter_script_file")[i].checked == true) {
                    scriptList.push(document.getElementsByName("converter_script_file")[i].value);
               }
            }
            parameterMap.set("scriptList",scriptList);
        }
        /*
        parameterMap.forEach((v, k) => {
            for(var i=0;i<checkTypeList.length;i++){
                if(checkTypeList[i].name == k){
                    if($("input[name="+checkTypeList[i].name+"-name]").val() != "" && $("input[name="+checkTypeList[i].name+"-name]").val() != null){
                        reqCheckTypeList.push({"type":checkTypeList[i].type,"attr":checkTypeList[i].name,"gubun":type,"name":typeName
                        ,"pathType":$("select[name="+checkTypeList[i].name+"-select]").val(),"pathName":type+"-"+$("input[name="+checkTypeList[i].name+"-name]").val()
                        ,"path":v, "pathSub":$("input[name="+checkTypeList[i].name+"-sub]").val()});
                    }else{
                        reqCheckTypeList = [];
                        toastr["error"](k+" name value is required.");
                        throw new Error(k+" name value is required.");
                    }
                }
            }
        });
        */
        if(type == "dpg"){
            var dpgClassCheck = document.getElementsByClassName('dpCheck');
            if(dpgClassCheck.length < 1 ){
                if(langType == "ko"){
                    toastr["error"]("최소 1개 dp가 필요합니다.");
                }else{
                    toastr["error"]("At least one dp is required.");
                }
                throw new Error("At least one dp is required.");
            }
        }
        
        if(deviceHtml != ''){
            var deviceClassCheck = document.getElementsByClassName('deviceCheck');
            if(deviceClassCheck.length == 1){
                var deviceMap = new Map();
                deviceAllList.forEach(function(deviceKey){
                    var deviceVal = document.deviceForm.elements[deviceKey].value;
                    if(booleanList.includes(deviceKey)){
                        if(document.forms["deviceForm"].elements[deviceKey].checked){
                            deviceMap.set(deviceKey, "true");
                        }else{
                            deviceMap.set(deviceKey, "false");
                        }
                    }else{
                        if( undefined != deviceRequired && Object.values(deviceRequired).includes(deviceKey) ){
                            if(!isDefined(deviceVal)){
                                toastr["error"](deviceKey+" is required.");
                                throw new Error(deviceKey+" is required.");
                            }else{
                                deviceMap.set(deviceKey, deviceVal);
                            }
                        }else{
                            if(isDefined(deviceVal)){
                                deviceMap.set(deviceKey, deviceVal);
                            }
                        }
                    }
                });
                deviceList.push(Object.fromEntries(deviceMap));
            }else{
                for(var i=0;i<deviceClassCheck.length;i++){
                    var deviceMap = new Map();
                    deviceAllList.forEach(function(deviceKey){
                        var deviceVal = document.deviceForm[i].elements[deviceKey].value;
                        if(booleanList.includes(deviceKey)){
                            if(document.getElementsByName(deviceKey)[i].checked == true){
                                deviceMap.set(deviceKey, "true");
                            }else{
                                deviceMap.set(deviceKey, "false");
                            }
                        }else{
                            if( undefined != deviceRequired && Object.values(deviceRequired).includes(deviceKey) ){
                                if(!isDefined(deviceVal)){
                                    var num = i+1;
                                    toastr["error"](num+"th "+ deviceKey+" is required.");
                                    throw new Error(num+"th "+ deviceKey+" is required.");
                                }else{
                                    deviceMap.set(deviceKey, deviceVal);
                                }
                            }else{
                                if(isDefined(deviceVal)){
                                    deviceMap.set(deviceKey, deviceVal);
                                }
                            }
                        }
                    });
                    deviceList.push(Object.fromEntries(deviceMap));
                }
            }
        }
        
        saveProtocolView(parameterMap, stringList, integerList, booleanList, arrayList, podName, type, dpList, defaultList, reqCheckTypeList, deviceList);
    }
    
    function saveProtocolView(parameterMapData, stringList, integerList, booleanList, arrayList, nowPodName, type, dpList, defaultList, otherList, deviceList){
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val(),
            componentsMap : Object.fromEntries(parameterMapData),
            stringList : stringList,
            integerList : integerList,
            booleanList : booleanList,
            arrayList : arrayList,
            nowPodName : nowPodName,
            viewType : type,
            dpList : dpList,
            defaultList : defaultList,
            otherList : otherList,
            deviceList : deviceList
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/protocol/view/save";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("스키마 toml 저장 성공.");
            }else{
                toastr["success"]("Save the schema Toml Success.");
            }
            $("#viewCloseBtn_"+type).trigger("click");
            tableSetting(response.orgTomlFile);
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
    
    function excelDownload(commonSchemaToml, podMainSchemaToml, subToml, typesToml, podMainSchemaTomlName, otherToml){
        var connectionMap = attributesMerge("connection", commonSchemaToml, podMainSchemaToml, subToml, otherToml);
        var converterMap = attributesMerge("converter", commonSchemaToml, podMainSchemaToml, subToml, otherToml);
        var dpgMap = attributesMerge("dpg", commonSchemaToml, podMainSchemaToml, subToml, otherToml);
        var dpMap = attributesMerge("dp", commonSchemaToml, podMainSchemaToml, subToml, otherToml);
        var readerMap = attributesMerge("reader", commonSchemaToml, podMainSchemaToml, subToml, otherToml);
        
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val(),
            nowPodName : podMainSchemaTomlName,
            connectionMap : Object.fromEntries(connectionMap),
            converterMap : Object.fromEntries(converterMap),
            dpgMap : Object.fromEntries(dpgMap),
            dpMap : Object.fromEntries(dpMap),
            readerMap : Object.fromEntries(readerMap)
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/protocol/excel/download";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(undefined != response.msg){
                if(langType == "ko"){
                    toastr["success"]("엑셀 다운로드 성공.");
                }else{
                    toastr["success"]("Excel Download Success.");
                }
                downFile(response.fileName, $("#modalNodeAliasprotocol").val(), $("#modalNodeIpAddressprotocol").val());
            }else{
                if(langType == "ko"){
                    toastr["error"]("엑셀 다운로드 실패.");
                }else{
                    toastr["error"]("Failed to download the excel.");
                }
            }
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("엑셀 다운로드 실패.");
            }else{
                toastr["error"]("Failed to download the excel.");
            }
        };
        ajaxWrapper.callAjax(option);
    }
    
    function downFile(fileName, aliasPath, aliasIp){
        location.href="/api/protocol/fileDownload?file_name=" + fileName+"&aliasPath="+aliasPath+"&aliasIp="+aliasIp; 
    }
    
    function excelUpload(type,commonSchemaToml, podMainSchemaToml, subToml, typesToml, podMainSchemaTomlName, otherToml){
        var connectionMap = attributesMerge("connection", commonSchemaToml, podMainSchemaToml, subToml, otherToml);
        var converterMap = attributesMerge("converter", commonSchemaToml, podMainSchemaToml, subToml, otherToml);
        var dpgMap = attributesMerge("dpg", commonSchemaToml, podMainSchemaToml, subToml, otherToml);
        var dpMap = attributesMerge("dp", commonSchemaToml, podMainSchemaToml, subToml, otherToml);
        var readerMap = attributesMerge("reader", commonSchemaToml, podMainSchemaToml, subToml, otherToml);
        
        var script_length = document.getElementsByName("converter_script_file").length;
        var scriptList = [];
        for (var i=0; i<script_length; i++) {
           if (document.getElementsByName("converter_script_file")[i].checked == true) {
                scriptList.push(document.getElementsByName("converter_script_file")[i].value);
           }
        }
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val(),
            connectionMap : Object.fromEntries(connectionMap),
            converterMap : Object.fromEntries(converterMap),
            dpgMap : Object.fromEntries(dpgMap),
            dpMap : Object.fromEntries(dpMap),
            readerMap : Object.fromEntries(readerMap),
            nowPodName : podMainSchemaTomlName,
            scriptList: scriptList
        };
        
        var formData = new FormData();
        formData.append('file', $('#file_'+type)[0].files[0]);
        
        formData.append('key', new Blob([ JSON.stringify(param) ], {type : "application/json"}));
        
        $.ajax({
              url: '/api/pod/protocol/excel/upload',
              type : "POST",
              data: formData,
              contentType: false,
              headers : getCsrfHeader(),
              processData: false,
              enctype : 'multipart/form-data',
              success: function(result) {
                if(undefined != result.orgTomlFile){
                    if(langType == "ko"){
                        toastr["success"]("엑셀 업로드 성공.");
                    }else{
                        toastr["success"]("Excel Upload Success.");
                    }
                    tableSetting(result.orgTomlFile);
                }else {
                    if(langType == "ko"){
                        toastr["error"]("엑셀 업로드 실패.");
                    }else{
                        toastr["error"]("Failed to upload the excel.");
                    }
                    console.log(result.error);
                }
              },
              error: function (result) {
                console.log(result);
                if(langType == "ko"){
                    toastr["error"]("엑셀 업로드 실패.");
                }else{
                    toastr["error"]("Failed to upload the excel.");
                }
              }
        });
        document.getElementById("file_"+type).value = "";
    }
    
    function insertForm(type, name, orgTomlFile, yamlCheckList){
        var orgMap;
        var objectType = {};
        var arrayType = [];
        var formName = document.forms["formView_"+type];
        if(type == "connection"){
            orgMap = orgTomlFile.connections[name];
        }else if(type == "converter"){
            orgMap = orgTomlFile.converters.defs[name];
        }else if(type == "reader"){
            orgMap = orgTomlFile.readers[name];
        }else{
            orgMap = orgTomlFile.dpg_list[name];
        }
        formName.elements["name_"+type].value = name;
        formName.elements["name_"+type+"-org"].value = name;
        
        $('#dpList').DataTable().destroy();
        $("#dpListTbody").empty();
        var dpsHtml = "";
        
        if(null != orgMap && undefined != orgMap){
            Object.keys(orgMap).forEach(function(k){
                var v = orgMap[k];
                if (typeof(v) === 'number') {
                    formName.elements[k].value = v;
                }else if(typeof(v) === 'boolean'){
                    formName.elements[k].checked = v;
                }else if(typeof(v) === 'string'){
                    formName.elements[k].value = v;
                }else if(typeof(v) === typeof(arrayType)){
                    if(k == "dp_list"){
                        var vSorting = Object.keys(v).sort().reduce(
                          (obj, key) => { 
                            obj[key] = v[key]; 
                            return obj;
                          }, 
                          {}
                        );
                        v = vSorting;
                        Object.keys(v).forEach(function(vk,index){
                            dpsHtml += "<tr class='dpCheck'>";
                            dpsHtml += "<td>"+vk+"</td>";
                            dpsHtml += "<td>";
                            if(langType == "ko"){
                                dpsHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" type="button" onclick="protocol.modifyDpModalCall(\''+vk+'\');">수정</button>';
                                dpsHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteDpModalCall(\''+vk+'\');">삭제</button>';
                            }else{
                                dpsHtml += '    <button class="btn btn-falcon-primary mr-1 mb-1 btn-ssm2" type="button" onclick="protocol.modifyDpModalCall(\''+vk+'\');">Modify</button>';
                                dpsHtml += '    <button class="btn btn-falcon-danger mr-1 mb-1 btn-ssm2" style="margin-left:10px;" type="button" onclick="protocol.deleteDpModalCall(\''+vk+'\');">Delete</button>';
                            }
                            dpsHtml += "</td>";
                            dpsHtml += "</tr>";
                        });
                    }else if(k != "device_mapping"){
                        var listVal = "";
                        for(var i=0;i<v.length;i++){
                            if(i == 0){
                                listVal += v[i];
                            }else{
                                listVal += ","+v[i];
                            }
                        }
                        formName.elements[k].value = listVal;
                    }else{
                        var vSorting = Object.keys(v).sort().reduce(
                          (obj, key) => { 
                            obj[key] = v[key]; 
                            return obj;
                          }, 
                          {}
                        );
                        v = vSorting;
                        var numCheck = 0;
                        Object.keys(v).forEach(function(vk,index){
                            var deviceMap = v[vk];
                            var deviceName = vk;
                            var appendHtml = '';
                            appendHtml += '    <li class="nav-item" id="tabLi_'+deviceName+'">';
                            appendHtml += '        <a class="nav-link deviceCheck" id="tabId_'+deviceName+'" aria-controls="tabCon_'+deviceName+'" href="#tabCon_'+deviceName+'" data-bs-toggle="tab" role="tab">';
                            appendHtml += deviceName;
                            appendHtml += '        </a>';
                            appendHtml += '    </li>';
                            $("#deviceTabList").append(appendHtml);
                            var deviceHtmlAdd = '';
                            deviceHtmlAdd = '     <div class="tab-pane fade" role="tabpanel" aria-labelledby="tabId_'+deviceName+'" id="tabCon_'+deviceName+'">';
                            deviceHtmlAdd += '<form name="deviceForm" method="post">';
                            deviceHtmlAdd += '<div class="mb-3">';
                            deviceHtmlAdd += '    <label class="form-label" for="dp_name" style="width:100%;">';
                            deviceHtmlAdd += '        <span class="text-danger">*</span>';
                            deviceHtmlAdd += '        device_name';
                            if(langType == "ko"){
                                deviceHtmlAdd += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="float: right;" value="'+deviceName+'" onclick="protocol.deleteDevice(this.value);">삭제</button>';
                            }else{
                                deviceHtmlAdd += '<button class="btn btn-outline-danger mr-1 mb-1 btn-sm" type="button" style="float: right;" value="'+deviceName+'" onclick="protocol.deleteDevice(this.value);">Delete</button>';
                            }
                            deviceHtmlAdd += '    </label>';
                            deviceHtmlAdd += '    <input class="form-control" name="device_name" type="text" placeholder="DASIV01" value="'+deviceName+'" />';
                            deviceHtmlAdd += '</div>';
                            deviceHtmlAdd += deviceHtml;
                            deviceHtmlAdd += '</form>';
                            deviceHtmlAdd += '     </div>';
                            $("#myTabDevice").append(deviceHtmlAdd);
                            $("#myTabDevice").css("display","");
                            $('#deviceSaveModal').modal('hide');
                            if(index == 0){
                                document.getElementById('tabId_'+deviceName).click();
                            }
                            var deviceClassCheck = document.getElementsByClassName('deviceCheck').length;
                            var deviceForm = document.deviceForm;
                            if(deviceClassCheck > 1){
                                deviceForm = document.deviceForm[deviceClassCheck-1];
                            }
                            Object.keys(deviceMap).forEach(function(deviceKey){
                                var deviceV = deviceMap[deviceKey];
                                if (typeof(deviceV) === 'number') {
                                    
                                    document.getElementsByName(deviceKey)[numCheck].value = deviceV;
                                    
                                    //deviceForm.elements[deviceKey].value = deviceV;
                                }else if(typeof(deviceV) === 'boolean'){
                                    document.getElementsByName(deviceKey)[numCheck].checked = deviceV;
                                    //deviceForm.elements[deviceKey].checked = deviceV;
                                }else if(typeof(deviceV) === 'string'){
                                    //document.getElementsByName(deviceKey)[numCheck].value = deviceV;
                                    deviceForm.elements[deviceKey].value = deviceV;
                                }else if(typeof(deviceV) === typeof(arrayType)){
                                    var listVal = "";
                                    for(var i=0;i<deviceV.length;i++){
                                        if(i == 0){
                                            listVal += deviceV[i];
                                        }else{
                                            listVal += ","+deviceV[i];
                                        }
                                    }
                                    document.getElementsByName(deviceKey)[numCheck].value = listVal;
                                }else{
                                    console.log("Obj Start");
                                    console.log(deviceKey);
                                    console.log(deviceV);
                                    console.log("Obj End");
                                }
                            });
                            numCheck++;
                        });
                    }
                }else if(typeof(v) === typeof(objectType)){
                    console.log("Obj Start");
                    console.log(k);
                    console.log(v);
                    console.log("Obj End");
                }
            });
            
            $("#dpListTbody").append(dpsHtml);
            $("#dpList").DataTable({
                order: [ [ 0, "asc" ] ],
                "columnDefs": [
                    { "orderable": true, "width": "60%", "targets": [0] },
                    { "orderable": false, "targets": [1]}
                ],
                autoWidth: false,
                info : false,
                lengthChange: false,
                "oLanguage": {
                   "sSearch": "Dp Name : "
                 }
                 ,destory : true
            });
            var dpTable = $('#dpList').DataTable();
            $('#dpList_filter input').unbind().bind('keyup', function () {
                dpTable.column(0).search(this.value).draw();
            });
            
        }
        /*
        if(null != yamlCheckList && undefined != yamlCheckList && yamlCheckList.length > 0){
            for(var i=0;i<yamlCheckList.length;i++){
                var yamlCheck = yamlCheckList[i];
                if(name == yamlCheck.name){
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
        }
        */
        if(convertersCheck){
            settingCovrtMapping();
        }
    }
    
    function logLevelSave(){
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val(),
            logLevel : $("select[name=protocolLogLevel] option:selected").val()
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
        var btnHtml = '<button class="btn btn-info mr-1 mb-1" type="button" onclick="protocol.saveMounts();">Save</button>';
        if(langType == "ko"){
            btnHtml = '<button class="btn btn-info mr-1 mb-1" type="button" onclick="protocol.saveMounts();">저장</button>';
        }
        var resetHtml = '<h4 class="mb-1" id="volumeMountModalLabel" style="    display: inline-block;">VolumeMounts Setting</h4>';
        if(langType == "ko"){
            resetHtml = '<h4 class="mb-1" id="volumeMountModalLabel" style="    display: inline-block;">볼륨 마운트 셋팅</h4>';
            resetHtml += '<button class="btn btn-danger mr-1 mb-1" type="button" onclick="protocol.resetMounts();" style="margin-left:10px;">초기화</button>';
        }else{
            resetHtml += '<button class="btn btn-danger mr-1 mb-1" type="button" onclick="protocol.resetMounts();" style="margin-left:10px;">Reset</button>';
        }
        $("#volumeMountsBtn").append(btnHtml);
        $("#volumeMountsReset").append(resetHtml);
        $("#volumeMountsDiv").append(appendHtml);
    }
    
    function saveMounts(volumeMountMap){
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val(),
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
    
    function settingMapping(type, orgToml, qList){
        extraOrgToml = orgToml;
        if(type == "reader"){
            if(undefined != orgToml){
                var connectionMap = orgToml.connections;
                var dpgMap = orgToml.dpg_list;
                var connAppendHtml = "";
                Object.keys(connectionMap).forEach(function(connKey){
                    connAppendHtml += '<option>'+connKey+'</option>';
                });
                $("#connection_name_datalist").append(connAppendHtml);
                var dpgAppendHtml = "";
                Object.keys(dpgMap).forEach(function(dpgKey){
                    dpgAppendHtml += '<option>'+dpgKey+'</option>';
                });
                $("#dpg_list_datalist").append(dpgAppendHtml);
            }
            
            if(qList.length > 0){
                var appendHtml = '';
                for(var i=0;i<qList.length;i++){
                    var qInfo = qList[i];
                    var qGubun = qInfo.split("|")[0];
                    var qType = qInfo.split("|")[1];
                    var qApp = qInfo.split("|")[2];
                    var qName = qInfo.split("|")[3];
                    if(qGubun == "in" || qType == "sender"){
                        appendHtml += '<option value="'+qName+'">'+qApp+'</option>';
                    }
                }
                $("#out_topic_datalist").append(appendHtml);
            }
            
        }
    }
    
    function settingTemplateModal(){
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val()
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
            let selectedPodTypeFull = $("#modalPodNameprotocol").val();
            let selectedPodType = selectedPodTypeFull.split("-")[0]+"-"+selectedPodTypeFull.split("-")[1];
            $("#configTemplateType").val(selectedPodType);
            $("#configTemplateGubun").val($("#modalPodTypeprotocol").val());
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
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val()
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
                protocol.openCanvas(response.orgTomlFile);
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
    
    function insertDpForm(map, name){
        if(langType == "ko"){
            $("#dpSaveModalLabel").html("Data Point 수정");
        }else{
            $("#dpSaveModalLabel").html("Modify Data Point");
        }
        $("#dpSaveDiv").empty();
        $("#dpSaveDiv").append(dpHtml);
        $("#dp_name").val(name);
        $("#dp_name").attr("readonly",true);
        $('#dpSaveModal').modal('show');
        
        if(null != map && undefined != map){
            var formName = document.forms["dpForm"];
            Object.keys(map).forEach(function(k){
                var v = map[k];
                if (typeof(v) === 'number') {
                    formName.elements[k].value = v;
                }else if(typeof(v) === 'boolean'){
                    formName.elements[k].checked = v;
                }else if(typeof(v) === 'string'){
                    formName.elements[k].value = v;
                }else if(typeof(v) === typeof(arrayType)){
                    var listVal = "";
                    for(var i=0;i<v.length;i++){
                        if(i == 0){
                            listVal += v[i];
                        }else{
                            listVal += ","+v[i];
                        }
                    }
                    formName.elements[k].value = listVal;
                }else if(typeof(v) === typeof(objectType)){
                    console.log("Obj Start");
                    console.log(k);
                    console.log(v);
                    console.log("Obj End");
                }
            });
        }
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    protocol.configTemplateSave = function(){
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
     
    protocol.configTemplateChangeEvent = function(v){
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
    
    protocol.settingTemplateModal = function(){
        settingTemplateModal();
    }
    
    protocol.resetMounts = function(){
        var volumeMountMap = new Map();
        saveMounts(volumeMountMap);
    }
    
    protocol.saveMounts = function(){
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
    
    protocol.logLevelSave = function(){
        logLevelSave();
    }
     
    protocol.checkValidation = function(type){
        checkValidation(type);
    }
    
    protocol.openCanvas = function(orgTomlFile){
        if(orgTomlFile && orgTomlFile.log){
            $("select[name=protocolLogLevel]").val(orgTomlFile.log["log_level"]).prop("selected", true);
        }else{
            $("select[name=protocolLogLevel]").val("info").prop("selected", true);
        }
        callLocalScriptFileList($("#modalNodeAliasprotocol").val(), $("#modalNodeIpAddressprotocol").val(), orgTomlFile);
    }
    
    // new canvas
    protocol.openCanvasView = function(type){
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val()
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/archive/read";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            var podMainSchemaTomlName = response["image_info.toml"]["schema"].split("/")[1]; // image_info 에서 main toml name
            var podMainSchemaToml = response[podMainSchemaTomlName]; // pod main toml
            var podImageVersion = response["image_info.toml"]["version"];
            var commonSchemaToml = response["protocol-module-"+podImageVersion+".toml"]; // protocol common toml
            var typesToml = response["types-"+podImageVersion+".toml"];
            var subToml;
            var otherToml;
            if(podMainSchemaTomlName.startsWith("accura2300") || podMainSchemaTomlName.startsWith("accura2500")){
                subToml = response["modbus-"+podImageVersion+".toml"];
                otherToml = response["accura2k-"+podImageVersion+".toml"];
            }else if(podMainSchemaTomlName.startsWith("ntek")){
                subToml = response["modbus-"+podImageVersion+".toml"];
            }else if(podMainSchemaTomlName.startsWith("tcplistener")){
                subToml = response["listener-"+podImageVersion+".toml"];
            }
            makeForm(type, commonSchemaToml, podMainSchemaToml, subToml, typesToml, podMainSchemaTomlName, otherToml);
            settingMapping(type, response.orgTomlFile, response["qList"]);
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
    
    protocol.addDpTab = function(){
        addDpTab();
    }
    
    protocol.dpSave = function(){
        dpSaveValidation();
    }
    
    protocol.modifyDpModalCall = function(dpName){
        if(isDefined($("#name_dpg").val())){
            var param = {
                nodeAlias : $("#modalNodeAliasprotocol").val(),
                nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
                pipeName : $("#modalPipeNameprotocol").val(),
                podType: $("#modalPodTypeprotocol").val(),
                podName : $("#modalPodNameprotocol").val(),
                nodeAppName : $("#modalNodeAppNameprotocol").val(),
                dpName : dpName,
                dpgName : $("#name_dpg").val()
            };
            
            var option = deepExtend({}, ajaxOptions);
            option.URL = "/api/pod/config/dp/read";
            option.PARAM = JSON.stringify(param);
            option.HEADERS = getCsrfHeader();
            option.TYPE = "POST";
            option.CALLBACK = function (response) {
                insertDpForm(response.dp, dpName);
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
        }else{
            if(langType == "ko"){
                toastr["warning"]("dpg name을 입력해 주세요.");
            }else{
                toastr["warning"]("Please enter the dpg name.");
            }
        }
    }
    
    protocol.deleteDp = function(){
        deleteDp();
    }
    
    protocol.deleteDpModalCall = function(dpName){
        if(langType == "ko"){
            $("#dpDeleteModalLabel").html(dpName+"을 삭제하시겠습니까?");
        }else{
            $("#dpDeleteModalLabel").html("Are you sure you want to delete "+dpName+"?");
        }
        $("#dpDeleteName").val(dpName);
        $("#dpDeleteModal").modal('show');
    }
    
    protocol.allClose = function(){
        $("#viewCloseBtn_connection").trigger("click");
        $("#viewCloseBtn_converter").trigger("click");
        $("#viewCloseBtn_dpg").trigger("click");
        $("#viewCloseBtn_reader").trigger("click");
        $('#converterList').DataTable().destroy();
        $('#dpgList').DataTable().destroy();
        $('#readerList').DataTable().destroy();
        $('#connectionList').DataTable().destroy();
        $("#connectionListTbody").empty();
        $("#converterListTbody").empty();
        $("#dpgListTbody").empty();
        $("#readerListTbody").empty();
    }
    
    protocol.modifyModalCall = function(name, type){
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val()
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/archive/read";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            var podMainSchemaTomlName = response["image_info.toml"]["schema"].split("/")[1]; // image_info 에서 main toml name
            var podMainSchemaToml = response[podMainSchemaTomlName]; // pod main toml
            var podImageVersion = response["image_info.toml"]["version"];
            var commonSchemaToml = response["protocol-module-"+podImageVersion+".toml"]; // protocol common toml
            var typesToml = response["types-"+podImageVersion+".toml"];
            var subToml;
            var otherToml;
            if(podMainSchemaTomlName.startsWith("accura2300") || podMainSchemaTomlName.startsWith("accura2500")){
                subToml = response["modbus-"+podImageVersion+".toml"];
                otherToml = response["accura2k-"+podImageVersion+".toml"];
            }else if(podMainSchemaTomlName.startsWith("ntek")){
                subToml = response["modbus-"+podImageVersion+".toml"];
            }else if(podMainSchemaTomlName.startsWith("tcplistener")){
                subToml = response["listener-"+podImageVersion+".toml"];
            }
            makeForm(type, commonSchemaToml, podMainSchemaToml, subToml, typesToml, podMainSchemaTomlName, otherToml);
            settingMapping(type, response.orgTomlFile, response["qList"]);
            var yamlCheckList = response["yamlCheckList"];
            insertForm(type, name, response.orgTomlFile, yamlCheckList);
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
    
    protocol.deleteTomlModal = function(){
        $('#protocolTomlDeleteModal').modal('show');
    }
    
    protocol.deleteToml = function(){
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val()
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/toml/delete";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            $('#protocolTomlDeleteModal').modal('hide');
            $("#protocolBackdropCloseBtn").trigger("click");
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
    
    protocol.deleteModalCall = function(name, type){
        $("#protocolDeleteName").val(name);
        $("#protocolDeleteType").val(type);
        $('#protocolDeleteModal').modal('show');
    }
    
    protocol.protocolSingleDelete = function(){
        var pName = $("#protocolDeleteName").val();
        var pType = $("#protocolDeleteType").val();
        
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val(),
            deleteName : pName,
            deleteType : pType
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/protocol/view/save";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            $('#protocolDeleteModal').modal('hide');
            tableSetting(response.orgTomlFile);
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
    
    protocol.excelDownload = function(type){
        $("#viewCloseBtn_"+type).trigger("click");
        
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val()
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/archive/read";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            var podMainSchemaTomlName = response["image_info.toml"]["schema"].split("/")[1]; // image_info 에서 main toml name
            var podMainSchemaToml = response[podMainSchemaTomlName]; // pod main toml
            var podImageVersion = response["image_info.toml"]["version"];
            var commonSchemaToml = response["protocol-module-"+podImageVersion+".toml"]; // protocol common toml
            var typesToml = response["types-"+podImageVersion+".toml"];
            var subToml;
            var otherToml;
            if(podMainSchemaTomlName.startsWith("accura2300") || podMainSchemaTomlName.startsWith("accura2500")){
                subToml = response["modbus-"+podImageVersion+".toml"];
                otherToml = response["accura2k-"+podImageVersion+".toml"];
            }else if(podMainSchemaTomlName.startsWith("ntek")){
                subToml = response["modbus-"+podImageVersion+".toml"];
            }else if(podMainSchemaTomlName.startsWith("tcplistener")){
                subToml = response["listener-"+podImageVersion+".toml"];
            }
            excelDownload(commonSchemaToml, podMainSchemaToml, subToml, typesToml, podMainSchemaTomlName, otherToml);
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
    
    protocol.excelUpload = function(type){
        $('#file_'+type).click();
    }
    
    protocol.fileUploadAfter = function(type){
        $("#viewCloseBtn_"+type).trigger("click");
        
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val()
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/archive/read";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            var podMainSchemaTomlName = response["image_info.toml"]["schema"].split("/")[1]; // image_info 에서 main toml name
            var podMainSchemaToml = response[podMainSchemaTomlName]; // pod main toml
            var podImageVersion = response["image_info.toml"]["version"];
            var commonSchemaToml = response["protocol-module-"+podImageVersion+".toml"]; // protocol common toml
            var typesToml = response["types-"+podImageVersion+".toml"];
            var subToml;
            var otherToml;
            if(podMainSchemaTomlName.startsWith("accura2300") || podMainSchemaTomlName.startsWith("accura2500")){
                subToml = response["modbus-"+podImageVersion+".toml"];
                otherToml = response["accura2k-"+podImageVersion+".toml"];
            }else if(podMainSchemaTomlName.startsWith("ntek")){
                subToml = response["modbus-"+podImageVersion+".toml"];
            }else if(podMainSchemaTomlName.startsWith("tcplistener")){
                subToml = response["listener-"+podImageVersion+".toml"];
            }
            excelUpload(type,commonSchemaToml, podMainSchemaToml, subToml, typesToml, podMainSchemaTomlName, otherToml);
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
    
    protocol.changeOtherType = function(obj){
        var objName = obj.name;
        if(obj.value == "localpath"){
            $("input[name="+objName.split("-")[0]+"-sub]").val("");
            $("input[name="+objName.split("-")[0]+"-sub]").prop("readonly", true);
        }else{
            $("input[name="+objName.split("-")[0]+"-sub]").prop("readonly", false);
        }
    }
    
    protocol.volumeMountModal = function(){
        var param = {
            nodeAlias : $("#modalNodeAliasprotocol").val(),
            nodeIpAddress : $("#modalNodeIpAddressprotocol").val(),
            pipeName : $("#modalPipeNameprotocol").val(),
            podType: $("#modalPodTypeprotocol").val(),
            podName : $("#modalPodNameprotocol").val(),
            nodeAppName : $("#modalNodeAppNameprotocol").val()
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
    
    protocol.addDeviceTab = function(){
        $("#deviceName").val("");
        $('#deviceSaveModal').modal('show');
    }
    
    protocol.deviceSave = function(){
        addDeviceTab();
    }
    
    protocol.deleteDevice = function(deviceName){
        $("#tabCon_"+deviceName).remove();
        $("#tabLi_"+deviceName).remove();
        if(document.getElementsByClassName('deviceCheck').length > 0){
            document.getElementsByClassName('deviceCheck')[0].click();
        }
    }
    
    return protocol;
}) (window.protocol || {}, $);