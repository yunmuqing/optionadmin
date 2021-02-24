var upload_img_arr = new Array();
var upload_video_arr = new Array();
$(document).ready(function() {
    var form_data = $('#defaultForm').serialize();
    $("input,select").on('change', function() {
        if (form_data != $('#defaultForm').serialize()) {
            $('.save,.creat').removeClass('disabled');
        }else{
            $('.save,.creat').addClass('disabled');
        }
    });
    $('a').on('click',function () {
        var href = $(this).attr('href');

        if (form_data != $('#defaultForm').serialize()){
            $(this).fireModal({
                title: 'You have unsaved changes on this page',
                body: 'If you leave this page, all unsaved changes will be lost. Are you sure you want to leave this page?',
                center: true,
                initShow: true,
                removeOnDismiss: true,
                buttons: [
                    {
                        text: 'Cancel',
                        class: 'btn btn-secondary btn-shadow',
                        handler: function(modal) {
                            modal.modal('hide');
                        }
                    },
                    {
                        text: 'Leave page',
                        class: 'btn btn-danger btn-shadow',
                        handler: function(modal) {
                            window.location.href=href;
                        }
                    }
                ]
            });
            return false;
        }
        // window.location.href=href;
    });
    
    $(document).on('click','.diyControl span',function(){
        $('.save').attr('disabled',false);
    })
    var imgUpload = $('#imagesUpload').diyUpload({
        server:'https://ymq-shopify.oss-us-east-1.aliyuncs.com',
        fileNumLimit:5,
        getTokenUrl:'/api/ossapi/gettoken',
        getTokenUrlData:{size:5*1024*1024},
        fileSizeLimit:5*5*1024*1024,
        fileSingleSizeLimit:5*1024*1024,
        type:'image',
        viewbox: 'viewImg',
        data_arr: 'upload_img_arr',
        input:'reviews-images',
        success:function(data,$fileBox) {
            if (upload_img_arr.length !== 0) {
                $('.viewImg').each(function(i){
                    $(this).attr("data-src",upload_img_arr[i]);
                });
                $('.upload_img_arr .spotlight').each(function(i){
                    $(this).attr("data-src",upload_img_arr[i]);
                    $(this).css({
                      backgroundImage: 'url("'+ upload_img_arr[i] +'?x-oss-process=image/resize,w_120/quality,q_80")'
                    });
                });
                
                var reviewPhotoText = upload_img_arr.join(',');
                $('.reviews-images').val(reviewPhotoText);
                console.log($('.reviews-images').val())
            }
            $('.save').attr('disabled',false);
        },
        error:function( err ) { },
        buttonText : '',
        accept: {
            title: "Images",
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        thumb:{
            width:5000,
            height:10000,
            quality:100,
            allowMagnify:true,
            crop:true,
            type:"image/jpeg"
        }
    });

    var videoUpload = $('#videosUpload').diyUpload({
        server:'https://ymq-shopify.oss-us-east-1.aliyuncs.com',
        getTokenUrl:'/api/ossapi/gettoken',
        getTokenUrlData:{size:200*1024*1024},
        fileSizeLimit:1*200*1024*1024,
        fileSingleSizeLimit:200*1024*1024,
        fileNumLimit:1,
        type:'video',
        chunked:false,
        viewbox: 'viewvideo',
        data_arr: 'upload_video_arr',
        input:'reviews-videos',
        success:function(data,$fileBox) {
            if (upload_video_arr.length !== 0) {
                $('.viewvideo').each(function(i){
                    $(this).addClass('video_bg');
                    $(this).attr("data-src",upload_video_arr[i]);
                });
                var reviewPhotoText = upload_video_arr.join(',');
                $('.reviews-videos').val(reviewPhotoText);
                console.log($('.reviews-videos').val())
            }
            $('.save').attr('disabled',false);
        },
        error:function( err ) { },
        buttonText : '',
        accept: {
            title: "Images",
            extensions: 'mp4',
            mimeTypes: 'video/*'
        },
        thumb:{
            width:5000,
            height:10000,
            quality:100,
            allowMagnify:true,
            crop:true,
            type:"video/*"
        }
    });
    $(document).on('click', '.video_bg', function () {
        var video_src = $(this).data('src')
        var video_id = 'video'+$(this).data('id')
        $(this).fireModal({
            title: '',
            removeOnDismiss: true,
            body: `
                <video src="${video_src}" controls="controls" style="width:100%;" preload="metadata" id="${video_id}"></video>
            `,
            center: true,
            initShow: true
        });
        var is_has_video = true;
        while (is_has_video)
        {
            if ($('#'+video_id).length > 0 ) {
                launchFullscreen($('#'+video_id)[0])
                is_has_video = false;
            }
        }
    })
    function launchFullscreen(element) 
    {
    //此方法不可以在異步任務中執行，否則火狐無法全屏
     if(element.requestFullscreen) {
       element.requestFullscreen();
     } else if(element.mozRequestFullScreen) {
       element.mozRequestFullScreen();
     } else if(element.msRequestFullscreen){ 
       element.msRequestFullscreen();  
     } else if(element.oRequestFullscreen){
        element.oRequestFullscreen();
    }
    else if(element.webkitRequestFullscreen)
     {
       element.webkitRequestFullScreen();
     }else{
     
        var docHtml  = document.documentElement;
        var docBody  = document.body;
        var videobox  = document.getElementById('videobox');
        var  cssText = 'width:100%;height:100%;overflow:hidden;';
        docHtml.style.cssText = cssText;
        docBody.style.cssText = cssText;
        videobox.style.cssText = cssText+';'+'margin:0px;padding:0px;';
        document.IsFullScreen = true;
 
      }
    }
    $('#defaultForm').bootstrapValidator({
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: 'Must not be empty'
                    },
                    stringLength : {
                        min : 0,
                        max : 20,
                        message : 'No more than 20 characters'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Must be a valid email'
                    },
                    email: {
                        message: 'Must be a valid email'
                    }
                }
            },
            review_title: {
                validators: {
                    notEmpty: {
                        message: 'Must not be empty'
                    },
                    stringLength : {
                        min : 0,
                        max : 50,
                        message : 'No more than 50 characters'
                    }
                }
            },
            review: {
                validators: {
                    notEmpty: {
                        message: 'Must not be empty'
                    },
                    stringLength : {
                        min : 0,
                        max : 1000,
                        message : 'No more than 1000 characters'
                    }
                }
            }
        }
    }).on("success.form.bv",function(e){
        $('.save,.creat').addClass('disabled btn-progress');
        $.ajax({
            //请求方式
            type : "POST",
            dataType: "json",
            //请求地址
            url : "/api/reviews/save",
            //数据，json字符串
            data : $('#defaultForm').serialize(),
            //请求成功
            success : function(result) {
                if (result.code == 1) {
                    window.location.href='/index/reviews/index.html';
                }else if(result.code == 0){
                    iziToast.error({
                        message: result.msg,
                        position: 'bottomCenter'
                    });
                }
                $('.save').removeClass('btn-progress');
                $('.save').attr('disabled',true);
                form_data = $('#defaultForm').serialize();
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                $('.save').removeClass('btn-progress');
                $('.save').attr('disabled',true);
                form_data = $('#defaultForm').serialize();
            }
        });
        return false;
    });
    var reviews_product_id = null;
    $(".ajax-modal").each(function () {
        var that = $(this);
        var type = that.attr('data-type');
        $(this).ajaxModal({
            center: true,
            title: that.attr('data-title'),
            headerhtml: '<ul class="list-group list-group-flush border-top">\n' +
                '    <li class="list-group-item">\n' +
                '        <div class="form-group margin-bottom-0">\n' +
                '            <div class="input-group">\n' +
                '                <div class="input-group-prepend">\n' +
                '                    <div class="input-group-text">\n' +
                '                        <i class="fas fa-search"></i>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '                <input type="text" class="form-control currency search-input" placeholder="'+that.attr('data-placeholder')+'">\n' +
                '            </div>\n' +
                '        </div>\n' +
                '    </li>\n' +
                '</ul>',
            body: '<img class="load" src="/svg/load-blue-44.svg">',
            url: that.attr('data-url'),
            ajaxSuccess: function(res,modal){

                showHtml(res,modal,that);
                modal.on('hidden.bs.modal', function() {
                    modal.find(".search-input").val('');
                });

            },
            buttons: [
                {
                    text: 'Cancel',
                    class: 'btn btn-secondary btn-shadow',
                    handler: function(modal) {
                        reviews_product_id = null;
                        modal.modal('hide');
                    }
                },
                {
                    text: 'Add',
                    class: 'btn btn-primary btn-shadow disabled',
                    handler: function(modal) {
                        if (reviews_product_id){
                            modal.find('.btn-primary').removeClass('disabled');
                        }else{
                            modal.find('.btn-primary').addClass('disabled');
                        }
                        if (!$(this).hasClass('disabled')){
                            contentShow();
                            $(`input[name='product_id']`).val(reviews_product_id['id']);
                            modal.modal('hide');
                        }
                    }
                }
            ],
            appended: function (dom, modal_form, options) {
                var timeout;
                dom.find(".search-input").on('input', function () {
                    clearTimeout(timeout);
                    var input = $(this);
                    timeout = setTimeout(function() {
                        dom.find('.modal-body').html(options.body);
                        $.ymqajax({
                            url: options.url,
                            success: function (res) {
                                showHtml(res,dom,that);
                            },
                            data:{title:input.val()},
                            ymqtype: 'modal',
                            dom: dom.find('.modal-body'),
                        });
                    }, 1000);
                });


            }
        });

    });
    $(document).on('click', ".shopify-checkbox",function(){
        var name = $(this).attr('name');
        $.each($(`input[name='${name}']`),function(){
            $(this).prop("checked",false);
        });
        $(this).prop("checked",true);
        reviews_product_id = {};
        reviews_product_id['id'] = $(this).val();
        reviews_product_id['image'] = $(this).attr('data-image');
        reviews_product_id['title'] = $(this).attr('data-title');
        console.log(reviews_product_id);


    });
    function showHtml(res,modal,that) {
        var pushHtml = '<ul class="list-group list-group-flush content-ul y-scroll">';
        var data = Object.values(res.data);
        var id = -1;
        console.log(res,data);
        if (reviews_product_id){
            id = reviews_product_id['id'];
        }
        data.forEach(function (item) {

            pushHtml += `
                        <li class="list-group-item">
                            <div class="custom-control custom-checkbox">
                              <input type="checkbox" ${id == item['id'] ? 'checked' : '' } name="product" value="${item['id']}" class="custom-control-input shopify-checkbox" id="product-${item['id']}" data-image="${item['image']}" data-title="${item['title']}" data-sid="${item['sid']}" >
                               <label class="custom-control-label flex-start" for="product-${item['id']}">
                                  <div class="media space-between">
                                        <div class="mr-4 i-box">
                                            <img width="40" src="${item['image']}">
                                        </div>
                                        <div class="media-body">
                                            <div class="inline-block">
                                                <p class="mt-0 mb-0 text-dark-1 line-h-1">${item['title']}</p>
                                            </div>
                                        </div>
                                    </div>
                               </label>
                            </div>
                        `;

            pushHtml += '</li>';
        })

        pushHtml += '</ul>';
        modal.find('.modal-body').html(pushHtml);
        // modal.find('.content-ul').niceScroll();


    }
    function contentShow(){
        var dom = $('.specific_products ').find('.content-show');
        var html = '';
        html += '<li class="list-group-item no-padding-left no-padding-right" data-id="'+reviews_product_id['id']+'">\n' +
            '                                <div class="custom-control custom-checkbox no-padding-left">\n' +
            '                                    <div class="media space-between">\n' +
            '                                        <div class="mr-4 i-box">\n' +
            '                                            <img width="40" src="'+reviews_product_id['image']+'">\n' +
            '                                        </div>\n' +
            '                                        <div class="media-body space-between">\n' +
            '                                            <p class="mt-0 mb-0 text-dark-1 line-h-1">'+reviews_product_id['title']+'</p>\n' +
            '                                            <div class="space-between">' +

            '                                   <button type="button" class="close big-close" data-dismiss="modal" aria-label="Close">\n' +
            '                                                    <span aria-hidden="true">×</span>\n' +
            '                                               </button>\n' +
            '                                            </div>' +
            '                                        </div>\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                            </li>';
        dom.html(html);
    }
    $(document).on('click', ".content-show .close",function(){
        $('.content-show').html('');
        reviews_product_id = null;
        $(`input[name='product_id']`).val('');

    })

});