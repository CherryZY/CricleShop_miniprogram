/** 商品评价js */

var app = getApp();
const util = require("../../../../utils/util.js");
const config = require("../../../../utils/config.js");
const requestPrefixUrl = config.requestPrefixUrl;
const picPrefixUrl = config.picPrefixUrl;
const PORT = config.port;
const evaluationLoad = config.loadEval;
const ct_form = config.CT_form;

Page({

    data:{
        picPrefixUrl:"",
        /** 加载中... */
        loading_all: true,
        /** 评价集合 */
        evaluationInfos: [],
        /** 评论总个数 */
        sumLength:0
    },

    /**
     * 加载
     * @param e
     */
    onLoad: function(e){
        this.setData({
            picPrefixUrl: picPrefixUrl
        });
        let that = this;
        //在这儿get商品的id
        let id = parseInt(e.id);
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        wx.request({
            url: requestPrefixUrl + PORT + evaluationLoad,
            method: "POST",
            header:{
                "content-type":ct_form,
                "token": token
            },
            data:{
                cid: id
            },
            success: res=>{
                console.log(res);
                if(res.data.result == 200){
                    let sum = res.data.backData.length;
                    let data = res.data;
                    for(let t=0 ; t< data.backData.length; t++){
                        data.backData[t].ctime = new Date(data.backData[t].createTime).toLocaleDateString()
                            + "-" + new Date(data.backData[t].createTime).toLocaleTimeString();
                        data.backData[t].utime = new Date(data.backData[t].updateTime).toLocaleDateString()
                            + "-" + new Date(data.backData[t].updateTime).toLocaleTimeString();
                    }
                    that.setData({
                        evaluationInfos: data.backData,
                        loading_all: false,
                        sumLength:sum
                    });
                }else if(res.data.result == 40010){
                    wx.showToast({
                        title: '没有数据',
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
            fail: res=>{
                wx.showToast({
                  title: '评价获取失败'
                });
                that.setData({
                    loading_all: false
                });
                console.log("评价获取失败");
            }
        });
    },
});