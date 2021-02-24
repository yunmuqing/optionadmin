$(document).ready(function () {
   
    var  nowScorrle = '';
    var page;
    var IsHas;

    var accessPage = 0;
    var accessIsHas = true;

    var spendingPage = 0;
    var spendingIsHas = true;

    var can_scroll = false;
    $(".top-goback").click(function(){
        can_scroll = false;
    })
    $(".com-tab-access").click(function(){
        nowScorrle = 1;
        page = accessPage;
        if ($('.com-access-content .ishas').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/commissionsindexapi/commissionsgetlist",
                dosuccess:true,
                data : {page:page},
                success : function(result) {
                    if ($('.com-access-content .ishas').length <= 0){
                        if (result.code == 201) {
                            accessIsHas = false;
                            IsHas = false;
                            return false;
                        }
                        var pushHtml = `
                            <div class="card card-title">
                                <div class="cart-title">
                                    <h6 class="text-dark-1">${__('access_records')}</h6>
                                </div>
                            </div>
                        `;
                        pushHtml += creataccesshtml(result);
                        if (Object.keys(result.data).length < per_page_num) {
                            accessIsHas = false;
                            IsHas = false;
                        }
                        accessPage += 1;
                        page += 1;

                        $('.com-access-content').append(pushHtml);

                        setTimeout(function(){
                            can_scroll = true;
                            IsHas = accessIsHas;
                        },1000);
                    }

                }
            });
        }else{
            setTimeout(function(){
                can_scroll = true;
                IsHas = accessIsHas;
            },1000);
        }
    })

    $(".com-tab-spending").click(function(){
        nowScorrle = 0;
        page = spendingPage;
        if ($('.com-spending-content .ishas').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/commissionsindexapi/commissionsuselist",
                dosuccess:true,
                data : {page:page},
                success : function(result) {
                    if ($('.com-spending-content .ishas').length <= 0){
                        if (result.code == 201) {
                            spendingIsHas = false;
                            IsHas = false;
                            return false;
                        }
                        var pushHtml = `
                            <div class="card card-title">
                                <div class="cart-title">
                                    <h6 class="text-dark-1">${__('redeem_record')}</h6>
                                </div>
                            </div>
                        `;
                        pushHtml += creatspendinghtml(result);
                        if (Object.keys(result.data).length < per_page_num) {
                            spendingIsHas = false;
                            IsHas = false;
                        }
                        spendingPage += 1;
                        page += 1;
                        $('.com-spending-content').append(pushHtml);
                        setTimeout(function(){
                            can_scroll = true;
                            IsHas = spendingIsHas;
                        },1000);
                    }

                }
            });
        }else{
            setTimeout(function(){
                can_scroll = true;
                IsHas = spendingIsHas;
            },1000);
        }

    })

    

    $(".com-ways_to_earn").click(function(){
        
    })

    $(".com-ways_to_redeem").click(function(){
        if ($('.com-ways_to_redeem_cart .cart-item').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/commissionsindexapi/getwaytoredeemlist",
                success : function(result) {
                    if ($('.com-ways_to_redeem_cart .cart-item').length <= 0){
                        var pushHtml = `<div class="cart-title">
                            <h6 class="text-dark-1">${__('ways_to_redeem')}</h6>
                        </div>`;
                        result.data.forEach(function (item) {
                            var add_withdrawal = '';
                            if (!$.isEmptyObject(level_info) && item.id == 1) {
                                if (level_info['withdrawal_rate'] > 0) {
                                    var add_withdrawal = level_info['withdrawal_rate'];
                                }
                            }
                            pushHtml += `
                        <div class="cart-item row">
                            <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                                ${svg[item.icon]}
                            </div>
                            <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center" style="padding-right: 0;padding-left: 5px;">`;
                            if(item.type == 1){
                                pushHtml += `<p class="earn-name">${__('money')}</p>`;
                            }else if(item.type == 2){
                                pushHtml += `<p class="earn-name">${__('gift_card')}</p>`;
                            }
                            if(item.type == 1){
                                if (customeinfo != null && customeinfo.commission_withdrawal_percent > 0) {
                                    pushHtml += `<p class="earn-point">100 ${__('commissions')} = ${shop_data.money_format+customeinfo.commission_withdrawal_percent}</p>`;
                                }else{
                                    pushHtml += `<p class="earn-point">100 ${__('commissions')} = ${shop_data.money_format+item.get}+${add_withdrawal}</p>`;
                                }
                            }else if(item.type == 2){
                                pushHtml += `<p class="earn-point">${item.commissions} ${__('commissions')} = ${shop_data.money_format+item.get}</p>`;
                            }else{
                                pushHtml += `<p class="earn-point">${item.commissions} ${__('commissions')} = ${shop_data.money_format+item.get}</p>`;
                            }
                            pushHtml += `</div>
                                    <div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">
                        `;
                            if ((item.type == 2 || item.type == 1) && item.setting.min != '') {
                                var need_commissions = item.setting.min;
                            }else{
                                var need_commissions = item.commissions;
                            }
                            if (customeinfo != null){
                                if (need_commissions <= availableCommissions){
                                    if (item.type == 2) {
                                        pushHtml += `
                                        <span class="btn btn-primary btn-custome view" data-min="${item.setting.min}" data-max="${item.setting.max}" data-get="${item.get}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" >${__('view')}</span>                                      
                                    `;
                                    }else if(item.type == 1){
                                        if (customeinfo.commission_withdrawal_percent > 0) {
                                            pushHtml += `
                                        <span class="btn btn-primary btn-custome view" data-min="${item.setting.min}" data-max="${item.setting.max}" data-get="${customeinfo.commission_withdrawal_percent}" data-commissions="${item.commissions}"  data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" >${__('view')}</span>                                      
                                        `;
                                        }else{
                                            pushHtml += `
                                        <span class="btn btn-primary btn-custome view" data-min="${item.setting.min}" data-max="${item.setting.max}" data-get="${Number(item.get)+Number(add_withdrawal)}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" >${__('view')}</span>                                      
                                        `;
                                        }

                                    }
                                    else{
                                        pushHtml += `
                                        <span class="btn btn-primary btn-custome view" data-get="${item.get}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" >${__('view')}</span>                                      
                                    `;
                                    }
                                }else{
                                    pushHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21"><g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-width="2" transform="translate(1 1)"><path class="progress-base-path" d="M4.86111111,18.3333333 C1.09026555,16.030889 -0.68888696,11.5012932 0.50697284,7.2480068 C1.70283264,2.99472037 5.58179605,0.055968107 10,0.055968107 C14.418204,0.055968107 18.2971673,2.99472037 19.4930271,7.2480068 C20.688887,11.5012932 18.9097344,16.030889 15.1388889,18.3333333"></path><path class="progress-main-path" stroke="#6568FE" d="M4.86111111,18.3333333 C1.09026555,16.030889 -0.68888696,11.5012932 0.50697284,7.2480068 C1.70283264,2.99472037 5.58179605,0.055968107 10,0.055968107 C14.418204,0.055968107 18.2971673,2.99472037 19.4930271,7.2480068 C20.688887,11.5012932 18.9097344,16.030889 15.1388889,18.3333333" style="stroke-dasharray: 51.1503, 51.1503; stroke-dashoffset: 50;" data-stroke="${50*(need_commissions-availableCommissions)/need_commissions}"></path></g></svg>`;
                                }

                            }
                            pushHtml += `</div></div>`;
                        });
                        $('.com-ways_to_redeem_cart').append(pushHtml);
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


    var scrollUrl = '';
    $(".in-top-content").scroll(function(){
      if ($("body").height() - $(".ymqloading").offset().top > -90 && can_scroll && IsHas) {
        can_scroll = false;
        showload()
        if (nowScorrle) {
            scrollUrl = '/api/commissionsindexapi/commissionsgetlist';
        }else{
            scrollUrl = '/api/commissionsindexapi/commissionsuselist';
        }
        $.ymqajax({
            url : scrollUrl,
            dosuccess:true,
            data : {page:page},
            success : function(result) {
                if (result.code == 201) {
                    if (nowScorrle) {
                        accessIsHas = false;
                    }else{
                        spendingIsHas = false;
                    }
                    IsHas = false;
                    return false;
                }
                var html = '';
                if (nowScorrle) {
                    var html = creataccesshtml(result)
                }else{
                    var html = creatspendinghtml(result)
                }
                if (Object.keys(result.data).length < 10) {
                    if (nowScorrle) {
                        accessIsHas = false;
                    }else{
                        spendingIsHas = false;
                    }
                    IsHas = false;
                    hideload()
                }else{
                    hideload()
                }

                if (nowScorrle) {
                    $(".com-access-content").append(html);
                    accessPage += 1;
                }else{
                    $(".com-spending-content").append(html);
                    spendingPage += 1;
                }
                page += 1;
                
                can_scroll = true;
            },
            error : function(result){
                hideload()
            }
        });
      }
    });

    $(document).on('click', "#commissions .view", function () {
        goback_arr.push('com-view-content');
        showHidePage('.com-redeem-content');
        $(".com-view-content").show();
        var pushHtml = `
            <div class="cart-item row">
                <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                    ${$(this).parent('.way_right').prev().prev().html()}
                </div>
                <div class="col-8 col-md-8 col-lg-8 col-sm-8 col-xs-8 cart-item-center">
                    ${$(this).parent('.way_right').prev().html()}
                </div>
            </div>
        `;
        if ($(this).data('type') == 1) {
            var get_max = availableCommissions;
            if ($(this).data('min') != '') {
                if ($(this).data('min') > $(this).data('commissions')) {
                    var get_min = $(this).data('min');
                }else{
                    var get_min = $(this).data('commissions');
                }
            }else{
                var get_min = $(this).data('commissions');
            }
            pushHtml += `
                <div class="row row_text">
                    <div class="col-12">
                        <div class="form-group">
                          <div style="margin: 20px 0;text-align:center;"><span class="d_commissions" data-commissions="${get_min}">${get_min}</span> ${__('commissions')} = ${shop_data.money_format}<span class="d_get" data-get="${$(this).data('get')}">${$(this).data('get')*(get_min/100)}</span></div>
                          <input class="form-control redeem_range1 redeem_range" type="range" min="${get_min}" max="${get_max}" aria-label="commissions to redeem" value="${get_min}">
                        </div>
                    </div>
                </div>
                <div class="row row_text">
                    <div class="col-12">
                        <div class="form-group">
                          <div style="margin: 5px 0;"><span>Paypal email</span></div>
                          <input class="form-control paypal_email" type="text" name="paypal_email">
                        </div>
                    </div>
                </div>
            `;
        }else if($(this).data('type') == 2){
            if ($(this).data('max') != '' && $(this).data('max') < availableCommissions) {
                var get_max = $(this).data('max');
            }else{
                var get_max = availableCommissions;
            }
            if ($(this).data('min') != '') {
                if ($(this).data('min') > $(this).data('commissions')) {
                    var get_min = $(this).data('min');
                }else{
                    var get_min = $(this).data('commissions');
                }
            }else{
                var get_min = $(this).data('commissions');
            }
            pushHtml += `
                <div class="row row_text">
                    <div class="col-12">
                        <div class="form-group">
                          <div style="margin: 20px 0;text-align:center;"><span class="d_commissions" data-commissions="${get_min}">${get_min}</span> ${__('commissions')} = ${__('off_coupon',[shop_data.money_format+'<span class="d_get" data-get="'+$(this).data('get')+'">'+$(this).data('get')+'</span> '])}</div>
                          <input class="form-control redeem_range2 redeem_range" type="range" min="${get_min}" max="${get_max}" step="${$(this).data('commissions')}" aria-label="commissions to redeem" value="${get_min}">
                        </div>
                    </div>
                </div>
            `;
        }
        pushHtml += `
            <div class="row" style="padding: 30px 20px 20px 20px;">
                <div class="col-12" style="margin:0 auto;">
                    <span style="height: 50px;line-height: 40px;font-size: 18px;width: 100%;" class="btn btn-primary btn-custome redeem" data-id="${$(this).data('id')}">${__('redeem')}</span>
                </div>
            </div>
        `;
        $('.view_cart').html(pushHtml);
        
        $(".in-top-content").animate({scrollTop:0},10);
    });

    $(document).on('input propertychange', ".redeem_range1", function () {
        var persent = 100*($(this).val()-$(this).attr('min'))/($(this).attr('max')-$(this).attr('min'))
        console.log(persent)
        $(this).css('background-size',persent+'% 100%')
        
        $('.d_commissions').text($(this).val());
        $('.d_get').text($('.d_get').data('get')*$(this).val()/100);
    });
    $(document).on('input propertychange', ".redeem_range2", function () {
        var persent = 100*($(this).val()-$(this).attr('min'))/($(this).attr('max')-$(this).attr('min'))
        console.log(persent)
        $(this).css('background-size',persent+'% 100%')
        
        $('.d_commissions').text($(this).val());
        $('.d_get').text($('.d_get').data('get')*$(this).val()/$('.d_commissions').data('commissions'));
    });
    
    $(document).on('click', "#commissions .redeem", function () {
        if ($('.paypal_email').length > 0 && !checkemail($('.paypal_email').val())) {
            iziToast.error({
              message: __('pelese_fill_correct_paypal_account'),
              position: 'topCenter'
            });
            $(".paypal_email").focus();
            return;
        }
        $(this).addClass('btn-progress');
        var that = $(this);
        $.ymqajax({
            url : "/api/commissionsindexapi/convert",
            btn: that,
            data : {id:that.data('id'),commissions:$('.redeem_range').val(),paypal_email:$('.paypal_email').val()},
            success : function(result) {
                var data = result.data;
                showHidePage('.com-redeem-content');
                $(".com-giftdetail-content").show();      
                var pushHtml = creatgiftdetailhtml(data);
                $('.com-giftdetail_cart').html(pushHtml);
                $('.com-ways_to_redeem_cart .cart-item').remove()
                $('.com-ways_to_redeem_cart .cart-title').remove()
                $(".in-top-content").animate({scrollTop:0},10);
                changeCommissions(data.commissions)
                if (goback_arr.includes('com-view-content')) {
                   goback_arr.pop();  
                }
                //回显
                if ($('.com_convert_count').text() == '0') {
                    $('.com_convert_tab').addClass('ymq-tab-2 com-giftlist-tab');
                    $('.com_convert_more').show();
                }
                $('.com_convert_count').text(Number($('.com_convert_count').text())+1);
                //如果有数据就回显
                if ($('.com-giftlist_cart .cart-item').length > 0){
                    var giftData = [];
                    giftData.push(result.data);
                    pushHtml = creatGiftListHtml(giftData);
                    $('.com-giftlist_cart .cart-title').after(pushHtml);
                }
            }
        });
    });

    $(document).on('click', ".com-giftlist-tab", function () {
        if ($('.com-giftlist_cart .cart-item').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/commissionsindexapi/getconvertlist",
                success : function(result) {
                    if ($('.com-giftlist_cart .cart-item').length <= 0){
                        var pushHtml = `
                            <div class="cart-title">
                                <h6 class="text-dark-1">${__('your_rewards')}</h6>
                            </div>
                        `;
                        pushHtml += creatGiftListHtml(result.data);
                        $('.com-giftlist_cart').append(pushHtml);
                    }
                }
            });
        }
    })

    $(document).on('click', "#commissions .gift-view", function () {
        goback_arr.push('gift-view');
        $(".top-goback").data('back',".com-giftlist-content");
        prev_page = '.commissions-content';
        showHidePage('.com-giftlist-content');
        $(".com-giftdetail-content").show();      
        var pushHtml = creatgiftdetailhtml($(this).data());
        $('.com-giftdetail_cart').html(pushHtml);
        hideload()
        
        $(".in-top-content").animate({scrollTop:0},10);
    });

    function changeCommissions(commissions = 0) {
        var nowCommissions = availableCommissions;
        availableCommissions = availableCommissions - commissions;
        $('.home_commission').text($('.home_commission').text().replace(nowCommissions,availableCommissions))
        $('#ymq-commission').data('header_detail',availableCommissions);
        $('.header_detail').html(availableCommissions)
    }

    function creatGiftListHtml(data){
        var pushHtml = ``;
        data.forEach(function (item) {
        pushHtml += `
        <div class="cart-item row">
            <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                ${svg[item.icon]}
            </div>
            <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center" style="padding-right: 0;padding-left: 5px;">`;
            if(item.type == 1){
                if (item.status == 0) {
                    var shenghe = __('pending');
                }else if(item.status == 1){
                    var shenghe = __('approved');
                }else if(item.status == 2){
                    var shenghe = __('not_approved');
                }
                pushHtml += `<p class="earn-name">${shop_data.money_format+item.get} <span class="shenghe">(${shenghe})</span</p>`;
            }else if(item.type == 2){
                pushHtml += `<p class="earn-name">${shop_data.money_format+item.get} ${__('gift_card')}</p>`;
            }
            pushHtml += `<p class="earn-point">${__('spent')} ${item.commissions} ${__('commissions')}</p>`;
            pushHtml += `</div>
                    <div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">
        `;
            // if ((item.type == 2 || item.type == 1) && item.setting.min != '') {
            //     var need_commissions = item.setting.min;
            // }else{
            //     var need_commissions = item.commissions;
            // }
            if (item.type == 2) {
                pushHtml += `
                <span class="btn btn-primary btn-custome gift-view" data-status="${item.status}" data-code="${item.code}"  data-get="${item.get}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" >${__('view')}</span>                                      
            `;
            }else if(item.type == 1){
                if (item.status == 0) {
                    pushHtml += `
                    <span class="gift-view" data-get="${item.get}" data-status="${item.status}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}">
                    ${svg['pending']}
                    </span>                                      
                `;
                }else if(item.status == 1){
                    pushHtml += `
                    <span class="gift-view" data-get="${item.get}" data-status="${item.status}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}">
                    ${svg['approved']}
                    </span>                                      
                `;
                }else if(item.status == 2){
                    pushHtml += `
                    <span class="gift-view" data-get="${item.get}" data-status="${item.status}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}">
                    ${svg['not_approved']}
                    </span>                                      
                `;
                }
            }
            pushHtml += `</div></div>`;
        });
        return pushHtml;
    }

    function creatgiftdetailhtml(data){
        var pushHtml = `
            <div class="cart-item row">
                <div class="col-2">
                    ${svg[data.icon]}
                </div>
                <div class="col-8 cart-item-center">`;
                var shenghe = '';
                if(data.type == 1){
                    if (data.status == 0) {
                        shenghe = __('pending');
                    }else if(data.status == 1){
                        shenghe = __('approved');
                    }else if(data.status == 2){
                        shenghe = __('not_approved');
                    }
                    pushHtml += `<p class="earn-name">${shop_data.money_format+data.get} ${__('money')} ${shenghe}</p>`;
                }else if(data.type == 2){
                    pushHtml += `<p class="earn-name">${shop_data.money_format+data.get} ${__('gift_card')}</p>`;
                }
                pushHtml += `<p class="earn-point">Spent ${data.commissions} ${__('commissions')}</p>`;
        pushHtml +=    
                `</div>
                <div class="col-2 cart-item-center">`;
                if(data.type == 1){
                    if (data.status == 0) {
                        var withdrawal_tip = __('waiting_review');
                        pushHtml += `<span>${svg['pending']}</span>`;
                    }else if(data.status == 1){
                        var withdrawal_tip = __('withdrawal_approved');
                        pushHtml += `<span>${svg['approved']}</span>`;
                    }else if(data.status == 2){
                        var withdrawal_tip = __('withdrawal_rejected');
                        pushHtml += `<span>${svg['not_approved']}</span>`;
                    }
                }
        pushHtml += `
                </div>
            </div>`;
        if(data.type == 1){

            pushHtml += `<div class="row row_text">
                            <div class="col-12">
                            ${withdrawal_tip}
                            </div>
                        </div>`;
        }
        if (data.type == 2) {
            if (data.status == 0) {
                var gift_tip = __('creat_gift_soon');
            }else if(data.status == 1){
                var gift_tip = __('gift_success');
            }else if(data.status == 2){
                var gift_tip = __('gift_rejected');
            }
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
                <div class="row row_text">
                    <div class="col-12">
                    ${gift_tip}
                    </div>
                </div>
            `;
        }
        return pushHtml;
    }


    function creataccesshtml(result){
        var pushHtml = '';
        if(result.code == 1){
            result.data.forEach(function (item) {
                if (item.reward_matter == 100) {
                    var get_text = item.description;
                }else if(item.reward_matter == 50){
                    var get_text = __('return_commission');
                }else{
                    var get_text = __('your_recommended_users_place_orders');
                }
                pushHtml += `
                    <div class="card small-cart-item ishas">
                        <div class="row point-item">
                        <div class="col-6 col-sm-6">
                        	<span class="reward_matter">${get_text}</span><br/>
                        </div>
                        <div class="col-6 col-sm-6 align-self-center text-right">
                            <span class="point">+${item.commissions} ${__('commissions')}</span><br>
                            <span class="expirationtime">${setDate(item.createtime)}</span>
                        </div>
                        </div>
                    </div>
                `;
            });
        }else{
            accessIsHas = false;
            IsHas = false;
        }
        return pushHtml;
    }

    function creatspendinghtml(result){
        var pushHtml = '';
        if(result.code == 1){
            result.data.forEach(function (item) {
                pushHtml += `
                    <div class="card small-cart-item ishas">
                        <div class="row point-item">
                        <div class="col-6">`;
                        if (item.reward_matter == 1){
                            pushHtml += `<span class="reward_matter">${__('commissions_spent_on',[shop_data.money_format+item.get])}</span><br/>`;
                        }else if(item.reward_matter == 2){
                            pushHtml += `<span class="reward_matter">${__('commissions_spent_on',[shop_data.money_format+item.get+' '+__('gift_card')])}</span><br/>`;
                        }else if(item.reward_matter == 3){
                            pushHtml += `<span class="reward_matter">${__('commissions_spent_on',[__('free_product')])}</span><br/>`;
                        }else if(item.reward_matter == 60){
                            pushHtml += `<span class="reward_matter">${__('audit_commission_deduction')}</span><br/>`;
                        }else if(item.reward_matter == 100){
                            pushHtml += `<span class="reward_matter">${item.description}</span><br/>`;
                        }else if(item.reward_matter == 300){
                            pushHtml += `<span class="reward_matter">${__('cancel_order_referrals')}</span><br/>`;
                        }
                    pushHtml += `
                            
                        </div>
                        <div class="col-6 align-self-center text-right" style="padding-left:0;">
                            <span class="point">-${item.commissions} ${__('commissions')}</span><br>
                            <span class="expirationtime">${setDate(item.createtime)}</span>
                        </div>
                        </div>
                    </div>
                `;
            });
        }else{
            spendingIsHas = false;
            IsHas = false;
        }
        return pushHtml;
    }

    $(document).on('click', "#commissions .copy_code", function () {
        $('.copy_input').select();
        document.execCommand("Copy");
        $(this).html(`<svg t="1601084112227" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5703" width="32" height="32"><path d="M896 512a384 384 0 1 0-384 384 384 384 0 0 0 384-384z m64 0A448 448 0 1 1 512 64a448 448 0 0 1 448 448z" p-id="5704" fill="#515151"></path><path d="M682.24 360.64a32 32 0 0 1 43.52 46.72l-277.44 256a32 32 0 0 1-43.52 0l-138.56-128a32 32 0 0 1 43.52-46.72l116.8 107.84z" p-id="5705" fill="#515151"></path></svg>`)
        setTimeout(function(){
            $('.copy_code').html(`<svg t="1601043413182" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1192" width="32" height="32"><path d="M263.2 761.3H145.4c-45.5 0-82.5-37-82.5-82.5V150.6c0-45.5 37-82.5 82.5-82.5h488.9c45.5 0 82.5 37 82.5 82.5v70.1c0 11-9 20-20 20s-20-9-20-20v-70.1c0-23.4-19-42.5-42.5-42.5H145.4c-23.4 0-42.5 19-42.5 42.5v528.3c0 23.4 19 42.5 42.5 42.5h117.8c11 0 20 9 20 20s-8.9 19.9-20 19.9z" fill="#1C1C1C" p-id="1193"></path><path d="M897.2 971.1H400.9c-42.5 0-77.2-34.6-77.2-77.2V358.4c0-42.5 34.6-77.2 77.2-77.2h496.4c42.5 0 77.2 34.6 77.2 77.2V894c-0.1 42.5-34.7 77.1-77.3 77.1zM400.9 321.2c-20.5 0-37.2 16.7-37.2 37.2V894c0 20.5 16.7 37.2 37.2 37.2h496.4c20.5 0 37.2-16.7 37.2-37.2V358.4c0-20.5-16.7-37.2-37.2-37.2H400.9z" fill="#1C1C1C" p-id="1194"></path></svg>`)
        },1000);
    })

})

