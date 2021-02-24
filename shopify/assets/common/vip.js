$(document).ready(function () {	

	$(".vip_coupon").click(function(){
        if ($('.vip_coupon_cart .cart-item').length <= 0){
        	var that = $(this);
            showload()
            $.ymqajax({
                url : "/api/vipindex/getvipCoupon",
                data: {vipids:that.data('vipids'),now_level:now_level},
                success : function(result) {
                    if ($('.vip_coupon_cart .cart-item').length <= 0){
                        var pushHtml = '';
                        //var index = 0;
                        var border = 'border-top: 1px dashed #ccc;';
                        var that_i = '';
                        for(let i in result.data){
                            that_i = i;
                            // if (index > 0) {
                            // 	var border = 'border-top: 1px dashed #ccc;';
                            // }
                            //index++;
                            pushHtml += `
                            <div class="cart-title">
                                <h6 class="text-dark-1">${__('vip_coupons')}</h6>
                            </div>
                    		<div class="cart-item row" style="height: auto;margin-bottom: 0;padding-top: 10px;${border}">
				                <div class="col-2">
				                    ${$('.vip_icon_'+i).html()}
				                </div>
				                <div class="col-10 cart-item-center">
				                    <p class="earn-name" style="line-height:48px;">
				                    ${$('.vip_level_'+i).html()}
				                    </p>
				                </div>
				            </div>
                    	`;
                            result.data[i].forEach(function(item){
                                pushHtml += `
	                        <div class="cart-item row">
	                            <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
	                                ${svg[item.icon]}
	                            </div>
	                            <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center" style="padding-right:0;">`;
                                if(item.type == 1){
                                    pushHtml += `<p class="earn-name">${__('off_coupon',[shop_data.money_format+item.get])}</p>`;
                                }else if(item.type == 2){
                                    pushHtml += `<p class="earn-name">${__('order_discount')}</p>`;
                                }else if(item.type == 4){
                                    pushHtml += `<p class="earn-name">${__('free_shipping_coupon')}</p>`;
                                }
                                pushHtml += `<p class="earn-point">${__('can_be_claimed',[item.month])}</p>`;
                                pushHtml += `</div>
	                                    <div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">
	                        `;
                                if (now_level == that_i){
                                    if (item.can_convert) {
                                        if (item.needexplain){
                                            pushHtml += `
		                                        <span class="btn btn-primary btn-custome view" data-day="${item.day}" data-get="${item.get}" data-month="${item.month}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
		                                    `;
                                        }else{
                                            pushHtml += `
		                                <span class="btn btn-primary btn-custome redeem" data-day="${item.day}" data-get="${item.get}" data-id="${item.id}" data-type="${item.type}">${__('redeem')}</span>                                      
		                                `;
                                        }
                                    }else{
                                        pushHtml += `
                                            ${svg['finish']}
		                                `;
                                    }

                                }
                                pushHtml += `</div></div>`;
                            })
                        };
                        $('.vip_coupon_cart').append(pushHtml)

                        $(".progress-main-path").each(function () {
                            $(this).animate({
                                'stroke-dashoffset':$(this).data("stroke")
                            },1000);
                        })
                    }

                }
            });
        }
    })



	$(document).on('click', "#vip .view", function () {
        goback_arr.push('vip-coupon-content');
        showHidePage('.vip-coupon-content');
        $(".view-coupon-content").show();
        var pushHtml = `
            <div class="cart-item row">
                <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                    ${$(this).parent('.way_right').prev().prev().html()}
                </div>
                <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center">
                    ${$(this).parent('.way_right').prev().html()}
                </div>
            </div>
        `;
        pushHtml += `
            <div class="row row_text">
                <div class="col-12">`;
                if ($(this).data('min_amout') > 0) {
                   pushHtml += `<div>${__('coupon_more_then',[shop_data.money_format+$(this).data('min_amout')])}</div>`; 
                }
                if ($(this).data('type') == 4 && $(this).data('get') != 'all') {
                   pushHtml += `<div>${__('coupon_less_then',[shop_data.money_format+$(this).data('get')])}</div>`; 
                }
                if ($(this).data('applies_type') == 1) {
                    pushHtml += `<div>Reward can only be used on select product collections.</div>`;
                }else if($(this).data('applies_type') == 2){
                    pushHtml += `<div>${__('coupon_select_product')}</div>`;
                }   
                if ($(this).data('day') > 0) {
                   pushHtml += `<div>${__('coupon_day',[$(this).data('day')])}</div>`; 
                } 
        pushHtml += `
                </div>
            </div>
        `;
        
        pushHtml += `
            <div class="row" style="padding: 30px 20px 20px 20px;">
                <div class="col-12" style="margin:0 auto;">
                    <span style="height: 50px;line-height: 50px;font-size: 18px;width: 100%;" class="btn btn-primary btn-custome redeem" data-id="${$(this).data('id')}">${__('redeem')}</span>
                </div>
            </div>
        `;
        $('.view-coupon-content_cart').html(pushHtml);
        $(".in-top-content").animate({scrollTop:0},10);
        
    });

	$(document).on('click', "#vip .redeem", function () {
        $(this).addClass('btn-progress');
        var that = $(this);
        $.ymqajax({
            url : "/api/vipindex/convert",
            btn: that,
            data : {id:that.data('id')},
            success : function(result) {
                var data = result.data;
                showHidePage('.vip-coupon-content');
                $(".vip-giftdetail-content").show();      
                var pushHtml = creatgiftdetailhtml(data);
                $('.vip-giftdetail_cart').html(pushHtml);
                hideload();
                //$('.point-ways_to_redeem_cart .cart-item').remove()
                $(".in-top-content").animate({scrollTop:0},10);
            }
        });
    });
	$(".vip_convert_history").click(function(){
        if ($('.vip-giftlist_cart .cart-item').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/vipindex/getconvertlist",
                data:'',
                success : function(result) {
                    var pushHtml = `<div class="cart-title">
                <h6 class="text-dark-1">${__('your_rewards')}</h6>
            </div>`;
                    result.data.forEach(function (item) {
                        var used = '';
                        if (item.status == 2) {
                            used = 'coupon_used'
                        }
                        pushHtml += `
                        <div class="cart-item row ${used}">
                            <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                                ${svg[item.icon]}
                            </div>
                            <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center">`;
                        if(item.type == 1){
                            pushHtml += `<p class="earn-name" style="line-height:48px;">${__('off_coupon',[shop_data.money_format+item.get])}</p>`;
                        }else if(item.type == 3){
                            pushHtml += `<p class="earn-name" style="line-height:48px;">${__('off_coupon',[item.get+'%'])}</p>`;
                        }else if(item.type == 4){
                            pushHtml += `<p class="earn-name" style="line-height:48px;">${__('free_shipping_coupon')}</p>`;
                        }
                        pushHtml += `</div>
                                    <div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">
                        `;
                        pushHtml += `
                                <span class="btn btn-primary btn-custome gift-view" data-status="${item.status}" data-code="${item.code}" data-day="${item.day}" data-get="${item.get}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
                            `;
                        pushHtml += `</div></div>`;
                    });
                    $('.vip-giftlist_cart').append(pushHtml)
                }
            });
            
        }
    })


	$(document).on('click', "#vip .gift-view", function () {
        goback_arr.push('gift-view');
        $(".top-goback").data('back',".vip-giftlist-content");
        prev_page = '.vip-content';
        showHidePage('.vip-giftlist-content');
        $(".vip-giftdetail-content").show();      
        var pushHtml = creatgiftdetailhtml($(this).data());
        $('.vip-giftdetail_cart').html(pushHtml);
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