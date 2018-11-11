
var app = getApp();
const config = require('../../../../utils/config.js');
const URL_PREFIX = config.requestPrefixUrl;//请求url
const PORT = config.port;//请求端口
const DETAIL_DATA = config.loadCommodity;//加载当前商品详情数据
const CT_FORM = config.CT_form;
const PIC_PREFIX = config.picPrefixUrl;
const DEFAULT_ADDRS = config.queryDefault;//加载默认地址
const QUERY_BUYING = config.getBuying;
const TO_BOUGHT = config.toBought;//转入已购买状态
const ct_form = config.CT_form;

Page({


    data:{
        /** 订单id */
        oid : 0,
        /** 地址id */
        aid: 0,
        /** 加载中... */
        loading_all: true,

        /** 商品总金额 */
        commTotalPrice:0.00,
        /** 配送价格 */
        transPrice: 0.00,
        /** 总价格 */
        totalPrice: 0,

        /** 即将付款的商品 */
        payForCommodities: [],
        /** 配送地址 */
        transAddress: null,
        /** 配送方式 */
        transMethod: [{
            price: 10.00,
            text:"普通快递",
            choosed: true
        },{
            price: 20.00,
            text:"顺丰快递",
            choosed: false
        }],
        transIdx:0,
        /** 送货时间 */
        transTime: null,
        /** 发票 */
        invoice: false,
        /** 配送方式 */
        hideTransMethod: true,
        /** img--icon */
        location_icon: "/imgs/location.png",
        arrow_icon: "/imgs/triangle.png",
        pullDown_icon: "/imgs/pull_down.png"
    },

    /**
     * 选择快递方式
     * @param c
     */
    chooseFunc: function (c) {
        let idx = c.currentTarget.dataset.index;
        let ky = "transMethod["+idx+"].choosed";
        for(let id=0;id<this.data.transMethod.length;id++){
            let i = "transMethod["+id+"].choosed";
            this.setData({
                [i]:false
            });
        }
        let price = this.data.transMethod[idx].price;
        this.setData({
            [ky]:true ,
            transIdx: idx ,
            transPrice: price ,
            totalPrice: price + this.data.commTotalPrice
        });
    },

    /**
     * 编辑重置地址
     */
    editAddress: function(){
        wx.navigateTo({
          url: '../../personal/addressmana/addressmana'
        });
    },

    /**
     * 编辑发票
     */
    editInvoice: function () {
        wx.showToast({
            title: '正在施工',
            icon: 'none',
            duration: 1000,
            mask:true
        });
    },

    /**
     * 选择配送方式
     */
    choose_trans: function(){
        var hTM = this.data.hideTransMethod;
        this.setData({hideTransMethod:!hTM});
    },

    /**
     * 跳转至地址管理界面
     */
    addAddress: function(){
        wx.navigateTo({
          url: '../../personal/addressmana/addressmana'
        });
    },

    /**
     * 调取微信支付API
     */
    submitPay: function () {
        console.log("wechat pay...");
        let that = this;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        //changeTo已支付状态
        wx.request({
            url:URL_PREFIX + PORT + TO_BOUGHT,
            method: "POST",
            header:{
                "content-type": ct_form,
                "token": token
            },
            data:{
                oid: that.data.oid,
                aid: that.data.aid,
                tid: that.data.transIdx,
                sumPrice: that.data.totalPrice,
                transPrice: that.data.transPrice
            },
            success: res=>{
                console.log(res);
                if(res.data.result == 200){
                    wx.redirectTo({
                        url: '../paysuccess/paysuccess'
                    });
                }else{
                    wx.showToast({
                      title: '服务器异常'
                    });
                }
            },
            fail: f=>{
                console.log(f);
                wx.showToast({
                  title: '调取支付失败',
                  duration: 1500,
                  icon:"none"
                })
            }
        });
    },

    /**
     * 初始加载page
     */
    onLoad: function(e){
        this.setData({
            oid:e.oid
        });
    },

    /**
     * onShow
     */
    onShow: function(){
        this.setData({
            PIC_PREFIX: PIC_PREFIX
        });
        let that = this;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        //获取正在购买状态的商品
        wx.request({
            url:URL_PREFIX + PORT + QUERY_BUYING,
            method: "POST",
            header:{
                "content-type": ct_form,
                "token": token
            },
            data:{
                oid: that.data.oid
            },
            success:res=>{
                if(res.data.result == 200){
                    that.setData({
                        payForCommodities : res.data.backData
                    });
                    let sumtp = 0;
                    for(let i=0;i< res.data.backData.length; i++){
                        sumtp += res.data.backData[i].price * res.data.backData[i].count;
                    }
                    sumtp += 10;
                    that.setData({
                        commTotalPrice: sumtp-10,
                        loading_all: false,
                        totalPrice: sumtp
                    });
                }else{
                    let status = res.data.result;
                    wx.showToast({
                        title: '服务错误:'+ status,
                        duration:1500,
                        icon: "none"
                    });
                }
            },
            fail: f=>{
                console.log(f);
            }
        });
        //获取默认地址
        wx.request({
            url:URL_PREFIX + PORT + DEFAULT_ADDRS,
            method:"POST",
            header:{
                "content-type": ct_form,
                "token": token
            },
            success: s=>{
                console.log(s);
                if(s.data.result == 200){
                    that.setData({
                        transAddress: s.data.backData,
                        aid: s.data.backData.id,
                        transPrice:10
                    });
                }
            },
            fail: f=>{
                console.log(f);
            }
        });
    },

});