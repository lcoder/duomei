/**
 * 首页js文件
 * @authors supmain (mtingfeng@gmail.com)
 * @date    2014-09-08 17:12:27
 * @version $Id$
 */
var DUOMEI = DUOMEI || {};
DUOMEI.homepage = {
	init:function() {
		var that = this;
		/*banner切换、首页轮播图*/
		that.swichable();
	},
	swichable:function(){
        var $slide = $("#index-slide"),
            $li = $slide.find('li');

        if($li.length==1){
            $slide.find('.trigger-box').hide();
        }

        slideShow(0);
        $slide.switchable({
            triggers: $slide.find('.trigger-box'),
            panels: 'li',
            effect: 'fade',
            interval: 5,
            autoplay: true,
            beforeSwitch: function(e, i){
                slideShow(i);
            }
        });
        function slideShow(index){
            var _li = $li.eq(index),
                _img = _li.data('img');
            if(_img != 'none' && _img != undefined){
                _li.css('background-image','url('+_img+')').data('img','none');
            }
        }
    }
};
$(function(){
	DUOMEI.homepage.init();
});

