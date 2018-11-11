
var app = getApp();
/** 导入请求配置 */
const config = require('../../../../utils/config.js');
const URL_PREFIX = config.requestPrefixUrl;//请求url
const PORT = config.port;//请求端口
const CT_FORM = config.CT_form;
const picPrefixUrl = config.picPrefixUrl;
const QUERY_SH = config.queryLikedShop;
const QUERY_COM = config.queryLikedComm;

Page({

    /**
     * 当前页面私有数据
     */
    data:{

        likedShops:[],
        likedComms:[],

        topIndx:true,

        /** 加载整页 */
        loading_all: true,
        /** 当前用户收藏的物品*/
        collection_stuffs: null,
        /** 无收藏商品商品*/
        no_collection_icon: "/imgs/no_collection_icon.png"
    },

    /**
     * 打开商品详情页
     * @param e
     */
    commDetail: function (e) {
        let id = parseInt(e.currentTarget.dataset.id);
        wx.navigateTo({
            url: '../../commodity/detail/detail?id='+id
        });
    },

    /**
     * 打开店铺详情页
     * @param e
     */
    shopDetail: function (e) {
        let id = parseInt(e.currentTarget.dataset.id);
        wx.navigateTo({
          url: '../../shop/index/index?id='+id
        });
    },

    /**
     * 查询收藏-type
     * @param type
     */
    queryLiked: function(){
        let that = this;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let requestUrl = "";
        if(that.data.topIndx == true){
            requestUrl = QUERY_COM;
        }else{
            requestUrl = QUERY_SH;
        }
        wx.request({
            url: URL_PREFIX + PORT + requestUrl,
            method: "POST",
            header: {
                "content-type":CT_FORM,
                "token":token
            },
            success: res=>{
                console.log(res);
                if(res.data.result == 200){
                    if(that.data.topIndx == true){
                        that.setData({
                            likedComms: res.data.backData
                        });
                    }else{
                        that.setData({
                            likedShops: res.data.backData
                        });
                    }
                }else if(res.data.result == 10001){
                    wx.showToast({
                      title: '请重新登录',
                      icon: "none",
                      duration: 1500
                    });
                }else if(res.data.result == 40010){
                    wx.showToast({
                        title: '无数据',
                        icon: "none",
                        duration: 1000
                    });
                }else{
                    wx.showToast({
                        title: '服务器错误',
                        icon: "none",
                        duration: 1500
                    });
                }
                that.setData({
                    loading_all:false,
                });
            },
            fail: res=>{
                console.log(res);
                wx.showToast({
                  title: '网络错误',
                  icon: "none",
                  duration:1500
                });
            }
        });
    },

    /**
     * 改变顶部标签
     * @param i
     */
    changeTopBar: function(i){
        if(i.currentTarget.dataset.index === "1"){
            this.setData({
                topIndx: true,
                loading_all:true
            });
            this.queryLiked();
        }else if(i.currentTarget.dataset.index === "2"){
            this.setData({
                topIndx:false,
                loading_all: true
            });
            this.queryLiked();
        }
    },

    /**
     * go_collection
     */
    goCollection: function(){
        wx.switchTab({
            url: "/pages/component/index/index"
        });
    },

    /**
     * onShow
     */
    onShow: function(){
        let that = this;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        wx.request({
            url: URL_PREFIX + PORT + QUERY_COM,
            method: "POST",
            header: {
                "content-type":CT_FORM,
                "token":token
            },
            success: res=>{
                console.log(res);
                if(res.data.result == 200){
                    that.setData({
                        loading_all:false,
                        likedComms:res.data.backData
                    });
                }else if(res.data.result == 10001){
                    wx.showToast({
                      title: '请重新登录',
                      icon: "none",
                      duration: 1500
                    });
                    that.setData({
                        loading_all:false,
                    });
                }else if(res.data.result == 40010){
                    wx.showToast({
                        title: '无数据',
                        icon: "none",
                        duration: 1000
                    });
                    that.setData({
                        loading_all:false,
                    });
                }else{
                    wx.showToast({
                        title: '服务器错误',
                        icon: "none",
                        duration: 1500
                    });
                    that.setData({
                        loading_all:false,
                    });
                }
            },
            fail: res=>{
                wx.showToast({
                  title: '网络异常',
                  icon:"none"
                });
                console.log(res);
            }
        });
    },

    /**
     * 加载页面
     */
    onLoad: function(){
        this.setData({
            picPrefixUrl : picPrefixUrl
        });
    },

});