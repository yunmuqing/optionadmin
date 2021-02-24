
(function(ymqJq){
    require(['plupload'],function(plupload){
        ymqJq.fn.extend({
            ymqUpload: function(config = {}){
                //默认值
                var defaultConfig = {
                    filesSize:100,
                    url:'https://option.ymq.cool/api/oss/uploadimage',
                    multi_selection:true,
                    filters : {
                        max_file_size : '5mb', //最大只能上传400kb的文件
                        //prevent_duplicates : true, //不允许选取重复文件
                        mime_types: [
                            {title : "Image files", extensions : "jpg,gif,png"},
                            {title : "Zip files", extensions : "zip"}
                        ]
                    }
                };
                //使用配置值覆盖默认配置
                for(var key in defaultConfig){
                    if (key == 'filters') {
                        if (config.hasOwnProperty(key)) {
                            for(var ke in defaultConfig[key]){
                                if (config[key].hasOwnProperty(ke)) {
                                    defaultConfig[key][ke] = config[key][ke];
                                }
                            }
                        }
                    }else{
                        if (config.hasOwnProperty(key)) {
                            defaultConfig[key] = config[key]
                        }
                    }

                }
                var that = ymqJq(this);
                var ymq_upload_box = that.next().next('.ymq_upload_box');
                var that_text = that.html();
                //filesAddLength和add_file2个值都是算总的上传进度的
                var filesAddLength = 1;
                var add_file = [];
                var file_arr = [];
                //上次文件个数，用来限制文件上传个数限制
                var filesAddNum = 0;
                //var chushiProgress = 0;
                uploade = new plupload.Uploader({
                    runtimes : 'html5,flash,silverlight,html4',
                    flash_swf_url : 'Moxie.swf',
                    silverlight_xap_url : 'Moxie.xap',
                    browse_button : that.attr('id'),
                    url : defaultConfig.url,
                    multi_selection : defaultConfig.multi_selection,
                    filters : defaultConfig.filters,
                    init: {
                        PostInit: function() {
                        },
                        BeforeUpload: function (uder, files) {
                            that.addClass('disabled');
                            if (filesAddNum >= defaultConfig.filesSize) {
                                return false;
                            }
                        },
                        FilesAdded: function(up, files) {
                            filesAddlength = files.length;
                            for(var i = 0, len = files.length; i<len; i++){
                                add_file.push(files[i].id);
                                addFile(files[i]);
                            }
                            //that.html(that_text+' '+chushiProgress+'%');
                            up.start()
                        },
                        FileUploaded: function (uder, file, data) {
                            filesAddNum++;
                            fileUploaded(uder, file, data)
                        },
                        UploadProgress: function(up, file) {
                            var progress = 0;
                            for(var i = 0, len = up.files.length; i<len; i++){
                                if (add_file.includes(up.files[i].id)) {
                                    progress += up.files[i].percent/filesAddlength;
                                }
                            }
                            //if (progress < 100) {
                            ymq_upload_box.children('.ymq_upload_item_'+file['id']).children('.ymq_upload_process').children('span').css('width',file.percent+'%');
                            //}
                            // if (progress < 100) {
                            //   for (var i = 0; i <= progress-chushiProgress; i++) {
                            //     that.html(that_text+' '+Number(Number(progress)+Number(i))+'%')
                            //   }
                            //   chushiProgress = progress;
                            // }
                            that.html(that_text+' '+Math.round(progress)+'%')
                        },
                        UploadComplete: function (uder, files) {
                            add_file = [];
                            that.html(that_text)
                            that.removeClass('disabled');
                        },
                        Error: function(up, err) {
                            console.log(err)
                            ymq_upload_box.children('.ymq_upload_item_'+err['file']['id']).children('.ymq_upload_process').css('opacity','0');
                            ymq_upload_box.children('.ymq_upload_item_'+err['file']['id']).children('.ymq_upload_status').addClass('ymq_upload_error');
                            add_file = [];
                            console.log(err)
                            // for(var key in up.files){
                            //   if (up.files[key]['id'] == err.file['id']) {
                            //     delete up.files[key];
                            //   }
                            // }
                        }
                    }
                });

                uploade.init();

                function addFile(file){
                    var ymq_upload_type = 'ymq_upload_pdf';
                    var html = `
                    <div class="ymq_upload_item ymq_upload_item_${file['id']}">
                        <div class="ymq_upload_type ${ymq_upload_type}"></div>
                        <div class="ymq_upload_name">${file['name']}</div>
                        <div class="ymq_upload_status" data-img=""></div>
                        <div class="ymq_upload_process"><span></span></div>
                        <div class="ymq_clear_both"></div>
                    </div>
                `;
                    ymq_upload_box.append(html);
                }
                function fileUploaded(uder, file, data){
                    var result = JSON.parse(data.response);
                    file_arr.push(result.data.relative_path);
                    ymq_upload_box.children('.ymq_upload_item_'+file['id']).children('.ymq_upload_process').css('opacity','0');

                    that.next().val(file_arr.join(","));
                    console.log(that.next().val())
                    ymq_upload_box.children('.ymq_upload_item_'+file['id']).children('.ymq_upload_status').addClass('ymq_upload_success');
                    ymq_upload_box.children('.ymq_upload_item_'+file['id']).children('.ymq_upload_status').data('img',result.data.relative_path);
                    console.log(ymq_upload_box.children('.ymq_upload_item_'+file['id']).children('.ymq_upload_status').data('img'))
                }
                ymqJq(document).on('click', '.ymq_upload_success', function () {
                    console.log(ymqJq(this).data('img'))
                    ymqJq(this).parent().remove();
                    file_arr = ymq_removeArr(file_arr,ymqJq(this).data('img'))
                    file_arr = []
                    console.log(file_arr)
                });
                function previewImage(file,callback){
                    //file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
                    if(!file || !/image\//.test(file.type)) return; //确保文件是图片
                    if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                        var fr = new mOxie.FileReader();
                        fr.onload = function(){
                            callback(fr.result);
                            fr.destroy();
                            fr = null;
                        }
                        fr.readAsDataURL(file.getSource());
                    }else{
                        var preloader = new mOxie.Image();
                        preloader.onload = function() {
                            preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
                            var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                            callback && callback(imgsrc); //callback传入的参数为预览图片的url
                            preloader.destroy();
                            preloader = null;
                        };
                        preloader.load( file.getSource() );
                    }
                }
            
            }
        })
    });
})(ymqJq);

//上传封装开始
// (function(){
//     ymqJq.fn.extend({
//         ymqUpload:function(config = {}){
                
//         }
//     });
// })(ymqJq);
//上传封装结束