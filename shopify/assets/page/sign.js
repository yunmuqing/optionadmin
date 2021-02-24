$(document).ready(function () {
    $(".top-close").on('click',function () {
        var data = {
            auth: 'ymq',
            action: 'down-sing-box',
            data:{}
        }
        window.parent.postMessage(data, "*");
    });

    var can_scroll = true;
    $(".chat-content").scroll(function(){

        //console.log($(window).height())
        //console.log($(".chat-content").height() - ($(window).scrollTop() + $(window).height()))
        if ($("body").height() - $(".ymqloading").offset().top < 50 && can_scroll) {
            can_scroll = false;
            //$(".ymqloading *").show();
            var html = `
              <div class="card">
                    <div class="card-body">
                        111
                        <br>
                        222
                        <br>
                        333
                    </div>
                </div>
    `;
            setTimeout(function(){
                //$(".ymqloading *").hide();
                $(".mytest").append(html)
                $(".chat-content").getNiceScroll().onResize();
                can_scroll = true;

            },2000);
        }
    });


    $(".dosign").on('click',function () {
        var that = $(this);
        var cid = $("#app").attr('data-cid');
        var shop_name = $("#app").attr('data-shop_name');
        var ctoken = $("#app").attr('data-ctoken');
        that.addClass('btn-progress').addClass('disabled');
        $.ajax({
            url: '/api/signin/dosign.html',
            type: 'post',
            data: {cid:cid,shop_name:shop_name,ctoken:ctoken},
            dataType: 'json',
            success: function (res) {
                if (res.code == 0){
                    swal(res.msg, '', 'error');
                }else{
                    swal(res.msg, '', 'success');
                    $("#calendar-box .today").addClass('signed');
                }

                that.removeClass('btn-progress').removeClass('disabled');
            }
        });
    });
})







