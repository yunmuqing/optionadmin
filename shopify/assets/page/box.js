$(document).ready(function () {
    $("#box-cart .close").on('click',function () {
        var data = {
            auth: 'ymq',
            action: 'down-button-box',
            data:{}
        }
        window.parent.postMessage(data, "*");
    });

    $("#box-cart #ymq-sign").on('click',function () {
        var data = {
            auth: 'ymq',
            action: 'ymq-sign',
            data:{}
        }
        window.parent.postMessage(data, "*");
    });

    $("#box-cart #ymq-point").on('click',function () {
        var data = {
            auth: 'ymq',
            action: 'ymq-point',
            data:{}
        }
        window.parent.postMessage(data, "*");
    });

    $("#box-cart #ymq-commission").on('click',function () {
        var data = {
            auth: 'ymq',
            action: 'ymq-commission',
            data:{}
        }
        window.parent.postMessage(data, "*");
    });

})

