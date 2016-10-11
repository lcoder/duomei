$(function(){

var _tradeId = $('#trade-id').val();

$('.pay-btn').click(function() {
  $('#trade-form').submit();
});

// 取消订单
$('#trade-cancel').click(function() {
  var html = '<b>您确定要取消订单吗？</b><p style="padding-top:5px; font-size:12px;"><input type="checkbox" checked="checked" id="readdtocart" value="1" />&nbsp;将订单中的商品重新加入购物车。</p>';
  var callback = function() {
      var go = '';
      if($('#readdtocart').is(':checked')){
        go = '1';
      }
      location.href = "/trade/cancel?id="+_tradeId+"&isbackToCart=" + go;
  };
  NALA.dialog.confirm(html, callback);
});

});


function confirmTake(id){
  var html = '<b>您真的收到货品了么？</b><p style="padding:5px 0 0 33px; font-size:12px;">若收到请点击确定，未收到请点击取消。</p>';
  var callback = function() {
      $.post("/trade/confirmTake/"+id,function(data){
           location.reload();
      });
  };
  NALA.dialog.confirm(html, callback);
}