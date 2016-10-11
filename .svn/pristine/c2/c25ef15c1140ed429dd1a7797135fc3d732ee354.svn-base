// for checkout.html
//模拟select
;(function($){
	var _zIndex = 200;
	$.fn.mySelect = function(zIndex){
		_zIndex = zIndex || _zIndex - 5;
		if(_zIndex==0){
			window.location.reload();
		}
		return this.each(function () {
			var oldSelect = $(this),
			select_width = oldSelect.width()+25,
			select_id = "myselect_"+_zIndex,
			select_text = oldSelect.find("option:selected").text(),
			select_list ='';
			oldSelect.hide();

			select_list = '<div id="'+select_id+'" class="select_div" style="width:'+select_width+'px; z-index:'+_zIndex+'"><div class="select_title" style="width:'+(select_width-37)+'px">'+select_text+'</div><div class="select_list" style="width:'+(select_width-2)+'px">';		
			oldSelect.find("option").each(function(i){
				if(i===0){
					select_list +='<a class="s0" href="javascript:;" hidefocus="true" data-val="'+$(this).val()+'">'+$(this).text()+'</a>';
				}else{
					select_list +='<a href="javascript:;" hidefocus="true" data-val="'+$(this).val()+'">'+$(this).text()+'</a>';
				}
			});
			select_list+="</div></div>";
			oldSelect.next('div.select_div').remove(); //先移除页面上已有的select
			oldSelect.after(select_list);
			bindEvent(select_id);

			//绑定事件
			function bindEvent(id){
				var $newSelect = $("#"+id), showme = null,
					$newSelectTitle = $newSelect.find(".select_title"),
					$newSelectList = $newSelect.find(".select_list");

				$newSelectTitle.on("click",function(){			
					$newSelectList.show();
				});
				$newSelect.on("mouseleave",function(){
					showme = setTimeout(function(){$newSelectList.hide();},400);
					return false;
				});
				$newSelect.on("mouseenter",function(){
					if(showme !== null){
						clearTimeout(showme);
					}
					return false;
				});
				$newSelectList.on("click",'a',function(){
					var n_text = $(this).text(), 
					n_val = $(this).data("val");
					$newSelectTitle.text(n_text);
					$newSelectList.hide();	
					oldSelect.val(n_val).trigger('change');
					return false;
				});
				if($newSelectList.find("a").length>10){
					$newSelectList.css({"overflow-y":"auto","height":"246px"});
				}
			}
		});
		
	};	
})(jQuery);