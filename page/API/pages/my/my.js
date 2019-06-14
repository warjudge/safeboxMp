// page/API/pages/my/my.js
var app = getApp();
var promise = require('../../../../util/promisify.js');
var getUserInfo = promise(wx.getUserInfo);
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mineData: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.globalData.isBack = false;
        let that = this;
        if (options.goBackPath) {
            app.sendGetRequest(options.goBackPath, {}).then(res => {
                console.log(res);
                if (res.message === 'success') {
                    if (res.data.count > 99) {
                        res.data.count = 99
                    }
                    res.data.endTime = res.data.endTime===0?'已停用':app.timeStamp2formDta(res.data.endTime);
                    that.setData({
                        mineData: res.data
                    })
                    app.globalData.firstPath = this.data.mineData.firstPath;
                    app.globalData.thirdPath = this.data.mineData.thirdPath;
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
                console.log(err)
            })
        }else {
            app.sendGetRequest(app.globalData.transData.thirdPath, {}).then(res => {
                console.log(res);
                if (res.message === 'success') {
                    if (res.data.count > 99) {
                        res.data.count = 99
                    }
                    res.data.endTime = res.data.endTime===0?'已停用':app.timeStamp2formDta(res.data.endTime);
                    that.setData({
                        mineData: res.data
                    })
                    app.globalData.firstPath = this.data.mineData.firstPath;
                    app.globalData.thirdPath = this.data.mineData.thirdPath;
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
                console.log(err)
            })
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    goToLongTime() {
        let that = this;
        wx.navigateTo({
            url: `../long-time/long-time?paymentPath=${that.data.mineData.paymentPath}&userType=${that.data.mineData.userType}`,
        })
    },
    goToMyInfoPerson() {
        let that = this;
        wx.navigateTo({
            url: `../my-info-person/my-info-person?informationPath=${that.data.mineData.informationPath}&userType=${that.data.mineData.userType}`,
        })
    },
    goToMessage() {
        let that = this;
        wx.navigateTo({
            url: `../message/message?toMessagePath=${that.data.mineData.toMessagePath}&userType=${that.data.mineData.userType}`,
        })
    },
    goToMySonPerson() {
        let that = this;
        wx.navigateTo({
            url: `../my-son-person/my-son-person?subAccountPath=${that.data.mineData.subAccountPath}`,
        })
    },
    loginOut() {
        let that = this;
        // wx.redirectTo({
        //     url: `../relogin/relogin`
        // })
        // return;
        app.sendGetRequest(that.data.mineData.loginOutPath, {}).then(res => {
            console.log(res);
            if (res.message === 'success') {
                wx.redirectTo({
                    url: `../relogin/relogin?loginPath=${res.data.loginPath}&sendPath=${res.data.sendPath}&codeInPath=${res.data.codeInPath}&reloginPath=${res.data.reLoginPath}&from=1`
                })
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
            console.log(err);
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this;
        if (app.globalData.isBack) {
            app.sendGetRequest(app.globalData.actionPath,{
                action:'my'
            }).then(res => {
                console.log(res);
                if (res.message === 'success') {
                    if (res.data.count > 99) {
                        res.data.count = 99
                    }
                    res.data.endTime = res.data.endTime===0?'已停用':app.timeStamp2formDta(res.data.endTime);
                    that.setData({
                        mineData: res.data
                    })
                    app.globalData.isBack = false;
                    app.globalData.firstPath = this.data.mineData.firstPath;
                    app.globalData.thirdPath = this.data.mineData.thirdPath;
                    app.globalData.backPath = '';
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
            }).catch(err=> {

            })
        }
        // if (app.globalData.isBack&& app.globalData.backPath) {
        //     app.sendGetRequest(app.globalData.backPath,{}).then(res => {
        //         console.log(res);
        //         if (res.message === 'success') {
        //             if (res.data.count > 99) {
        //                 res.data.count = 99
        //             }
        //             res.data.endTime = app.timeStamp2formDta(res.data.endTime);
        //             that.setData({
        //                 mineData: res.data
        //             })
        //             app.globalData.isBack = false;
        //             app.globalData.firstPath = this.data.mineData.firstPath;
        //             app.globalData.thirdPath = this.data.mineData.thirdPath;
        //             app.globalData.backPath = '';
        //         }else {
        //             wx.showModal({
        //                 title: '错误',
        //                 content: `${res.message}`,
        //                 showCancel: false,
        //                 confirmText: '确定',
        //                 success: function(res) {
        //                 }
        //             });
        //         }
        //     }).catch(err=> {
        //
        //     })
        // }else if (app.globalData.thirdPath){
        //     console.log('没刷新')
        //     app.sendGetRequest(app.globalData.thirdPath,{}).then(res => {
        //         console.log(res);
        //         if (res.message === 'success') {
        //             if (res.data.count > 99) {
        //                 res.data.count = 99
        //             }
        //             res.data.endTime = app.timeStamp2formDta(res.data.endTime);
        //             that.setData({
        //                 mineData: res.data
        //             })
        //             app.globalData.isBack = false;
        //             app.globalData.firstPath = this.data.mineData.firstPath;
        //             app.globalData.thirdPath = this.data.mineData.thirdPath;
        //             app.globalData.backPath = '';
        //         }else {
        //             wx.showModal({
        //                 title: '错误',
        //                 content: `${res.message}`,
        //                 showCancel: false,
        //                 confirmText: '确定',
        //                 success: function(res) {
        //                 }
        //             });
        //         }
        //     }).catch(err=> {
        //
        //     })
        // }
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