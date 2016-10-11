/*
*【b2c】全局JS处理文件
* update by: pannysp@2013-02-21 16:00
*/

//jQuery.easing动画效果插件
jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d);},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b;},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b;},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b;},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}}});

var NALA = NALA || {};
NALA.userInfo = {
    login: 0
};

(function($){
NALA.check = {
    //IE6判定
    isIE6: window.VBArray && !window.XMLHttpRequest,
    //判断是否为中英文，数字，下划线，减号
    isNick: function(str) {
        var nickReg = /^[\u4e00-\u9fa5A-Za-z0-9-_]+$/;
        return nickReg.test(str);
    },
    //判断邮箱
    isEmail: function(str) {
        var emailReg = /^[a-z0-9][\w\.]*@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,5}$/i;
        return emailReg.test(str);
    },
    //判断手机
    isMobile: function(str) {
        var mobileReg = /^1[345678][0-9]{9}$/;
        return mobileReg.test(str);
    },
    // 判断固话
    isTelephone: function(str) {
        var phoneReg = /^0\d{2,3}-\d{5,9}$/;
        return phoneReg.test(str);
    },
    //判断URL
    isUrl: function(str) {
        var urlReg = /^http:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?$/;
        return urlReg.test(str);
    },
    //判断数字
    isNum: function(str) {
        var numReg = /^[0-9]\d*$/;
        return numReg.test(str);
    }
},

//全局弹窗
NALA.dialog = {
    close: function (id) {
        var i,list = $.dialog.list;
        if(id){
            list[id].close();
        }else{
            for (i in list) {
                list[i].close();
            }
        }
    },
    creat: function (options) {
        var dialog = null;
        options = $.extend({
            fixed:true,
            title:false,
            lock:true,
            padding:'20px 40px',
            id: '',
            content: ''
        },options);
        dialog=$.dialog(options);
        return dialog;
    },
    success: function (html,time) {
        var dialog = null;
        time = time || 2;
        this.close();
        html = '<div class="success-tip"><i class="iconfont">&#126;</i>'+html+'</div>'
        dialog = this.creat({id:'success',content:html,lock:false});
        setTimeout(function(){
            var $dg = $(dialog.DOM.wrap);
            $dg.animate({'top':'-=50px','opacity':0},300,'easeInBack',function(){
                dialog.close();
            });
        }, time*1000);
    },
    warn: function (html,callback){
        var dialog = null;
        html = '<div class="warn-tip"><i class="iconfont">&#227;</i>'+html+'</div>';
        dialog = this.creat({id:'warn',content:html});
        dialog.button({
            name: '知道了',
            focus: true,
            callback: callback
        });
    },
    ok: function (html,callback){
        var dialog = null;
        html = '<div class="ok-tip"><i class="iconfont">&#379;</i>'+html+'</div>';
        dialog = this.creat({id:'ok',content:html});
        dialog.button({
            name: '知道了',
            focus: true,
            callback: callback
        });
    },
    confirm: function (html,callback) {
        var dialog = null;
        html = '<div class="confirm-tip"><i class="iconfont">&#228;</i>'+html+'</div>';
        dialog = this.creat({id:'confirm',content:html});
        dialog.button({
            name: '确定',
            focus: true,
            callback: callback
        },{
            name: '取消'
        });
    },

    showLogin:function(reurl){
        var _login_box = null,
            reurl = reurl || location.href,
        html = '<div class="dialog_login_box"><div id="login-box">'
                +'<h2><div class="trig">没有帐号？<a href="/user/reg" target="_blank" class="trigger-box">点击注册</a></div>登录</h2>'
                +'<div class="form-bd"><div class="form_box cle" id="login-nala">'
                +'<div class="login_box"><form id="login-nala-form"><ul class="form">'
                +'<li class="text_input"><span class="error_icon"></span><span class="iconfont">&#338;</span><input type="text" name="j_username" class="text" placeholder="用户名/邮箱/手机号"></li>'
                +'<li class="text_input"><span class="error_icon"></span><span class="iconfont">&#247;</span><input type="password" name="j_password" class="text" placeholder="密码"></li>'
                +'<li class="error_box"><em></em></li>'
                +'<li class="login_param"><p><a class="forget_psd" target="_blank" href="/user/resetPwd">忘记密码?</a><label><input type="checkbox" checked="checked" name="_spring_security_remember_me" class="remember-me">下次自动登录</label></p></li>'
                +'<li class="last"><input type="submit" class="btn" value="登 录" /></li>'
                +'</ul></form></div>'
                +'</div></div>'
                +'<ul class="form other-form">'
                +'<li><h5>使用第三方帐号登录</h5></li>'
                +'<li class="other-login">'
                +'<a class="sina" target="_blank" href="https://api.weibo.com/oauth2/authorize?client_id=1062800511&response_type=code&redirect_uri=http://www.lizi.com/user/sinaLogin"></a>'
                +'<a class="qq" target="_blank" href="https://graph.qq.com/oauth2.0/authorize?response_type=code&amp;client_id=100224827&amp;state=1&amp;redirect_uri=www.lizi.com/user/qqLoginCallback"></a>'
                +'<a class="alipay" target="_blank" href="http://www.lizi.com/user/alipayLogin"></a>'
                +'<a class="taobao" target="_blank" id="tb-login" href="http://www.lizi.com/user/taobaoLogin"></a>'
                +'<a class="baidu" target="_blank" href="http://www.lizi.com/user/baiduLogin?login=baidu"></a>'
                +'<a class="qihoo360" target="_blank" href="https://openapi.360.cn/oauth2/authorize?client_id=6550d4a07c17ee81e0737a4203d5848c&response_type=code&redirect_uri=http://www.lizi.com/user/qihooCallBack&scope=basic&display=default"></a>'
                +'</li></ul></div></div>';

        if(NALA.isPhone){
            location.href='/login/auth';
            return;
        }

        _login_box = $.dialog({
            title: '您尚未登录',
            lock: true,
            fixed: true,
            padding:"0",
            id: "login",
            content:html,
            init: function() {

                var $form = $('#login-nala-form'),
                    $name = $form.find('input[name=j_username]'),
                    $pwd = $form.find('input[name=j_password]'),
                    $submit = $form.find('input[type=submit]'),
                    $msg = $form.find('li.error_box em'),
                    $input = $form.find('li.text_input');

                    $form.find("input").focus(function() {
                        $input.removeClass("params_error");
                    });

                $form.submit(function(){
                    var _name = $.trim($name.val()),
                        _pwd = $.trim($pwd.val()),
                        text, params;

                    if($submit.hasClass('disabled')){
                        return false;
                    }

                    if(_name == '' || _pwd == ''){
                        text = (_name == '') ? '请输入用户名':'请输入密码';
                        $msg.text(text).show().delay(2000).fadeOut();
                        return false;
                    }

                    $submit.addClass('disabled').val('登录中');
                    params = {
                        'j_username': _name,
                        'j_password': _pwd,
                        '_spring_security_remember_me':'on'
                    };

                    $.ajax({
                        url: "/j_spring_security_check",
                        type: 'post',
                        data: params,
                        dataType: 'json',
                        success: function(data){
                            if(data.status == 1){
                                location.href=reurl;
                            }else if(data.status == 0){
                                $submit.removeClass('disabled').val('登 录');
                                $msg.text('您输入的密码和用户名不匹配').show().delay(2000).fadeOut();
                                $input.addClass('params_error');
                            }
                        },
                        error: function(xhr){
                            if(xhr.status == 200){
                                location.reload();
                            }else{
                                $submit.removeClass('disabled').val('登 录');
                                NALA.dialog.warn("服务器忙，请稍后再试。("+xhr.status+")");
                            }
                        }
                    });
                    return false;
                });

                // 联合登录先推送下当前URL
                $.ajax({
                    url: '/user/ajaxUnionLoginFilter'
                });
            }
        });

        //淘宝登陆故障
        var text = '<div style="width:360px; text-indent: 2em; font-size: 14px; margin-bottom: 10px;">因淘宝联合登录故障，新用户请选择其他方式登录，老会员请联系客服取回您的淘宝联合登录账号。对您造成的不便，丽子表示抱歉。</div><p style="text-align: center;"><a href="http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA0MjIzN181OTY5N184MDAwNDIyMzdfMl8" class="graybtn" target="_blank"><i class="iconfont" style="color:#f70; font-size:14px;">&#54;</i> 点此咨询客服</a></p>';
        $('#tb-login').on('click', function(){
            NALA.dialog.creat({id:'tblogin-error','title':'登录故障', content:text});
            return false;
        });
    }
},

NALA.common = {

    userNav: function(){
        var $bar = $('#userinfo-bar').find('.hd_lbar');

        $.ajax({
            url: '/user/loginAuth3',
            // url: '/b2c/2013/loginAuth3.html',
            cache: false,
            dataType:'json',
            success: function(result){
                NALA.userInfo = result;
                if(result.login){
                    bindUserNav();
                }else{
                    $bar.show();
                }
            },
            error: function(){
                $bar.show();
            }
        });

        function bindUserNav(){
            var $nav = null,
                _time = null,
                level = '',
                _tmpName = '',
                _data = NALA.userInfo,
                _left = 0;
                
            if(_data.level==1){
                level = 'vip-ico';
            }else if(_data.level==2){
                level = 'svip-ico';
            }
            _tmpName = _data.name;

            var $tmpName = $('<span>'+_tmpName+'</span>').appendTo('body');
           
            if($tmpName.width()>148){
                _tmpName = '<span class="ellips">'+_tmpName+'</span>...';
            }else{
                _tmpName = '<span>'+_tmpName+'</span>';
            }
            $tmpName.remove();

            $bar.html('<a href="http://www.lizi.com/" rel="nofollow">丽子首页</a><a href="/user/myTrade" class="usernav-link" rel="nofollow"><img src="http://img.nala.com.cn/images/kong.gif" class="'+level+'" />'+_tmpName+'<i class="iconfont arrow">&#8193;</i></a>').show();

            _left = $bar.find('a.usernav-link').offset().left;

            $nav = $('<div class="usernav-bd" style="left:'+_left+'px;"><a href="/integral/showMine">我的积分：'+_data.jifen+'</a><a href="/account/mine">我的余额：￥'+(_data.money/100).toFixed(2)+'</a><a href="/user/myTrade">我的订单</a><a href="/coupon/queryMyCoupon">我的优惠券（'+_data.coupon+'）</a><a href="/logout/ssoLogout" class="last">退出</a></div>').appendTo('body');

            $bar.on('mouseenter','a.usernav-link',function() {
                clearTimeout(_time);
                $(this).addClass('hover');
                $nav.addClass('usernav-show');
            }).on('mouseleave','a.usernav-link',function() {
                var _this = $(this);
                _time = setTimeout(function(){
                    $nav.removeClass('usernav-show');
                    _this.removeClass('hover');
                }, 300);
            });

            $nav.on('mouseenter',function() {
                if(_time !== null){
                    clearTimeout(_time);
                }
            }).on('mouseleave',function() {
                _time = setTimeout(function(){
                    $nav.removeClass('usernav-show');
                    $bar.find('a.usernav-link').removeClass('hover');
                }, 300);
            });
        }
    },

    //延迟加载图片
    lazyload: function($elem) {
        if($elem.length == 0){
            return false;
        }
        var $win = $(window),
        winheight = $win.height(),
        $images = $elem.find("img"),

        pageTop = function() {
            return winheight + $win.scrollTop() + 50;
        },

        imgLoad = function() {
            $images.each(function () {
                var _this = $(this);
                if (_this.offset().top <= pageTop()) {
                    var trueSrc = _this.attr("original");
                    if (trueSrc) {
                        _this.hide().attr("src", trueSrc).removeAttr("original").fadeIn();
                    }
                }
            });
        };

        imgLoad();
        $win.on("scroll", function () {
            imgLoad();
        });
    },

    //操作cookie
    cookie : function(name, value, options) {
        if (typeof value != 'undefined') {
            // 有value值, 设置cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    //options.expires以小时为单位
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 60 * 60 * 1000)); 
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            var path = options.path ? '; path=' + options.path : '; path=/';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else { 
            // 只有name值, 获取cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    }

}

})(jQuery);

$(function(){
    NALA.common.userNav();
});