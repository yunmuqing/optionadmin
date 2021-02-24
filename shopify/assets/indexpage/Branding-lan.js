$(document).ready(function () {
    var form_data = $('#defaultForm').serialize();
    $("input,select").on('change', function() {
        if (form_data != $('#defaultForm').serialize()) {
            $('.save,.creat').removeClass('disabled');
        }else{
            $('.save,.creat').addClass('disabled');
        }
    });
    $('.lan-save').on('click',function () {
        var that = $(this);
        that.addClass('btn-progress');
        if ($('.is_replace').length >0) {
            var replace = $("input[name='replace']:checked").val();
        }else{
            var replace = 0;
        }
        $.ajax({
            //请求方式
            type : "POST",
            dataType: "json",
            //请求地址
            url : "/api/branding/lansave",
            //数据，json字符串
            data : {lan:$('.country').val(),replace:replace},
            //请求成功
            success : function(result) {
                if (result.code == 1) {
                    iziToast.show({
                        message: result.msg,
                        position: 'bottomCenter'
                    });
                }else if(result.code == 0){
                    iziToast.error({
                        message: result.msg,
                        position: 'bottomCenter'
                    });
                }
                location.reload();
                that.removeClass('btn-progress');
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                that.removeClass('btn-progress');
            }
        });
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

    $('.list-group-item').click(function(){
        $('.list-group-item').removeClass('activeing');
        $(this).addClass('activeing');
        $('.card').removeClass('active');
        $('.'+$(this).data('class')).addClass('active');
    })

    $('#defaultForm').bootstrapValidator({
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: 'Must not be empty'
                    },
                    stringLength : {
                        min : 0,
                        max : 15,
                        message : 'No more than 15 characters'
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
            url : "/api/branding/lanedit",
            //数据，json字符串
            data : $('#defaultForm').serialize(),
            //请求成功
            success : function(result) {

                if (result.code == 1) {
                    iziToast.show({
                        message: result.msg,
                        position: 'bottomCenter'
                    });
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

    
    // if ($(".save").length > 0) {
    //     $('form').bootstrapValidator('disableSubmitButtons', true);
    // }
});