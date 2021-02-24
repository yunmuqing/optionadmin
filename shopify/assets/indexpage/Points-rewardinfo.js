$(document).ready(function () {
    var shopify_conainer = {};
    var form_data = $('#defaultForm').serialize();
    if ($("input[name='id']").length == 1){
        var domClass = $("input[name='applies_type']:checked").attr('data-class') ? $("input[name='applies_type']:checked").attr('data-class') : '.specific_products';
        console.log(domClass);
        var dom = $(domClass);
        if (dom.length){
            var id = dom.find('.specific_input').val();
            var valus = id.split(',');
            var url = '';
            if (dom.find('.ajax-modal').attr('data-type') == 'collections'){
                url = '/api/shopifydata/collections_by_id.html'
            }else{
                url = '/api/shopifydata/products_by_id.html';
            }
            $.ajax({
                url: url,
                type: 'post',
                data:{id:id},
                dataType: 'json',
                success: function (res) {
                    dom.find('.content-show').html('');
                    if(res.code == 1){
                        shopify_conainer = res.msg;
                        contentShow(res.msg,valus,dom.find('.ajax-modal'));

                    }
                }
            });
        }

    }

    $('a').on('click',function () {
        var href = $(this).attr('href');

        if (form_data != $('#defaultForm').serialize()){
            $(this).fireModal({
                title: 'You have unsaved changes on this page',
                body: 'If you leave this page, all unsaved changes will be lost. Are you sure you want to leave this page?',
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
                        text: 'Leave page',
                        class: 'btn btn-danger btn-shadow',
                        handler: function(modal) {
                            window.location.href=href;
                        }
                    }
                ]
            });
            return false;
        }
        // window.location.href=href;
    })
    
    function isInteger(obj) {
        return obj % 1 === 0
    }
    $("input,textarea,select").bind('input propertychange', function() {
        if (form_data != $('#defaultForm').serialize()) {
            $('.save,.creat').removeClass('disabled');
        }else{
            $('.save,.creat').addClass('disabled');
        }

    });



    $(document).on('click', ".variants-edit",function(){
        var that = $(this);
        var parentDom = that.parents('.list-group-item');
        $(this).ajaxModal({
            center: true,
            title: 'Edit Variants',
            removeOnDismiss: true,
            initShow: true,
            body: '<img class="load" src="/svg/load-blue-44.svg">',
            url: '/api/shopifydata/variants.html?product_id='+parentDom.attr('data-sid'),
            ajaxSuccess: function(res,modal){
                showVariantsHtml(res,modal,that);

                // console.log(res);
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
                    text: 'Edit',
                    class: 'btn btn-primary btn-shadow ',
                    handler: function(modal) {
                        if (!$(this).hasClass('disabled')){
                            var inputDom = that.parents('.list-group').prev().find('.variants');
                            var variants = JSON.parse(inputDom.val());
                            var product_id = modal.find('.variants-checkbox:checked').attr('data-product-id');

                            var res = [];
                            var all_checked = true;
                            modal.find('.variants-checkbox').each(function () {
                                if ($(this).is(":checked")){
                                    res.push($(this).val());
                                }else{
                                    all_checked = false;
                                }
                            })
                            if (all_checked){
                                res = "all";
                            }
                            variants[product_id] = res;
                            inputDom.val(JSON.stringify(variants));
                            inputDom.trigger('input');
                            modal.modal('hide');
                            // inputDom.trigger('input');
                        }
                    }
                }
            ],
            appended: function (dom, modal_form, options) {

            }
        });
    })
    $(".ajax-modal").each(function () {
        var that = $(this);
        var type = that.attr('data-type');
        $(this).ajaxModal({
            center: true,
            title: that.attr('data-title'),
            headerhtml: '<ul class="list-group list-group-flush border-top">\n' +
                '    <li class="list-group-item">\n' +
                '        <div class="form-group margin-bottom-0">\n' +
                '            <div class="input-group">\n' +
                '                <div class="input-group-prepend">\n' +
                '                    <div class="input-group-text">\n' +
                '                        <i class="fas fa-search"></i>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '                <input type="text" class="form-control currency search-input" placeholder="'+that.attr('data-placeholder')+'">\n' +
                '            </div>\n' +
                '        </div>\n' +
                '    </li>\n' +
                '</ul>',
            body: '<img class="load" src="/svg/load-blue-44.svg">',
            url: that.attr('data-url'),
            ajaxSuccess: function(res,modal){

                showHtml(res,modal,that);
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
                            var array = [];
                            var valus = [];
                            var inputDom = that.find('.specific_input');
                            var variantsDom = that.find('.variants');
                            var variants = {};
                            if (variantsDom.val()){
                                var variants = JSON.parse(variantsDom.val());
                            }

                            modal.find('.shopify-checkbox').each(function () {
                                var parent = $(this);
                                if ($(this).attr('data-checked') && !$(this).is(":checked")){
                                    inputDom.val(resetValue($(this).val(),inputDom.val()));
                                }
                                if ($(this).is(":checked")){
                                    array.push($(this).val());
                                    shopify_conainer[$(this).val()] = {
                                        image: $(this).attr('data-image'),
                                        title: $(this).attr('data-title'),
                                        sid: $(this).attr('data-sid')
                                    };
                                    if (type == 'products'){
                                        var child = [];
                                        var all_checked = true;
                                        $(".shopify-variant-checkbox[name='variant-"+$(this).val()+"']").each(function () {
                                            if ($(this).is(":checked")){
                                                child.push($(this).val());
                                            }else{
                                                all_checked = false;
                                            }
                                        });
                                        if (all_checked){
                                            child = 'all';
                                        }
                                        variants[$(this).val()] = child;
                                    }

                                }

                            })
                            if (type == 'products'){
                                variantsDom.val(JSON.stringify(variants));
                            }

                            // console.log(JSON.parse(variantsDom.val()));

                            var val = inputDom.val();
                            if (val){
                                val = val.split(',');
                                valus = removalArray(val,array);
                            }else{
                                valus = array;
                            }
                            inputDom.val(valus.toString());
                            contentShow(shopify_conainer,valus,that);
                            inputDom.trigger('input');
                            variantsDom.trigger('input');
                            modal.modal('hide');
                            // inputDom.trigger('input');
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
                                showHtml(res,dom,that);
                            },
                            data:{title:input.val()},
                            ymqtype: 'modal',
                            dom: dom.find('.modal-body'),
                        });
                        // $.ajax({
                        //     url: options.url,
                        //     type: 'post',
                        //     data:{title:input.val()},
                        //     dataType: 'json',
                        //     success: function (res) {
                        //         showHtml(res,dom,that);
                        //     }
                        // });
                    }, 1000);
                });
            }
        });

    });


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
    })

    $(document).on('click', ".variants-checkbox",function(){
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
    })

    function showVariantsHtml(res,modal,that) {

        var pushHtml = '<ul class="list-group list-group-flush content-ul y-scroll">';
        var data = Object.values(res.data);
        var inputDom = that.parents('.list-group').prev().find('.variants');

        var variants = JSON.parse(inputDom.val());
        var variant = variants[that.parents('.list-group-item').attr('data-id')];
        console.log(variant);
        if (variant.length == 0){
            modal.find('.btn-primary').addClass('disabled');
        }
        data.forEach(function (item) {
            pushHtml += `
                    <li class="list-group-item">
                        <div class="custom-control custom-checkbox">
                          <input type="checkbox" ${(variant.indexOf(item['id']) != -1 || variant == 'all') ? 'checked data-checked="1"' : '' }  name="variants-checkbox" value="${item['id']}" class="custom-control-input variants-checkbox" id="variants-checkbox-${item['id']}" data-image="${item['image']}" data-sid="${item['sid']}" data-product-id="${that.parents('.list-group-item').attr('data-id')}">
                           <label class="custom-control-label flex-start" for="variants-checkbox-${item['id']}">
                              <div class="media space-between w-100">
                                    <div class="mr-4 i-box">
                                        <img width="40" src="${item['image']}">
                                    </div>
                                    <div class="media-body">
                                        <div class="inline-block">
                                            <p class="mt-0 mb-0 text-dark-1 line-h-1">${item['selectedOptions']}</p>
                                        </div>
                                    </div>
                                    <div class="space-between">
                                        <div class="float-right ml-4 text-dark-1">
                                            ${item['inventoryQuantity']}件在售
                                        </div>
                                        <div class="float-right ml-4 mr-2 text-dark-1">
                                            ${item['price']}
                                        </div>
                                    </div>
                                </div>
                           </label>
                        </div>
                    </li>
                    `;
        })
            pushHtml += '</ul>';
            modal.find('.modal-body').html(pushHtml);

    }

    function showHtml(res,modal,that) {
            var value = that.find('.specific_input').val();
            var variants_value = null;
            if (that.find('.variants').val()){
                variants_value = JSON.parse(that.find('.variants').val());
            }


            value = value.split(',');
            var pushHtml = '<ul class="list-group list-group-flush content-ul y-scroll">';
            var data = Object.values(res.data);

            data.forEach(function (item) {
                var variant_value = [];
                if (variants_value){
                    if (variants_value.hasOwnProperty(item['id'])){
                        variant_value = variants_value[item['id']];
                    }
                }

                var not_all_choose_class = true;
                if (that.attr('data-type') == 'products'){
                    if (variant_value != "all" && item['variants'].length != variant_value.length){
                        not_all_choose_class = false;
                    }
                }

                pushHtml += `
                        <li class="list-group-item">
                            <div class="custom-control ${not_all_choose_class ? '' : 'not-cheched-all'} custom-checkbox">
                              <input type="checkbox" ${value.indexOf(item['id']) == -1 ? '' : 'checked data-checked="1"' } name="product" value="${item['id']}" class="custom-control-input shopify-checkbox" id="product-${item['id']}" data-image="${item['image']}" data-title="${item['title']}" data-sid="${item['sid']}" >
                               <label class="custom-control-label flex-start" for="product-${item['id']}">
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
                if (that.attr('data-type') == 'products'){
                    pushHtml += '<ul class="list-group list-group-flush pl-4">';
                    var variants = Object.values(item['variants']);
                    variants.forEach(function (variant) {
                        pushHtml += `
                            <li class="list-group-item">
                                <div class="custom-control custom-checkbox">
                                  <input type="checkbox" ${(variant_value.indexOf(variant['id']) != -1 || variant_value == 'all') ? 'checked data-checked="1"' : '' } data-parent="${item['id']}" name="variant-${item['id']}" value="${variant['id']}" class="custom-control-input shopify-variant-checkbox" id="product-${variant['id']}" data-image="${item['image']}" data-title="${item['title']}">
                                   <label class="custom-control-label flex-start" for="product-${variant['id']}">
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
                                                
                                        </div>
                                   </label>
                                </div>
                            </li>
                        `;
                    })
                    pushHtml += '</ul>';
                }
                pushHtml += '</li>';
            })

            pushHtml += '</ul>';
            modal.find('.modal-body').html(pushHtml);
            // modal.find('.content-ul').niceScroll();


    }

    function removalArray(arr1,arr2){
        var arr = arr1.concat(arr2);
        return Array.from(new Set(arr));
    }

    function contentShow(shopify_conainer,valus,that){
        var dom = that.parents('.specific').find('.content-show');
        var html = '';
        if (!jQuery.isEmptyObject(shopify_conainer)){
            valus.forEach((item)=>{
                html += '<li class="list-group-item no-padding-left no-padding-right" data-id="'+item+'" data-sid="'+shopify_conainer[item]['sid']+'">\n' +
                    '                                <div class="custom-control custom-checkbox no-padding-left">\n' +
                    '                                    <div class="media space-between">\n' +
                    '                                        <div class="mr-4 i-box">\n' +
                    '                                            <img width="40" src="'+shopify_conainer[item]['image']+'">\n' +
                    '                                        </div>\n' +
                    '                                        <div class="media-body space-between">\n' +
                    '                                            <p class="mt-0 mb-0 text-dark-1 line-h-1">'+shopify_conainer[item]['title']+'</p>\n' +
                    '                                            <div class="space-between">' ;
                if(that.attr('data-type') == 'products'){
                    html +='                                               <div class="mr-4 text-dark-1 pointer variants-edit float-right">Edit</div>\n' ;
                }
                html +='                                               <button type="button" class="close big-close" data-dismiss="modal" data-type="'+that.attr("data-type")+'" aria-label="Close">\n' +
                    '                                                    <span aria-hidden="true">×</span>\n' +
                    '                                               </button>\n' +
                    '                                            </div>' +
                    '                                        </div>\n' +
                    '                                    </div>\n' +
                    '                                </div>\n' +
                    '                            </li>';
            });
        }
        dom.html(html);
    }
    $(document).on('click', ".content-show .close",function(){
        var id = $(this).parents('.list-group-item').attr('data-id');
        var inputDom = $(this).parents('.specific').find('.specific_input');

        var value = inputDom.val();
        value = resetValue(id,value);
        if ($(this).attr('data-type') == 'products'){
            var variantsDom = $(this).parents('.specific').find('.variants');
            resetVariants(id,variantsDom);
            variantsDom.trigger('input');
        }

        inputDom.val(value);
        // inputDom.trigger('input');
        inputDom.trigger('input');

        $(this).parents('.list-group-item').remove();
    })
    $('.x-y-select').on('change',function(){
        // p_c_toggle($(this).val());
        $(this).parents('.card').find('.specific').hide().find('input').attr('disabled',true);

        $(this).parents('.card').find($(this).val()).show().find('input').attr('disabled',false);
    })


    function resetValue(id,value){
        value = value.split(',');
        value.splice(value.indexOf(id), 1);
        value = value.toString();
        return value;
    }
    function resetVariants(id,dom){
        var variants = JSON.parse(dom.val());
        delete variants[id];
        dom.val(JSON.stringify(variants));
    }
    $('input[type=radio][name=applies_type]').change(function() {
        var clazz = $(this).attr('data-class');
        $('.specific').hide().find('input').attr('disabled',true);
        if (clazz){
            $(clazz).show().find('input').attr('disabled',false);
            // $(clazz).find('.specific_input').attr('disabled',false).trigger('input');
        }
    });

    $('.input-toggle').change(function() {
        if($(this).is(':checked')){
            $(this).parents('.toggle-box').next('.hide').show().find('input').attr('disabled',false).trigger('input');
            // $(this).parents('.toggle-box').next('.hide').show().find('input').attr('disabled',false).trigger('input');
        }else {
            $(this).parents('.toggle-box').next('.hide').hide().find('input').attr('disabled',true).trigger('input');

        }
    });

    function initdisabledsave(){
        $('form').bootstrapValidator('disableSubmitButtons', true);
        $("input,textarea,select").each(function(){
            if($(this).is(":checked")){
                $("input[name='"+$(this).attr('name')+"']").data('value',$(this).val());
            }else{
                $(this).data('value',$(this).val());
            }
        })
        form_data = $('#defaultForm').serialize();
    }

    $('#defaultForm').bootstrapValidator({
        excluded:[":disabled"],
        live: 'disabled',
        fields: {
            points: {
                validators: {
                    notEmpty: {
                        message: 'Must not be empty'
                    }
                }
            },
            min:{
               validators: {
                    callback:{
                        message:"minimum amount of points must be an integer multiple of Customer redeems increment of",
                        callback:function(value,validator){
                            if ($(".range_min").length>0) {
                              if (!isInteger($(".range_min").val()/$(".range_points").val())) {
                                   return false
                                }else{
                                    return true
                                }  
                            }else{
                                return true
                            }
                            
                        }
                    }
                } 
            },
            get: {
                validators: {
                    notEmpty: {
                        message: 'Must not be empty'
                    }
                }
            },
            applies_type: {
                validators: {
                    notEmpty: {
                        message: 'Please enter valid content'
                    },
                    between: {
                        min : 0,
                        max : 2,
                        message: 'Please enter valid content'
                    }
                }
            },
            applies: {
                validators: {
                    notEmpty: {
                        message: 'Must not be empty'
                    }
                }
            },
            day: {
                validators: {
                    notEmpty: {
                        message: 'Must not be empty'
                    }
                }
            },
            prefix: {
                validators: {
                    stringLength : {
                        min : 0,
                        max : 10,
                        message : 'No more than 10 characters'
                    }
                }
            },
            status: {
                validators: {
                    notEmpty: {
                        message: 'Please enter valid content'
                    },
                    between: {
                        min : 0,
                        max : 1,
                        message: 'Please enter valid content'
                    }
                }
            }
        }
    }).on("success.form.bv",function(e){
        // if ($('.min').val() != 200) {
        //     alert($('.min').val());
        //     return false;
        // }
        $('.save,.creat').addClass('disabled btn-progress');
        $.ajax({
            //请求方式
            type : "POST",
            dataType: "json",
            //请求地址
            url : "/api/pointredeem/edit",
            //数据，json字符串
            data : $('#defaultForm').serialize(),
            //请求成功
            success : function(result) {

                if (result.code == 1) {
                    if ($(".creat").attr('class') != undefined) {
                        window.location.href='/index/points/index.html';
                        result.msg = "Action created";
                    }
                    iziToast.show({
                        message: result.msg,
                        position: 'bottomCenter'
                    });
                    initdisabledsave();
                }else if(result.code == 0){
                    iziToast.error({
                        message: result.msg,
                        position: 'bottomCenter'
                    });
                }
                $('.save,.creat').removeClass('btn-progress');
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                $('.save,.creat').removeClass('btn-progress');
            }
        });
        return false;
    });


    $(document).on('click', ".delete", function () {
        var deletetitle = $('.right-header .mr-1').text();
        $(this).fireModal({
            title: `Delete ${deletetitle}`,
            body: `Are you sure you want to delete ${deletetitle}? This action cannot be reversed.`,
            center: true,
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
                    text: 'Delete',
                    class: 'btn btn-danger btn-shadow',
                    handler: function(modal) {
                        $.ajax({
                            //请求方式
                            type : "POST",
                            dataType: "json",
                            //请求地址
                            url : "/api/pointredeem/delete",
                            //数据，json字符串
                            data : {"id":$("input[name='id']").val()},
                            //请求成功
                            success : function(result) {
                                if (result.code == 1) {
                                    window.location.href='/index/points/index.html';
                                }else if(result.code == 0){
                                    modal.modal('hide');
                                    iziToast.error({
                                        message: result.msg,
                                        position: 'bottomCenter'
                                    });
                                    $('.save,.creat').removeClass('btn-progress');
                                }
                            },
                            //请求失败，包含具体的错误信息
                            error : function(e){
                                modal.modal('hide');
                                iziToast.error({
                                    message: 'Deleted Error',
                                    position: 'bottomCenter'
                                });
                                $('.save,.creat').removeClass('btn-progress');
                            }
                        });
                    }
                }
            ]
        });
        return false;
    });


    if ($(".save").length > 0) {
        $('form').bootstrapValidator('disableSubmitButtons', true);
    }
});

