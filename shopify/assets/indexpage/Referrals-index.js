$(document).ready(function () {

    $('.commissions_val').bind('input propertychange', function(){
        $('.rate_commissions').text($(this).val())
    })
    $('.points_val').bind('input propertychange', function(){
        $('.rate_points').text($(this).val())
    })
    
    $(".commission_save").click(function(){
        var that = $(this)
        that.addClass('btn-progress');
        if ($('.commissions_val').val()<0) {
            iziToast.show({
                message: 'The commission must be greater than 0',
                position: 'bottomCenter' 
            });
            that.removeClass('btn-progress');
            return;
        }
        $.ymqajax({
            url: " /api/branding/setting",
            data: {you_get_commissions:$(".commissions_val").val()},
            success: function (res) {
                iziToast.show({
                    message: res.msg,
                    position: 'bottomCenter' 
                });
                that.removeClass('btn-progress');
            }
        });
    })

    $(".crowd_save").click(function(){
        var that = $(this)
        that.addClass('btn-progress');
        $.ymqajax({
            url: " /api/branding/setting",
            data: {branding_father:"referrals",crowd:$("input[name='crowd']:checked").val()},
            success: function (res) {
                iziToast.show({
                    message: res.msg,
                    position: 'bottomCenter' 
                });
                that.removeClass('btn-progress');
            }
        });
    })

    $(".point_save").click(function(){
        var that = $(this)
        that.addClass('btn-progress');
        if ($('.points_val').val()<0) {
            iziToast.show({
                message: 'The points must be greater than 0',
                position: 'bottomCenter' 
            });
            that.removeClass('btn-progress');
            return;
        }
        $.ymqajax({
            url: " /api/branding/setting",
            data: {you_get_points:$(".points_val").val()},
            success: function (res) {
                iziToast.show({
                    message: res.msg,
                    position: 'bottomCenter' 
                });
                that.removeClass('btn-progress');
            }
        });
    })
    $(".ferral_reward_tab").click(function(){
        var thattab = $(this);
        var thatcheckBox = $(this).prev("input");
        thattab.addClass('btn-progress');
        if (thatcheckBox.attr("disabled") == "disabled") {
            return false;
        }
        if (thattab.data("status") == 1) {
            var poststatus = 0;
        }else if(thattab.data("status") == 0){
            var poststatus = 1;
        }else{
            var poststatus = 1;
        }
        thatcheckBox.attr("disabled",true);
        $.ajax({
            type : "POST",
            dataType: "json",
            url : "/api/referralreward/updatestatus",
            data : {"id":thattab.data("id"),"status":poststatus},
            //请求成功
            success : function(result) {
                if (result.code == 1) {
                    iziToast.show({
                        message: result.msg,
                        position: 'bottomCenter' 
                    });
                    thattab.data('status',poststatus)
                    if (poststatus == 1) {
                        thatcheckBox.attr("checked",true);
                    }else{
                        thatcheckBox.removeAttr("checked")
                    }
                }else if(result.code == 0){
                    iziToast.show({
                        message: result.msg,
                        position: 'bottomCenter' 
                    });
                }
                thatcheckBox.attr("disabled",false)
                thattab.removeClass('btn-progress');
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                thatcheckBox.attr("disabled",false)
                thattab.removeClass('btn-progress');
            }
        });
    })
    
    
});

