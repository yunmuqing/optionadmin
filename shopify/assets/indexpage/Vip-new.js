var icon_custome_icon_arr = [];
var icon_arr = ['custome_icon'];
$(document).ready(function() {
    icon_arr.forEach(function (item) {
        $('#icon_'+item).diyUpload({
            server:'https://ymq-shopify.oss-us-east-1.aliyuncs.com',
            fileNumLimit:1,
            getTokenUrl:'/api/ossapi/gettoken',
            getTokenUrlData:{size:100*1024},
            fileSizeLimit:100*1024,
            fileSingleSizeLimit:100*1024,
            type:'image',
            viewbox: 'view_'+item,
            data_arr: 'icon_'+item+'_arr',
            input: 'icon_'+item,
            success:function(data,$fileBox) {
                if (eval('icon_'+item+'_arr').length !== 0) {
                    $('.view_'+item).each(function(i){
                        $(this).attr("data-src",eval('icon_'+item+'_arr')[i]);
                    });
                    $('.icon_'+item+'_spotlight .spotlight').each(function(i){
                        $(this).attr("data-src",eval('icon_'+item+'_arr')[i]);
                        $(this).css({
                          backgroundImage: 'url("'+ eval('icon_'+item+'_arr')[i] +'")'
                        });
                    });
                    
                    var img_text = eval('icon_'+item+'_arr').join(',');
                    $('.icon_'+item).val(img_text);
                    //if(icon_free_product == 'banner_images'){
                        //do_change_iframe($('.banner_images'),'banner-image',$('.banner_images').val());
                    //}
                }
                $('.images-save').removeClass('disabled');
                $('.images-save').attr('disabled',false);
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
    });
    var form_data = $('#defaultForm').serialize();
    $(".colorpickerinput ").each(function () {
        var color = $(this).val();
        $(this).prev('.color-btn').css('background-color',color);
    });

    $(".colorpickerinput").colorpicker({
        format: 'hex',
        component: '.input-group-append',
        extensions: [{
            name: 'preview',
            options: {
                showText: true,
                template:'<div class="colorpicker-bar colorpicker-preview"><input type="text" class="form-control"></div>'
            }
        }]
    });
    $(".colorpickerinput").on('focus',function(){
        var that = $(this);
        var pickDom = $("#"+$(this).attr("aria-describedby"));
        pickDom.find('.form-control').val($(this).val()).bind('input propertychange',function () {
            that.val($(this).val());
            that.trigger('change');
        });
    });
    $(".colorpickerinput").on('change',function(){
        $(this).prev('.color-btn').css('background-color',$(this).val());
    });
    $(".colorpickerinput_b").on('change',function(){
        $('.vip_box').css('background',$(this).val().colorRgbToHsl(true));
        $('.b_hsla').val($(this).val().colorRgbToHsl(true));
    });
    $(".colorpickerinput_c").on('change',function(){
        $('.vip_icon svg path').attr('fill',$(this).val());
    });
    $(".color-btn").on('click',function () {
        $(this).next('.colorpickerinput').trigger('focus');
    });
    $(".vip_icon").on('click',function () {
        $(".icon_box").show()
        event.stopPropagation(); 
    });
    $("body").on('click',function () {
        $(".icon_box").hide()
    });
    $(".icon_item").on('click',function () {
        $(".vip_icon_input").val($(this).data('icon'));
        $(".icon_show").html($(this).html());
    });
    String.prototype.colorRgbToHsl = function(stringMode = false){

        var backCycle = function (num, cycle) {
            let index = num % cycle;
            if (index < 0) {
                index += cycle;
            }
            return index;
        }
        var numberFixed = function (num = 0, count = 3) {
            const power = Math.pow(10, count);
            return Math.floor(num * power) / power;
        }
        var rgb2hsl = function (R = 0, G = 0, B = 0, stringMode = false) {
            const _R = R / 255;
            const _G = G / 255;
            const _B = B / 255;
            const Cmax = Math.max(_R, _G, _B);
            const Cmin = Math.min(_R, _G, _B);
            const V = Cmax - Cmin;

            let H = 0;
            if (V === 0) {
                H = 0;
            } else if (Cmax === _R) {
                H = 60 * (((_G - _B) / V) % 6);
            } else if (Cmax === _G) {
                H = 60 * ((_B - _R) / V + 2);
            } else if (Cmax === _B) {
                H = 60 * ((_R - _G) / V + 4);
            }

            H = Math.floor(backCycle(H, 360));
            const L = numberFixed((Cmax + Cmin) / 2);
            const S = V === 0 ? 0 : numberFixed(V / (1 - Math.abs(2 * L - 1)));

            var r1 = H;
            var g1 = numberFixed(100 * S);
            var b1 = numberFixed(100 * L);
            var r2 = r1;
            var g2 = '';
            var b2 = '';
            var b3 = '';
            if (g1 >= 90){
                g2 = 100;
            }else{
                g2 = g1 + 10;
            }
            if (b1 <= 15){
                b2 = 0;
            }else{
                b2 = b1 - 15;
            }
            if (b1 <= 9){
                b3 = 0;
            }else{
                b3 = b1 - 9;
            }

            if (stringMode) {
                // return `hsl(${H},${numberFixed(100 * S)}%,${numberFixed(100 * L)}%)`;
                return `linear-gradient(-32deg,hsla(${r1},${g1}%,${b1}%,1),hsla(${r2},${g2}%,${b2}%,1))`;
            }else{

                return [`hsla(${r1},${g1}%,${b1}%,1)`,`hsla(${r2},${g2}%,${b3}%,1)`];
            }

        }
        var sColor = this.toLowerCase();
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是16进制颜色
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i=1; i<4; i+=1) {
                    sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i=1; i<7; i+=2) {
                sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));
            }
            return rgb2hsl(sColorChange[0],sColorChange[1],sColorChange[2],stringMode);
        }
        return sColor;
    };
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
    $("input,select").on('change', function() {
        if (form_data != $('#defaultForm').serialize()) {
            $('.save,.creat').removeClass('disabled');
        }else{
            $('.save,.creat').addClass('disabled');
        }
    });

    $('#defaultForm').bootstrapValidator({
        fields: {
            level: {
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
            }
        }
    }).on("success.form.bv",function(e){
        $('.save').addClass('disabled btn-progress');
        $.ajax({
            //请求方式
            type : "POST",
            dataType: "json",
            //请求地址
            url : "/api/vip/save",
            //数据，json字符串
            data : $('#defaultForm').serialize(),
            //请求成功
            success : function(result) {
                if (result.code == 1) {
                    window.location.href='/index/vip/index.html';
                }else if(result.code == 0){
                    iziToast.error({
                        message: result.msg,
                        position: 'bottomCenter'
                    });
                }
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

} );