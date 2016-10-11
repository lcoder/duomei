/* 商品分类页
 * update 2013.8.22
*/
var NALA = NALA || {};
NALA.cate={
	init:function(){
        this.cate_step();
        this.goodsCount();
        this.scrollGoods();
        this.toggleHeight();
        this.priceForm();
		this.fixedWant();

        // 下一页
        (function() {
            var $nextpage = $('#nextpage'),
                $search_btn = $('#search_btn').find('a'),
                $page = $('#pagenav'),
                $page_next = $page.find('a.nextLink'),
                $page_prev = $page.find('a.prevLink'),
                _link = '',
                _link1 = '';

            if ($nextpage.length > 0) {
                _link = $page_next.attr('href');
                $nextpage.attr('href', _link);
            }
            if ($search_btn.length > 0) {
                _link = $page_next.length > 0 ? $page_next.attr('href')  : '##';
                _link1 = $page_prev.length > 0 ? $page_prev.attr('href') : '##';
                $search_btn.eq(0).attr('href', _link1);
                $search_btn.eq(1).attr('href', _link);
            }
        })();
	},

    cate_step: function(){
        var $box = $('.cate-step'),
            i = 0;
        if($box.length == 0){
            return;
        }

        if($box.find('a.current').length == 0){
            return;
        }

        i = $box.find('a.current').index()+1;
        if($box.hasClass('hufu-step')){
            $box.attr('id','current-hstep'+i);
        }else{
            $box.attr('id','current-cstep'+i);
        }
    },

    // 新品速递
	scrollGoods: function(){
        var $list = $('#new-goods'),
            $li = $list.find('li');

        $list.switchable({
            triggers: false,
            panels: $li,
            effect: 'scrollLeft',
            interval: 5,
            autoplay: true,
            end2end: true,
            prev: $list.find('a.prev'),
            next: $list.find('a.next')
        });
    },

    // 商品数量计算sec_count
    goodsCount: function(){
        var _total = 0;
        $('#cate-menu').find('dd').each(function(){
            var txt = $(this).find('i').text(),
                num = parseInt(txt.substring(1,txt.length-1));
            _total += num;
        });
        $("#total_count").html('商品共'+_total+'件');
    },

	// 筛选模块，高度限制
	toggleHeight: function() {
        var $search_options = $('#search-options'),
        $items = $search_options.find('.items');
        $items.each(function() {
            var $this = $(this),
            _myHeight = $this.height();
            if(_myHeight>30){
                $this.parent().height(48);
            }

            if(_myHeight>54){
                $this.next('a.more-btn').show().on('click',function() {
                    var _this = $(this);
                    if(_this.hasClass('clicked')){
                        $this.parent().height(48);
                        _this.text('更多').removeClass('clicked');
                    }else{
                        $this.parent().height(_myHeight);
                        _this.text('收起').addClass('clicked');
                    }
                });
            }
        });
    },

    // 价格区间筛选
    priceForm:function() {
        var $box = $('#priceform'),
        $form = $box.find('form'),
        $input = $form.find('input[type=text]'),
        $hp = $("#hidden_price");

        $input.on('focus',function() {
            $box.addClass('focus');
        });

        $(document).on("click",function(e){
            if($(e.target).parents("#priceform").length==0){
                $box.removeClass('focus');
            }
        });

       //  $form.submit(function() {
       //      var v1 = $input.eq(0).val(),
       //      v2 = $input.eq(1).val();
       //      if(v1 == '' || v2 == '' || !NALA.check.isNum(v1) || !NALA.check.isNum(v2)){
       //          alert('请输入正确的价格区间');
       //          return false;
       //      }
       //      $hp.val(v1+"~"+v2);
       // });
    },

    // 悬浮导航
    fixedWant: function(){
        var $box = $('#fixed-want');
        NALA.common.fixed($box);
    }
};

$(function(){
	NALA.cate.init();
});