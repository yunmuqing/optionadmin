$(document).ready(function () {
    $('.commissions_val').bind('input propertychange', function(){
        $('.rate_commissions').text($(this).val())
    })
    $(".commission_save").click(function(){
        var that = $(this)
        that.addClass('btn-progress');
        if ($('.commissions_val').val()<0) {
            iziToast.show({
                message: 'The commission must be greater than 0',
                position: 'bottomCenter' 
            });
            that.removeClass('btn-progress');
            return;
        }
        $.ymqajax({
            url: " /api/branding/setting",
            data: {you_get_commissions:$(".commissions_val").val()},
            success: function (res) {
                iziToast.show({
                    message: res.msg,
                    position: 'bottomCenter' 
                });
                that.removeClass('btn-progress');
            }
        });
    })
    $(".ways_to_redeem_tab").click(function(){
        var thattab = $(this);
        var thatcheckBox = $(this).prev("input");
        if (thatcheckBox.attr("disabled") == "disabled") {
            return false;
        }
        if (thattab.data("status") == 1) {
            var poststatus = 0;
        }else if(thattab.data("status") == 0){
            var poststatus = 1;
        }else{
            var poststatus = 1;
        }
        thatcheckBox.attr("disabled",true);
        $.ajax({
            type : "POST",
            dataType: "json",
            url : "/api/Commissionsapi/updateredeemstatus",
            data : {"id":thattab.data("id"),"status":poststatus},
            //请求成功
            success : function(result) {
                if (result.code == 1) {
                    iziToast.show({
                        message: result.msg,
                        position: 'bottomCenter' 
                    });
                    thattab.data('status',poststatus)
                    if (poststatus == 1) {
                        thatcheckBox.attr("checked",true);
                    }else{
                        thatcheckBox.removeAttr("checked")
                    }
                }else if(result.code == 0){
                    iziToast.show({
                        message: result.msg,
                        position: 'bottomCenter' 
                    });
                }
                thatcheckBox.attr("disabled",false)
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                thatcheckBox.attr("disabled",false)
            }
        });
    })
    // $('.ways_to_redeem').on('click',function () {
    //     $(this).fireModal({
    //         title: 'Ways to redeem',
    //         body: `
    //             <ul class="list-group">
    //                     <a href="/index/commissions/info/type/3.html" class="list-group-item list-group-item-model">
    //                         <div class="media">
    //                             <div class="mr-4 i-box">
    //                                 <img width="30" src="/svg/index.html?icon=fixedamount&color=6777ef" alt="">
    //                             </div>
    //                             <div class="media-body space-between">
    //                                 <div class="inline-block">
    //                                     <p class="mt-0 mb-0 text-dark-1 line-h-1">Free product</p>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </a> 
    //                 </ul>
    //         `,
    //         center: true,
    //         initShow: true,
    //         buttons: [
    //             {
    //                 text: 'Cancel',
    //                 class: 'btn btn-secondary btn-shadow',
    //                 handler: function(modal) {
    //                     modal.modal('hide');
    //                 }
    //             }
    //         ]
    //     });
    // })
});

