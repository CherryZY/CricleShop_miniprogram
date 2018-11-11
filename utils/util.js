/**
 * Author: Yue
 * Date: 2018/4/2-22:30
 * Description:
 *  工具Utils文件
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n
};

/**
 * 从storage中取token
 */
const getToken = (token)=>{
    //从storage中取sessionId
    wx.getStorage({
        key: 'token',
        success: res => {
            token = res.data;
            console.log("index-onLoad()从storage获得token:"+token+";at "+Date.now());
        },
        fail: res=>{
            console.log("从storage获得token失败");
        }
    });
    // return token;
};

module.exports = {
  getToken: getToken,
  formatTime: formatTime
};
