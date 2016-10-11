/* 商品详情页
 * update 2013.8.28
*/
var NALA = NALA || {};

NALA.detail = {

    init: function(){
        var that = this;
        that.getGoodsInfo();
        that.goodsPicSlide();
        that.skuEvent();
    },

    // 获取商品价格，活动，规格等信息
    getGoodsInfo: function(){
        var that = this;
        $.ajax({
            url: '/promotion/ajaxPromotion',
            //url: 'ajaxPromotion.html',
            type: 'post',
            cache: false,
            data: NALA.goodsInfo,
            dataType: 'html',
            success: function(data){
                var $infobox = $("#item-info").find('dl').addClass('loaded'),
                    $np = null,
                    nala_p = 0,
                    jifen = '';

                $infobox.append(data);
                $np = $infobox.find("strong.nala_price");
                nala_p = parseFloat($.trim($np.text()));
                if(NALA.goodsInfo.jifen){
                    jifen = '+<strong>' + parseInt($np.next('strong').text()) + '</strong>积分';
                }

                if($('#quehuo-notice').length>0){
                    $("#tab-buy").html('￥<strong>'+nala_p.toFixed(2)+'</strong>'+jifen+'<a class="graybtn" href="javascript:;">暂时缺货</a>');

                }else{
                    $("#tab-buy").html('￥<strong>'+nala_p.toFixed(2)+'</strong>'+jifen+'<a class="btn" href="javascript:;">购 买</a>');
                    that.skuEvent();

                }


                // 点击评论数文字滚动到下部评论列表
                $('#pjxqitem_trig').click(function(){
                    $('#tabs_bar').find('li').eq(1).trigger('click');
                    return false; 
                });
            },
            error: function(){

            }
        });
    },



    // 商品轮播图
    goodsPicSlide: function(){
        var $view = $("#pic-view"),
            $thumb = $("#item-thumbs"),
            $clone = $thumb.find('img').eq(0).clone(),
            $len = $thumb.find('li').length,
            _left = 66,
            show = null;
            $clone.insertAfter($view);
            $thumb.append('<div class="arrow"><i class="icon iconfont">&#x194;</i></div>');
        var $arrow = $thumb.find('div.arrow');
            $arrow.css({'left':_left}).show();
        if($len < 5){
            var l = 5 - $len;
                _left += l*33;
            $arrow.css({'left':_left}).show(); 
            $thumb.find('ul').css({'width':66*$len});   
        }
        $thumb.on('mouseenter','li',function(){
            var _li = $(this);
            if(_li.hasClass('current')){
                return false;
            }
            show = setTimeout(function(){
                var _i = _li.index(),
                _img = _li.find('img'),
                _ssrc = _img.attr('src');
                _bsrc = _img.data('view');

                $arrow.css({'left':_i*66+_left});
                _li.addClass('current').siblings('li').removeClass('current');
                $clone.attr('src',_ssrc);
                $view.attr('src',_bsrc);
            }, 200);
        }).on('mouseleave','li',function(){
            if(show != null){
                clearTimeout(show);
            }
        });
    },
    // 商品属性、规格、数量等事件
    skuEvent: function(){
        var $sku_box = $("#sku_box"),
        $sku_a = $sku_box.find(".sku_list").find("a"),
        $skuid = $("#skuid"),
        $count_box = $("#skunum"),
        $input = $count_box.find('input'),
        $limit = $('#storage');

        // 选择属性
        $sku_a.each(function(){
            var $this = $(this);
            $this.click(function(){
                if(!$this.hasClass("selected")){
                    $this.addClass("selected").siblings().removeClass("selected");
                    $skuid.val($this.data("skuid"));
                    if($limit.data('limit') == undefined){
                        $limit.text($this.data("storage"));
                    }
                }
                return false;
            });
        });

        // 数量加减事件
        $count_box.on('click','span',function (e) {
            if($(this).hasClass("add")){
                countNum(1);
            }else{
                countNum(-1);
            }
            return false;
        });

        function countNum(i) {
            var num = $input.val(),
            max = parseInt($limit.text());

            if(max>99){
                max=99;
            }else if(max < 1){
                return;
            }

            if(!NALA.check.isNum(num)){
                $input.val('1');
                return;
            }

            num = parseInt(num)+i;
            switch (true) {
                case num == 0:
                    $input.val('1');
                    NALA.dialog.warn('您至少得购买1件商品！');
                    break;
                case num > max:
                    $input.val(max);
                    NALA.dialog.warn('您最多只能购买'+max+'件商品。');
                    break;
                default:
                    $input.val(num);
                    break;
            }
        }
    }
};

$(function(){

    NALA.detail.init();

    // 品牌 品类 功效 切换模块
    var $swbox = $('#switchable_class');
    $swbox.find('.switchable_content').switchable({
        triggers: $swbox.find('.switchable_nav').find('li'),
        panels: 'ul',
        initIndex: 1
    });

    //购物零顾虑
    var $intro = $('#intro-pic');
    $intro.find('a').each(function(i) {
        var _this = $(this);
        (function(n){
            _this.on('mouseenter',function() {
                if(_this.hasClass('on'+n)){
                    return false;
                }
                _this.addClass('on'+n);
                _this.siblings().removeClass();
                $intro.find('.pic').hide().eq(n).show();
                NALA.common.lazyload();
            });
        })(i);
    });

});