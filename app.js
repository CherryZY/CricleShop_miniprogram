
//导入全局配置
const config = require('utils/config.js');
const URL_PREFIX = config.requestPrefixUrl;//请求url
const PORT = config.port;//请求端口

//app.js
App({

    /** 用户信息 */
    userInfo: {},
    /** 判断用户是否授权个人信息：默认false("是") */
    isDefaultData: false,

    /**
    * 当小程序初始化“完成”时，会触发 onLaunch（全局只触发一次）
    */
    onLaunch: function () {
    },

    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow: function (options) {
      console.log("从后台进入前台..  onShow");
      //-------------------------------
      //此处应该重新获取一次数据(推荐系统)
      //-------------------------------
    },

    /**
     * 当小程序从前台进入后台，会触发 onHide
     */
    onHide: function () {
      console.log("小程序已进入后台");
    },

    /**
     * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
     */
    onError: function (msg) {
    }

});
