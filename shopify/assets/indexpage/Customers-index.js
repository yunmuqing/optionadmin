$(document).ready(function () {
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
            url : "/api/customers.html",
            ymqtype: 'modal',
            data:{page,search,status},
            dom: dom,
            success : function(res) {
                var html = '';
                var data = res.data.data;
                data.forEach(function (item) {
                    var badge_class = '';
                    var badge_word = '';
                    if (item['ymqstatus'] == 0){
                        badge_class = 'badge-danger';
                        badge_word = 'Excluded';
                    }else{
                        if (item['orders_count'] == 0){
                            badge_class = 'badge-success';
                            badge_word = 'Member';
                        }else{
                            badge_class = 'badge-info';
                            badge_word = 'Guest';
                        }
                    }
                    html += `
                        <a href="/index/customers/info/id/${item['id']}.html" class="list-group-item list-group-item-model space-between">
                            <div class="media w-50">
                                <figure class="avatar mr-4">
                                    <img src="${item['avatar']}" alt="" role="presentation">
                                </figure>
                                <div class="media-body space-between">
                                    <div class="inline-block">
                                        <p class="mt-0 mb-0 text-dark-1 line-h-1">${item['first_name']} ${item['last_name']}</p>
                                        <p class="mt-0 mb-0 text-light line-h-1">${item['email']}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="space-between w-50">
                                <div class="badge ${badge_class}">${badge_word}</div>
<!--                                <div class="text-light">250 points</div>-->
<!--                                <div class="text-light">0 referrals</div>-->
                            </div>
                        </a>
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
    customers_load(1,null);
    $(".btn-page").on('click',function () {
        if (!$(this).hasClass('disabled')){
            customers_load($(this).attr('data-page'));
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


});