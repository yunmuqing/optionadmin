$(document).ready(function () {
    //point滚动加载用:开始
    var nowScorrle = '';
    var page;
    var IsHas;
    var accessPage = 0;
    var accessIsHas = true;
    var spendingPage = 0;
    var spendingIsHas = true;
    var can_scroll = false;
    //point滚动加载用:结束
    $(".top-goback").click(function(){
        can_scroll = false;
    })
    if (customeinfo != null) {
        if (customeinfo.birthday != '') {
            $(".month_select").find("option").attr("disabled",true);
            $(".date_select").find("option").attr("disabled",true);
            $(".month_select").find("option").eq(0).attr("selected",false);
            $(".date_select").find("option").eq(0).attr("selected",false);
            var birthday_arr = customeinfo.birthday.split('/');
            $(".month_select").find("option").eq(birthday_arr[0]-1).attr("disabled",false);
            $(".date_select").find("option").eq(birthday_arr[1]-1).attr("disabled",false);
            $(".month_select").find("option").eq(birthday_arr[0]-1).attr("selected",true);
            $(".date_select").find("option").eq(birthday_arr[1]-1).attr("selected",true);
        }
    }
    
    $('.month_select_box').selectFilter({
        callBack : function (val){
            var smallMonth = [4,6,9,11];
            if ($.inArray(val, smallMonth) >= 0) {
                $('.date_select').next().find('li').eq(30).addClass('filter-disabled')
                if ($('.date_day_show').text() == 31) {
                    $('.date_select').next().find('li:first').click()
                    $('.date_select').next().hide()
                }
            }
            if (val == 2) {
                $('.date_select').next().find('li').eq(28).addClass('filter-disabled')
                $('.date_select').next().find('li').eq(29).addClass('filter-disabled')
                $('.date_select').next().find('li').eq(30).addClass('filter-disabled')
                if ($('.date_day_show').text() > 28) {
                    $('.date_select').next().find('li:first').click()
                    $('.date_select').next().hide()
                }
            }
        }
    });
    $('.date_select_box').selectFilter({
        callBack : function (val){
            console.log(val)
        }
    });
    $('.save_date').click(function(){
        $(this).addClass('btn-progress');
        var that = $(this);
        $.ymqajax({
            url : "/api/pointindex/setbirthday",
            iziToastType: 'success',
            data : {month:$('.date_month_show').text(),day:$('.date_day_show').text()},
            success : function(result) {
                $('.cart-point-box,.cart-point-box .doclose').click()
                that.removeClass('btn-progress');
                that.hide()
            },
            error : function(result){
                that.removeClass('btn-progress');
            }
        });

    });
    $(document).on('click', ".filter-disabled", function () {
        return false;
    });
    $(".point-tab-access").click(function(){
        nowScorrle = 1;
        page = accessPage;
        if ($('.point-access-content .ishas').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/pointindex/pointgetlist",
                dosuccess:true,
                data : {page:page},
                success : function(result) {
                    if ($('.point-access-content .ishas').length <= 0){
                        if (Object.keys(result.data).length > 0) {
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
                            $('.point-access-content').append(pushHtml);
                            setTimeout(function(){
                                can_scroll = true;
                                IsHas = accessIsHas;
                            },1000);
                        }
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



    $(".point-tab-spending").click(function(){
        nowScorrle = 0;
        page = spendingPage;
        if ($('.point-spending-content .ishas').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/pointindex/pointuselist",
                dosuccess:true,
                data : {page:page},
                success : function(result) {
                    if ($('.point-spending-content .ishas').length <= 0){
                        if (Object.keys(result.data).length > 0) {
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

                            $('.point-spending-content').append(pushHtml);
                            hideload()

                            setTimeout(function(){
                                can_scroll = true;
                                IsHas = spendingIsHas;
                            },1000);
                        }
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
    $(".point-ways_to_earn").click(function(){
        if ($('.point-ways_to_earn_cart .cart-item').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/pointindex/getwaytoearnlist",
                success : function(result) {
                    if ($('.point-ways_to_earn_cart .cart-item').length <= 0){
                        var l_arr = {2:'birthday',3:'signin',4:'p_order',5:'follow_twitter',6:'sharetwitter',7:'like_facebook',8:'share_facebook',9:'follow_instagram'};
                        var pushHtml = `<div class="cart-title">
                            <h6 class="text-dark-1">${__('ways_to_earn')}</h6>
                        </div>`;
                        result.data.forEach(function (item) {
                            var add_point = '';
                            if (!$.isEmptyObject(level_info) && item.id > 1) {
                                if (level_info[l_arr[item.id]] > 0) {
                                    var add_point = '+'+level_info[l_arr[item.id]];
                                }
                            }
                            var isinclude = false;
                            pushHtml += `
                        <div class="cart-item row ${item.geted == 1 ? 'isinclude': ''}">
                            <div class="col-2">
                                ${svg[item.icon]}
                            </div>
                            <div class="col-${item.id == 4 ? '10' : '6'} cart-item-center" style="padding-right:0;">`;
                            if (item.id == 1){
                                pushHtml += `<p class="earn-name">${__('sign_up')}</p>`;
                            }else if(item.id == 2){
                                pushHtml += `<p class="earn-name">${__('celebrate_birthday')}</p>`;
                            }else if(item.id == 3){
                                pushHtml += `<p class="earn-name">${__('sign_in')}</p>`;
                            }else if(item.id == 4){
                                pushHtml += `<p class="earn-name">${__('place_order')}</p>`;
                            }else if(item.id == 5){
                                pushHtml += `<p class="earn-name">${__('follow_on_twitter')}</p>`;
                            }else if(item.id == 6){
                                pushHtml += `<p class="earn-name">${__('share_on_twitter')}</p>`;
                            }else if(item.id == 7){
                                pushHtml += `<p class="earn-name">${__('like_on_facebook')}</p>`;
                            }else if(item.id == 8){
                                pushHtml += `<p class="earn-name">${__('facebook_share')}</p>`;
                            }else if(item.id == 9){
                                pushHtml += `<p class="earn-name">${__('instagram_follow')}</p>`;
                            }else if(item.id == 10){
                                pushHtml += `<p class="earn-name">${__('your_recommended_users_place_orders')}</p>`;
                            }
                            if (item.id == 4){
                                if (item.setting.type_id == 0) {
                                    pushHtml += `<p class="earn-point">${__('order_total_rate',[item.points+add_point])}% ${__('points')}</p>`;
                                }else{
                                    pushHtml += `<p class="earn-point">${item.points}${add_point} ${__('points')}</p>`;
                                }

                            }else{
                                pushHtml += `<p class="earn-point">${item.points}${add_point} ${__('points')}</p>`;
                            }

                            pushHtml += `</div>`;
                            if (item.id == 5 || item.id == 6 || item.id == 7 || item.id == 8 || item.id == 9) {
                                var share_class = "share_btn";
                                var share_data = `data-id="${item.id}"`;
                            }
                            if (customeinfo != null){
                                if (item.geted == 1){
                                    pushHtml += `
                                    <div class="col-4 t-right way_right">
                                        ${svg['finish']}
                                    </div>
                                `;
                                }else{
                                    if (item.id == 2){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <span data-point="${item.points}${add_point}" class="btn btn-primary btn-custome birthday btn-birthday">${__('edit_date')}</span>
                                    </div>
                                `;
                                    }else if (item.id == 3){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <span class="btn btn-primary btn-custome signin dosign">${__('sign_in')}</span>
                                    </div>
                                `;
                                    }else if (item.id == 5){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <a href="https://www.twitter.com/intent/follow?screen_name=${item.setting.username}" ${share_data} class="btn btn-primary btn-custome ${share_class}" target="_blank">${__('follow')}</a>
                                    </div>
                                `;
                                    }else if (item.id == 6){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <a href=# onClick="javascript:window.open('https://twitter.com/intent/tweet?text=${item.setting.message}&url=${item.setting.url}','','width=632,height=388,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');return false;" ${share_data} class="btn btn-primary btn-custome ${share_class}" target="_blank">${__('share')}</a>
                                    </div>
                                `;
                                    }else if (item.id == 7){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <a href=# onClick="javascript:window.open('https://www.facebook.com/plugins/page.php?href=facebook.com/${item.setting.username}','','width=632,height=388,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');return false;" ${share_data} class="btn btn-primary btn-custome ${share_class}" target="_blank">${__('like')}</a>
                                    </div>
                                `;
                                    }else if (item.id == 8){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <a href=# onClick="javascript:window.open('https://www.facebook.com/sharer/sharer.php?u=${item.setting.url}','','width=632,height=388,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');return false;" ${share_data} class="btn btn-primary btn-custome ${share_class}" target="_blank">${__('share')}</a>
                                    </div>
                                `;
                                    }else if (item.id == 9){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <a href="https://www.instagram.com/${item.setting.username}" ${share_data} class="btn btn-primary btn-custome ${share_class}" target="_blank">${__('follow')}</a>
                                    </div>
                                `;
                                    }
                                }

                            }

                            pushHtml += `</div>`;
                        });
                        $('.point-ways_to_earn_cart').append(pushHtml);
                        $('.btn-birthday').on('click',function (e) {
                            $('.birthday-earn-point').text($(this).data('point'))
                            cart_point();
                            e.stopPropagation();
                        });
                    }

                }
            });
        }
    });
    $('.cart-point-box,.cart-point-box .doclose').on("click", function(e) {
        cart_point();
        e.stopPropagation();
    });
    $('.cart-point-box').on("click", ".cart-point-do-css3", function(e) {
        e.stopPropagation();
    });

    function cart_point(){
        if (!$(".cart-point-do-css3").hasClass('showcss')) {
            $(".cart-point-do-css3").addClass('showcss').removeClass('hidecss');
            $(".cart-point-box").show();
        }else{
            $(".cart-point-do-css3").addClass('hidecss').removeClass('showcss');
            setTimeout(function(){
                $(".cart-point-box").hide();
                $(".order-point").addClass('lefthidecss').removeClass('leftshowcss');
            },300);
        }
    }

    $(".point-ways_to_redeem").click(function(){
        if ($('.point-ways_to_redeem_cart .cart-item').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/pointindex/getwaytoredeemlist",
                success : function(result) {
                    if ($('.point-ways_to_redeem_cart .cart-item').length <= 0){
                        var pushHtml = `<div class="cart-title">
                            <h6 class="text-dark-1">${__('ways_to_redeem')}</h6>
                        </div>`;
                        result.data.forEach(function (item) {
                            pushHtml += `
                        <div class="cart-item row">
                            <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                                ${svg[item.icon]}
                            </div>
                            <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center">`;
                            if(item.type == 1){
                                pushHtml += `<p class="earn-name">${__('off_coupon',[shop_data.money_format+item.get])}</p>`;
                            }else if(item.type == 2){
                                pushHtml += `<p class="earn-name">${__('order_discount')}</p>`;
                            }else if(item.type == 3){
                                pushHtml += `<p class="earn-name">${__('off_coupon',[item.get+'%'])}</p>`;
                            }else if(item.type == 4){
                                pushHtml += `<p class="earn-name">${__('free_shipping_coupon')}</p>`;
                            }else if(item.type == 5){
                                pushHtml += `<p class="earn-name">${__('free_product_coupon')}</p>`;
                            }
                            if(item.type == 2){
                                pushHtml += `<p class="earn-point">${item.points} ${__('points')} = ${shop_data.money_format+item.get}</p>`;

                            }else{
                                pushHtml += `<p class="earn-point">${item.points} ${__('points')}</p>`;
                            }
                            pushHtml += `</div>
                                    <div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">
                        `;
                            if (item.type == 2 && item.setting.min != '') {
                                var need_points = item.setting.min;
                            }else{
                                var need_points = item.points;
                            }
                            if (customeinfo != null){
                                if (need_points <= availablePoint){
                                    if (item.needexplain){
                                        if (item.type == 2) {
                                            pushHtml += `
                                            <span class="btn btn-primary btn-custome view" data-day="${item.day}" data-min="${item.setting.min}" data-max="${item.setting.max}" data-get="${item.get}" data-points="${item.points}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
                                        `;
                                        }else{
                                            pushHtml += `
                                            <span class="btn btn-primary btn-custome view" data-day="${item.day}" data-get="${item.get}" data-points="${item.points}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
                                        `;
                                        }

                                    }else{
                                        pushHtml += `
                                    <span class="btn btn-primary btn-custome redeem" data-day="${item.day}" data-get="${item.get}" data-points="${item.points}" data-id="${item.id}" data-type="${item.type}">${__('redeem')}</span>                                      
                                    `;
                                    }
                                }else{
                                    pushHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21"><g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-width="2" transform="translate(1 1)"><path class="progress-base-path" d="M4.86111111,18.3333333 C1.09026555,16.030889 -0.68888696,11.5012932 0.50697284,7.2480068 C1.70283264,2.99472037 5.58179605,0.055968107 10,0.055968107 C14.418204,0.055968107 18.2971673,2.99472037 19.4930271,7.2480068 C20.688887,11.5012932 18.9097344,16.030889 15.1388889,18.3333333"></path><path class="progress-main-path" stroke="#6568FE" d="M4.86111111,18.3333333 C1.09026555,16.030889 -0.68888696,11.5012932 0.50697284,7.2480068 C1.70283264,2.99472037 5.58179605,0.055968107 10,0.055968107 C14.418204,0.055968107 18.2971673,2.99472037 19.4930271,7.2480068 C20.688887,11.5012932 18.9097344,16.030889 15.1388889,18.3333333" style="stroke-dasharray: 51.1503, 51.1503; stroke-dashoffset: 50;" data-stroke="${50*(need_points-availablePoint)/need_points}"></path></g></svg>`;
                                }

                            }
                            pushHtml += `</div></div>`;
                        });
                        $('.point-ways_to_redeem_cart').append(pushHtml);

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
            scrollUrl = '/api/pointindex/pointgetlist';
        }else{
            scrollUrl = '/api/pointindex/pointuselist';
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
                if (Object.keys(result.data).length < per_page_num) {
                    if (nowScorrle) {
                        accessIsHas = false;
                    }else{
                        spendingIsHas = false;
                    }
                    IsHas = false;
                }
                if (nowScorrle) {
                    $(".point-access-content").append(html);
                    accessPage += 1;
                }else{
                    $(".point-spending-content").append(html);
                    spendingPage += 1;
                }
                page += 1;
                can_scroll = true;
            }
        });

      }
    });

    $(document).on('click', "#point .view", function () {
        goback_arr.push('point-view-content');
        showHidePage('.point-redeem-content');
        $(".point-view-content").show();
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
                    var add_day = '';
                    if (!$.isEmptyObject(level_info)) {
                        if (level_info['day'] > 0) {
                           var add_day = '+'+level_info['day']; 
                       }
                    }
                    pushHtml += `<div>${__('coupon_day',[$(this).data('day')+add_day])}</div>`; 
                } 
        pushHtml += `
                </div>
            </div>
        `;
        if ($(this).data('type') == 2) {
            if ($(this).data('max') != '' && $(this).data('max') < availablePoint) {
                var get_max = $(this).data('max');
            }else{
                var get_max = availablePoint;
            }
            if ($(this).data('min') != '') {
                if ($(this).data('min') > $(this).data('points')) {
                    var get_min = $(this).data('min');
                }else{
                    var get_min = $(this).data('points');
                }
            }else{
                var get_min = $(this).data('points');
            }
            
            pushHtml += `
                <div class="row row_text">
                    <div class="col-12">
                        <div class="form-group">
                          <div style="margin: 20px 0;text-align:center;"><span class="d_points" data-points="${get_min}">${get_min}</span> ${__('points')} = ${__('off_coupon',[shop_data.money_format+'<span class="d_get" data-get="'+$(this).data('get')+'">'+$(this).data('get')+'</span>'])}</div>
                          <input class="form-control point_redeem_range" type="range" min="${get_min}" max="${get_max}" step="${$(this).data('points')}" aria-label="Points to redeem" value="${get_min}">
                        </div>
                    </div>
                </div>
            `;
        }
        pushHtml += `
            <div class="row" style="padding: 30px 20px 20px 20px;">
                <div class="col-12" style="margin:0 auto;">
                    <span style="height: 50px;line-height: 50px;font-size: 18px;width: 100%;" class="btn btn-primary btn-custome redeem" data-id="${$(this).data('id')}">${__('redeem')}</span>
                </div>
            </div>
        `;
        $('.point-view_cart').html(pushHtml);
        $(".in-top-content").animate({scrollTop:0},10);
        
    });

    $(document).on('input propertychange', ".point_redeem_range", function () {
        //var persent = 100*(($(this).val()-$(this).attr('min'))/$(this).attr('step'))/(($(this).attr('max')-$(this).attr('min'))/$(this).attr('step'));
        var persent = 100*($(this).val()-$(this).attr('min'))/($(this).attr('max')-$(this).attr('min'))
        console.log(persent)
        $(this).css('background-size',persent+'% 100%')
        
        $('.d_points').text($(this).val());
        $('.d_get').text($('.d_get').data('get')*$(this).val()/$('.d_points').data('points'));
    });
    $(document).on('click', "#point .redeem", function () {
        $(this).addClass('btn-progress');
        var that = $(this);
        $.ymqajax({
            url : "/api/pointindex/convert",
            btn: that,
            data : {id:that.data('id'),points:$('.point_redeem_range').val()},
            success : function(result) {
                var data = result.data;
                showHidePage('.point-redeem-content');
                $(".point-giftdetail-content").show();      
                var pushHtml = creatgiftdetailhtml(data);
                $('.point-giftdetail_cart').html(pushHtml);
                hideload();
                $('.point-ways_to_redeem_cart .cart-item').remove()
                $('.point-ways_to_redeem_cart .cart-title').remove()
                $(".in-top-content").animate({scrollTop:0},10);
                changePoint(data.points,0)
                if (goback_arr.includes('point-view-content')) {
                   goback_arr.pop();  
                }
                //回显
                if ($('.point_convert_count').text() == '0') {
                    if(ymq_plan(shop_data.plan,'commission')){
                        $('.point_convert_tab').addClass('ymq-tab-2 point-giftlist-tab');
                    }else{
                        $('.point_convert_tab').addClass('ymq-tab point-giftlist-tab');
                    }
                    
                    $('.point_convert_more').show();
                }
                $('.point_convert_count').text(Number($('.point_convert_count').text())+1);
                //如果有数据就回显
                if ($('.point-giftlist_cart .cart-item').length > 0){
                    var giftData = [];
                    giftData.push(result.data);
                    pushHtml = creatGiftListHtml(giftData);
                    $('.point-giftlist_cart .cart-title').after(pushHtml);
                }
            }
        });
    });

    $(document).on('click', ".point-giftlist-tab", function () {
        if ($('.point-giftlist_cart .cart-item').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/pointindex/getconvertlist",
                data:'',
                success : function(result) {
                    if ($('.point-giftlist_cart .cart-item').length <= 0){
                        var pushHtml = `<div class="cart-title">
                            <h6 class="text-dark-1">${__('your_rewards')}</h6>
                        </div>`;
                        pushHtml += creatGiftListHtml(result.data);
                        $('.point-giftlist_cart').append(pushHtml);
                    }
                }
            }); 
        }
    })

    $(document).on('click', "#point .gift-view", function () {
        goback_arr.push('gift-view');
        $(".top-goback").data('back',".point-giftlist-content");
        prev_page = '.point-content';
        showHidePage('.point-giftlist-content');
        $(".point-giftdetail-content").show();      
        var pushHtml = creatgiftdetailhtml($(this).data());
        $('.point-giftdetail_cart').html(pushHtml);
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
                if(data.type == 1 || data.type == 2){
                    pushHtml += `<p class="earn-name">${__('off_coupon',[shop_data.money_format+data.get])}</p>`;
                }else if(data.type == 3){
                    pushHtml += `<p class="earn-name">${__('off_coupon',[data.get+'%'])}</p>`;
                }else if(data.type == 4){
                    pushHtml += `<p class="earn-name">${__('free_shipping_coupon')}</p>`;
                }else if(data.type == 5){
                    pushHtml += `<p class="earn-name">${__('free_product_coupon')}</p>`;
                }
                pushHtml += `<p class="earn-point">Spent ${data.points} ${__('points')}</p>`;
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

    $(document).on('click', "#point .share_btn", function () {
        $(this).addClass('btn-progress');
        var that = $(this);
        $.ymqajax({
            url : "/api/pointindex/getpoint",
            btn:that,
            data : {id:that.data('id')},
            success : function(result) {
                setTimeout(function(){
                    var parent1 = that.parent();
                    var parent2 = parent1.parent();
                    that.remove();
                    parent1.html(svg['finish']);
                    var pushHtml = parent2.prop("outerHTML");
                    parent2.remove();
                    $('.point-ways_to_earn_cart').append(pushHtml);
                    that.removeClass('btn-progress');
                    changePoint(result.data,1)
                },10000); 
            }
        });
    });

    function changePoint(point = 0,type = 0) {
        var nowPoint = availablePoint;
        if (type == 0){
            availablePoint = availablePoint - point;
        }else{
            availablePoint = availablePoint + point;
        }
        $('.home_point').text($('.home_point').text().replace(nowPoint,availablePoint))
        $('#ymq-point,.change_point').data('header_detail',availablePoint);
        $('.header_detail').html(availablePoint)
    }


    function creataccesshtml(result){
        var pushHtml = '';
        if(result.code == 1){
            result.data.forEach(function (item) {
                pushHtml += `
                    <div class="card small-cart-item ishas">
                        <div class="row point-item">
                        <div class="col-7">`;
                        if (item.reward_matter == 1){
                            pushHtml += `<span class="reward_matter">${__('sign_up')}</span><br/>`;
                        }else if(item.reward_matter == 2){
                            pushHtml += `<span class="reward_matter">${__('celebrate_birthday')}</span><br/>`;
                        }else if(item.reward_matter == 3){
                            pushHtml += `<span class="reward_matter">${__('sign_in')}</span><br/>`;
                        }else if(item.reward_matter == 4){
                            pushHtml += `<span class="reward_matter">${__('place_order')}</span><br/>`;
                        }else if(item.reward_matter == 5){
                            pushHtml += `<span class="reward_matter">${__('follow_on_twitter')}</span><br/>`;
                        }else if(item.reward_matter == 6){
                            pushHtml += `<span class="reward_matter">${__('share_on_twitter')}</span><br/>`;
                        }else if(item.reward_matter == 7){
                            pushHtml += `<span class="reward_matter">${__('like_on_facebook')}</span><br/>`;
                        }else if(item.reward_matter == 8){
                            pushHtml += `<span class="reward_matter">${__('facebook_share')}</span><br/>`;
                        }else if(item.reward_matter == 9){
                            pushHtml += `<span class="reward_matter">${__('instagram_follow')}</span><br/>`;
                        }else if(item.reward_matter == 10){
                            pushHtml += `<span class="reward_matter">${__('your_recommended_users_place_orders')}</span><br/>`;
                        }else if(item.reward_matter == 100){
                            pushHtml += `<span class="reward_matter">${item.description}</span><br/>`;
                        }
                // if(ymq_plan(shop_data.plan,'expiry')){
                //     if (setDate(item.expirationtime) == '2220/01/01') {
                //         var dataHtml = `        
                //         <span class="expirationtime col-12 text-right">${setDate(item.createtime)}</span>
                //         `;
                //     }else{
                //         var dataHtml = `        
                //         <span class="expirationtime col-12 text-right">${item.reward_matter == 100 ? '' : __('deadline')+' '+setDate(item.expirationtime)}</span>
                //         `;
                //     }
                // }else{
                //     var dataHtml = `        
                //         <span class="expirationtime col-12 text-right">${setDate(item.createtime)}</span>
                //         `;
                // }   
                //过期时间是2888年则表示没有过期时间
                if (getTimestamp(item.expirationtime) == 28969286400) {
                    var dataHtml = `        
                    <span class="expirationtime col-12 text-right">${setDate(item.createtime)}</span>
                    `;
                }else{
                    var dataHtml = `        
                    <span class="expirationtime col-12 text-right">${__('deadline')+' '+setDate(item.expirationtime)}</span>
                    `;
                }         
                pushHtml += `
                        </div>
                        <div class="col-5 align-self-center text-right">
                            <span class="point">+${item.point} ${__('points')}</span>
                        </div>
                        ${dataHtml}
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

    function creatGiftListHtml(data){
        var pushHtml = ``;
        data.forEach(function (item) {
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
                pushHtml += `<p class="earn-name">${__('off_coupon',[shop_data.money_format+item.get])}</p>`;
            }else if(item.type == 2){
                pushHtml += `<p class="earn-name">${__('order_discount')}</p>`;
            }else if(item.type == 3){
                pushHtml += `<p class="earn-name">${__('off_coupon',[item.get+'%'])}</p>`;
            }else if(item.type == 4){
                pushHtml += `<p class="earn-name">${__('free_shipping_coupon')}</p>`;
            }else if(item.type == 5){
                pushHtml += `<p class="earn-name">${__('free_product_coupon')}</p>`;
            }
            pushHtml += `<p class="earn-point">${__('spent')} ${item.points} ${__('points')}</p>`;
            pushHtml += `</div>
                    <div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">
        `;
            if (item.type == 2 && item.setting.min != '') {
                var need_points = item.setting.min;
            }else{
                var need_points = item.points;
            }
            if (item.type == 2) {
                pushHtml += `
                <span class="btn btn-primary btn-custome gift-view" data-status="${item.status}" data-code="${item.code}" data-day="${item.day}" data-min="${item.setting.min}" data-max="${item.setting.max}" data-get="${item.get}" data-points="${item.points}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
            `;
            }else{
                pushHtml += `
                <span class="btn btn-primary btn-custome gift-view" data-status="${item.status}" data-code="${item.code}" data-day="${item.day}" data-get="${item.get}" data-points="${item.points}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
            `;
            }
            pushHtml += `</div></div>`;
        });
        return pushHtml;
    }

    function creatspendinghtml(result){
        var pushHtml = '';
        if(result.code == 1){
            result.data.forEach(function (item) {
                pushHtml += `
                    <div class="card small-cart-item ishas">
                        <div class="row point-item">
                        <div class="col-7">`;
                        if (item.reward_matter == 1 || item.reward_matter == 2){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on',[__('off_coupon',[shop_data.money_format+item.get])])}</span><br/>`;
                        }else if(item.reward_matter == 3){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on',[__('off_coupon',[item.get+'%'])])}</span><br/>`;
                        }else if(item.reward_matter == 4){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on',[__('free_shipping_coupon')])}</span><br/>`;
                        }else if(item.reward_matter == 5){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on',[__('free_product')])}</span><br/>`;
                        }else if(item.reward_matter == 100){
                            pushHtml += `<span class="reward_matter">${item.description}</span><br/>`;
                        }else if(item.reward_matter == 200){
                            pushHtml += `<span class="reward_matter">${__('cancel_order')}</span><br/>`;
                        }else if(item.reward_matter == 300){
                            pushHtml += `<span class="reward_matter">${__('cancel_order_referrals')}</span><br/>`;
                        }
                    pushHtml += `
                        </div>
                        <div class="col-5 align-self-center text-right" style="padding-left:0;">
                            <span class="point">-${item.point} ${__('points')}</span><br>
                            <span class="expirationtime text-right">${setDate(item.createtime)}</span>
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

    $(document).on('click', ".copy_code", function () {
        $('.copy_input').select();
        document.execCommand("Copy");
        $(this).html(`<svg t="1601084112227" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5703" width="32" height="32"><path d="M896 512a384 384 0 1 0-384 384 384 384 0 0 0 384-384z m64 0A448 448 0 1 1 512 64a448 448 0 0 1 448 448z" p-id="5704" fill="#515151"></path><path d="M682.24 360.64a32 32 0 0 1 43.52 46.72l-277.44 256a32 32 0 0 1-43.52 0l-138.56-128a32 32 0 0 1 43.52-46.72l116.8 107.84z" p-id="5705" fill="#515151"></path></svg>`)
        setTimeout(function(){
            $('.copy_code').html(`<svg t="1601043413182" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1192" width="32" height="32"><path d="M263.2 761.3H145.4c-45.5 0-82.5-37-82.5-82.5V150.6c0-45.5 37-82.5 82.5-82.5h488.9c45.5 0 82.5 37 82.5 82.5v70.1c0 11-9 20-20 20s-20-9-20-20v-70.1c0-23.4-19-42.5-42.5-42.5H145.4c-23.4 0-42.5 19-42.5 42.5v528.3c0 23.4 19 42.5 42.5 42.5h117.8c11 0 20 9 20 20s-8.9 19.9-20 19.9z" fill="#1C1C1C" p-id="1193"></path><path d="M897.2 971.1H400.9c-42.5 0-77.2-34.6-77.2-77.2V358.4c0-42.5 34.6-77.2 77.2-77.2h496.4c42.5 0 77.2 34.6 77.2 77.2V894c-0.1 42.5-34.7 77.1-77.3 77.1zM400.9 321.2c-20.5 0-37.2 16.7-37.2 37.2V894c0 20.5 16.7 37.2 37.2 37.2h496.4c20.5 0 37.2-16.7 37.2-37.2V358.4c0-20.5-16.7-37.2-37.2-37.2H400.9z" fill="#1C1C1C" p-id="1194"></path></svg>`)
        },1000);
    })
});