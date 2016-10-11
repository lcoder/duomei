$(function(){
	var $oldpsw = $('#oldpassword'),
		$newpsw = $('#newpassword'),
		$newpsw2 = $('#newpassword2');

	$('#change_pswform input:password').blur(function(){
		$(this).next('span').hide();
	});
	
	$('#change_pswform_button').click(function(){
		var oldpsw = $.trim($oldpsw.val());
		var newpsw = $.trim($newpsw.val());
		var newpsw2 = $.trim($newpsw2.val());

		if(oldpsw == '' || newpsw == '' || newpsw2 == ''){
			NALA.dialog.warn('密码信息不能为空！');
			return false;
		}

		if(newpsw != newpsw2){
			NALA.dialog.warn('新密码两次输入不一致！');
			return false;
		}
		$.ajax({
			url:'/user/editPwds',
			type:'post',
			data:{'pwd':oldpsw},
			success:function(data){
				if(data == 2){
					$oldpsw.focus().next('span').show(); 
				}else{
					$.ajax({
						url:"/user/updatePwd",
						data:{'oldpwd':oldpsw,'newpwd':newpsw},
						success:function(data) {
							if(data == 1){
								NALA.dialog.success('密码修改成功,请记住您的新密码!');
								setTimeout(function(){
									location.reload();
								}, 3000);
							}
						}
					});
				}
			}
		});
		return false;
	});
});