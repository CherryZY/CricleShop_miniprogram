/* 购物车起始页 */
var app = getApp();
const config = require('../../../../utils/config.js');
const PREFIX_URL = config.requestPrefixUrl;
const picPrefixUrl = config.picPrefixUrl;
const PORT = config.port;
const DEL_ONE = config.deleteCartCommodity;
const REDUCE_ONE = config.reduceOne;
const ADD_ONE = config.addCart;
const LOAD_CART = config.loadCart;
const TO_BUYING = config.toBuying;
const CT_FORM = config.CT_form;
const CT_JSON = config.CT_json;
/** type:0-商品/1-商铺 */
const TYPE_COMM = 0;
/** behavior:0-浏览|1-购物车|2-正在购买|3-已购买|4-收藏 */
const BEHV_VIEW = 0;
const BEHV_TOCART = 1;
const BEHV_BUYING = 2;
const BEHV_BOUGHT = 3;
const BEHV_STAR = 4;

Page({
    /** 页面的初始数据 */
    data: {
        /** 整页加载中.. */
        loading_all: true,
        /** 全选 */
        selectedAllStatus: false,
        /** 总价格 */
        totalPrice: 0.00,
        /** 总商品个数 */
        selectedNum: 0,
        /** 商品们的信息 */
        commoditiesInfo: null,
        /** 全选 */
        chooseAll: false,
        /** 当前登录用户信息 */
        personInfo: null,
        /** 购物页 */
        shoppingTab: "/pages/component/index/index",
        /** cart图标 */
        cart_empty: "/imgs/cart_empty.png",
        /** 是否正在edit */
        editCart: false,
        /** 顶部栏显示信息 */
        topBarHintInfo: "购物满299.00免运费",
        showAction: "编辑",
        /** 商品详情介绍 */
        carts: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            picPrefixUrl: picPrefixUrl
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            editCart: false,
            selectedAllStatus: false,
            selectedNum: 0,
            totalPrice: 0.00
        });
        let that = this;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        //向后台发起请求,获取购物车数据
        wx.request({
            header: {
                "content-type": CT_FORM,
                "token":token
            },
            url: PREFIX_URL + PORT + LOAD_CART,
            method: "POST",
            success: e=>{
                // complete
                wx.hideNavigationBarLoading(); //完成停止加载
                wx.stopPullDownRefresh(); //停止下拉刷新
                if(e.data.result == 10001){
                    wx.showToast({
                      title: '您未登录',
                      duration: 1500,
                      icon: "none"
                    });
                    that.setData({
                        loading_all: false
                    });
                }
                else if(e.data.result == 40010){
                    that.setData({
                        loading_all: false, 
                        carts:[]
                    });
                }
                else{
                    that.setData({
                        carts: e.data.backData,
                        loading_all: false
                    });
                }
            },
            fail: e=>{
                console.log(e);
                that.setData({
                    loading_all: false
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            loading_all: true
        });
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.setData({
            loading_all: true
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading(); //在标题栏中显示加载
        this.onShow();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },


    //---------------------------------------------------------------------

    /**
     * 提交并支付商品
     * @param e
     */
    submit_pay_it: function(e){
        console.log("collect & pay those stuff");
        var crts = this.data.carts,
            count = 0,
            payGoods = [],
            payGoodIds = [];
        //step-1:收集当前勾选的商品信息和属性
        for(let i=0;i<crts.length;i++){
            if(crts[i].isSelect){
                count++;
                payGoods.push(crts[i]);
                payGoodIds.push(crts[i].id);
            }
        }
        //若未选中商品，则弹出对话框“您未选中商品”
        if(payGoods.length == 0){
            wx.showToast({
                title: '您未选中商品',
                icon: 'none',
                duration: 1000,
                mask:true
            });
            console.log("您未选中商品");
            return;
        }
        //存入行为中，且在pay中再次进行读取
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let pgs = JSON.stringify(payGoodIds);
        wx.request({
            url:PREFIX_URL + PORT + TO_BUYING,
            method:"POST",
            header:{
                "content-type": CT_FORM,
                "token": token
            },
            data:{
                ids : pgs
            },
            success: s=>{
                console.log(s);
                if(s.data.result == 200){
                    wx.navigateTo({
                        url: '../pay/pay?oid='+s.data.backData,
                    });
                }
            },
            fail: f=>{
                console.log(f);
                wx.showToast({
                  title: '服务器错误',
                  duration: 1500,
                  icon: "none"
                })
            }
        });

    },

    /**
     * 开始编辑商品
     * @param e
     */
    editAction: function(e){
        var edit = this.data.editCart,
            showA;
        if(!edit == true){ showA = "完成"; }
        else{ showA = "编辑";}
        this.setData({
            editCart: !edit,
            showAction: showA
        });
    },

    /**
     * 绑定单选
     * @param e
     */
    bindCheckbox: function(e){
        console.log(e);
        var idx = e.currentTarget.dataset.index;
        var carts = this.data.carts;
        var selected = carts[idx].isSelect;
        var allSelected = false;
        carts[idx].isSelect = !selected;
        /** alone tap */
        if(!carts[idx].isSelect){
            this.setData({selectedAllStatus:false});
        }
        /** 如果全部商品被选中，则全选 */
        for(let i=0;i<carts.length;i++) {
            if (!carts[i].isSelect){
                allSelected = false;
                break;
            }else
                allSelected = true;
        }
        this.setData({
            carts: carts,
            selectedAllStatus: allSelected
        });
        this.bindTotalPrice();
    },

    /**
     * 绑定全选
     * @param e
     */
    bindSelectAll: function(e){
        var selectedAllStatus = this.data.selectedAllStatus;
        var carts = this.data.carts;
        selectedAllStatus = !selectedAllStatus;
        for(var i = 0; i < carts.length; i++){
            carts[i].isSelect = selectedAllStatus;
        }
        this.setData({
            carts: carts,
            selectedAllStatus: selectedAllStatus
        });
        /** 算总价格 */
        this.bindTotalPrice();
    },

    /**
     * 绑定文本框数量
     * @param e
     */
    bindIptCartNum: function(e){
        var idx = e.currentTarget.dataset.index,
            carts = this.data.carts,
            num = e.detail.value,
            status = 'normal';
        if(num <= 1){
            num = 1;
            status = 'disabled';
        }
        carts[idx].num = num;
        var minusStatuses = this.data.minusStatuses;
        minusStatuses[idx] = status;
        this.setData({
            carts: carts,
            minusStatuses: minusStatuses
        });
        this.bindTotalPrice();
    },

    /**
     * 绑定 + - 号
     * @param e
     */
    bindCartNum: function(e){
        console.log(e);
        let that = this;
        var info = e.target.dataset,
            index = info.index,
            key = "carts["+index+"].count",
            type = info.type,
            crts = this.data.carts,
            currCount = crts[index].count;
        let requestUrl = REDUCE_ONE;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let id = crts[index].id;
        if(type == "-"){
            currCount--;
            if(currCount == 0){
                requestUrl = DEL_ONE;
            }
        }
        else if(type == "+") {
            requestUrl = ADD_ONE;
            currCount++;
        }
        wx.request({
            url: PREFIX_URL + PORT + requestUrl,
            method: "POST",
            header:{
                "content-type":CT_FORM,
                "token": token
            },
            data:{
                id:id
            },
            success: s=>{
                console.log(s);
                if(currCount == 0){
                    crts.splice(index,1);
                    that.setData({
                        carts:crts
                    });
                }else{
                    that.setData({
                        [key]: currCount
                    });
                }
            },
            fail: f=>{
                console.log(f);
                this.setData({
                    [key]: currCount
                });
            }
        });
    },

    /**
     * 绑定删除按钮
     * @param e
     */
    bindCartsDel: function(e){
        var index = e.target.dataset.index,
            key = "carts["+index+"]",
            cart = this.data.carts;
        let that = this;
        let id = cart[index].id;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        //删除购物车商品
        wx.request({
            url: PREFIX_URL + PORT + DEL_ONE,
            method: "POST",
            header:{
                "content-type":CT_FORM,
                "token": token
            },
            data:{
               id:id
            },
            success: s=>{
                console.log(s);
                cart.splice(index,1);
                this.setData({
                    carts:cart
                });
            },
            fail: f=>{
                console.log(f);
            }
        });


    },

    /**
     * 计算总价格
     */
    bindTotalPrice: function () {
        var totalP = 0;
        var carts = this.data.carts;
        var totalNum = 0;
        for(let j = 0; j< carts.length ; j++){
            if(carts[j].isSelect){
                totalNum++;
                totalP += (carts[j].count * carts[j].price);
            }
        }
        this.setData({
            selectedNum: totalNum,
            totalPrice: totalP
        });
    },

    /**
     * 商品选择
     */
    chooseChange: function(e){
        console.log(e);
        /** 全选 */
        if(e.detail.value[0] == 'choose_all'){
            this.setData({chooseAll:true});
        }
    },

    /**
     * 跳转至购物页面
     */
    goShopping: function(){
        var goShoppingUrl = this.data.shoppingTab;
        wx.switchTab({
            url: goShoppingUrl
        });
     },


});