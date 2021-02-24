$(document).ready(function () {
    // $('form').bootstrapValidator({
    //     message: 'This value is not valid',
    //     feedbackIcons: {
    //         valid: 'glyphicon glyphicon-ok',
    //         invalid: 'glyphicon glyphicon-remove',
    //         validating: 'glyphicon glyphicon-refresh'
    //     },
    //     fields: {
    //         url: {
    //             validators: {
    //                 uri: {
    //                     message: 'Share URL must be a valid URL'
    //                 }
    //             }
    //         }
    //     },
    //     excluded: [':disabled', ':hidden', ':not(:visible)'],
    //     submitButtons: 'button[type="submit"]',
    //     submitHandler: function (validator, form, submitButton) {
    //         alert("submit");
    //     }
    // });
    $(".bbbb").click(function(){
        $.ajax({
            //请求方式
            type : "POST",
            dataType: "json",
            //请求地址
            url : "https://shopify.luckydn.top/index/points/eeee",
            //数据，json字符串
            data : $('#defaultForm').serialize(),
            //请求成功
            success : function(result) {
                console.log(result)
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    })
});