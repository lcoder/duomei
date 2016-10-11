/*
** CMS 帮助页面
** update:2013.3.13
*/
$(function(){

	$('#h_box').next('.common_question').hide();

	$("#h_box h3").each(function(){
		$(this).click(function(){	
		if($(this).hasClass("h3_all")){
			 $(this).removeClass("h3_all");
			 $(this).next('ul').hide();
			}
		else{
			$("#h_box").find('h3').removeClass("h3_all");
			$("#h_box").find('ul').hide();
			$(this).addClass("h3_all");
			$(this).next('ul').show();
			}
		});
	});

	$("#choice_yes_btn").click(function(){
			update_helpful(1);
	});

	$("#choice_no_btn").click(function(){
			update_helpful(0);
	});

	var $c_ul = $("#choice ul"),
		$c_y = $("#choice_yes");

	function update_helpful(val){
		var params = {
				'help_fankui_value' : val,
				'page_id' : $("#help_fankui_page_id").val()
		};

		$.ajax({
			url: '/cms/setIfHelpful',
			type: 'post',
			data: params,
			success: function(data){
				$c_ul.hide();
				$c_y.show();
			},
			error: function(xhr){
				NALA.dialog.warn('服务器忙，请稍后再试。('+xhr.status+')');
			}
		});
	}
	
});