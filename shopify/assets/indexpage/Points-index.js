$(document).ready(function () {
    // $(".right-header").html('<img class="load" src="/svg/load-blue-44.svg">');
    $(".setting_save").click(function(){
        var that = $(this)
        that.addClass('btn-progress');
        if ($('.points_expiry').val()<0) {
            iziToast.show({
                message: 'The expiry must be greater than 0',
                position: 'bottomCenter' 
            });
            that.removeClass('btn-progress');
            return;
        }
        $.ymqajax({
            url: " /api/branding/setting",
            data: $('#settingForm').serialize(),
            success: function (res) {
                iziToast.show({
                    message: res.msg,
                    position: 'bottomCenter' 
                });
                that.removeClass('btn-progress');
            }
        });
    })

    $("#earn-btn").ajaxModal({
        center: true,
        title: 'Ways to earn',
        body: '<img class="load" src="/svg/load-blue-44.svg">',
        url: '/api/point/getdeletepointearn.html',
        ajaxSuccess: function(res,modal){
            if (res.code == 0) {
                modal.find('.modal-body').html('<img class="status-img" src="/svg/index/status.html?status=net-error">');
            }else if (res.code == 2){
                modal.find('.modal-body').html('<img class="status-img" src="/svg/index/status.html?status=no-data">');
            }else{
                var pushHtml = `<ul class="list-group">`;
                var data = res.data;
                data.forEach(function (item) {
                    var setting = JSON.parse(item['setting']);
                    pushHtml += `
                        <a href="/index/points/info/id/${item['id']}.html" class="list-group-item list-group-item-model">
                            <div class="media">
                                <div class="mr-4 i-box">
                                    ${svg[item['icon']]}
                                </div>
                                <div class="media-body space-between">
                                    <div class="inline-block">
                                        <p class="mt-0 mb-0 text-dark-1 line-h-1">${setting['name']}</p>
                                        <p class="mt-0 mb-0 text-light line-h-1">${data['points']}</p>
                                    </div>
                                </div>
                            </div>
                        </a> 
                    `;
                })


                pushHtml+= `</ul>`;
                modal.find('.modal-body').html(pushHtml);
            }
        },
        buttons: [
            {
                text: 'Cancel',
                class: 'btn btn-secondary btn-shadow',
                url: 'https://shopify.luckydn.top/api/signin/dosign.html',

                handler: function(modal) {
                    modal.modal('hide');
                }
            }
        ]
    });


    $(".ways_to_earn_tab").click(function(){
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
            url : "/api/point/updatepointearnstatus",
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
            url : "/api/point/updatepointredeemstatus",
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
    $('.ways_to_redeem').on('click',function () {
        $(this).fireModal({
            title: 'Ways to redeem',
            body: `
                <ul class="list-group">
                        <a href="/index/points/rewardinfo/type/1.html" class="list-group-item list-group-item-model">
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
                         <a href="/index/points/rewardinfo/type/2.html" class="list-group-item list-group-item-model">
                            <div class="media">
                                <div class="mr-4 i-box">
                                    ${svg['incrementsamount']}
                                </div>
                                <div class="media-body space-between">
                                    <div class="inline-block">
                                        <p class="mt-0 mb-0 text-dark-1 line-h-1">Amount discount</p>
                                        <p class="mt-0 mb-0 text-light line-h-1">Increments of points</p>
                                    </div>
                                </div>
                            </div>
                        </a> 
                        <a href="/index/points/rewardinfo/type/3.html" class="list-group-item list-group-item-model">
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
                        <a href="/index/points/rewardinfo/type/4.html" class="list-group-item list-group-item-model">
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
            // <a href="/index/points/rewardinfo/type/5.html" class="list-group-item list-group-item-model">
            //                 <div class="media">
            //                     <div class="mr-4 i-box">
            //                         <img width="30" src="/svg/index.html?icon=freeproduct&color=6777ef" alt="">
            //                     </div>
            //                     <div class="media-body space-between" style="margin-top: 12px;">
            //                         <div class="inline-block">
            //                             <p class="mt-0 mb-0 text-dark-1 line-h-1">Free product</p>
            //                         </div>
            //                     </div>
            //                 </div>
            //             </a>
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
});

