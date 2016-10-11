/*
*【b2c】全局JS处理文件
* update by: pannysp@2013-02-21 16:00
*/

//jQuery.easing动画效果插件
jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d);},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b;},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b;},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b;},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}}});

// 仿亚马逊菜单JQUERY插件
(function($){$.fn.menuAim=function(opts){this.each(function(){init.call(this,opts)});return this};function init(opts){var $menu=$(this),activeRow=null,mouseLocs=[],lastDelayLoc=null,timeoutId=null,options=$.extend({rowSelector:"> li",submenuSelector:"*",submenuDirection:"right",tolerance:75,enter:$.noop,exit:$.noop,activate:$.noop,deactivate:$.noop,exitMenu:$.noop},opts);var MOUSE_LOCS_TRACKED=3,DELAY=300;var mousemoveDocument=function(e){mouseLocs.push({x:e.pageX,y:e.pageY});if(mouseLocs.length>MOUSE_LOCS_TRACKED){mouseLocs.shift()}};var mouseleaveMenu=function(){if(timeoutId){clearTimeout(timeoutId)}if(options.exitMenu(this)){if(activeRow){options.deactivate(activeRow)}activeRow=null}};var mouseenterRow=function(){if(timeoutId){clearTimeout(timeoutId)}options.enter(this);possiblyActivate(this)},mouseleaveRow=function(){options.exit(this)};var clickRow=function(){activate(this)};var activate=function(row){if(row.className.toLowerCase()=="current"){return}if(activeRow){options.deactivate(activeRow)}options.activate(row);activeRow=row};var possiblyActivate=function(row){var delay=activationDelay();if(delay){timeoutId=setTimeout(function(){possiblyActivate(row)},delay)}else{activate(row)}};var activationDelay=function(){if(!activeRow||!$(activeRow).is(options.submenuSelector)){return 0}var offset=$menu.offset(),upperLeft={x:offset.left,y:offset.top-options.tolerance},upperRight={x:offset.left+$menu.outerWidth(),y:upperLeft.y},lowerLeft={x:offset.left,y:offset.top+$menu.outerHeight()+options.tolerance},lowerRight={x:offset.left+$menu.outerWidth(),y:lowerLeft.y},loc=mouseLocs[mouseLocs.length-1],prevLoc=mouseLocs[0];if(!loc){return 0}if(!prevLoc){prevLoc=loc}if(prevLoc.x<offset.left||prevLoc.x>lowerRight.x||prevLoc.y<offset.top||prevLoc.y>lowerRight.y){return 0}if(lastDelayLoc&&loc.x==lastDelayLoc.x&&loc.y==lastDelayLoc.y){return 0}function slope(a,b){return(b.y-a.y)/(b.x-a.x)}var decreasingCorner=upperRight,increasingCorner=lowerRight;if(options.submenuDirection=="left"){decreasingCorner=lowerLeft;increasingCorner=upperLeft}else{if(options.submenuDirection=="below"){decreasingCorner=lowerRight;increasingCorner=lowerLeft}else{if(options.submenuDirection=="above"){decreasingCorner=upperLeft;increasingCorner=upperRight}}}var decreasingSlope=slope(loc,decreasingCorner),increasingSlope=slope(loc,increasingCorner),prevDecreasingSlope=slope(prevLoc,decreasingCorner),prevIncreasingSlope=slope(prevLoc,increasingCorner);if(decreasingSlope<prevDecreasingSlope&&increasingSlope>prevIncreasingSlope){lastDelayLoc=loc;return DELAY}lastDelayLoc=null;return 0};$menu.mouseleave(mouseleaveMenu).find(options.rowSelector).mouseenter(mouseenterRow).mouseleave(mouseleaveRow).click(clickRow);$(document).mousemove(mousemoveDocument)}})(jQuery);

var $window = $(window);

var NALA = NALA || {};

(function($){
NALA.check = {
    isPhone: function(){
        var ua = navigator.userAgent.toLowerCase(),
            reg = /iPhone|iPad|Android|ucweb|windows\s+mobile|Windows\s+Phone/i;
            return reg.test(ua);
    },
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
};
if(NALA.check.isPhone()){
    $('html').addClass('isPhone');
    NALA.isPhone = true;
}else if($window.width() < 1400){
    $('html').addClass('is1280');
}

NALA.userInfo = {
    login: 0
};
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
};

NALA.common = {
    //ajax请求地址
    ajaxUrl:{
        search: '/item/search'
    },
    // 获取CMS源代码,首页二级导航
    cmsContentAjax: function(flag,callback){
        $.ajax({
            url: '/duomei/pc/ajaxCmsContent.html',
            cache: false,
            data: {'mark':flag},
            dataType: 'html',
            success: function(data){
                callback(data);
            }
        });
    },
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
    lazyload: function() {
        var winheight = $window.height(),
            $images = null,
            _timeout = null,
            length = 0;

        $images = $("img").filter(function(){
            return $(this).attr("original") !== undefined;
        });

        length = $images.length;

        if(length == 0){
            return;
        }

        function showImg() {
            $images.each(function () {
                var _this = $(this),
                    _top = 0,
                    _winStop = 0,
                    _src = _this.attr("original");
                if(_src === ''){
                    return;
                }

                _top = _this.offset().top;
                _winStop = $window.scrollTop();

                if(_top != _winStop && _top <= (winheight + _winStop + 50)){
                    _this.hide().attr('src',_src).fadeIn();
                    _this.attr("original","");
                    _this.error(function(){
                        this.src = 'http://img.nala.com.cn/images/kong.gif';
                        _this.addClass('img_error');
                    });
                    length --;
                }
            });
        }

        showImg();
        $window.on("scroll", function () {
            if(length > 0){
                if(_timeout !== null){
                    clearTimeout(_timeout);
                }
                _timeout = setTimeout(function(){
                    showImg();
                }, 50);
            }
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
    },
    //页头搜索框
    searchBar: function() {
        var that = this,
            $s_form = $("#search_fm"),
            $sInput = $s_form.find('input.sea_input'),
            cache = {}, t = null, li_Index=-1;
            _offset = null,
            $result = null;

        $s_form.submit(function(){
            if($.trim($sInput.val()) == '请输入商品或品牌' || $.trim($sInput.val()) == '' ){
                //location.href = "/item/search";
                return false;
            }
        });

        if(NALA.isPhone){
            return;
        }

        $result = $('<div class="search_result"></div>').appendTo('body');

        $sInput.attr('autocomplete','off').on('focus',function () {
            var key = $.trim($sInput.val());
            _offset = $sInput.offset();
            bind_clickEvent();
            if(key == ''){
                return false;
            }
            if(key == '请输入商品或品牌'){
                $sInput.val('');
            }else{
                if(cache[key] != undefined){
                    showResult(key);
                }else{
                    ajaxSearch(key);
                }
            }
            return false;
        }).on('keyup',function(e){
            if(e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 13){
                clearTimeout(t);
                t = setTimeout(function(){
                    var key = $.trim($sInput.val());
                    if(cache[key] != undefined){
                        showResult(key);
                    }else{
                        ajaxSearch(key);
                    }
                }, 300);
            }
        }).blur(function(){
            if($.trim($sInput.val()) == ''){
                $sInput.val('请输入商品或品牌');
            }
        }).on('keydown',function (e) {
            var li = $result.find("li"),
            _len=li.length,
            url='';
            if(_len>0){
                switch(e.keyCode) {
                    case 40:
                        //向下键选择
                        li_Index++;
                        if(li_Index>_len-1) {
                            li_Index=0;
                        }
                        li.removeClass("on").eq(li_Index).addClass("on");
                        $sInput.val(li.eq(li_Index).text());
                        break;
                    case 38:
                        //向上键选择   
                        li_Index--;
                        if(li_Index<0) {
                            li_Index=_len-1;
                        }
                        li.removeClass("on").eq(li_Index).addClass("on");
                        $sInput.val(li.eq(li_Index).text());
                        break;
                };
            }
        });

        function ajaxSearch(key) {
            $.ajax({
                url: that.ajaxUrl.search,
                data: {'q':key},
                success: function(result){
                    cache[key] = result;
                    showResult(key);
                }
            });
        }

        function showResult(key) {
            var html='<ul>',
            data = cache[key].split(',');
            if(data[0] !== ''){
                $.each(data,function (i,v) {
                    html += '<li>'+v+'</li>';
                });
                $result.html(html).css({'left':_offset.left,'top':_offset.top,'display':'block'});
                li_Index = -1;
            }else{
                $result.hide();
            }
        }

        function bind_clickEvent() {
            $(document).on("click",function(e){
                if(e.target.id != 'textfield'){
                    $result.hide();
                }
            });
            $result.on('mouseenter','li',function(){
                var _li = $(this);
                li_Index = _li.index();
                _li.addClass('on').siblings('li').removeClass('on');
                return false;
            }).on('click','li',function(){
                $sInput.val($(this).text());
                setTimeout(function(){
                    $s_form.submit();
                }, 300);
            });
        }
    },
    // 主导航栏滑动效果
    mainNav_animate: function(){
        var that = this,
            $mainCata = $("#J_mainCata"),
            $subCata = $("#J_subCata"),
            $mainNav = $("#main_nav"),
            _time = null,
            _hover = null,
            hasSubData = false,
            isHover = false,
            isIndex = false;



        if($('#mall-slide').length>0){
            isIndex = true;
        }

        $mainCata.find('ul').menuAim({
            activate: showSubcontent,
            exitMenu: function(){
                if(_hover !== null){
                    clearTimeout(_hover);
                }
            }
        });

        $mainNav.on("mouseenter",function(){
            var $this = $(this);
            if(_time !== null){
                clearTimeout(_time);
            }
            if(isIndex){
                return;
            }
            _time=setTimeout(function(){
                $this.addClass('main_nav_hover');
                $mainCata.stop().show().animate({'opacity':1,'height':450},300);
            }, 200);
        }).on("mouseleave",function(){
            if(_time !== null){
                clearTimeout(_time);
            }
            _time = setTimeout(function(){
                $subCata.css({'opacity':0,'left':'100px'}).find(".J_subView").hide();
                isHover = false;
                if(!isIndex){
                    $mainCata.stop().delay(200).animate({'opacity':0,'height':0},300, function(){
                        $mainNav.removeClass('main_nav_hover');
                        $mainCata.hide().find("li").removeClass("current");
                    });
                }else{
                    $mainCata.find("li").removeClass("current");
                }
            }, 200);
        });

        function showSubcontent(row){
            var $this = $(row),
                _index = $this.index();
            if(isHover){
                $this.addClass("current").siblings('li').removeClass("current");
                $subCata.find(".J_subView").hide().eq(_index).show();
            }else{
                if(_hover !== null){
                    clearTimeout(_hover);
                }
                _hover = setTimeout(function(){
                    $this.addClass("current").siblings('li').removeClass("current");
                    isHover = true;
                    if(hasSubData){
                        $subCata.css({'opacity':100,'left':'214px'}).find(".J_subView").eq(_index).show();
                    }else{
                        getSubData(_index);
                    }
                }, 200);
            }
        }

        function getSubData(_index){
            var callback = function(cateHtml){
                $subCata.html(cateHtml).css({'opacity':100,'left':'214px'}).find(".J_subView").eq(_index).show();
                hasSubData = true;
            }
            that.cmsContentAjax('lizi_catedata',callback);
        }
    },
    // 头部购物车事件
    head_cart_event: function(){
        var that = this,
            $cart = $('#head_cart'),
            $list = $cart.find('.list'),
            _time = null;

        $cart.on("mouseenter",function(){
            if(_time !== null){
                clearTimeout(_time);
            }
            _time=setTimeout(function(){
                $cart.addClass('hd_cart_hover');
                if($cart.data('loaded') !== 'yes'){
                    getCartData();
                }
            }, 200);
        }).on("mouseleave",function(){
            if(_time !== null){
                clearTimeout(_time);
            }
            _time = setTimeout(function(){
                $cart.removeClass('hd_cart_hover');
            }, 200);
        });

        $list.on('click','a.del',function(){
            deleteGood(this);
        });

        // 获取购物车数据
        function getCartData(){
            $.ajax({
                url: that.ajaxUrl.cartData,
                // url: 'json.html',
                type: 'post',
                dataType: 'json',
                success: function(data){
                    var _html = data_class = '';
                    if(data.status == 1){
                        $cart.data('loaded','yes');

                        $.each(data.data, function(i,v){
                            var _isTC = 0;

                            if(v.isTaoCan){
                                _isTC = 1;
                            }
                            _html += '<dl>'+
                                '<dt><a target="_blank" href="/product-'+v.id+'.html"><img src="'+v.pic+'"></a></dt>'+
                                '<dd>'+
                                    '<h4><a target="_blank" href="/product-'+v.id+'.html">'+v.name+'</a></h4>'+
                                    '<p><span class="red">￥'+v.price+'</span>&nbsp;<i>X</i>&nbsp;'+v.num+'</p>'+
                                    '<a class="iconfont del" title="删除" href="javascript:;" data-lid="'+v.l_id+'" data-taocan="'+_isTC+'">&#x164;</a>'+
                                '</dd>'+
                            '</dl>';

                            if(i > 5){
                                data_class = ' data_over';
                            }
                        });

                        _html = '<div class="data'+data_class+'">'+ _html +'</div><div class="count">共<span class="red" id="hd_cart_count">'+data.count+'</span>件商品，满99元就包邮哦~<p>总价:<span class="red">￥<em id="hd_cart_total">'+data.total+'</em></span><a href="/cart/mycart" class="btn">去结算</a></p></div>';
                        $list.html(_html);
                        $('#hd_cartnum').html(data.count);
                    }else if(data.status == 0){
                        showNull();
                    }else{
                        $list.html('<p class="fail"><i class="iconfont">&#371;</i><br>购物车数据加载失败<br>请稍后再试</p>');
                    }
                },
                error: function(xhr){
                    $list.html('<p class="fail"><i class="iconfont">&#371;</i><br>购物车数据加载失败<br>请稍后再试 ('+xhr.status+')</p>');
                }
            });
        }

        //删除商品
        function deleteGood(elem) {
            var _this = $(elem),
                l_id =  _this.data('lid');
            $.ajax({
                url: '/cart/deleteBar',
                // url: 'json2.html',
                type: 'post',
                dataType: 'json',
                data: {'idList':l_id},
                success: function(data){
                    var cart_lenth = data.totalCount;
                    $('#hd_cartnum').html(cart_lenth);
                    if(cart_lenth < 1){
                        showNull();
                        return;
                    }

                    if(_this.data('taocan') == 1){
                        // 是套餐商品，则重新加载
                        getCartData();
                    }else{
                        // 非套餐商品，直接删除DL
                        _this.parents('dl').remove();
                        $('#hd_cart_count').html(data.totalCount);
                        $('#hd_cart_total').html(data.totalPrice);
                        if(cart_lenth<7){
                            $list.find('.data').removeClass('data_over').css('zoom','1');
                        }
                    }
                },
                error: function(xhr){
                    NALA.dialog.warn('删除失败，请稍后再试 ('+xhr.status+')');
                }
            });
        }

        // 空购物车
        function showNull(){
            $('#hd_cartnum').css('visibility','hidden');
            $list.html('<p class="fail"><i class="iconfont">&#365;</i><br>购物车空啦<br>爱Ta，就带Ta来购物车吧</p>');
        }

    },
    // 右侧悬浮工具栏
    toolBar: function(){
        var that = this,
            $toolbar = null, $J_panels = null, $panels_box = null,
            $tb_li = null,
            _brandTitle = HTML = wideHTML = '';

        if(NALA.isPhone){
            return;
        }

        HTML = '<div class="tb_box" id="J_toolbar"><ul class="tb_bd"><li><a href="http://wpa.qq.com/msgrd?v=3&uin=935895471&site=多美美妆&menu=yes" class="kefu" target="_blank"><p><img src="http://cdn.lizi.com/images/kong.gif" /><span>在线客服</span></p></a></li><li><a href="javascript:;" class="back2top"><p><img src="http://cdn.lizi.com/images/kong.gif" /><span>返回顶部</span></p></a></li></ul></div>';
        
        $toolbar = $(HTML).appendTo('body');

        $toolbar.on('click','a.back2top',function () {
            $('body,html').animate({ scrollTop : 0 }, 500);
            return false;
        });
        
    }

}

})(jQuery);

$(function(){
    var common = NALA.common;
    common.userNav();
    common.lazyload();
    common.searchBar();
    common.mainNav_animate();
    common.head_cart_event();
    common.toolBar();
});