"use strict";
$.extend({
  ymqajax : function(options){
    var url = options.hasOwnProperty("url") ? options.url : '';
    var type = options.hasOwnProperty("type") ? options.type : 'post';
    var async = options.hasOwnProperty("async") ? options.async : true;
    var data = options.hasOwnProperty("data") ? options.data : null;
    var dataType = options.hasOwnProperty("dataType") ? options.dataType : 'json';
    var isiziToast = options.hasOwnProperty("iziToast") ? options.iziToast : false;
    var btn = options.hasOwnProperty("btn") ? options.btn : false;
    var dosuccess = options.hasOwnProperty("dosuccess") ? options.dosuccess : false;
    var success = function(res){
      //没有权限或者没有登录
      if (res.code == 403) {
        iziToast.error({
            message: __('please_login_first'),
            position: 'topCenter'
        });
        return;
      }
      //非法操作
      if (res.code == 405) {
        iziToast.error({
            message: __('illegal_operation'),
            position: 'topCenter'
        });
        return;
      }
      //没有数据
      if (res.code == 201) {
        iziToast.show({
          message: __('no_data_found'),
          position: 'bottomCenter'
        });
        //如果需要执行自己的success
        if (dosuccess) {
          if (options.hasOwnProperty("success")) {
            options.success(res);
          }
        }
        return;
      }
      if (isiziToast == 'success') {
        iziToast.success({
          message: __(res.msg),
          position: 'topCenter'
        });
      }else if(isiziToast == 'show'){
        iziToast.show({
          message: __(res.msg),
          position: 'bottomCenter'
        });
      }
      if (options.hasOwnProperty("success")) {
        options.success(res);
      }
    }
    var error = function(xhr, textStatus, errorThrown){
      iziToast.show({
          message: __('Service is busy, please try again'),
          position: 'bottomCenter'
      });
    }
    var complete = function(xhr){
      hideload();
      if (btn) {
          btn.removeClass('btn-progress');
      }
      if (options.hasOwnProperty("complete")) {
        options.complete(xhr);
      }
    }
    $.ajax({
      url: url,
      type: type,
      data: data,
      dataType: dataType,
      async: async,
      headers: {
        "Ymq-Customer-Id": ymq_customer_id,
        "Ymq-Ctoken": ymq_ctoken,
        "Ymq-Shop-Name": shop_data['name']

      },
      success: function (res) {
        success(res)
      },
      error: function(xhr, textStatus, errorThrown){
        error(xhr, textStatus, errorThrown);
      },
      complete: function(xhr){
        complete(xhr);
      }
    });
  }
});