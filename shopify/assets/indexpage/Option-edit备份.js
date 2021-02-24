$(document).ready(function () {
  jQuery.fn.extend({
      ymqValidate:function(customeFunction){
        var that = $(this);
        var emailRe = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; 
        var numberRe = /^[0-9]+.?[0-9]*/; 
        //错误计数
        var error_num = 0;
        var error_box = `<div class="ymq_error_box"></div>`;
        //提交百度时触发
        $(this).submit(function(e){
          error_num = 0;
          $('#'+$(this).attr('id')+' input,#'+$(this).attr('id')+' select').each(function(){
            validate($(this))
          })
          console.log(error_num)
          //没有错误执行自定义方法
          if (error_num == 0) {
            customeFunction();
          }else{
            $('#'+$(this).attr('id')+' .ymqhaserror').eq(0).focus();
          }
          return false;
      });
        //下单改变时触发
        $(document).on('input propertychange', '#'+$(this).attr('id')+' input,#'+$(this).attr('id')+' select', function () 
        {
          validate($(this))
        })
        //验证函数
      function validate(inputDom){
        //隐藏禁用的不参与
        if (typeof inputDom.attr('disabled') !== typeof undefined && inputDom.attr('disabled') !== false && inputDom.attr('disabled') == 'true') {
          return;
        }
        var errorInfo = ``;
          var validateInfo = inputDom.attr('ymq-validate');
          if (!inputDom.next().hasClass('ymq_error_box')) {
            inputDom.after(error_box);
          }
          if (typeof validateInfo !== typeof undefined && validateInfo !== false && validateInfo != '') {
          var validateInfoArr = validateInfo.split('|');
          validateInfoArr.forEach(function (item) {
                  if (item == 'require' && inputDom.val() == '') {
                    error_num++;
                    errorInfo += `<span class="ymq_error">必填</span>`;
                  }
                  if (inputDom.val() != '') {
                    if(item.search("minchar:") > -1 && inputDom.val().length < item.split(':')[1]){
                      error_num++;
                      errorInfo += `<span class="ymq_error">大于${item.split(':')[1]}个字符</span>`;
                    }
                    if(item.search("maxchar:") > -1 && inputDom.val().length > item.split(':')[1]){
                      error_num++;
                      errorInfo += `<span class="ymq_error">不得大于${item.split(':')[1]}个字符</span>`;
                    }
                    if(item.search("min:") > -1 && inputDom.val() < item.split(':')[1]){
                      error_num++;
                      errorInfo += `<span class="ymq_error">不得小于${item.split(':')[1]}</span>`;
                    }
                    if(item.search("max:") > -1 && inputDom.val() > item.split(':')[1]){
                      error_num++;
                      errorInfo += `<span class="ymq_error">不得大于${item.split(':')[1]}</span>`;
                    }
                    if(item == 'email' && !emailRe.test(inputDom.val())){
                      error_num++;
                      errorInfo += `<span class="ymq_error">请输入邮箱</span>`;
                    }
                    //是整数
                    if(item == 'integer' && inputDom.val() % 1 !== 0){
                      error_num++;
                      errorInfo += `<span class="ymq_error">输入整数</span>`;
                    }
                    //是数字
                    if(item == 'number' && !numberRe.test(inputDom.val())){
                      error_num++;
                      errorInfo += `<span class="ymq_error">输入数字</span>`;
                    }
                    //数字大于
                    if(item.search("numbermin:") > -1 && inputDom.val() < item.split(':')[1]){
                      error_num++;
                      errorInfo += `<span class="ymq_error">数字大于${item.split(':')[1]}</span>`;
                    }
                    //数字小于
                    if(item.search("numbermax:") > -1 && inputDom.val() > item.split(':')[1]){
                      error_num++;
                      errorInfo += `<span class="ymq_error">数字小于${item.split(':')[1]}</span>`;
                    }
                    //浮点数(不得超过几位小数)  暂时不考虑
                    if(item.search("float:") > -1){
                      if (inputDom.val() % 1 !== 0) {
                        if (inputDom.val().toString().split(".")[1].length > item.split(':')[1]) {
                          error_num++;
                          errorInfo += `<span class="ymq_error">${item.split(':')[1]}小数</span>`;
                        }
                      }
                    }
                  }
                  
              })
        }
        inputDom.next('.ymq_error_box').html(errorInfo)
        if (errorInfo != '') {
          inputDom.addClass('ymqhaserror');
        }else{
          inputDom.removeClass('ymqhaserror');
        }
      }
      } 
  });

    //id索引
    var ymq_index = 1;
    var available_option = [];
    var key_prefix = 'ymq';
    var ymq_index_prefix = 'ymqtem';
    var hasOptionValueArr = ['3','4','5','6','7','8'];
    var canvasTypeArr = [5,8];
    //var ymq_option = {"ymq1":{"id":1,"type":"3","label":"爷爷","options":{"1_1":{"id":"1_1","value":"爷爷1","one_time":0,"price":"20","default":1,"price_type":"1","sku":""},"1_2":{"id":"1_2","value":"爷爷2","default":0,"price":"","price_type":"1","one_time":"0","sku":""},"1_3":{"id":"1_3","value":"爷爷3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"1_4":{"id":"1_4","value":"爷爷4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""},"ymq2":{"id":2,"type":"3","label":"爸爸","options":{"2_1":{"id":"2_1","value":"爸爸1","default":1,"one_time":1,"price":"","price_type":"1","sku":""},"2_2":{"id":"2_2","value":"爸爸2","default":0,"price":"20","price_type":"1","one_time":"0","sku":""},"2_3":{"id":"2_3","value":"爸爸3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"2_4":{"id":"2_4","value":"爸爸4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":1,"tooltip":"","tooltip_position":"1","help":""},"ymq3":{"id":3,"type":"3","label":"儿子","options":{"3_1":{"id":"3_1","value":"儿子1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"3_2":{"id":"3_2","value":"儿子2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"3_3":{"id":"3_3","value":"儿子3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"3_4":{"id":"3_4","value":"儿子4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""},"ymq4":{"id":4,"type":"3","label":"孙子","options":{"4_1":{"id":"4_1","value":"孙子1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"4_2":{"id":"4_2","value":"孙子2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"4_3":{"id":"4_3","value":"孙子3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"4_4":{"id":"4_4","value":"孙子4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""}};
    //var ymq_condition = {"3":{"type":"1","andor":"||","show":"1","children":"","options":{"1":{"id":"1","type":"1","value":"1_1,1_2"},"2":{"id":"2","type":"1","value":"2_1,2_2"}}}};
    var condition = {};
    var basImgUrl = 'http://ymq-shopify.oss-us-east-1.aliyuncs.com/';
    var img_suffix = '?x-oss-process=image/resize,w_150/quality,q_80';
    //var ymq_option = {"ymq1":{"id":1,"type":"10","label":"日期","required":1,"tooltip":"sad","date_minDateType":"2","min_date":"2021-02-27","date_maxDateType":"2","max_date":"2021-03-27","min_time":"06:00:00","max_time":"21:00:00","weekly_limit":["0","5"],"day_limit":["2","5"],"tooltip_position":"1","help":"","price":"","price_type":"1","one_time":0,"sku":"","date_format":"YYYY-MM-DD"}};
    //var ymq_option = {"ymq2":{"id":2,"type":"1","label":"Field","price":"20","required":1,"tooltip":"","tooltip_position":"1","help":"","price_type":"1","one_time":"0","sku":"","min_char":"5","max_char":"30","default_text":"","min":"","max":"","field_type":"1"},"ymq15":{"id":15,"type":"1","label":"text email","required":1,"price":"20","field_type":"2","default_text":"214960948@qq.com","tooltip":"","tooltip_position":"1","help":"","price_type":"1","one_time":"0","sku":"","min_char":"","max_char":"","min":"","max":""},"ymq3":{"id":3,"type":"2","label":"area","price":"10","required":1,"tooltip":"","tooltip_position":"1","help":"","price_type":"1","one_time":"0","sku":"","min_char":"","max_char":"","default_text":""},"ymq4":{"id":4,"type":"3","label":"yeye","options":{"4_1":{"id":"4_1","value":"yeye1","default":1,"price":"","price_type":"1","one_time":"0","sku":""},"4_2":{"id":"4_2","value":"yeye2","default":0,"price":"","price_type":"1","one_time":"0","sku":""},"4_3":{"id":"4_3","value":"yeye3","default":0,"price":"","price_type":"1","one_time":"0","sku":""},"4_4":{"id":"4_4","value":"yey44","default":0,"price":"","price_type":"1","one_time":"0","sku":""}},"required":1,"tooltip":"","tooltip_position":"1","help":""},"ymq5":{"id":5,"type":"4","label":"radio normal","style":"1","options":{"5_1":{"id":"5_1","value":"radio normal1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"5_2":{"id":"5_2","value":"radio normal2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":1,"tooltip":"","tooltip_position":"1","help":""},"ymq6":{"id":6,"type":"4","label":"radio button","style":"2","options":{"6_1":{"id":"6_1","value":"radio button1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"6_2":{"id":"6_2","value":"radio button2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":1,"tooltip":"","tooltip_position":"1","help":""},"ymq7":{"id":7,"type":"5","options":{"7_1":{"id":"7_1","value":"huabu1","canvas_type":"2","canvas2":"option/pqddemo01/6023e54b54c70.jpg","price":"","price_type":"1","one_time":"0","sku":"","default":"0","canvas1":""},"7_2":{"id":"7_2","value":"huabu2","canvas_type":"2","canvas2":"option/pqddemo01/6023e5a9a28e9.jpg","price":"","price_type":"1","one_time":"0","sku":"","default":"0","canvas1":""},"7_3":{"id":"7_3","value":"huabu3","canvas1":"6e406e","price":"","price_type":"1","one_time":"0","sku":"","default":"0","canvas_type":"1","canvas2":""}},"label":"huabu dang","required":1,"tooltip":"","tooltip_position":"1","help":"","style":"0"},"ymq8":{"id":8,"type":"6","label":"checkbox normal","style":"1","options":{"8_1":{"id":"8_1","value":"checkbox norma1l","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"8_2":{"id":"8_2","value":"checkbox norma2l","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""},"ymq9":{"id":9,"type":"6","label":"checkbox button","options":{"9_1":{"id":"9_1","value":"checkbox button1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"9_2":{"id":"9_2","value":"checkbox button2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"style":"2","required":1,"tooltip":"","tooltip_position":"1","help":""},"ymq10":{"id":10,"type":"7","label":"select multi","options":{"10_1":{"id":"10_1","value":"select multi1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"10_2":{"id":"10_2","value":"select multi2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"10_3":{"id":"10_3","value":"select multi3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"10_4":{"id":"10_4","value":"select multi4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":1,"tooltip":"","tooltip_position":"1","help":"","style":"0"},"ymq11":{"id":11,"type":"9","label":"date","date_format":"YYYY-MM-DD","required":1,"tooltip":"","tooltip_position":"1","help":"","style":"0","price":"","price_type":"1","one_time":0,"sku":"","date_minDateType":0,"min_date":"","date_maxDateType":0,"max_date":"","min_time":"","max_time":"","weekly_limit":[],"day_limit":[]},"ymq12":{"id":12,"type":"13","label":"switch","switch_text":"switch","default":1,"required":1,"tooltip":"","tooltip_position":"1","help":"","style":"0","price":"","price_type":"1","one_time":"0","sku":"","file_type":"1","btn_text":"Upload"},"ymq13":{"id":13,"type":"14","label":"color pick","required":1,"tooltip":"","tooltip_position":"1","help":"","style":"0","price":"","price_type":"1","one_time":"0","sku":""},"ymq14":{"id":14,"type":"12","label":"file","required":1,"tooltip":"","tooltip_position":"1","help":"","style":"0","btn_text":"upload","sku":"","price":""},"ymq16":{"id":16,"type":"1","label":"text phone","required":1,"field_type":"3","tooltip":"","tooltip_position":"1","help":"","style":"0","price":"","price_type":"1","one_time":"0","sku":"","min_char":"","max_char":"","default_text":"","min":"","max":""},"ymq17":{"id":17,"type":"1","label":"text number","field_type":"4","min":"10","max":"20","default_text":"50","required":"0","tooltip":"","tooltip_position":"1","help":"","style":"0","price":"","price_type":"1","one_time":"0","sku":"","min_char":"","max_char":""}}
    //var ymq_option = {"ymq1":{"id":1,"type":"3","label":"爷爷","options":{"1_1":{"id":"1_1","value":"爷爷1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"1_2":{"id":"1_2","value":"爷爷2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"1_3":{"id":"1_3","value":"爷爷3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"1_4":{"id":"1_4","value":"爷爷4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""},"ymq2":{"id":2,"type":"3","label":"爸爸","options":{"2_1":{"id":"2_1","value":"爸爸1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"2_2":{"id":"2_2","value":"爸爸2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"2_3":{"id":"2_3","value":"爸爸3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"2_4":{"id":"2_4","value":"爸爸4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""},"ymq3":{"id":3,"type":"3","label":"儿子","options":{"3_1":{"id":"3_1","value":"儿子1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"3_2":{"id":"3_2","value":"儿子2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"3_3":{"id":"3_3","value":"儿子3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"3_4":{"id":"3_4","value":"儿子4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""},"ymq4":{"id":4,"type":"3","label":"孙子","options":{"4_1":{"id":"4_1","value":"孙子1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"4_2":{"id":"4_2","value":"孙子2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"4_3":{"id":"4_3","value":"孙子3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"4_4":{"id":"4_4","value":"孙子4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""}};
    var ymq_option = {"ymqymqtem1":{"id":"ymqtem1","type":"3","label":"爷爷","options":{"ymqtem1_1":{"id":"ymqtem1_1","value":"爷爷1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem1_2":{"id":"ymqtem1_2","value":"爷爷2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem1_3":{"id":"ymqtem1_3","value":"爷爷3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem1_4":{"id":"ymqtem1_4","value":"爷爷4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""},"ymqymqtem2":{"id":"ymqtem2","type":"3","label":"爸爸","options":{"ymqtem2_1":{"id":"ymqtem2_1","value":"爸爸1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem2_2":{"id":"ymqtem2_2","value":"爸爸2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem2_3":{"id":"ymqtem2_3","value":"爸爸3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem2_4":{"id":"ymqtem2_4","value":"爸爸4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""},"ymqymqtem3":{"id":"ymqtem3","type":"3","label":"儿子","options":{"ymqtem3_1":{"id":"ymqtem3_1","value":"儿子","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem3_2":{"id":"ymqtem3_2","value":"儿子","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem3_3":{"id":"ymqtem3_3","value":"儿子","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem3_4":{"id":"ymqtem3_4","value":"儿子","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""},"ymqymqtem4":{"id":"ymqtem4","type":"3","label":"孙子","options":{"ymqtem4_1":{"id":"ymqtem4_1","value":"孙子1","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem4_2":{"id":"ymqtem4_2","value":"孙子2","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem4_3":{"id":"ymqtem4_3","value":"孙子3","price":"","price_type":"1","one_time":"0","sku":"","default":"0"},"ymqtem4_4":{"id":"ymqtem4_4","value":"孙子4","price":"","price_type":"1","one_time":"0","sku":"","default":"0"}},"required":"0","tooltip":"","tooltip_position":"1","help":""}};
    //var ymq_condition =  {"2":{"type":"1","andor":"||","show":"1","children":"3","options":{"1":{"id":"1","type":"1","value":"1_1,1_2"}}},"3":{"type":"1","andor":"||","show":"1","children":"4","options":{"1":{"id":"2","type":"1","value":"2_1,2_2"}}},"4":{"type":"1","andor":"||","show":"1","children":"","options":{"1":{"id":"3","type":"1","value":"3_1,3_2"}}}};
    var ymq_condition = {};
    
    //有值就回显
    if (Object.keys(ymq_option).length > 0) {
        init();
    }
    //数据回显
    function init(){
      for(var key in ymq_option){
        var item  = ymq_option[key];
        //初始化ymq_index
        console.log(Number(item['id'].replace(ymq_index_prefix,'')))
        if (ymq_index < Number(item['id'].replace(ymq_index_prefix,''))) {
          ymq_index = Number(item['id'].replace(ymq_index_prefix,''));
        }
        createOptionHtml(item['type'],item['id'],item);
      }
      ymq_index++;
      $(".select2").select2({minimumResultsForSearch: -1});
    }  
    

    //初始化option的排序
    new Sortable(option_sort, {
        handle: '.handle',
        animation: 150,
        ghostClass: 'blue-background-class',
        chosenClass: "sort_chosen",
        dragClass: "sort_drag",
        // 列表的任何更改都会触发
        onSort: function (evt) {
            //顺序改变修改，修改json
            sort_option_json();
            console.log(ymq_option)
        }
    });

    //新增option
    $(document).on('click', '.add_option span', function () { 
      $(".select2").select2({minimumResultsForSearch: -1});
      var type = $('.option_type select').val();
      createOptionHtml(type,ymq_index_prefix+ymq_index);
      $(".select2").select2({minimumResultsForSearch: -1});
      //给json新增
      ymq_option[key_prefix+ymq_index_prefix+ymq_index] = {};
      ymq_option[key_prefix+ymq_index_prefix+ymq_index]['id'] = ymq_index_prefix+ymq_index;
      ymq_option[key_prefix+ymq_index_prefix+ymq_index]['type'] = type;
      console.log(ymq_option);
      ymq_index++;
    });

    //删除option时修改condition
    function deleteConditionByOption(now_key){
      now_key = now_key+'';
      //1、先删除自己的contition
      deleteCondition(now_key);
      //2、删除限制条件里的
      for(var key in ymq_condition){
          //不操作自己
          if (key == now_key) {
              continue;
          }
          //把当前condition元素给他的父类添加chiliren
          if (ymq_condition[key]['children'] == '') {
              var children_arr = [];
          }else{
              var children_arr = ymq_condition[key]['children'].split(',');
          }
          children_arr.remove(now_key);
          ymq_condition[key]['children'] = children_arr.join(',');

          //删除condition option
          for(var ke in ymq_condition[key]['options']){
            //删除option value
            if (now_key.indexOf("_") != -1) {
              //当now_key的父ID等于options的id时才执行
              if (ymq_condition[key]['options'][ke]['id'] == now_key.split('_')[0]) {
                var value_arr = ymq_condition[key]['options'][ke]['value'].split(',');
                //数组包含要删除的now_key
                if (value_arr.indexOf(now_key) > -1) {
                  //移除
                  value_arr.remove(now_key);
                  //判断数组的length等于0的话斤直接删除这一项
                  if (value_arr.length == 0) {
                    delete ymq_condition[key]['options'][ke];
                    //接着判断ymq_condition[key]['options']是否还有子项，没有直接删除
                    if (Object.keys(ymq_condition[key]['options']).length == 0) {
                      delete ymq_condition[key];
                    }
                  }else{
                    ymq_condition[key]['options'][ke]['value'] = value_arr.join(",")
                  }
                }
              }
            }else{
              //删除option
              if (ymq_condition[key]['options'][ke]['id'] == now_key) {
                delete ymq_condition[key]['options'][ke];
                //如果没有子项直接删除
                if (Object.keys(ymq_condition[key]['options']).length == 0) {
                  delete ymq_condition[key];
                }
              }
            }
          }  
      }
      console.log(ymq_condition)
    }
  
    //删除option
    $(document).on('click', '.option_delete', function () {
      //删除option，修改json
      delete ymq_option[key_prefix+$(this).data('id')];
      deleteConditionByOption($(this).data('id'))
      console.log(ymq_option);
      $(this).parent('.option_box_header').parent('.option_box').remove();
    });

    

    //删除option value
    $(document).on('click', '.option_value_delete', function () {
      //删除option value，修改json
      delete ymq_option[key_prefix+$(this).data('pid')]['options'][$(this).data('id')];
      deleteConditionByOption($(this).data('id'))
      console.log(ymq_option);
      $(this).parent('div').parent('div').parent('.list-group-item').remove();
    });

    //新增option value选择
    $(document).on('click', '.add_choice', function () {
      add_option_value($(this))
    });



    
    
    
    //option表单改变构造json数据
    $(document).on('change', '.option_json', function () {
        var value = get_input_value($(this));
        //给json新增
        ymq_option[key_prefix+$(this).data('id')][$(this).data('key')] = value;
        console.log(ymq_option);
    })  
    //option value表单改变构造json数据
    $(document).on('change', '.option_value_json', function () {
        var value = get_input_value($(this));
        //给json新增
        ymq_option[key_prefix+$(this).data('pid')]['options'][$(this).data('id')][$(this).data('key')] = value;
        console.log(ymq_option);
    })  

    $(document).on('click', '.add_new_condition', function () {
        if ($('.condition_box .condition_item').length > 0) {
            if ($('.condition_andor').val() == '||') {
                var andor = `<span class="anor_text">OR</span>`;
            }else{
                var andor = `<span class="anor_text">AND</span>`;
            }
        }else{
            var andor = `IF`;
        }
        var available_option_html = creat_option_select(available_option);
        var html = `
            <div class="card padding_tb_15 margin0 condition_item condition_item${$(this).data('index')}" data-index="${$(this).data('index')}">
                <div class="row align_center">
                  <div class="col-1 text-right padding_r0">
                  ${andor}
                  </div>
                  <div class="col-3 option_select_box">
                    ${available_option_html}
                  </div>
                  <div class="col-1">
                    <div class="condition_value_delete">
                      <img class="delete_svg" src="/svg/delete.png">
                    </div>
                  </div>
                </div>
            </div>
        `;
        $('.condition_box').append(html);
        $(".select2").select2({minimumResultsForSearch: -1});
        $(this).data('index',Number($(this).data('index'))+1);
    })
    //保存
    // $(document).on('click', '.save', function () {
    //     save()
    // });
    $('#optionForm').ymqValidate(function(){
      save()
    });

    var default_header_info = {"required":"0","tooltip":"","tooltip_position":"1","help":""};
    var filed_info = {"price":"","price_type":"1","one_time":"0","sku":"","min_char":"","max_char":"","default_text":"","min":"","max":"","field_type":"1"};
    var switch_info = {"price":"","price_type":"1","one_time":"0","sku":"","switch_text":"","default":"0"};
    var color_info = {"price":"","price_type":"1","one_time":"0","sku":""};
    var area_info = {"price":"","price_type":"1","one_time":"0","sku":"","min_char":"","max_char":"","default_text":""};
    var file_info = {"price":"","price_type":"1","one_time":"0","sku":"","file_type":"1","btn_text":"Upload"};
    var option_value_default_info = {"value":"","price":"","price_type":"1","one_time":"0","sku":"","default":"0"};
    var canvas_default_info = {"value":"","price":"","price_type":"1","one_time":"0","sku":"","default":"0","canvas_type":"1","canvas1":"","canvas2":""};
    var date_info = {"price":"","price_type":"1","one_time":0,"sku":"","date_format":"","date_minDateType":0,"min_date":"","date_maxDateType":0,"max_date":"","min_time":"","max_time":"","weekly_limit":[],"day_limit":[]};
    function save(){
        var linshi_default_header_info = default_header_info;
        var error_num = 0;
        //给没有值的配置默认值
        for(var key in ymq_option){
            if ([4,6].includes(Number(type))) {
              linshi_default_header_info.style = "0";
            }
            var item = ymq_option[key];
            var type = Number(item[['type']]);
            //给公共头部配置信息
            for(var ke in default_header_info){
                if(!item.hasOwnProperty(ke)){
                    ymq_option[key][ke] = default_header_info[ke]
                }
            }
            if ([1].includes(type)) {
                for(var ke in filed_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = filed_info[ke]
                    }
                }
            }
            if ([2].includes(type)) {
                for(var ke in area_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = area_info[ke]
                    }
                }
            }
            if ([9,10].includes(type)) {
                for(var ke in date_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = date_info[ke]
                    }
                }
            }
            
            if ([3,4,5,6,7,8].includes(type)) {
                //没有option value提示报错
                if(!item.hasOwnProperty('options')){
                    error_num++;
                    //把错误显示出来;
                }else{
                    for(var ke in item['options']){
                        if ([5,8].includes(type)) {
                          for(var k in canvas_default_info){
                              if(!item['options'][ke].hasOwnProperty(k)){
                                  ymq_option[key]['options'][ke][k] = canvas_default_info[k]
                              }
                          }
                        }else{
                          for(var k in option_value_default_info){
                              if(!item['options'][ke].hasOwnProperty(k)){
                                  ymq_option[key]['options'][ke][k] = option_value_default_info[k]
                              }
                          }
                        }
                        
                    }
                }
            }
            
            if ([13].includes(type)) {
                for(var ke in file_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = file_info[ke]
                    }
                }
            }
            if ([13].includes(type)) {
                for(var ke in switch_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = switch_info[ke]
                    }
                }
            }
            if ([14].includes(type)) {
                for(var ke in color_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = color_info[ke]
                    }
                }
            }

        }
        console.log(ymq_option);
        var option = JSON.stringify(ymq_option);
        var condition = JSON.stringify(ymq_condition);
        var product_id = 1;
        console.log(option);
        console.log(condition);
        $.ajax({
            type: 'POST',
            url: '/api/option/save',
            dataType: 'json',
            data: {product_id,option,condition},
            success: function (res) {


            },
            error: function (jqXHR) {
                that.removeClass('btn-progress').children('.start-next').show();
            }
        });
    }
    
    //获取input的值
    function get_input_value(that){
        var value = that.val();
        if (that.attr('type') == 'checkbox') {
            var value = 0;
            if (that.is(":checked")) {
                value = 1; 
            }
        }
        return value;
    }

    $(document).on('input propertychange', '.option_title_input', function () {
      $('.option_title'+$(this).data('id')).text($(this).val());
    })

    //默认按钮取消选中
    $(document).on('input propertychange', '.default_radio', function () {
      if ($(this).is(":checked")) {
        $('.default_radio'+$(this).data('pid')).prop('checked', false).change();
          // 把自己设置为选中
          $(this).prop('checked',true);
        }
    })

    //折叠显示
    $(document).on('click', '.up_down', function () {
        if ($(this).hasClass('is-rotate')) {
         $(this).removeClass('is-rotate');
         $(this).parent('.option_box_header').next('.option_box_body').toggle(100)
        }else{
         $(this).addClass('is-rotate');
         $(this).parent('.option_box_header').next('.option_box_body').toggle(100)
        }
        // rotate($(this).children('img'));
        // $(this).parent('.option_box_header').next('.option_box_body').toggle(100)
    });

    //排序时修改下单的json方法
    function sort_option_json(){
      var linshi_option = {};
        $('.option_box').each(function(){
          linshi_option[key_prefix+$(this).data('id')] = ymq_option[key_prefix+$(this).data('id')];
        })
        ymq_option = linshi_option;
    }
    //排序时修改下单选项的json方法
    function sort_option_value_json(sort_id){
        var that = $('#'+sort_id);
        var linshi_option = {};
        $('#'+sort_id+' .option_value_box').each(function(){
            linshi_option[$(this).data('id')] = ymq_option[key_prefix+that.data('id')]['options'][$(this).data('id')];
        })
        ymq_option[key_prefix+that.data('id')]['options'] = linshi_option;
    }

    
    //给选择系列的下单添加排序
    function add_sort(sort_id){
      var sort_code = `
        new Sortable(${sort_id}, {
            handle: '.handle_value',
            animation: 150,
            ghostClass: 'blue-background-class',
            chosenClass: "sort_chosen",
            dragClass: "sort_drag",
            // 列表的任何更改都会触发
            onSort: function (evt) {
                //顺序改变修改，修改json
                sort_option_value_json('${sort_id}');
                console.log(ymq_option)
            }
        });
      `;
        if ($(`#${sort_id}`).length > 0) {
            eval(sort_code);
        }
    }
    //添加选择的option_value
    function add_option_value(that){
      var appendHtml = add_option_value_html(that.data('id'),that.data('index'),that.data('type'));
      $('#option_'+that.data('id')).append(appendHtml)
      $(".select2").select2({minimumResultsForSearch: -1});
      $('.color_picker').ymqColorpicker();
      //给json新增
      if(!ymq_option[key_prefix+that.data('id')].hasOwnProperty("options")){
          ymq_option[key_prefix+that.data('id')]['options'] = {};
      }
      ymq_option[key_prefix+that.data('id')]['options'][that.data('id')+'_'+that.data('index')] = {};
      ymq_option[key_prefix+that.data('id')]['options'][that.data('id')+'_'+that.data('index')]['id'] = that.data('id')+'_'+that.data('index');
      console.log(ymq_option);

      that.data('index',Number(that.data('index'))+1);
    }

    ///////////////////下面是构建html的所有方法/////////////////////
    //构建下单属性的html
    function createOptionHtml(type,now_index,value = null){
      //设定初始值
      if (value == null) {
        var commonValue = {"label":"","required":0,"tooltip":"","help":"","tooltip_position":"1"};
      }else{
        var commonValue = value;
      }
      var ridao_html = ``;
      switch(type)
      {
          case '1':
              var optionHtml = ceratTextArea(1,value);
              var option_type_text = 'Field';
              break;
          case '2':
              var optionHtml = ceratTextArea(2,value);
              var option_type_text = 'Area';
              break;
          case '3':
              var optionHtml = ceratChoice(3,value);
              var option_type_text = 'Drop-down';
              break;
          case '4':
              var optionHtml = ceratChoice(4,value);
              var option_type_text = 'Radio';
              break;
          case '5':
              var optionHtml = ceratChoice(5,value);
              var option_type_text = '画布单选';
              break;
          case '6':
              var optionHtml = ceratChoice(6,value);
              var option_type_text = 'CheckBox';
              break;
          case '7':
              var optionHtml = ceratChoice(7,value);
              var option_type_text = 'Multiple Select';
              break;
          case '8':
              var optionHtml = ceratChoice(8,value);
              var option_type_text = '画布多选';
              break;
          case '9':
              var optionHtml = ceratDate(9,value);
              var option_type_text = 'Date';
              break;
          case '10':
              var optionHtml = ceratDate(10,value);
              var option_type_text = 'Date Range';
              break;
          case '12':
              var optionHtml = ceratFileArea(12,value);
              var option_type_text = 'File';
              break; 
          case '13':
              var optionHtml = ceratSwitch_color(13,value);
              var option_type_text = 'Switch';
              break;
          case '14':
              var optionHtml = ceratSwitch_color(14,value);
              var option_type_text = 'Color pick';
              break;
      }
      if ([4,6].includes(Number(type))) {
        ridao_html = `
          <div class="col-2">
            <div class="form-group">
              <label>Style</label>
              <select class="form-control select2 style option_json" data-id="option_id" data-key="style">
                <option value="0" ${Number(commonValue['style'])== 0 ? 'selected' : ''}>Default</option>
                <option value="1" ${Number(commonValue['style'])== 1 ? 'selected' : ''}>Normal</option>
                <option value="2" ${Number(commonValue['style'])== 2 ? 'selected' : ''}>Button</option>
              </select>
            </div>
          </div>
        `
      }
      var appendHtml = `
        <div class="option_box list-group-item card" data-id="option_id" data-type="${type}">
            <div class="option_box_header card-header">
              <div class="up_down is-rotate">
                <img src="/svg/down.png">
              </div>
              <div class="handle">
                <img src="/svg/sort.png">
              </div>
              <span class="option-type-text btn btn-dark btn_type">${option_type_text}</span>
              <span class="option_title option_titleoption_id">${commonValue['label']}</span>
              <span class="btn btn-secondary condition option_condition" data-id="option_id">Condition</span>
              <div class="option_delete" data-id="option_id">
                <img src="/svg/delete.png">
              </div>
            </div>
            <div class="option_box_body card-body" style="display:block;">
              <div class="row option_value_header">
                <div class="col-2">
                  <div class="form-group">
                    <label>Option Title</label>
                    <input ymq-validate="require" value="${commonValue['label']}" class="option_title_input form-control option_json" data-key="label" data-id="option_id" type="text">
                  </div>
                </div>
                <div class="col-1">
                  <div class="form-group">
                    <div class="control-label">Required</div>
                    <div class="custom-switches-stacked">
                      <label class="custom-switch">
                        <input type="checkbox" name="required" ${Number(commonValue['required'])== 1 ? 'checked' : ''} class="custom-switch-input option_json" data-id="option_id" data-key="required" value="1">
                        <span class="custom-switch-indicator"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col-2">
                  <div class="form-group">
                    <label>Tooltip</label>
                    <input class="form-control tooltip_text option_json" value="${commonValue['tooltip']}" data-id="option_id" data-key="tooltip" type="text">
                  </div>
                </div>
                <div class="col-3">
                  <div class="form-group">
                    <label>Tooltip position</label>
                    <select class="form-control select2 tooltip_position option_json" data-id="option_id" data-key="tooltip_position">
                      <option value="1" ${Number(commonValue['tooltip_position'])== 1 ? 'selected' : ''}>Above the entire option</option>
                      <option value="2" ${Number(commonValue['tooltip_position'])== 2 ? 'selected' : ''}>Below the entire option</option>
                      <option value="3" ${Number(commonValue['tooltip_position'])== 3 ? 'selected' : ''}>Below the option title</option>
                      <option value="4" ${Number(commonValue['tooltip_position'])== 4 ? 'selected' : ''}>Right of option title</option>
                    </select>
                  </div>
                </div>
                
                <div class="col-2">
                  <div class="form-group">
                    <label>Help Text</label>
                    <input class="form-control help_text option_json" value="${commonValue['help']}" type="text" data-id="option_id" data-key="help">
                  </div>
                </div>
                ${ridao_html}
              </div>
              ${optionHtml}
            </div>
          </div>
      `;
      //新增option，修改json
      appendHtml = appendHtml.replace(/option_id/g,now_index);

      $('#option_sort').append(appendHtml);
      

      //如果是选择就初始化排序功能
      if(hasOptionValueArr.indexOf(type) > -1){
        add_sort('option_'+now_index);
      }
    }

    

    function ceratSwitch_color(type,value = null){
        //没有初始值
        if (value == null) {
          value = switch_info;
        }
        var diff_html = ``;
        if (Number(type) == 13) {
          var diff_html = `
            <div class="col-2">
                <div class="form-group">
                  <label>is Checked</label>
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="default" ${Number(value['default'])== 1 ? 'checked' : ''} class="custom-switch-input option_json default_radio default_radiooption_id" data-key="default" data-id="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Switch show text</label>
                <input ymq-validate="require" class="form-control switch_text option_json" data-key="switch_text" data-id="option_id" value="${value['switch_text']}" type="text">
              </div>
            </div>
          `;
        }
        var filed_area_value = `
          <div class="row align_center">
            <div class="col-1 padding_r0">
              <div class="form-group">
                <label>Price</label>
                <input ymq-validate="number" class="form-control value_price option_json" data-key="price" data-id="option_id" type="text" value="${value['price']}">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Price Type</label>
                <select class="form-control select2 value_price_type option_json" data-key="price_type" data-id="option_id">
                  <option value="1" ${Number(value['price_type'])== 1 ? 'selected' : ''}>Fixed</option>
                  <option value="2" ${Number(value['price_type'])== 2 ? 'selected' : ''}>Percent</option>
                </select>
              </div>
            </div>
            <div class="col-1">
              <div class="form-group">
                <label>One Time</label>
                <div class="custom-switches-stacked">
                  <label class="custom-switch">
                    <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_json" data-key="one_time" data-id="option_id" value="1">
                    <span class="custom-switch-indicator"></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>SKU</label>
                <input class="form-control value_sku option_json" data-key="sku" data-id="option_id" value="${value['sku']}" type="text">
              </div>
            </div>
            ${diff_html}
          </div>
      `; 
      return filed_area_value;
    }

    //构建text系列html
    function ceratTextArea(type,value = null){
        //没有初始值
        if (value == null) {
          if (type == 1) {
            value = filed_info;
          }else{
            value = area_info;
          }
        }
        var dif_content = ``;
        //if ([1,2].includes(type)) {
          dif_content = `
          <div class="diff_box col-4">
          <div class="field_type_box field_type_box1 row" style="display:${Number(value['field_type'])== 1 ? 'flex' : 'none'};">
            <div class="col-6">
              <div class="form-group">
                <label>Min Characters</label>
                <input class="form-control min_char option_json" data-key="min_char" data-id="option_id" value="${value['min_char']}" type="number">
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label>Max Characters</label>
                <input class="form-control max_char option_json" data-key="max_char" data-id="option_id" value="${value['max_char']}" type="number">
              </div>
            </div>
          </div>
          <div class="field_type_box field_type_box4 row" style="display:${Number(value['field_type'])== 4 ? 'flex' : 'none'};">
            <div class="col-6">
              <div class="form-group">
                <label>Min</label>
                <input class="form-control min option_json" data-key="min" data-id="option_id" value="${value['min']}" type="number">
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label>Max</label>
                <input class="form-control max option_json" data-key="max" data-id="option_id" value="${value['max']}" type="number">
              </div>
            </div>
          </div>
          </div>
          `
        //}
        var filed_area_value = `
          <div class="row align_center">
            <div class="col-1 padding_r0">
              <div class="form-group">
                <label>Price</label>
                <input ymq-validate="number" class="form-control value_price option_json" data-key="price" data-id="option_id" type="text" value="${value['price']}">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Price Type</label>
                <select class="form-control select2 value_price_type option_json" data-key="price_type" data-id="option_id">
                  <option value="1" ${Number(value['price_type'])== 1 ? 'selected' : ''}>Fixed</option>
                  <option value="2" ${Number(value['price_type'])== 2 ? 'selected' : ''}>Percent</option>
                </select>
              </div>
            </div>
            <div class="col-1">
              <div class="form-group">
                <label>One Time</label>
                <div class="custom-switches-stacked">
                  <label class="custom-switch">
                    <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_json" data-key="one_time" data-id="option_id" value="1">
                    <span class="custom-switch-indicator"></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>SKU</label>
                <input class="form-control value_sku option_json" data-key="sku" data-id="option_id" value="${value['sku']}" type="text">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Type</label>
                <select class="form-control select2 option_json field_type" data-key="field_type" data-id="option_id">
                  <option value="1" ${Number(value['field_type'])== 1 ? 'selected' : ''}>normal</option>
                  <option value="2" ${Number(value['field_type'])== 2 ? 'selected' : ''}>email</option>
                  <option value="3" ${Number(value['field_type'])== 3 ? 'selected' : ''}>Phone Number</option>
                  <option value="4" ${Number(value['field_type'])== 4 ? 'selected' : ''}>number</option>
                  <option value="5" ${Number(value['field_type'])== 5 ? 'selected' : ''}>Integer</option>
                  <option value="6" ${Number(value['field_type'])== 6 ? 'selected' : ''}>Float</option>
                  
                </select>
              </div>
            </div>
            ${dif_content}
            <div class="col-12">
              <div class="form-group">
                <label>Default Text</label>
                <input class="form-control default_text option_json" data-key="default_text" data-id="option_id" value="${value['default_text']}" type="text">
              </div>
            </div>
          </div>
      `; 
      return filed_area_value;
    }

    //构建File系列html
    function ceratFileArea(type,value = null){
        //没有初始值
        if (value == null) {
          value = file_info;
        }
        var file_value = `
          <div class="row align_center">
            <div class="col-2">
              <div class="form-group">
                <label>Price</label>
                <input ymq-validate="number" class="form-control value_price option_json" data-key="price" data-id="option_id" type="text" value="${value['price']}">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Price Type</label>
                <select class="form-control select2 value_price_type option_json" data-key="price_type" data-id="option_id">
                  <option value="1" ${Number(value['price_type'])== 1 ? 'selected' : ''}>Fixed</option>
                  <option value="2" ${Number(value['price_type'])== 2 ? 'selected' : ''}>Percent</option>
                </select>
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>One Time</label>
                <div class="custom-switches-stacked">
                  <label class="custom-switch">
                    <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_json" data-key="one_time" data-id="option_id" value="1">
                    <span class="custom-switch-indicator"></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>SKU</label>
                <input class="form-control value_sku option_json" data-key="sku" data-id="option_id" value="${value['sku']}" type="text">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>button text</label>
                <input class="form-control btn_text option_json" data-key="btn_text" data-id="option_id" value="${value['btn_text']}" type="text">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>File type</label>
                <select class="form-control select2 option_json file_type" data-key="file_type" data-id="option_id">
                  <option value="1" ${Number(value['file_type'])== 1 ? 'selected' : ''}>image</option>
                  <option value="2" ${Number(value['file_type'])== 2 ? 'selected' : ''}>Archive</option>
                  <option value="3" ${Number(value['file_type'])== 3 ? 'selected' : ''}>PDF</option>
                  <option value="4" ${Number(value['file_type'])== 4 ? 'selected' : ''}>World</option>
                  <option value="5" ${Number(value['file_type'])== 5 ? 'selected' : ''}>Excel</option>
                </select>
              </div>
            </div>
          </div>
      `; 
      return file_value;
    }

    //构建date系列html
    function ceratDate(type,value = null){
        //没有初始值
        if (value == null) {
          value = date_info;
        }
        var date_value = `
          <div class="row align_center">
            <div class="col-2">
              <div class="form-group">
                <label>Price</label>
                <input ymq-validate="number" class="form-control value_price option_json" data-key="price" data-id="option_id" type="text" value="${value['price']}">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Price Type</label>
                <select class="form-control select2 value_price_type option_json" data-key="price_type" data-id="option_id">
                  <option value="1" ${Number(value['price_type'])== 1 ? 'selected' : ''}>Fixed</option>
                  <option value="2" ${Number(value['price_type'])== 2 ? 'selected' : ''}>Percent</option>
                </select>
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>One Time</label>
                <div class="custom-switches-stacked">
                  <label class="custom-switch">
                    <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_json" data-key="one_time" data-id="option_id" value="1">
                    <span class="custom-switch-indicator"></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>SKU</label>
                <input class="form-control value_sku option_json" data-key="sku" data-id="option_id" value="${value['sku']}" type="text">
              </div>
            </div>
            <div class="col-4">
              <div class="form-group">
                <label>Date format</label>
                <select class="form-control select2 option_json" data-key="date_format" data-id="option_id">
                  <option ${Number(value['date_format'])== 'YYYY-MM-DD hh:mm:ss' ? 'selected' : ''} value="YYYY-MM-DD hh:mm:ss">YYYY-MM-DD hh:mm:ss</option>
                  <option ${Number(value['date_format'])== 'YYYY-MM-DD' ? 'selected' : ''} value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option ${Number(value['date_format'])== 'YYYY-MM' ? 'selected' : ''} value="YYYY-MM">YYYY-MM</option>
                  <option ${Number(value['date_format'])== 'YYYY' ? 'selected' : ''} value="YYYY">YYYY</option>
                  <option ${Number(value['date_format'])== 'hh:mm:ss' ? 'selected' : ''} value="hh:mm:ss">hh:mm:ss</option>
                </select>
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Min Date</label>
                <select class="form-control select2 option_json dateType" data-key="date_minDateType" data-id="option_id">
                  <option ${Number(value['date_minDateType'])== 0 ? 'selected' : ''} value="0">none</option>
                  <option ${Number(value['date_minDateType'])== 1 ? 'selected' : ''} value="1">That day</option>
                  <option ${Number(value['date_minDateType'])== 2 ? 'selected' : ''} value="2">customize</option>
                </select>
              </div>
            </div>
            <div class="col-2" style="display: ${Number(value['date_minDateType'])== 2 ? 'block' : 'none'};">
              <div class="form-group">
                <label>Min Date</label>
                <input class="form-control min_date option_json" data-key="min_date" readonly onclick="dateDD(this);" data-id="option_id" value="${value['min_date']}">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Max Date</label>
                <select class="form-control select2 option_json dateType" data-key="date_maxDateType" data-id="option_id">
                  <option ${Number(value['date_maxDateType'])== 0 ? 'selected' : ''} value="0">none</option>
                  <option ${Number(value['date_maxDateType'])== 1 ? 'selected' : ''} value="1">That day</option>
                  <option ${Number(value['date_maxDateType'])== 2 ? 'selected' : ''} value="2">customize</option>
                </select>
              </div>
            </div>
            <div class="col-2" style="display: ${Number(value['date_maxDateType'])== 2 ? 'block' : 'none'};">
              <div class="form-group">
                <label>Max Date</label>
                <input class="form-control max_date option_json" data-key="max_date" readonly onclick="dateDD(this);" data-id="option_id" value="${value['max_date']}">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Min Time</label>
                <input class="form-control min_time option_json" data-key="min_time" readonly onclick="dateTime(this);" data-id="option_id" value="${value['min_time']}">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Max Time</label>
                <input class="form-control max_time option_json" data-key="max_time" readonly onclick="dateTime(this);" data-id="option_id" value="${value['max_time']}">
              </div>
            </div>
            <div class="col-3">
              <div class="form-group">
                <label>Weekly limit</label>
                <select class="form-control select2 option_json" data-key="weekly_limit" data-id="option_id" multiple="">
                    <option ${value.weekly_limit.includes("0") ? 'selected' : ''} value="0">Sunday</option>
                    <option ${value.weekly_limit.includes("1") ? 'selected' : ''} value="1">Monday</option>
                    <option ${value.weekly_limit.includes("2") ? 'selected' : ''} value="2">Tuesday</option>
                    <option ${value.weekly_limit.includes("3") ? 'selected' : ''} value="3">Wednesday</option>
                    <option ${value.weekly_limit.includes("4") ? 'selected' : ''} value="4">Thursday</option>
                    <option ${value.weekly_limit.includes("5") ? 'selected' : ''} value="5">Friday</option>
                    <option ${value.weekly_limit.includes("6") ? 'selected' : ''} value="6">Saturday</option>
                </select>
              </div>
            </div>
            <div class="col-3">
              <div class="form-group">
                <label>Limit by date</label>
                <select class="form-control select2 option_json" data-key="day_limit" data-id="option_id" multiple="">
                    <option ${value.day_limit.includes("1") ? 'selected' : ''} value="1">1</option>
                    <option ${value.day_limit.includes("2") ? 'selected' : ''} value="2">2</option>
                    <option ${value.day_limit.includes("3") ? 'selected' : ''} value="3">3</option>
                    <option ${value.day_limit.includes("4") ? 'selected' : ''} value="4">4</option>
                    <option ${value.day_limit.includes("5") ? 'selected' : ''} value="5">5</option>
                    <option ${value.day_limit.includes("6") ? 'selected' : ''} value="6">6</option>
                    <option ${value.day_limit.includes("7") ? 'selected' : ''} value="7">7</option>
                    <option ${value.day_limit.includes("8") ? 'selected' : ''} value="8">8</option>
                    <option ${value.day_limit.includes("9") ? 'selected' : ''} value="9">9</option>
                    <option ${value.day_limit.includes("10") ? 'selected' : ''} value="10">10</option>
                    <option ${value.day_limit.includes("11") ? 'selected' : ''} value="11">11</option>
                    <option ${value.day_limit.includes("12") ? 'selected' : ''} value="12">12</option>
                    <option ${value.day_limit.includes("13") ? 'selected' : ''} value="13">13</option>
                    <option ${value.day_limit.includes("14") ? 'selected' : ''} value="14">14</option>
                    <option ${value.day_limit.includes("15") ? 'selected' : ''} value="15">15</option>
                    <option ${value.day_limit.includes("16") ? 'selected' : ''} value="16">16</option>
                    <option ${value.day_limit.includes("17") ? 'selected' : ''} value="17">17</option>
                    <option ${value.day_limit.includes("18") ? 'selected' : ''} value="18">18</option>
                    <option ${value.day_limit.includes("19") ? 'selected' : ''} value="19">19</option>
                    <option ${value.day_limit.includes("20") ? 'selected' : ''} value="20">20</option>
                    <option ${value.day_limit.includes("21") ? 'selected' : ''} value="21">21</option>
                    <option ${value.day_limit.includes("22") ? 'selected' : ''} value="22">22</option>
                    <option ${value.day_limit.includes("23") ? 'selected' : ''} value="23">23</option>
                    <option ${value.day_limit.includes("24") ? 'selected' : ''} value="24">24</option>
                    <option ${value.day_limit.includes("25") ? 'selected' : ''} value="25">25</option>
                    <option ${value.day_limit.includes("26") ? 'selected' : ''} value="26">26</option>
                    <option ${value.day_limit.includes("27") ? 'selected' : ''} value="27">27</option>
                    <option ${value.day_limit.includes("28") ? 'selected' : ''} value="28">28</option>
                    <option ${value.day_limit.includes("29") ? 'selected' : ''} value="29">29</option>
                    <option ${value.day_limit.includes("30") ? 'selected' : ''} value="30">30</option>
                    <option ${value.day_limit.includes("31") ? 'selected' : ''} value="31">31</option>
                </select>
              </div>
            </div>
          </div>
      `; 
      return date_value;
    }

    //构建选择系列html
    function ceratChoice(type,value = null){
      var option_value_index = 1;
      console.log(value) 
      var optionsHtml = ``;
      if (value != null) {
        for(var key in value['options']){
          var index = value['options'][key]['id'].split('_')[1];
          //初始化option_value_index
          if (option_value_index < index) {
            option_value_index = index;
          }
          optionsHtml += add_option_value_html(value['id'],index,type,value['options'][key]);
        }
        console.log(optionsHtml)
        option_value_index++;
      }
      //画布
      if (canvasTypeArr.includes(type)) {
        var select_radio_option = `
          <div class="select_body">
                <div class="card">
                  <div class="row select_item">
                    <div class="col-2 padding_left_30">Title</div>
                    <div class="col-1 padding0">Price</div>
                    <div class="col-1 padding_r0">Price Type</div>
                    <div class="col-1 padding_r0">One Time</div>
                    <div class="col-3 padding_r0">画布</div>
                    <div class="col-1 padding_r0">SKU</div>
                    <div class="col-1">Default</div>
                    <div class="col-2">Condition</div>
                  </div>
                </div>
                <div class="list-group option_value_list" data-id="option_id" id="option_option_id">
                  ${optionsHtml}
                </div>
                <span class="btn btn-secondary add_choice" data-type="${type}" data-id="option_id" data-index="${option_value_index}">Add Value</span>
            </div>
        `;
      }else{
        var select_radio_option = `
          <div class="select_body">
                <div class="card">
                  <div class="row select_item">
                    <div class="col-2 padding_left_30">Title</div>
                    <div class="col-2">Price</div>
                    <div class="col-2">Price Type</div>
                    <div class="col-1 padding0">One Time</div>
                    <div class="col-2">SKU</div>
                    <div class="col-1">Default</div>
                    <div class="col-2">Condition</div>
                  </div>
                </div>
                <div class="list-group option_value_list" data-id="option_id" id="option_option_id">
                  ${optionsHtml}
                </div>
                <span class="btn btn-secondary add_choice" data-type="${type}" data-id="option_id" data-index="${option_value_index}">Add Value</span>
            </div>
        `;
      }
      
      return select_radio_option;
    }

    

    function add_option_value_html(pid,index,type,value=null){
      if (value == null) {
        if (canvasTypeArr.includes(type)) {
          value = {"value":"","price":"","price_type":"1","one_time":0,"sku":"","default":0,"canvas_type":1,"canvas1":"","canvas2":""};
        }else{
          value = {"value":"","price":"","price_type":"1","one_time":0,"sku":"","default":0};
        }
      }
      if (canvasTypeArr.includes(type)) {
        var select_raido_option_value = `
          <div class="card list-group-item padding0 option_value_box option_canvas" data-id="option_value_id">
            <div class="row select_item">
              <div class="col-2 padding_left_30">
                <div class="handle_value">
                  <img class="img_24" src="/svg/sort.png">
                </div>
                <div class="form-group">
                  <input ymq-validate="require" value="${value['value']}" class="form-control value_title option_value_json" data-id="option_value_id" data-key="value" data-pid="option_id" type="text">
                </div>
              </div>
              <div class="col-1 padding0">
                <div class="form-group">
                  <input ymq-validate="number" value="${value['price']}" class="form-control value_price option_value_json" data-id="option_value_id" data-key="price" data-pid="option_id" type="text">
                </div>
              </div>
              <div class="col-1 padding_r0">
                <div class="form-group">
                  <select class="form-control select2 value_price_type option_value_json" data-id="option_value_id" data-key="price_type" data-pid="option_id">
                    <option value="1" ${Number(value['price_type'])== 1 ? 'selected' : ''}>Fixed</option>
                    <option value="2" ${Number(value['price_type'])== 2 ? 'selected' : ''}>Percent</option>
                  </select>
                </div>
              </div>
              <div class="col-1 padding_r0">
                <div class="form-group">
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_value_json" data-key="one_time" data-id="option_value_id" data-pid="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-3 padding_r0">
                <div class="row">
                  <div class="col-5 padding_r0">
                    <div class="form-group">
                      <select class="form-control select2 option_value_json canvas_type_select" data-id="option_value_id" data-key="canvas_type" data-pid="option_id">
                        <option value="1" ${Number(value['canvas_type'])== 1 ? 'selected' : ''}>一种颜色</option>
                        <option value="2" ${Number(value['canvas_type'])== 2 ? 'selected' : ''}>图片</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-7 padding_r0 padding-l-5">
                    <div class="canvas_type canvas_type1" style="${Number(value['canvas_type'])== 1 ? '' : 'display: none;'}">
                      <button type="button" class="btn btn-primary color_picker" data-id="1" data-pid="1"><i class="fas fa-fill-drip"></i></button>
                      <span class="color_picker_span" style="background:${value['canvas1']!= '' ? '#'+value['canvas1'] : 'transparent'};"></span>
                      <input type="hidden" name="canvas1" class="option_value_json canvas1" data-id="option_value_id" data-key="canvas1" data-pid="option_id" value="${value['canvas1']}">
                    </div>
                    <div class="canvas_type canvas_type2" style="${Number(value['canvas_type'])== 2 ? '' : 'display: none;'}">
                      <button type="button" class="btn btn-primary selectImgBtn" data-toggle="modal" data-target="#selectImgModel" data-id="option_value_id" data-pid="option_id"><i class="fa fa-upload"></i></button>
                      <img class="canvas_img canvas_img_option_value_id" src="${value['canvas2']!= '' ? basImgUrl+value['canvas2']+img_suffix : '/svg/swatch.png'}">
                      <input type="hidden" name="canvas2" class="option_value_json canvas2" data-id="option_value_id" data-key="canvas2" data-pid="option_id" value="${value['canvas2']}">
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-1 padding_r0">
                <div class="form-group">
                  <input value="${value['sku']}" class="form-control value_sku option_value_json" type="text" data-key="sku" data-id="option_value_id" data-pid="option_id">
                </div>
              </div>
              <div class="col-1">
                <div class="form-group">
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="default" ${Number(value['default'])== 1 ? 'checked' : ''} class="custom-switch-input option_value_json default_radio default_radiooption_id option_value_json" data-key="default" data-id="option_value_id" data-pid="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-2">
                <span class="btn btn-secondary condition option_value_condition" data-id="option_value_id" data-pid="option_id">Condition</span>
                <div class="option_value_delete" data-id="option_value_id" data-pid="option_id">
                  <img class="delete_svg" src="/svg/delete.png">
                </div>
              </div>
            </div>
          </div>
        `;
      }else{
        var select_raido_option_value = `
          <div class="card list-group-item padding0 option_value_box" data-id="option_value_id">
            <div class="row select_item">
              <div class="col-2 padding_left_30">
                <div class="handle_value">
                  <img class="img_24" src="/svg/sort.png">
                </div>
                <div class="form-group">
                  <input ymq-validate="require" value="${value['value']}" class="form-control value_title option_value_json" data-id="option_value_id" data-key="value" data-pid="option_id" type="text">
                </div>
              </div>
              <div class="col-2">
                <div class="form-group">
                  <input ymq-validate="number" value="${value['price']}" class="form-control value_price option_value_json" data-id="option_value_id" data-key="price" data-pid="option_id" type="text">
                </div>
              </div>
              <div class="col-2">
                <div class="form-group">
                  <select class="form-control select2 value_price_type option_value_json" data-id="option_value_id" data-key="price_type" data-pid="option_id">
                    <option value="1" ${Number(value['price_type'])== 1 ? 'selected' : ''}>Fixed</option>
                    <option value="2" ${Number(value['price_type'])== 2 ? 'selected' : ''}>Percent</option>
                  </select>
                </div>
              </div>
              <div class="col-1">
                <div class="form-group">
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_value_json" data-key="one_time" data-id="option_value_id" data-pid="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-2">
                <div class="form-group">
                  <input value="${value['sku']}" class="form-control value_sku option_value_json" type="text" data-key="sku" data-id="option_value_id" data-pid="option_id">
                </div>
              </div>
              <div class="col-1">
                <div class="form-group">
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="default" ${Number(value['default'])== 1 ? 'checked' : ''} class="custom-switch-input option_value_json default_radio default_radiooption_id option_value_json" data-key="default" data-id="option_value_id" data-pid="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-2">
                <span class="btn btn-secondary condition option_value_condition" data-id="option_value_id" data-pid="option_id">Condition</span>
                <div class="option_value_delete" data-id="option_value_id" data-pid="option_id">
                  <img class="delete_svg" src="/svg/delete.png">
                </div>
              </div>
            </div>
          </div>
        `;
      }
      
      select_raido_option_value = select_raido_option_value.replace(/option_value_id/g,pid+'_'+index);
      //多选去除联动效果
      if ([6,7,8].includes(type)) {
          select_raido_option_value = select_raido_option_value.replace(/default_radio/g,'');
      }
      select_raido_option_value = select_raido_option_value.replace(/option_id/g,pid);
      return select_raido_option_value;
    }


    ////////////////////condition////////////////内容
    //删除condition value
    $(document).on('click', '.condition_value_delete', function () {
        $(this).parent('div').parent('div').parent('.condition_item').remove();
    });
    function saveCondition(){
        var json = {};
        var condition_cid = $('.condition_cid').val();
        if (condition_cid.indexOf("_") != -1) {
            json["type"] = "2";
        }else{
            json["type"] = "1";
        }
        json["andor"] = $('.condition_andor').val();
        json["show"] = $('.condition_isshow').val();
        if(ymq_condition.hasOwnProperty(condition_cid)){
            json["children"] = ymq_condition[condition_cid]['children'];
        }else{
            json["children"] = "";
        }
        json['options'] = {};
        var index = 1;
        //遍历
        $('.condition_box .condition_item').each(function(){
            var n_index = $(this).data('index');
            json['options'][index] = {};
            json['options'][index]['id'] = $('.condition_item'+n_index+' .option_select').val();
            json['options'][index]['type'] = $('.condition_item'+n_index+' .condition_type').val();
            if ($('.condition_item'+n_index+' .condition_select_value').length > 0) {
                var value = $('.condition_item'+n_index+' .condition_value').val().join(",");
            }else{
                if ($('.condition_item'+n_index+' .condition_value').length > 0) {
                    var value = $('.condition_item'+n_index+' .condition_value').val();
                }else{
                    var value = "";
                }
            }
            json['options'][index]['value'] = value;
            index++;
        })
        ymq_condition[condition_cid] = json;
        
        addConditionChildren(condition_cid);
        console.log(ymq_condition);
    }
    function deleteCondition(now_key){
        if(ymq_condition.hasOwnProperty(now_key)){
            for(var key in ymq_condition){
                //不操作自己
                if (key == now_key) {
                    continue;
                }
                //把当前condition元素给他的父类添加chiliren
                if (ymq_condition[key]['children'] == '') {
                    var children_arr = [];
                }else{
                    var children_arr = ymq_condition[key]['children'].split(',');
                }
                children_arr.remove(now_key);
                ymq_condition[key]['children'] = children_arr.join(',');
                
            }
            delete ymq_condition[now_key]; 
            console.log(ymq_condition);            
        }
    }

    function addConditionChildren(now_key){
        var options_arr = [];
        //遍历
        for(var key in ymq_condition[now_key]['options']){
            options_arr.push(ymq_condition[now_key]['options'][key]['id']);
        }
        for(var key in ymq_condition){
            //不操作自己
            if (key == now_key) {
                continue;
            }
            //把当前condition元素给他的父类添加chiliren
            if (options_arr.includes(key.split('_')[0])) {
                if (ymq_condition[key]['children'] == '') {
                    var children_arr = [];
                }else{
                    var children_arr = ymq_condition[key]['children'].split(',');
                }
                
                if (!children_arr.includes(now_key)) {
                    children_arr.push(now_key);
                }
                ymq_condition[key]['children'] = children_arr.join(",");
            }

            for(var ke in ymq_condition[key]['options']){
                if (ymq_condition[key]['options'][ke]['id'] == now_key.split('_')[0]) {
                    if (ymq_condition[now_key]['children'] == '') {
                        var children_arr1 = [];
                    }else{
                        var children_arr1 = ymq_condition[now_key]['children'].split(',');
                    }
                    
                    if (!children_arr1.includes(key)) {
                        children_arr1.push(key);
                    }
                    ymq_condition[now_key]['children'] = children_arr1.join(",");
                }
            } 
        }
    }

    //condition弹窗
    $(document).on('click', '.condition', function () {
        $(this).addClass('btn-progress');
        available_option = [];
        var html = getCanUsedOption($(this).data('id'),$(this).data('pid'))
        $(this).fireModal({
            title: 'Add conditions',
            body: html,
            center: true,
            initShow: true,
            removeOnDismiss:true,
            buttons: [
                {
                    text: 'Save',
                    class: 'btn btn-secondary btn-primary',
                    handler: function(modal) {
                        //新增或修改ymq_condition json
                        //如果没有条件则删除对应ymq_condition的key
                        if ($('.condition_box .condition_type').length > 0) {
                            saveCondition();
                        }else{
                            deleteCondition($('.condition_cid').val());
                        }
                        modal.modal('hide');
                    }
                },
                {
                    text: 'Delete',
                    class: 'btn btn-secondary btn-danger',
                    handler: function(modal) {
                        //删除ymq_condition json
                        deleteCondition($('.condition_cid').val());
                        modal.modal('hide');
                    }
                },
                {
                    text: 'Close',
                    class: 'btn btn-secondary btn-shadow',
                    handler: function(modal) {
                        modal.modal('hide');
                    }
                }
            ]
        });
        $(this).removeClass('btn-progress');
        $(".select2").select2({minimumResultsForSearch: -1});
    })

    $(document).on('change', '.condition_andor', function () {
        if ($(this).val() == '||') {
            $('.anor_text').text('OR')
        }else{
            $('.anor_text').text('AND')
        }  
    })
    $(document).on('change', '.field_type', function () {
        $(this).parent().parent().next('.diff_box').children('.field_type_box').hide()
        $(this).parent().parent().next('.diff_box').children('.field_type_box'+$(this).val()).css('display','flex');
        if ($(this).val() == 5 || $(this).val() == 6) {
          $(this).parent().parent().next('.diff_box').children('.field_type_box4').css('display','flex');
        }
    })
    
    //condition select改变时重置后面的select
    $(document).on('change', '.option_select', function () {
        $(this).parents('.option_select_box').next('.col-2').remove();
        $(this).parents('.option_select_box').next('.col-4').remove();
        //不是please choose执行
        if ($(this).val() != 0) {
            //根据type构造condition_type的html
            var selectedDom = $(this).children('option:selected');
            // creat_condition_type(selectedDom.data('type'));
            // creat_children_html($(this).val());
            $(this).parents('.option_select_box').after(creat_condition_type(selectedDom.data('type'))+creat_children_html($(this).val()));
            $(".select2").select2({minimumResultsForSearch: -1});
        }
        
    })  

    function echoCondition(c_id){
        var now_options = ymq_condition[c_id]['options'];
        var init_option = ``;
        if (ymq_condition[c_id]['andor'] == '||') {
            var andor1 = `<span class="anor_text">OR</span>`;
        }else{
            var andor1 = `<span class="anor_text">AND</span>`;
        }
        for(var key in now_options){
            if (key == 1) {
                var andor = 'IF';
            }else{
                var andor = andor1;
            }
            init_option += `
                <div class="card padding_tb_15 margin0 condition_item condition_item${key}" data-index="${key}">
                    <div class="row align_center">
                      <div class="col-1 text-right padding_r0">
                      ${andor}
                      </div>
                      <div class="col-3 option_select_box">
                        ${creat_option_select(available_option,now_options[key]['id'])}
                      </div>
                      ${creat_condition_type(ymq_option[key_prefix+now_options[key]['id']]['type'],now_options[key]['type'])+creat_children_html(now_options[key]['id'],now_options[key]['value'])}
                      <div class="col-1">
                        <div class="condition_value_delete">
                          <img class="delete_svg" src="/svg/delete.png">
                        </div>
                      </div>
                    </div>
                </div>
            `;
        }
        return init_option;
    }
    
    function initConditionHtml(c_id,select){
        var condition_index = 1;
        var init_option = ``;
        if(ymq_condition.hasOwnProperty(c_id)){
            var andor = ymq_condition[c_id]['andor'];
            var show = ymq_condition[c_id]['show'];
            //TODO::初始化condition,还要给condition_index重新赋值
            init_option = echoCondition(c_id);
            condition_index = Object.keys(ymq_condition[c_id]['options']).length;
        }else{
            //设置默认值
            var andor = '||';
            var show = 1;
            init_option = `
                <div class="card padding_tb_15 margin0 condition_item condition_item${condition_index}" data-index="${condition_index}">
                    <div class="row align_center">
                      <div class="col-1 text-right padding_r0">
                      IF
                      </div>
                      <div class="col-3 option_select_box">
                        ${creat_option_select(select)}
                      </div>
                      <div class="col-1">
                        <div class="condition_value_delete">
                          <img class="delete_svg" src="/svg/delete.png">
                        </div>
                      </div>
                    </div>
                  </div>
            `
        }
        var andor = `
            <div class="form-group">
                <select class="form-control select2 condition_andor">
                  <option value="||" ${andor=='||' ? 'selected' : ''}>Any</option>
                  <option value="&&" ${andor=='&&' ? 'selected' : ''}>ALL</option>
                </select>
              </div>
        `;
        var isShow = `
            <div class="form-group">
                <select class="form-control select2 condition_isshow">
                  <option value="1" ${show==1 ? 'selected' : ''}>show</option>
                  <option value="2" ${show==2 ? 'selected' : ''}>hide</option>
                </select>
              </div>
        `;


        var returnHtml = `
            <input type="hidden" class="condition_cid" name="condition_cid" value="${c_id}">
            <div class="card padding_tb_15 margin0">
              <div class="row align_center">
                <div class="col-1 text-right padding_r0">
                Rule
                </div>
                <div class="col-3 align_center">
                  <span class="padding_r15">If</span>
                  ${andor}
                  <span class="padding_l15">these rules match:</span>
                </div>
              </div>
            </div>
            <div class="condition_box">
              ${init_option}
            </div>
            <div class="card  margin0">
              <div class="row align_center">
                <div class="col-1"></div>
                <div class="col-3"><button class="btn btn-primary add_new_condition" data-index="${condition_index+1}">Add Condition</button></div>
              </div>
            </div>

            <div class="card padding_tb_15 margin0">
              <div class="row align_center">
                <div class="col-1 text-right padding_r0">
                Operating
                </div>
                <div class="col-3 align_center">
                  <span class="padding_r15">Then</span>
                  ${isShow}
                </div>
              </div>
            </div>
        `;
        return returnHtml;
    }

    //穿件option_select下拉的html
    function creat_option_select(select,p_id = 0){
        var options = ``;
        select.forEach(function (item) {
            options += `<option value="${item['id']}" data-type="${item['type']}" ${item['id']==p_id ? 'selected' : ''}>${item['label']}</option>`;
        })
        var html = `
            <div class="form-group">
              <select class="form-control select2 option_select">
                <option value="0">pelase choose</option>
                ${options}
              </select>
            </div>
        `;
        return html;
    }


    function getCanUsedOption(c_id,P_id){
        if (P_id == undefined) {
            var P_id = c_id;
        }
        for(var key in ymq_option){
            if (ymq_option[key]["id"] == P_id) {
                continue;
            }
            var item = [];
            //是包含选项的
            if(hasOptionValueArr.indexOf(ymq_option[key]["type"]) > -1){
                //label不为空并且有选项
                if (ymq_option[key]['label'] != '' && ymq_option[key]['label'] != undefined && ymq_option[key].hasOwnProperty("options") && Object.keys(ymq_option[key]["options"]).length > 0) {
                    item['id'] = ymq_option[key]["id"];
                    item['type'] = ymq_option[key]["type"];
                    item['label'] = ymq_option[key]["label"];
                    available_option.push(item);
                }
            }else{
                //label不为空
                if (ymq_option[key]['label'] != '' && ymq_option[key]['label'] != undefined) {
                    item['id'] = ymq_option[key]["id"];
                    item['type'] = ymq_option[key]["type"];
                    item['label'] = ymq_option[key]["label"];
                    available_option.push(item);
                }
            } 
        }
        //初始化html
        return initConditionHtml(c_id,available_option);
        
    }

    function creat_children_html(id,value = ''){
        var option = ymq_option[key_prefix+id];
        if (["1","2"].includes(option['type'])) {
            var inputHtml = `
                <input class="form-control condition_value" type="text" value="${value}">
            `;
        }else if(["9","10"].includes(option['type'])){
            var inputHtml = `
                <input class="form-control condition_value" readonly onclick="dateAndTime(this);" type="text" value="${value}">
            `;
        }else if(["3","4","5","6","7","8"].includes(option['type'])){
            var value_arr = value.split(','); 
            var optionHtml = ``;
            if(option.hasOwnProperty('options')){
                for(var key in option['options']){
                    optionHtml += `<option value="${option['options'][key]['id']}" ${value_arr.includes(option['options'][key]['id']) ? 'selected' : ''}>${option['options'][key]['value']}</option>`
                }
                var inputHtml = `
                    <select class="form-control select2 condition_select_value condition_value" multiple="">
                        ${optionHtml}
                    </select>
                `;
            }else{
                var inputHtml = `No options value available`;
            }
        }else if(option['type'] == "12"){
            var inputHtml = '';
        }
        var returnHtml = `
            <div class="col-4">
                <div class="form-group">
                  ${inputHtml}
                </div>
            </div>
        `;
        return returnHtml;
    }
    var condition_type = {
        1:"is one of",2:"is not one of",3:"is",4:"is not",5:"contains",
        6:"does not contain",7:"equals or greater than",8:"equals or less than",9:"greater than",10:"less than",
        11:"is empty",12:"is not empty",13:"between []",14:"between ()",15:"between (]",16:"between [)"
    };
    function creat_condition_type(type,selected = 0){
        type = Number(type);
        if ([1,2].includes(type)) {
            var need = [3,4,7,8,9,10,11,12,13,14,15,16];
        }else if([3,4,5].includes(type)){
            var need = [1,2,3,4,11,12];
        }else if([6,7,8].includes(type)){
            var need = [1,2,3,4,5,6,11,12];
        }else if([9,10].includes(type)){
            var need = [3,4,7,8,9,10,11,12];
        }else if(type == 12){
            var need = [11,12];
        }else if(type == 13){
            var need = [3,4];
        }

        var option = ``;
        need.forEach((item) => {
          option += `<option value="${item}" ${item==selected ? 'selected' : ''}>${condition_type[item]}</option>`;
        })
        var condition_type_html = `
            <div class="col-2">
                <div class="form-group">
                  <select class="form-control select2 condition_type">
                    ${option}
                  </select>
                </div>
            </div>
        `;
        return condition_type_html;
    }   

  
  jQuery.fn.extend({
      ymqUpload:function(config = {}){
        //默认值
        var defaultConfig = {
          filesSize:100,
          url:'/api/oss/uploadimage',
          multi_selection:true,
          filters : {
            max_file_size : '5mb', //最大只能上传400kb的文件
            //prevent_duplicates : true, //不允许选取重复文件
            mime_types: [
              {title : "Image files", extensions : "jpg,gif,png"},
              {title : "Zip files", extensions : "zip"}
            ]
          }
        };
        //使用配置值覆盖默认配置
        for(var key in defaultConfig){
          if (key == 'filters') {
            if (config.hasOwnProperty(key)) {
              for(var ke in defaultConfig[key]){
                if (config[key].hasOwnProperty(ke)) {
                  defaultConfig[key][ke] = config[key][ke];
                }
              }
            }
          }else{
            if (config.hasOwnProperty(key)) {
              defaultConfig[key] = config[key]
            }
          }
            
        }
        var that = $(this);
        var that_text = that.html();
        //filesAddLength和add_file2个值都是算总的上传进度的
        var filesAddLength = 1;
        var add_file = [];
        //上次文件个数，用来限制文件上传个数限制
        var filesAddNum = 0;
        //var chushiProgress = 0;
        var that = $(this);
        uploade = new plupload.Uploader({
          runtimes : 'html5,flash,silverlight,html4',
          flash_swf_url : 'Moxie.swf',
          silverlight_xap_url : 'Moxie.xap',
          browse_button : that.attr('id'),
          url : defaultConfig.url,
          multi_selection : defaultConfig.multi_selection,
          filters : defaultConfig.filters,
          init: {
            PostInit: function() {
            },
            BeforeUpload: function (uder, files) {
              that.addClass('disabled');
              if (filesAddNum >= defaultConfig.filesSize) {
                console.log('aaa')
                return false;
              }
            },
            FilesAdded: function(up, files) {
              filesAddlength = files.length;
              for(var i = 0, len = files.length; i<len; i++){
                add_file.push(files[i].id);
              }
              //that.html(that_text+' '+chushiProgress+'%');
              up.start()
            },
            FileUploaded: function (uder, file, data) {
              filesAddNum++;
              fileUploaded(uder, file, data)
            },
            UploadProgress: function(up, file) {
              var progress = 0;
              for(var i = 0, len = up.files.length; i<len; i++){
                if (add_file.includes(up.files[i].id)) {
                  progress += up.files[i].percent/filesAddlength;
                }
              }
              console.log(progress);
              // if (progress < 100) {
              //   for (var i = 0; i <= progress-chushiProgress; i++) {
              //     that.html(that_text+' '+Number(Number(progress)+Number(i))+'%')
              //   }
              //   chushiProgress = progress;
              // }
              that.html(that_text+' '+Math.round(progress)+'%')
            },
            UploadComplete: function (uder, files) {
              add_file = [];
              that.html(that_text)
              that.removeClass('disabled');
            },
            Error: function(up, err) {
              add_file = [];
              console.log(err)
              // for(var key in up.files){
              //   if (up.files[key]['id'] == err.file['id']) {
              //     delete up.files[key];
              //   }
              // }
            }
          }
        });

        uploade.init();
        function fileUploaded(uder, file, data){
          var result = JSON.parse(data.response);
          //console.log(result)
          var html = `
            <div class="up_img_box_item" data-src="${result.data.relative_path}" data-dismiss="modal">
              <input class="up_img_checkBox" type="checkBox" name="up_img" value="${result.data.relative_path}">
              <img src="${result.data.oss_url+img_suffix}">
            </div>
          `;
          $('.up_img_box').prepend(html);
        }
        function previewImage(file,callback){
          //file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
          if(!file || !/image\//.test(file.type)) return; //确保文件是图片
          if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
            var fr = new mOxie.FileReader();
            fr.onload = function(){
              callback(fr.result);
              fr.destroy();
              fr = null;
            }
            fr.readAsDataURL(file.getSource());
          }else{
            var preloader = new mOxie.Image();
            preloader.onload = function() {
              preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
              var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
              callback && callback(imgsrc); //callback传入的参数为预览图片的url
              preloader.destroy();
              preloader = null;
            };
            preloader.load( file.getSource() );
          } 
        }
      } 
  });

  $('#select_img').ymqUpload();


  var nextMarker = '';
  var firstImg = '';
  
  $(document).on('click', '.selectImgBtn', function () {
    $('.canvas_pid').val($(this).data('pid'));
    $('.canvas_id').val($(this).data('id'));
    if ($('.up_img_box .up_img_box_item').length == 0) {
      var that = $(this);
      that.addClass('btn-progress');
      getImg(that,true);
    }
  })
  $(document).on('click', '.up_img_box_item', function () {
    $('#option_'+$('.canvas_pid').val()+' .canvas_img_'+$('.canvas_id').val()).attr('src',basImgUrl+$(this).data('src')+img_suffix)
    $('#option_'+$('.canvas_pid').val()+' .canvas_img_'+$('.canvas_id').val()).next('.canvas2').val($(this).data('src')).change();
  })
  $(document).on('click', '.load_more', function () {
    var that = $(this);
    that.addClass('btn-progress');
    getImg(that);
  })

  function getImg(that,first = false){
    $.ymqajax({
        url: "/api/oss/getimage",
        data: {nextMarker},
        success: function (res) {
          console.log(res)
          nextMarker = res.data.nextMarker;
          var pushHtml = ``;
          try{
            res.data.data.forEach((item) => {
                if (firstImg == item) {
                  $('.load_more').text('no more');
                  $('.load_more').addClass('disabled');
                  $('.load_more').removeClass('load_more');
                  throw new Error('End Loop');
                }
                pushHtml += `
                  <div class="up_img_box_item" data-src="${item}" data-dismiss="modal">
                    <input class="up_img_checkBox" type="checkBox" name="up_img" value="${item}">
                    <img src="${basImgUrl+item+img_suffix}">
                  </div>
                `;
            })
          } catch (e) {
              
          }
          
          $('.up_img_box').append(pushHtml);
          if (first) {
            $('.load').hide()
            if (res.data.data.length < 100) {
              $('.load_more').text('no more');
              $('.load_more').addClass('disabled');
              $('.load_more').removeClass('load_more');
            }
            firstImg = res.data.data[0];
          }
          that.removeClass('btn-progress');
        }
    });
  }
  $(document).on('click', '.up_img_delete', function () {
    var img_arr = getCheckboxValue($('.up_img_checkBox:checked'));
    if (img_arr.length > 0) {
      var that = $(this);
      that.addClass('btn-progress');
      $.ymqajax({
          url: "/api/oss/deleteimg",
          data: {img_arr},
          success: function (res) {
            console.log(res)
            deleteCheckboxValue($('.up_img_checkBox:checked'))
            that.removeClass('btn-progress');
          }
      });
    }
  })
  $(document).on('input propertychange', '.up_img_checkBox', function (){
    if ($('.up_img_checkBox:checked').length > 0) {
      $('.up_img_delete').show()
    }else{
      $('.up_img_delete').hide()
    }
  })

  function deleteCheckboxValue(checkboxDmo){
    checkboxDmo.each(function(){
      $(this).parent('.up_img_box_item').remove();
    })
  }

  function getCheckboxValue(checkboxDmo){
    var check_arr = [];
    checkboxDmo.each(function(){
      //check_arr[index] = $(this).val()
      check_arr.push($(this).val());
    })
    return check_arr;
  }

  jQuery.fn.extend({
    ymqColorpicker:function(config = {}){
      if ($(this).length > 0) {
        var color = $(this).parent('.canvas_type').children('.canvas1').val();
        //默认值
        var defaultConfig = {
          submit: 0,
          color:color,
          onSubmit:function(hsb,hex,rgb,el) {
            //$(el).css('background-color', '#'+hex);
            $(el).parent().children('.color_picker_span').css('background','#'+hex);
            $(el).parent().children('.canvas1').val(hex).change();
            $(el).colpickHide();

          }
        };
        //使用配置值覆盖默认配置
        for(var key in defaultConfig){
          if (config.hasOwnProperty(key)) {
            defaultConfig[key] = config[key]
          }  
        }

        $(this).colpick({
          color:defaultConfig.color,
          onSubmit:defaultConfig.onSubmit
        });
      }
    }
  });

  $('.color_picker').ymqColorpicker()

  
  $(document).on('change', '.canvas_type_select', function () {
    $(this).parent().parent().next().children('.canvas_type').hide();
    $(this).parent().parent().next().children('.canvas_type'+$(this).val()).show();
  })

    $('#option_value_img').diyUpload({url:'/api/upload/uploadimage'});

    // function rotate(dom){
    //     var ele = $(dom);
    //     // console.log(ele.css('transform'))
    //     var css = ele.css('transform');
    //     var deg;
    //     var step=180;//每次旋转多少度
    //     if(css === 'none'){
    //         deg = 0;
    //     } else {
    //         deg=eval('get'+css);
    //     }
    //     ele.css({'transform':'rotate('+(deg+step)%360+'deg)'});
    // }

    // function getmatrix(a,b,c,d,e,f){
    //     var aa=Math.round(180*Math.asin(a)/ Math.PI);
    //     var bb=Math.round(180*Math.acos(b)/ Math.PI);
    //     var cc=Math.round(180*Math.asin(c)/ Math.PI);
    //     var dd=Math.round(180*Math.acos(d)/ Math.PI);
    //     var deg=0;
    //     if(aa==bb||-aa==bb){
    //         deg=dd;
    //     }else if(-aa+bb==180){
    //         deg=180+cc;
    //     }else if(aa+bb==180){
    //         deg=360-cc||360-dd;
    //     }
    //     return deg>=360?0:deg;
    //     //return (aa+','+bb+','+cc+','+dd);
    // }
    
    $(document).on('change', '.dateType', function () {
      if ($(this).val() == 2) {
        $(this).parent().parent().next().show();
      }else{
        $(this).parent().parent().next().hide();
      }
    })



    Array.prototype.remove = function(val) { 
        var index = this.indexOf(val); 
        if (index > -1) { 
            this.splice(index, 1); 
        } 
    };
})
var enLang = {                            
      name  : "en",
      month : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      weeks : [ "SU","MO","TU","WE","TH","FR","SA" ],
      times : ["Hour","Minute","Second"],
      timetxt: ["Time","Start Time","End Time"],
      backtxt:"Back",
      clear : "Clear",
      today : "Now",
      yes   : "Confirm",
      close : "Close"
  }
//蓝色主题色
var jedateblue = { bgcolor:"#275efe",color:"#ffffff", pnColor:"#00CCFF"};
// var jedateblue = { bgcolor:"#00A1CB",color:"#ffffff", pnColor:"#00CCFF"};
var jedategreen = {bgcolor:"#00A680",pnColor:"#00DDAA"};
var jedatered = {bgcolor:"#D91600",pnColor:"#FF6653"};
function dateDD(elem){
    jeDate(elem,{
        theme:jedateblue, 
        format: 'YYYY-MM-DD',
        isinitVal:true,
        onClose:true,  
        trigger:false,
        language:enLang,
        donefun: function(obj){
            $(obj.elem).change()
        }  
    });
}
function dateTime(elem){
    jeDate(elem,{
        theme:jedateblue, 
        format: 'hh',
        onClose:false, 
        trigger:false, 
        language:enLang,
        donefun: function(obj){
            $(obj.elem).change()
        }
    });
}
function dateAndTime(elem){
    jeDate(elem,{
        theme:jedateblue, 
        format: 'YYYY-MM-DD hh:mm:ss',
        onClose:false, 
        trigger:false, 
        language:enLang,
        donefun: function(obj){
            $(obj.elem).change()
        }
    });
}
