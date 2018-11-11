
var app = getApp();
const config = require('../../../../utils/config.js');
const URL_PREFIX = config.requestPrefixUrl;//请求url
const PORT = config.port;//请求端口
const ADD_ADDRESS = config.addAddress;//新增地址
const EDIT_ADDRESS = config.editAddress;//修改地址
const QUERY_ONE = config.queryOne;//查询

let area = require('../../../../utils/area.js');
let areaInfo = [];//所有省市区县数据
let provinces = [];//省
let citys = [];//城市
let countys = [];//区县

let index = [0, 0, 0];
let t = 0;
let show = false;
let moveY = 200;

let CT_JSON = config.CT_json;
let CT_FORM = config.CT_form;

Page({

    data: {
        aid: 0,
        /** 加载中... */
        loading_all: true,

        isModify : false,
        show: show,
        provinces: provinces,
        citys: citys,
        countys: countys,

        value: [0, 0, 0],

        /** 地址信息 */
        province: "",
        city: "",
        county: "",
        consignee_name: "",
        phone_num: "",
        detail_location: ""
    },

    /**
     * 提交表单数据：判断是修改/新增
     */
    submitConsignee: function (e) {
        var addressData = {};
        addressData.id = this.data.aid;
        addressData.province = this.data.province;
        addressData.county = this.data.county;
        addressData.city = this.data.city;
        addressData.consigneeName = e.detail.value.consignee_name;
        addressData.phoneNum = e.detail.value.phone_number;
        addressData.detailLocation = e.detail.value.detail_location;
        addressData.isDefault = 0;
        addressData.type = 0;
        //进行前端校验
        if(addressData == {} || addressData.consignee_name == "" ||
            addressData.phoneNum == "" || addressData.detailLocation == ""
        ){
            wx.showToast({
                title: '字段不能为空',
                icon: "none",
                duration: 1500
            });
            return;
        }
        //名字特殊字符
        if(! /^[\u4E00-\u9FA5A-Za-z]+$/.test(addressData.consigneeName)){
            //显示toast
            wx.showToast({
                title:'收货人姓名不规范',
                icon: "none",
                duration: 1500
            });
            return;
        }
        //手机号校验
        if(addressData.phoneNum.length != 11 ||
            ! /^[1][3,4,5,7,8][0-9]{9}$/.test(addressData.phoneNum)){
            //显示toast
            wx.showToast({
                title:'手机号不规范',
                icon: "none",
                duration: 1500
            });
            return;
        }
        //将新增加的地址存至后台
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        //判断是修改还是新增
        let reqType = this.data.isModify == true?EDIT_ADDRESS:ADD_ADDRESS;
        //从storage取出addressData数组
        /* wx.getStorage({
            key: 'transAddress',
            success: res => {
                console.log("getStorage success from newaddress.js");
                //未考虑res.data不是数组
                addressDatas = res.data;
                addressDatas.push(addressData);
                //存入当前内存
                wx.setStorage({
                    key:"transAddress",
                    data: addressDatas
                });
                //跳转至地址管理页面
                wx.navigateBack({
                    delta:1
                });
            },
            fail: res=>{
                //获取失败就新建并重新存入storage
                console.log("getStorage failed from newaddress.js");
                let addresses = [];
                addresses.push(addressData);
                wx.setStorage({
                    key:"transAddress",
                    data:addresses
                });
                //跳转至地址管理页面
                wx.navigateBack({
                    delta:1
                });
            }
        });*/
        let a = JSON.stringify(addressData);
        wx.request({
            url: URL_PREFIX + PORT + reqType,
            method: "POST",
            header: {
                "token": token,
                "content-type": CT_JSON
            },
            data: a,
            success: function (res) {
                console.log(res);
                if(res.data.result == 200){
                    console.log("保存地址信息成功");
                    wx.redirectTo({
                      url: '../addressmana/addressmana'
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
            fail: function (res) {
                console.log("保存地址信息失败");
                console.log(res);
                wx.showToast({
                    title: '添加地址失败，请重试',
                    icon: 'none',
                    duration: 2000
                })
            }
        });

    },

    /**
     * 滑动事件
     * @param e
     */
    bindChange: function (e) {
        var val = e.detail.value
        //判断滑动的是第几个column
        //若省份column做了滑动则定位到地级市和区县第一位
        if (index[0] != val[0]) {
            val[1] = 0;
            val[2] = 0;
            getCityArr(val[0], this);//获取地级市数据
            getCountyInfo(val[0], val[1], this);//获取区县数据
        } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
            if (index[1] != val[1]) {
                val[2] = 0;
                getCountyInfo(val[0], val[1], this);//获取区县数据
            }
        }
        index = val;
        console.log(index + " => " + val);
        //更新数据
        this.setData({
            value: [val[0], val[1], val[2]],
            province: provinces[val[0]].name,
            city: citys[val[1]].name,
            county: countys[val[2]].name
        })
    },

    /**
     * 加载页面
     * @param options
     */
    onLoad: function (options) {
        console.log(options);
        let token = wx.getStorageSync('token');
        if(token == null){token = "";}
        let that = this;
        let id = parseInt(options.id);
        that.setData({
            aid:id
        });
        /** 判!=空 */
        if(options.id != null && options.id !=''){
            //用标识符进行标识，表示是修改而不是新增
            wx.request({
                url: URL_PREFIX + PORT + QUERY_ONE,
                method: "POST",
                header: {
                    "token": token,
                    "content-type": CT_FORM
                },
                data: {
                    id: id
                },
                success: res=>{
                    console.log(res.data);
                    if(res.data.result == 200){
                        let bd = res.data.backData;
                        that.setData({
                            isModify: true,
                            loading_all: false,
                            province: bd.province,
                            county: bd.county,
                            city: bd.city,
                            consignee_name: bd.consigneeName,
                            phone_num: bd.phoneNum,
                            detail_location: bd.detailLocation
                        });
                    }else{
                        wx.showToast({
                            title: '服务器错误',
                            duration: 1500,
                            icon: "none"
                        })
                    }
                },
                fail: res=>{
                    console.log(res);
                }
            });
        }else{
            that.setData({
                loading_all: false,
                province: "北京市",
                city: "市辖区",
                county: "东城区",
            })
        }
        //获取省市区县数据
        area.getAreaInfo(function (arr) {
            areaInfo = arr;
            //获取省份数据
            getProvinceData(that);
        });
    },

    /**
     * 渲染界面
     */
    onReady: function () {
        this.animation = wx.createAnimation({
                transformOrigin: "50% 50%",
                duration: 0,
                timingFunction: "ease",
                delay: 0
            }
        );
        this.animation.translateY(200 + 'vh').step();
        this.setData({
            animation: this.animation.export(),
            show: show
        })
    },

    /**
     * 移动按钮点击事件
     * @param e
     */
    translate: function (e) {
        if (t == 0) {
            moveY = 0;
            show = false;
            t = 1;
        } else {
            moveY = 200;
            show = true;
            t = 0;
        }
        // this.animation.translate(arr[0], arr[1]).step();
        animationEvents(this,moveY, show);

    },

    /**
     * 隐藏弹窗浮层
     * @param e
     */
    hiddenFloatView(e){
        console.log(e);
        moveY = 200;
        show = true;
        t = 0;
        animationEvents(this,moveY, show);
    },

});

//--------------------------------------------

//动画事件
function animationEvents(that,moveY,show){
    console.log("moveY:" + moveY + "\nshow:" + show);
    that.animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 400,
            timingFunction: "ease",
            delay: 0
        }
    );
    that.animation.translateY(moveY + 'vh').step();
    that.setData({
        animation: that.animation.export(),
        show: show
    });
}

//获取省份数据
function getProvinceData(that) {
    var s;
    provinces = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
        s = areaInfo[i];
        if (s.di == "00" && s.xian == "00") {
            provinces[num] = s;
            num++;
        }
    }
    that.setData({
        provinces: provinces
    });

    //初始化调一次
    getCityArr(0, that);
    getCountyInfo(0, 0, that);
}

// 获取地级市数据
function getCityArr(count, that) {
    var c;
    citys = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
        c = areaInfo[i];
        if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
            citys[num] = c;
            num++;
        }
    }
    if (citys.length == 0) {
        citys[0] = { name: '' };
    }

    that.setData({
        citys: citys,
        value: [count, 0, 0]
    })
}

// 获取区县数据
function getCountyInfo(column0, column1, that) {
    var c;
    countys = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
        c = areaInfo[i];
        if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
            countys[num] = c;
            num++;
        }
    }
    if(countys.length == 0){
        countys[0] = {name:''};
    }
    that.setData({
        countys: countys,
        value: [column0, column1, 0]
    })
}

