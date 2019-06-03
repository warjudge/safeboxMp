// page/API/pages/my/my.js
var app = getApp();
var promise = require('../../../../util/promisify.js');
var getUserInfo = promise(wx.getUserInfo);
Page({

    /**
     * 页面的初始数据
     */
    data: {
        recordData: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.globalData.isBack = false;
        let that = this;
        app.sendGetRequest(options.recordPath, {}).then(res => {
            console.log(res);
            if (res.message === 'success') {
                res.data.beans.forEach(item=> {
                   item.payTime = app.timeStamp2formDta(item.payTime);
                });
                that.setData({
                    recordData : res.data,
                });
                app.globalData.backPath = res.data.goBackPath;
            }
        }).catch(err => {

        })
    },
    onUnload: function() {
        app.globalData.isBack = true;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})