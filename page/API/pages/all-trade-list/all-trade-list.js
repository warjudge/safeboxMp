// page/API/pages/trade-list/trade-list.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        path: '',
        type: '1',
        todayLendCount: '',
        timeOutLendCount: '',
        allLendCount: '',
        settleLendCount: '',
        tradeList: [],
        amountPath: '',
        overduePath: '',
        soldPath: '',
        todayPath: '',
        statePath: '',
        array: ['全部', '待借出', '借出中', '已完成', '已关闭'],
        index: 0,
        goBackMiniPath:'',
        showError: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.globalData.isBack = false;
        if (options.allLendPath) {
            this.data.path = options.allLendPath;
        }else if (options.todayLendPath) {
            this.data.path = options.todayLendPath;
        }else if (options.timeOutLendPath) {
            this.data.path = options.timeOutLendPath;
        }else if (options.settleLendPath) {
            this.data.path = options.settleLendPath;
        }
        this.setData({
            type: options.type,
            todayLendCount: options.todayLendCount,
            timeOutLendCount: options.timeOutLendCount,
            allLendCount: options.allLendCount,
            settleLendCount: options.settleLendCount
        });
        this.initData();
    },
    initData() {
        app.sendGetRequest(this.data.path,{}).then(res => {
            console.log(res);
            if (res.message === 'success') {
                this.setData({
                    amountPath: res.data.amountPath,
                    overduePath: res.data.overduePath,
                    soldPath: res.data.soldPath,
                    todayPath: res.data.todayPath,
                    statePath: res.data.statePath,
                    todayLendCount: res.data.today,
                    timeOutLendCount: res.data.overdue,
                    allLendCount: res.data.amount,
                    settleLendCount: res.data.sold,
                    goBackMiniPath: res.data.goBackMiniPath
                });
                app.globalData.backPath = res.data.goBackMiniPath;
                if (res.data.orderList) {
                    res.data.orderList.forEach(item => {
                        item.createTime = app.timeStamp2formDta(item.createTime)
                    });
                    this.setData({
                        tradeList: res.data.orderList
                    })
                }else {
                    this.setData({
                        tradeList: []
                    })
                    wx.showModal({
                        title: '提示',
                        content: '没有此类订单!!!',
                        showCancel: false,
                        confirmText: '确定',
                        success: function(res) {
                        }
                    });
                }
            }
        }).catch(err => {
            console.log(err);
        })
    },
    goToDetail(e) {
        console.log(e.currentTarget.dataset.checkPath);
        wx.navigateTo({
            url: '../all-trade-list-detail/all-trade-list-detail?checkPath=' + e.currentTarget.dataset.checkPath,
        })
    },
    onShow: function() {
        if(app.globalData.isBack) {
            app.sendGetRequest(app.globalData.backPath, {}).then(res => {
                console.log(res)
                if (res.message === 'success') {
                    this.data.path = res.data.amountPath;
                    this.setData({
                        todayLendCount: res.data.today,
                        timeOutLendCount: res.data.overdue,
                        allLendCount: res.data.amount,
                        settleLendCount: res.data.sold,
                        type: '1',
                    });
                    this.initData();
                }
            }).catch(err => {
                console.log(err)
                this.setData({
                    showError: true
                })
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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

    },
    changeTap (e) {
        let that = this;
        console.log(e.currentTarget.dataset.number);
        that.setData({
            type: e.currentTarget.dataset.number
        });
        let path = '';
        if (that.data.type === '1') {
            path = that.data.amountPath;
        }else if (that.data.type === '2') {
            path = that.data.todayPath;
        }else if (that.data.type === '3') {
            path = that.data.overduePath;
        }else if (that.data.type === '4') {
            path = that.data.soldPath;
        }
        app.sendGetRequest(path,{}).then(res => {
            console.log(res);
            if (res.message === 'success') {
                that.setData({
                    amountPath: res.data.amountPath,
                    overduePath: res.data.overduePath,
                    soldPath: res.data.soldPath,
                    todayPath: res.data.todayPath,
                    statePath: res.data.statePath,
                    goBackMiniPath: res.data.goBackMiniPath
                });
                app.globalData.backPath = res.data.goBackMiniPath;
                if (res.data.orderList) {
                    res.data.orderList.forEach(item => {
                        item.createTime = app.timeStamp2formDta(item.createTime)
                    });
                    that.setData({
                        tradeList: res.data.orderList
                    })
                }else {
                    that.setData({
                        tradeList: []
                    });
                    wx.showModal({
                        title: '提示',
                        content: '没有此类订单!!!',
                        showCancel: false,
                        confirmText: '确定',
                        success: function(res) {
                        }
                    });
                }
            }
        }).catch(err => {
            console.log(err);
            this.setData({
                showError: true
            })
        })
    },
    bindPickerChange: function (e) {
        let that = this;
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            index: e.detail.value
        })
        app.sendGetRequest(that.data.statePath, {
            state: that.data.array[that.data.index] === '全部'? '': that.data.array[that.data.index]
        }).then( res => {
            console.log(res);
            if (res.message === 'success') {
                that.setData({
                    amountPath: res.data.amountPath,
                    overduePath: res.data.overduePath,
                    soldPath: res.data.soldPath,
                    todayPath: res.data.todayPath,
                    statePath: res.data.statePath,
                    goBackMiniPath: res.data.goBackMiniPath
                });
                app.globalData.backPath = res.data.goBackMiniPath;
                if (res.data.orderList) {
                    that.setData({
                        tradeList: res.data.orderList
                    })
                }else {
                    that.setData({
                        tradeList: []
                    });
                    wx.showModal({
                        title: '提示',
                        content: '没有此类订单!!!',
                        showCancel: false,
                        confirmText: '确定',
                        success: function(res) {
                            // if (res.confirm) {
                            //     console.log('用户点击了“返回授权”');
                            // }
                        }
                    });
                }
            }
        }).catch( err => {
            this.setData({
                showError: true
            })
        })
    },
    onUnload () {
        let that = this;
        app.globalData.isBack = true;
        // wx.switchTab({
        //     url: `../home/home?goBackMiniPath=${that.data.goBackMiniPath}`
        // })
    }
})
