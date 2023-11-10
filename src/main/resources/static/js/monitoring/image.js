$(document).ready(function () {
    
});

window.onload = function () {
      image.init();
      localize();
};

var image = (function (image, $) {
    
    function getImages(){
        $.ajax({
            url: "/api/node/"+nodeId+"/image",        
            success: function (response) {
                var result = response.data.data;
                $("#imageTbody").empty();
                var html ="";
                for (var i=0; i<result.length; i++) {
                    var imageName = result[i].name.split(":")[0];
                    var imageVersion = result[i].name.split(":")[1];
                    html += '<tr>';
                    html += '   <td>'+imageName+'</td>';
                    html += '   <td>'+imageVersion+'</td>';
                    html += '   <td>'+result[i].size.toFixed(2)+'MiB</td>';
                    html += '</tr>';
                }
                $("#imageTbody").append(html);
                settingDatatable();
            }
            ,error : function(result){
                console.log(result);
                if(langType == "ko"){
                    toastr["error"]("서버 연결중 오류가 발생하였습니다.<br/>REST API 1.3를 확인해 주세요.");
                }else{
                    toastr["error"]("An error occurred while connecting to the server.<br/>Please check REST API 1.3");
                }
                callServerCheck();
            }
        });
    }
    
    function callServerCheck(){
        setTimeout(function() {
            if(langType == "ko"){
                toastr["warning"]("재연결 시도중...");
            }else{
                toastr["warning"]("Reconnecting...");
            }
          getImages();
        }, 1000);
    }
    
    function settingDatatable(){
        if(langType == "ko"){
            $("#imageTable").DataTable({
                order: [ [ 0, "asc" ] ],
                "columnDefs": [
                    { "orderable": true, "targets": [1,2] },
                    { "orderable": true, "width": "50%", "targets": [0] }
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "검색 : "
                 },
                 language : lang_ko
            }); 
        }else{
            $("#imageTable").DataTable({
                order: [ [ 0, "asc" ] ],
                "columnDefs": [
                    { "orderable": true, "targets": [1,2] },
                    { "orderable": true, "width": "50%", "targets": [0] }
                ],
                autoWidth: false,
                "oLanguage": {
                   "sSearch": "Search : "
                 },
                 language : lang_en
            }); 
        }
    }
    
    /**************************************
     * Public 함수
     * ************************************/
    image.init = function () {
        getImages();
    }
    
    return image;
}) (window.image || {}, $);