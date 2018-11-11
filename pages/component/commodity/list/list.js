
var app = getApp();
const config = require("../../../../utils/config.js");
const util = require("../../../../utils/util.js");
const URL_PREFIX = config.requestPrefixUrl;
const PORT = config.port;
const MORE_SHOP = config.shopmore;
const MORE_HOTS = config.hotsmore;
const MORE_NEWS = config.newsmore;
const CT_FORM = config.CT_form;
const picPrefixUrl = config.picPrefixUrl; 

Page({

  /**
   * 页面的初始数据
   */
  data: {
      /** 图片前缀 */
      picPrefixUrl: picPrefixUrl,

      page: 1,
      size: 10,

      nodata: false,

      count:0,
      /** 全部loading */
      loading_all: true,
      /** loading显示状态 */
      loading: true,
      /** 当前屏幕高度 */
      screenHeight: 0,
      /** 滚动当前位置 */
      lastPosition: 0,
      /** 回顶部 */
      upicon: "/imgs/uparrow.png",

      showUp: false,
      scrollUpNum: 0,
      /** 显示category图标 */
      blockScheme: true,
      showScheme: "/imgs/list_category.png",
      index: 0,
      icons:["/imgs/list_category.png","/imgs/block_category.png"],
      /** 触发距离 */
      lower_threshold: 50,
      upper_threshold: 100,
      /** 产品 */
      produces:[],
      commdata:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523778828702&di=307c7a7758a2ecaf60c18862570b69ea&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F14%2F93%2F59X58PICcxr_1024.jpg"
  },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      //显示到底说明而已
      console.log("----到底了----");
    },

    /**
     * 店铺详情
     */
    shopDetail: function(e){
        let id = e.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({
            url: "../../shop/index/index?id="+id
        });
    },

    /**
     * 商品详情
     * @param e
     */
    commDetail: function(e){
      let id = e.currentTarget.dataset.id;
      console.log(id);
      wx.navigateTo({
            url: '../detail/detail?id='+id
      })
    },

    /**
     * 监听滚动（包括向下/向上）
     * @param e
     */
    scroll: function (e) {
      //当前位置
      let position = e.detail.scrollTop;
      //向下滚动
      if(position > this.data.lastPosition &&
          position > 100){
          console.log("向下滚动--showUp");
          //up图标显示
          this.setData({
              showUp:true,
              lastPosition: position
          });
      }//向上滚动
      else if(position < this.data.lastPosition &&
               position < 100){
          console.log("向上滚动--showDown");
          this.setData({
              showUp: false,
              lastPosition: position
          });
      }
    },

    /**
     * 返回顶部
     */
    toUp: function(){
      console.log(this.data.scrollUpNum);
      this.setData({
          scrollUpNum : 0
      });
    },

    /**
     * row / block显示
     */
    changeShow: function(){
      this.onShow();
      this.onReady();
      this.toUp();
      //to list show
      if(this.data.index == 0){
          this.setData({
              blockScheme: false,
              showScheme:this.data.icons[1],
              index: 1
          });
      }//变成List显示
      else{
          this.setData({
              blockScheme: true,
              showScheme:this.data.icons[0],
              index: 0
          });
      }
    },

    /**
     * 监听向下滚动
     * @param e
     */
    scrolltolower: function(e){
        console.log("向下滑动");
        /*var a = {"color": "#e55111"};
        var b = {"color": "#f13514"};
        var c = {"color": "#86794e"};
        var d = {"color": "#644"};
        //请求后台进行分页查询
        var p = this.data.produces;
        p.push(a,b,c,d);
        let v = this.data.count;
        if(v<5){
            v++;
            this.setData({
                produces: p,
                count :v
            });
        }else{

        }*/
        //请求后台继续加载后面页面的数据，进行数据拼接
        this.setData({
            loading: false
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            picPrefixUrl: picPrefixUrl
        });
        let requestURL;
        if(options.type == "hotmore"){
            wx.setNavigationBarTitle({
                title: "最热商品列表"
            });
            requestURL = MORE_HOTS;
        }else if(options.type == "newmore"){
            wx.setNavigationBarTitle({
                title: "最新商品列表"
            });
            requestURL = MORE_NEWS;
        }else if(options.type = "shopmore"){
            wx.setNavigationBarTitle({
                title: "店铺列表"
            });
            this.setData({
                blockScheme: false
            });
            requestURL = MORE_SHOP;
        }
        let page = this.data.page;
        let size = this.data.size;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        wx.request({
            url: URL_PREFIX + PORT + requestURL,
            method: "POST",
            header:{
                "content-type": CT_FORM,
                "token" :token
            },
            data:{
                page: page,
                size: size
            },
            success: s=>{
                console.log(s);
                let data = s.data.backData;
                if(s.data.result == 200){
                    this.setData({
                        produces: data,
                        loading_all: false,
                        loading: false
                    });
                }else if(s.data.result == 10001){
                    wx.showToast({
                      title: '请重新登录',
                      duration: 1500,
                      icon: "none"
                    });
                }
            },
            fail: f=>{
                this.setData({
                    nodata: true,
                    loading_all: false,
                    loading: false
                });
            }
        });

        //set SystemInfoSync
        this.setData({
            screenHeight: wx.getSystemInfoSync().windowHeight
        });
        console.log(this.data.screenHeight);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const length = this.data.produces.length;
        //block布局
        if(this.data.blockScheme == true){

        }else{

        }

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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});