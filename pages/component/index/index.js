//index.js
//获取应用实例
const app = getApp();
/** 导入搜索框模块 */
var WxSearch = require('../../api/wxSearch/wxSearch.js');
var utils = require('../../../utils/util.js');
/** 导入请求配置 */
const config = require('../../../utils/config.js');
const URL_PREFIX = config.requestPrefixUrl;//请求url
const PORT = config.port;//请求端口
const SEARCH = config.search;//搜索
const INDEX_DATA = config.indexload;//主页加载
const LOG_IN = config.login;//登录
const CT_FORM = config.CT_form;
const picPrefixUrl = config.picPrefixUrl;

Page({
    /**
     * 页面data数据
     */
    data: {
        picPrefix:"",
        /** 首页加载中 */
        loading: true,
        /** 滑动items设置 */
        indicatorDots: true,
        autoPlay: true,
        interval: 5000,
        duration: 1000,
        scrollPic: [],
        /** 聚焦--顶部搜索栏 */
        barFocused: false,
        /** 搜索数据 */
        wxSearchData: {},
        /** 店铺Block信息 */
        shopInfo:[],
        /** “明星单品”数据 */
        starCommodities: [],
        /** “最新上线”数据 */
        newCommodities: []
    },

    /** 进入推荐店铺列表 */
    goToShopList: function(){
        wx.navigateTo({
            url: '../commodity/list/list?type=shopmore'
        });
    },

    /** 进入最新上线商品list */
    gotoNewsList: function(){
        wx.navigateTo({
          url: '../commodity/list/list?type=newmore'
        });
    },

    /** 进入明星单品商品list */
    gotoStarList: function(){
        wx.navigateTo({
            url: '../commodity/list/list?type=hotmore'
        });
    },

    /**
     * 店铺块
     * @param e
     */
    shopTap: e=>{
        let shopObj = e.target.dataset.src;
        wx.navigateTo({
            url: '../shop/index/index?id='+ shopObj.id
        });
    },

    /**
     * 点击index页商品块
     * @param e
     */
    commodityTap: e=>{
        let commodityData = e.target.dataset.src;
        wx.navigateTo({
           url: '../commodity/detail/detail?id='+commodityData.id
        });
    },

    /**
     * 点击swiper大图
     * @param e
     */
    swiperTap: e=>{
        let obj = e.target.dataset.src;
        wx.navigateTo({
            url: "../commodity/detail/detail?id="+obj.id
        });
    },

    /** ------------------------------------------------------------------------- */

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.getSetting({
            success: res=>{
                console.log(res);
            }
        });
        var that = this;
        //调用login获得token并维护登录态
        wx.login({
            success: function (res) {
                let rs = res;
                /** 获得用户信息 */
                wx.getUserInfo({
                    success:res=>{
                        that.userInfo = res.userInfo;
                        that.isDefaultData = false;
                        if (rs.code != "" && rs.code != null) {
                            wx.request({
                                url: URL_PREFIX + LOG_IN,
                                method: "POST",
                                header: {
                                    "content-type": CT_FORM
                                },
                                data:{
                                    "code":rs.code,
                                    "encryptedData": res.encryptedData,
                                    "iv": res.iv
                                },
                                success: res=> {
                                    var data = res.data;
                                    if(data.result != 200){
                                        console.log("服务器错误+"+data.result);
                                        wx.showToast({
                                          title: '服务器错误，请下拉重载',
                                          icon:"none",
                                          duration:1500
                                        });
                                        return;
                                    }
                                    console.log("发送请求成功--> token:" + data.backData);
                                    //将token放入本地缓存
                                    wx.setStorage({
                                        key: 'token',
                                        data: res.data.backData,
                                        success: res=> {
                                            console.log("token存入缓存成功");
                                        }, fail:res=>{
                                            console.log("token存入缓存失败");
                                        }
                                    });
                                    that.loadIndex();
                                },
                                fail: res=> {
                                    wx.showToast({
                                      title: '登录失败',
                                      duration: 1500,
                                      icon: "none"
                                    });
                                    console.log("index.js onLoad() 向服务器发送登录 失败");
                                    that.loadIndex();
                                }
                            });
                        } else {
                            console.log("获得code失败");
                            that.loadIndex();
                        }
                    },
                    fail:res=>{
                        console.log("用户拒绝了授权请求");
                        that.isDefaultData = true;
                        //无token请求
                        that.loadIndex();
                    }
                });

            }
        });
        let hotHistorys = wx.getStorageSync('hotHis');
        let mindKeys = wx.getStorageSync('mindHis');
        WxSearch.init(that,43,hotHistorys);
        WxSearch.initMindKeys(mindKeys);
    },

    /**
     * 加载主页信息请求
     * @param token
     */
    loadIndex: function(){
          let that = this;
          let token = wx.getStorageSync('token');
          if(token == null){token = "";}
          wx.request({
              url: URL_PREFIX + PORT + INDEX_DATA,
              data:{
                  swiperCount: 3,
                  hotCount: 3,
                  newsCount: 3,
                  shopsCount:3
              },
              header: {
                  "content-type": CT_FORM,
                  "token": token
              },
              method: "POST",
              success: s=>{
                  let data = s.data.backData;
                  console.log(data);
                  if(data != null){
                      wx.hideNavigationBarLoading(); //完成停止加载
                      wx.stopPullDownRefresh(); //停止下拉刷新
                      that.setData({
                          picPrefix : picPrefixUrl,
                          scrollPic: data.swipers,
                          shopInfo: data.shops,
                          starCommodities: data.hotObjects,
                          newCommodities: data.newsObjects,
                          loading: false
                      });
                  }
              },
              fail: f=>{
                  that.setData({
                      loading: false
                  });
                  wx.showToast({
                    title: '加载数据失败,请下拉重载',
                    icon: 'none',
                    duration: 2000
                  });
              }
          });
    },

    /**
     * scroll-view 滚动
     */
    scrollFn: function (e) {

    },

    /** -------------------------------搜索---------------------------------- */
    /**
     * 搜索e
     * @param e
     */
    searching: function(e){
        var loadData = {};
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let his = wx.getStorageSync('mindHis');
        if(his == null || his == ''){ his = [];}
        his.push(e);
        wx.setStorageSync('mindHis', his);
        wx.request({
            data:{
                keyWord:e
            },
            head:{
                "content-type": CT_FORM,
                "token": token
            },
            url: URL_PREFIX + PORT + SEARCH,
            method:"POST",
            success: s=>{
                loadData = s.data;
                console.log("searching loadData:"+loadData);
            },
            fail: f=>{
                console.log("index.js searching()请求服务失败");
            }
        });
        return loadData;
    },

    /**
     * 搜索按钮Go
     * @param e
     */
    wxSearchFn: function(e){
        console.log(this.data.wxSearchData.value);
        let searchValue = this.data.wxSearchData.value;
        if(searchValue == "" || searchValue == null){
            wx.showToast({
                title: '搜索内容为空',
                icon: "none"
            });
            return;
        }
        //请求后台进行数据搜索
        let searchResult = this.searching(searchValue);
        if(searchResult != null){
            //显示在页面中
            //跳转至显示页面，或者在当前SearchPad显示
        }else{
            wx.showToast({
                title: '未搜索到...',
                icon: 'none'
            });
        }
        //加入历史记录
        var that = this;
        WxSearch.wxSearchAddHisKey(that);
        return;
    },

    /**
     * 监听输入搜索栏的数据
     * @param e
     */
    wxSearchInput: function(e){
        var that = this;
        WxSearch.wxSearchInput(e,that);
    },

    /**
     * 监听聚焦
     * @param e
     */
    wxSearchFocus: function(e){
        var that = this;
        this.setData({
            barFocused: true
        });
        console.log("barFocused--"+this.data.barFocused);
        WxSearch.wxSearchFocus(e,that);
    },

    /**
     * 监听失焦
     * @param e
     */
    wxSearchBlur: function(e){
        var that = this;
        this.setData({
            barFocused: false
        });
        console.log("barFocused Blur--"+this.data.barFocused);
        WxSearch.wxSearchBlur(e,that);
        WxSearch.wxSearchHiddenPancel(that);
    },

    /**
     * 搜索
     * @param e
     */
    wxSearchKeyTap:function(e){
        var that = this;
        WxSearch.wxSearchKeyTap(e,that);
    },

    /**
     * 删除记录按钮
     * @param e
     */
    wxSearchDeleteKey: function(e){
        var that = this;
        WxSearch.wxSearchDeleteKey(e,that);
    },

    /**
     * 删除所有搜索历史记录
     * @param e
     */
    wxSearchDeleteAll: function(e){
        var that = this;
        WxSearch.wxSearchDeleteAll(that);
    },

    /**
     * 隐藏seachPancel
     * @param e
     */
    wxSearchTap: function(e){
        var that = this;
        // WxSearch.wxSearchHiddenPancel(that);
    },

    /** ------------------------------------------------------------------- */

    /**
     * 下拉刷新
     */
    onPullDownRefresh:function() {
        wx.showNavigationBarLoading(); //在标题栏中显示加载
        this.loadIndex();//重载后台主页数据
    },

    /**
     * 关于我们
     */
    aboutUs: function(){
       /* wx.chooseAddress({
            success: function (res) {
                console.log(res.userName);
                console.log(res.postalCode);
                console.log(res.provinceName);
                console.log(res.cityName);
                console.log(res.countyName);
                console.log(res.detailInfo);
                console.log(res.nationalCode);
                console.log(res.telNumber);
            }
        }) ;*/
        wx.navigateTo({
            url: '../personal/about/about'
        });
    },

    /**
     * 申请入驻
     */
    approval: function(){
        wx.navigateTo({
            url: '../shop/settled/settled'
        });
    },

    /**
     * 联系我们
     */
    contactUs: function(){
        wx.navigateTo({
            url: '../personal/contactus/contactus'
        });
    },



});

