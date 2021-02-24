$(document).ready(function () {
    window.parent.postMessage({
        auth: 'ymq',
        action: 'admin-loading',
        data:{}
    }, "*");

    var initWidth = 0;


    $("#ymq-button").on('click',function () {
        var data = {
            auth: 'ymq',
            action: 'up-button-box',
            data:{}
        }
        window.parent.postMessage(data, "*");
        button_class_toggle();
    });

    window.addEventListener('message', function (e) {
        var res = e.data;
        if (res.hasOwnProperty('auth') && res.auth == 'ymq'){
            switch (res.action) {
                case 'do-close':
                    button_class_toggle();
                    break;
                case 'button-width':
                    button_width();
                    break;
                case 'admin-launcher':
                    admin_launcher(res.data);
                    break;
                case 'trigger-click':
                    $("#ymq-button").trigger('click');
                    break;

            }
        }

    }, false);

    function button_width() {
        initWidth = $('#ymq-button').innerWidth();
        editeFatherWidth(initWidth);
    }
    function admin_launcher(data) {
        $('#ymq-button .launcher').attr('src',data.icon);
        $('#ymq-button .ymq-button-text').html(data.text);
        $('#ymq-button').css('background-color',data.bcolor).css('color',data.color);
        if (data.small){
            $('#ymq-button .launcher').addClass('small-icon');
        }else {
            $('#ymq-button .launcher').removeClass('small-icon');
        }
        if (data.layout == 1){
            $('#ymq-button .ymq-button-text').show();
        }else{
            $('#ymq-button .ymq-button-text').hide();
        }
    }
    
    function editeFatherWidth(width) {
        var data = {
            auth: 'ymq',
            action: 'button-width',
            data:{
                width: width
            }
        };
        window.parent.postMessage(data, "*");
    }

    function button_class_toggle() {
        if (!$("#ymq-button").hasClass('bopen')){
            $("#ymq-button").addClass('bopen').removeClass('bclose');
            $('.ymq-button-icon .launcher').velocity({
                opacity: [0,1]
            }, {
                duration: 150,
                complete: function () {
                    $('.ymq-button-icon .close').velocity({
                        opacity: [1,0]
                    }, {
                        duration: 150
                    });
                }
            });
            $("#ymq-button").velocity({
                width: [60,initWidth]
            }, {
                duration: 300,
                easing: 'easeInOutQuart',
                complete: function () {
                    editeFatherWidth(60);
                }
            });
        }else{
            $("#ymq-button").addClass('bclose').removeClass('bopen');
            $('.ymq-button-icon .close').velocity({
                opacity: [0,1]
            }, {
                duration: 150,
                complete: function () {
                    $('.ymq-button-icon .launcher').velocity({
                        opacity: [1,0]
                    }, {
                        duration: 150
                    });
                }
            });
            $("#ymq-button").velocity({
                width: [initWidth,60]
            }, {
                duration: 300,
                easing: 'easeInOutQuart',
                begin: function () {
                    editeFatherWidth(initWidth);
                }
            });

        }
    }
    // $.cookie('test_cookie', 'the_value', { expires: 7, path: '/' });
    // console.log($.cookie('test_cookie'));
})

