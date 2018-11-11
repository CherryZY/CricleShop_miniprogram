/**
 * Author: Yue
 * Date: 2018/5/11-15:04
 * Description:
 */
let app = getApp();
const config = require('../../../../utils/config.js');
const URL_PREFIX = config.requestPrefixUrl;//请求url
const CT_FORM = config.CT_form;
const PORT = config.port;//请求端口
const QUERY_OWNS = config.queryEvaluationByOwns;
const REMOVE_EVA = config.rmEvaluation;

Page({

    data:{
        loading_all: true,
        evaluateInfo: []
    },

    /**
     * 删除评论
     * @param data
     */
    deleteEvaluation: function(data){
        console.log(data);
        let id = data.currentTarget.dataset.id;
        let idx = data.currentTarget.dataset.index;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let that = this;
        wx.request({
            url: URL_PREFIX + PORT + REMOVE_EVA,
            method: "POST",
            header: { 
                "token": token,
                "content-type": CT_FORM
            },
            data:{
                eid: id
            },
            success: s=>{
                let data = s.data;
                if(s.data.result == 200){
                    console.log(s);
                    wx.redirectTo({
                        url: '../orders/orders?type=bought'
                    })
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
                } else{
                    wx.showToast({
                        title: '服务器错误',
                        icon: "none",
                        duration:1500
                    });
                }
            },
            fail: f=>{
                wx.showToast({
                    title: '网络错误',
                    icon: "none",
                    duration:1500
                });
            }
        });
    },

    /**
     * 加载阶段
     * @param data
     */
    onLoad: function(data){
        console.log(data);
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let that = this;
        let objId = parseInt(data.objId);
        let orderId = parseInt(data.orderId);
        //表示当前页面类型:详情/编辑
        let type = data.type;
        wx.request({
            url: URL_PREFIX + PORT + QUERY_OWNS,
            method: "POST",
            header: {
                "token": token,
                "content-type": CT_FORM
            },
            data:{
                objId: objId,
                orderId: orderId
            },
            success:res=>{
                console.log(res);
                let data = res.data;
                if(res.data.result == 200){
                    //处理日期
                    for(let t=0 ; t< data.backData.length; t++){
                        data.backData[t].ctime = new Date(data.backData[t].createTime).toLocaleDateString()
                            + "-" + new Date(data.backData[t].createTime).toLocaleTimeString();
                        data.backData[t].utime = new Date(data.backData[t].updateTime).toLocaleDateString()
                            + "-" + new Date(data.backData[t].updateTime).toLocaleTimeString();
                    }
                    that.setData({
                        evaluateInfo: res.data.backData,
                        loading_all: false
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
                } else{
                    wx.showToast({
                        title: '服务器错误',
                        icon: "none",
                        duration:1500
                    });
                }
            },
            fail: f=>{
                wx.showToast({
                    title: '网络错误',
                    icon: "none",
                    duration:1500
                });
            }
        })
    },

    onShow: function(){}
});