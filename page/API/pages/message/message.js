// page/API/pages/my/my.js
var app = getApp();
var promise = require('../../../../util/promisify.js');
var getUserInfo = promise(wx.getUserInfo);
Page({

    /**
     * 页面的初始数据
     */
    data: {
        messageData: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.globalData.isBack = false;
        let that = this;
        app.sendGetRequest(options.toMessagePath, {}).then(res => {
            console.log(res)
            if (res.message === 'success') {
                app.globalData.backPath = res.data.goBackPath;
                if (res.data.lists) {
                    res.data.lists.forEach(item => {
                        item.createTime = item.createTime?app.timeStamp2formDta(item.createTime).substr(0,10):'';
                    });
                    that.setData({
                        messageData : res.data.lists
                    })
                }else {
                    wx.showModal({
                        title: '提示',
                        content: '暂无数据!!!',
                        showCancel: false,
                        confirmText: '确定',
                        success: function(res) {
                            if (options.fromHome === 'true') {
                                wx.switchTab({
                                    url: `../home/home`
                                })
                            }else {
                                wx.switchTab({
                                    url: `../my/my`
                                })
                            }
                        }
                    });
                }
            }else {
                wx.showModal({
                    title: '错误',
                    content: `${res.message}`,
                    showCancel: false,
                    confirmText: '确定',
                    success: function(res) {
                    }
                });
            }
        }).catch(err => {

        })
    },
    goOld(e) {
        console.log(e);
        let that = this;
        if (e.currentTarget.dataset.beOld) {
            wx.showLoading({
                title: '更新中...',
                mask: true
            });
            app.sendGetRequest(e.currentTarget.dataset.beOld,{}).then(res => {
                console.log(res);
                if (res.message === 'success') {
                    res.data.lists.forEach(item => {
                        item.createTime = item.createTime?app.timeStamp2formDta(item.createTime).substr(0,10):'';
                    });
                    that.setData({
                        messageData : res.data.lists
                    })
                    app.globalData.backPath = res.data.goBackPath;
                    wx.hideLoading();
                }else {
                    wx.showModal({
                        title: '错误',
                        content: `${res.message}`,
                        showCancel: false,
                        confirmText: '确定',
                        success: function(res) {
                        }
                    });
                }
            }).catch(err => {
                wx.showModal({
                    title: '错误',
                    content: '系统报错!!!',
                    showCancel: false,
                    confirmText: '确定',
                    success: function(res) {

                    }
                });
            })
        }
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
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        app.globalData.isBack = true;
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