$(document).ready(function () {


    var cid = $("#app").attr('data-cid');
    var ctoken = $("#app").attr('data-ctoken');
    $(".top-close").on('click',function () {
        var data = {
            auth: 'ymq',
            action: 'down-point-box',
            data:{}
        }
        window.parent.postMessage(data, "*");
    });

    var  nowScorrle = '';
    var page;
    var IsHas;

    var accessPage = 0;
    var accessIsHas = true;

    var spendingPage = 0;
    var spendingIsHas = true;

    var can_scroll = false;

    $(".ymq-tab").click(function(){
        $(".ymq-main-content").hide();
        $(".top-goback").show();
        $("."+$(this).data("tab")).show();
        $(".chat-content").getNiceScroll().onResize();
        $('.chat-content').getNiceScroll(0).doScrollTop(0);
    })
    $(".top-goback").click(function(){
        if ($(this).data('back') != '') {
            $(".ymq-content").hide();
            $($(this).data('back')).show();
            $(this).data('back','');
        }else{
            $(".ymq-content").hide();
            $(".top-goback").hide();
            $(".ymq-main-content").show();
            $(".chat-content").getNiceScroll().onResize();
            $('.chat-content').getNiceScroll(0).doScrollTop(0);
            can_scroll = false;
        }
        
    })


    $('.month_select').selectFilter({
        callBack : function (val){
            $(".date_select").find("option").attr("disabled",false).show();
            var bigMonth = [4,6,9,11];
            if ($.inArray(val, bigMonth) >= 0 && $('.date_select').val() == 31) {
                $('.date_select').val()
                $(".date_select").find("option[value='1']").attr("selected",true);
                $(".date_select").find("option[value='31']").attr("selected",false).attr("disabled",true).hiden();
            }
            if (val == 2 && $('.date_select').val() > 28) {
                
            }
            // if (rating != val) {
            //     rating = val;
            //     page = 1;
            //     customers_load(1); 
            // }
        }
    });
    $('.date_select').selectFilter({
        callBack : function (val){
            console.log(val)
            // if (rating != val) {
            //     rating = val;
            //     page = 1;
            //     customers_load(1); 
            // }
        }
    });



    $(".ymq-tab-access").click(function(){
        nowScorrle = 1;
        page = accessPage;
        if ($('.point-access-content .card').length <= 0){
            showload()
            $.ajax({
                type : "POST",
                dataType: "json",
                url : "/api/pointindex/pointgetlist",
                data : {cid:cid,shop_name:shop_data.name,ctoken:ctoken,page:page},
                success : function(result) {
                    if (result.code == 0) {
                        hideload()
                        //错误弹出
                        $('.point-access-content').html(`<img class="tip_img card" style="width:100%;" src="/svg/index/status.html?status=500" />`);
                        return false;
                    }
                    if (result.code == 201) {
                        $('.point-access-content').html(`<img class="tip_img card" style="width:100%;" src="/svg/index/status.html?status=no-data" />`);
                        hideload()
                        accessIsHas = false;
                        IsHas = false;
                        return false;
                    }
                    var pushHtml= creataccesshtml(result);
                    if (Object.keys(result.data).length < 10) {
                        accessIsHas = false;
                        IsHas = false;
                    }
                    accessPage += 1;
                    page += 1;

                    $('.point-access-content').append(pushHtml);
                    hideload()
                    $(".chat-content").getNiceScroll().onResize();
                    setTimeout(function(){
                        can_scroll = true;
                        IsHas = accessIsHas;
                    },1000);
                },
                error : function(e){
                    console.log(e.status);
                    hideload()
                    $(".chat-content").getNiceScroll().onResize();
                }
            });
        }else{
            setTimeout(function(){
                can_scroll = true;
                IsHas = accessIsHas;
            },1000);
        }

    })



    $(".ymq-tab-spending").click(function(){
        nowScorrle = 0;
        page = spendingPage;
        if ($('.point-spending-content .card').length <= 0){
            showload()
            $.ajax({
                type : "POST",
                dataType: "json",
                url : "/api/pointindex/pointuselist",
                data : {cid:cid,shop_name:shop_data.name,ctoken:ctoken,page:page},
                success : function(result) {
                    console.log(result)
                    if (result.code == 0) {
                        hideload()
                        //错误弹出
                        $('.point-spending-content').html(`<img class="tip_img card" style="width:100%;" src="/svg/index/status.html?status=500" />`);
                        return false;
                    }
                    if (result.code == 201) {
                        $('.point-spending-content').html(`<img class="tip_img card" style="width:100%;" src="/svg/index/status.html?status=no-data" />`);
                        hideload()
                        spendingIsHas = false;
                        IsHas = false;
                        return false;
                    }
                    var pushHtml = creatspendinghtml(result);
                    if (Object.keys(result.data).length < 10) {
                        spendingIsHas = false;
                        IsHas = false;
                    }
                    spendingPage += 1;
                    page += 1;

                    $('.point-spending-content').append(pushHtml);
                    hideload()
                    $(".chat-content").getNiceScroll().onResize();
                    setTimeout(function(){
                        can_scroll = true;
                        IsHas = spendingIsHas;
                    },1000);
                },
                error : function(e){
                    console.log(e.status);
                    hideload()
                    $(".chat-content").getNiceScroll().onResize();
                }
            });
        }else{
            setTimeout(function(){
                can_scroll = true;
                IsHas = spendingIsHas;
            },1000);
        }

    })

    

    $(".ways_to_earn").click(function(){
        if ($('.point-ways_to_earn_cart .cart-item').length <= 0){
            showload()
            $.ajax({
                type : "POST",
                dataType: "json",
                url : "/api/pointindex/getwaytoearnlist",
                data : {cid:cid,shop_name:shop_data.name,ctoken:ctoken},
                //请求成功
                success : function(result) {
                    if (result.code == 0) {
                        hideload()
                        //错误弹出
                        $('.point-ways_to_earn_cart').html(`<img class="tip_img card" style="width:100%;" src="/svg/index/status.html?status=500" />`);
                        return false;
                    }
                    if (result.code == 201) {
                        $('.point-ways_to_earn_cart').html(`<img class="tip_img card" style="width:100%;" src="/svg/index/status.html?status=no-data" />`);
                        hideload()
                        return false;
                    }
                    var pushHtml = '';
                    result.data.forEach(function (item) {
                        var isinclude = false;
                        pushHtml += `
                        <div class="cart-item row ${item.geted == 1 ? 'isinclude': ''}">
                            <div class="col-2">
                                <img width="30" src="/svg/index.html?icon=${item.icon}&color=${(branding['color']['icon-color']).substring(1)}" alt="">
                            </div>
                            <div class="col-${item.id == 4 ? '10' : '6'} cart-item-center">`;
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
                                }
                                if (item.id == 4){
                                    if (item.setting.type_id == 0) {
                                        pushHtml += `<p class="earn-point">${item.points} Point for every €1 spent</p>`; 
                                    }else{
                                        pushHtml += `<p class="earn-point">${item.points} ${__('points')}</p>`;  
                                    }
                                    
                                }else{
                                    pushHtml += `<p class="earn-point">${item.points} ${__('points')}</p>`; 
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
                                    <svg t="1600782665756" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4145" width="25" height="25"><path d="M387.018497 210.626092c17.179264 0 31.099299-13.925151 31.099299-31.099299l0-10.366092 186.597839 0 0 10.366092c0 17.175171 13.920034 31.099299 31.099299 31.099299s31.099299-13.925151 31.099299-31.099299L666.914232 96.593965c0-17.175171-13.920034-31.099299-31.099299-31.099299s-31.099299 13.925151-31.099299 31.099299l0 10.366092L418.117796 106.960057l0-10.366092c0-17.175171-13.920034-31.099299-31.099299-31.099299s-31.099299 13.925151-31.099299 31.099299l0 82.932828C355.919199 196.700941 369.83821 210.626092 387.018497 210.626092z" p-id="4146" fill="#bfbfbf"></path><path d="M400.416646 314.944995c-17.179264 0-31.099299 13.925151-31.099299 31.099299l0 30.340005c0 17.175171 13.920034 31.099299 31.099299 31.099299s31.099299-13.925151 31.099299-31.099299L431.515944 346.044294C431.516967 328.869123 417.596933 314.944995 400.416646 314.944995z" p-id="4147" fill="#bfbfbf"></path><path d="M622.416785 314.944995c-17.179264 0-31.099299 13.925151-31.099299 31.099299l0 30.340005c0 17.175171 13.920034 31.099299 31.099299 31.099299s31.099299-13.925151 31.099299-31.099299L653.516084 346.044294C653.517107 328.869123 639.597073 314.944995 622.416785 314.944995z" p-id="4148" fill="#bfbfbf"></path><path d="M511.103584 546.380018c43.773969 0 74.783217-30.18344 86.212524-48.016597 9.182127-14.33038 5.021364-33.210379-9.202593-42.569538-14.213723-9.379625-33.428344-5.385661-42.974767 8.706289-0.132006 0.197498-13.555737 19.680225-34.035164 19.680225-19.903306 0-32.29452-18.039865-33.124422-19.290345-9.151427-14.349823-28.173666-18.72855-42.650379-9.718339-14.588253 9.06547-19.072381 28.245298-10.001795 42.832528C436.493306 515.968381 467.116767 546.380018 511.103584 546.380018z" p-id="4149" fill="#bfbfbf"></path><path d="M463.633433 898.665457 266.173199 898.665457c-41.648562 0-75.532277-34.713616-75.532277-77.374228l0-574.913888c0-42.665729 33.883715-77.374228 75.532277-77.374228 17.179264 0 31.099299-13.925151 31.099299-31.099299s-13.920034-31.099299-31.099299-31.099299c-75.946716 0-137.730874 62.61406-137.730874 139.573849l0 574.913888c0 76.959789 61.784158 139.573849 137.730874 139.573849L463.633433 960.866101c17.179264 0 31.099299-13.920034 31.099299-31.099299S480.81372 898.665457 463.633433 898.665457z" p-id="4150" fill="#bfbfbf"></path><path d="M756.661256 106.803491c-17.179264 0-31.099299 13.925151-31.099299 31.099299s13.920034 31.099299 31.099299 31.099299c41.648562 0 75.532277 34.7085 75.532277 77.374228L832.193533 551.401382c0 17.175171 13.920034 31.099299 31.099299 31.099299s31.099299-13.925151 31.099299-31.099299L894.39213 246.37734C894.39213 169.417551 832.607972 106.803491 756.661256 106.803491z" p-id="4151" fill="#bfbfbf"></path><path d="M840.980663 650.76953 613.392248 885.125069l-110.711498-114.006544c-11.975752-12.325723-31.655977-12.614296-43.976584-0.647753-12.320607 11.966543-12.614296 31.655977-0.647753 43.976584l133.023666 136.981814c0.10847 0.110517 0.23843 0.183172 0.347924 0.291642 0.11154 0.11154 0.186242 0.245593 0.299829 0.356111 0.771573 0.74906 1.644453 1.311879 2.470261 1.963725 0.704035 0.556679 1.363044 1.183965 2.101871 1.671059 1.031493 0.680499 2.131547 1.187035 3.219321 1.731434 0.730641 0.366344 1.426489 0.816598 2.178619 1.121544 1.25048 0.50756 2.548032 0.823761 3.841491 1.162476 0.642636 0.167822 1.26276 0.429789 1.912559 0.555655 1.961678 0.38067 3.949962 0.581238 5.939269 0.581238s3.977591-0.200568 5.939269-0.581238c0.650823-0.12689 1.269923-0.387833 1.912559-0.555655 1.293459-0.338714 2.591011-0.654916 3.841491-1.162476 0.75213-0.304945 1.447978-0.7552 2.178619-1.121544 1.087774-0.544399 2.187829-1.050935 3.219321-1.731434 0.738827-0.487094 1.397836-1.11438 2.101871-1.671059 0.825808-0.651846 1.698688-1.215688 2.470261-1.963725 0.113587-0.110517 0.188288-0.24457 0.299829-0.356111 0.109494-0.10847 0.239454-0.181125 0.347924-0.291642l249.900583-257.331833c11.966543-12.320607 11.672854-32.011064-0.647753-43.976584C872.637664 638.160351 852.956416 638.438691 840.980663 650.76953z" p-id="4152" fill="#bfbfbf"></path></svg>
                                    </div>
                                `;
                                }else{
                                    if (item.id == 2){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <span class="btn btn-primary btn-custome birthday">${__('edit_date')}</span>
                                    </div>
                                `;
                                    }else if (item.id == 3){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <span class="btn btn-primary btn-custome signin">${__('sign_in')}</span>
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
                    hideload()
                    $(".chat-content").getNiceScroll().onResize();
                },
                error : function(e){
                    console.log(e.status);
                    hideload()
                    $(".chat-content").getNiceScroll().onResize();
                }
            });
        }
    })

    $(".ways_to_redeem").click(function(){
        if ($('.point-ways_to_redeem_cart .cart-item').length <= 0){
            showload()
            $.ajax({
                type : "POST",
                dataType: "json",
                url : "/api/pointindex/getwaytoredeemlist",
                data : {cid:cid,shop_name:shop_data.name,ctoken:ctoken},
                success : function(result) {
                    if (result.code == 0) {
                        hideload()
                        //错误弹出
                        $('.point-ways_to_redeem_cart').html(`<img class="tip_img card" style="width:100%;" src="/svg/index/status.html?status=500" />`);
                        return false;
                    }
                    if (result.code == 201) {
                        $('.point-ways_to_redeem_cart').html(`<img class="tip_img card" style="width:100%;" src="/svg/index/status.html?status=no-data" />`);
                        hideload()
                        return false;
                    }
                    var pushHtml = '';
                    result.data.forEach(function (item) {
                        pushHtml += `
                        <div class="cart-item row">
                            <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                                <img width="30" src="/svg/index.html?icon=${item.icon}&color=${(branding['color']['icon-color']).substring(1)}" alt="">
                            </div>
                            <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center">`;
                        if(item.type == 1){
                            pushHtml += `<p class="earn-name">${shop_data.money_format+item.get} ${__('off_coupon')}</p>`;
                        }else if(item.type == 2){
                            pushHtml += `<p class="earn-name">${__('order_discount')}</p>`;
                        }else if(item.type == 3){
                            pushHtml += `<p class="earn-name">${item.get}% ${__('off_coupon')}</p>`;
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
                    hideload()
                    $(".chat-content").getNiceScroll().onResize();
                    $(".progress-main-path").each(function () {
                        $(this).animate({
                            'stroke-dashoffset':$(this).data("stroke")
                        },1000);
                    })
                },
                error : function(e){
                    console.log(e.status);
                    hideload()
                    $(".chat-content").getNiceScroll().onResize();
                }
            });
        }
    })


    var scrollUrl = '';
    $(".chat-content").scroll(function(){
      if ($("body").height() - $(".ymqloading").offset().top > 30 && can_scroll && IsHas) {
        can_scroll = false;
        showload()
        if (nowScorrle) {
            scrollUrl = '/api/pointindex/pointgetlist';
        }else{
            scrollUrl = '/api/pointindex/pointuselist';
        }
        $.ajax({
            type : "POST",
            dataType: "json",
            url : scrollUrl,
            data : {cid:cid,shop_name:shop_data.name,ctoken:ctoken,page:page},
            success : function(result) {
                if (result.code == 0) {
                    hideload()
                    //错误弹出
                    
                    return false;
                }
                var html = '';
                if (jQuery.isEmptyObject(result.data)) {
                    if (nowScorrle) {
                        accessIsHas = false;
                    }else{
                        spendingIsHas = false;
                    }
                    IsHas = false;
                    hideload()
                }else{
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
                        $(".point-access-content").append(html);
                        accessPage += 1;
                    }else{
                        $(".point-spending-content").append(html);
                        spendingPage += 1;
                    }
                    page += 1;

                    $(".chat-content").getNiceScroll().onResize();
                    can_scroll = true;
                }

            },
            error : function(e){
                console.log(e.status);
                console.log(e.responseText);
            }
        });

      }
    });

    $(document).on('click', ".view", function () {
        $(".ymq-main-content").hide();
        $(".ymq-content").hide();
        $(".top-goback").data('back','.point-redeem-content');
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
                   pushHtml += `<div>Reward can only be used on purchases of ${shop_data.money_format+$(this).data('min_amout')} or more (before tax).</div>`; 
                }
                if ($(this).data('type') == 4 && $(this).data('get') != 'all') {
                   pushHtml += `<div>Reward can only be used when shipping costs are less than or equal to ${shop_data.money_format+$(this).data('get')}.</div>`; 
                }
                if ($(this).data('applies_type') == 1) {
                    pushHtml += `<div>Reward can only be used on select product collections.</div>`;
                }else if($(this).data('applies_type') == 2){
                    pushHtml += `<div>Reward can only be used on select product.</div>`;
                }   
                if ($(this).data('day') > 0) {
                   pushHtml += `<div>Reward can only be used within ${$(this).data('day')} days of expiration.</div>`; 
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
                var get_min = $(this).data('min');
            }else{
                var get_min = $(this).data('points');
            }
            pushHtml += `
                <div class="row row_text">
                    <div class="col-12">
                        <div class="form-group">
                          <div style="margin: 20px 0;text-align:center;"><span class="d_points" data-points="${get_min}">${get_min}</span> Points for ${shop_data.money_format}<span class="d_get" data-get="${$(this).data('get')}">${$(this).data('get')}</span> off</div>
                          <input class="form-control redeem_range" type="range" min="${get_min}" max="${get_max}" step="${$(this).data('points')}" aria-label="Points to redeem" value="${get_min}">
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
        $(".chat-content").getNiceScroll().onResize();
        $('.chat-content').getNiceScroll(0).doScrollTop(0);
    });

    $(document).on('input propertychange', ".redeem_range", function () {

        $(this).css('background-size',($(this).val()/$(this).attr('max')+$(this).attr('min')/$(this).attr('max'))*100+'% 100%')
        $('.d_points').text($(this).val());
        $('.d_get').text($('.d_get').data('get')*$(this).val()/$('.d_points').data('points'));
    });

    $(document).on('click', ".redeem", function () {
        $(this).addClass('btn-progress');
        showload();
        var that = $(this);
        $.ajax({
            type : "POST",
            dataType: "json",
            url : "/api/pointindex/convert",
            data : {cid:cid,shop_name:shop_data.name,ctoken:ctoken,id:that.data('id'),points:$('.redeem_range').val()},
            success : function(result) {
                if (result.code == 0) {
                    hideload()
                    //错误弹出
                    
                    return false;
                }
                var data = result.data;
                $(".ymq-main-content").hide();
                $(".ymq-content").hide();
                $(".top-goback").data('back','.point-redeem-content');
                $(".point-giftdetail-content").show();      
                var pushHtml = creatgiftdetailhtml(data);
                $('.point-giftdetail_cart').html(pushHtml);
                hideload()
                $(".chat-content").getNiceScroll().onResize();
                $('.chat-content').getNiceScroll(0).doScrollTop(0);
                that.removeClass('btn-progress');
            },
            error : function(e){
                hideload()
                console.log(e.status);
                console.log(e.responseText);
                that.removeClass('btn-progress');
            }
        });
    });

    
    $(".giftlist-tab").click(function(){
        if ($('.point-giftlist_cart .cart-item').length <= 0){
            showload()
            $.ajax({
                type : "POST",
                dataType: "json",
                url : "/api/pointindex/getconvertlist",
                data : {cid:cid,shop_name:shop_data.name,ctoken:ctoken},
                success : function(result) {
                    if (result.code == 0) {
                        hideload()
                        //错误弹出
                        $('.point-giftlist_cart').html(`<img class="tip_img card" style="width:100%;" src="/svg/index/status.html?status=500" />`);
                        return false;
                    }
                    var pushHtml = '';
                    result.data.forEach(function (item) {
                        pushHtml += `
                        <div class="cart-item row">
                            <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                                <img width="30" src="/svg/index.html?icon=${item.icon}&color=${(branding['color']['icon-color']).substring(1)}" alt="">
                            </div>
                            <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center">`;
                        if(item.type == 1){
                            pushHtml += `<p class="earn-name">${shop_data.money_format+item.get} ${__('off_coupon')}</p>`;
                        }else if(item.type == 2){
                            pushHtml += `<p class="earn-name">${__('order_discount')}</p>`;
                        }else if(item.type == 3){
                            pushHtml += `<p class="earn-name">${item.get}% ${__('off_coupon')}</p>`;
                        }else if(item.type == 4){
                            pushHtml += `<p class="earn-name">${__('free_shipping_coupon')}</p>`;
                        }else if(item.type == 5){
                            pushHtml += `<p class="earn-name">${__('free_product_coupon')}</p>`;
                        }
                        pushHtml += `<p class="earn-point">Spent ${item.points} ${__('points')}</p>`;
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
                                <span class="btn btn-primary btn-custome gift-view" data-code="${item.code}" data-day="${item.day}" data-min="${item.setting.min}" data-max="${item.setting.max}" data-get="${item.get}" data-points="${item.points}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
                            `;
                        }else{
                             pushHtml += `
                                <span class="btn btn-primary btn-custome gift-view" data-code="${item.code}" data-get="${item.get}" data-points="${item.points}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
                            `;
                        }
                        pushHtml += `</div></div>`;
                    });
                    $('.point-giftlist_cart').append(pushHtml);
                    hideload()
                    $(".chat-content").getNiceScroll().onResize();
                    
                },
                error : function(e){
                    console.log(e.status);
                    hideload()
                    $(".chat-content").getNiceScroll().onResize();
                }
            });
        }
    })

    $(document).on('click', ".gift-view", function () {
        $(".ymq-main-content").hide();
        $(".ymq-content").hide();
        $(".top-goback").data('back','.point-giftlist-content');
        $(".point-giftdetail-content").show();      
        var pushHtml = creatgiftdetailhtml($(this).data());
        $('.point-giftdetail_cart').html(pushHtml);
        hideload()
        $(".chat-content").getNiceScroll().onResize();
        $('.chat-content').getNiceScroll(0).doScrollTop(0);
    });


    function creatgiftdetailhtml(data){
        var pushHtml = `
            <div class="cart-item row">
                <div class="col-2">
                    <img width="30" src="/svg/index.html?icon=${data.icon}&color=${(branding['color']['icon-color']).substring(1)}" alt="">
                </div>
                <div class="col-6 cart-item-center">`;
                if(data.type == 1 || data.type == 2){
                    pushHtml += `<p class="earn-name">${shop_data.money_format+data.get} ${__('off_coupon')}</p>`;
                }else if(data.type == 3){
                    pushHtml += `<p class="earn-name">${data.get}% ${__('off_coupon')}</p>`;
                }else if(data.type == 4){
                    pushHtml += `<p class="earn-name">${__('free_shipping_coupon')}</p>e_shipping_coupon')}`;
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
                Use this discount code on your next order!
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
                   pushHtml += `<div>Reward can only be used on purchases of ${shop_data.money_format+data.min_amout} or more (before tax).</div>`; 
                }
                if (data.type == 4 || data.get != 'all') {
                   pushHtml += `<div>Reward can only be used when shipping costs are less than or equal to ${shop_data.money_format+data.get}.</div>`; 
                }
                if (data.applies_type == 1) {
                    pushHtml += `<div>Reward can only be used on select product collections.</div>`;
                }else if(data.applies_type == 2){
                    pushHtml += `<div>Reward can only be used on select product.</div>`;
                }   
                if (data.day > 0) {
                   pushHtml += `<div>Reward can only be used within ${data.day} days of expiration.</div>`; 
                } 
        pushHtml += `
                </div>
            </div>
        `;
         pushHtml += `
            <div class="row row_text" style="padding: 30px 20px 20px 20px;">
                <div class="col-12" style="margin:0 auto;">
                    <span style="height: 50px;line-height: 50px;font-size: 18px;width: 100%;" class="btn btn-primary btn-custome apply_code" data-code="${data.code}">Apply code</span>
                </div>
            </div>
        `;
        return pushHtml;
    }



    $(document).on('click', ".share_btn", function () {
        $(this).addClass('btn-progress');
        showload();
        var that = $(this);
        $.ajax({
            type : "POST",
            dataType: "json",
            url : "/api/pointindex/getpoint",
            data : {cid:cid,shop_name:shop_data.name,ctoken:ctoken,id:that.data('id')},
            success : function(result) {
                if (result.code == 0) {
                    hideload()
                    //错误弹出
                    
                    return false;
                }else{
                    setTimeout(function(){
                        var parent1 = that.parent();
                        var parent2 = parent1.parent();
                        that.remove();
                        parent1.html(`<svg t="1600782665756" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4145" width="25" height="25"><path d="M387.018497 210.626092c17.179264 0 31.099299-13.925151 31.099299-31.099299l0-10.366092 186.597839 0 0 10.366092c0 17.175171 13.920034 31.099299 31.099299 31.099299s31.099299-13.925151 31.099299-31.099299L666.914232 96.593965c0-17.175171-13.920034-31.099299-31.099299-31.099299s-31.099299 13.925151-31.099299 31.099299l0 10.366092L418.117796 106.960057l0-10.366092c0-17.175171-13.920034-31.099299-31.099299-31.099299s-31.099299 13.925151-31.099299 31.099299l0 82.932828C355.919199 196.700941 369.83821 210.626092 387.018497 210.626092z" p-id="4146" fill="#bfbfbf"></path><path d="M400.416646 314.944995c-17.179264 0-31.099299 13.925151-31.099299 31.099299l0 30.340005c0 17.175171 13.920034 31.099299 31.099299 31.099299s31.099299-13.925151 31.099299-31.099299L431.515944 346.044294C431.516967 328.869123 417.596933 314.944995 400.416646 314.944995z" p-id="4147" fill="#bfbfbf"></path><path d="M622.416785 314.944995c-17.179264 0-31.099299 13.925151-31.099299 31.099299l0 30.340005c0 17.175171 13.920034 31.099299 31.099299 31.099299s31.099299-13.925151 31.099299-31.099299L653.516084 346.044294C653.517107 328.869123 639.597073 314.944995 622.416785 314.944995z" p-id="4148" fill="#bfbfbf"></path><path d="M511.103584 546.380018c43.773969 0 74.783217-30.18344 86.212524-48.016597 9.182127-14.33038 5.021364-33.210379-9.202593-42.569538-14.213723-9.379625-33.428344-5.385661-42.974767 8.706289-0.132006 0.197498-13.555737 19.680225-34.035164 19.680225-19.903306 0-32.29452-18.039865-33.124422-19.290345-9.151427-14.349823-28.173666-18.72855-42.650379-9.718339-14.588253 9.06547-19.072381 28.245298-10.001795 42.832528C436.493306 515.968381 467.116767 546.380018 511.103584 546.380018z" p-id="4149" fill="#bfbfbf"></path><path d="M463.633433 898.665457 266.173199 898.665457c-41.648562 0-75.532277-34.713616-75.532277-77.374228l0-574.913888c0-42.665729 33.883715-77.374228 75.532277-77.374228 17.179264 0 31.099299-13.925151 31.099299-31.099299s-13.920034-31.099299-31.099299-31.099299c-75.946716 0-137.730874 62.61406-137.730874 139.573849l0 574.913888c0 76.959789 61.784158 139.573849 137.730874 139.573849L463.633433 960.866101c17.179264 0 31.099299-13.920034 31.099299-31.099299S480.81372 898.665457 463.633433 898.665457z" p-id="4150" fill="#bfbfbf"></path><path d="M756.661256 106.803491c-17.179264 0-31.099299 13.925151-31.099299 31.099299s13.920034 31.099299 31.099299 31.099299c41.648562 0 75.532277 34.7085 75.532277 77.374228L832.193533 551.401382c0 17.175171 13.920034 31.099299 31.099299 31.099299s31.099299-13.925151 31.099299-31.099299L894.39213 246.37734C894.39213 169.417551 832.607972 106.803491 756.661256 106.803491z" p-id="4151" fill="#bfbfbf"></path><path d="M840.980663 650.76953 613.392248 885.125069l-110.711498-114.006544c-11.975752-12.325723-31.655977-12.614296-43.976584-0.647753-12.320607 11.966543-12.614296 31.655977-0.647753 43.976584l133.023666 136.981814c0.10847 0.110517 0.23843 0.183172 0.347924 0.291642 0.11154 0.11154 0.186242 0.245593 0.299829 0.356111 0.771573 0.74906 1.644453 1.311879 2.470261 1.963725 0.704035 0.556679 1.363044 1.183965 2.101871 1.671059 1.031493 0.680499 2.131547 1.187035 3.219321 1.731434 0.730641 0.366344 1.426489 0.816598 2.178619 1.121544 1.25048 0.50756 2.548032 0.823761 3.841491 1.162476 0.642636 0.167822 1.26276 0.429789 1.912559 0.555655 1.961678 0.38067 3.949962 0.581238 5.939269 0.581238s3.977591-0.200568 5.939269-0.581238c0.650823-0.12689 1.269923-0.387833 1.912559-0.555655 1.293459-0.338714 2.591011-0.654916 3.841491-1.162476 0.75213-0.304945 1.447978-0.7552 2.178619-1.121544 1.087774-0.544399 2.187829-1.050935 3.219321-1.731434 0.738827-0.487094 1.397836-1.11438 2.101871-1.671059 0.825808-0.651846 1.698688-1.215688 2.470261-1.963725 0.113587-0.110517 0.188288-0.24457 0.299829-0.356111 0.109494-0.10847 0.239454-0.181125 0.347924-0.291642l249.900583-257.331833c11.966543-12.320607 11.672854-32.011064-0.647753-43.976584C872.637664 638.160351 852.956416 638.438691 840.980663 650.76953z" p-id="4152" fill="#bfbfbf"></path></svg>`);
                        var pushHtml = parent2.prop("outerHTML");
                        parent2.remove();
                        $('.point-ways_to_earn_cart').append(pushHtml);
                        that.removeClass('btn-progress');
                    },10000); 
                }
                hideload()
            },
            error : function(e){
                hideload()
                console.log(e.status);
                console.log(e.responseText);
                that.removeClass('btn-progress');
            }
        });
    });




    function creataccesshtml(result){
        var pushHtml = '';
        if(result.code == 1){
            result.data.forEach(function (item) {
                pushHtml += `
                    <div class="card">
                        <div class="row point-item">
                        <div class="col-6 col-sm-6">`;
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
                        }
                            
                pushHtml += `
                            <span class="expirationtime">${__('deadline')}</span><br>
                            <span class="expirationtime">${item.expirationtime}</span>
                        </div>
                        <div class="col-6 col-sm-6 align-self-center text-right">
                            <span class="point">+${item.point} ${__('points')}</span><br>
                            <span class="used_point">${__('has_been_used',[item.used_point])}</span>
                        </div>
                        </div>
                    </div>
                    <div class="card-after"></div>
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
                    <div class="card">
                        <div class="row point-item">
                        <div class="col-8 col-sm-8">`;
                        if (item.reward_matter == 1 || item.reward_matter == 2){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on')+' '+shop_data.money_format+item.get+' '+__('off_coupon')}</span><br/>`;
                        }else if(item.reward_matter == 3){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on')+' '+item.get+'% '+__('off_coupon')}</span><br/>`;
                        }else if(item.reward_matter == 4){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on')+' '+__('free_shipping_coupon')}</span><br/>`;
                        }else if(item.reward_matter == 5){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on')+' '+__('free_product_coupon')}</span><br/>`;
                        }
                    pushHtml += `
                            <span class="expirationtime">${item.createtime}</span>
                        </div>
                        <div class="col-4 col-sm-4 align-self-center text-right" style="padding-left:0;">
                            <span class="point">-${item.point} ${__('points')}</span><br>
                        </div>
                        </div>
                    </div>
                    <div class="card-after"></div>
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

})



window.onload=function(){
    hideload()
}


function showload(){
    console.log(111)
    $('.ymqloading').html(`<img class="load" src="/svg/load-blue-44.svg">`);
}
function hideload(){
    $('.ymqloading').html(``);
}


$(document).ready(function () {
    /**
     * 后台iframe相关js
     * @type {jQuery|undefined}
     */


    window.parent.postMessage({
        auth: 'ymq',
        action: 'admin-loading',
        data:{}
    }, "*");

    window.addEventListener('message', function (e) {
        var res = e.data;
        // console.log(res);
        if (res.hasOwnProperty('auth') && res.auth == 'ymq'){
            switch (res.action) {
                case 'admin-color':
                    admin_color(res.data);
                    break;
                case 'admin-wallpaper':
                    admin_wallpaper(res.data);
                    break;
                case 'admin-shapes':
                    admin_shapes(res.data);
                    break;

            }
        }
    }, false);
    
    function admin_color(data) {
        $("#iframe-style").remove();
        $('body').append(data.style);
        if (data.svg){
            $('.svg').each(function () {
                var src = $(this).attr('src');
                $(this).attr('src',src.substr(0,src.lastIndexOf('&color='))+'&color='+data.svg.substr(1));
            })
        }
        // $(data.dom).css(data.css,data.value);
    }
    function admin_wallpaper(data) {
        $("#app").css('background-image',`url(/svg/index/wallpaper.html?icon=${data})`);
    }
    function admin_shapes(data) {
        $("#iframe-style").remove();
        $('body').append(data);
    }
})