/**
 * Created by xiongze on 2014-12-25.
 */
define(function (require) {
    var util = {};
    var init = require("config2014/init");
    var $ = require("jquery");
    function getAjaxData(module,api,my_data,succ){
        //if(("sessionStorage" in window)&&window["sessionStorage"]!=null){
        //    loginInfo = $.parseJSON(sessionStorage.getItem(projectModule+"loginInfo"));
        //}else{
        //}
        //if(!loginInfo){
        //    window.location.href="login.html";
        //}
        var def_data = {
            timestamp: new Date().getTime(),
            apiver: '1.0',
            appcode:"sht",
            module: module,
            token: (($.parseJSON(sessionStorage.getItem(init.head+"loginInfo")||"{}")||{}).token)||""
        };
        $.extend(def_data,my_data);
        var url = init.headUrl+"/v1/"+module+"/"+api+ "?params=" + encodeURIComponent(JSON.stringify(def_data));
        $.support.cors = true;
        $.ajax({
            url:url,
            crossDomain:true,
            type:'get',
            contentType:"text/plain",
            async:false,
            jsonp:'jsonCallback',
            dataType:'jsonp',
            //	data:{"params":def_data},
            success:function(data){
                if(typeof succ=="function"){
                    succ(data);
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
                setTimeout(function(){
                },0);
            }
        });
    }
    function formTojson(selector){          // form元素转json
        var formarry = $(selector).serializeArray();
        var formjson = {};
        formarry.forEach(function(v,i){
            formjson[v.name] = v.value;
        });
        $(selector).find("select").each(function(i,v){
            var name = $(this).attr("name");
            formjson[name] = $(this).val();
        });
        return formjson;
    }
    function jsonToform(selector,json){          // json填充form
        var formarry = $(selector).serializeArray();
        var formjson = {};
        json = json||{};
        formarry.forEach(function(v,i){
            var $ff = $(selector).find('[name='+[v.name]+']');
            $ff.val(json[v.name]||"");
            if($ff.is("select")){
                $ff.val(json[v.name]||"未填");
            }
        });
        $(selector).find(".am-form-error").removeClass("am-form-error");
    }
    function verfy(formname){
        $(formname).find(".am-form-field").bind("blur",function(){
            if(!$(this).val()){
                $(this).data("msg",$(this).attr("placeholder")+"不能为空");
                $(this).closest(".am-form-group").addClass("am-form-error");
            }else{
                $(this).removeData("msg");
                $(this).closest(".am-form-group").removeClass("am-form-error");
            }
        });

    //.each(function(i,v){$(this).popover({
    //        content: $(this).attr("placeholder")+'不能为空'
    //    })})
    }
    function xzfile(option){

        var options={
            target:null,				//html file控件
            url:null,         //上传地址
            imgPos:null,
            imgLength:null,
            autoup:true,  //自动上传
            dragDrop: null,					//拖拽敏感区域
            upButton: null,					//提交按钮
            url: "",						//ajax地址
            fileFilter: [],					//过滤后的文件数组
            filter: function(files) {		//选择文件组的过滤方法
                return files;
            },
            onSelect: function() {},		//文件选择后
            onDelete: function() {},		//文件删除后
            onDragOver: function() {},		//文件拖拽到敏感区域时
            onDragLeave: function() {},	//文件离开到敏感区域时
            onProgress: function() {},		//文件上传进度
            onSuccess: function() {},		//文件上传成功时
            onFailure: function() {},		//文件上传失败时,
            onComplete: function() {}  	//文件全部上传完毕时
        }
        options=$.extend(options,option);
        var $this=$(options.target);
        /* 开发参数和内置方法分界线 */
        function onSelect(files) {
            var html = '', i = 0;
            //等待载入gif动画
            //	    options.imgPos.html('<div class="upload_loading"></div>');
            var funAppendImage = function() {
                file = files[i];
                if (file) {
                    var reader = new FileReader()
                    reader.onload = function(e) {
                        html = html + '<div id="'+options.imgPos.selector.match(/[^#\.]+/)+'List_'+ i +'" class="upload_append_list"><p>'+
                        '<img id="uploadImage_' + i + '" src="' + e.target.result + '" class="upload_image" />'+
                        '<a href="javascript:" class="upload_delete" title="删除" data-index="'+ i +'" style="display:none;">删除</a></p>' +
                        '<span id="uploadProgress_' + i + '" class="upload_progress"></span>' +
                        '</div>';

                        i++;
                        funAppendImage();
                    }
                    reader.readAsDataURL(file);
                } else {
                    //图片相关HTML片段载入
                    options.imgPos.append(html);
                    if (html) {
                        //删除方法
                        //$(".upload_delete").click(function() {
                        //    funDeleteFile.call($this,files[parseInt($(this).attr("data-index"))]);
                        //    return false;
                        //});
                        $("upload_image").hover(
                            function(){
                                $(this).next().fadeIn("slow");
                            },function(){
                                $(this).next().fadeOut("slow");
                            }
                        );
                        //提交按钮显示
//			                $("#fileSubmit").show();
                    } else {
                        //提交按钮隐藏
//			                $("#fileSubmit").hide();
                    }
                }
            };
            //执行图片HTML片段的载人
            funAppendImage();
            if(options.autoup){
                funUploadFile.call($this);
            }
        }
        function filter(files) {
            var arrFiles = [];
            for (var i = 0, file; file = files[i]; i++) {
                if (file.type.indexOf("image") == 0) {
                    if (file.size >= 2048000) {
                        alert('您这张"'+ file.name +'"图片大小过大，应小于2M');
                    } else {
                        arrFiles.push(file);
                    }
                } else {
                    alert('文件"' + file.name + '"不是图片。');
                }
            }
            return arrFiles;
        }
        function onDelete(file) {
            $(options.imgPos.selector+"List_" + file.index).fadeOut(function(){
                $(options.imgPos.selector+"List_" + file.index).remove();
            });
        }
        //文件拖放
        function funDragHover(e) {
            e.stopPropagation();
            e.preventDefault();
            options[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
//				return this;
        }
        //获取选择文件，file控件或拖放
        function funGetFiles(e) {
            // 取消鼠标经过样式
            funDragHover.call($this,e);

            // 获取文件列表对象
            var files = e.target.files || e.dataTransfer.files;
            //继续添加文件
            options.fileFilter = options.fileFilter.concat(filter.call($this,files));
            funDealFiles.call($this);
//				return this;
        }

        //选中文件的处理与回调
        function funDealFiles() {
            for (var i = 0, file; file = options.fileFilter[i]; i++) {
                //增加唯一索引值
                file.index = i;
            }
            //执行选择回调
            if(options.imgLength&&options.imgPos.children().length>=options.imgLength){
                alert("此类图最多只有"+options.imgLength+"张");
            }else{
                onSelect.call($this,options.fileFilter);
            }
            return this;
        }

        //删除对应的文件
        function funDeleteFile(fileDelete) {
            var arrFile = [];
            for (var i = 0, file; file = options.fileFilter[i]; i++) {
                if (file != fileDelete) {
                    arrFile.push(file);
                } else {
                    onDelete.call($this,fileDelete);
                }
            }
            options.fileFilter = arrFile;
            return this;
        }

        //文件上传
        function funUploadFile() {
//				var self = this;
            if (location.host.indexOf("sitepointstatic") >= 0) {
                //非站点服务器上运行
                return;
            }
            for (var i = 0, file; file = options.fileFilter[i]; i++) {
                (function(file) {
                    var xhr = new XMLHttpRequest();
                    if (xhr.upload) {
                        // 上传中
                        xhr.upload.addEventListener("progress", function(e) {
                            options.onProgress(file, e.loaded, e.total);
                        }, false);

                        // 文件上传成功或是失败
                        xhr.onreadystatechange = function(e) {
                            if (xhr.readyState == 4) {
                                if (xhr.status == 200) {
                                    funDeleteFile.call($this,file);
                                    var response;
                                    try{
                                        response = JSON.parse(xhr.response)
                                    }catch(e){
                                        response = "error";
                                    }
                                    options.onSuccess(file, response);
                                    if (!options.fileFilter.length) {
                                        //全部完毕
                                        options.onComplete();
                                    }
                                } else {
                                    alert("上传失败");
                                    funDeleteFile.call($this,file);
                                    options.onFailure(file, xhr.response);
                                }
                                return false;
                            }
                        };

                        // 开始上传
                        xhr.open("POST", options.url, true);
                        var fl=new FormData();
                        fl.append("file",file);
                        xhr.send(fl);
                    }
                })(file);
            }

        }
        function init() {
//				var self = this;

            if (options.dragDrop) {
                options.dragDrop.addEventListener("dragover", function(e) { funDragHover.call($this,e); }, false);
                options.dragDrop.addEventListener("dragleave", function(e) { funDragHover.call($this,e); }, false);
                options.dragDrop.addEventListener("drop", function(e) { self.funGetFiles.call($this,e); }, false);
            }

            //文件选择控件选择
            if ($this.length!=0) {
                $this[0].addEventListener("change", function(e) { funGetFiles.call($this,e);}, false);
            }

            //上传按钮提交
            if (options.upButton) {
                options.upButton.addEventListener("click", function(e) { funUploadFile.call($this,e); }, false);
            }
        }
        init.call($this);
    }
    function imgHtml(response){
        var html = '<div class="upload_append_list" style="position: relative;margin-top:10px;"><p>'+ '<input type="hidden" name="icon" value="'+response.url+'">'+
        '<img src="' + response.url + '" class="upload_image" /><a href="javascript:" class="success_delete" title="删除" style="display: block; position: absolute; bottom: 0px;text-align:center;color:red;background-color:rgba(0,0,0,0.5);width:100%;">删除</a></p>'+ '</div>';
        return html;
    }
//    $.fn.extend({
//        visible:function(b) {
//            if(b){
//                $(this).css("visibility","visible");
//            }else{
//                $(this).css("visibility","hidden");
//            }
//        },
//        warnTips:function(val,type){                                           // 表单检证  val为提示信息    type=email为邮箱检证type=mobile为手机号检证
//            var emailfilter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//            var mobilefilter = /^1[3|4|5|8][0-9]\d{4,8}$/;
//            $(this).tooltip({
//                position: 'right',
//                content: $('<div></div>'),
//                showEvent: '',
//                onUpdate:function(content){
//                    if(!$(this).val().trim()==""&&type=="email"){
//                        content.html("邮箱格式不对");
//                    }else if(!$(this).val().trim()==""&&type=="mobile"){
//                        content.html("手机号格式不对");
//                    }else{
//                        content.html(val);
//                    }
//                },
//                onShow: function(e){
//                    var $this = $(this);
//                    $this.tooltip('tip').css({
//                        borderColor: '#ff0000',
//                        color:'red'
//                    });
//
//                }
//            }).blur(function(){
//                var $this = $(this);
//                if($this.val().trim()==""||(type=="email"&&!emailfilter.test($this.val().trim()))
//                    ||(type=="mobile"&&!mobilefilter.test($this.val().trim()))){
//                    $this.tooltip('update');
//                    $this.css({
//                        borderColor: '#FF6D4F',
//                        backgroundColor:'#FFE9E3'
//                    });
//                    $this.unbind('mouseleave').unbind('mouseenter').bind('mouseleave',function(){
//                        $this.tooltip('hide');
//                    });
//                    $this.bind('mouseenter',function(){
//                        $this.tooltip('show');
//                    });
//
//                    $this.data("canSave",false);
//                }else{
//                    $this.unbind('mouseenter').css({
//                        borderColor: '',
//                        backgroundColor:''
//                    });
//                    $this.data("canSave",true);
//                    $this.tooltip('hide');
//                }
//            });
//        },
//        clearWarn:function(){                                 // 清楚表单验证样式
//            $(this).unbind('mouseenter').css({
//                borderColor: '',
//                backgroundColor:''
//            });
//            $(this).data("canSave",true);
//            $(this).tooltip('hide');
//        },
//        isNum:function(){
//            $(this).keyup(function(){
//                $(this).val($(this).val().replace(/\D/gi, ""));
//            });
//        },
//        isMail:function(){
//
//        },
//        placeholder:function(b){
//            $(this).each(function(){
//                if($(this).attr("placeholder")){
//                    var oldVal=$(this).attr("placeholder");
//                    if(b){
//                        $(this).after('<span style="margin-right: 10px; margin-left: -20px; cursor: pointer;float:left;line-height:32px;display:none;" onclick="$(this).hide().prev().data(\'value\',\'\').val($(this).prev().attr(\'placeholder\')).css({\'color\':\'#ccc\'});">X</span>');
//                    }
//                    if(!$(this).val()){
//                        $(this).val(oldVal).css({"color":"#ccc"});
//                    }else{
//                        if(b){
//                            $(this).next().show();
//                        }
//                    }
//                    $(this).focus(function(){
//                        if($(this).val()!=oldVal){$(this).css({"color":"#333"});}else{$(this).val("").css({"color":"#ccc"});}
//                    }).blur(function(){
//                        if($(this).val()==""){$(this).val(oldVal).css({"color":"#ccc"});}
//                    })
//                        .keyup(function(){
//                            $(this).css({"color":"#333"});
//                            if(b){
//                                if(!$(this).val()){
//                                    $(this).next().hide();
//                                }else{
//                                    $(this).next().show();
//                                }
//                            }
//                            $(this).data("value",$(this).val());
//                        });
////    			   .unbind("input propertychange").bind("input propertychange",function(){
////    				   if($(this).val()){
////    					   $(this).css({"color":"#333"});
////    				   }
////    				   $(this).data("value",$(this).val());
////    			   });
//                }
//            });
//        },
//        getValue:function(){
//            return $(this).data("value");
//        }
//    });
    function numformat(value,row,index){
        if(/^\d+.?[\d]{0,2}$/g.test(value)){
            return parseFloat(value).toLocaleString();
        }else{
            return value;
        }
    }
    function priceformat(value,row,index){
        if(/^\d+.?[\d]{0,2}$/g.test(value)&&value!=0){
            return parseFloat(value).toLocaleString();
        }else{
            return "面议";
        }
    }
    function action(a,b,c,f){
        $("#rdr-modal-loading").modal({
            relatedElement: this,
            cancelable:false
        });
        getAjaxData(a, b, {data:c}, function(data){
            if(!data.rsflag){
                alert(data.message);
                setTimeout(function(){
                    $("#rdr-modal-loading").modal("close");
                },500);
            }else{
                setTimeout(function(){
                    $("#rdr-modal-loading").modal("close");
                    alert("成功");
                    window.location.reload();
                    //$("#rdr-alert").modal({
                    //    //relatedElement: this,
                    //    onConfirm: function() {
                    //        window.location.reload();
                    //    },
                    //    cancelable:false
                    //});
                },500);
            }
        });
    }
    util.verfy = verfy;
    util.formTojson = formTojson;
    util.jsonToform = jsonToform;
    util.getAjaxData = getAjaxData;
    util.action = action;
    util.xzfile = xzfile;
    util.imgHtml = imgHtml;
    return util;
});