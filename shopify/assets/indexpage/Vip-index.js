$(document).ready(function() {
    $('#goodsUpload').diyUpload({url:'/api/upload/uploadimage'});
	$(".vip_coupon_tab").click(function(){
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
            url : "/api/vip/updatevipcouponstatus",
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

    $('.vip_coupon').on('click',function () {
        $(this).fireModal({
            title: 'Add VIP coupon',
            body: `
                <ul class="list-group">
                        <a href="/index/vip/rewardinfo/type/1.html" class="list-group-item list-group-item-model">
                            <div class="media">
                                <div class="mr-4 i-box">
                                    ${svg['fixedamount']}
                                </div>
                                <div class="media-body space-between">
                                    <div class="inline-block">
                                        <p class="mt-0 mb-0 text-dark-1 line-h-1">Amount discount</p>
                                        <p class="mt-0 mb-0 text-light line-h-1">Fixed amount of points</p>
                                    </div>
                                </div>
                            </div>
                        </a> 
                        <a href="/index/vip/rewardinfo/type/3.html" class="list-group-item list-group-item-model">
                            <div class="media">
                                <div class="mr-4 i-box">
                                    ${svg['percentage']}
                                </div>
                                <div class="media-body space-between" style="margin-top: 12px;">
                                    <div class="inline-block">
                                        <p class="mt-0 mb-0 text-dark-1 line-h-1">Percentage off</p>
                                    </div>
                                </div>
                            </div>
                        </a> 
                        <a href="/index/vip/rewardinfo/type/4.html" class="list-group-item list-group-item-model">
                            <div class="media">
                                <div class="mr-4 i-box">
                                    ${svg['freeshipping']}
                                </div>
                                <div class="media-body space-between" style="margin-top: 12px;">
                                    <div class="inline-block">
                                        <p class="mt-0 mb-0 text-dark-1 line-h-1">Free shipping</p>
                                    </div>
                                </div>
                            </div>
                        </a> 
                        
                    </ul>
            `,
            center: true,
            initShow: true,
            buttons: [
                {
                    text: 'Cancel',
                    class: 'btn btn-secondary btn-shadow',
                    handler: function(modal) {
                        modal.modal('hide');
                    }
                }
            ]
        });
    })
} );