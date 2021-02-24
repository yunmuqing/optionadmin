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