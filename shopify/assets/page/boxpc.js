$.fn.RangeSlider = function(cfg){
    this.sliderCfg = {
        min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null, 
        max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
        step: cfg && Number(cfg.step) ? cfg.step : 1,
        callback: cfg && cfg.callback ? cfg.callback : null
    };

    var $input = $(this);
    var min = this.sliderCfg.min;
    var max = this.sliderCfg.max;
    var step = this.sliderCfg.step;
    var callback = this.sliderCfg.callback;

    $input.attr('min', min)
        .attr('max', max)
        .attr('step', step);

    $input.bind("input", function(e){
        $input.attr('value', this.value);
        $input.css( 'background', 'linear-gradient(to right, #059CFA, white ' + this.value + '%, white)' );

        if ($.isFunction(callback)) {
            callback(this);
        }
    });
};
//分页每页数据量
var per_page_num = 50;
var goback_arr = [];
var ymq_shopify_address_init = null;
var ymq_shopify_address_country_init = null;
var cid = $("#app").attr('data-cid');
var ctoken = $("#app").attr('data-ctoken');
var prev_page = '';
var is_show_shot = true;

if (typeof branding === 'undefined'){
    var branding = null;
    var svg = null;
    var shopifylang = null;
}


console.log(shop_data);
function showHidePage(show_class){
    $(".ymq-main-content").hide();
    $(".ymq-content").hide();
    $(".top-goback").data(show_class);
}
function showload(){
    $('.ymq-loading .load').show();
}
function hideload(){
    $('.ymq-loading .load').hide();
}

window.onload=function(){
    $("#logo").animate({
        "padding-top":'6px',
        opacity:'1'
    });
    //$('.icon_path').attr('fill','#6777ef');
};

function changeSignPoint(point = 0) {
    var nowPoint = availablePoint;
    availablePoint = availablePoint + point;
    $('.home_point').text($('.home_point').text().replace(nowPoint,availablePoint))
    $('#ymq-point').data('header_detail',availablePoint);
    if ($('.header_detail').text() != '') {
        $('.header_detail').text(availablePoint)
    }
}

function setDate(beforeDate){
    return beforeDate.substring(0,10).replace(/-/g,"/");
}

function getTimestamp(time){
    return Date.parse(new Date(time))/1000
}

function admin_sortable(data) {
    var html = '';
    data.forEach(function (item) {
        html += $(`.sort_${item}`).prop('outerHTML');
    });
    $("#home .ymq-main-content").html(html);

}
function admin_header(data) {
    $('.text-1').html(data['caption']);
    if (data.hasOwnProperty("title")){
        $('.text-2').html(data['title']);
    }

}

function toggle_shop_box(display) {
    if (display == 'none'){
        $('#app').show().velocity({
            'margin-top': [0,60],
            opacity: [1,0]
        }, {
            duration: 250,
            easing: 'easeInOutQuart',
            complete: function () {

            }
        });
    }else{
        $('#app').velocity({
            'margin-top': [60,0],
            opacity: [0,1]
        }, {
            duration: 250,
            easing: 'easeInOutQuart',
            display: 'none',
            complete: function () {
                window.parent.postMessage({
                    auth: 'ymq',
                    action: 'velocity-shop-box-show',
                    data:{}
                }, "*");
            }
        });
    }

}

function admin_color(data) {
    $("#iframe-style").remove();
    $('body').append(data.style);
    if (data.svg){
        // $('.svg').each(function () {
        //     var src = $(this).attr('src');
        //     $(this).attr('src',src.substr(0,src.lastIndexOf('&color='))+'&color='+data.svg.substr(1));
        // })
        $('.icon_path').attr('fill',data.svg);
    }
    // $(data.dom).css(data.css,data.value);
}
function admin_wallpaper(data) {
    $("#app").css('background-image',`url(/svg/index/wallpaper.html?icon=${data})`);
}
function admin_shapes(data) {
    $("#iframe-style").remove();
    $('body').append(data);
}

/**
 * 初始化完成第一步必须由boxpc发出
 */

function checkemail(email){
    var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(pattern.test(email)){
        return true;
    }else{
        return false;
    }
}

function getTranslatey(string){
    var string = string.split('matrix(');
    if (string[1]) {
        string = string[1].split(')');
        if (string[0]) {
            string = string[0].split(',');
            if (string[5]) {
                string = string[5].replace(/(^\s*)|(\s*$)/g, "");
                return Number(string);
            }
        }
    }
    return 0;
}

function getUuname() {
    return 'U' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function intervalResult(maxCount,time,flgBool,loopFn){
    if(typeof maxCount=="function"){
        loopFn=time;
        flgBool=maxCount;
        time=1000;
        maxCount=20;
    }
    else if(typeof time=="function"){
        loopFn=flgBool;
        flgBool=time;
        time=1000;
    }
    if(typeof flgBool!="function"){
        flgBool=function(){
            return false;
        }
    }
    var i=0;
    var invSet=setInterval(function(){
        i++;
        if(i>maxCount||flgBool(i)){
            clearInterval(invSet);
            return;
        }
        if(typeof loopFn=="function"){
            loopFn();
        }
    },time);
}
function getTranslateYValue(translateString){

    var n = translateString.indexOf(",");
    var n1 = translateString.indexOf(")");

    var res = parseInt(translateString.slice(n+1,n1-1));
    return res;

}

function getTranslateValues (matrix) {
    if (matrix == 'none'){
        return {
            x: 0,
            y: 0,
            z: 0
        }
    }
    // Can either be 2d or 3d transform
    const matrixType = matrix.includes('3d') ? '3d' : '2d'
    const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ')

    // 2d matrices have 6 values
    // Last 2 values are X and Y.
    // 2d matrices does not have Z value.
    if (matrixType === '2d') {
        return {
            x: matrixValues[4],
            y: matrixValues[5],
            z: 0
        }
    }

    // 3d matrices have 16 values
    // The 13th, 14th, and 15th values are X, Y, and Z
    if (matrixType === '3d') {
        return {
            x: matrixValues[12],
            y: matrixValues[13],
            z: matrixValues[14]
        }
    }
}

function show_shot_header(fun){
    $('.in-top-content').addClass('ispage').removeClass('nopage');
    var initJson = getTranslateValues($(".scroll-in").css('transform'));
    var initY = 0;
    if(initJson.hasOwnProperty("y")){
        initY = initJson['y'];
    }

    $(".scroll-in").velocity({
        translateY: [-100,initY]
    }, {
        duration: 250,
        complete: function () {
            $('.scroll-finished').show();
            $('.scroll-in').hide();
            fun();
        }
    });
    is_show_shot = false;
}
function show_long_header(fun){
    $('.in-top-content').addClass('nopage').removeClass('ispage');
    $('.scroll-finished').hide();
    $('.scroll-in').show();
    $(".scroll-in").velocity({
        translateY: [0,-100]
    }, {
        duration: 250,
        complete: function () {
            fun();
        }
    });
    is_show_shot = true;
}

function __(key,dvalue=null){
    if (!shopifylang.hasOwnProperty(key)) {
        return key;
    }
    if (dvalue!=null && Array.isArray(dvalue)) {
        if (shopifylang[key].indexOf("%s") != -1) {
            var data = '';
            var testArr = shopifylang[key].split('%s');
            testArr.forEach((item, index) => {
                data += item;
                if (index < dvalue.length) {
                    data += dvalue[index]
                }
            });
            data = data.replace(/%%/g,"%")
            return data;
        }else{
            return shopifylang[key];
        }

    }else{
        return shopifylang[key];
    }
}

function ymq_plan(plan = 0, service = ''){
    var hasPlan = false;
    if (ymq_plan_array.hasOwnProperty(plan)){
        for(var key in ymq_plan_array){
            if (plan >= key) {
                if (ymq_plan_array[key].indexOf(service) != -1) {
                    hasPlan = true;
                    break;
                }
            }
        }
    }
    return hasPlan;
}

$(document).ready(function () {
    function all_init_iframe_show(){
        var data = {
            auth: 'ymq',
            action: 'iframe-show',
            data:{}
        };
        window.parent.postMessage(data, "*");
        console.log('ymq-all-init-boxpc-postmessage-to-shopify');
        if (typeof isAdmin !== 'undefined'){
            _initialize();
        }

    }
    /**
     * boxp加载完成，向父iframe发送消息
     */
    all_init_iframe_show();

    //给后台用的
    window.parent.postMessage({
        auth: 'ymq',
        action: 'admin-loading',
        data:{}
    }, "*");

    window.addEventListener('message', function (e) {
        var res = e.data;
        // console.log(res);
        if (res.hasOwnProperty('auth') && res.auth == 'ymq'){
            switch (res.action) {
                case 'boxpc-initialize':
                    console.log(res.data);
                    _initialize(res.data);
                    break;
                case 'admin-color':
                    admin_color(res.data);
                    break;
                case 'admin-wallpaper':
                    admin_wallpaper(res.data);
                    break;
                case 'admin-shapes':
                    admin_shapes(res.data);
                    break;
                case 'post-ymq-address-init-data':
                    ymq_shopify_address_init = res.data;
                    break;
                case 'referral-link':
                    $(res.data.id).trigger('click');
                    var contentDom = $(`.${$(res.data.id).attr('data-showtab')}`);
                    contentDom.find('.referral_name').html(res.data.name);
                    contentDom.find("input[name='refer_name']").val(res.data.name);
                    contentDom.find("input[name='referral_link']").val(res.data.link);
                    break;
                case 'toggle-shop-box':
                    toggle_shop_box(res.data.display);
                    break;
                case 'admin-sortable':
                    admin_sortable(res.data.sortable);
                    break;
                case 'admin-header':
                    admin_header(res.data);
                    break;

            }
        }
    }, false);

    //收到夫iframe传过来的初始化值之后在进行加载
    function _initialize(data){
        console.log('ymq-initialize-boxpc-get-postmessage-from-shopify');
        showload();
        console.log(data);
        if (data){
            branding = data['branding'];
            svg = data['svg'];
            shopifylang = data['lang'];
        }
        shop_data['branding'] = branding;
        console.log(shop_data,branding,svg,shopifylang,111222);

        $('.creat-svg-by-script').each(function () {
            $(this).html(svg[$(this).data('key')]);
        });
        hideload();
        $('.ymq-main-content').show();

        $(".aaaaaa").on('click',function () {
            $("#ymq-refer_page").click();
        });
        $("#scroll-box .close").on('click',function () {
            var data = {
                auth: 'ymq',
                action: 'down-button-box',
                data:{}
            }
            window.parent.postMessage(data, "*");
        });
        $(document).on('click', ".ymq-tab", function () {
            if ($(this).hasClass('triggertab2')){
                $(".ymq-main-content").hide();
                $(".ymq-content").hide();
                $("."+$(this).data("showtab")).show().css({"position":"relative","left":"40px","right":"unset","opacity":"0"}).velocity({
                    left: 0,
                    opacity: 1
                }, {
                    duration: 150,
                    easing: 'easeInOutQuart'
                });
                $(this).removeClass('triggertab2');
                goback_arr.push($(this).data("showtab"));
            }else{
                var that = $(this);
                show_shot_header(function () {
                    // $(".in-top-content").animate({scrollTop:0},10);
                    $('.header_title').html(that.data("header_title"));
                    $('.header_detail').html(that.data("header_detail"));
                    $('.top-close').removeClass('top-close-blcak').addClass('top-close-white');
                    $(".top-goback").show();
                    $("."+that.data("showtab")).show().css({"position":"relative","left":"40px","right":"unset","opacity":"0"}).velocity({
                        left: 0,
                        opacity: 1
                    }, {
                        duration: 150,
                        easing: 'easeInOutQuart'
                    });
                });

                $(".ymq-main-content").hide();
                $('#app').css('background','#f9f9f9');
                goback_arr.push(that.data("showtab"));
            }

        });
        $("#ymq-review").click(function(){
            $('.write_review').show();
        });
        $(document).on('click', ".ymq-tab-2", function () {
            $('.'+goback_arr[goback_arr.length -1]).attr('data-top',$(".in-top-content").scrollTop());
            $(".in-top-content").scrollTop(0);
            $(".ymq-main-content").hide();
            $(".ymq-content").hide();
            $("."+$(this).data("showtab")).show().css({"position":"relative","left":"40px","right":"unset","opacity":"0"}).velocity({
                left: 0,
                opacity: 1
            }, {
                duration: 150,
                easing: 'easeInOutQuart'
            });

            goback_arr.push($(this).data("showtab"));
        });
        $(".top-goback").click(function(){
            // $(".in-top-content").animate({scrollTop:0},10);
            //点返回时先删除最后一个数组
            hideload();
            goback_arr.pop();
            //在跳转到上一个页面
            if (goback_arr[goback_arr.length -1] != undefined) {
                $(".ymq-content").hide();


                $('.'+goback_arr[goback_arr.length -1]).show().css({"position":"relative","right":"40px","left":"unset","opacity":"0"}).velocity({
                    right: 0,
                    opacity: 1
                }, {
                    duration: 150,
                    easing: 'easeInOutQuart'
                });
                $(".in-top-content").scrollTop($('.'+goback_arr[goback_arr.length -1]).attr('data-top'));
                if (prev_page != '') {
                    $(this).data('back',prev_page);
                    prev_page = '';
                }else{
                    $(this).data('back','');
                }
                can_scroll = false;
            }else{
                $('#app').css('background','');
                $(".ymq-content").hide();
                $(".top-goback").hide();
                show_long_header(function () {
                    $('.header_title').html($('.header_title').attr('data-text'));
                    $('.header_detail').html($('.header_detail').attr('data-text'));
                    $('.top-close').removeClass('top-close-white').addClass('top-close-blcak');
                    $(".ymq-main-content").show().css({"position":"relative","right":"40px","left":"unset","opacity":"0"}).velocity({
                        right: 0,
                        opacity: 1
                    }, {
                        duration: 150,
                        easing: 'easeInOutQuart'
                    });
                });
                can_scroll = false;
            }
        });

        $(".in-top-content").scroll(function () {
            if (!$('.in-top-content').hasClass('ispage')){
                var top = $(this).scrollTop();
                if (top <= 0){
                    top = 0;
                }
                if (top <= 65 && top>=0){
                    var topc = top*top/40;
                    $('.scroll-in').css('transform', `translateY(-${topc}px)`);
                    if (top == 65){
                        if ($('.scroll-finished').css('display') == 'none'){
                            $('.scroll-finished').show();
                            $('.scroll-in').hide();
                            $('.top-close').removeClass('top-close-blcak').addClass('top-close-white');
                        }
                    }else{
                        if ($('.scroll-in').css('display') == 'none'){
                            $('.scroll-finished').hide();
                            $('.scroll-in').show();
                            $('.top-close').removeClass('top-close-white').addClass('top-close-blcak');
                        }

                    }
                }else{
                    if ($('.scroll-finished').css('display') == 'none'){
                        $('.scroll-finished').show();
                        $('.scroll-in').hide();
                        $('.top-close').removeClass('top-close-blcak').addClass('top-close-white');
                    }

                }
            }
        });
        //首页
        $("#ymq-sign").on('click',function () {
            if (customeinfo != null){
                if ($('.sign-content .card').length > 0){
                    return;
                }
                showload();
                $.ymqajax({
                    url : "/api/signin/sign",
                    data:{cid:cid,shop_name:shop_data.name,ctoken:ctoken},
                    success : function(res) {
                        var pushHtml = `
                            <div class="card">
                                <div class="card-body">
                                    ${res.data}
                                    <div class="text-right do-sign-box">
                                        <button class="btn btn-primary dosign">${__('sign_in')}</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        $('.sign-content').append(pushHtml);
                    }
                });
            }else{
                iziToast.error({
                    message: __('please_login_first'),
                    position: 'topCenter'
                });
                e.stopPropagation();
            }
        });

        //首页

        //签到
        $(document).on('click', ".dosign", function () {
            var that = $(this);
            var cid = $("#app").attr('data-cid');
            var shop_name = $("#app").attr('data-shop_name');
            var ctoken = $("#app").attr('data-ctoken');
            that.addClass('btn-progress');
            $.ymqajax({
                url : "/api/signin/dosign",
                btn:that,
                success : function(res) {
                    if (res.msg == 'already_signed_in') {
                        iziToast.show({
                            message: __(res.msg),
                            position: 'topCenter'
                        });
                        return false;
                    }
                    if (that.hasClass('signin')) {
                        iziToast.show({
                            message: __(res.msg),
                            position: 'topCenter'
                        });
                    }
                    $("#calendar-box .today").addClass('signed');
                    that.attr('disabled','disabled');
                    changeSignPoint(res.data.points)
                }
            });
        });
        //签到
    }





});



