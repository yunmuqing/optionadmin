
var ymqShopInfo = JSON.parse(`{"id":27301052464,"name":"pqddemo01","nickname":"testshop","shop":"pqddemo01.myshopify.com","domain":"pqddemo01.myshopify.com","shop_owner":"YMQ YMQ","timezone":"Etc\/UTC","money_format":"$","currency":"EUR","customer_email":"690182300@qq.com","status":1,"branding_id":12876581830704,"branding":{"color":{"banner-background":"linear-gradient(135.19deg,hsla(232,80.8%,67%,1),hsla(232,90.8%,52%,1))","banner-color":"#6777EF","banner-font":"#000000","button-background":"hsla(232,80.8%,67%,1)","button-background-hover":"hsla(232,90.8%,58%,1)","button-color":"#6777EF","button-font":"#fff","icon-color":"#6777EF","link-color":"#6777EF"},"shape":{"container":"1.25","card":"0.25","button":"0.25","input":"0.25"},"wallpaper":"","placement":{"position":"right","spacing":{"side":"23","bottom":"30"}},"visibility":"1","banner-images":"https:\/\/ymq-shopify.oss-us-east-1.aliyuncs.com\/pqddemo01\/2021-02-01\/A2f5mhdw6f.jpg","ymq-branding":"1","setting":{"you_get_points":"10","you_get_commissions":"1","point":{"points_expiry":"12","status":"1"},"commission":{"status":"1"},"vip":{"status":"1"},"free_product":{"status":"1"},"sign_in":{"status":"1","points":"10"},"referrals":{"status":1,"crowd":1},"lan":"ymq-us"},"icon":{"point":"","commission":"","sign_in":"","free_product":"","earn":"","redeem":"","history1":"","history2":"","order":"","birthday":"","register":"","twitterlike":"","twittershare":"","facebooklike":"","facebookshare":"","instagram":"","fixedamount":"","incrementsamount":"","percentage":"","freeshipping":"","pending":"","approved":"","not_approved":"","finish":""},"sort":{"point_login":["point_giftlist","point_introduce","point_history","sign_in","refer"],"point_logout":["become","point_introduce","sign_in","refer"],"home_login":["point","commission","sign_in","free-product","vip","refer"],"home_logout":["become","point","commission","sign_in","free-product","vip","refer"],"header":{"logout_caption":"Welcome to","title":"testshop","program":"0","login_caption":"Your Points"}},"launcher":{"color":"#FFFFFF","bcolor":"#6777EF","layout":"1","icon":"1","icon_img":"","text":"Rewards"}},"space":0,"test":1,"createtime":"2021-01-28 11:59:17","plan":3}`);
//判断权限
var ymq_plan_array = JSON.parse(`{"1":["expiry","email-count","ymq-branding"],"2":["expiry-point","banner-images","lan","icon","email"],"3":["free-product","commission","vip"]}`);
function ymq_plan(plan = 0, service = '')
{
    var hasPlan = false;
    if (ymq_plan_array.hasOwnProperty(plan)){
        for(var key in ymq_plan_array){
            if (plan >= key) {
                if (ymq_plan_array[key].indexOf(service) != -1) {
                    hasPlan = true;
                    break;
                }
            }
        }
    }
    return hasPlan;
}
//判断权限
