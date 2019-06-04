var app = getApp();
var promise = require('../../../../util/promisify.js');
var getUserInfo = promise(wx.getUserInfo);
Page({

    /**
     * 页面的初始数据
     */
    data: {
        insertSubPath: '',
        lists: [],
        step: 'first',
        roleName: '',
        erCodeUrl:'',
        pname: '',
        pcompany: '',
        isShowShare: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.globalData.isBack = false;
        let that = this;
        console.log(options);
        if (options.subAccountPath) {
            app.sendGetRequest(options.subAccountPath, {}).then(res => {
                console.log(res);
                if (res.message === 'success') {
                    that.data.insertSubPath = res.data.insertSubPath;
                    if (res.data.lists) {
                        that.setData({
                            lists: res.data.lists
                        });
                    }else {
                        that.setData({
                            lists: []
                        });
                    }
                    app.globalData.backPath = res.data.goBackPath;
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
        }else if (options.fromShare === 'true') {
            that.setData({
                erCodeUrl: options.erCodeUrl,
                pname: options.pname,
                pcompany: options.pcompany,
                step: 'finish',
                isShowShare: true
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    showDel(e) {
        console.log(e);
        this.data.lists[e.currentTarget.dataset.index].showDel = !this.data.lists[e.currentTarget.dataset.index].showDel;
        this.setData({
            lists: this.data.lists
        })
    },
    delMySon(e) {
        let that = this;
        app.sendGetRequest(e.currentTarget.dataset.path, {}).then(res => {
            console.log(res)
            if (res.message === 'success') {
                that.data.insertSubPath = res.data.insertSubPath;
                app.globalData.backPath = res.data.goBackPath;
                if (res.data.lists) {
                    that.setData({
                        lists: res.data.lists
                    });
                }else {
                    that.setData({
                        lists: []
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
            console.log(err)
        })
    },
    operateMySon(e) {
        let that = this;
        let path = '';
        let flag = 1;
        if (that.data.lists[e.currentTarget.dataset.index].status === '已停用') {
            path = that.data.lists[e.currentTarget.dataset.index].startPath;
        }else if (that.data.lists[e.currentTarget.dataset.index].status === '启用') {
            path = that.data.lists[e.currentTarget.dataset.index].stopPath;
        }else if (that.data.lists[e.currentTarget.dataset.index].status === '未激活') {
            path = that.data.lists[e.currentTarget.dataset.index].invitePath;
            flag = 2;
        }

        if (flag === 1) {
            app.sendGetRequest(path, {}).then(res => {
                console.log(res)
                if (res.message === 'success') {
                    that.data.insertSubPath = res.data.insertSubPath;
                    app.globalData.backPath = res.data.goBackPath;
                    if (res.data.lists) {
                        that.setData({
                            lists: res.data.lists
                        });
                    }else {
                        that.setData({
                            lists: []
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
                console.log(err)
            })
        }else {
            app.sendGetRequest(path, {}).then(res => {
                console.log(res)
                if (res.message === 'success') {
                    // wx.navigateTo({
                    //     url: '',
                    // })
                    that.setData({
                        step: 'finish',
                        pname: res.data.pname,
                        pcompany: res.data.pcompany,
                        erCodeUrl: res.data.erCodeUrl
                    });
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
    toSecond() {
        console.log(1);
        this.setData({
            step: 'second'
        })
    },
    checkboxChange(e) {
        console.log(e)
    },
    setRoleName(e) {
        console.log(e);
        this.setData({
            roleName: e.detail.value
        })
    },
    getNewerId() {
        let that = this;
        wx.showLoading({
            title: `新建中`,
            mask: true
        });
        app.sendGetRequest(that.data.insertSubPath, {
            simpleName: that.data.roleName
        }).then(res => {
            console.log(res)
            if (res.message === 'success') {
                that.setData({
                    erCodeUrl: res.data.erCodeUrl,
                    pname: res.data.pname,
                    pcompany: res.data.pcompany,
                    step: 'finish'
                })
                wx.hideLoading();
                // that.createCode();
            }else {
                wx.hideLoading();
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
    onShareAppMessage: function(res) {
        let  that = this;
        console.log(res);
        if (res.from === 'button') {
            return {
                title: '快速借货',
                path: `/page/API/pages/my-son-person/my-son-person?fromShare=true&erCodeUrl=${that.data.erCodeUrl}&pname=${that.data.pname}&pcompany=${that.data.pcompany}`,
                imageUrl: that.data.erCodeUrl,
                success: function(res){
                    // 转发成功之后的回调
                    if(res.errMsg == 'shareAppMessage:ok'){
                        console.log(11111)
                    }
                },
                fail: function(){
                    // 转发失败之后的回调
                    if(res.errMsg == 'shareAppMessage:fail cancel'){
                        // 用户取消转发
                    }else if(res.errMsg == 'shareAppMessage:fail'){
                        // 转发失败，其中 detail message 为详细失败信息
                    }
                },
                complete: function(){
                    // 转发结束之后的回调（转发成不成功都会执行）
                }
            }
        }
    }
})