$(document).ready(function () {

    $('#test').ymqTable({
        thead: ['Type','Customers','Commissions','Reward','Due Date','Status'],
        url: '/api/check.html',
        inputKey: 'id',
        scroll: {
            dom: $('.main-right'),
            mistake: 0
        },
        tbody: [
            {
                makeHtml: function (data) {
                    return data['type'] == 1 ? 'Money' : 'Gift Card';
                }
            },
            {
                makeHtml: function (data) {
                    var html = '';
                    html += `
                           <a href="mailto:${data['customer']['email']}">${data['customer']['email']}</a>
                    `;
                    html += `
                           <br/>
                           <a href="/index/customers/info/id/${data['custome_id']}.html">
                            ${data['customer']['firstName']} ${data['customer']['lastName']}
                           </a>
                    `;
                    return html;
                }
            },
            {
                makeHtml: function (data) {
                    return data['commissions'];
                }
            },
            {
                makeHtml: function (data) {
                    var html = `Amount: ${data['get']}<br/>`;
                    if (data['type'] == 1){
                        html += data['paypal_email'];
                    }else{
                        html += data['code'];
                    }
                    return html;
                }
            },
            {
                makeHtml: function (data) {
                    return $.setDate(data['createtime']);
                }
            },
            {
                makeHtml: function (data) {
                    switch(data['status']) {
                        case 0:
                            return '<svg class="icon" style="width: 30px; height: 30px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9573"><path d="M265.472 176.128m14.464 0l280.32 0q14.464 0 14.464 14.464l0 0q0 14.464-14.464 14.464l-280.32 0q-14.464 0-14.464-14.464l0 0q0-14.464 14.464-14.464Z" fill="#ffa426" p-id="9574"></path><path d="M632.704 176.128m14.464 0l87.04 0q14.464 0 14.464 14.464l0 0q0 14.464-14.464 14.464l-87.04 0q-14.464 0-14.464-14.464l0 0q0-14.464 14.464-14.464Z" fill="#ffa426" p-id="9575"></path><path d="M729.6 784.896H304.128a14.592 14.592 0 0 1-14.464-14.464c0-111.616 95.488-207.616 162.048-260.864-66.56-53.376-162.048-149.376-162.048-260.992a14.592 14.592 0 0 1 14.464-14.464H729.6a14.464 14.464 0 0 1 14.464 14.464c0 111.616-95.488 207.616-161.92 260.992C648.32 563.2 743.808 658.816 743.808 770.432A14.464 14.464 0 0 1 729.6 784.896z m-409.6-28.928h394.24c-8.704-102.4-105.728-190.08-164.736-234.88a14.592 14.592 0 0 1 0-23.168c59.008-44.672 156.032-133.12 164.736-234.752H320c8.576 101.632 105.728 190.08 164.608 234.752a14.592 14.592 0 0 1 0 23.168c-59.52 44.8-156.672 133.12-164.608 234.88z" fill="#ffa426" p-id="9576"></path><path d="M265.472 813.952m14.464 0l473.6 0q14.464 0 14.464 14.464l0 0q0 14.464-14.464 14.464l-473.6 0q-14.464 0-14.464-14.464l0 0q0-14.464 14.464-14.464Z" fill="#ffa426" p-id="9577"></path><path d="M499.2 478.72l18.176 13.824 18.176-13.824a594.944 594.944 0 0 0 82.56-75.52H416a609.92 609.92 0 0 0 83.2 75.52zM534.912 540.288l-18.176-13.824L499.2 540.288c-40.704 30.976-128.64 105.984-150.656 192h337.024c-22.016-86.016-109.568-161.024-150.656-192z" fill="#ffa426" p-id="9578"></path><path d="M603.776 190.592m-14.464 0a14.464 14.464 0 1 0 28.928 0 14.464 14.464 0 1 0-28.928 0Z" fill="#ffa426" p-id="9579"></path></svg>';
                            break;
                        case 1:
                            return '<svg class="icon" style="width: 30px; height: 30px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2700"><path d="M171.904 364.416v295.168a109.056 109.056 0 0 0 54.528 94.464l256 147.584a109.056 109.056 0 0 0 109.056 0l256-147.584a109.056 109.056 0 0 0 54.528-94.464V364.416a109.056 109.056 0 0 0-54.528-94.464l-256-147.584a109.056 109.056 0 0 0-109.056 0l-256 147.584a109.056 109.056 0 0 0-54.528 94.464z" fill="#FFFFFF" p-id="2701"></path><path d="M536.448 935.296a128 128 0 0 1-64-17.152l-256-147.584a128 128 0 0 1-64-110.976V364.416a128 128 0 0 1 64-110.976l256-147.584a128 128 0 0 1 128 0l256 147.584a128 128 0 0 1 64 110.976v295.168a128 128 0 0 1-64 110.976l-256 147.584a128 128 0 0 1-64 17.152z m0-808.192a89.6 89.6 0 0 0-44.928 12.032l-256 147.584a89.6 89.6 0 0 0-44.928 77.824v295.04a89.6 89.6 0 0 0 44.928 77.824l256 147.584a89.6 89.6 0 0 0 89.6 0l256-147.584a89.6 89.6 0 0 0 44.928-77.824V364.416a89.6 89.6 0 0 0-44.928-77.824l-256-147.584a89.6 89.6 0 0 0-44.672-11.904z" fill="#47c363" p-id="2702"></path><path d="M377.984 524.16l110.464 110.464L713.216 409.6" fill="#FFFFFF" p-id="2703"></path><path d="M488.448 653.696a19.2 19.2 0 0 1-13.568-5.632L364.416 537.6a19.2 19.2 0 0 1 27.136-27.136l96.768 96.768 211.2-211.2a19.2 19.2 0 0 1 27.136 27.136L502.016 648.064a19.2 19.2 0 0 1-13.568 5.632z" fill="#47c363" p-id="2704"></path></svg>';
                            break;
                        case 2:
                            return '<svg class="icon" style="width: 30px; height: 30px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3271"><path d="M536.448 944.128a128 128 0 0 1-64-17.152l-256-147.584a128 128 0 0 1-64-111.104V373.248a128 128 0 0 1 64-110.976L472.32 115.2a128 128 0 0 1 128 0l256 147.584a128 128 0 0 1 64 110.976v294.656a128 128 0 0 1-64 111.104l-256 147.584a128 128 0 0 1-63.872 17.024z m0-808.192a89.6 89.6 0 0 0-44.928 12.032l-256 147.584a89.6 89.6 0 0 0-44.928 77.824v295.04a89.6 89.6 0 0 0 44.928 77.824l256 147.584a89.6 89.6 0 0 0 89.6 0l256-147.584a89.6 89.6 0 0 0 44.928-77.824V373.248a89.6 89.6 0 0 0-44.928-77.824l-256-147.584a89.6 89.6 0 0 0-44.672-11.904z" fill="#fc544b" p-id="3272"></path><path d="M881.92 668.416V373.248a89.6 89.6 0 0 0-44.928-77.824l-256-147.584a89.6 89.6 0 0 0-89.6 0l-256 147.584a89.6 89.6 0 0 0-44.928 77.824v295.168a89.6 89.6 0 0 0 44.928 77.824l256 147.584a89.6 89.6 0 0 0 89.6 0l256-147.584a89.6 89.6 0 0 0 44.928-77.824z" fill="#FFFFFF" p-id="3273"></path><path d="M563.2 520.832l91.264-91.264A19.2 19.2 0 0 0 627.2 402.432l-91.264 91.264-91.264-91.264a19.2 19.2 0 0 0-27.136 27.136l91.264 91.264-91.264 91.264a19.2 19.2 0 1 0 27.136 27.136l91.264-91.264L627.2 639.232a19.2 19.2 0 0 0 27.136-27.136z" fill="#fc544b" p-id="3274"></path></svg>';
                            break;
                    }
                }
            }
        ],
        tab: [
            {
                text: 'All',
                key: 'type',
                value: '',
                do: function (value) {

                }
            },
            {
                text: 'Money',
                key: 'type',
                value: '1',
            },
            {
                text: 'Gift Card',
                key: 'type',
                value: '2',
            },
        ],
        select: [
            {
                key: 'status',
                text: 'Status',
                checkbox: true,
                items: [
                    {
                        text: 'Pending',
                        key: 'status',
                        value: 0
                    },
                    {
                        text: 'Completed',
                        key: 'status',
                        value: 1
                    },
                    {
                        text: 'Rejected',
                        key: 'status',
                        value: 2
                    },
                ]
            },
            // {
            //     key: 'date',
            //     text: 'Date',
            //     date: true,
            //     radio: true,
            //     items: [
            //         {
            //             text: 'Today',
            //             key: 'date',
            //             value: 1
            //         },
            //         {
            //             text: 'Yesterday',
            //             key: 'date',
            //             value: 2
            //         },
            //         {
            //             text: 'This week',
            //             key: 'date',
            //             value: 3
            //         },
            //         {
            //             text: 'This month',
            //             key: 'date',
            //             value: 4
            //         }
            //     ]
            // },
            // {
            //     key: 'sort',
            //     text: 'Sort',
            //     radio: true,
            //     noAutoWidth: '150px',
            //     items: [
            //         {
            //             text: 'Date',
            //             key: 'sort',
            //             sort: 'asc',
            //             value: 'createtime_asc'
            //         },
            //         {
            //             text: 'Date',
            //             key: 'sort',
            //             sort: 'desc',
            //             value: 'createtime_desc'
            //         },
            //         {
            //             text: 'Commissions',
            //             key: 'sort',
            //             sort: 'asc',
            //             value: 'commissions_asc'
            //         },
            //         {
            //             text: 'Commissions',
            //             key: 'sort',
            //             sort: 'desc',
            //             value: 'commissions_desc'
            //         },
            //     ]
            // }
        ],
        action: [
            {
                text: 'Action',
                out: [
                    {
                        text: 'Approve',
                        key: 'action',
                        value: '',
                        do: function (options) {
                            console.log(options.inputValues);
                            var data = {
                                ids: options.inputValues.join(',')
                            };
                            $(this).fireModal({
                                title: `You have selected ${options.inputValues.length} data`,
                                body: `Whether to approve ${options.inputValues.length} commission exchange applications.`,
                                center: true,
                                initShow: true,
                                removeOnDismiss: true,
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        class: 'btn btn-secondary btn-shadow',
                                        handler: function(modal) {
                                            modal.modal('hide');
                                        }
                                    },
                                    {
                                        text: 'Leave page',
                                        class: 'btn btn-primary btn-shadow',
                                        handler: function(modal) {
                                            modal.find('.btn-primary').addClass('btn-progress').addClass('disabled');
                                            modal.on('hide.bs.modal', function(e){
                                                e.preventDefault();
                                                e.stopImmediatePropagation();
                                                return false;
                                            });
                                            $.ajax({
                                                url: '/api/check/approve',
                                                type: 'post',
                                                data: data,
                                                dataType: 'json',
                                                async: true,
                                                success: function (res) {
                                                    modal.unbind("hide.bs.modal");
                                                    modal.modal('hide');
                                                    options.doChange();
                                                },
                                                error: function(xhr, textStatus, errorThrown){
                                                    modal.unbind("hide.bs.modal");
                                                    modal.find('.btn-primary').removeClass('btn-progress').removeClass('disabled');
                                                }
                                            });
                                        }
                                    }
                                ]
                            });
                        }
                    }
                ],
                noAutoWidth: 'auto',
                in: [
                    {
                        text: 'Reject and refund low commission',
                        key: 'action',
                        value: '',
                        do: function (options) {
                            var data = {
                                ids: options.inputValues.join(',')
                            };
                            $(this).fireModal({
                                title: `You have selected ${options.inputValues.length} data`,
                                body: `Reject these ${options.inputValues.length} applications and refund the low commission.`,
                                center: true,
                                initShow: true,
                                removeOnDismiss: true,
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        class: 'btn btn-secondary btn-shadow',
                                        handler: function(modal) {
                                            modal.modal('hide');
                                        }
                                    },
                                    {
                                        text: 'Leave page',
                                        class: 'btn btn-primary btn-shadow',
                                        handler: function(modal) {
                                            modal.find('.btn-primary').addClass('btn-progress').addClass('disabled');
                                            modal.on('hide.bs.modal', function(e){
                                                e.preventDefault();
                                                e.stopImmediatePropagation();
                                                return false;
                                            });
                                            $.ajax({
                                                url: '/api/check/reject',
                                                type: 'post',
                                                data: data,
                                                dataType: 'json',
                                                async: true,
                                                success: function (res) {
                                                    modal.unbind("hide.bs.modal");
                                                    modal.modal('hide');
                                                    options.doChange();
                                                },
                                                error: function(xhr, textStatus, errorThrown){
                                                    modal.unbind("hide.bs.modal");
                                                    modal.find('.btn-primary').removeClass('btn-progress').removeClass('disabled');
                                                }
                                            });
                                        }
                                    }
                                ]
                            });
                        }
                    },
                    // {
                    //     text: 'Refuse to not refund low commission',
                    //     key: 'action',
                    //     value: '',
                    //     do: function (res) {
                    //         var data = {
                    //             ids: options.inputValues.join(',')
                    //         };
                    //         $(this).fireModal({
                    //             title: `You have selected ${options.inputValues.length} data`,
                    //             body: `Reject these ${options.inputValues.length} applications and do not refund the low commission.`,
                    //             center: true,
                    //             initShow: true,
                    //             removeOnDismiss: true,
                    //             buttons: [
                    //                 {
                    //                     text: 'Cancel',
                    //                     class: 'btn btn-secondary btn-shadow',
                    //                     handler: function(modal) {
                    //                         modal.modal('hide');
                    //                     }
                    //                 },
                    //                 {
                    //                     text: 'Leave page',
                    //                     class: 'btn btn-primary btn-shadow',
                    //                     handler: function(modal) {
                    //                         modal.find('.btn-primary').addClass('btn-progress').addClass('disabled');
                    //                         modal.on('hide.bs.modal', function(e){
                    //                             e.preventDefault();
                    //                             e.stopImmediatePropagation();
                    //                             return false;
                    //                         });
                    //                         $.ajax({
                    //                             url: '/api/check/reject',
                    //                             type: 'post',
                    //                             data: data,
                    //                             dataType: 'json',
                    //                             async: true,
                    //                             success: function (res) {
                    //                                 modal.unbind("hide.bs.modal");
                    //                                 modal.modal('hide');
                    //                                 options.doChange();
                    //                             },
                    //                             error: function(xhr, textStatus, errorThrown){
                    //                                 modal.unbind("hide.bs.modal");
                    //                                 modal.find('.btn-primary').removeClass('btn-progress').removeClass('disabled');
                    //                             }
                    //                         });
                    //                     }
                    //                 }
                    //             ]
                    //         });
                    //     }
                    // }
                ]
            }
        ]

    });


});