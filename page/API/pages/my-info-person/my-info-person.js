// page/API/pages/my/my.js
var app = getApp();
var promise = require('../../../../util/promisify.js');
var getUserInfo = promise(wx.getUserInfo);
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userType: '',
        infoData: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.globalData.isBack = false;
        let that = this;
        console.log(options)
        this.setData({
            userType: options.userType
        });
        app.sendGetRequest(options.informationPath, {}).then(res => {
            console.log(res);
            if (res.message === 'success') {
                that.setData({
                    infoData: res.data
                })
                app.globalData.backPath = res.data.goBackPath;
            }
        }).catch(err => {

        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    goToChangePhone() {
        let that = this;
        wx.navigateTo({
            url: `../change-phone/change-phone?finishPath=${that.data.infoData.finishPath}&forCodePath=${that.data.infoData.forCodePath}&oldPhone=${that.data.infoData.phoneNumber}&finishConfirmPath=${that.data.infoData.finishConfirmPath}&forCodeConfirmPath=${that.data.infoData.forCodeConfirmPath}`,
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // app.sendGetRequest({
        //     action: "getUserInfo"
        // }).then(res => {
        //     if (res.serviceCall) {
        //         let temp = app.getCallData(res);
        //         this.setData({
        //             mineData: temp
        //         })
        //     }
        // }).catch(err => {
        //     console.log(err)
        // })
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