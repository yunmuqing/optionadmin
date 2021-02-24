$(document).ready(function () {
    $('.customer_page .nav li').click(function(){
        $('.tab_content').hide();
        $('.customer_page .nav li').removeClass('active');
        $('.'+$(this).data('show')).show();
        $(this).addClass('active');
    })
    $(".commission_percent,.commission_withdrawal_percent").on("input propertychange",function(){
      $('.commission_percent_btn').attr('disabled',false)
    })
    $("#referral-form input").on("input propertychange",function(){
      $('.referral-save').attr('disabled',false)
    })
    $(".add").bind('input propertychange', function() {
        $('.change'+$(this).data('type')).text(Number($('.change'+$(this).data('type')).data('get'))+Number($(this).val()))
    });
    $('#commission_percent_form').bootstrapValidator({
        fields: {
            commission_percent:{
               validators: {
                    notEmpty: {
                        message: 'rate of commission must between 0-100'
                    },
                    between: {
                        min : 0,
                        max : 100,
                        message: 'rate of commission must between 0-100'
                    }
                }
            },
            commission_withdrawal_percent:{
               validators: {
                    notEmpty: {
                        message: 'withdrawal rate of commission must between 0-100'
                    },
                    between: {
                        min : 0,
                        max : 100,
                        message: 'withdrawal rate of commission must between 0-100'
                    }
                }
            }
        }
    }).on("success.form.bv",function(e){
        $('.commission_percent_btn').addClass('btn-progress');
        $.ajax({
            type : "POST",
            dataType: "json",
            url : "/api/customers/update",
            data : {id:custome_id,commission_percent:$('.commission_percent').val(),commission_withdrawal_percent:$('.commission_withdrawal_percent').val()},
            success : function(res) {
                iziToast.show({
                  message: res.msg,
                  position: 'bottomCenter'
                });
                $('.commission_percent_btn').removeClass('btn-progress');
                $('.commission_percent_btn').attr('disabled',false);
            },
            error : function(res){
                iziToast.error({
                  message: res.msg,
                  position: 'bottomCenter'
                });
                $('.commission_percent_btn').removeClass('btn-progress');
                $('.commission_percent_btn').attr('disabled',false);
            }
        });
        return false;
    });

    $('#referral-form').bootstrapValidator({
        fields: {
            add1:{
               validators: {
                    notEmpty: {
                        message: 'Coupons increase rewards must Greater than or equal to 0'
                    },
                    min: {
                        message: 'Coupons increase rewards must Greater than or equal to 0'
                    }
                }
            },
            add3:{
               validators: {
                    notEmpty: {
                        message: 'Coupons increase rewards must Greater than or equal to 0'
                    },
                    min: {
                        message: 'Coupons increase rewards must Greater than or equal to 0'
                    }
                }
            },
            add4:{
               validators: {
                    notEmpty: {
                        message: 'Coupons increase rewards must Greater than or equal to 0'
                    },
                    min: {
                        message: 'Coupons increase rewards must Greater than or equal to 0'
                    }
                }
            }
        }
    }).on("success.form.bv",function(e){
        $('.referral-save').addClass('btn-progress');
        $.ajax({
            type : "POST",
            dataType: "json",
            url : "/api/customers/updatespecial",
            data : $('#referral-form').serialize(),
            success : function(res) {
                console.log(res)
                iziToast.show({
                  message: res.msg,
                  position: 'bottomCenter'
                });
                $('.referral-save').removeClass('btn-progress');
                $('.referral-save').attr('disabled',false);
            },
            error : function(res){
                iziToast.error({
                  message: res.msg,
                  position: 'bottomCenter'
                });
                $('.referral-save').removeClass('btn-progress');
                $('.referral-save').attr('disabled',false);
            }
        });
        return false;
    });

    $('#defaultForm-commissions').bootstrapValidator({
        fields: {
            commissions:{
               validators: {
                    callback:{
                        message:"commissions adjustment can't be equal to 0",
                        callback:function(value,validator){
                            if (value == 0) {
                                return false;
                            }
                            return true;
                        }
                    }
                } 
            }
        }
    }).on("success.form.bv",function(e){
        $('.save-commissions').addClass('btn-progress');
        $.ajax({
            type : "POST",
            dataType: "json",
            url : "/api/commissionsapi/creat",
            data : $('#defaultForm-commissions').serialize(),
            success : function(res) {
                iziToast.show({
                  message: res.msg,
                  position: 'bottomCenter'
                });
                $('.save-commissions').removeClass('btn-progress');
                $('.save-commissions').attr('disabled',false);
                $('.model_close').click();
                $('#defaultForm-commissions')[0].reset();
            },
            error : function(res){
                iziToast.error({
                  message: res.msg,
                  position: 'bottomCenter'
                });
                $('.save-commissions').removeClass('btn-progress');
                $('.save-commissions').attr('disabled',false);
                $('.model_close').click();
                $('#defaultForm-commissions')[0].reset();
            }
        });
        return false;
    });

    $('#defaultForm-point').bootstrapValidator({
        fields: {
            point:{
               validators: {
                    callback:{
                        message:"Points adjustment can't be equal to 0",
                        callback:function(value,validator){
                            if (value == 0) {
                                return false;
                            }
                            return true;
                        }
                    }
                } 
            }
        }
    }).on("success.form.bv",function(e){
        $('.save-point').addClass('btn-progress');
        $.ajax({
            type : "POST",
            dataType: "json",
            url : "/api/point/creat",
            data : $('#defaultForm-point').serialize(),
            success : function(res) {
                iziToast.show({
                  message: res.msg,
                  position: 'bottomCenter'
                });
                $('.save-point').removeClass('btn-progress');
                $('.save-point').attr('disabled',false);
                $('.model_close').click();
                $('#defaultForm-point')[0].reset();
            },
            error : function(res){
                iziToast.error({
                  message: res.msg,
                  position: 'bottomCenter'
                });
                $('.save-point').removeClass('btn-progress');
                $('.save-point').attr('disabled',false);
                $('.model_close').click();
                $('#defaultForm-point')[0].reset();
            }
        });
        return false;
    });

});

$(document).ready(function () {
    var point_get = ['Sign up','Celebrate a birthday','Sign in','Place an order','Follow on Twitter','Shared on Twitter','Like on Facebook','Shared on Facebook','Follow on Instagram'];
    var point_use = [money_format+' %s off coupon',money_format+' %s off coupon','%s % off coupon','Free shipping coupon','Free product'];
    function customers_load(page){
        var dom = $(".points-content .list-group-content");
        var nextdom = $(".points-content").find('.btn-next');
        var prevdom = $(".points-content").find('.btn-prev');
        var load_html = `<div class="list-group-item list-group-item-model space-between">
                            <img class="load" src="/svg/load-blue-44.svg">
                        </div>`;
        dom.html(load_html);
        $.ymqajax({
            url : "/api/point/pointlist",
            ymqtype: 'modal',
            data:{page,custome_id},
            dom: dom,
            success : function(res) {
                var html = '';
                var data = res.data.data;
                data.forEach(function (item) {
                    if (item.reward_matter == 100) {
                        point_use[item.reward_matter-1] = item.description;
                        point_get[item.reward_matter-1] = item.description;
                    }
                    html += `
                        <div class="list-group-item list-group-item-model space-between">
                        `;
                    if (item.point_prefix == 1) {
                        html += `
                            <div class="media w-30">
                                <div class="media-body space-between">
                                    <div class="inline-block">
                                        <p class="mt-0 mb-0 text-dark-1 line-h-1">${point_get[item.reward_matter-1]}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="space-between w-40">
                                <div class="inline-block">
                                    <p class="mt-0 mb-0 text-dark-1 line-h-1">${item.point} points</p>
                                    <p class="mt-0 mb-0 text-light line-h-1">has been used ${item.used_point} points</p>
                                </div>
                            </div>
                            `;
                    }else{
                        html += `
                            <div class="media w-30">
                                <div class="media-body space-between">
                                    <div class="inline-block">
                                        <p class="mt-0 mb-0 text-dark-1 line-h-1">Points spent on</p>
                                        <p class="mt-0 mb-0 text-light line-h-1">${point_use[item.reward_matter-1].replace("%s",item.get)　}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="space-between w-40">
                                <div class="inline-block">
                                    <p class="mt-0 mb-0 text-dark-1 line-h-1">-${item.point} points</p>
                                </div>
                            </div>
                            `;
                    }
                    
                    html += `
                            <div class="space-between w-30">
                                <div class="text-light">${item.createtime}</div>
                            </div>
                        </div>
                    `;
                });
                dom.html(html);
                if (res.data.current_page == 1){
                    prevdom.addClass('disabled');
                    prevdom.attr('data-page',1);
                }else{
                    prevdom.removeClass('disabled');
                    prevdom.attr('data-page',res.data.current_page-1);
                }
                if (res.data.current_page == res.data.last_page){
                    nextdom.addClass('disabled');
                    nextdom.attr('data-page',res.data.current_page);
                }else{
                    nextdom.removeClass('disabled');
                    nextdom.attr('data-page',res.data.current_page+1);
                }
            }

        });
    }
    customers_load(1);
    $(".points-content .btn-page").on('click',function () {
        if (!$(this).hasClass('disabled')){
            customers_load($(this).attr('data-page'));
        }
    });
    
});



$(document).ready(function () {
    
    var commissions_use = [money_format+' %s Money',money_format+' %s Gift cart','Free product'];
    function customers_load(page){
        var dom = $(".commissions-content .list-group-content");
        var nextdom = $(".commissions-content").find('.btn-next');
        var prevdom = $(".commissions-content").find('.btn-prev');
        var load_html = `<div class="list-group-item list-group-item-model space-between">
                            <img class="load" src="/svg/load-blue-44.svg">
                        </div>`;
        dom.html(load_html);
        $.ymqajax({
            url : "/api/commissionsapi/commissionlist",
            ymqtype: 'modal',
            data:{page,custome_id},
            dom: dom,
            success : function(res) {
                var html = '';
                var data = res.data.data;
                data.forEach(function (item) {
                    var spent_html = ``;
                    if (item.reward_matter == 100) {
                        commissions_use[item.reward_matter-1] = item.description;
                        var get_text = item.description;
                    }else if (item.reward_matter == 60) {
                        commissions_use[item.reward_matter-1] = 'audit_commission_deduction';
                    }else if (item.reward_matter == 50) {
                        var get_text = 'return_commission';
                    }else{
                        spent_html = `<p class="mt-0 mb-0 text-dark-1 line-h-1">Commissions spent on</p>`;
                        var get_text = 'Your recommended users place order';
                    }
                    html += `
                        <div class="list-group-item list-group-item-model space-between">
                        `;
                    if (item.commissions_prefix == 1) {
                        html += `
                            <div class="media w-30">
                                <div class="media-body space-between">
                                    <div class="inline-block">
                                        <p class="mt-0 mb-0 text-dark-1 line-h-1">${get_text}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="space-between w-40">
                                <div class="inline-block">
                                    <p class="mt-0 mb-0 text-dark-1 line-h-1">${item.commissions} commissions</p>
                                </div>
                            </div>
                            `;
                    }else{
                        html += `
                            <div class="media w-30">
                                <div class="media-body space-between">
                                    <div class="inline-block">
                                        ${spent_html}
                                        <p class="mt-0 mb-0 text-light line-h-1">${commissions_use[item.reward_matter-1].replace("%s",item.get)　}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="space-between w-40">
                                <div class="inline-block">
                                    <p class="mt-0 mb-0 text-dark-1 line-h-1">-${item.commissions} commissions</p>
                                </div>
                            </div>
                            `;
                    }
                    
                    html += `
                            <div class="space-between w-30">
                                <div class="text-light">${item.createtime}</div>
                            </div>
                        </div>
                    `;
                });
                dom.html(html);
                if (res.data.current_page == 1){
                    prevdom.addClass('disabled');
                    prevdom.attr('data-page',1);
                }else{
                    prevdom.removeClass('disabled');
                    prevdom.attr('data-page',res.data.current_page-1);
                }
                if (res.data.current_page == res.data.last_page){
                    nextdom.addClass('disabled');
                    nextdom.attr('data-page',res.data.current_page);
                }else{
                    nextdom.removeClass('disabled');
                    nextdom.attr('data-page',res.data.current_page+1);
                }
            }

        });
    }
    
    $(".commissions_tab").on('click',function () {
        if ($('.commissions-content .list-group-content .list-group-item').length > 0) {
            return;
        }
        customers_load(1);
    });
    //customers_load(1);
    $(".commissions-content .btn-page").on('click',function () {
        if (!$(this).hasClass('disabled')){
            customers_load($(this).attr('data-page'));
        }
    });
    
});


$(document).ready(function () {
    
    var point_get = ['Sign up','Celebrate a birthday','Sign in','Place an order','Follow on Twitter','Shared on Twitter','Like on Facebook','Shared on Facebook','Follow on Instagram'];
    var point_use = [money_format+' %s off coupon',money_format+' %s off coupon','%s % off coupon','Free shipping coupon','Free product'];
    function customers_load(page){
        var dom = $(".point-reward-content .list-group-content");
        var nextdom = $(".point-reward-content").find('.btn-next');
        var prevdom = $(".point-reward-content").find('.btn-prev');
        var load_html = `<div class="list-group-item list-group-item-model space-between">
                            <img class="load" src="/svg/load-blue-44.svg">
                        </div>`;
        dom.html(load_html);
        $.ymqajax({
            url : "/api/point/convertlist",
            ymqtype: 'modal',
            data:{page,custome_id},
            dom: dom,
            success : function(res) {
                var html = '';
                var data = res.data.data;
                data.forEach(function (item) {
                    html += `
                        <div class="list-group-item list-group-item-model space-between">
                        `;
                    
                    html += `
                        <div class="space-between w-40">
                            <div class="inline-block">
                                <p class="mt-0 mb-0 text-dark-1 line-h-1">${point_use[item.type-1].replace("%s",item.get)}</p>
                            </div>
                           
                        </div>
                        <div class="space-between w-30">
                            <div class="inline-block">
                                <p class="mt-0 mb-0 text-dark-1 line-h-1">${item.code}</p>
                            </div>
                        </div>
                        `;
                    
                    html += `
                            <div class="space-between w-30">
                                <div class="text-light">${item.createtime}</div>
                            </div>
                        </div>
                    `;
                });
                dom.html(html);
                if (res.data.current_page == 1){
                    prevdom.addClass('disabled');
                    prevdom.attr('data-page',1);
                }else{
                    prevdom.removeClass('disabled');
                    prevdom.attr('data-page',res.data.current_page-1);
                }
                if (res.data.current_page == res.data.last_page){
                    nextdom.addClass('disabled');
                    nextdom.attr('data-page',res.data.current_page);
                }else{
                    nextdom.removeClass('disabled');
                    nextdom.attr('data-page',res.data.current_page+1);
                }
            }

        });
    }
    
    $(".point-reward_tab").on('click',function () {
        if ($('.point-reward-content .list-group-content .list-group-item').length > 0) {
            return;
        }
        customers_load(1);
    });
    //customers_load(1);
    $(".point-reward-content .btn-page").on('click',function () {
        if (!$(this).hasClass('disabled')){
            customers_load($(this).attr('data-page'));
        }
    });
    
});

$(document).ready(function () {
    
    var commissions_use = [money_format+' %s Money',money_format+' %s Gift cart','Free product'];
    function customers_load(page){
        var dom = $(".commissions-reward-content .list-group-content");
        var nextdom = $(".commissions-reward-content").find('.btn-next');
        var prevdom = $(".commissions-reward-content").find('.btn-prev');
        var load_html = `<div class="list-group-item list-group-item-model space-between">
                            <img class="load" src="/svg/load-blue-44.svg">
                        </div>`;
        dom.html(load_html);
        $.ymqajax({
            url : "/api/commissionsapi/convertlist",
            ymqtype: 'modal',
            data:{page,custome_id},
            dom: dom,
            success : function(res) {
                var html = '';
                var data = res.data.data;
                data.forEach(function (item) {
                    if (item.type == 1) {
                        var code_paypal = item.paypal_email;
                        var select = `
                            <div class="form-group status-group" style="margin-bottom:0;">
                              <select class="form-control selectric status-select" data-id="${item['id']}" data-last_status="${item['status']}">
                                <option value="0" ${item['status'] == 0 ? 'selected="selected"' : ''}>Pending</option>
                                <option value="1" ${item['status'] == 1 ? 'selected="selected"' : ''}>Approved</option>
                                <option value="2" ${item['status'] == 2 ? 'selected="selected"' : ''}>Not Approved</option>
                              </select>
                            </div>
                        `;
                    }else if(item.type == 2){
                        var code_paypal = item.code;
                        var select = '';
                    }
                    html += `
                        <div class="list-group-item list-group-item-model space-between">
                        `;
                    
                    html += `
                        <div class="space-between w-20">
                           <p class="mt-0 mb-0 text-light line-h-1">${commissions_use[item.type-1].replace("%s",item.get)　}</p>
                        </div>
                        <div class="space-between w-30">
                            <div class="inline-block">
                                <p class="mt-0 mb-0 text-dark-1 line-h-1">${code_paypal}</p>
                            </div>
                        </div>
                        <div class="space-between w-20">
                            ${select}
                        </div>
                        `;
                    
                    html += `
                            <div class="space-between w-30">
                                <div class="text-light">${item.createtime}</div>
                            </div>
                        </div>
                    `;
                });
                dom.html(html);
                if (res.data.current_page == 1){
                    prevdom.addClass('disabled');
                    prevdom.attr('data-page',1);
                }else{
                    prevdom.removeClass('disabled');
                    prevdom.attr('data-page',res.data.current_page-1);
                }
                if (res.data.current_page == res.data.last_page){
                    nextdom.addClass('disabled');
                    nextdom.attr('data-page',res.data.current_page);
                }else{
                    nextdom.removeClass('disabled');
                    nextdom.attr('data-page',res.data.current_page+1);
                }
                $('.selectric').selectric();
            }

        });
    }
    
    $(".commissions-reward_tab").on('click',function () {
        if ($('.commissions-reward-content .list-group-content .list-group-item').length > 0) {
            return;
        }
        customers_load(1);
    });
    //customers_load(1);
    $(".commissions-reward-content .btn-page").on('click',function () {
        if (!$(this).hasClass('disabled')){
            customers_load($(this).attr('data-page'));
        }
    });
    $(document).on('change', '.status-select', function () {
        var status = $(this).val();
        var that = $(this);
        $.ymqajax({
            url : "/api/commissionsapi/updatestatus",
            ymqtype: 'modal',
            data:{id:$(this).data('id'),status:status,last_status:$(this).data('last_status')},
            success : function(res) {
                that.data('last_status',status)
            }
        });
    });
});





$(document).ready(function () {   
    function customers_load(page){
        var dom = $(".referral-reward-content .list-group-content");
        var nextdom = $(".referral-reward-content").find('.btn-next');
        var prevdom = $(".referral-reward-content").find('.btn-prev');
        var load_html = `<div class="list-group-item list-group-item-model space-between">
                            <img class="load" src="/svg/load-blue-44.svg">
                        </div>`;
        dom.html(load_html);
        $.ymqajax({
            url : "/api/referral/getreferralbycustomeid",
            ymqtype: 'modal',
            data:{page,custome_id},
            dom: dom,
            success : function(res) {
                var html = '';
                var data = res.data.data;
                data.forEach(function (item) {
                    html += `
                        <div class="list-group-item list-group-item-model space-between">
                            <div class="space-between w-50">
                                <div class="text-light">${item.b_email}</div>
                            </div>
                            <div class="space-between w-50">
                                <div class="text-light">${item.createtime}</div>
                            </div>
                        </div>
                    `;
                });
                dom.html(html);
                if (res.data.current_page == 1){
                    prevdom.addClass('disabled');
                    prevdom.attr('data-page',1);
                }else{
                    prevdom.removeClass('disabled');
                    prevdom.attr('data-page',res.data.current_page-1);
                }
                if (res.data.current_page == res.data.last_page){
                    nextdom.addClass('disabled');
                    nextdom.attr('data-page',res.data.current_page);
                }else{
                    nextdom.removeClass('disabled');
                    nextdom.attr('data-page',res.data.current_page+1);
                }
                $('.selectric').selectric();
            }

        });
    }
    
    $(".referral-reward_tab").on('click',function () {
        if ($('.referral-reward-content .list-group-content .list-group-item').length > 0) {
            return;
        }
        customers_load(1);
    });
    //customers_load(1);
    $(".referral-reward-content .btn-page").on('click',function () {
        if (!$(this).hasClass('disabled')){
            customers_load($(this).attr('data-page'));
        }
    });
    
});



$(document).ready(function () {
    
    var vip_get = ['Sign up','Celebrate a birthday','Sign in','Place an order','Follow on Twitter','Shared on Twitter','Like on Facebook','Shared on Facebook','Follow on Instagram'];
    var vip_use = [money_format+' %s off coupon',money_format+' %s off coupon','%s % off coupon','Free shipping coupon','Free product'];
    function customers_load(page){
        var dom = $(".vip-reward-content .list-group-content");
        var nextdom = $(".vip-reward-content").find('.btn-next');
        var prevdom = $(".vip-reward-content").find('.btn-prev');
        var load_html = `<div class="list-group-item list-group-item-model space-between">
                            <img class="load" src="/svg/load-blue-44.svg">
                        </div>`;
        dom.html(load_html);
        $.ymqajax({
            url : "/api/vip/convertlist",
            ymqtype: 'modal',
            data:{page,custome_id},
            dom: dom,
            success : function(res) {
                var html = '';
                var data = res.data.data;
                data.forEach(function (item) {
                    html += `
                        <div class="list-group-item list-group-item-model space-between">
                        `;
                    
                    html += `
                        <div class="space-between w-40">
                            <div class="inline-block">
                                <p class="mt-0 mb-0 text-dark-1 line-h-1">${vip_use[item.type-1].replace("%s",item.get)}</p>
                            </div>
                           
                        </div>
                        <div class="space-between w-30">
                            <div class="inline-block">
                                <p class="mt-0 mb-0 text-dark-1 line-h-1">${item.code}</p>
                            </div>
                        </div>
                        `;
                    
                    html += `
                            <div class="space-between w-30">
                                <div class="text-light">${item.createtime}</div>
                            </div>
                        </div>
                    `;
                });
                dom.html(html);
                if (res.data.current_page == 1){
                    prevdom.addClass('disabled');
                    prevdom.attr('data-page',1);
                }else{
                    prevdom.removeClass('disabled');
                    prevdom.attr('data-page',res.data.current_page-1);
                }
                if (res.data.current_page == res.data.last_page){
                    nextdom.addClass('disabled');
                    nextdom.attr('data-page',res.data.current_page);
                }else{
                    nextdom.removeClass('disabled');
                    nextdom.attr('data-page',res.data.current_page+1);
                }
            }

        });
    }
    
    $(".vip-reward_tab").on('click',function () {
        if ($('.vip-reward-content .list-group-content .list-group-item').length > 0) {
            return;
        }
        customers_load(1);
    });
    //customers_load(1);
    $(".vip-reward-content .btn-page").on('click',function () {
        if (!$(this).hasClass('disabled')){
            customers_load($(this).attr('data-page'));
        }
    });
    
});