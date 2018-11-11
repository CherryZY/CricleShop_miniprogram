// pages/addressmana/addressmana.js
/** 导入请求配置 */
const config = require('../../../../utils/config.js');
const URL_PREFIX = config.requestPrefixUrl;//请求url
const ct_form = config.CT_form;
const PORT = config.port;//请求端口
const DELETE_ADD = config.deleteAddress;//删除地址信息
const QUERY_ADD = config.queryAddress;//查询地址信息
const SET_DEFAULT = config.setDefault;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading_all: true,
        /** 点击默认按钮 */
        defaulted: "/imgs/radio_full.png",
        no_defaulted: "/imgs/radio_empty.png",
        /** 保存当前用户所有地址信息 */
        addresses: [],
        /** 标识图片 */
        address_empty_icon: "/imgs/address_empty.png"
    },

    /**
     * 设默认地址
     */
    defaultAddress: function(obj){
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        //将当前设置为默认地址
        let idx = obj.currentTarget.dataset.index;
        console.log("defaultAddress set:"+idx);
        let wrapObj = "addresses["+idx+"].isDefault";
        let addes = this.data.addresses;
        let id = addes[idx].id;
        //并将其他的地址默认值置空
        for(let i=0;i< addes.length;i++){
            addes[i].isDefault = false;
        }
        /** 设置默认地址信息 */
        wx.request({
            url: URL_PREFIX + PORT + SET_DEFAULT,
            method: "POST",
            header:{
                "content-type": ct_form,
                "token": token
            },
            data:{
                id: id
            },
            success: s=>{
                console.log(s);
                this.setData({
                    addresses: addes,
                    [wrapObj]:1
                });
            },
            fail: f=>{
                console.log(f);
            }
        });
    },

    /**
     * 删除收货地址
     */
    deleteAddress: function(obj){
        let that = this;
        let idx = obj.currentTarget.dataset.index;
        console.log("Delete Address Index:"+idx);
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let id = that.data.addresses[idx].id;
        //发起服务端deleteAddress请求
        wx.request({
            url: URL_PREFIX + PORT + DELETE_ADD,
            method:"POST",
            header:{
                "content-type": ct_form,
                "token": token
            },
            data:{
                aid: id
            },
            success: s=>{
                if(s.data.result == 200){
                    wx.showToast({
                        title: '删除成功',
                        icon: "none",
                        duration: 1500
                    });
                    let adds = that.data.addresses;
                    adds.splice(idx,1);
                    that.setData({
                        addresses:adds
                    });
                    //删除当前页面中的
                    console.log("删除address信息成功.");
                }else if(s.data.result == 10001){
                    wx.showToast({
                        title: "请重新登录",
                        icon: "none",
                        duration: 1500
                    });
                }
            },
            fail: f=>{
                wx.showToast({
                  title: '删除失败',
                  icon: "none",
                  duration: 1500
                });
                console.log("删除address失败");
            }
        });
    },

    /**
     * 新增收货地址
     */
    addNewAddress: function(){
      console.log("新增收货地址");
      wx.navigateTo({
        url: '../newaddress/newaddress'
      });
    },

    /**
     * 修改当前地址
     */
    editAddress: function (e) {
        console.log(e);
        var idx = e.currentTarget.dataset.index;
        let id = this.data.addresses[idx].id;
        wx.navigateTo({
          url: '../newaddress/newaddress?id='+id
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let addresses = [];
        //从服务端加载数据
        wx.request({
            url:URL_PREFIX + PORT + QUERY_ADD,
            method:"POST",
            header:{
                "content-type": ct_form,
                "token": token
            },
            success: res=>{
                console.log(res);
                console.log("地址信息加载成功");
                if(res.data.result == 200){
                    addresses = res.data;
                    that.setData({
                        addresses: res.data.backData,
                        loading_all: false
                    });
                }else if(res.data.result = 10001){
                    wx.showToast({
                      title: '请重新登录',
                      duration: 1500,
                      icon: "none"
                    })
                }

            },
            fail:res=>{
                console.log(res);
            }
        });
        //存至addresses数组中并存入缓存
       /* wx.getStorage({
            key: 'transAddress',
            success: res => {
                console.log(res);
                //判空
                if(res.data == "" || res.data == null || res.data == []) { return;}
                //判断storage存的是否为数组
                if(res.data instanceof Array ){
                    //判断数组中是否有选默认的
                    let hasDefault = false;
                    for(let i=0;i<res.data.length;i++){
                        if(res.data[i].isDefault == true) {
                            hasDefault = true;
                            break;
                        }
                    }
                    if(hasDefault == false){
                        //则默认第一个为默认
                        res.data[0].isDefault = true;
                        that.setData({
                            addresses:res.data
                        });
                    }else{
                        this.setData({
                            addresses:res.data
                        });
                    }
                }else{
                    let adds = [];
                    adds.push(res.data);
                    //set之前先比对一下从服务端传来的数据
                    adds[0].isDefault = true;
                    console.log(adds);
                    that.setData({
                        addresses:adds
                    });
                }
            }
        });*/
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