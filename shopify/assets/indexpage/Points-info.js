$(document).ready(function () {
    var form_data = $('#defaultForm').serialize();


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
    })
    $("[name='min']").bind('input propertychange', function() {
       console.log(111)
    });
    $("input,textarea,select").bind('input propertychange', function() {
        if (form_data != $('#defaultForm').serialize()) {
            $('.save').removeClass('disabled');
            $('form').bootstrapValidator('disableSubmitButtons', false);
        }else{
            $('.save').addClass('disabled');
            $('form').bootstrapValidator('disableSubmitButtons', true);
        }
    });
    $(".radio-btn").change(function(){
        $('.redio-input').hide();
        $('.redio-input').find('input').attr("disabled",true);
        $($(this).attr('data-input')).show();
        $($(this).attr('data-input')).find('input').attr("disabled",false);
    });
    $("input[name='points']").change(function(){
        $($(this).attr('data-point')).html($(this).val());
    });

    function initdisabledsave(){
        $('form').bootstrapValidator('disableSubmitButtons', true);
        $("input,textarea,select").each(function(){
            if($(this).is(":checked")){
                $("input[name='"+$(this).attr('name')+"']").data('value',$(this).val());
            }else{
                $(this).data('value',$(this).val());
            }
        })
        form_data = $('#defaultForm').serialize();
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
                        max : 15,
                        message : 'No more than 15 characters'
                    }
                }
            },
            url: {
                validators: {
                    notEmpty: {
                        message: 'Must be a valid URL'
                    },
                    uri: {
                        message: 'Must be a valid URL'
                    }
                }
            },
            status: {
                validators: {
                    notEmpty: {
                        message: 'Please enter valid content'
                    },
                    between: {
                        min : 0,
                        max : 1,
                        message: 'Please enter valid content'
                    }
                }
            },
            type_id: {
                validators: {
                    notEmpty: {
                        message: 'Please enter valid content'
                    },
                    between: {
                        min : 0,
                        max : 1,
                        message: 'Please enter valid content'
                    }
                }
            },
            message: {
                validators: {
                    notEmpty: {
                        message: 'Must not be empty'
                    },
                    stringLength : {
                        min : 0,
                        max : 30,
                        message : 'No more than 30 characters'
                    }
                }
            },
            username: {
                validators: {
                    notEmpty: {
                        message: 'Must not be empty'
                    },
                    stringLength : {
                        min : 0,
                        max : 30,
                        message : 'No more than 30 characters'
                    }
                }
            },
            points: {
                validators: {
                    notEmpty: {
                        message: 'Points amount must be greater than 0'
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
            url : "/api/pointearn/edit",
            //数据，json字符串
            data : $('#defaultForm').serialize(),
            //请求成功
            success : function(result) {
                if (result.code == 1) {
                    if ($(".creat").attr('class') != undefined) {
                        result.msg = "Action created";
                        $(".creat").addClass('save');
                        $(".creat").text("Save");
                        $(".creat").before('<button class="btn btn-danger delete float-left">Delete</button>');
                        $(".creat").removeClass('creat');
                    }
                    iziToast.show({
                        message: result.msg,
                        position: 'bottomCenter'
                    });
                    initdisabledsave();
                }else if(result.code == 0){
                    iziToast.error({
                        message: result.msg,
                        position: 'bottomCenter'
                    });
                }
                $('.save,.creat').removeClass('btn-progress');
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                $('.save,.creat').removeClass('btn-progress');
            }
        });
        return false;
    });

    $(document).on('click', ".delete", function () {
        var deletetitle = $('.right-header .mr-1').text();
        $(this).fireModal({
            title: `Delete ${deletetitle}`,
            body: `Are you sure you want to delete ${deletetitle}? This action cannot be reversed.`,
            center: true,
            removeOnDismiss: true,
            initShow: true,
            buttons: [
                {
                    text: 'Cancel',
                    class: 'btn btn-secondary btn-shadow',
                    handler: function(modal) {
                        modal.modal('hide');
                    }
                },
                {
                    text: 'Delete',
                    class: 'btn btn-danger btn-shadow',
                    handler: function(modal) {
                        $.ajax({
                            //请求方式
                            type : "POST",
                            dataType: "json",
                            //请求地址
                            url : "/api/pointearn/delete",
                            //数据，json字符串
                            data : {"id":$("input[name='id']").val()},
                            //请求成功
                            success : function(result) {
                                if (result.code == 1) {
                                    window.location.href='/index/points/index.html';
                                }else if(result.code == 0){
                                    modal.modal('hide');
                                    iziToast.error({
                                        message: result.msg,
                                        position: 'bottomCenter'
                                    });
                                    $('.save,.creat').removeClass('btn-progress');
                                }
                            },
                            //请求失败，包含具体的错误信息
                            error : function(e){
                                modal.modal('hide');
                                iziToast.error({
                                    message: 'Deleted Error',
                                    position: 'bottomCenter'
                                });
                                $('.save,.creat').removeClass('btn-progress');
                            }
                        });
                    }
                }
            ]
        });
        // swal({
        //   title: 'Delete '+deletetitle+'?',
        //   text: 'Are you sure you want to delete '+deletetitle+'? This action cannot be reversed.',
        //   icon: 'warning',
        //   buttons: true,
        //   dangerMode: true,
        // })
        // .then((willDelete) => {
        //   if (willDelete) {
        //
        //         $.ajax({
        //             //请求方式
        //             type : "POST",
        //             dataType: "json",
        //             //请求地址
        //             url : "/api/pointearn/delete",
        //             //数据，json字符串
        //             data : {"id":$("input[name='id']").val()},
        //             //请求成功
        //             success : function(result) {
        //                 if (result.code == 1) {
        //                     swal('Poof! '+deletetitle+' has been deleted!', {
        //                         icon: 'success',
        //                     }).then((willDelete) => {
        //                         window.location.href = result.data;
        //                     });
        //                 }else if(result.code == 0){
        //                     swal(result.msg , {
        //                         icon: 'success',
        //                     }).then((willDelete) => {
        //                         //alert(111)
        //                     });
        //                 }
        //                 $('.save,.creat').removeClass('btn-progress');
        //             },
        //             //请求失败，包含具体的错误信息
        //             error : function(e){
        //                 $('.save,.creat').removeClass('btn-progress');
        //             }
        //         });
        //
        //   } else {
        //       //swal('Your imaginary file is safe!');
        //   }
        // });
        return false;
    });
    if ($(".save").length > 0) {
        $('form').bootstrapValidator('disableSubmitButtons', true);
    }
});