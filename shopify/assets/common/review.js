var upload_img_arr = new Array();
var upload_video_arr = new Array();
$(document).ready(function () {
    var rating = 'all';
    var withs = 'withs';
    var product_id = shop_data.extension.product_id;
    var page = 1;
    var review_issHas = true;
    var rating = 'all';
    var withs = 'all';
    var review_can_scroll = false;
    $(".top-goback").click(function(){
        review_can_scroll = false;
        $('.write_review').hide()
    })
    
    var now_review_p_id = 0;
    $(document).on("click", ".view-product-btn", function(e) {
        var that = $(this);
        if (that.data('product_id') != now_review_p_id) {
            now_review_p_id = that.data('product_id');
            that.addClass('btn-progress-cc');
            $.ymqajax({
                url : '/api/reviewsindex/getproductbyid.html?id='+that.data('product_id'),
                ymqtype: 'modal',
                iziToastType: 'success',
                data:'',
                success : function(res) {
                    console.log(res)
                    $('.cart-review-product-box .review_product_img').attr('src',res.data[that.data('product_id')].image);
                    $('.cart-review-product-box .title').text(res.data[that.data('product_id')].title)
                    $('.cart-review-product-box .low_price').text(res.data[that.data('product_id')].minVariantPrice)
                    $('.cart-review-product-box .hight_price').text(res.data[that.data('product_id')].maxVariantPrice)
                    $('.cart-review-product-box .review_product_link').attr('href',res.data[that.data('product_id')].url);
                    $('.cart-review-product-box .rating_text').text(res.data[that.data('product_id')].rating.toFixed(2))
                    $('.cart-review-product-box .rating_svg').html(get_review_star(Math.round(res.data[that.data('product_id')].rating)))
                    cart_review_product();
                    that.removeClass('btn-progress-cc');
                },
                error : function(res){
                    that.removeClass('btn-progress-cc');
                }
            }); 
        }else{
            cart_review_product();
        }  
    });
    $('.cart-review-product-box,.cart-review-product-box .doclose').on("click", function(e) {
        cart_review_product();
        e.stopPropagation();
    });
    $('.cart-review-product-box').on("click", ".cart-review-product-do-css3", function(e) {
        e.stopPropagation();
    });

    function cart_review_product(){
        if (!$(".cart-review-product-do-css3").hasClass('showcss')) {
            $(".cart-review-product-do-css3").addClass('showcss').removeClass('hidecss');
            $(".cart-review-product-box").show();
        }else{
            $(".cart-review-product-do-css3").addClass('hidecss').removeClass('showcss');
            setTimeout(function(){
                $(".cart-review-product-box").hide();
                $(".order-review-product").addClass('lefthidecss').removeClass('leftshowcss');
            },300);
        }
    }


    $(document).on("click", ".write_review", function(e) {
        cart_review_write();
    });
    $('.cart-review-write-box .doclose').on("click", function(e) {
        cart_review_write();
        e.stopPropagation();
    });
    $('.cart-review-write-box').on("click", ".cart-review-write-do-css3", function(e) {
        //e.stopPropagation();
    });

    function cart_review_write(){
        if (!$(".cart-review-write-do-css3").hasClass('showcss')) {
            $(".cart-review-write-do-css3").addClass('showcss').removeClass('hidecss');
            $(".cart-review-write-box").show();
        }else{
            $(".cart-review-write-do-css3").addClass('hidecss').removeClass('showcss');
            setTimeout(function(){
                $(".cart-review-write-box").hide();
                $(".order-review-write").addClass('lefthidecss').removeClass('leftshowcss');
            },300);
        }
    }

    //首页
    $("#ymq-review").on('click',function () {
        review_can_scroll = true;
        if ($('.review-box .card').length > 0 || $('.review-box .status-img').length > 0){
            return;
        }
        $('.review-content').css({'height':'200px','background':'white'});
        getreviewdata(true)
        $('.review-content').css({'height':'auto','background':'transparent'});
    });



    $(".in-top-content").scroll(function(){
      if ($("body").height() - $(".ymqloading").offset().top > -80 && review_can_scroll && review_issHas) {
        review_can_scroll = false;
        getreviewdata(false)
      }
    });

    var imgUpload = $('#imagesUpload').diyUpload({
        server:'https://ymq-shopify.oss-us-east-1.aliyuncs.com',
        fileNumLimit:5,
        getTokenUrl:'/api/ossapiindex/gettoken',
        getTokenUrlData:{shop_name:shop_data.name,size:5*1024*1024},
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
                $('.review_save').removeClass('btn-progress');
                console.log($('.reviews-images').val())
            }
        },
        error:function( err ) {
            $('.review_save').removeClass('btn-progress');
         },
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
        getTokenUrl:'/api/ossapiindex/gettoken',
        getTokenUrlData:{shop_name:shop_data.name,size:200*1024*1024},
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
                    $(this).data("src",upload_video_arr[i]);
                });
                var reviewPhotoText = upload_video_arr.join(',');
                $('.reviews-videos').val(reviewPhotoText);
                console.log($('.reviews-videos').val())
                $('.review_save').removeClass('btn-progress');
            }
        },
        error:function( err ) {
            $('.review_save').removeClass('btn-progress');
         },
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

    $('#defaultForm').bootstrapValidator({
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: __('must_not_be_empty')
                    },
                    stringLength : {
                        min : 0,
                        max : 20,
                        message : __('no_more_than_characters',['20'])
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: __('must_be_a_valid_email')
                    },
                    email: {
                        message: __('must_be_a_valid_email')
                    }
                }
            },
            review_title: {
                validators: {
                    notEmpty: {
                        message: __('must_not_be_empty')
                    },
                    stringLength : {
                        min : 0,
                        max : 50,
                        message : __('no_more_than_characters',['50'])
                    }
                }
            },
            review: {
                validators: {
                    notEmpty: {
                        message: __('must_not_be_empty')
                    },
                    stringLength : {
                        min : 0,
                        max : 1000,
                        message : __('no_more_than_characters',['1000'])
                    }
                }
            }
        }
    }).on("success.form.bv",function(e){
        $('.review_save').addClass('btn-progress');
        var formData = $('#defaultForm').serialize() + "&shop_name="+shop_data.name
        $.ymqajax({
            url : "/api/reviewsindex/save",
            ymqtype: 'modal',
            iziToastType: 'success',
            data:formData,
            success : function(res) {
                $('.review_save').removeClass('btn-progress');
                cart_review_write();
                reviewreset()
            },
            error : function(res){
                $('.review_save').removeClass('btn-progress');
            }
        });
        return false;
    });

    function getreviewdata(withdetail){
        showload()
        $.ymqajax({
            url : "/api/reviewsindex/getreviews",
            ymqtype: 'modal',
            iziToast: false,
            dom:$('.review-box'),
            data:{cid:cid,shop_name:shop_data.name,ctoken:ctoken,page:page,rating:rating,withs:withs,product_id:product_id,withdetail:withdetail},
            success : function(res) {
                if (res.data.last_page <= page) {
                    review_issHas = false;
                }else{
                    review_can_scroll = true;
                    review_issHas = true;
                }
                if (withdetail) {
                    $('.review-content').prepend(creatReviewDetailHtml(res.msg,res.data.total));
                    $('.rating_select').selectFilter({
                        callBack : function (val){
                            if (rating != val) {
                                rating = val;
                                page = 1;
                                customers_load(1); 
                            }
                        }
                    });
                    $('.withs').selectFilter({
                        callBack : function (val){
                            if (withs != val) {
                                withs = val;
                                page = 1;
                                customers_load(1);
                            }
                        }
                    });
                }
                $('.review-box').append(creatReviewHtml(res.data.data));
                hideload()
                //$(".chat-content").getNiceScroll().onResize();
                page++;
            }
        });
    }
    function customers_load(){
        $('.review-box').html('');
        getreviewdata(false)
    }

    function creatReviewDetailHtml(data,total){
        var pushHtml = `<div class="card">`;
        var sum = 0;
        data.forEach(function (item) {
            sum += item.rating*item.count;
        })
        
        var now_rating = 5;
        pushHtml += `
            <div class="review_average">
                <strong >${(sum/(total)).toFixed(1)}</strong> ${__('based_on_reviews',[total])}
            </div>
        `;
        data.forEach(function (item) {
            if (now_rating != item.rating) {
                for (var i = 0; i < now_rating-item.rating; i++) {
                    pushHtml += `
                        <div class="review_detail_item">
                            <span class="review_detail_start">
                            ${get_review_star_one(now_rating)} ${now_rating}
                            </span>
                            <span class="review_detail_percent_box">
                                <span style="width: 0%;"></span>
                            </span>
                            <span class="review_detail_percent" style="margin: 0 5px;">0%</span>
                            <span class="review_detail_num">(0)</span>
                        </div>
                    `;
                    now_rating --;
                }
            }
            pushHtml += `
                <div class="review_detail_item review_detail_item_active">
                    <span class="review_detail_start">
                        ${get_review_star_one(item.rating)} ${now_rating}
                    </span>
                    <span class="review_detail_percent_box">
                        <span style="width: ${100*item.count/total}%;"></span>
                    </span>
                    <span class="review_detail_percent" style="margin: 0 5px;">${(100*item.count/total).toFixed(1)}%</span>
                    <span class="review_detail_num">(${item.count})</span>
                </div>
            `;
            now_rating --;
        })
        if(!ymq_plan(shop_data.plan,'review-image')){
            pushHtml += `
                <div class="row review_select">
                </div>
                `;
        }
        pushHtml += `
            <div class="row review_select">
                <div class="form-group col-6 filter-box rating_select">
                    <div class="filter-text">
                        <span class="filter-title"></span>
                        <i class="icon icon-filter-arrow"></i>
                    </div>
                    <select name="form-control rating_select">
                        <option value="all" selected>${__('review_start_all')}</option>
                        <option value="1">${__('one_star_rating')}</option>
                        <option value="2">${__('two_star_rating')}</option>
                        <option value="3">${__('three_star_rating')}</option>
                        <option value="4">${__('four_star_rating')}</option>
                        <option value="5">${__('five_star_rating')}</option>
                    </select>
                </div>`;
            if (ymq_plan(shop_data.plan,'review-video')) {
                pushHtml += `
                    <div class="form-group filter-box  col-6 withs">
                        <div class="filter-text">
                            <span class="filter-title"></span>
                            <i class="icon icon-filter-arrow"></i>
                        </div>
                        <select class="form-control withs">
                            <option value="all" selected>${__('review_start_all')}</option>
                            <option value="1">${__('with_photo')}</option>
                            <option value="2">${__('with_video')}</option>
                        </select>
                    </div>
                `;
            }else if(ymq_plan(shop_data.plan,'review-image')){
                pushHtml += `
                    <div class="form-group filter-box  col-6 withs">
                        <div class="filter-text">
                            <span class="filter-title"></span>
                            <i class="icon icon-filter-arrow"></i>
                        </div>
                        <select class="form-control withs">
                            <option value="all" selected>${__('review_start_all')}</option>
                            <option value="1">${__('with_photo')}</option>
                        </select>
                    </div>
                `;
            }
                
        pushHtml += `
            </div>
        </div>`;
        return pushHtml;
    }


    function creatReviewHtml(data){
        var pushHtml = ``;
        data.forEach(function (item) {
            var reviews_images = ``;
            var video_bg = `background: #f7f7f7;`;
            if (item.reviews_images != '' && ymq_plan(shop_data.plan,'review-image')) {
                var images_arr = item['reviews_images'].split(',');
                video_bg11 = `background-image:url(${images_arr[images_arr.length-1]}?x-oss-process=image/resize,w_100/quality,q_100);`;
                images_arr.forEach(function (img_item) {
                    if (shop_data.branding.water.water != '' && ymq_plan(shop_data.plan,'review-water')) {
                        reviews_images += `
                            <div class="spotlight" data-description="" data-src="${img_item+shop_data.branding.water.water}" style="background-image:url(${img_item}?x-oss-process=image/resize,w_100/quality,q_100)"></div>
                        `;
                    }else{
                        reviews_images += `
                        <div class="spotlight" data-description="" data-src="${img_item}" style="background-image:url(${img_item}?x-oss-process=image/resize,w_100/quality,q_100)"></div>
                        `;
                    }
                })
            }
            var reviews_videos = ``;
            if (item.reviews_videos != '' && ymq_plan(shop_data.plan,'review-video')) {
                var videos_arr = item.reviews_videos.split(',');
                videos_arr.forEach(function (video_item) {
                    reviews_videos += `
                    <div class="video_bg" data-src="${video_item}" data-id="${item.id}" style="${video_bg}"><svg t="1604068612250" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1157" width="30" height="30"><path d="M426.666667 682.666667V384l256 149.845333L426.666667 682.666667z m587.093333-355.541334s-10.026667-71.04-40.704-102.357333c-38.954667-41.088-82.602667-41.258667-102.613333-43.648C727.168 170.666667 512.213333 170.666667 512.213333 170.666667h-0.426666s-214.954667 0-358.229334 10.453333c-20.053333 2.389333-63.658667 2.56-102.656 43.648-30.677333 31.317333-40.661333 102.4-40.661333 102.4S0 410.538667 0 493.952v78.293333c0 83.456 10.24 166.912 10.24 166.912s9.984 71.04 40.661333 102.357334c38.997333 41.088 90.154667 39.765333 112.938667 44.074666C245.76 893.568 512 896 512 896s215.168-0.341333 358.442667-10.752c20.053333-2.432 63.658667-2.602667 102.613333-43.690667 30.72-31.317333 40.704-102.4 40.704-102.4s10.24-83.413333 10.24-166.869333v-78.250667c0-83.456-10.24-166.912-10.24-166.912z" fill="#FF0000" p-id="1158"></path></svg></div>
                    `;
                }) 
            }
            //判断是不是产品页
            var view_product = ``;
            if (shop_data.extension.template != 'product' && shop_data.extension.product_id == 0) {
                view_product = `<div class="view-product-btn" data-product_id="${item.product_id}">View product >></div>`;
            }
            pushHtml += `
                <div class="card">
                <div>
                    <span class="avatar avatar${Math.floor(Math.random()*6+1)}">${item.name.charAt(0).toUpperCase()}</span>
                    <div class="use_info">
                        <div class="reviewrating">
                            ${get_review_star(item.rating)}
                        </div>
                        <div>
                            <span class="user_name">${item.name}</span>
                            <span class="review_time">${getMyDate(item.createtime)}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="review_title">
                    ${item.review_title}
                    </div>
                    <div class="review_text">
                        <div class="review_text_inner">
                        ${item.review}
                        </div>
                    </div>
                    <div class="spotlight-group spotlight-50" >
                        ${reviews_images}
                        ${reviews_videos}
                        ${view_product}
                    </div>
                </div>
            </div>
            `
        })
        return pushHtml;
    }

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
    $(document).on('change', '.rating_select', function () {
        rating = $(this).val();
        page = 1;
        customers_load(1);
    });
    $(document).on('change', '.withs', function () {
        withs = $(this).val();
        page = 1;
        customers_load(1);
    });
    function reviewreset(){
        $('#defaultForm')[0].reset();
        $(".diyUploadHover").remove();
        upload_img_arr = [];
        upload_video_arr = [];
    }

    function get_review_star(num){
        var pushHtml = ``;
        for (var i = 0; i < num; i++) {
            pushHtml += `<svg t="1603333001059" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3791" width="16" height="16"><path d="M548.2 93l98.4 199.4c6.2 12.5 18.1 21.2 32 23.2l220 32c34.8 5.1 48.7 47.9 23.5 72.4L762.9 575.2c-10 9.8-14.6 23.8-12.2 37.6l37.6 219.1c5.9 34.7-30.5 61.1-61.6 44.8L529.9 773.2c-12.4-6.5-27.2-6.5-39.5 0L293.5 876.7c-31.2 16.4-67.6-10.1-61.6-44.8l37.6-219.1c2.4-13.8-2.2-27.8-12.2-37.6L98.1 420c-25.2-24.6-11.3-67.4 23.5-72.4l220-32c13.8-2 25.8-10.7 32-23.2L472 93c15.6-31.6 60.6-31.6 76.2 0z" p-id="3792" fill="#fcd93a"></path></svg>`;
        }
        for (var i = 0; i < 5-num; i++) {
            pushHtml += `<svg t="1603333626994" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4050" width="16" height="16"><path d="M280.9 958.7c-14.2 0-28.3-4.3-40.4-12.9-23-16.2-34.5-43.8-29.9-72l38-233.8L87.5 474.8c-19.3-19.8-25.9-48.6-17-75.1 8.7-25.9 30.5-44.4 57-48.5l221.1-33.8L447.8 106c12-25.5 36.6-41.4 64.3-41.4 27.7 0 52.4 15.9 64.3 41.4l99.2 211.4 221.1 33.8c26.5 4 48.3 22.6 57 48.5 8.9 26.5 2.4 55.3-17 75.1L775.6 640l38.1 233.7c4.6 28.2-6.9 55.8-29.9 72.1-22.2 15.6-50.7 17.2-74.5 4.1l-197.2-109-197.2 109c-10.7 5.8-22.4 8.8-34 8.8z m231.2-201.6c11.7 0 23.3 2.9 34 8.8l183.5 101.4-35.6-218c-3.8-23.1 3.6-46.9 19.9-63.5l152.5-156.3-208.9-31.9c-23.4-3.6-43.5-18.7-53.8-40.6l-91.6-195.1L420.5 357c-10.2 21.8-30.4 37-53.8 40.6l-208.9 31.9 152.5 156.3c16.2 16.6 23.6 40.3 19.9 63.5l-35.6 218 183.5-101.4c10.7-5.9 22.3-8.8 34-8.8z" p-id="4051" fill="#fcd93a"></path></svg>`;
        }
        return pushHtml;
    }
    function get_review_star_one(){
        var pushHtml = `<svg t="1603333001059" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3791" width="16" height="16"><path d="M548.2 93l98.4 199.4c6.2 12.5 18.1 21.2 32 23.2l220 32c34.8 5.1 48.7 47.9 23.5 72.4L762.9 575.2c-10 9.8-14.6 23.8-12.2 37.6l37.6 219.1c5.9 34.7-30.5 61.1-61.6 44.8L529.9 773.2c-12.4-6.5-27.2-6.5-39.5 0L293.5 876.7c-31.2 16.4-67.6-10.1-61.6-44.8l37.6-219.1c2.4-13.8-2.2-27.8-12.2-37.6L98.1 420c-25.2-24.6-11.3-67.4 23.5-72.4l220-32c13.8-2 25.8-10.7 32-23.2L472 93c15.6-31.6 60.6-31.6 76.2 0z" p-id="3792" fill="#fcd93a"></path></svg>`;
        return pushHtml;
    }
    function getMyDate(str){  
       var oDate = new Date(str),  
       oYear = oDate.getFullYear(),  
       oMonth = oDate.getMonth()+1,  
       oDay = oDate.getDate(),  
       oHour = oDate.getHours(),  
       oMin = oDate.getMinutes(),  
       oSen = oDate.getSeconds(),  
       oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay);//最后拼接时间  
       return oTime;  
    }; 
    //补0操作
    function getzf(num){  
         if(parseInt(num) < 10){  
             num = '0'+num;  
         }  
         return num;  
    }
})

