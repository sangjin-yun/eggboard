$(document).ready(function () {
    
});

window.onload = function () {
    draw.init();
};

var draw = (function (draw, $) {
    var selectNodeData;
    /**************************************
     * Private 함수
     * ************************************/
    function settingDraw(){
      const $ = go.GraphObject.make;

      myDiagram =
        $(go.Diagram, "drawItemDiv",
          { "undoManager.isEnabled": false, "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom });

    const portSize = new go.Size(8, 8);
    
      myDiagram.nodeTemplate =
        $(go.Node, "Table",
          {
            locationObjectName: "BODY",
            locationSpot: go.Spot.Center,
            selectionObjectName: "BODY",
            doubleClick : function(e, node){
                selectNodeData = node;
                draw.showForm(node.vb);
            }
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

          $(go.Panel, "Auto",
            {
              row: 1, column: 1, name: "BODY",
              stretch: go.GraphObject.Fill
            },
            $(go.Shape, "RoundedRectangle",
              {
                fill: "#FFFFFF", strokeWidth: 5,
                minSize: new go.Size(150, 100)
              }
              ,new go.Binding("stroke", "strokeColor")
              ),
            $(go.TextBlock,
              { margin: 10, textAlign: "center", font: "bold 14px Segoe UI,sans-serif", editable: false}
              , new go.Binding("text", "showName").makeTwoWay()
              , new go.Binding("stroke", "strokeColor"))
          ),

          $(go.Panel, "Vertical",
            new go.Binding("itemArray", "leftArray"),
            {
              row: 1, column: 0,
              itemTemplate:
                $(go.Panel,
                  {
                    _side: "left",
                    fromSpot: go.Spot.Left, toSpot: go.Spot.Left,
                    fromLinkable: true, toLinkable: true, cursor: "pointer"
                  },
                  new go.Binding("portId", "portId"),
                  $(go.Shape, "Rectangle",
                    {
                      stroke: null, strokeWidth: 0,
                      desiredSize: portSize,
                      margin: new go.Margin(1, 0)
                    },
                    new go.Binding("fill", "portColor"))
                )
            }
          ),
          
          $(go.Panel, "Vertical",
            new go.Binding("itemArray", "rightArray"),
            {
              row: 1, column: 2,
              itemTemplate:
                $(go.Panel,
                  {
                    _side: "right",
                    fromSpot: go.Spot.Right, toSpot: go.Spot.Right,
                    fromLinkable: true, toLinkable: true, cursor: "pointer"
                  },
                  new go.Binding("portId", "portId"),
                  $(go.Shape, "Rectangle",
                    {
                      stroke: null, strokeWidth: 0,
                      desiredSize: portSize,
                      margin: new go.Margin(1, 0)
                    },
                    new go.Binding("fill", "portColor"))
                )
            }
          )
      );

      myDiagram.linkTemplate =
        $(CustomLink,
          {
            routing: go.Link.AvoidsNodes,
            corner: 4,
            curve: go.Link.JumpGap,
            reshapable: true,
            resegmentable: true,
            relinkableFrom: true,
            relinkableTo: true
          },
          new go.Binding("points").makeTwoWay(),
          $(go.Shape, { stroke: "#2F4F4F", strokeWidth: 5 })
        );
        
      load();
    }
    
      class CustomLink extends go.Link {
        findSidePortIndexAndCount(node, port) {
          const nodedata = node.data;
          if (nodedata !== null) {
            const portdata = port.data;
            const side = port._side;
            const arr = nodedata[side + "Array"];
            const len = arr.length;
            for (let i = 0; i < len; i++) {
              if (arr[i] === portdata) return [i, len];
            }
          }
          return [-1, len];
        }
    
        computeEndSegmentLength(node, port, spot, from) {
          const esl = super.computeEndSegmentLength(node, port, spot, from);
          const other = this.getOtherPort(port);
          if (port !== null && other !== null) {
            const thispt = port.getDocumentPoint(this.computeSpot(from));
            const otherpt = other.getDocumentPoint(this.computeSpot(!from));
            if (Math.abs(thispt.x - otherpt.x) > 20 || Math.abs(thispt.y - otherpt.y) > 20) {
              const info = this.findSidePortIndexAndCount(node, port);
              const idx = info[0];
              const count = info[1];
              if (port._side == "top" || port._side == "bottom") {
                if (otherpt.x < thispt.x) {
                  return esl + 4 + idx * 8;
                } else {
                  return esl + (count - idx - 1) * 8;
                }
              } else {
                if (otherpt.y < thispt.y) {
                  return esl + 4 + idx * 8;
                } else {
                  return esl + (count - idx - 1) * 8;
                }
              }
            }
          }
          return esl;
        }
    
        hasCurviness() {
          if (isNaN(this.curviness)) return true;
          return super.hasCurviness();
        }
    
        computeCurviness() {
          if (isNaN(this.curviness)) {
            const fromnode = this.fromNode;
            const fromport = this.fromPort;
            const fromspot = this.computeSpot(true);
            const frompt = fromport.getDocumentPoint(fromspot);
            const tonode = this.toNode;
            const toport = this.toPort;
            const tospot = this.computeSpot(false);
            const topt = toport.getDocumentPoint(tospot);
            if (Math.abs(frompt.x - topt.x) > 20 || Math.abs(frompt.y - topt.y) > 20) {
              if ((fromspot.equals(go.Spot.Left) || fromspot.equals(go.Spot.Right)) &&
                (tospot.equals(go.Spot.Left) || tospot.equals(go.Spot.Right))) {
                const fromseglen = this.computeEndSegmentLength(fromnode, fromport, fromspot, true);
                const toseglen = this.computeEndSegmentLength(tonode, toport, tospot, false);
                const c = (fromseglen - toseglen) / 2;
                if (frompt.x + fromseglen >= topt.x - toseglen) {
                  if (frompt.y < topt.y) return c;
                  if (frompt.y > topt.y) return -c;
                }
              } else if ((fromspot.equals(go.Spot.Top) || fromspot.equals(go.Spot.Bottom)) &&
                (tospot.equals(go.Spot.Top) || tospot.equals(go.Spot.Bottom))) {
                const fromseglen = this.computeEndSegmentLength(fromnode, fromport, fromspot, true);
                const toseglen = this.computeEndSegmentLength(tonode, toport, tospot, false);
                const c = (fromseglen - toseglen) / 2;
                if (frompt.x + fromseglen >= topt.x - toseglen) {
                  if (frompt.y < topt.y) return c;
                  if (frompt.y > topt.y) return -c;
                }
              }
            }
          }
          return super.computeCurviness();
        }
      }
    
    function save() {
      document.getElementById("mySavedModel").value = myDiagram.model.toJson();
      myDiagram.isModified = false;
    }
    
    function load() {
      myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    }
    
    function makeProtocol(id,name,val,x,y, podAppName){
        var p = new go.Point(x, y);
        var q = myDiagram.transformViewToDoc(p);
        var protocol = {
            "name":id,
            "showName":podAppName+"\n( "+id+" )",
            "appName" : podAppName,
            "strokeColor" : "#2c7be5",
            "loc": go.Point.stringify(q),
            "type":name,
            "value" : val,
            "rightArray":[ {"portColor":"#66d6d1", "portId":"right0"} ]
        };
        myDiagram.model.addNodeData(protocol);
    }
    function makeProcessor(id,name,val,x,y,podAppName){
        var p = new go.Point(x, y);
        var q = myDiagram.transformViewToDoc(p);
        var processor = {
            "name":id, 
            "showName":podAppName+"\n( "+id+" )",
            "appName" : podAppName,
            "strokeColor" : "#f5803e",
            "loc": go.Point.stringify(q),
            "type":name,
            "value" : val,
            "leftArray":[ {"portColor":"#66d6d1", "portId":"left0"} ],
            "rightArray":[ {"portColor":"#66d6d1", "portId":"right0"} ]
        };
        myDiagram.model.addNodeData(processor);
    }
    function makeSender(id,name,val,x,y,podAppName){
        var p = new go.Point(x, y);
        var q = myDiagram.transformViewToDoc(p);
        var sender = {
            "name":id, 
            "showName":podAppName+"\n( "+id+" )",
            "appName" : podAppName,
            "strokeColor" : "#00d27a",
            "loc": go.Point.stringify(q),
            "type":name,
            "value" : val,
            "leftArray":[ {"portColor":"#66d6d1", "portId":"left0"} ]
        };
        myDiagram.model.addNodeData(sender);
    }
    
    function selectNodeRemove(){
      myDiagram.remove(selectNodeData);
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    
    draw.selectNodeRemove = function(){
        selectNodeRemove();
        draw.saveJson(nodeAlias,nodeIpAddress,pipeName);
    }
    
    draw.makePodDiv = function(id, name, val,x,y, podAppName){
        if(name == "protocol"){
            makeProtocol(id,name, val, x,y, podAppName);
        }else if(name == "processor"){
            makeProcessor(id,name, val,x,y, podAppName);
        }else if(name == "sender"){
            makeSender(id,name, val,x,y, podAppName);
        }
        draw.saveJson(nodeAlias,nodeIpAddress,pipeName);
    };
    
    draw.saveJson = function(nodeAlias, nodeIpAddress, pipelineName){
        save(); 
        
        var param = {
            nodeIpAddress: nodeIpAddress,
            nodeAlias : nodeAlias,
            pipelineName : pipelineName,
            drawData : document.getElementById("mySavedModel").value
        };
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pipe/save";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            if(langType == "ko"){
                toastr["success"]("그리기 영역 저장.");
            }else{
                toastr["success"]("Draw Area Save.");
            }
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("그리기 영역 저장 오류.");
            }else{
                toastr["error"]("draw area save error.");
            }
        };
        ajaxWrapper.callAjax(option);
    };
        
    draw.save = function(){
       save(); 
    };
    
    draw.load = function(){
        load();
    };
    
    draw.showForm = function(nodeInfo){
        draw.saveJson(nodeAlias,nodeIpAddress,pipeName);
        
        var nodeType = nodeInfo.type; // protocol, processor, sender
        var nodeName = nodeInfo.name; // archive folder name
        var nodeKeyAbs = Math.abs(nodeInfo.key); // auto key
        var nodeValue = nodeInfo.value; // schema|imageInfo
        var nodeSchema = nodeValue.split("|")[0];
        var nodeImageInfo = nodeValue.split("|")[1];
        var nodeAppName = nodeInfo.appName;
        
        var param = {
            nodeAlias : nodeAlias,
            nodeIpAddress : nodeIpAddress,
            pipeName : pipeName,
            podType: nodeType,
            podName : nodeName,
            nodeKeyAbs : nodeKeyAbs,
            nodeSchema : nodeSchema,
            nodeImageInfo : nodeImageInfo,
            nodeAppName : nodeAppName
        };
        
        var option = deepExtend({}, ajaxOptions);
        option.URL = "/api/pod/toml/read";
        option.PARAM = JSON.stringify(param);
        option.HEADERS = getCsrfHeader();
        option.TYPE = "POST";
        option.CALLBACK = function (response) {
            //console.log(response);
            var modalTitle = nodeType + " : "+nodeName; /* EX) protocol : pm-eip-2.0 */
            var podSaveTomlName = nodeType+"_"+nodeName+"_"+nodeAppName+".toml"; /* EX) protocol_pm-tcplistener-2.0_pm-tcp.toml  */
            var modalPath = localBasePath+nodeAlias+"_"+nodeIpAddress.replace(":","_")+"/config/"+pipeName+"/"+podSaveTomlName;
            /* C:/nodeList/OnCueLocal_127.0.0.1_9000/config/LocalTest_Pipe/protocol_pm-tcplistener-2.0_1.toml */
            
            /* saved toml check */
            var orgTomlFile = response["orgTomlFile"];
            
            $("#modalNodeAlias"+nodeType).val(nodeAlias);
            $("#modalNodeIpAddress"+nodeType).val(nodeIpAddress);
            $("#modalPipeName"+nodeType).val(pipeName);
            $("#modalPodType"+nodeType).val(nodeType);
            $("#modalPodName"+nodeType).val(nodeName);
            $("#modalNodeAppName"+nodeType).val(nodeAppName);
            
            if(nodeType == "protocol"){
               $("#protocolBackdropLabel").html(modalTitle);
               $("#protocolModalPath").html(modalPath);
               $('#protocolBackdrop').modal('show');
               protocol.openCanvas(orgTomlFile);
            }else if(nodeType == "processor"){
                if(nodeName.startsWith("processing")){
                   $("#processorBackdropLabel").html(modalTitle);
                   $("#processorModalPath").html(modalPath);
                   processor.openCanvas(orgTomlFile);
                }else{
                    $("#modalNodeAliasdataControl").val(nodeAlias);
                    $("#modalNodeIpAddressdataControl").val(nodeIpAddress);
                    $("#modalPipeNamedataControl").val(pipeName);
                    $("#modalPodTypedataControl").val(nodeType);
                    $("#modalPodNamedataControl").val(nodeName);
                    $("#modalNodeAppNamedataControl").val(nodeAppName);
                    $("#dataControlBackdropLabel").html(modalTitle);
                    $("#dataControlModalPath").html(modalPath);
                    dataControl.openCanvas(orgTomlFile);
                }
            }else if(nodeType == "sender"){
               $("#senderBackdropLabel").html(modalTitle);
               $("#senderModalPath").html(modalPath);
               sender.openCanvas(orgTomlFile);
            }
        };
        option.ERROR_CALLBACK = function (response) {
            console.log(response);
            if(langType == "ko"){
                toastr["error"]("파드 toml 읽기 오류.");
            }else{
                toastr["error"]("pod toml read error.");
            }
        };
        ajaxWrapper.callAjax(option);
    };
    
    draw.init = function () {
        settingDraw();
    };
    
    draw.addVolumeMount = function(){
        $("#volumeMountsDiv").append(volumeMountsAddHtml);
    }
    
    return draw;
}) (window.draw || {}, $);