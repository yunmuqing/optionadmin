
(function(ymqJq, window, i) {
    ymqJq.fn.dropdown = function(options) {
        var options = ymqJq.extend({

        }, options);

        this.each(function() {
            i++;
            /**
             * 初始化
             * @type {{}}
             */
            var that = ymqJq(this);
            var slected = {};
            var disabled = {};
            if (that.hasClass('ymq-inited')) {
                var multiple = that.hasClass('ymq-multiple');
                var parentBox = that.parents('.selectDropdown');
                var label = that.next().next();
                initLabelTextAndLiActiveClass();
            }else{
                refreshSelected();
                var multiple = that.hasClass('ymq-multiple');
                var dropdown = ymqJq('<div />').addClass(`ymq-dropdown selectDropdown ${multiple ? 'multiple' : ''}`);

                that.wrap(dropdown);

                var label = ymqJq('<span />').text(ymqJq(this).attr('placeholder')).insertAfter(ymqJq(this));
                var list = ymqJq('<ul class="ymq-multiple-ul"></ul>');


                that.find('option').each(function(index) {
                    list.append(ymqJq(`<li data-index="${index}" class="ymq-multiple-li ${ymqJq(this).prop("disabled") ? 'disabled' : ''}"></li>`).append(ymqJq('<a />').html(ymqJq(this).html())));
                });
                list.insertAfter(ymqJq(this));
                var parentBox = that.parents('.selectDropdown');



                if(!ymqJq.isEmptyObject(slected)){
                    initLabelTextAndLiActiveClass();
                    that.parent().addClass('filled');
                }

                that.addClass('ymq-inited');

                /**
                 * 绑定事件
                 */

                parentBox.find('ul li a').on('click touch', function(e) {


                    var liAdom = ymqJq(this);
                    if (liAdom.parent('li').hasClass('disabled')) {
                        e.preventDefault();
                        return false;
                    }

                    var dropdown = ymqJq(this).parents('.selectDropdown');
                    var select = dropdown.find('.ymq-dropdown');
                    var multiple = that.hasClass('ymq-multiple');
                    var active = ymqJq(this).parent().hasClass('active');
                    var label = active ? dropdown.find('select').attr('placeholder') : ymqJq(this).text();

                    if (multiple){
                        liAdom.parents('.ymq-multiple-li').toggleClass('active');
                        that.find('option').eq(liAdom.parents('.ymq-multiple-li').data('index')).prop('selected', liAdom.parents('.ymq-multiple-li').hasClass('active'));
                        initLabelTextAndLiActiveClass();
                    }else{
                        dropdown.find('option').prop('selected', false);
                        dropdown.find('ul li').removeClass('active');

                        dropdown.toggleClass('filled', !active);
                        dropdown.children('span').text(label);

                        if(!active) {
                            dropdown.find('option:contains(' + ymqJq(this).text() + ')').prop('selected', true);
                            ymqJq(this).parent().addClass('active');
                        }
                    }

                    //如果是多选选择之后则不关闭下拉选项
                    if(multiple){
                        e.preventDefault();
                        return false;
                    }


                });

                /**
                 *
                 */
                parentBox.on('click touch', function(e) {
                    var isOpen = false;
                    if(ymqJq(this).hasClass('open')){
                        isOpen = true;
                    }
                    ymqJq('.ymq-dropdown').removeClass('open');
                    if(!isOpen){
                        ymqJq(this).addClass('open');
                    }
                    e.preventDefault();
                    return false;
                });
            }







            //方法区
            function initLabelTextAndLiActiveClass() {
                refreshSelected();
                var label_html = '';
                parentBox.find('.ymq-multiple-li').removeClass('active').removeClass('disabled');
                Object.keys(slected).forEach(function(key){
                    var data = slected[key];
                    if(multiple){
                        label_html += `<span class="ymq-multiple-item-box"><span class="ymq-multiple-item"><span class="ymq-multiple-text">${data['text']}</span> <span data-index="${key}" class="ymq-multiple-remove"></span></span></span></span>`;
                    }else{
                        label_html = data['text'];
                    }
                    parentBox.find('.ymq-multiple-li').eq(key).addClass('active');
                });

                Object.keys(disabled).forEach(function(key){
                    var data = disabled[key];
                    parentBox.find('.ymq-multiple-li').eq(key).addClass('disabled');
                });

                if(label_html == ''){
                    label_html = that.attr('placeholder');
                }
                label.html(label_html);
                parentBox.find('.ymq-multiple-remove').on('click touch', function(e) {
                    that.find('option').eq(ymqJq(this).data('index')).prop('selected', false);
                    initLabelTextAndLiActiveClass();
                    e.preventDefault();
                    return false;
                });
            }

            function refreshSelected() {
                slected = {};
                disabled = {};
                that.find('option').each(function(index) {
                    if(ymqJq(this).prop('selected') && !ymqJq(this).prop('disabled')){
                        slected[index] = {
                            'value': ymqJq(this).val(),
                            'text': ymqJq(this).html(),
                        };
                    }
                    if (ymqJq(this).prop('disabled')) {
                        disabled[index] = {
                            'value': ymqJq(this).val(),
                            'text': ymqJq(this).html(),
                        };
                    }
                });
            }

        });
    }
    ymqJq(document).on('click touch', function(e) {
        ymqJq('.ymq-dropdown').removeClass('open');
    });
})(ymqJq, this, 0);