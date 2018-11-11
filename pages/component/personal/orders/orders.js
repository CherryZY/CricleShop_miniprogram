// pages/orders/orders.js
let app = getApp();
let config = require("../../../../utils/config.js");

const URL_PREFIX = config.requestPrefixUrl;
const picPrefixUrl = config.picPrefixUrl;
const PORT = config.port;
const ORDER_LIST = config.getBuyList;/** 订单 */
const CANCEL_BUYING = config.cacelBuying;/** 取消正在购买 */

const CT_FORM = config.CT_form;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      /** true->已付款,false->未付款 */
      topIndx: false,
      /** 正在加载 */
      loading: true,
      /** 所有订单 */
      orders: [],
  },

    /**
     * change Top Bar
     * @param i
     */
    changeTopBar: function (i) {
        if(i.currentTarget.dataset.index === "1"){
            this.setData({
                topIndx: true,
                type: 0,
                orders: [],
                loading: true
            });
            this.onShow();
        }else if(i.currentTarget.dataset.index === "2"){
            this.setData({
                topIndx:false,
                type: 1,
                orders: [],
                loading: true
            });
            this.onShow();
        }
    },

    /**
     * 购买结算未完成订单
     */
    toBuy: function (c) {
        if(c.currentTarget.dataset.type == 1){return;}
        let idd = c.currentTarget.dataset.id;
        let id = parseInt(idd);
        console.log(id);
        wx.navigateTo({
            url: '../../cart/pay/pay?oid='+id
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        //默认为未购买订单
        let type = 1;
        wx.setNavigationBarTitle({
            title: '我的订单'
        });
        this.setData({
            picPrefixUrl: picPrefixUrl,
            type: type
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      let token = wx.getStorageSync('token');
      if(token == null){token = "";}
      let that = this;
      //从服务端加载当前用户订单数据
      wx.request({
          url: URL_PREFIX + PORT + ORDER_LIST,
          method: "POST",
          header: {
              "token": token,
              "content-type": CT_FORM
          },
          data:{
              type: that.data.type
          },
          success: s=>{
              console.log(s.data);
              let data = s.data;
              if(data.result == 200){
                  for(let t=0 ; t< data.backData.length; t++){
                      data.backData[t].ctime = new Date(data.backData[t].createTime).toLocaleDateString()
                          + "-" + new Date(data.backData[t].createTime).toLocaleTimeString();
                      data.backData[t].utime = new Date(data.backData[t].updateTime).toLocaleDateString()
                          + "-" + new Date(data.backData[t].updateTime).toLocaleTimeString();
                  }
                  that.setData({
                      orders: data.backData,
                      loading: false
                  });
              }else if(data.result == 10001){
                  wx.showToast({
                    title: '请重新登录',
                    icon: "none",
                    duration:1500
                  });
              }else if(data.result == 40010){
                  wx.showToast({
                      title: '没有数据',
                      icon: "none",
                      duration:1500
                  });
                  that.setData({
                      orders: []
                  });
              } else{
                  wx.showToast({
                      title: '服务器错误',
                      icon: "none",
                      duration:1500
                  });
              }
              that.setData({
                  loading: false
              });
              console.log("orderList request Success");
          },
          fail: f=>{
              console.log("orderList request Failed:message"+f);
          }
      });

    },

    /**
     * 进入商品详情页
     * @param e
     */
    toCommodityDetail: function(e){
        let id = parseInt(e.currentTarget.dataset.id);
        wx.navigateTo({
          url: '../../commodity/detail/detail?id=' + id
        })
    },

    /**
     * 添加评论
     */
    evaluation: function(src){
        console.log(src);
        let data = src.currentTarget.dataset;
        let orderId = data.src.orderId;
        let objId = data.src.id;
        let routeTo;
        if(data.type == "detail"){
            routeTo = "evaluatedetail/evaluatedetail?"
        }else{
            routeTo = "editevaluate/editevaluate?"
        }
        wx.navigateTo({
          url: '../' + routeTo + "objId=" + objId + "&orderId=" + orderId + "&type=" + data.type
        });
    },

    /**
     * 取消订单
     * @param data
     */
    cancelOrder: function(data){
        console.log(data);
        let id = data.currentTarget.dataset.id;
        let index = data.currentTarget.dataset.index;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let that = this;
        let orders = this.data.orders;
        wx.request({
            url: URL_PREFIX + PORT + CANCEL_BUYING,
            method: "POST",
            header: {
                "token": token,
                "content-type": CT_FORM
            },
            data:{
                oid: id
            },
            success: s=>{
                console.log(s);
                if(s.data.result == 200){
                    wx.showToast({
                      title: '取消订单成功'
                    });
                    orders.splice(index, 1);
                    that.setData({
                        orders: orders
                    });
                }else if(s.data.result == 10001){
                    wx.showToast({
                        title: '请重新登录',
                        icon: "none",
                        duration:1500
                    });
                }else if(s.data.result == 40010){
                    wx.showToast({
                        title: '订单不存在',
                        icon: "none",
                        duration:1500
                    });
                } else{
                    wx.showToast({
                        title: '服务器错误',
                        icon: "none",
                        duration:1500
                    });
                }
            },
            fail: f=>{
                console.log(f);
            }
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * on隐藏
     */
    onHide: function () {
        this.setData({
            loading: true
        });
    }

});