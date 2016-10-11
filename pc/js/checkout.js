/*
**订单提交页面:checkout
**update 2013.8.7 by pannysp
*/
var school = [];
var _editAddressHtml= '<ul class="form addr-form" id="addr-form">'+
        '<li><label>收货姓名:</label><input type="text" class="txt" name="name" /></li>'+
        '<li class="addr-li cle"><label>收货地址:</label><select name="province"><option value="0">--请选择--</option><option value="01">浙江理工大学</option><option value="01">杭州电子科技大学</option><option value="01">浙江传媒学院</option><option value="01">中国计量学院</option><option value="01">杭州职业技术学院</option><option value="01">浙江财经大学</option></select><select name="city"><option value="0">--请选择--</option></select><select name="area"><option value="0">--请选择--</option></select></li>'+
        '<li><label>联系电话:</label><input type="text" class="txt" placeholder="手机号" name="phone" /><input type="hidden" name="password" /></li>'+
        '<li><label class="want2say">备&nbsp;&nbsp;&nbsp;&nbsp;注:</label><input type="text" class="txt txt-long" name="street" placeholder="有什么想对我们说的？" /></li>'+
        '<li class="last"><a href="javascript:;" hidefocus="true" class="btn">确认提交</a><a href="javascript:;" hidefocus="true" class="graybtn">取 消</a></li></ul>';

var NALA = NALA || {};
NALA.checkout = {
    $addr_list: null,
    $car: $('<span class="addr-kdz"><i></i>快递至：</span>'),
    $postage_cod: null,
    $total_price: null,
    goodsPrice: 0,
    COUPON: 0,
    INTEGRAL: 0,
    POSTAGE: Trade.isFree?0:Trade.postage,

    FreeLoginBuy: false,

    // 小车滑动
    carRun: function(){
        var that = this,
        $nowLi = that.$addr_list.find('li.selected');
        that.$car.stop().css({'opacity':0}).appendTo($nowLi).animate({'opacity':1},300);
    },

    //地址列表事件
    addrlist_event: function(){
        var that = this,
        $list = that.$addr_list;

        that.carRun();

        $list.on('click', 'li', function(e){
            var _this = $(this),
            $oli = null,
            _radio = _this.find('input[type=radio]')[0];
            if(e.target.nodeName.toLowerCase()=='a'){
                // 修改当前地址
                editAddr(_radio.value, this);
                return;
            }
            if(_this.hasClass('selected')){
                return false;
            }
            $oli = $list.find('li.selected').removeClass();
            $oli.find('input[type=radio]')[0].checked = false;
            _radio.checked = true;
            _this[0].className = 'selected';
            that.carRun();
            that.updateBtmAddr(_this.find('span.addr-con').html());
        });

        // 修改地址
        function editAddr(id, _li){
            $.ajax({
                url : '/address/ajaxAddress',
                // url : 'ajaxAddress.html',
                cache: false,
                dataType: 'json',
                data:{'id': id},
                success: function(result){
                    if(result.status == 1){
                        $.dialog({
                            title: '修改收货地址',
                            lock: true,
                            padding: '20px 35px',
                            width: '984px',
                            follow: _li,
                            id: "edit_addr",
                            content: _editAddressHtml,
                            init: function(){
                                that.addrFormInit(result.obj);
                            }
                        });
                    }else{
                        NALA.dialog.warn('服务器忙，请稍后再试'); 
                    }
                },
                error: function(xhr){
                    NALA.dialog.warn('服务器忙，请稍后再试。('+xhr.status+')');
                }
            });
        }
    },

    // 添加新地址
    addNewAddr: function(){
        var that = this;
        $('#add-newaddr').on('click', function(){
            var newAddrDialog = $.dialog({
                title:'使用新地址',
                id:'newaddr',
                lock:true,
                padding:'20px 35px',
                content:_editAddressHtml + '<div class="title-tip">多美会对您填写的内容进行加密，以保障您个人信息的安全</div>',
                init: function(){
                    $.ajax({
                        url: '/address/getLocationCodeByIP',
                        type: 'post',
                        dataType: 'json',
                        success: function(data){
                            data.addtype = 'new';
                            that.addrFormInit(data);
                        },
                        error: function(xhr){
                            that.addrFormInit();
                        }
                    });
                }
            });
        });
    },

    // 第1次添加地址
    addFirstAddr: function(){
        $('#first-addr-form').html(_editAddressHtml);
        this.addrFormInit();
    },

    //根据新地址添加新用户
    addNewUser: function(){
        $('#new-addr2user-form').html('<h5>填写收货地址</h5>'+_editAddressHtml+'<div class="btm-tip"><p>确认后，我们会为您同步创建丽子账户</p></div>');
        this.addrFormInit();
    },

    // 收货人信息表单初始化、验证、提交等事件
    addrFormInit: function(editJson) {
        var that = this,
        $box = $('#addr-form'),
        $btn = $box.find('a.btn'),
        $cancel = $box.find('a.graybtn'),
        $province = $box.find('select[name=province]'),
        $city = $box.find('select[name=city]'),
        $area = $box.find('select[name=area]'),
        $name = $box.find('input[name=name]'),
        $street = $box.find('input[name=street]'),
        $phone = $box.find('input[name=phone]'),
        $pwd = $box.find('input[name=password]'),

        $flag = $box.find('input[name=flag]'),
        $flag_other = $flag.parent('span.flag-other'),
        $flagbtn = $flag_other.prev('span.flag-default').find('a'),

        editJson = editJson || {};

        if(editJson.id != undefined){
            // 有Json信息传入,则弹窗后赋值
            $name.val(editJson.name);
            $street.val(editJson.street);
            $phone.val(editJson.phone);
            $province.val(editJson.province_id).mySelect();
            // 初始化城市信息
            switchArea($province, $city, editJson.city_id, function(){
                switchArea($city, $area, editJson.area_id);
            });

        }else if(editJson.addtype == 'new'){
            $province.val(editJson.province_id).mySelect();
            switchArea($province, $city, editJson.city_id, function(){
                switchArea($city, $area, null);
            });
        }else{
            $province.mySelect();
            $city.mySelect();
            $area.mySelect();
        }

        switchAreaStart($province, $city, $area);
        
        // 提交地址信息
        $btn.on('click',function() {
            var _name = $.trim($name.val()),
            _province = $province.val(),
            _city = $city.val(),
            _area = $area.val(),
            _phone = $.trim($phone.val()),
            _flag = $.trim($flag.val()),
            _flaglen = _flag.replace(/[^\x00-\xff]/g, "**").length;
            params = {};

            if($btn.find('img').length>0){
                return false;
            }

            if(_flaglen>8){
                NALA.dialog.warn('地址标注超过4个汉字或8个字母！');
                return false;
            }

            if(!NALA.check.isNick(_name)){
                NALA.dialog.warn('请输入正确的收货姓名！');
                return false;
            }

            if(_area == 0){
                NALA.dialog.warn('请选择送货地址！');
                return false;
            }

            if(!NALA.check.isMobile(_phone) && !NALA.check.isTelephone(_phone)){
                NALA.dialog.warn('请输入正确的联系电话！');
                return false;
            }

            $btn.html('<img src="http://cdn.lizi.com/images/loading.gif" /> 提交中');

            if(Trade.hasAddress == 0){
                $pwd.val(Math.floor(Math.random()*900000 + 100000));
            }

            params = {
                'id':'',
                'email': '',
                'receiver': _name,
                'phone': _phone,
                'password': $pwd.val(),
                'province': _province,
                'city': _city,
                'area': _area,
                'flag': _flag,
                'FreeLoginBuy':0
            };

            if(editJson.id != undefined){
                params.id = editJson.id
            }

            if(that.FreeLoginBuy){
                params.FreeLoginBuy = 1;
            }

            $.ajax({
                url:"/address/updateOutAddress",
                // url:"updateOutAddress.html",
                type:"post",
                cache: false,
                data:params,
                dataType:'json',
                success:function(data) {
                    $btn.html('确认提交');
                    that.FreeLoginBuy = false;
                    that.updatePage(data);
                },
                error: function(xhr){
                    $btn.html('确认提交');
                    that.FreeLoginBuy = false;
                    NALA.dialog.warn("服务器忙，请稍后再试。("+xhr.status+")");
                }
            });

        });
    
        // 取消按钮
        $cancel.on('click',function() {
            NALA.dialog.close();
        });

        // 地址标注
        $flagbtn.on('click', function(){
            var _this = $(this);
            if(_this.hasClass('on')){
                return false;
            }else{
                $flagbtn.removeClass('on');
                $flag_other.removeClass('selected');
                _this.addClass('on');
                $flag.val(_this.text());
            }
        });

        $flag_other.on('click', 'a', function(){
            if($flag_other.hasClass('selected')){
                return false;
            }else{
                $flagbtn.removeClass('on');
                $flag.val('');
                $flag_other.addClass('selected');
            }
        });
    },

    //更新下面的收货地址信息栏
    updateBtmAddr: function(html){
        $('#btm-addr').html(html);
    },


    // 修改(新增)地址信息回调处理
    updatePage: function(data) {
        var that = this;
        switch (data.status) {
            case 1:
                if(Trade.hasAddress == 1){
                    var $addr_list = that.$addr_list,
                    $li = $addr_list.find('li.selected'),
                    _id = $li.find('input[type=radio]').val(),
                    obj = data.obj,
                    html = '';
                    NALA.dialog.close();
                    html = '<input type="radio" name="address_radio" value="'+obj.id+'" checked="checked"><span class="addr-flag">'+obj.flag+'</span><span class="addr-con">'+obj.province+'&nbsp;'+obj.city+'&nbsp;'+obj.area+'&nbsp;&nbsp;'+obj.street+'<em>（'+obj.name+'&nbsp;'+obj.phone+'）</em></span><a href="javascript:;">修改</a>';
                    if(_id == obj.id){
                        //修改地址成功
                        $li.html(html);
                    }else{
                        //增加新地址成功
                        $li.removeClass('selected').find('input[type=radio]')[0].checked = false;
                        $addr_list.append('<li class="selected">'+html+'</li>');
                    }
                    that.carRun();

                    that.updateBtmAddr(obj.province+'&nbsp;'+obj.city+'&nbsp;'+obj.area+'&nbsp;&nbsp;'+obj.street+'<em>（'+obj.name+'&nbsp;'+obj.phone+'）</em>');
                }else if(Trade.hasAddress == 0){
                    // 新用户自动注册
                    NALA.dialog.warn('系统为您自动创建了丽子帐号。<br>用户名：'+data.obj.userName+'<br>密码：'+data.obj.pwd+'，请您妥善保管',function(){
                        location.reload();
                    });
                }else{
                    location.reload();
                }
                break;
            case 0:
            case 2:
                NALA.dialog.warn("保存失败：收货人信息过长");
                break;
            case 4:
                NALA.dialog.warn("保存失败：收货地址数量超过上限");
                break;
            case 7:
                NALA.dialog.warn(data.msg);
                break;
            case 8:
                that.showMobileError(2);
                break;
            case 9:
                that.showMobileError(1);
                break;
            default:
                location.reload();
                break;
        }
    },

    // 提交订单
    submitTrade: function(){
        var that = this,
            $btn = $('#submit-btn'),
            $tarea = $('#buyerMemo');

        $btn.click(function(){
            var _this = $(this);

            if(_this.find('img').length>0){
                return false;
            }
            
            if($tarea.val() == '还有什么要叮嘱的，尽管告诉丽子客服~'){
                $tarea.val('');
            }
            _this.html('<img src="http://cdn.lizi.com/images/loading.gif" /> 提交中');
            // 必须settimeout，否则IE6不提交
            setTimeout(function(){$('#receiverForm').submit();}, 30);
        });

    },

    // 登录
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
                        location.reload();
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
                        NALA.dialog.warn('服务器忙，请稍后再试。('+xhr.status+')');
                    }
                }
            });
            return false;
        });
        var text = '<div style="width:360px; text-indent: 2em; font-size: 14px; margin-bottom: 10px;">因淘宝联合登录故障，新用户请选择其他方式登录，老会员请联系客服取回您的淘宝联合登录账号。对您造成的不便，丽子表示抱歉。</div><p style="text-align: center;"><a href="http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA0MjIzN181OTY5N184MDAwNDIyMzdfMl8" class="graybtn" target="_blank"><i class="iconfont" style="color:#f70; font-size:14px;">&#54;</i> 点此咨询客服</a></p>';
            $('.other-form').on('click', 'a.tb-link', function(){
                NALA.dialog.creat({id:'tblogin-error','title':'登录故障', content:text});
                return false;
            });
    }

};

$(function(){
    var Checkout = NALA.checkout;
    switch (Trade.hasAddress) {
        case 0:
            // 未登录
            Checkout.loginNala();
            Checkout.addNewUser();
            break;
        case 1:
            // 已登录，且有收货地址
            Checkout.$addr_list = $('#addr-list');
            Checkout.$postage_cod = $('#postage-cod');
            Checkout.$total_price = $('#total-price');
            Checkout.goodsPrice = parseFloat($('#goods-price').text());
            Checkout.addrlist_event();
            Checkout.addNewAddr();
            Checkout.submitTrade();
            break;
        case 2:
            // 已登录，但无收货地址,则添加第1个地址
            Checkout.addFirstAddr();
            break;
    }
});

// 省市级联事件-触发
function switchAreaStart($province, $city, $area) {
    $province.change(function(){
        switchArea($province, $city, null, function(){
            switchArea($city, $area, null);
        });
    });

    $city.change(function(){
        switchArea($city, $area, null);
    });
}

// 省市区联动事件
function switchArea($parent, $child, selected_id, fn){
    var pid = $parent.val();
    if(pid == 0){
        $child.empty().append('<option value="0">--请选择--</option>').mySelect();
        fn && fn();
    }else{
        $.ajax({
            url:"/duomei/pc/js/school_address.js",
            // url:"cityjson.html",
            type:'post',
            data: {id : pid},
            dataType: 'json',
            success:function(data){
                var options = '<option value="0">--请选择--</option>';
                $.each(data,function(i){
                    if(data[i].id == selected_id){
                        options += '<option value="'+this.id+'" selected="selected">'+this.name+'</option>';  
                    }else{
                        options += '<option value="'+this.id+'" >'+this.name+'</option>'; 
                    }
                });
                $child.empty().append(options).mySelect();
                fn && fn();
            }
        });
    }
}
