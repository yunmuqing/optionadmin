$(document).ready(function () {
    var free_products = {};
    var all_free_products = {};
    function customers_load(page,search){
        var dom = $(".list-group-content");
        var parentdom = dom.parents('.list-group');
        var nextdom = parentdom.find('.btn-next');
        var prevdom = parentdom.find('.btn-prev');
        var load_html = `<div class="list-group-item list-group-item-model space-between">
                            <img class="load" src="/svg/load-blue-44.svg">
                        </div>`;
        dom.html(load_html);
        var status = parentdom.find('.status').val();
        $.ymqajax({
            url : "/api/freeproduct.html",
            ymqtype: 'modal',
            data:{page,search,status},
            dom: dom,
            success : function(res) {
                console.log(res);
                if (!res.data){
                    return;
                }
                if(!search){
                    free_products = {};
                }
                if(res.code == 1){
                    var html = '';
                    var data = res.data.data.data;
                    var allData = res.data.allData;
                    console.log(res);
                    allData.forEach(function (item) {
                        if (!all_free_products.hasOwnProperty(item['product_id'])){
                            all_free_products[item['product_id']] = [];
                        }
                        all_free_products[item['product_id']].push(item['variant_id']);
                    });

                    data.forEach(function (item) {
                        if(!search){
                            if (!free_products.hasOwnProperty(item['product_id'])){
                                free_products[item['product_id']] = [];
                            }
                            free_products[item['product_id']].push(item['variant_id']);
                        }

                        html += `
                        <div class="list-group-item list-group-item-model space-between">
                            <figure class="avatar mr-4">
                                <img src="${item['image']}" alt="" role="presentation">
                            </figure>
                            <div class="media-body">
                                <div class="inline-block">
                                    <p class="mt-0 mb-0 text-dark-1 line-h-1">${item['title']}</p>
                                    <p class="mt-0 mb-0 text-light line-h-1">${item['selectedOptions']}</p>
                                    <p class="mt-0 mb-0 text-light line-h-1">${item['price']}</p>
                                </div>
                            </div>
                            <div class="media-body">
                                <div class="inline-block">
                                    <p class="mt-0 mb-0 text-dark-1 line-h-1">${item['point']} points</p>
                                    <p class="mt-0 mb-0 text-light line-h-1">${item['commission']} commissions</p>
                                    <p class="mt-0 mb-0 text-light line-h-1">${item['time']} referrals</p>
                                </div>
                            </div>
                            <div class="media-body flex-end">
                                <div class="inline-block">
                                    <p
                                     data-variant_id="${item['variant_id']}"
                                     class="mt-0 mb-0 text-primary line-h-1 docopy">Copy</p>
                                    <p 
                                    data-variant_id="${item['variant_id']}"
                                    data-product_id="${item['product_id']}" 
                                    data-point="${item['point']}"
                                    data-commission="${item['commission']}"
                                    class="mt-0 mb-0 text-primary line-h-1 doedit">Edit</p>
                                    <p
                                     data-variant_id="${item['variant_id']}"
                                     class="mt-0 mb-0 text-primary line-h-1 dodelete">Delete</p>
                                </div>
                            </div>
                        </div>
                    `;
                    });
                    console.log(free_products);

                    dom.html(html);
                    copyModal($(".docopy"));
                    $(".doedit").on('click', function(){
                        var data = {};

                        chooseModal($(this),true);
                        $('.datetimepicker').daterangepicker({
                            locale: {format: 'YYYY-MM-DD hh:mm'},
                            singleDatePicker: true,
                            timePicker: true,
                            timePicker24Hour: true,
                        });
                    });
                }

                prevdom.attr('data-search',search);
                nextdom.attr('data-search',search);
                if (res.data.data.current_page == 1){
                    prevdom.addClass('disabled');
                    prevdom.attr('data-page',1);
                }else{
                    prevdom.removeClass('disabled');
                    prevdom.attr('data-page',res.data.data.current_page-1);
                }
                if (res.data.data.current_page == res.data.data.last_page){
                    nextdom.addClass('disabled');
                    nextdom.attr('data-page',res.data.data.current_page);
                }else{
                    nextdom.removeClass('disabled');
                    nextdom.attr('data-page',res.data.data.current_page+1);
                }
            }

        });
    }
    customers_load(1,null);
    $(".btn-page").on('click',function () {
        if (!$(this).hasClass('disabled')){
            customers_load($(this).attr('data-page'),$(this).attr('data-search'));
        }
    });
    var customers_timeout;
    $(".search-input").on('input', function () {
        clearTimeout(customers_timeout);
        var input = $(this);
        customers_timeout = setTimeout(function() {
            customers_load(1,input.val());
        }, 1000);
    });
    ajaxModal($('.add-free-product'));

    function ajaxModal(dom){
        dom.each(function () {
            var that = $(this);
            $(this).ajaxModal({
                center: true,
                title: 'Choose Free Product',
                headerhtml: '<ul class="list-group list-group-flush border-top">\n' +
                    '    <li class="list-group-item">\n' +
                    '        <div class="form-group margin-bottom-0">\n' +
                    '            <div class="input-group">\n' +
                    '                <div class="input-group-prepend">\n' +
                    '                    <div class="input-group-text">\n' +
                    '                        <i class="fas fa-search"></i>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '                <input type="text" class="form-control currency search-input" placeholder="Search Products">\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </li>\n' +
                    '</ul>',
                body: '<img class="load" src="/svg/load-blue-44.svg">',
                url: '/api/shopifydata/products.html',
                ajaxSuccess: function(res,modal){
                    showHtml(res,modal,$('.add-free-product'));
                    // console.log(modal.find('.choose').length);
                    
                    $(".choose").on('click',function(){
                        chooseModal($(this));
                        $('.datetimepicker').daterangepicker({
                            locale: {format: 'YYYY-MM-DD hh:mm'},
                            singleDatePicker: true,
                            timePicker: true,
                            timePicker24Hour: true,
                        });
                        modal.modal('hide');
                    });

                    modal.on('hidden.bs.modal', function() {
                        modal.find(".search-input").val('');
                    });

                },
                buttons: [
                    {
                        text: 'Cancel',
                        class: 'btn btn-secondary btn-shadow',
                        handler: function(modal) {
                            modal.modal('hide');
                        }
                    }
                ],
                appended: function (dom, modal_form, options) {
                    var timeout;
                    dom.find(".search-input").on('input', function () {
                        clearTimeout(timeout);
                        var input = $(this);
                        timeout = setTimeout(function() {
                            dom.find('.modal-body').html(options.body);
                            $.ymqajax({
                                url: options.url,
                                success: function (res) {
                                    // consol.log(res);
                                    showHtml(res,dom,$('.add-free-product'));
                                    $(".choose").on('click',function(){
                                        chooseModal($(this));
                                        dom.modal('hide');
                                    });
                                },
                                data:{title:input.val()},
                                ymqtype: 'modal',
                                dom: dom.find('.modal-body'),
                            });
                        }, 1000);
                    });
                }
            });
        });
    }
    
    function chooseModal(dom,data = false) {
        var variant_id = dom.attr('data-variant_id');
        var product_id = dom.attr('data-product_id');
        var point = '';
        var commission = '';
        var url = '/api/freeproduct/save.html';
        if (data){
            point = dom.attr('data-point');
            commission = dom.attr('data-commission');
            url = '/api/freeproduct/update.html';
        }
        // dom.each(function () {
            dom.ajaxModal({
                center: true,
                title: `${data ? 'Edit' : 'Add'} Free Product`,
                removeOnDismiss: true,
                body: `
                    <div class="y-scroll" style="height: auto;">
                        <h6>Reward value <span style="font-size: 12px;">(You must choose more than one)</span></h6>
                        <input type="hidden" class="form-control" name="variant_id" value="${variant_id}">
                        <input type="hidden" class="form-control" name="product_id" value="${product_id}">
                        
                        
                        <div class="custom-control custom-checkbox text-dark-1 toggle-box ${point == 0 ? 'form-group' : ''}">
                            <input type="checkbox" ${point != 0 ? 'checked' : ''} class="custom-control-input input-toggle" id="date-point">
                            <label class="custom-control-label" for="date-point">Set Point</label>
                        </div>
                        <div class="row form-group ${point == 0 ? 'hide' : ''} ml-0 mr-0">
                            <div class="col-12 col-md-12 col-lg-12 mb-2">
                                <div class="form-group mb-0">
                                    <label class="text-dark-1">Points</label>
                                    <div class="input-group">
                                        <input ${point == 0 ? 'disabled="disabled"' : ''} type="number" min="1" class="form-control" name="point" value="${point}">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                Points
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="custom-control custom-checkbox text-dark-1 toggle-box ${commission == 0 ? 'form-group' : ''}">
                            <input type="checkbox" ${commission != 0 ? 'checked' : ''} class="custom-control-input input-toggle" id="date-commission">
                            <label class="custom-control-label" for="date-commission">Set Commission</label>
                        </div>
                        <div class="row form-group ${commission == 0 ? 'hide' : ''} ml-0 mr-0">
                            <div class="col-12 col-md-12 col-lg-12 mb-2">
                                <div class="form-group mb-0">
                                    <label class="text-dark-1">Commissions</label>
                                    <div class="input-group">
                                        <input ${commission == 0 ? 'disabled="disabled"' : ''} type="number" min="1" class="form-control" name="commission" value="${commission}">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                Comm
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                `,
                initShow: false,
                buttons: [
                    {
                        text: 'Cancel',
                        class: 'btn btn-secondary btn-shadow',
                        handler: function(modal2) {
                            modal2.modal('hide');
                        }
                    },
                    {
                        text: data ? 'Edit' : 'Add',
                        class: 'btn btn-primary btn-shadow disabled',
                        handler: function(modal2) {
                            // modal2.modal('hide');
                            var that = $(this);
                            var data = {};
                            var doit = false;
                            modal2.find('input').each(function () {
                                if ($(this).attr('type') != 'checkbox'){
                                    if ($(this).attr('disabled') == 'disabled'){
                                        data[$(this).attr('name')] = 0;
                                    }else{
                                        data[$(this).attr('name')] = $(this).val();
                                    }
                                    if ($(this).attr('name') == 'commission' || $(this).attr('name') == 'point'){
                                        console.log($(this).attr('disabled'));
                                        if ($(this).attr('disabled') != 'disabled' && $(this).val() > 0){
                                            doit = true;
                                        }
                                    }
                                }
                            });
                            console.log(data,doit);
                            if (doit){
                                that.addClass('btn-progress');
                                $.ymqajax({
                                    url: url,
                                    success: function (res) {
                                        that.removeClass('btn-progress');
                                        modal2.modal('hide');
                                        customers_load(1,null);
                                    },
                                    data:{data}
                                });
                            }
                        }
                    }
                ]
            });
        // })
            
    }
    $('body').on('change','.input-toggle',function() {
        if($(this).is(':checked')){
            $(this).parents('.toggle-box').removeClass('form-group').next().show().find('input').attr('disabled',false).trigger('input');
            // $(this).parents('.toggle-box').next('.hide').show().find('input').attr('disabled',false).trigger('input');
        }else {
            $(this).parents('.toggle-box').addClass('form-group').next().hide().find('input').attr('disabled',true).trigger('input');

        }
    });
    $('body').on('click','.dodelete',function() {
        var id = $(this).attr('data-variant_id');
        $(this).fireModal({
            title: 'Are you sure you want to delete it?',
            body: 'Are you sure you want to delete the product? This can’t be undone.',
            center: true,
            initShow: true,
            removeOnDismiss: true,
            buttons: [
                {
                    text: 'Cancel',
                    class: 'btn btn-secondary btn-shadow',
                    handler: function(modal) {
                        modal.modal('hide');
                    }
                },
                {
                    text: 'Delete product',
                    class: 'btn btn-danger btn-shadow',
                    handler: function(modal) {
                        var that = $(this);
                        that.addClass('btn-progress');
                        $.ymqajax({
                            url: '/api/freeproduct/delete.html',
                            success: function (res) {
                                that.removeClass('btn-progress');
                                customers_load(1,null);
                                modal.modal('hide');
                            },
                            data:{id}
                        });
                    }
                }
            ]
        });


    });

    function copyModal(dom) {
        dom.each(function () {
            var that = $(this);
            $(this).ajaxModal({
                center: true,
                title: 'Copy Free Product',
                headerhtml: '<ul class="list-group list-group-flush border-top">\n' +
                    '    <li class="list-group-item">\n' +
                    '        <div class="form-group margin-bottom-0">\n' +
                    '            <div class="input-group">\n' +
                    '                <div class="input-group-prepend">\n' +
                    '                    <div class="input-group-text">\n' +
                    '                        <i class="fas fa-search"></i>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '                <input type="text" class="form-control currency search-input" placeholder="Search Products">\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </li>\n' +
                    '</ul>',
                body: '<img class="load" src="/svg/load-blue-44.svg">',
                url: '/api/shopifydata/products.html',
                ajaxSuccess: function(res,modal){
                    showHtml(res,modal,$('.add-free-product'),true);
                    // console.log(modal.find('.choose').length);


                    modal.on('hidden.bs.modal', function() {
                        modal.find(".search-input").val('');
                    });

                },
                buttons: [
                    {
                        text: 'Cancel',
                        class: 'btn btn-secondary btn-shadow',
                        handler: function(modal) {
                            modal.modal('hide');
                        }
                    },
                    {
                        text: 'Add',
                        class: 'btn btn-primary btn-shadow disabled',
                        handler: function(modal) {
                            if (!$(this).hasClass('disabled')){
                                var data = {};
                                var ajaxdata = {};
                                $(".shopify-variant-checkbox:checked").each(function () {
                                    data[$(this).val()] = $(this).attr('data-parent');
                                });
                                ajaxdata['array'] = data;
                                ajaxdata['id'] = that.attr('data-variant_id');
                                console.log(ajaxdata);
                                var thatin = $(this);
                                thatin.addClass('btn-progress');
                                $.ymqajax({
                                    url: '/api/freeproduct/copy.html',
                                    success: function (res) {
                                        thatin.removeClass('btn-progress');
                                        modal.modal('hide');
                                        customers_load(1,null);
                                    },
                                    data:{data:ajaxdata}
                                });
                            }
                        }
                    }
                ],
                appended: function (dom, modal_form, options) {
                    var timeout;
                    dom.find(".search-input").on('input', function () {
                        clearTimeout(timeout);
                        var input = $(this);
                        timeout = setTimeout(function() {
                            dom.find('.modal-body').html(options.body);
                            $.ymqajax({
                                url: options.url,
                                success: function (res) {
                                    // consol.log(res);
                                    showHtml(res,dom,$('.add-free-product'),true);
                                },
                                data:{title:input.val()},
                                ymqtype: 'modal',
                                dom: dom.find('.modal-body'),
                            });
                        }, 1000);
                    });
                }
            });
        });
    }

    function showHtml(res,modal,that,copy = false) {
        var pushHtml = '<ul class="list-group content-ul list-group-flush y-scroll">';
        var data = res.data;

        data.forEach(function (item) {
            var variants = item['variants'];
            var show = true;

            if (free_products[item['id']]){
                if (variants.length == free_products[item['id']].length){
                    show = false;
                }
            }
            if (show) {
                pushHtml += `
                        <li class="list-group-item">
                            <div class="custom-control ${copy ? 'custom-checkbox' : ''}">`;
                if (copy) {
                    pushHtml += `<input type="checkbox" name="product" value="${item['id']}" id="product-${item['id']}" class="custom-control-input shopify-checkbox" id="product-${item['id']}" >`;
                }
                pushHtml += `        <label class="${copy ? 'custom-control-label' : ''} flex-start" for="product-${item['id']}">
                                  <div class="media space-between">
                                        <div class="mr-4 i-box">
                                            <img width="40" src="${item['image']}">
                                        </div>
                                        <div class="media-body">
                                            <div class="inline-block">
                                                <p class="mt-0 mb-0 text-dark-1 line-h-1">${item['title']}</p>
                                            </div>
                                        </div>
                                    </div>
                               </label>
                            </div>
                        `;
                pushHtml += '<ul class="list-group list-group-flush pl-4">';

                variants.forEach(function (variant) {
                    var vshow = true;
                    if (all_free_products[item['id']]) {
                        if (all_free_products[item['id']].indexOf(parseInt(variant['id'])) != -1) {
                            vshow = false;
                        }
                    }
                    if (vshow) {
                        pushHtml += `
                            <li class="list-group-item">
                                <div class="custom-control custom-checkbox">
                                `;
                        if (copy) {
                            pushHtml += `<input type="checkbox" data-parent="${item['id']}" name="variant-${item['id']}" value="${variant['id']}" class="custom-control-input shopify-variant-checkbox" id="product-${variant['id']}">`;
                        }
                        pushHtml += `
                                   <label class="${copy ? 'custom-control-label' : ''} flex-start" for="product-${variant['id']}">
                                      <div class="media space-between w-100">
                                            <div class="mr-4 i-box">
                                                <img width="40" src="${variant['image']}">
                                            </div>
                                            <div class="media-body">
                                                <div class="inline-block">
                                                    <p class="mt-0 mb-0 text-dark-1 line-h-1">${variant['selectedOptions']}</p>
                                                </div>
                                            </div>
                                            <div class="float-right ml-4 text-dark-1">
                                                ${variant['inventoryQuantity']}件在售
                                            </div>
                                            <div class="float-right ml-4 mr-2 text-dark-1">
                                                ${variant['price']}
                                            </div>
                                            `;
                        if (!copy) {
                            pushHtml += `
                                            <div class="text-primary mr-4 ml-3 pointer choose" data-variant_id="${variant['id']}" data-product_id="${item['id']}">
                                                Choose
                                            </div>
                        `;
                        }

                        pushHtml += `   </div>
                                   </label>
                                </div>
                            </li>
                        `;
                    }

                });
                pushHtml += '</ul>';

                pushHtml += '</li>';
            }

        });

        pushHtml += '</ul>';
        modal.find('.modal-body').html(pushHtml);
    }

    $(document).on('click', ".shopify-checkbox",function(){
        //判断按钮是否disabled
        var vals = [];
        var name = $(this).attr('name');
        $.each($(`input[name='${name}']:checked`),function(){
            vals.push($(this).val());
        });
        if (vals.length == 0){
            $(this).parents('.modal-content').find('.btn-primary').addClass('disabled');
        }else{
            $(this).parents('.modal-content').find('.btn-primary').removeClass('disabled');
        }
        //点击全选他的变体

        if ($(this).is(":checked")){
            $(".shopify-variant-checkbox[name='variant-"+$(this).val()+"']").prop("checked",true);
        }else{
            $(".shopify-variant-checkbox[name='variant-"+$(this).val()+"']").prop("checked",false);
        }
        $(this).parent().removeClass('not-cheched-all');
    })
    $(document).on('click', ".shopify-variant-checkbox",function(){
        var all_checked = true;
        var all_not_checked = true;
        $(".shopify-variant-checkbox[name='"+$(this).attr('name')+"']").each(function () {
            if ($(this).is(":checked")){
                all_not_checked = false;
            }else{
                all_checked = false;
            }
        })
        var parentDom = $(".shopify-checkbox[value='"+$(this).attr('data-parent')+"']");
        if (all_not_checked){
            parentDom.prop("checked",false);
            parentDom.parents('.modal-content').find('.btn-primary').addClass('disabled');
        }else {
            parentDom.prop("checked",true);
            parentDom.parents('.modal-content').find('.btn-primary').removeClass('disabled');
        }
        if (all_checked){
            parentDom.parent().removeClass('not-cheched-all');
        }else{
            parentDom.parent().addClass('not-cheched-all');
        }
    });


});