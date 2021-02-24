$(document).ready(function () {
    require([
        'echarts'
        // 'echarts/component/legend',
        // 'echarts/component/grid',
        // 'echarts/component/tooltip',
        // 'echarts/component/dataZoomInside'
    ], function (echarts) {
        var array = [];
        var res = [];
        array.push(analysis_order_data,analysis_new_members_data,analysis_point_data,analysis_point_used_data,analysis_commission_data,analysis_commission_used_data);
        array.forEach(function (value,key) {
            if(value.length == 7){
                var itemData = {};
                itemData['dom'] = echarts.init(document.getElementById(`canvas${key}`), null, {
                    // renderer: 'svg'
                });
                var data = [];
                value.forEach(function (item) {
                    data.push(Math.log10(item+11));
                });
                itemData['option'] = {
                    xAxis: {
                        type: 'category',
                        show: false
                    },
                    yAxis: {
                        type: 'value',
                        show: false
                    },
                    grid: {
                        //data先用log算法，接近化处理，让再用此属性美化显示效果
                        bottom:'100%'
                    },
                    series: [{
                        data: data,
                        type: 'line',
                        symbol: 'none',   //这个配置
                        symbolSize: 2,
                        itemStyle : {
                            normal : {
                                lineStyle:{
                                    color:'rgb(0, 161, 159)'
                                }
                            }
                        },

                        areaStyle: {
                            color:'rgb(0, 161, 159)',
                            opacity: 0.3,
                            origin:"start"
                        }
                    }]
                };
                res.push(itemData);
            }
        });
        res.forEach(function (value,key) {
            var chart = value['dom'];
            chart.setOption(
                value['option']
            );
        });
        // var zhuChart = echarts.init(document.getElementById('test'), null, {
        //     renderer: 'svg'
        // });
        // zhuChart.setOption(
        //     {
        //         xAxis: {
        //             type: 'category',
        //             data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        //         },
        //         yAxis: {
        //             type: 'value'
        //         },
        //         series: [{
        //             data: [120, 200, 150, 80, 70, 1110, 130,120, 200, 150, 80, 70, 1110, 130],
        //             type: 'bar',
        //             showBackground: false,
        //             itemStyle:{
        //                 normal:{
        //                     color:'rgb(0, 161, 159)'
        //                 }
        //             }
        //         }],
        //         dataZoom: [{
        //             fillerColor:"#B2E3E2",  //选中范围的填充颜色。
        //             backgroundColor:"rgb(0, 161, 159)",
        //             borderColor:"#fff",
        //             type: 'slider',
        //             show: true, //flase直接隐藏图形
        //             xAxisIndex: [0],
        //             bottom: 10,
        //             start: 0,//滚动条的起始位置
        //             end: 50 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
        //         }]
        //     }
        // );
    });
    $('.date-select').ymqDropdown({
        date: true,
        item:[
            {
                text: 'Today',
                value: '1'
            },
            {
                text: 'Yesterday',
                value: '2'
            },
            {
                text: 'This week',
                value: '3'
            },
            {
                text: 'This month',
                value: '4'
            },
        ]
    });
    $('.type-select').ymqDropdown({
        item:[
            {
                text: 'Get Point',
                value: '1'
            },
            {
                text: 'Used Point',
                value: '2'
            },
            {
                text: 'Get Commission',
                value: '3'
            },
            {
                text: 'Used Commission',
                value: '4'
            },
        ]
    });

    $(document).on('change', '.commission-withdrawal', function () {
        var status = $(this).val();
        var that = $(this);
        that.parent().parent().addClass('btn-progress-cc').addClass('btn-progress')
        $.ymqajax({
            url : "/api/commissionsapi/updatestatus",
            ymqtype: 'modal',
            data:{id:$(this).data('id'),status:status,last_status:$(this).data('last_status')},
            success : function(res) {
                that.data('last_status',status)
                that.parent().parent().removeClass('btn-progress-cc').removeClass('btn-progress')
                iziToast.show({
                  message: "Status Updated",
                  position: 'bottomCenter'
                });
            }
        });
    });
    $(document).on('click', '.copy_paypal_email', function () {
        var text = $(this).data('text');
        $(this).prev('input').val(text);
        $(this).prev('input').select();
        console.log($(this).prev('input').val())
        document.execCommand("Copy");
    });
    
});