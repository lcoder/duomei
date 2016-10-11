/*
**订单提交页面:checkout
**update 2013.8.7 by pannysp
*/

var _editAddressHtml= '<ul class="form addr-form" id="addr-form">'+
        '<li><label class="nobg">地址标注:</label><span class="flag-default"><a href="javascript:;" hidefocus="true">家里</a><a href="javascript:;" hidefocus="true">出租房</a><a href="javascript:;" hidefocus="true">公司</a></span><span class="flag-other"><a href="javascript:;" hidefocus="true" class="flag-other-btn">其他</a><input type="text" maxlength="8" name="flag" class="txt txt-short" /><span class="info">4个汉字或者8个字母以内</span></span></li>'+
        '<li><label>收货姓名:</label><input type="text" class="txt" name="name" /></li>'+
        '<li class="addr-li cle"><label>所在地区:</label><select name="province"><option value="0">--请选择--</option><option value="97">北京</option><option value="2053">上海</option><option value="2234">天津</option><option value="2651">重庆</option><option value="2570">浙江</option><option value="102">福建</option><option value="275">广东</option><option value="1096">湖南</option><option value="1002">湖北</option><option value="1271">江苏</option><option value="1352">江西</option><option value="1">安徽</option><option value="777">河南</option><option value="618">河北</option><option value="922">黑龙江</option><option value="1212">吉林</option><option value="1455">辽宁</option><option value="1703">山东</option><option value="1829">山西</option><option value="1948">陕西</option><option value="2056">四川</option><option value="581">海南</option><option value="493">贵州</option><option value="2428">云南</option><option value="1654">青海</option><option value="180">甘肃</option><option value="388">广西</option><option value="1528">内蒙古</option><option value="1629">宁夏</option><option value="2321">新疆</option><option value="2240">西藏</option></select><span>省</span><select name="city"><option value="0">--请选择--</option></select><span>市</span><select name="area"><option value="0">--请选择--</option></select><span>区</span></li>'+
        '<li><label>街道地址:</label><input type="text" class="txt txt-long" name="street" /></li>'+
        '<li><label>联系电话:</label><input type="text" class="txt" placeholder="推荐使用手机号" name="phone" /><input type="hidden" name="password" /><span class="info">推荐手机，座机需加区号和“-”符号</span></li>'+
        '<li class="last"><a href="javascript:;" hidefocus="true" class="btn">确认提交</a><a href="javascript:;" hidefocus="true" class="graybtn">取 消</a></li></ul>';

var NALA = NALA || {};

NALA.address = {

    init: function(){
        this.addrlist_event();
        this.addNewAddr();
    },

    //地址列表事件
    addrlist_event: function(){
        var that = this,
            $list = $('#address_list');

        $list.on('click', 'a', function(e){
            var _this = $(this),
                $tr = _this.parents('tr'),
                _id = $tr.data('id'),
                _type = this.className.toLowerCase();
            switch (_type) {
                case 'update':
                    updateAddr(_id);
                    break;
                case 'del':
                    delAddr(_id, $tr);
                    break;
                case 'default':
                    setDefault(_id, _this);
                    break;
                default:
                    break;
            }
            return false;
        });

        // 设置默认地址
        function setDefault(id, $a){
            $.ajax({
                url : '/address/setDefault',
                // url : '/lizi/cart/ajaxAddress.html',
                type: 'post',
                dataType: 'json',
                data:{'id': id},
                success: function(result){
                    if(result.status == 1){
                        $list.find('a.current').removeClass('current').html('<i class="iconfont">&#xe607;</i>');
                        $a.addClass('current').html('<i class="iconfont">&#x17b;</i>');
                    }else{
                        NALA.dialog.warn('服务器忙，请稍后再试'); 
                    }
                },
                error: function(xhr){
                    NALA.dialog.warn('服务器忙，请稍后再试。('+xhr.status+')');
                }
            });
        }


        // 修改地址
        function updateAddr(id){
            $.ajax({
                url : '/address/ajaxAddress',
                // url : '/lizi/cart/ajaxAddress.html',
                type: 'post',
                dataType: 'json',
                data:{'id': id},
                success: function(result){
                    if(result.status == 1){
                        $.dialog({
                            title: '修改收货地址',
                            lock: true,
                            padding: '20px 35px',
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

        // 删除地址
        function delAddr(id, tr){
            NALA.dialog.confirm('确定要删除此地址吗？', function(){
                $.ajax({
                    url: '/address/delete',
                    type: 'post',
                    dataType: 'json',
                    data: {'id':id},
                    success: function(data){
                        if(data.status == 1){
                            tr.remove();
                        }else{
                            NALA.dialog.warn('服务器忙，请稍后再试。');
                        }
                    },
                    error: function(xhr){
                        NALA.dialog.warn('服务器忙，请稍后再试。('+xhr.status+')');
                    }
                });
            });
        }
    },

    // 添加新地址
    addNewAddr: function(){
        var that = this;
        $('#add_newaddr').on('click', function(){
            var newAddrDialog = $.dialog({
                title:'新增收货地址',
                id:'newaddr',
                lock:true,
                padding:'20px 35px',
                content:_editAddressHtml,
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
            $province.val(editJson.province_id);
            // 初始化城市信息
            switchArea($province, $city, editJson.city_id, function(){
                switchArea($city, $area, editJson.area_id);
            });

        }else if(editJson.addtype == 'new'){
            $province.val(editJson.province_id);
            switchArea($province, $city, editJson.city_id, function(){
                switchArea($city, $area, null);
            });
        }

        switchAreaStart($province, $city, $area);
        
        // 提交地址信息
        $btn.on('click',function() {
            var _name = $.trim($name.val()),
            _province = $province.val(),
            _city = $city.val(),
            _area = $area.val(),
            _street = $.trim($street.val()),
            _phone = $.trim($phone.val()),
            _flag = $.trim($flag.val()),
            _flaglen = _flag.replace(/[^\x00-\xff]/g, "**").length,
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
                NALA.dialog.warn('请选择所在地区！');
                return false;
            }

            if(_street == ""){
                NALA.dialog.warn('请输入街道地址！');
                return false;
            }

            if(!NALA.check.isMobile(_phone) && !NALA.check.isTelephone(_phone)){
                NALA.dialog.warn('请输入正确的联系电话！');
                return false;
            }

            $btn.html('<img src="http://cdn.lizi.com/images/loading.gif" /> 提交中');

            params = {
                'id':'',
                'email': '',
                'receiver': _name,
                'phone': _phone,
                'password': $pwd.val(),
                'street': _street,
                'province': _province,
                'city': _city,
                'area': _area,
                'flag': _flag,
                'FreeLoginBuy':0
            };

            if(editJson.id != undefined){
                params.id = editJson.id
            }

            $.ajax({
                url:"/address/updateOutAddress",
                // url:"/lizi/cart/updateOutAddress.html",
                type:"post",
                cache: false,
                data:params,
                dataType:'json',
                success:function(data) {
                    $btn.html('确认提交');
                    updatePage(data);
                },
                error: function(xhr){
                    $btn.html('确认提交');
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

        // 修改(新增)地址信息回调处理
        function updatePage(data){
            switch (data.status) {
                case 1:
                    NALA.dialog.success('收货地址更新成功！');
                    setTimeout(function(){
                        location.reload();    
                    }, 2500);
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
                default:
                    NALA.dialog.warn("服务器忙，请稍后再试。");
                    break;
            }
        }
    }

};

$(function(){
    NALA.address.init();
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
        $child.empty().append('<option value="0">--请选择--</option>');
        fn && fn();
    }else{
        $.ajax({
            url:"/area/getJson",
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
                $child.empty().append(options);
                fn && fn();
            }
        });
    }
}
