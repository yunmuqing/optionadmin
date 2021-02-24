$(document).ready(function () {
    $(".top-close").on('click',function () {
        var data = {
            auth: 'ymq',
            action: 'down-commission-box',
            data:{}
        }
        window.parent.postMessage(data, "*");
    });





})







