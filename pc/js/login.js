/**
 *  会员登陆 js
 **/
var NALA = NALA || {};

NALA.login = {

    init: function(){
        var that = this;
        that.loginLast();
        that.loginNala();
    },

    // 上次登录方式
    loginLast: function(){
        var that = this,
        $box = $('#login-last');
        $box.on('click','a.trg',function(){
            $('#login-nala').animate({'left':-320},300,'easeOutExpo');
            return false;
        });
    },

    // 登录验证
    loginNala: function(){
        var $form = $('#login-nala-form'),
        $name = $form.find('input[name=username]'),
        $pwd = $form.find('input[name=password]'),
        $submit = $form.find('input[type=submit]'),
        $remember_me = $form.find('input[name=_spring_security_remember_me]'),
        $msg = $form.find('li.error_box em'),
        $input = $form.find('li.text_input');

        $form.find("input").focus(function() {
            $input.removeClass("params_error");
        });

        $form.submit(function(){
            var _name = _pwd = _remb = text = '',
                params = null;

            if($submit.hasClass('disabled')){
                return false;
            }

            _name = $.trim($name.val());
            _pwd = $.trim($pwd.val());

            if(_name == '' || _pwd == ''){
                text = (_name == '') ? '请输入用户名':'请输入密码';
                $msg.text(text).show().delay(2000).fadeOut();
                return false;
            }

            $submit.addClass('disabled').val('登录中');

            // if($remember_me.is(":checked")){
            //     _remb = 'on';
            // }

            params = {
                'j_username': _name,
                'j_password': _pwd,
                '_spring_security_remember_me': 'on'
            };

            $.ajax({
                url:"/j_spring_security_check",
                type:'post',
                data:params,
                dataType:'json',
                success: function(data){
                    if(data.status == 1){
                        location.href = data.url;
                    }else if(data.status == 0){
                        $submit.removeClass('disabled').val('登 录');
                        $msg.text('您输入的密码和用户名不匹配').show().delay(2000).fadeOut();
                        $input.addClass('params_error');
                    }
                },
                error: function(xhr){
                    if(xhr.status == 200){
                        location.href = '/inala';
                    }else{
                        $submit.removeClass('disabled').val('登 录');
                        NALA.dialog.warn('服务器忙，请稍后再试。('+xhr.status+')');
                    }
                }
            });
            return false;
        });
    }
};

$(function(){
	// 登录模块事件初始化
    NALA.login.init();
	// 在线咨询弹窗
    var $zixunBox = $('#zixun-box');
    $('#zixun-btn').click(function(){
        $zixunBox.show();
    });

    $zixunBox.on('click','a.closed',function(){
       $zixunBox.hide(); 
    });
    //淘宝登陆故障
    var text = '<div style="width:360px; text-indent: 2em; font-size: 14px; margin-bottom: 10px;">因淘宝联合登录故障，新用户请选择其他方式登录，老会员请联系客服取回您的淘宝联合登录账号。对您造成的不便，丽子表示抱歉。</div><p style="text-align: center;"><a href="http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA0MjIzN181OTY5N184MDAwNDIyMzdfMl8" class="graybtn" target="_blank"><i class="iconfont" style="color:#f70; font-size:14px;">&#54;</i> 点此咨询客服</a></p>';
    $('.other-form').on('click', 'a.tb-link', function(){
        NALA.dialog.creat({id:'tblogin-error','title':'登录故障', content:text});
        return false;
    });
})