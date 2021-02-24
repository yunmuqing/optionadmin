$(document).ready(function () {
    var status = 'all';
    var rating = 'all';
    var withs = 'all';
    var search = null;
    $(document).on('click','#spotlight img',function(){
        alert(1111)
    })


    function customers_load(page){
        var dom = $(".list-group-content");
        var parentdom = dom.parents('.list-group');
        var nextdom = parentdom.find('.btn-next');
        var prevdom = parentdom.find('.btn-prev');
        var load_html = `<div class="list-group-item list-group-item-model space-between">
                            <img class="load" src="/svg/load-blue-44.svg">
                        </div>`;
        dom.html(load_html);
        $.ymqajax({
            url : "/api/reviews",
            ymqtype: 'modal',
            data:{page,search,status,rating,withs},
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
                    var video_bg = `background: #f7f7f7;`;
                    var reviews_videos = ``;
                    if (item.reviews_videos != '' && ymq_plan(ymqShopInfo.plan,'review-image')) {
                        var videos_arr = item.reviews_videos.split(',');
                        videos_arr.forEach(function (video_item) {
                            reviews_videos += `
                                <div class="video_bg" data-src="${video_item}" data-id="${item.id}" style="${video_bg}"><svg t="1604068612250" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1157" width="30" height="30"><path d="M426.666667 682.666667V384l256 149.845333L426.666667 682.666667z m587.093333-355.541334s-10.026667-71.04-40.704-102.357333c-38.954667-41.088-82.602667-41.258667-102.613333-43.648C727.168 170.666667 512.213333 170.666667 512.213333 170.666667h-0.426666s-214.954667 0-358.229334 10.453333c-20.053333 2.389333-63.658667 2.56-102.656 43.648-30.677333 31.317333-40.661333 102.4-40.661333 102.4S0 410.538667 0 493.952v78.293333c0 83.456 10.24 166.912 10.24 166.912s9.984 71.04 40.661333 102.357334c38.997333 41.088 90.154667 39.765333 112.938667 44.074666C245.76 893.568 512 896 512 896s215.168-0.341333 358.442667-10.752c20.053333-2.432 63.658667-2.602667 102.613333-43.690667 30.72-31.317333 40.704-102.4 40.704-102.4s10.24-83.413333 10.24-166.869333v-78.250667c0-83.456-10.24-166.912-10.24-166.912z" fill="#FF0000" p-id="1158"></path></svg></div>
                            `;
                        })
                    }
                    var reviews_images = '';
                    if (item['reviews_images'] != '' && ymq_plan(ymqShopInfo.plan,'review-video')) {
                        var images_arr = item['reviews_images'].split(',');
                        for(j = 0,len=images_arr.length; j < len; j++) {
                           if (j < 2) {
                            reviews_images += `
                                <div class="spotlight" data-description="${item['review']}" data-src="${images_arr[j]}" style="background-image:url(${images_arr[j]}?x-oss-process=image/resize,w_50/quality,q_80)"></div>
                            `
                            }else{
                                reviews_images += `
                                <div class="spotlight" style="display:none;" data-description="${item['review']}" data-src="${images_arr[j]}"></div>
                                `
                            }
                        }
                        if (images_arr.length > 2) {
                            reviews_images += `<div class="gallery-item gallery-more" ><div>+${images_arr.length-2}</div></div>`;
                        }else{
                            reviews_images += `<div style="width: 16px;" ><div></div></div>`;
                        }
                    }
                    if(ymq_plan(ymqShopInfo.plan,'review-audit')){
                        var status_html = `
                            <div class="space-between">
                                <div class="form-group status-group" style="margin-bottom:0;">
                                    <select class="form-control selectric status-select" data-id="${item['id']}">
                                        <option value="0" ${item['status'] == 0 ? 'selected="selected"' : ''}>Pending</option>
                                        <option value="1" ${item['status'] == 1 ? 'selected="selected"' : ''}>Approved</option>
                                        <option value="2" ${item['status'] == 2 ? 'selected="selected"' : ''}>Not Approved</option>
                                    </select>
                                </div>
                            </div>
                        `;
                    }else{
                        if (item['status'] == 0){
                            var status_html = `Pending`;
                        }else if (item['status'] == 1){
                            var status_html = `Approved`;
                        }else if (item['status'] == 2){
                            var status_html = `Not Approved`;
                        }
                    }
                    html += `
                        <div class="list-group-item list-group-item-model space-between">
                            <a href="/index/reviews/edit/id/${item['id']}.html" class="list-group-item-model space-between" style="width:90%;">
                            <div class="media" style="width:22%;">
                                <div class="media-body space-between">
                                    <div class="inline-block">
                                        <p class="mt-0 mb-0 text-dark-1 line-h-1">${item['name']}</p>
                                        <p class="mt-0 mb-0 text-light line-h-1">${item['email']}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="space-between" style="width:20%;">
                                <div class="text-light">${item['rating']} rating</div>
                            </div>
                            <div class="space-between" style="width:20%;line-height: 15px;">
                                <div class="text-light" data-toggle="tooltip" data-placement="bottom">${item['review_title']}</div>
                            </div>
                            <div class="space-between" style="width:20%;line-height: 15px;">
                                <div class="text-light" data-toggle="tooltip" data-placement="bottom" title="${item['review']}">${item['review'].slice(0,50)} ${item['review'].length>50 ? '...' : ''}</div>
                            </div>
                            <div class="space-between spotlight-group spotlight-100" style="width:18%;">
                                ${reviews_videos}${reviews_images}
                            </div>
                            </a>
                            ${status_html}
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
                $("[data-toggle='tooltip']").tooltip();
                $('.selectric').selectric();
            }

        });
    }
    $(document).on('click', '.video_bg', function () {
        var video_src = $(this).data('src')
        var video_id = 'video'+$(this).data('id')
        $(this).fireModal({
            title: '',
            removeOnDismiss: true,
            body: `
                <video src="${video_src}" controls="controls" style="width:100%;" preload="metadata" id="${video_id}"></video>
            `,
            center: true,
            initShow: true
        });
        var is_has_video = true;
        while (is_has_video)
        {
            if ($('#'+video_id).length > 0 ) {
                launchFullscreen($('#'+video_id)[0])
                is_has_video = false;
            }
        }
        return false;
    })
    function launchFullscreen(element)
    {
        //此方法不可以在異步任務中執行，否則火狐無法全屏
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.msRequestFullscreen){
            element.msRequestFullscreen();
        } else if(element.oRequestFullscreen){
            element.oRequestFullscreen();
        }
        else if(element.webkitRequestFullscreen)
        {
            element.webkitRequestFullScreen();
        }else{

            var docHtml  = document.documentElement;
            var docBody  = document.body;
            var videobox  = document.getElementById('videobox');
            var  cssText = 'width:100%;height:100%;overflow:hidden;';
            docHtml.style.cssText = cssText;
            docBody.style.cssText = cssText;
            videobox.style.cssText = cssText+';'+'margin:0px;padding:0px;';
            document.IsFullScreen = true;

        }
    }

    customers_load(1);
    $(".btn-page").on('click',function () {
        if (!$(this).hasClass('disabled')){
            customers_load($(this).attr('data-page'));
        }
    });
    var customers_timeout;
    $(".search-input").on('input', function () {
        clearTimeout(customers_timeout);
        search = $(this).val();
        customers_timeout = setTimeout(function() {
            customers_load(1);
        }, 1000);
    });

    $(document).on('change', '.status-select', function () {
        $.ymqajax({
            url : "/api/reviews/updatestatus",
            ymqtype: 'modal',
            data:{id:$(this).data('id'),status:$(this).val()},
            success : function(res) {
                
            }
        });
    });

    $('.status-select').ymqDropdown({
        text: 'Status',
        item:[
            {
                text: 'All',
                value: 'all'
            },
            {
                text: 'Pending',
                value: 0
            },
            {
                text: 'Approved',
                value: 1
            },
            {
                text: 'Not Approved',
                value: 2
            },
        ],
        change: function (date) {
            status = date.value;
            customers_load(1);
        }
    });
    $('.rating-select').ymqDropdown({
        text: 'Rating',
        item:[
            {
                text: 'All',
                value: 'all'
            },
            {
                text: '1 rating',
                value: 1
            },
            {
                text: '2 rating',
                value: 2
            },
            {
                text: '3 rating',
                value: 3
            },
            {
                text: '4 rating',
                value: 4
            },
            {
                text: '5 rating',
                value: 5
            },
        ],
        change: function (date) {
            rating = date.value;
            customers_load(1);
        }
    });
    $('.withs-select').ymqDropdown({
        text: 'With photos?',
        item:[
            {
                text: 'All',
                value: 'all'
            },
            {
                text: 'with photo',
                value: 1
            },
            {
                text: 'with video',
                value: 2
            }
        ],
        change: function (data) {
            withs = date.value;
            customers_load(1);
        }
    });
    // $(document).on('change', '.status', function () {
    //     status = $(this).val();
    //     customers_load(1);
    // });
    // $(document).on('change', '.rating', function () {
    //     rating = $(this).val();
    //     customers_load(1);
    // });
    // $(document).on('change', '.withs', function () {
    //     withs = $(this).val();
    //     customers_load(1);
    // });

});