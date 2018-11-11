//logs.js
const util = require('../../utils/util.js');

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    /**texts: ["a", "b", "c", "d", "e", "f", "g", "h"],
      iconType: [
        'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
      ] */
    items:[
      {
        text: "a",
        iconType: "success"
      },
      {
        text: "b",
        iconType: "success"
      }
    ],
    index:0,
    array: ['美国', '中国', '巴西', '日本'],
    time:"12:00",
    date:"2017-09-01",
    actionSheetItems: ["item1", "item2", "item3","item4"],
    actionSheetHidden:true
  },
  actionSheetTap: function (e) {
    /**打开消息提示框 */
    wx.showToast({
      title: '正在加载',
      icon: "success",
      duration: 1000,
      mask:false,
      success: function(res){
        console.log(res);
      },
      fail: function(res){
        console.log(res.errMsg);
      }
    });
    /**打开窗口Modal */
    // wx.showModal({
    //   title: '权限设置',
    //   content: '是否提供当前位置',
    //   cancelText: "no",
    //   confirmText: "yes",
    //   success: function(res){
    //     if(res.confirm){
    //       console.log("用户点击确认");
    //     }else{
    //       console.log("用户点击取消");
    //     }
    //   }
    // })
    /**打开ActionSheet */
    // wx.showActionSheet({
    //   itemList: ["item1","item2"],
    //   success: function(res){
    //     console.log(res);
    //   },
    //   fail: function(res){
    //     console.log(res.errMsg);
    //   }
    // })
  },
  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  
  /**日期picker事件绑定 */
  bindDateChange:function(e){
    this.setData({ date:e.detail.value});
  },
  /**普通picker事件绑定 */
  bindPickerChange:function(e){
    this.setData({index:e.detail.value});
  },
  /**Selector picker事件绑定 */
  bindTimeChange:function(e){
    this.setData({time:e.detail.value});
  },
  /**提交表单数据 */
  formSubmit:function(e){
    console.log(e.detail.value);
  },
  /**表单重置reset */
  formReset:function(){
    console.log("reset form");
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },

  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    wx.checkSession({
      success: function(){
        console.log("用户在登录态");
      },
      fail: function(){
        console.log("用户不在登录态");
      }
    });

    /** 获得用户信息 */
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        console.log(nickName+"-"+gender+"-"+province);
      }
    })
  }
})
