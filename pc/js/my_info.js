/*
**【我的NALA】 个人资料页面
*/
var NALA = NALA || {};

NALA.userinfo = {
    init: function(){
        this.editInfo();
    },

    editInfo: function(){
        var $form = $('#info_form'),
            $btn = $form.find('a.submit'),
            $nick = $form.find('input[name=nickname]'),
            $skin = $form.find('select[name=skin]'),
            $hair = $form.find('select[name=hair]'),
            $bth_y = $form.find('select[name=birthday_y]'),
            $bth_m = $form.find('select[name=birthday_m]'),
            $bth_d = $form.find('select[name=birthday_d]'),
            $province = $form.find('select[name=province]'),
            $city = $form.find('select[name=city]'),
            $area = $form.find('select[name=area]');
        $btn.on('click', function(){
            var parm = {},
                $sex = $form.find('input:checked'),
                filter_words = /找小姐|整形|学生妹|人流|不孕不育/,
                _nick = $.trim($nick.val()),
                _skin = $skin.val(),
                _hair = $hair.val(),
                _bth_y = $bth_y.val(),
                _bth_m = $bth_m.val(),
                _bth_d = $bth_d.val();

            if(_nick == ''){
                NALA.dialog.warn('昵称不能为空，请修改。');
                return false;
            }
            if(_nick.length>10){
                NALA.dialog.warn('昵称长度需控制在10个字符以内。');
                return false;
            }
            if(!NALA.check.isNick(_nick)){
                NALA.dialog.warn('昵称包含非法字符，请修改。');
                return false;
            }

            if(filter_words.test(_nick)){
                $nick.val('');
                return false;
            }

            if(_skin < 1){
                NALA.dialog.warn('请选择肤质类型。');
                return false;
            }
            if(_hair < 1){
                NALA.dialog.warn('请选择发质类型。');
                return false;
            }

            $btn.html('<img src="http://img.nala.com.cn/images/loading-16.gif" /> 提交中');

            parm = {
                'nickname': _nick,
                'skin': _skin,
                'hair': _hair,
                'sex': $sex.val(),
                'birthday_y': _bth_y,
                'birthday_m': _bth_m,
                'birthday_d': _bth_d,
                'province': $province.val(),
                'city': $city.val(),
                'area': $area.val()
            }

            if(_bth_y==0 || _bth_m==0 || _bth_d==0){
                parm.birthday_y = '';
                parm.birthday_m = '';
                parm.birthday_d = '';
            }

            $.ajax({
                url: '/user/update',
                // url: 'json2.html',
                type: 'post',
                dataType: 'json',
                data: parm,
                success: function(data){
                    if(data.status == 1){
                        NALA.dialog.success('信息保存成功！',1);
                        $btn.html('保存');
                    }else if(data.status == 2){
                        NALA.dialog.warn('昵称太受欢迎啦~，已有人抢了。');
                    }else{
                        NALA.dialog.warn('信息保存失败，请稍后再试。');
                    }
                },
                error: function(xhr){
                    NALA.dialog.warn('服务器忙，请稍后再试。('+xhr.status+')');
                }
            });
            return false;
        });

        // 生日赋值
        var birth_ary = birthday_ary.split('-');
        if(birth_ary.length>0){
            $bth_y.val(birth_ary[0]);
            $bth_m.val(birth_ary[1]);
            $bth_d.val(birth_ary[2]);
        }
        

        // 省市区
        $province.val(address_ary[0]);
        switchArea($province, $city, address_ary[1], function(){
            switchArea($city, $area, address_ary[2]);
        });

        switchAreaStart($province, $city, $area);
    }
};
      
$(function(){
   NALA.userinfo.init();
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
    var pid = $parent.val(),
        _str = ($child[0].name == 'city') ? '城市':'地区';
    if(pid == 0){
        $child.empty().append('<option value="0">--'+_str+'--</option>');
        fn && fn();
    }else{
        $.ajax({
            url:"/area/getJson",
            // url:"/b2c/cart/cityjson.html",
            type:'post',
            data: {id : pid},
            dataType: 'json',
            success:function(data){
                var options = '<option value="0">--'+_str+'--</option>';
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