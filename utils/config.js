/**
 * Author: Yue
 * Date: 2018/4/2-22:30
 * Description:
 *  配置文件
 */
const config = {

    requestPrefixUrl: "http://localhost",
    /** 发布路径 */
    // requestPrefixUrl: "https://wx.criclesh.shop",

    port: ":8899/wx",
    // port: "/wx",

    /** 图片服务器路径前缀 */
    picPrefixUrl: "http://pic.criclesh.shop",
    /** 登录 */
    login: ":8899/wlog/in",
    // login: "/wlog/in",

    /** header Content-Type */
    CT_form:"application/x-www-form-urlencoded",
    CT_json:"application/json",

    //--------index---------
    /** 加载首页初始数据 */
    indexload: "/index/load",
    hotsmore: "/index/morehots",
    newsmore: "/index/morenews",
    shopmore: "/index/moreshops",

    //-------behavior-------
    /** 增加/取消--->收藏/浏览量 */
    addBehavior: "/behavior/add",
    cancelBehavior: "/behavior/cancel",
    /** 进入正在购买状态 */
    toBuying: "/behavior/toBuying",
    /** 立即购买 */
    immBuy: "/behavior/immbuy",
    /** 已购买状态 */
    toBought: "/behavior/tobought",
    //---------shop---------
    shopindex: "/sh/querysh",
    queryLikedShop: "/sh/queryliked",

    //-------evaluation-----
    loadEval: "/evaluate/querybycomm",

    //--------search---------
    /** 搜索接口 */
    combineSearch:"/srch/combine",
    shopSearch: "/srch/searchComms",
    commSearch: "/srch/searchSh",

    //---------cart----------
    /** 加入购物车 */
    addCart: "/cart/addtoc", 
    /** 加载购物车数据 */
    loadCart: "/cart/loadcomms", 
    /** 删除购物车物品 */
    deleteCartCommodity: "/cart/rmcomm",
    /** 修改(更新)购物车多个商品 */
    updateCart: "/cart/updateCart",
    /** 减1 */
    reduceOne: "/cart/reduce",
    //-------Evaluation-------
    /** 评价 */
    addEvaluation: "/evaluate/addevalutocomm",
    queryEvaluationByOwns: "/evaluate/querybyowner",
    rmEvaluation: "/evaluate/deleEvalu",
    //-------commodity--------
    /** 加载收藏商品 */
    queryLikedComm: "/comm/queryliked",
    /** 加载商品数据 */
    loadCommodity: "/comm/queryComm",
    /** 喜欢当前商品 */
    likeCommodity: "/comm/likeIt",
    /** 商品加入购物车 */
    addToCart: "/comm/addToCart",
    queryByShop: "/comm/queryComms",

    /** 加载正在购买状态的订单数据List */
    getBuyList: "/comm/queryList",
    /** 取消购买订单 */
    cacelBuying: "/comm/cancelBuying",
    /** 加载正在购买的订单数据detail */
    getBuying: "/comm/queryBuying",
    //----------address-------
    setDefault:"/addrs/setDefault",
    addAddress: "/addrs/new",
    editAddress: "/addrs/edit",
    deleteAddress: "/addrs/delteAddress",
    queryOne: "/addrs/query",
    queryAddress: "/addrs/queryAll",
    queryDefault: "/addrs/loadDefault"

    //----------pay-----------

};
module.exports = config;