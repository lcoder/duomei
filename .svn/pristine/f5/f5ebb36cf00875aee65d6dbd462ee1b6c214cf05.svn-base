/**
 *  会员注册 js
 **/
var NALA = NALA || {};

NALA.register = {

    $register_box : $("#register_box"),

    flag : {a : false ,b : false, c : false},  //a 用户名/手机   b密码 确认密码  c验证码

    ip_times : 0,

    init: function(){
        var that = this;
            that.showCkimg();
            that.initRegister();
            that.checkInfo();
            that.checkYzm();  
            that.submitReg();             
    },

    initRegister:function(){
        var that = this;
            //显示字    
            that.$register_box.on('click','span.t_text',function(){
                $(this).css("display","none")
                .parent().find("input").focus();
            }).on('focus','input',function(){
                $(this).parent().find("span.t_text").css("display","none")
                .end().removeClass('params_error params_success')
                .end().parent().next(".error_box").find("em").html('').hide();
            }).on('blur','input',function(){
                if($(this).val() == ''){
                    $(this).parent().find(".t_text").show();
                }
            })  
    },

    //检测信息
    checkInfo : function(){
        var that = this , msg, type_name,$sendtype = $("#sendtype"),_params = {};

            that.$register_box.on('blur','input',function(){
                var _this = $(this),
                    type = _this.attr("name"),
                    val = _this.val();
                    msg = '', type_name = '';
                    if(val == ''){return ;}    
                    if(type == 'register_name') {
                        if (NALA.check.isEmail(val) || NALA.check.isMobile(val)) {
                            that.flag.c = false ;
                            if (NALA.check.isEmail(val)) {
                                type_name = 'email';
                                that.$register_box.find("input[name='yzm']").parent().find("span.t_text").html("验证码");
                            }
                            if (NALA.check.isMobile(val)) {
                                type_name = 'mobile';
                                that.$register_box.find("input[name='yzm']").parent().find("span.t_text").html("手机验证码");
                            }

                            _this.parent().find('span.error_icon').addClass('loading_icon');

                            _params = {
                                'type' : type_name,
                                'value' : val 
                            }
                            $.ajax({
                                url: '/user/check_ifexists',
                                //url: 'check.html',
                                type: 'post',
                                dataType: 'json',
                                data: _params,
                                success: function(data) {
                                    _this.parent().find('span.error_icon').removeClass('loading_icon');
                                    that.ip_times = data.ip_times;
                                    if (data.status == 0) {
                                        that.flag.a = false;
                                        if (type_name == "email") {
                                            msg = "该邮箱已被注册，<a href='/login/auth' style='color:#39f;text-decoration: underline;'>去登录</a>？";
                                        } else {
                                            msg = "该手机号码已被注册，<a href='/login/auth' style='color:#39f;text-decoration: underline;'>去登录</a>？";
                                        }
                                        _this.parent().addClass('params_error').removeClass('params_success');
                                    } else if (data.status == 1) {
                                        that.flag.a = true;
                                        msg = '';
                                        _this.parent().addClass('params_success').removeClass('params_error');

                                    } else {
                                        msg = '';
                                        NALA.dialog.warn('服务器忙，请稍后再试。');
                                    }

                                    _this.parent().next().find("em").html(msg).show();
                                },
                                error: function(xhr) {
                                    NALA.dialog.warn('服务器忙，请稍后再试。(' + xhr.status + ')');
                                }
                            });
                            $sendtype.val(type_name);
                            that.showSendMobile(type_name);
                        } else {
                            that.flag.a = false ;
                            msg = "手机号/邮箱格式不正确";
                            _this.parent().addClass('params_error').removeClass('params_success');
                        }

                    } else if (type == 'psw') {
                            if (val.length < 6 || val.length > 20) {
                                msg = "请输入6-20个字符的新密码";
                                _this.parent().addClass('params_error').removeClass('params_success');
                            }else{
                                 msg = '';
                                 _this.parent().addClass('params_success').removeClass('params_error');
                            }

                    }else if(type == 'confirm_psw'){
                        var _pwd = that.$register_box.find("input[name='psw']").val(),
                            _pwd2 = that.$register_box.find("input[name='confirm_psw']").val();
                            if (val.length < 6 || val.length > 20) {
                                msg = "请输入6-20个字符的新密码";
                                _this.parent().addClass('params_error').removeClass('params_success');
                            }else if(_pwd != _pwd2){
                                that.flag.b = false ;
                                msg = "两次密码输入不一致！";
                                _this.parent().addClass('params_error').removeClass('params_success');
                            }else{
                                that.flag.b = true ;
                                 msg = '';
                                 _this.parent().addClass('params_success').removeClass('params_error');
                            }
                    };
                    _this.parent().next().find("em").html(msg).show();
                }) 
    },
    //显示 发送手机验证码
    showSendMobile : function(type){
        var that  = this,
            $yzmimg = $("#yzm"),
            $changeyzm = $("#change"),
            $send_security_code = $("#send_security_code");

            if(type == 'mobile'){
                $yzmimg.hide();
                $changeyzm.hide();
                $send_security_code.show();
                that.sendMobileyzm();
            }else{
                $yzmimg.show();
                $changeyzm.show();
                $send_security_code.hide();
            }
    },

    //发送手机验证码

    sendMobileyzm : function(){
        var that = this , params = {}, callback ,
            $yzm = that.$register_box.find("input[name='yzm']"),
            _validate = $("#validate").val();
            $yzm.parent().removeClass("params_error params_success");
            that.$register_box.on('click','.graybtn',function(){
                // 发送验证码
                var _this = $(this),
                    _mobile = that.$register_box.find("input[name='register_name']").val();

                if(_this.hasClass('disabled')){
                    return false;
                };

                params = {
                    'mobile': _mobile,
                    'validate': _validate
                };

                if(that.ip_times <= 0){
                    callback = function(_code){
                        params['code'] = _code;
                        sendMobilereg(params);
                    }
                    NALA.showCkimg(callback);
                }else{
                    sendMobilereg(params);
                }
                function sendMobilereg(params){
                    $.ajax({
                        url: '/user/ajax_firstSave',
                        //url : 'check1.html',
                        type: 'post',
                        dataType: 'json',
                        data:params,
                        success: function(data) {
                            if(data.ip_times <= 0 && data.status != 4){
                                NALA.dialog.close('checkImage');
                            }
                            if (data.status == 1) {

                                that.ip_times = data.ip_times;

                                var con = '手机验证码短信已发送，请注意查收,您的手机号码今日还有<em style="color:#fe564b;">' + data.phone_times + '</em>次发送机会';

                                if(data.phone_times > 1){
                                   var con = '手机验证码短信已发送，请注意查收';
                                }

                                NALA.dialog.ok(con,
                                 function() {
                                    _this.addClass('disabled').text('再次发送验证码(60)');
                                    var i = 60;
                                    var _time = setInterval(function() {
                                        if (i == 0) {
                                            clearInterval(_time);
                                            _this.removeClass('disabled').text('发送验证码');
                                        } else {
                                            i--;
                                            _this.text('再次发送验证码(' + i + ')');
                                        }
                                    }, 1000);
                                })
                            } else if (data.status == 2) {
                                NALA.dialog.warn('非法操作！');
                            } else if (data.status == 3) {
                                NALA.dialog.warn('该手机号码已被注册，请直接<a href="/login/auth" style="color:#39f;text-decoration: underline;">登录</a>！');
                            } else if (data.status == 4) {
                                NALA.dialog.warn('验证码有误');
                            } else if (data.status == 5) {
                                if (data.phone_times <= 0) {
                                    NALA.dialog.warn('该号码今天发送验证码的次数已用完&nbsp;<a target="_blank" style="color: #39f;text-decoration: underline;" href="http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA0MjIzN181OTY5N184MDAwNDIyMzdfMl8">联系客服</a>&nbsp;吧');
                                }
                            } else if(data.status == 6){
                                NALA.dialog.warn('页面超时，请刷新！');
                            } else if (data.status == 0) {
                                NALA.dialog.warn('发送手机验证码失败，请稍后再试。.....');
                            } else {
                                NALA.dialog.warn('服务器忙，请稍后再试。');
                            }
                        },
                        error: function(xhr) {
                            NALA.dialog.warn('服务器忙，请稍后再试。(' + xhr.status + ')');
                        }
                    });
                }
            })

    },

    //即时验证验证码
    checkYzm : function(){
        var that = this ,
            $yzm = that.$register_box.find("input[name='yzm']");
            $yzm.on('keyup blur',function() {
                var _this = $(this), code = $yzm.val(),$sendtype = $("#sendtype").val(),msg = '';
                    if($sendtype == 'mobile'){
                        that.flag.c = false ;
                        if(code.length < 6 || !NALA.check.isNum(code)){
                            $yzm.parent().removeClass("params_error params_success");
                            return false;
                        };
                        _this.parent().find('span.error_icon').addClass('loading_icon');
                        $.ajax({
                            url: '/user/ajax_secondSave',
                            // url: 'json.html',
                            type:'post',
                            dataType:'json',
                            data:{'code':code},
                            success: function(result){
                                _this.parent().find('span.error_icon').removeClass('loading_icon');
                                if(result.status == 1){
                                    that.flag.c = true ;
                                    msg = "";
                                    $yzm.parent().addClass("params_success").removeClass("params_error");
                                }else{
                                    that.flag.c = false ;
                                    msg = "验证码有误";
                                    $yzm.parent().addClass('params_error').removeClass('params_success');
                                }
                                $yzm.parent().next().find("em").html(msg).show();
                            },
                            error: function(xhr){
                                NALA.dialog.warn("服务器忙，请稍后再试。("+xhr.status+")");
                            }
                        });
                    }else{
                        if(code.length < 4){
                            $yzm.parent().removeClass("params_error params_success");
                            return false;
                        };
                        _this.parent().find('span.error_icon').addClass('loading_icon');
                        $.ajax({
                            url: '/user/ajax_safecode',
                            //url : 'yzm.html',
                            type: 'post',
                            dataType:'json',
                            data:{'code':code},
                            success: function(data){
                                _this.parent().find('span.error_icon').removeClass('loading_icon');
                                if(data.status == 1){
                                    that.flag.c = true ;
                                    msg = "";
                                    $yzm.parent().addClass("params_success").removeClass("params_error");
                                }else{
                                    that.flag.c = false ;
                                    msg = "验证码有误";
                                    $yzm.parent().addClass("params_error").removeClass("params_success");  
                                }
                                $yzm.parent().next().find("em").html(msg).show();
                            },
                            error: function(xhr){
                                NALA.dialog.warn('服务器忙，请稍后再试。('+xhr.status+')');
                            }
                        });
                    };

            });
    },

    //提交
    submitReg : function(){
        var that = this,
            $submit_btn = that.$register_box.find("a.submit_btn"),
            $accept_lizi_law = that.$register_box.find("input[name='accept_lizi_law']");
            $submit_btn.on('click',function(){
                var _this = $(this) ,$sendtype = $("#sendtype").val(), _params = {};
                    user_name = that.$register_box.find("input[name='register_name']"),
                    pwd = that.$register_box.find("input[name='psw']"),
                    pwd2 = that.$register_box.find("input[name='confirm_psw']"),
                    code = that.$register_box.find("input[name='yzm']"),
                    _user_name = user_name.val(),
                    _pwd = pwd.val(),
                    _pwd2 = pwd2.val(),
                    _code = code.val();

                if(_user_name == ''){
                    user_name.parent().addClass('params_error').next().find('em').html('用户名不能为空').show();
                }

                if(_pwd == ''){
                    pwd.parent().addClass('params_error').next().find('em').html('密码不能为空').show();
                }

                if(_pwd2 == ''){
                    pwd2.parent().addClass('params_error').next().find('em').html('确认密码不能为空').show();
                }

                if(_code == ''){
                    code.parent().addClass('params_error').next().find('em').html('验证码不能为空').show();
                }    

                if(!that.flag.a || !that.flag.b || !that.flag.c){ 
                    return false;
                }

                if(!$accept_lizi_law.prop("checked")){
                    $(this).parent().prev().find("em").html("请同意用户注册协议").show().delay(2000).fadeOut();
                    return false;
                }

                if(_this.find('img').length>0){
                     return false;
                }

                _this.html('<img src="http://img.nala.com.cn/images/loading.gif" /> 提交中');

                if($sendtype == 'email'){
                    var  _email = _user_name,    
                        _params = {
                            'email': _email,
                            'password': _pwd,
                            'password_': _pwd2,
                            'code': _code
                        };
                        send_emailreg(_params);
                }else{
                    var _mobile = _user_name;
                        _params = {
                            'password': _pwd,
                            'password_': _pwd2
                        };
                        send_mobile(_params)
                };

                function send_emailreg(params){
                    $.ajax({
                        url:"/user/ajax_save",
                        // url:"json.html",
                        type:'post',
                        data:params,
                        dataType:'json',
                        success: function(data){
                            that.showCkimg();
                            _this.html('同意协议并注册');
                            if(data.status == 1){
                                submit_DSP(_email,'email');
                                NALA.dialog.success('恭喜您，注册成功！')
                                setTimeout(function(){   
                                    location.href = '/user/success';
                                }, 2300);
                            }else if(data.status == 4){
                                NALA.dialog.warn('验证码有误');
                            }else if(data.status == 2){
                                NALA.dialog.warn('该邮箱已被注册，请直接<a href="/login/auth" style="color:#39f;">登录</a>！');
                            }else if(data.status == 3){
                                NALA.dialog.warn('该邮箱暂不支持注册，请换个邮箱！');
                            }else{
                                NALA.dialog.warn('服务器忙，请稍后再试.');
                            }
                        },
                        error: function(xhr){
                            that.showCkimg();
                            _this.html('同意协议并注册');
                            NALA.dialog.warn("服务器忙，请稍后再试。("+xhr.status+")");
                        }
                    });
                };

                function send_mobile(params){
                    $.ajax({
                        url:"/user/ajax_finalSave",
                        type:'post',
                        data:params,
                        dataType:'json',
                        success: function(data){
                            if(data.status == 1){
                                submit_DSP(_mobile,'mobile');
                                NALA.dialog.success('恭喜您，注册成功！')
                                setTimeout(function(){
                                    location.href = '/user/success';
                                }, 2300);
                            }else{
                                _this.html('同意协议并注册');
                                NALA.dialog.warn('注册失败，请稍后再试！');
                            }
                        },
                        error: function(xhr){
                            NALA.dialog.warn("服务器忙，请稍后再试。("+xhr.status+")");
                        }
                    });
                };

            })
    },

    //显示验证码
    showCkimg : function(){
        var that = this ,
            $yzm = $("#yzm");
            $yzm.attr('src','/user/productCheckImage?t='+Math.random());
            $yzm.parent().removeClass("params_error params_success")
                .find("input[name='yzm']").val('').end()
                .find("span.t_text").show();
                that.flag.c = false;
            $("#yzm,#change").click(function(){
                $yzm.attr('src','/user/productCheckImage?t='+Math.random());
                $(this).parent().removeClass("params_error params_success")
                .find("input[name='yzm']").val('').end()
                .find("span.t_text").html("验证码").show();
                that.flag.c = false;
            });
    }
};

NALA.showCkimg = function(cb){
    $.dialog({
        id: 'checkImage',
        title: '验证码',
        lock: true,
        content: '<div class="checkImage" id="regcheckImage"><div class="img"><img src="http://img.nala.com.cn/images/kong.gif" class="change" />看不清，<a href="javascript:;" class="change">换一张</a></div><p>请输入上图中的字母或数字</p><input type="text" /><a href="javascript:;" class="btn">确 定</a></div>',
        init: function(){
            var $ckImg = $('#regcheckImage'),
                $img = $ckImg.find('img')[0],
                $input = $ckImg.find('input');
                $img.src = 'http://www.lizi.com/user/productCheckImage?t='+Math.random();
            $ckImg.on('click','.change', function(){
                $img.src = 'http://www.lizi.com/user/productCheckImage?t='+Math.random();
                return false;
            }).on('click','a.btn',function(){
                var _code = $.trim($input.val());
                if(_code == ''){
                    NALA.dialog.warn('请输入图片中的字母或数字。');
                    return false;
                }
                if(_code.length != 4){
                    NALA.dialog.warn('请正确输入图片中的验证码！');
                    return false;
                }
                cb(_code);
            });

            $input.keyup(function(event){
                if(event.keyCode == 13){
                    $input.next('a').trigger("click");
                }
            });
        }
    });
}

$(function(){
    // 注册模块初始化
    NALA.register.init();

    // 在线咨询弹窗
    var $zixunBox = $('#zixun-box');
    $('#zixun-btn').click(function(){
        $zixunBox.show();
    });

    $zixunBox.on('click','a.closed',function(){
       $zixunBox.hide(); 
    });

}) 
// dsp统计提交
function submit_DSP(name,type){
    var temp = _adwq || [];
    temp.push(['_setAction','1qw3uf',name,type]);
}