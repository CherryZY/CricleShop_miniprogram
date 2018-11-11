// pages/component/shop/index/index.js

var app = getApp();
const config = require("../../../../utils/config");
const utils = require("../../../../utils/util.js");

const picPrefixUrl = config.picPrefixUrl;
const requestPrefixUrl = config.requestPrefixUrl;
const PORT = config.port;
const shopIndx = config.shopindex;
const CT_FORM = config.CT_form;
const ADD_OPER = config.addBehavior;
const CANCL_OPER = config.cancelBehavior;
const queryByShop = config.queryByShop;
/** type:0-商品/1-商铺 */
const TYPE_SHOP = 1;
/** behavior:0-浏览|1-购物车|2-正在购买|3-已购买|4-收藏 */
const BEHV_VIEW = 0;
const BEHV_STAR = 4;

const STAR_COUNT = 5;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      id: 0,

      ploading: true,

      starNum:0,
      loading_all: true,
      /** 图片url前缀 */
      picPrefixUrl: "",
      /** 选中标签页 */
      choosed: 'A',
      /** 商铺基本信息 */
      shopBasicInfo: {},
      /** 产品 */
      produces:[],
      isLike: false,
      arrivedPoint: false,

      navigationHeight: 0,
      /** 产品list */
      pPage: 1,
      pSize: 10,
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获得当前设备尺寸
        var info = wx.getSystemInfoSync(),
            height = info.windowHeight;
        this.setData({
            navigationHeight: height*0.045,
            picPrefixUrl: picPrefixUrl
        });
        let that = this;
        let id = parseInt(options.id);
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        wx.request({
            url: requestPrefixUrl + PORT + shopIndx,
            method: "POST",
            header:{
                "content-type":CT_FORM,
                "token": token
            },
            data:{
                "shopId":id
            },
            success: res=>{
                console.log("商铺页面数据加载成功");
                console.log(res);
                if(res.data.result == 200){
                    let backData = res.data.backData;
                    if(backData.liked === 1){
                        this.setData({
                            isLike : true
                        });
                    }
                    that.setData({
                        loading_all: false,
                        picPrefixUrl: picPrefixUrl,
                        shopBasicInfo:res.data.backData,
                        STAR_COUNT: STAR_COUNT,
                        id: res.data.backData.id
                    });
                }

            },
            fail: f=>{
                console.log("商铺页面加载失败");
                console.log(f)
            }
        });
    },

    /**
     * 产品界面滚动监控
     */
    scrollToUpper: function () {
        console.log("滚动产品");

    },

    /**
     * 滚动监控
     * @param e
     */
    scrollFn: function(e){
      //获得当前设备信息
      var sysinfo = wx.getSystemInfoSync(),
          height = sysinfo.windowHeight;
      /*console.log(e);
      console.log(sysinfo);*/
      if(e.detail.scrollTop >= (0.27 * height)){
        this.setData({
            arrivedPoint: true
        });
      }else{
        this.setData({
            arrivedPoint: false
        });
      }
    },

    /**
     * 收藏
     */
    addLike: function(){
        //后台更新操作
        let that = this;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let requestUrl = ADD_OPER;
        /** 主要存在后台，其次storage也存一份 */
        if(!this.data.isLike == false){
            requestUrl = CANCL_OPER;
        }
        wx.request({
            url: requestPrefixUrl + PORT + requestUrl,
            method: "POST",
            header:{
                "content-type":CT_FORM,
                "token": token
            },
            data:{
                objId: that.data.id,
                type: TYPE_SHOP,
                behavior:BEHV_STAR
            },
            success: res=>{
                console.log("收藏/取消商铺成功");
                if(res.data.result == 200){
                    that.setData({
                        isLike: !this.data.isLike
                    });
                }else if(res.data.result == 10001){
                    wx.showToast({
                      title: '请登录'
                    });
                }else{
                    wx.showToast({
                        title: '服务器异常'
                    });
                }
                console.log(res);
            },
            fail: res=>{
                console.log(res);
            }
        });
    },

    /**
     * 选择主页
     */
    chooseIndex: function(){
      this.setData({
         choosed: 'A'
      });
    },

    /**
     * 选择产品页
     */
    chooseProducts: function(){
      this.setData({
          choosed: 'B'
      });
      let that = this;
      let token = wx.getStorageSync('token');
      if(token == null){token = "";}
      wx.request({
          url: requestPrefixUrl + PORT + queryByShop,
          method: "POST",
          header:{
              "content-type":CT_FORM,
              "token": token
          },
          data:{
              shopId: that.data.id,
              page: that.data.pPage,
              size: that.data.pSize
          },
          success: res=>{
              console.log(res);
              if(res.data.result == 200){
                  that.setData({
                      ploading: false,
                      produces : res.data.backData
                  });
              }else if(res.data.result == 40010){
                  console.log( "index 400010");
                  that.setData({
                      produces: null,
                      ploading: false
                  });
              }else{
                  wx.showToast({
                    title: '服务异常',
                    icon: "none"
                  });
              }
          },
          fail: res=>{
              console.log(res);
              wx.showToast({
                  title: '网络异常',
                  icon: "none"
              });
          }
      });
    },

    /**
     * 选择介绍页
     */
    chooseIntroduce: function(){
      this.setData({
          choosed: 'C'
      });
    },

    /**
     * 选择联系我们页面
     */
    chooseContactUs: function(){
      this.setData({
          choosed: 'D'
      });
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
});