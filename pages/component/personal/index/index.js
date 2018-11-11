const util = require('../../../../utils/util.js');
var app = getApp();
const config = require('../../../../utils/config.js');
let picPrefixUrl = config.picPrefixUrl;
const CT_FORM = config.CT_form;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      /** 头像url */
      avatarUrl: "",
      /** 用户nickName */
      nickName:"",

      /** 当前登录的用户信息 */
      personInfo: {},
      /** 图标信息  */
      order_list_icon: "/imgs/order_list.png",
      wait_pay_icon: "/imgs/wait_pay.png",
      wait_reci_icon: "/imgs/wait_reci.png",
      wait_trans_icon: "/imgs/wait_trans.png",
      triangle_icon: "/imgs/triangle.png",
      location_icon: "/imgs/address_ma.png",
      setting_icon: "/imgs/setting.png",
      about_icon: "/imgs/about.png",
      collection_icon: "/imgs/collection.png",
      checkbox_empty: "/imgs/checkbox_empty.png",
      checkbox_full: "/imgs/checkbox_full.png"
  },

    /**
     * 提交支付数据
     */
    submit_pay_it: function(res){

    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        var that = this;
        wx.getUserInfo({
            success:res=>{
                console.log(res);
                this.setData({
                    personInfo: res.userInfo
                });
            },
            fail: f=>{
                if(null == this.data.personInfo.avatarUrl){
                    that.setData({
                        avatarUrl: picPrefixUrl + "/21e02377b7bc5e4fb3c99681edbfc338.jpg",
                        nickName: "none"
                    });
                }
            }
        });
  },

    /**
     * 重新登录
     */
    relogin: function () {
        //重新登录.....
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 待付款
   */
  wait_pay: function(){
      wx.navigateTo({
          url: '../orders/orders?type=buying',
      });
  },

  /**
   * 待发货
   */
  wait_trans: function(){
    console.log("点击---待发货");
  },

  /**
   * 待收货
   */
  wait_reci: function(){
    console.log("点击---待收货");
  },

  /**
   * 设置
   */
  setting: function(){
    wx.navigateTo({
      url: '../setting/setting',
    });
  },

  /**
   * 跳转至当前用户所有订单页面
   */
  viewMyOrders: function(){
    wx.navigateTo({
      url: '../orders/orders?type=bought',
    });
  },

    /**
     * 跳转至个人收藏页面
     */
    collection: function () {
      wx.navigateTo({
        url: '../collection/collection',
      })
    },

  /**
   * 跳转至地址管理
   */
  addressMan: function(){
    wx.navigateTo({
      url: '../addressmana/addressmana',
    });
  },

  /** 
   * 关于
  */
  about: function(){
    wx.navigateTo({
      url: '../about/about',
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
});