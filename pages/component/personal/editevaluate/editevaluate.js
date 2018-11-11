/**
 * Author: Yue
 * Date: 2018/5/11-15:04
 * Description:
 */
const config = require('../../../../utils/config.js');
const URL_PREFIX = config.requestPrefixUrl;//请求url
const CT_JSON = config.CT_json;
const PORT = config.port;//请求端口
const ADD_EVALU = config.addEvaluation;//新增评论

Page({

    data:{
        loading_all: true,
        objId: 0,
        orderId: 0,
        starLevel:0,
    },

    /**
     * 编辑星级
     * @param e
     */
    recordStar: function(e){
        console.log(e);
        let in_xin = e.currentTarget.dataset.in;
        let one_2;
        if (in_xin === 'full'){
            one_2 = Number(e.currentTarget.id);
        } else {
            one_2 = Number(e.currentTarget.id) + this.data.starLevel;
        }
        this.setData({
            starLevel: one_2
        })
    },

    /**
     * 新增评论
     */
    submitEvaluation: function(data){
        console.log(data);
        let title = data.detail.value.title;
        let content = data.detail.value.content;
        let evaluationInfo = {};
        evaluationInfo.title = title;
        evaluationInfo.content = content;
        evaluationInfo.type = 0;//商品评论
        evaluationInfo.orderId = this.data.orderId;
        evaluationInfo.objId = this.data.objId;
        evaluationInfo.starCount = this.data.starLevel;
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let that = this;
        let dt = JSON.stringify(evaluationInfo);
        wx.request({
            url: URL_PREFIX + PORT + ADD_EVALU,
            method: "POST",
            header: {
                "token": token,
                "content-type": CT_JSON
            },
            data: dt,
            success: res => {
                console.log(res.data);
                if(res.data.result == 200){
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
                  duration: 1500,
                  icon: "none"
                });
                console.log(f);
            }
        });
    },

    /**
     * 加载阶段
     * @param data
     */
    onLoad: function(data){
        console.log(data);
        let objId = parseInt(data.objId);
        let orderId = parseInt(data.orderId);
        let type = data.type;
        this.setData({
            objId: objId,
            orderId: orderId
        });
    },

    onShow: function(){}

});
