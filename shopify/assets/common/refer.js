$(document).ready(function () {
    $(document).on('click', "#ymq-refer", function () {
        if ($('.refer-content .ishas').length > 0){
            return false;
        }
        showload()
        $.ymqajax({
            url : "/api/referralindex/getlist",
            success : function(res) {
                var pushHtml = `<div class="card card-title"><div class="cart-title">
                    <h6 class="text-dark-1">${__('referral_history')}</h6>
                </div></div>`;
                pushHtml += creatreferlisthtml(res.data);
                $('.refer-content').append(pushHtml);
            }
        });
    });

    //邀请弹出兑换优惠券
    $(document).on('click', ".refer_email_submit", function () {
        if (!checkemail($('.refer_email').val())) {
            iziToast.show({
              message: __('pelese_fill_correct_email_address'),
              position: 'topCenter'
            });
            $(".refer_email").focus();
            return;
        }
        $(this).addClass('btn-progress');
        var that = $(this);
        $.ymqajax({
            url : "/api/referralindex/accept",
            btn:that,
            data : {referral_link:$('.referral_link').val(),refer_email:$('.refer_email').val(),refer_name:$('.refer_name').val()},
            success : function(result) {
                if (result.msg == 'has') {
                    iziToast.show({
                      message: __('has_unused_coupons'),
                      position: 'bottomCenter'
                    });
                    return false;
                }
                if (result.msg == 'no_reward') {
                    iziToast.show({
                      message: __('no_rewards_to_receive'),
                      position: 'bottomCenter'
                    });
                    return false;
                }
                if (result.msg == 'sign') {
                    iziToast.show({
                      message: __('already_registered'),
                      position: 'bottomCenter'
                    });
                    return false;
                }
                // var data = result.data;
                // showHidePage('.com-redeem-content');
                // $(".com-giftdetail-content").show();
                // var pushHtml = creatgiftdetailhtml(data);
                // $('.giftdetail_cart').html(pushHtml);
                // $(".in-top-content").animate({scrollTop:0},10);
                $('.top-goback').trigger('click')
                iziToast.show({
                  message: __('has_sent_to_your_email'),
                  position: 'bottomCenter'
                });
            }
        });
    });
    function creatreferlisthtml(data){
        var pushHtml = ``;
        for(var i in data){
            var item = data[i]
            pushHtml += `
                <div class="card ishas">
                    <div class="row point-item">
                    <div class="col-6">
                        <span class="point">${item.b_first_name}</span><br>
                        <span class="expirationtime">Completed</span>
                    </div>
                    <div class="col-6 align-self-center text-right" style="padding-left:0;">
                        <span class="point">${shop_data.money_format} ${item.spent}</span><br>
                        <span class="expirationtime">${setDate(item.createtime)}</span>
                    </div>
                    </div>`;
            if (item.hasOwnProperty('coupon')) {
                for(var index in item['coupon']){
                    var items = item['coupon'][index];
                    var used = '';
                    if (items.status == 2) {
                        used = 'coupon_used'
                    }
                    pushHtml += `
                    <div class="cart-item row ${used}">
                        <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                            ${svg[items.icon]}
                        </div>
                        <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center" style="padding:0;">`;
                    if(items.type == 1){
                        pushHtml += `<p class="earn-name" style="line-height:48px;">${__('off_coupon',[shop_data.money_format+items.get])}</p>`;
                    }else if(items.type == 3){
                        pushHtml += `<p class="earn-name" style="line-height:48px;">${__('off_coupon',[items.get+'%'])}</p>`;
                    }else if(items.type == 4){
                        pushHtml += `<p class="earn-name" style="line-height:48px;">${__('free_shipping_coupon')}</p>`;
                    }
                    pushHtml += `</div>
                                <div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">
                    `;
                    pushHtml += `
                            <span class="btn btn-primary btn-custome gift-view" data-status="${items.status}" data-code="${items.code}" data-day="${items.day}" data-get="${items.get}" data-min_amout="${items.min_amout}" data-id="${items.id}" data-type="${items.type}" data-icon="${items.icon}" data-applies_type="${items.applies_type}">${__('view')}</span>                                      
                        `;
                    pushHtml += `</div></div>`;
                }
            }    
            pushHtml += `
                </div>
            `;
         
        }
        return pushHtml;
    }

    $(document).on('click', "#refer .gift-view", function () {
        goback_arr.push('gift-view');
        showHidePage('.refer-giftlist-content');
        $(".refer-giftdetail-content").show();      
        var pushHtml = creatgiftdetailhtml($(this).data());
        $('.refer-giftdetail_cart').html(pushHtml);
        hideload()
        $(".in-top-content").animate({scrollTop:0},10);
        
    });

    function creatgiftdetailhtml(data){
        var pushHtml = `
            <div class="cart-item row">
                <div class="col-2">
                    ${svg[data.icon]}
                </div>
                <div class="col-10 cart-item-center">`;
                if(data.type == 1){
                    pushHtml += `<p class="earn-name" style="line-height: 48px;">${__('off_coupon',[shop_data.money_format+data.get])}</p>`;
                }else if(data.type == 3){
                    pushHtml += `<p class="earn-name" style="line-height: 48px;">${__('off_coupon',[data.get+'%'])}</p>`;
                }else if(data.type == 4){
                    pushHtml += `<p class="earn-name" style="line-height: 48px;">${__('free_shipping_coupon')}</p>`;
                }
        pushHtml +=    
                `</div>
            </div>
        `;
        pushHtml += `
            <div class="row row_text">
                <div class="col-12 text-center">
                ${__('use_discount')}
                </div>
            </div>
            <div class="cart-item row">
                <div class="col-12">
                    <div class="form-group">
                      <div class="input-group">
                        <input type="text" class="form-control copy_input" readonly data-indicator="pwindicator" value="${data.code}">
                        <div class="input-group-prepend">
                          <div class="input-group-text copy_code">
                            <svg t="1601043413182" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1192" width="32" height="32"><path d="M263.2 761.3H145.4c-45.5 0-82.5-37-82.5-82.5V150.6c0-45.5 37-82.5 82.5-82.5h488.9c45.5 0 82.5 37 82.5 82.5v70.1c0 11-9 20-20 20s-20-9-20-20v-70.1c0-23.4-19-42.5-42.5-42.5H145.4c-23.4 0-42.5 19-42.5 42.5v528.3c0 23.4 19 42.5 42.5 42.5h117.8c11 0 20 9 20 20s-8.9 19.9-20 19.9z" fill="#1C1C1C" p-id="1193"></path><path d="M897.2 971.1H400.9c-42.5 0-77.2-34.6-77.2-77.2V358.4c0-42.5 34.6-77.2 77.2-77.2h496.4c42.5 0 77.2 34.6 77.2 77.2V894c-0.1 42.5-34.7 77.1-77.3 77.1zM400.9 321.2c-20.5 0-37.2 16.7-37.2 37.2V894c0 20.5 16.7 37.2 37.2 37.2h496.4c20.5 0 37.2-16.7 37.2-37.2V358.4c0-20.5-16.7-37.2-37.2-37.2H400.9z" fill="#1C1C1C" p-id="1194"></path></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        `;
        pushHtml += `
            <div class="row row_text">
                <div class="col-12">`;
                if (data.min_amout > 0) {
                   pushHtml += `<div>${__('coupon_more_then',[shop_data.money_format+data.min_amout])}</div>`; 
                }
                if (data.type == 4 && data.get != 'all') {
                   pushHtml += `<div>${__('coupon_less_then',[shop_data.money_format+data.get])}</div>`; 
                }
                if (data.applies_type == 1) {
                    pushHtml += `<div>Reward can only be used on select product collections.</div>`;
                }else if(data.applies_type == 2){
                    pushHtml += `<div>${__('coupon_select_product')}</div>`;
                }   
                if (data.day > 0) {
                   pushHtml += `<div>${__('coupon_day',[data.day])}</div>`; 
                } 
        pushHtml += `
                </div>
            </div>
        `;
        if (data.status != 2) {
            pushHtml += `
                <div class="row row_text" style="padding: 30px 20px 20px 20px;">
                    <div class="col-12" style="margin:0 auto;">
                        <span style="height: 50px;line-height: 50px;font-size: 18px;width: 100%;" class="btn btn-primary btn-custome apply_code" data-code="${data.code}">${__('apply_code')}</span>
                    </div>
                </div>
            `;
        }
        return pushHtml;
    }
})
