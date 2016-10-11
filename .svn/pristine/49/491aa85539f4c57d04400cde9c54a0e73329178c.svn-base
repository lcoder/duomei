/* 
** 【我的NALA】订单页面
*/
var NALA = NALA || {};
NALA.trade={
    $list: null,
	init:function(){
        this.$list = $('#trade-list');
		this.delTrade();
        this.cancelTrade();
        this.exLoad();
        this.shouhuo();
	},

    shouhuo: function(){
        var $list = this.$list,
            $btn = $list.find('a.shou-btn');
        $btn.on('click', function(){
            var id = $(this).data('id');
            var callback = function(){
                window.location.href = "/trade/confirmTake/"+id;
            }
            NALA.dialog.confirm('<b>您确定收到货了么？</b><p style="padding:2px 0 0 32px; color:#999;">如收到请点击确定，如未收到请点击取消。</p>', callback);
            return false;
        });
    },

    // 删除订单
	delTrade:function(){
		var $list = this.$list,
            $del = $list.find('a.del-trade'),
            $recy = $('#trade-recyle'),
            _top = $recy.offset().top;

        $del.on('click', function(){
            var _this = $(this),
                _tid = $(this).data('id');
            var callback = function() {
                $.ajax({
                    url: '/trade/delTrade',
                    // url: 'json2.html',
                    type: 'post',
                    dataType: 'json',
                    data: {'id':_tid},
                    success: function(data){
                        if(data.status == 1){
                            var $tbody = _this.parents('tbody'),
                                _offset = $tbody.offset(),
                                $table = $('<div class="fly-trade" style="top:'+_offset.top+'px; left:'+_offset.left+'px;"><table class="trade_tb01"></table></div>').appendTo('body');
                            _this.parents('tbody').appendTo($table.find('table'));
                            $table.delay(100).animate({'width':0,'height':0,'opacity':50,'top':_top,'left':_offset.left+930},400,function(){
                                $table.remove();
                                warn_bgcolor($recy.parent('a'));
                            });
                        }else{
                            NALA.dialog.warn('订单删除失败，请稍后再试。');
                        }
                    },
                    error: function(xhr){
                        NALA.dialog.warn('服务器忙，请稍后再试。('+xhr.status+')');
                    }
                });
            };
            NALA.dialog.confirm('<b>你确定要删除此订单吗？</b><p style="padding:2px 0 0 32px; color:#999;">被删除的订单可在订单回收站中查看。</p>', callback);
        });

        // 警示背景
        function warn_bgcolor($elem, callback){
            var _num = 1;
            var _itval = setInterval(function(){
                if(_num%2){
                    $elem.addClass('warn-color');
                }else{
                    $elem.removeClass('warn-color');
                }
                _num ++;
                if(_num == 5){
                    clearInterval(_itval);
                    callback && callback();
                }
            }, 150);
        }
		
	},

    // 取消订单
	cancelTrade: function(){
        var $list = this.$list,
            $cancel = $list.find('a.cancel-trade');

        $cancel.each(function(){
            var _this = $(this),
                _time = parseInt(_this.data("time")/1000),
                $time = null,
                setTime = null;
            _this.after('<div class="cancel-tip"><i>&diams;</i><i class="btm">&diams;</i><p><em class="red"></em>后系统自动取消订单</p></div>');

            if(_time < 0){
                _this.parents('tbody').find('em.em01').html('已过期');
                _this.parents('td').html('<span class="gray">订单已过期</span>');
                return;
            }

            $time = _this.next('.cancel-tip').find('em');
            setTime = setInterval(function(){
                var TIME,
                    daystr = '';
                if(_time < 1){
                    clearInterval(setTime);
                    _this.parents('tbody').find('em.em01').html('已取消');
                    _this.parents('td').html('<span class="gray">订单已自动取消</span>');
                }else{
                    _time --;
                    TIME = NALA.common.timeJson(_time);
                    if(TIME.days > 0){
                        daystr = TIME.days+'</em>天<em>';
                    }
                    $time.html(daystr+TIME.hours+'</em>时<em>'+TIME.mins+'</em>分<em>'+TIME.secs+'</em>秒');
                }
            }, 1000);
            setTimeout(function(){
                _this.next('.cancel-tip').show();
            }, 1000);
        });

		$list.on('click', 'a.cancel-trade', function() {
			var _this = $(this),
				_tradeId = _this.data('id'),
				html = '<b>你确定要取消此订单吗？</b><p style="padding-top:5px;"><input type="checkbox" checked="checked" id="readdtocart" value="1" />&nbsp;将订单中的商品重新加入购物车。</p>';
			var callback = function() {
				var go = '';
				if($('#readdtocart').is(':checked')){
					go = '1';
				}
				$.ajax({
					url: '/trade/ajaxCancel',
					// url: 'json2.html',
					type: 'post',
					dataType: 'json',
					data: {'id':_tradeId,'isbackToCart':go},
					success: function(data){
						if(data.status == 1){
							var $td = _this.parents('td');
                            _this.next('.cancel-tip').remove();
							$td.find('a.btn').remove();
							_this.parents('tbody').find('em.em01').html('已取消');
							_this.remove();
						}else{
							NALA.dialog.warn('取消订单失败，请稍后再试。');
						}
					},
					error: function(xhr){
						NALA.dialog.warn('服务器忙，请稍后再试。('+xhr.status+')');
					}
				});
			};
			NALA.dialog.confirm(html, callback);
		});	
	},

	// 跟踪快递
	exLoad:function(){
        var express = {
            sto: 'http://www.sto.cn/',
            yunda: 'http://www.yundaex.com/',
            tt: 'http://www.ttkdex.com/',
            ems: 'http://www.ems.com.cn/'
        };

		this.$list.on('click','a.J_exBtn',function(){
			var _this = $(this),
                _id = _this.data("id"),
                _name = _this.data('name'),
                _num = _this.data('num');

            $.dialog({
                id: 'kuaidi',
                title: '快递跟踪',
                lock: true,
                content: '<div class="kuaidi_tit">订单号：<em>'+_id+'</em>快递：<em>'+_name+'</em>运单号：<em>'+_num+'</em></div><p style="text-align:center; padding:20px;"><img src="http://img.nala.com.cn/images/loading_nala.gif" alt="" /><br><br>正在加载物流信息，请稍后</p>',
                init: function(){
                    var that = this;
                    $.ajax({
                        url: '/trade/ajaxTrackPack',
                        // url: 'ajaxTrackPack.html',
                        type: 'post',
                        dataType: 'html',
                        data: {'tradeId':_id},
                        success: function(data){
                            var _url = '#',
                                _html = '<div class="kuaidi_tit">订单号：<em>'+_id+'</em>快递：<em>'+_name+'</em>运单号：<em>'+_num+'</em></div>';

                            switch (_name) {
                                case '申通':
                                    _url = express.sto;
                                    break;
                                case '韵达':
                                    _url = express.yunda;
                                    break;
                                case '天天':
                                    _url = express.tt;
                                    break;
                                case 'EMS':
                                case 'EMS经济快递':
                                    _url = express.ems;
                                    break;
                                default:
                                    break;
                            }
                            if(data.indexOf('无包裹追踪信息') > -1){
                                _html = _html + '<div><br>暂无快递跟踪信息。<br><br><p>您可以去&nbsp;<a style="color:#09f;" target="_blank" href="'+_url+'">'+_name+'快递官网</a>&nbsp;，查询最新信息。</p></div>';
                            }else{
                                _html = _html + data;
                            }
                            setTimeout(function(){
                                that.content(_html);
                            }, 500);
                            
                        },
                        error: function(xhr){
                            NALA.dialog.warn('服务器忙，请稍后再试。('+xhr.status+')');
                        }
                    });
                    
                }
            });
		});	
	}
};
$(function(){
	NALA.trade.init();
});

function getSelect(){
    document.form1.submit();
}
function getSelect1(){
    document.form3.submit();
}