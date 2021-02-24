
$(document).ready(function() {
    $('#example').DataTable( {
        "processing": true,
        "serverSide": true,
        "ajax": "https://shopify.luckydn.top/index/index/fff"
    } );
} );