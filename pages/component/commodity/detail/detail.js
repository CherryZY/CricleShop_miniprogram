
var utils = require('../../../../utils/util.js');
var app = getApp();
/** 导入请求配置 */
const config = require('../../../../utils/config.js');
const URL_PREFIX = config.requestPrefixUrl;//请求url
const PORT = config.port;//请求端口
const DETAIL_DATA = config.loadCommodity;//加载当前商品详情数据
const CT_FORM = config.CT_form;
const PIC_PREFIX = config.picPrefixUrl;
/** 增加/取消操作（浏览/收藏） */
const ADD_OPER = config.addBehavior;
const CANCL_OPER = config.cancelBehavior;
const ADD_CART = config.addCart;
/** type:0-商品/1-商铺 */
const TYPE_COMM = 0;
/** behavior:0-浏览|1-购物车|2-正在购买|3-已购买|4-收藏 */
const BEHV_VIEW = 0;
const BEHV_STAR = 4;

const TO_BUYING = config.toBuying;
const IMM_BUY = config.immBuy;

Page({
    data: {
        /** 用于重载的id */
        id: 0,
        /** 载入图标 */
        loading: true,
        /** 图片前缀url */
        picPrefix:"",
        /** 是否已收藏 */
        isLike: false,
        indicatorDots: true, //是否显示面板指示点
        autoplay: true, //是否自动切换
        interval: 3000, //自动切换时间间隔,3s
        duration: 1000, //  滑动动画时长1s
        /** 商品信息对象 */
        commodityInfo: {},
        /** 触发scrolltolower位置 */
        lower_threshold: 10,
        /** test **/
        recommendTest:[
            "http://mz.djmall.xmisp.cn/files/product/20161201/148057921620_middle.jpg",
            "http://mz.djmall.xmisp.cn/files/product/20161201/148057922659_middle.jpg",
            "http://mz.djmall.xmisp.cn/files/product/20161201/148057923813_middle.jpg",
            "http://mz.djmall.xmisp.cn/files/product/20161201/148057924965_middle.jpg",
            "http://mz.djmall.xmisp.cn/files/product/20161201/148057925958_middle.jpg"
        ]
    },

    /**
     * 正常加载页面数据 或 上层页面过来的数据
     * @param e
     */
    onLoad: function (e) {
        /** 加载后台数据 */
        this.loadData(e);
        /** 记录浏览次数 */
        this.recordView();
    },

    /**
     * 立即购买
     */
    immeBuy: function() {
        //1.跳入付款页面直接传当前参数过去进行pay页面渲染
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let cid = this.data.commodityInfo.id;
        console.log(cid);
        wx.request({
            url:URL_PREFIX + PORT + IMM_BUY,
            method:"POST",
            header:{
                "content-type": CT_FORM,
                "token": token
            },
            data:{
                id : cid
            },
            success: s=>{
                console.log(s);
                if(s.data.result == 200){
                    wx.redirectTo({
                        url: '../../cart/pay/pay?oid='+s.data.backData,
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
     * 加入购物车
     */
    addCart: function(){
        let id = this.data.id;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        wx.request({
            url: URL_PREFIX + PORT + ADD_CART,
            method: "POST",
            header: {
                "content-type": CT_FORM,
                "token": token
            },
            data:{
                "id":id
            },
            success: s=>{
                console.log(s);
                if(s.data.result == 200){
                    wx.showToast({
                        title: '加入购物车成功',
                        duration: 1500,
                        icon: "success"
                    });
                }else if(s.data.result == 10001){
                    wx.showToast({
                        title: '请重新登录',
                        icon: "none",
                        duration: 1500
                    });
                }

            },
            fail: f=>{
                console.log(f);
                wx.showToast({
                  title: '服务器错误 ',
                  duration: 1500,
                  icon: "none"
                })
            }
        });
    },

    /**
     * 记录浏览量
     */
    recordView: function () {
        let that = this;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        console.log(token);
        if(token == null){
            token = "";
        }
        wx.request({
            url: URL_PREFIX + PORT + ADD_OPER,
            method: "POST",
            header:{
                "content-type":CT_FORM,
                "token": token
            },
            data:{
                objId: that.data.id,
                type: TYPE_COMM,
                behavior: BEHV_VIEW
            },
            success: res=>{
                console.log(res);
                if(res.data.result == 200){
                    console.log("记录浏览记录成功");
                }else{
                    console.log("记录浏览记录错误(服务器错误)");
                }
            },
            fail: f=>{
                console.log("记录数据请求失败");
                console.log(f);
            }
        });
    },

    /**
     * 加载后台数据
     * @param e
     */
    loadData: function(e){
        let that = this;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        console.log(token);
        let id = e.id;
        this.setData({
            id: id
        });
        wx.request({
            url: URL_PREFIX + PORT + DETAIL_DATA,
            method: "POST",
            header: {
                "content-type": CT_FORM,
                "token": token
            },
            data:{
                "id":id
            },
            success: res=> {
                console.log(res);
                wx.hideNavigationBarLoading(); //完成停止加载
                wx.stopPullDownRefresh(); //停止下拉刷新
                that.setData({
                    commodityInfo: res.data.backData,
                    picPrefix: PIC_PREFIX,
                    loading: false,
                    isLike: res.data.backData.liked
                });
            },
            fail: f=>{
                console.log("请求数据失败 from commodity detail");
            }
        });
    },

    /***
     * 跳转至商铺页面
     */
    toShop: function(){
      let shopId = this.data.commodityInfo.shopId;
      if(shopId != null && shopId != 0){
         wx.navigateTo({
           url: '../../shop/index/index?id=' + shopId
         });
      }
    },

    /**
     * 滚动至底部
     */
    scrolltolower: function(){
    },

    /**
     * 分享当前商品
     */
    share_commodity: function(){},

    /** 下拉重载 */
    onPullDownRefresh:function() {
        wx.showNavigationBarLoading(); //在标题栏中显示加载
        this.loadData();//重载后台主页数据
    },

    /**
     * 商品评价界面
     */
    toEvaluation: function(){
        if(this.data.commodityInfo.evaluateCount == null || this.data.commodityInfo.evaluateCount == 0){
            wx.showToast({
              title: '当前商品无评价',
              icon:"none",
              duration: 1500
            });
            return;
        }
        let id = this.data.commodityInfo.id;
        //传参过去当前商品的id，然后在evaluation界面通过后台进行评论数据加载
        wx.navigateTo({
          url: '../evaluation/evaluation?id='+id
        });
    },

    /**
     * 预览图片
     * @param e
     */
    previewImage: function (e) {
        var current = e.target.dataset.src;

        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: this.data.imgUrls // 需要预览的图片http链接列表
        })
    },

    /**
     * 收藏/取消收藏
     */
    like: function() {
        let that = this;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let requestUrl = ADD_OPER;
        /** 主要存在后台，其次storage也存一份 */
        if(!this.data.isLike == false){
            requestUrl = CANCL_OPER;
        }
        wx.request({
            url: URL_PREFIX + PORT + requestUrl,
            method: "POST",
            header:{
                "content-type":CT_FORM,
                "token": token
            },
            data:{
                objId: that.data.id,
                type: TYPE_COMM,
                behavior:BEHV_STAR
            },
            success: s=>{
                console.log(s);
                if(s.data.result == 200){
                    that.setData({
                        isLike: !this.data.isLike
                    });
                    console.log("收藏/取消成功");
                } else if (s.data.result == 10001){
                    wx.showToast({
                        title: '请登录',
                        icon: "none",
                        duration: 1500
                    });
                }

            },
            fail: f=>{
                wx.showToast({
                  title: '请求失败',
                  icon: "none",
                });
                console.log("收藏/取消失败");
            }
        });
    },

    /**
     * 跳到购物车
      */
    toCar: function() {
        wx.switchTab({
            url: '/pages/component/cart/index/index'
        })
    },

});