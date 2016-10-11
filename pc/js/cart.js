/*
** 购物车页面
** 2014.8.28 update by pannysp
*/

var NALA = NALA || {};

NALA.myCart = {
    common: {
       $priceTotal: null,
       $box: null,
       $itemNumTop: null,
       $checkoutTop: null,
       bannkconflict: false
    },

    init: function() {
        var that = this,
            objCom = that.common,
            $list = null,
            $checkall = null,
            $priceTotal = $('#price-total'),
            $checkoutTop = $('#checkout-top');

        if($priceTotal.length == 0){
            return;
        }

        objCom.$itemNumTop = $('#itemsnum-top');
        objCom.$checkoutTop = $checkoutTop;
        objCom.$priceTotal = $priceTotal;
        objCom.$box = $('#cart-box');
        $list = objCom.$box.find('li');
        $checkall = objCom.$box.find('input[name=checkall]');

        // 预处理更新下价格
        that.updateCart();

        $list.each(function() {
            var li = $(this),
            input = li.find('input:text');

            li.on('mouseenter',function() {
                li.addClass('hover');
            }).on('mouseleave',function() {
                li.removeClass('hover');
            }).on('click','input[name=goodsId]',function() {
                if($(this).not(":checked")){
                    $checkall.each(function() {
                        this.checked = false;
                    });
                }
                that.updateCart();
            });

            if(input.val() == 1){
                input.prev().addClass('disabled');
            }else if(input.val() == 99){
                input.next().addClass('disabled');
            }
            input.data('oval',input.val());
        });

        objCom.$box.find('ul').each(function() {
            $(this).find('li:last').css('border-bottom','none');;
        });

        //全选事件
        $checkall.click(function() {
            var $checkbox = objCom.$box.find('input[name=goodsId]');
            if($(this).is(":checked")){
                $checkall.each(function() {
                    this.checked = true;
                });
                $checkbox.each(function() {
                    this.checked = true;
                });
            }else{
                $checkall.each(function() {
                    this.checked = false;
                });
                $checkbox.each(function() {
                    this.checked = false;
                });
            }
            that.updateCart();
        });
        

        //删除勾选
        $('#del-checked').click(function() {
            var $checkd = objCom.$box.find('input[name=goodsId]').filter(":checked");
            if($checkd.length == 0){
                alert("请勾选要删除的商品!");
                return false;
            }
            if (confirm("确定要删除选中的商品？")) {
                var id_list = [];
                $checkd.each(function() {
                    id_list.push($(this).val());
                });
                that.deleteCheckedGoods(id_list, $checkd)
            }
            return false;
        });

        //清空购物车
        $('#del-all').click(function() {
            if (confirm("确定要清空购物车?")) {
                return true;
            }
            return false;
        });

        // 最终结算
        objCom.$priceTotal.on('click', 'a.btn', function() {
            var _btn = $(this), _promotionNum = _disabledNum = goodsPrice = 0,
                $checked = objCom.$box.find('input[name=goodsId]').filter(':checked'),
                ids = [];
            if(_btn.find('img').length>0 || _btn.hasClass('btn-off')){
                return false;
            }
            if($checked.length === 0){
                NALA.dialog.warn("请勾选要下单的商品!");
                return false;
            }else if(objCom.bannkconflict){
                NALA.dialog.warn('只能选择 <b class="red">1</b> 家银行专享商品，进行下单结算!');
                return false;
            }else{
                _btn.html('<img src="http://img.nala.com.cn/images/loading.gif" /> 提交中');
                $checked.each(function() {
                    var _li = $(this).parents('li'),
                    _xj = 0;
                    
                    if(_li.find('.isPromotion').length>0){
                        _promotionNum ++;
                        ids.push(this.value);
                    }else if(_li.hasClass('disabled')){
                        _disabledNum ++;
                    }else{
                        ids.push(this.value);
                        _xj = parseFloat(_li.find('.price-xj em').text());
                        goodsPrice += _xj;
                    }

                });

                if(_promotionNum > 0 && goodsPrice < postage_fee){
                    alert('下单商品金额小于'+postage_fee+'元，不能购买促销商品！');
                    _btn.html('去下单<i class="iconfont">&#402;</i>');
                    return false;
                }

                _disabledNum = _promotionNum + _disabledNum;
                if($checked.length == _disabledNum){
                    alert("全是缺货或过期商品！");
                    _btn.html('去下单<i class="iconfont">&#402;</i>');
                    return false;
                }

                $.ajax({
                    url: '/cart/sureBuyNumber',
                    type: 'post',
                    data: {'idList':ids.join(',')},
                    success: function(result){
                        location.href = '/cart/checkout';
                    },
                    error: function(xhr){
                        _btn.html('去下单<i class="iconfont">&#402;</i>');
                        NALA.dialog.warn("服务器忙，请稍后再试。("+xhr.status+")");
                    }
                });
            }
        });

        $checkoutTop.click(function() {
            objCom.$priceTotal.find('a.btn').trigger('click');
            return false;
        });
    

        that.listEvent($list);

        objCom.$box.find('p.time').each(function() {
            var _this = $(this),
                _time = _this.data("time"),
                _type = _this.data("type");
        });

        $('em.counttime').each(function() {
            var _this = $(this),
                _time = _this.data("time");
        });

        $('#login-link').click(function() {
            NALA.dialog.showLogin();
            return false;
        });

    },

    listEvent: function ($list) {
        var that = this,
        setTime = null;

        $list.on('click','a.btn-del',function() {
            var $del = $(this),
            $li = $del.parents('li'),
            id = $li.find('input:checkbox').val();
            that.deleteGoods(id, $li);

        }).on('click','span',function() {
            var _this = $(this),
            _input = _this.siblings('input:text'),
            _limit = _input.data('limit') ? parseInt(_input.data('limit')) : 99,
            num = _input.val();
            
            if(_this.hasClass('disabled')){
                return false;
            }

            clearTimeout(setTime);

            if(!NALA.check.isNum(num)){
                _input.val(_input.data('oval'));
                return false;
            }

            num = parseInt(num);

            if(_this.hasClass('add')){
                num++;
            }else{
                num--;
            }
            if(num>=_limit){
                _this.addClass('disabled');
                num = _limit;
                showNumLimit(_input,_limit);
            }else if(num<=1){
                num = 1;
                _this.addClass('disabled');
            }

            _this.siblings('span').removeClass('disabled');

            _input.val(num).data('oval',num);
            setTime = setTimeout(function(){
                var id = _this.parents('li').find('input:checkbox').val();
                that.updateGoodsNum(id, num);
                that.updateCart();
            },500);
            
        }).on('keyup','input:text',function() {
            var _input = $(this),
            oval = _input.data('oval'),
            _limit = _input.data('limit') ? parseInt(_input.data('limit')) : 99,
            val = _input.val();
            clearTimeout(setTime);
         
            if(val=="" || val == 0 || _input.parents('li').hasClass('disabled')){
                setTime = setTimeout(function(){
                    _input.val(oval).focus();
                }, 1000);
            }else{
                setTime = setTimeout(function(){
                    if(NALA.check.isNum(val)){
                        if(val>=_limit) {
                            val=_limit;
                            _input.val(val).siblings('span').removeClass('disabled').eq(1).addClass('disabled');
                            showNumLimit(_input,_limit);
                        }else if(val == 1){
                            _input.siblings('span').removeClass('disabled').eq(0).addClass('disabled');
                        }else{
                            _input.siblings('span').removeClass('disabled');
                        }
                        _input.data('oval',val).trigger('blur');

                        var id = _input.parents('li').find('input:checkbox').val();
                        that.updateGoodsNum(id, val);
                        that.updateCart();
                    }else{
                        _input.val(oval).focus();
                    }
                }, 500);
            }
        }).on('paste','input:text',function() {
            return false;
        });

        function showNumLimit($input, _limit) {
            var $tip = $('<div class="numlimit-tip"><i>&diams;</i><i class="btm">&diams;</i><p>最多只能购买'+_limit+'件</p></div>').insertAfter($input);
            setTimeout(function(){
                $tip.fadeOut(function() {
                    $tip.remove();
                });
            }, 2000);
        }
    },

    // 更新购物车价格
    updateCart: function() {
        var objCom = this.common,
        $group = objCom.$box.find('.goods-list'),
        $checkedInput = objCom.$box.find('input[name=goodsId]').filter(':checked'),
        _isFree = false,
        _islifegift = false,
        _freecard = 0 || false,
        _youf_str = _jf_str = _bankName = '',
        _btn = '<a href="javascript:;" class="btn">去下单<i class="iconfont">&#402;</i></a>',
        _totalItems = _totalPrice = _totalJifen = 0;

        objCom.bannkconflict = false;
        
        // 商品被删光，则刷新页面
        if($group.length == 0){
            location.reload();
            return;
        }

        // 无勾选，立即显示总0元
        if($checkedInput.length === 0){
            _youf_str = '<span class="red">您还没有勾选要下单的商品</span>';
            objCom.$itemNumTop.html('0件商品');
            objCom.$checkoutTop.addClass('btn-off');
            objCom.$priceTotal.html('<p>0件商品，总价：<span class="red">￥<strong>0.00</strong></span></p><p>'+_youf_str+'<a href="javascript:;" class="btn btn-off">去下单<i class="iconfont">&#402;</i></a></p>');
            return;
        }else{
            objCom.$checkoutTop.removeClass('btn-off');
        }


        // 只购买终生免费礼
        if($checkedInput.length == 1 && $checkedInput.parents('li').find('.islifegift').length > 0){
            // 有包邮卡的用户
            if(_freecard){
                _youf_str = '<span class="green">您有包邮卡，购满9.9即可免邮</span>';
            }else{
                _youf_str = '您还差<span class="red">'+postage_fee+'</span>元即可享受免邮费';
            }
            objCom.$itemNumTop.html('1件商品');
            objCom.$priceTotal.html('<p>1件商品，总价：<span class="red">￥<strong>0.00</strong></span></p><p>'+_youf_str+'<a href="javascript:;" class="btn">去下单<i class="iconfont">&#402;</i></a></p>');
            return;
        }

        // 有勾选，算价格
        $group.each(function() {
            var _gthis = $(this),
            fullSale = _gthis.data('fullsale'),
            SALE = _gthis.data('sale'),
            _groupPrice = 0;
            
            // 循环各组内的商品价格
            _gthis.find('li').each(function() {
                var $li = $(this), n, p, np, item_num, jfn = 0,
                $checked = $li.find('input:checkbox'),
                $bankp = $li.find('span.bank-price'),
                $input, $xj, $one;

                
                $input = $li.find('input:text');
                $xj = $li.find('.price-xj em');
                $one = $li.find('.price-one em');
                item_num = $li.find('div.pic').length;

                if($input.length>0){
                    n = parseInt($input.val());
                }else{
                    // 个数不能改的商品
                    n = parseFloat($li.find('em.only1').text());
                }
                p = parseFloat($one.text());
                np = parseFloat((n*p).toFixed(2));

                // 积分换购小结计算
                if(SALE != undefined && SALE.type === "jifen"){
                    var jf = parseFloat($one.siblings('cite').text());
                    jfn = jf*n;
                    $xj.siblings('cite').text(jfn);
                }

                $xj.text(np.toFixed(2));

                //排除：过期、缺货、没勾选的商品，不计算
                if( !$li.hasClass('disabled') && $checked.is(':checked') ){
                    _totalItems += item_num*n;
                    _totalPrice += np;
                    _totalJifen += jfn;

                    if(fullSale != undefined){
                        _groupPrice += np;
                    }

                    if($li.find('i.isfree').length>0){
                        _isFree = true;
                    }

                    if($bankp.length>0){
                        if(_bankName != '' && _bankName != $bankp.data('name')){
                            objCom.bannkconflict = true;
                        }else{
                            _bankName = $bankp.data('name');
                        }
                    }
                }
            });

            
        });

        objCom.$priceTotal.html('<p>'+_totalItems+'件商品，总价：<span class="red">&yen;<strong>'+_totalPrice.toFixed(2)+'</strong>'+_jf_str+'</span></p><p>'+_youf_str+_btn+'</p>');
        objCom.$itemNumTop.html(_totalItems+'件商品');
    },

    updateGoodsNum: function(id, num) {
        var param = {
            lineItemId: id,
            lineCount: num
        };
        $.post('/cart/changeLineItemCount',param);
    },

    deleteGoods: function(id, $li) {
        var that = this;
        $.ajax({
            url: '/cart/delete',
            type:'post',
            data:{'idList':id},
            success: function(result){
                if($li.siblings('li').length==0){
                    $li.parents('.goods-list').animate({'opacity':0},300,function() {
                        $(this).remove();
                        that.updateCart();
                    });
                }else{
                    $li.animate({'opacity':0},300,function() {
                        $(this).remove();
                        that.updateCart();
                    });
                }
            },
            error: function(xhr){
                NALA.dialog.warn("服务器忙，请稍后再试。("+xhr.status+")");
            }
        });
    },

    deleteCheckedGoods: function(ids,$checkd) {
        var that = this;
        $.ajax({
            url: '/cart/delete',
            type:'post',
            data:{'idList':ids.join(',')},
            success: function(result){
                $checkd.each(function() {
                    var _li = $(this).parents('li');
                    if(_li.siblings('li').length==0){
                        _li.parents('.goods-list').animate({'opacity':0},300,function() {
                            $(this).remove();
                        });
                    }else{
                        _li.animate({'opacity':0},300,function() {
                            $(this).remove();
                        });
                    }
                });
                setTimeout(function(){
                    that.common.$box.find('.goods-list').each(function() {
                        var _this = $(this);
                        if(_this.find('li').length === 0){
                            _this.remove();
                        }
                    });
                    that.updateCart();
                }, 350);
            },
            error: function(xhr){
                NALA.dialog.warn("服务器忙，请稍后再试。("+xhr.status+")");
            }
        });
    },


    // 返回时间JSON，参数为秒
    timeJson: function(times) {
        var oTime = {};
        oTime.secs = Math.floor(times % 60);
        oTime.mins = Math.floor(times / 60 % 60);
        oTime.hours = Math.floor(times / 60 / 60);
        oTime.days = 0;

        if(oTime.hours > 23){
            oTime.days = Math.floor(oTime.hours/24);
            oTime.hours = oTime.hours - oTime.days*24;
        }
        if(oTime.secs<10){
            oTime.secs = '0' + oTime.secs;
        }
        if(oTime.mins<10){
            oTime.mins = '0' + oTime.mins;
        }
        if(oTime.hours<10){
            oTime.hours = '0' + oTime.hours;
        }
        return oTime;
    }
    
};

$(function() {
    NALA.myCart.init();
});