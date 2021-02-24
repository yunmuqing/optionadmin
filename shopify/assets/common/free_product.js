
$(document).ready(function () {

    var free_product_ajax_data = null;
    $("#ymq-free-product").on('click',function () {
        if (free_product_ajax_data == null){
            showload();
            console.log(shop_data);
            $.ymqajax({
                url : "/api/freeproductindex/products.html",
                success : function(res) {
                    if (free_product_ajax_data == null){
                        var data = res.data;
                        console.log(data);
                        free_product_ajax_data = data;
                        var pushHtml = `<div class="htmleaf-container">
                                    <div class="container">
                                        <div class="row" id="my-gallery-container">`;
                        Object.getOwnPropertyNames(data).forEach(function(key){
                            var item = data[key];
                            pushHtml += `
                            <div class="item p-0">
                                <div class="card free-cart" data-id="${item['id']}">
                                    <div class="card-body p-0">
                                        <img style="width: 100%" src="${item['image']}" alt="" role="presentation">
                                    </div>
                                    <div class="card-footer p-0 pl-2 pr-2">
                                        <h6 class="text-dark-1 mb-2 mt-3">${item['title']}</h6>
                                        <p class="text-dark-1 text-left mb-1">${item['minVariantPrice']} - ${item['maxVariantPrice']}</p>
                                    </div>
                                </div>
                            </div>
                    `;
                        });
                        pushHtml += `</div>
                            </div>
                        </div>`;
                        $('.free-product-content').append(pushHtml);
                        $("#my-gallery-container").mpmansory(
                            {
                                childrenClass: 'item', // default is a div
                                columnClasses: 'padding', //add classes to items
                                breakpoints:{
                                    lg: 6,
                                    md: 6,
                                    sm: 6,
                                    xs: 6
                                },
                                distributeBy: { order: false, height: false, attr: 'data-order', attrOrder: 'asc' }, //default distribute by order, options => order: true/false, height: true/false, attr => 'data-order', attrOrder=> 'asc'/'desc'
                                onload: function (items) {
                                    //make somthing with items
                                }
                            }
                        );
                        $('.free-cart').on('click',function (e) {
                            cart_fixed();
                            show_variants_data($(this).attr('data-id'));
                            console.log(free_product_ajax_data[$(this).attr('data-id')]);
                            e.stopPropagation();
                        });

                        $('.cart-fixed-box,.cart-fixed-box .doclose').on("click", function() {
                            if (!$(this).hasClass('disabled')){
                                cart_fixed();
                                setTimeout(function () {
                                    left_fixed();
                                },300);
                            }
                        });
                        $('.cart-fixed-box').on("click", ".cart-fixed-do-css3", function(e) {
                            e.stopPropagation();
                        });
                    }
                }
            });
        }

        function show_variants_data(id,num = 0) {
            $('.do-count-box .count').attr('data-num',num).attr('data-id',id);
            console.log(free_product_ajax_data[id]['variants'][num]);
            $('.cart-fixed .card-header img').attr('src',free_product_ajax_data[id]['variants'][num]['image']);
            $('.cart-fixed .card-header .price').html(shop_data['money_format'] + free_product_ajax_data[id]['variants'][num]['price']);

            var need_html = '';
            if (free_product_ajax_data[id]['variants'][num]['point'] > 0 && shop_data.branding.setting.point.status == 1){
                need_html += `<span data-value="${free_product_ajax_data[id]['variants'][num]['point']}" class="point-span need-value">${free_product_ajax_data[id]['variants'][num]['point']*$('.count-box .count').val()}</span>
                ${__('points')}`;
            }
            if (shop_data.branding.setting.point.status == 1 && shop_data.branding.setting.commission.status == 1) {
                need_html += ` / `;
            }
            if (free_product_ajax_data[id]['variants'][num]['commission'] > 0 && shop_data.branding.setting.commission.status == 1){
                need_html += `<span data-value="${free_product_ajax_data[id]['variants'][num]['commission']}" class="commission-span need-value">${free_product_ajax_data[id]['variants'][num]['commission']*$('.count-box .count').val()}</span>
                ${__('commissions')}`;
            }
            $('.cart-fixed .card-header .need').html(need_html);

            var select_arr = [];
            free_product_ajax_data[id]['variants'][num]['selectedOptions'].forEach(function (item) {
                select_arr.push(item['value']);
            });
            $('.cart-fixed .card-header .title').html(free_product_ajax_data[id]['variants'][num]['title'] + ' (' + select_arr.join(' / ') + ')');
            var variants = free_product_ajax_data[id]['variants'];
            var variants_options = new Object();
            function makevariant(obj,value,index,total,variants_id){
                // console.log(index,total);
                if (!obj.hasOwnProperty(value[index]['value'])){
                    if (index+1 == total){
                        obj[value[index]['value']] = variants_id;
                    }else {
                        obj[value[index]['value']] = {};
                    }
                }

                if (index+1 < total){
                    makevariant(obj[value[index]['value']],value,index+1,total,variants_id);
                }
            }

            variants.forEach(function (item,index) {
                if (select_arr.length == 0 && index == 0){
                    item['selectedOptions'].forEach(function (v) {
                        select_arr.push(v['value']);
                    });
                }

                makevariant(variants_options,item['selectedOptions'],0,item['selectedOptions'].length,item['variant_id']);
            });
            var options = free_product_ajax_data[id]['options'];
            var html = '';
            options.forEach(function (option,key) {
                html += `<h6 class="text-dark">${option['name']}</h6>`;
                var values = option['values'];
                html += `<div class="options mb-2">`;
                var thischild = variants_options;
                for (var i=0; i<=key; i++){
                    if ((i - 1) >= 0){
                        thischild = thischild[select_arr[i-1]];
                    }
                }
                values.forEach(function (value) {
                    var disabled = true;
                    if (thischild.hasOwnProperty(value)){
                        disabled = false;
                    }
                    html += `<div data-index="${key}" data-id="${id}" class="option cursor-pointer text-dark ${select_arr[key] == value ? 'active' : ''} ${disabled ? 'disabled' : ''}">${value}</div>`;
                });
                html += `</div>`;
            });


            $(".options-box").html(html);


            $('.options-box .options .option').on('click',function (e) {
                var that = $(this);
                if(that.hasClass('disabled') || that.hasClass('active')){
                    return false;
                }
                select_arr[that.attr('data-index')] = that.html();
                var item = 0;
                free_product_ajax_data[id]['variants'].forEach(function (variant,key) {
                    var options = variant['selectedOptions'];
                    var is = true;
                    options.forEach(function (option,index) {
                        if (option['value'] != select_arr[index]){
                            is = false;
                        }
                    });
                    if (is){
                        item = key;
                    }
                });
                if (item == 0){
                    try {
                        free_product_ajax_data[id]['variants'].forEach(function (variant,key) {

                            if (variant['selectedOptions'][that.attr('data-index')]['value'] == that.html()){
                                item = key;
                                throw new Error("LoopTerminates");
                            }
                        });
                    } catch (e) {
                        if (e.message !== "LoopTerminates") throw e;
                    };

                }
                show_variants_data($(this).attr('data-id'),item);
                e.stopPropagation();
            });

            var pay_html = '';
            var show_pay_type = $('.do-count-box .count').attr('data-pay-type');

            if (free_product_ajax_data[id]['variants'][num]['point'] != 0 && free_product_ajax_data[id]['variants'][num]['commission'] != 0){
                if (!show_pay_type){
                    show_pay_type = 1;
                    $('.do-count-box .count').attr('data-pay-type',show_pay_type);
                }
                if (shop_data.branding.setting.point.status == 1) {
                    pay_html += `
                        <div data-type="1" class="pay-method-option cursor-pointer text-dark ${show_pay_type == 1 ? 'active' : ''}">${__('point')}</div>
                    `;
                }else{
                    show_pay_type = 2;
                    $('.do-count-box .count').attr('data-pay-type',show_pay_type);
                }
                if (shop_data.branding.setting.commission.status == 1) {
                    pay_html += `
                        <div data-type="2" class="pay-method-option cursor-pointer text-dark ${show_pay_type == 2 ? 'active' : ''}">${__('commission')}</div>
                    `;
                }
            }else{
                if (free_product_ajax_data[id]['variants'][num]['point'] != 0 && shop_data.branding.setting.point.status == 1){
                    show_pay_type = 1;
                }else{
                    show_pay_type = 2;
                }
                $('.do-count-box .count').attr('data-pay-type',show_pay_type);
                if (shop_data.branding.setting.point.status == 1) {
                    pay_html += `
                        <div data-type="1" class="pay-method-option cursor-pointer text-dark ${free_product_ajax_data[id]['variants'][num]['point'] == 0 ? 'disabled' : 'active'}">${__('point')}</div>
                    `;
                }
                if (shop_data.branding.setting.commission.status == 1) {
                    pay_html += `
                        <div data-type="2" class="pay-method-option cursor-pointer text-dark ${free_product_ajax_data[id]['variants'][num]['commission'] == 0 ? 'disabled' : ''} ${free_product_ajax_data[id]['variants'][num]['point'] == 0 ? 'active' : ''}">${__('commission')}</div>
                    `;
                }
            }
            $('.pay-method').html(pay_html);

            go_to_checkout();
            $('.pay-method-box .pay-method-option').on('click',function (e) {
                var that = $(this);
                if(that.hasClass('disabled') || that.hasClass('active')){
                    return false;
                }
                $('.pay-method-box .pay-method-option.active').removeClass('active');
                $(this).addClass('active');
                $('.do-count-box .count').attr('data-pay-type',$(this).attr('data-type'));
                go_to_checkout();
                e.stopPropagation();
            });




        }






    });

    $(".do-count-box .icon-item").on('click',function () {
        var dom = $(this).parent().children('.count');
        var value = dom.val();
        value = value - ($(this).attr('data-math')*-1);
        if (value < 1){
            value = 1;
        }
        dom.val(value);
        fresh_need(value);
        go_to_checkout();

    });

    $(".go_to_checkout").on('click',function (e) {
        if (!$(this).hasClass('disabled')){
            if ($(this).attr('do-sign')){
                console.log('登录');
            }else{

                address($('.choose-address').attr('data-index'));
                var dom = $('.do-count-box .count');
                console.log($('.do-count-box .count').attr('data-num'),free_product_ajax_data);
                var data = free_product_ajax_data[dom.attr('data-id')];
                $('.confirm-order-img').attr('src',data['variants'][dom.attr('data-num')]['image']);
                $('.confirm-order-title').html(data['title']);
                var option_html = [];
                data['variants'][dom.attr('data-num')]['selectedOptions'].forEach(function (item) {
                    option_html .push(item['value']);
                });
                $('.confirm-order-option').html(option_html.join(' / '));
                $('.confirm-order-price').html(shop_data['money_format'] + data['variants'][dom.attr('data-num')]['price']);
                $('.confirm-order-pay-type').html(dom.attr('data-pay-type') == 1 ? __('points') : __('commissions'));
                $('.confirm-order-need-type,.confirm-order-total-type').html(dom.attr('data-pay-type') == 1 ? __('points') : __('commissions'));
                $('.confirm-order-need').html(dom.attr('data-pay-type') == 1 ? data['variants'][dom.attr('data-num')]['point'] : data['variants'][dom.attr('data-num')]['commission']);
                $('.confirm-order-count').html('x' + dom.val());
                $('.confirm-order-total').html(dom.attr('data-pay-type') == 1 ? data['variants'][dom.attr('data-num')]['point']*dom.val() : data['variants'][dom.attr('data-num')]['commission']*dom.val());
            }
        }
        e.stopPropagation();
    });
    $('.doleftfixed').on("click",function() {
        if(!$(this).hasClass('disabled')){
            left_fixed($($(this).attr('data-dom')));
        }
    });

    $('.jump-to-add-address').on('click',function () {
        before_init_address_form();
    });

    $('.do_checkout').on('click',function () {
        var dom = $('.do-count-box .count');
        var variant_data = free_product_ajax_data[dom.attr('data-id')]['variants'][dom.attr('data-num')];

        var data = {};
        if (free_product_order_ajax_data != null){
            var order = {};
            order['image'] = $('.confirm-order-img').attr('src');
            order['money'] = (dom.attr('data-pay-type') == 1 ? variant_data['point'] : variant_data['commission'])*dom.val();
            order['pay_type'] = dom.attr('data-pay-type');
            order['price'] = variant_data['price'];
            order['quantity'] = dom.val();
            order['title'] = variant_data['title'];
        }
        data['variant_id'] = variant_data['variant_id'];
        data['quantity'] = dom.val();
        data['pay_type'] = dom.attr('data-pay-type');
        // dom.attr('data-pay-type') == 1 ? data['variants'][dom.attr('data-num')]['point'] : data['variants'][dom.attr('data-num')]['commission']
        var address = null;
        var index = $('.choose-address').attr('data-index');
        if (index == 'defalut'){
            if (customeinfo['default_address']){
                address = customeinfo['default_address'];
            }
        }else {
            if (customeinfo['addresses'][index]){
                address = customeinfo['addresses'][index];
            }
        }

        data['address'] = address;
        console.log(data);
        $('.do_checkout').addClass('btn-progress');
        $('.cart-fixed-box').addClass('disabled');
        $('.doleftfixed').addClass('disabled');
        $.ymqajax({
            url : "/api/freeproductindex/creat.html",
            data:{data},
            success : function(res) {
                console.log(res);

                if (free_product_order_ajax_data != null){
                    order['cancelledAt'] = null;
                    order['closed'] = false;
                    order['createdAt'] = res['data']['created_at']['date'];
                    order['date'] = res['data']['created_at']['date'];
                    order['displayFulfillmentStatus'] = 'UNFULFILLED';
                    order['id'] = res['data']['id'];
                    order['variantTitle'] = res['data']['line_items'][0]['variant_title'];
                    free_product_order_ajax_data.unshift(order);
                    free_product_order_content();
                }
                console.log(availablePoint,availableCommissions);
                if (dom.attr('data-pay-type') == 1){
                    availablePoint -= (variant_data['point']*dom.val());
                    $('#ymq-point').attr('data-header_detail',$('#ymq-point').attr('data-header_detail')-(variant_data['point']*dom.val()));
                }else{
                    availableCommissions -= (variant_data['commission']*dom.val());
                    $('#ymq-commission').attr('data-header_detail',$('#ymq-commission').attr('data-header_detail')-(variant_data['commission']*dom.val()));

                }
                // console.log(availablePoint,availableCommissions);
                $('.cart-fixed-box').removeClass('disabled').trigger('click');
                // $('.top-goback').trigger('click');
                // showload();
                setTimeout(function () {
                    $("#ymq-free-product-order").addClass('triggertab2').trigger('click');
                },100);


            },
            complete: function (xhr) {
                $('.do_checkout').removeClass('btn-progress');
                $('.cart-fixed-box').removeClass('disabled');
                $('.doleftfixed').removeClass('disabled');
            }
        });
        // dom.remove();
        // customeinfo['addresses'].splice(index,1);
        //
        // left_fixed($('.address-add-fixed'));

    });

    $('.choose-address').on("click", function() {
        var addresses = customeinfo['addresses'];
        var id = 0;
        if ($(this).attr('data-index') == 'defalut'){
            if (customeinfo['default_address']){
                id = customeinfo['default_address']['id'];
            }
        }else{
            if (customeinfo['addresses']){
                id = customeinfo['addresses'][$(this).attr('data-index')]['id'];
            }
        }
        var html = '';
        addresses.forEach(function (address,index) {
            html += `
                <div data-index="${index}" id="address-item-${address['id']}" class="choose-address-item order-cart pl-2 pr-2 pt-2 pb-2 space-between mb-3 order-addrss-cart cursor-pointer ${address['id'] == id ? 'border-color' : ''}">
                    <div>
                        <p class="mb-0">${address['address1'] == null ? '' : address['address1']} ${address['address2'] == null ? '' : address['address2']} ${address['city'] == null ? '' : address['city']}</p>
                        <p class="mb-0">${address['zip'] == null ? '' : address['zip']} ${address['province'] == null ? '' : address['province']}</p>
                        <p class="mb-0">${address['name'] == null ? '' : address['name']} ${address['phone'] == null ? '' : address['phone']}</p>
                    </div>
                    <div data-index="${index}" class="cursor-pointer edit-address-item">
                        <svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2977"><path d="M728.688641 380.509705L540.028987 196.968723 136.385074 599.881396l-70.198941 257.396118 256.664879-70.93018L728.688641 380.509705zM884.442542 225.487043a132.354254 132.354254 0 0 0 0-186.465938 130.891776 130.891776 0 0 0-186.465938 0L596.334387 139.932083l189.390894 183.540982zM34.742857 933.326368h954.266858V1024H34.742857z" fill="#757D91" p-id="2978"></path></svg>
                    </div>
                </div>
            `;
        });
        $(".address-fixed .card-body").html(html);
        $('.choose-address-item').on('click',function () {
            left_fixed($('.address-fixed'));
            $('.choose-address').attr('data-index',$(this).attr('data-index'));
            address($(this).attr('data-index'));
        });
        $('.edit-address-item').on('click',function (e) {
            left_fixed($('.address-add-fixed'));
            before_init_address_form($(this).attr('data-index'));
            e.stopPropagation();
        });

    });
    $('.address-add-fixed-delete').on('click',function () {
        if (!$(this).hasClass('disabled')){
            var id = $(this).attr('data-id');
            var index = $(this).attr('data-index');
            var dom = $(`#address-item-${id}`);
            $.ymqajax({
                url : "/api/freeproductindex/addressdelete.html",
                data:{id},
                success : function(res) {
                }
            });
            dom.remove();
            customeinfo['addresses'].splice(index,1);

            left_fixed($('.address-add-fixed'));
        }
    });
    $('.do-save-address').on("click", function() {
        var that = $(this);
        var data = {};
        $('.address-add-fixed input').each(function () {
            if (!$(this).attr('disabled')){
                if ($(this).attr('name') == 'country'){
                    if ($(this).val() != '---'){
                        data[$(this).attr('name')] = $(this).val();
                    }
                }else if ($(this).attr('name') == 'set_default'){
                    if ($(this).is(':checked')){
                        data['set_default'] = 1;
                    }else{
                        data['set_default'] = 0;
                    }
                }else{
                    if ($(this).val() != ''){
                        data[$(this).attr('name')] = $(this).val();
                    }
                }
            }
        });
        that.addClass('btn-progress');
        $('.address-add-fixed #address-country').addClass('disabled');
        $('.address-add-fixed #address-province').addClass('disabled');
        $('.cart-fixed-box').addClass('disabled');
        $('.doleftfixed').addClass('disabled');
        $('.address-add-fixed-delete').addClass('disabled');
        $.ymqajax({
            url : "/api/freeproductindex/address.html",
            data:{data},
            success : function(res) {
                console.log(res);
                if (res.code == 1){
                    left_fixed($('.address-add-fixed'));
                    left_fixed($('.address-fixed'));
                    var index = null;
                    if (that.attr('data-index')){
                        index = that.attr('data-index');
                        customeinfo['addresses'][index] = res['data'];

                    }else{
                        customeinfo['addresses'].push(res['data']);
                        index = customeinfo['addresses'].length - 1;
                    }
                    if (data['set_default'] == 1){
                        customeinfo['default_address'] = res['data'];
                    }
                    $('.choose-address').attr('data-index',index);
                    address(index);

                }

            },
            complete: function (xhr) {
                that.removeClass('btn-progress');
                $('.address-add-fixed #address-country').removeClass('disabled');
                $('.address-add-fixed #address-province').removeClass('disabled');
                $('.cart-fixed-box').removeClass('disabled');
                $('.doleftfixed').removeClass('disabled');
                $('.address-add-fixed-delete').removeClass('disabled');
            }
        });
    });

    function cart_fixed() {
        if (!$(".cart-fixed-do-css3").hasClass('showcss')) {
            $(".cart-fixed-do-css3").addClass('showcss').removeClass('hidecss');
            $(".cart-fixed-box").show();
            $(".in-top-content").css('overflow-y','hidden');
        }else{
            $(".cart-fixed-do-css3").addClass('hidecss').removeClass('showcss');
            $(".in-top-content").css('overflow-y','scroll');
            setTimeout(function(){
                $(".cart-fixed-box").hide();
                $(".order-fixed").addClass('lefthidecss').removeClass('leftshowcss');
            },300);
        }
    }

    function left_fixed(dom = null) {
        if (dom){
            if (!dom.hasClass('leftshowcss')) {
                dom.addClass('leftshowcss').removeClass('lefthidecss');
            }else{
                dom.addClass('lefthidecss').removeClass('leftshowcss');
            }
        }else{
            $('.left-fixed').removeClass('lefthidecss').removeClass('leftshowcss');
        }
    }

    //id (新增) (编辑)
    function before_init_address_form(index = null) {
        if (ymq_shopify_address_init != null){
            init_address_form(index);
        }else{
            var data = {
                auth: 'ymq',
                action: 'get-ymq-address-init-data',
                data:{}
            };
            window.parent.postMessage(data, "*");
            intervalResult(100,100,function(){
                if(ymq_shopify_address_init != null){

                    console.log('自旋',ymq_shopify_address_init);
                    init_address_form(index);
                    return true;
                }
                return false;
            });
        }
    }

    function init_address_form(index) {
        if (ymq_shopify_address_country_init == null){
            ymq_shopify_address_country_init = [];
            var country_html = `
                <select id="test" style="display: none;">
                    ${ymq_shopify_address_init['country']['option']}
                </select>
            `;
            $('.address-add-fixed .card-body').html(country_html);
            $('#test option').each(function () {
                var data = {};
                data['name'] = $(this).html();
                data['value'] = $(this).attr('value');
                var province = $(this).attr('data-provinces');
                
                if (province != "[]"){
                    console.log(typeof province);
                    province = province.substring(2,province.length - 2);
                    province = province.split('],[');
                    province.forEach(function (value,key) {
                        value = value.split(',');
                        value.forEach(function (v,k) {
                            value[k] = v.substring(1,v.length - 1);
                        });
                        province[key] = value;
                    });
                }else{
                    province = '';
                }
                data['province'] = province;
                ymq_shopify_address_country_init.push(data);
            });
            console.log(ymq_shopify_address_country_init);
        }

        var html = '';
        var edit_address = '';
        var country_index = 0;
        var province_index = 0;
        var isDefalut = false;
        if (index != null){
            edit_address = customeinfo['addresses'][index];
            $('.address-add-fixed .card-header .address-add-fixed-html').html('Edit Address');
            $('.address-add-fixed .card-header .address-add-fixed-delete').show().attr('data-id',edit_address['id']).attr('data-index',index);
            $('.address-add-fixed .card-footer button').html('Edit').attr('data-index',index);

            html += `<input value="${edit_address['id']}" type="hidden" name="id">`;
            if (edit_address['id'] == customeinfo['default_address']['id']){
                isDefalut = true;
                $('.address-add-fixed .card-header .address-add-fixed-delete').hide().removeAttr('data-id').removeAttr('data-index');
            }
        }else{
            $('.address-add-fixed .card-header .address-add-fixed-html').html('Add Address');
            $('.address-add-fixed .card-header .address-add-fixed-delete').hide().removeAttr('data-id').removeAttr('data-index');
            $('.address-add-fixed .card-footer button').html('Save').removeAttr('data-index');
        }
        console.log(edit_address);
        country_index = -1;
        province_index = -1;
        try {
            ymq_shopify_address_country_init.forEach(function (item,index) {
                if (item['value'] == edit_address['country']){
                    country_index = index;
                    throw new Error("EndIterative");
                }
            });
        } catch(e) {
            if(e.message!="EndIterative") throw e;
        };

        if (country_index != -1 && ymq_shopify_address_country_init[country_index]['province']){
            try {
                ymq_shopify_address_country_init[country_index]['province'].forEach(function (item,index) {
                    if (item[1] == edit_address['province']){
                        province_index = index;
                        console.log('eee',province_index);
                        throw new Error("EndIterative");
                    }
                });
            } catch(e) {
                if(e.message!="EndIterative") throw e;
            };

        }



        Object.getOwnPropertyNames(ymq_shopify_address_init).forEach(function(key){
            var data = ymq_shopify_address_init[key];

            if (data['type'] == 'text'){
                html += `
                        <div class="form-group">
                            <label for="address-${key}">${data['label']}</label>
                            <input value="${edit_address ? (edit_address[key] == null ? '' : edit_address[key]) : ''}" id="address-${key}" type="text" name="${key}" class="form-control">
                        </div>
                    `;
            }
            console.log(country_index,province_index)
            if(key == 'country'){

                html += `<div class="country-form-group">`;
                html += `
                        <div class="form-group cursor-pointer country-input">
                            <label for="address-${key}">${data['label']}</label>
                            <input readonly style="background: #fff;" data-index="${country_index}" value="${country_index == -1 ? '' : ymq_shopify_address_country_init[country_index]['value']}" id="address-${key}" type="text" name="${key}" class="form-control">
                        </div>
                    `;
                if (country_index != -1 && ymq_shopify_address_country_init[country_index]['province']){
                    console.log(ymq_shopify_address_init['province']);
                    html += `
                        <div class="form-group cursor-pointer">
                            <label for="address-province">${ymq_shopify_address_init['province']['label']}</label>
                            <input readonly style="background: #fff;" data-index="${province_index}" value="${province_index == -1 ? '' : ymq_shopify_address_country_init[country_index]['province'][province_index][1]}" id="address-province" type="text" name="province" class="form-control">
                        </div>
                    `;
                }else{
                    html += `
                        <div class="form-group cursor-pointer" style="display: none;">
                            <label for="address-province">${ymq_shopify_address_init['province']['label']}</label>
                            <input readonly disabled style="background: #fff;" data-index="${province_index}" value="" id="address-province" type="text" name="province" class="form-control">
                        </div>
                    `;
                }


                html += `</div>`;
            }

        });
        html += `
            <label class="custom-switch mt-2 pl-0">
                <input type="checkbox" ${isDefalut ? 'checked' : ''} name="set_default" class="custom-switch-input">
                <span class="custom-switch-indicator"></span>
                <span class="custom-switch-description">${ymq_shopify_address_init['set_default']['label']}</span>
            </label>
        `;
        $('.address-add-fixed .card-body').html(html);
        $('.address-add-fixed #address-country').on('click',function () {
            if (!$(this).hasClass('disabled')){
                left_fixed($('.country-fixed'));
                choose_country_html($(this).attr('data-index'));
            }

        });
        $('.address-add-fixed #address-province').on('click',function () {
            if (!$(this).hasClass('disabled')){
                left_fixed($('.country-fixed'));
                choose_province_html($('.address-add-fixed #address-country').attr('data-index'),$(this).attr('data-index'));
            }
        });
    }

    function choose_province_html(i1 = 0,i2 = 0) {
        var data = ymq_shopify_address_country_init[i1]['province'];
        var html = '<ul class="list-group">';
        data.forEach(function (value,index) {
            html += `
                <li data-index="${index}" data-value="${value[1]}" class="list-group-item ${i2 == index ? 'active' : ''}">${value[0]}</li>
            `;
        });
        html += '</ul>';
        $('.country-fixed .card-body').html(html);
        $('.country-fixed .card-body .list-group-item').on('click',function () {
            if (!$(this).hasClass('active')){
                refresh_province(i1,$(this).attr('data-index'));
            }
            left_fixed($('.country-fixed'));
        });
    }

    function choose_country_html(i = 0) {
        var html = '<ul class="list-group">';
        ymq_shopify_address_country_init.forEach(function (value,index) {
            html += `
                <li data-index="${index}" data-value="${value['value']}" class="list-group-item ${i == index ? 'active' : ''}">${value['name']}</li>
            `;
        });
        html += '</ul>';
        $('.country-fixed .card-body').html(html);
        $('.country-fixed .card-body .list-group-item').on('click',function () {
            if (!$(this).hasClass('active')){
                refresh_country($(this).attr('data-index'));
                refresh_province($(this).attr('data-index'),0);
            }
            left_fixed($('.country-fixed'));
        });
    }
    function refresh_country(index) {
        var data = ymq_shopify_address_country_init[index];
        $('.address-add-fixed .card-body #address-country').val(data['value']).attr('data-index',index);
    }
    function refresh_province(index1,index2) {
        var data = ymq_shopify_address_country_init[index1]['province'];
        if (data){
            data = data[index2];
            $('.address-add-fixed .card-body #address-province').val(data[1]).attr('disabled',false).attr('data-index',index2).parent('.form-group').show();
        }else{
            $('.address-add-fixed .card-body #address-province').val('').attr('disabled',true).parent('.form-group').hide();
        }
        // console.log($('.address-add-fixed .card-body #address-province').val());
    }
    function address(index = 'defalut') {
        var address = null;
        if (index == 'defalut'){
            if (customeinfo['default_address']){
                address = customeinfo['default_address'];
            }
        }else {
            if (customeinfo['addresses'][index]){
                address = customeinfo['addresses'][index];
            }
        }
        if(address){
            $(".order-addrss-cart .addrss-line-1").html(
                `${address['address1'] == null ? '' : address['address1']} ${address['address2'] == null ? '' : address['address2']} ${address['city'] == null ? '' : address['city']}`
            ).removeClass('pt-3').removeClass('pb-3');
            $(".order-addrss-cart .addrss-line-2").html(
                `${address['zip'] == null ? '' : address['zip']} ${address['province'] == null ? '' : address['province']}`
            );
            $(".order-addrss-cart .addrss-line-3").html(
                `${address['name'] == null ? '' : address['name']} ${address['phone'] == null ? '' : address['phone']}`
            );
        }else{
            $(".order-addrss-cart .addrss-line-1").html(__('set_shipping_address')).addClass('pt-3').addClass('pb-3');
            $(".order-addrss-cart .addrss-line-2").html();
            $(".order-addrss-cart .addrss-line-3").html();
        }

    }

    function fresh_need(count) {
        $('.need').children('.need-value').each(function () {
            $(this).html($(this).attr('data-value')*count);
        });
    }

    function intervalResult(maxCount,time,flgBool,loopFn){
        if(typeof maxCount=="function"){
            loopFn=time;
            flgBool=maxCount;
            time=1000;
            maxCount=20;
        }
        else if(typeof time=="function"){
            loopFn=flgBool;
            flgBool=time;
            time=1000;
        }
        if(typeof flgBool!="function"){
            flgBool=function(){
                return false;
            }
        }
        var i=0;
        var invSet=setInterval(function(){
            i++;
            if(i>maxCount||flgBool(i)){
                clearInterval(invSet);
                return;
            }
            if(typeof loopFn=="function"){
                loopFn();
            }
        },time);
    }

    function go_to_checkout(){
        if (!customeinfo){
            $('.go_to_checkout').html('Sign In').attr('do-sign','1');
        }else{
            var pay_type = $('.do-count-box .count').attr('data-pay-type');
            var money = 0;
            if(pay_type == 1){
                money = $('.need .point-span').html();
            }else{
                money = $('.need .commission-span').html();
            }
            var iHave = 0;
            var msg = '';
            if (pay_type == 1){
                iHave = availablePoint;
                msg = __('not_enough_points');
            }else{
                iHave = availableCommissions;
                msg = __('not_enough_commissions');
            }
            if (money > iHave){
                $('.go_to_checkout').html(msg).addClass('disabled');
            }else {
                $('.go_to_checkout').html('Go To Checkout').removeClass('disabled');
            }
        }
        console.log(customeinfo);
    }


});

var free_product_order_ajax_data = null;
function free_product_order_content() {
    $('.free-product-order-content').html();
    var html = '';
    free_product_order_ajax_data.forEach(function (item) {
        html += `
                <div class="card">
                    <div class="card-header pt-2 pb-2 pl-2 pr-2">
                        <div class="text-dark">${setDate(item['date'])}</div>
                        <div>
                            ${item['closed'] ? 'Archived' : item['displayFulfillmentStatus']}
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="item1">
                            <img src="${item['image']}" alt="">
                        </div>
                        <div class="item2 pl-3">
                            <p>${item['title']}</p>
                            <p>${item['variantTitle']}</p>
                        </div>
                        <div class="item3 pl-3">
                            <p>${shop_data['money_format']}${item['price']}</p>
                        </div>
                    </div>
                    <div class="card-footer pt-0 pb-2 pl-2 pr-2">
                        ${__('spent')} ${item['money']}  ${item['pay_type'] == 1 ? __('points') : _('commissions')} 
                    </div>
                </div>
            `;
    });
    $('.free-product-order-content').html(html);

}
$(document).ready(function () {
    $("#ymq-free-product-order").on('click',function () {
        if (free_product_order_ajax_data == null){
            showload();
            $.ymqajax({
                url : "/api/freeproductindex/order.html",
                success : function(res) {
                    if (free_product_order_ajax_data == null){
                        free_product_order_ajax_data = res['data'];
                        if (free_product_order_ajax_data){
                            free_product_order_content();
                        }
                    }
                }
            });
        }
    });    
});