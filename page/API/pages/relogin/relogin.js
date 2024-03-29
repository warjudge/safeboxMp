var app = getApp();
const promisify = require('../../../../util/promisify.js')
const login = promisify(wx.login)
const getSystemInfo = promisify(wx.getSystemInfo)
const checkSession = promisify(wx.checkSession)
Page({
    data: {
        optionsPath: null,
        canGetOldCode: false,
        canBindOldPhone: false,
        oldPhone: "",
        oldCodeButton: "获取验证码",
        showError: false,
        submitForPwd: false,
        submitForCode: true,
        hiddenRegister: false
    },
    onLoad(options) {
        app.globalData.isBack = false;
        console.log(options)
        this.setData({
            optionsPath: options
        })
        if (this.data.optionsPath.from) {
            this.setData({
                hiddenRegister: true
            })
        }
    },
    setOldPhone(e) {
        let temp = false
        if (e.detail.value.length == 11) {
            let re = /^1[3|5|7|8][0-9]\d{8}$/;
            temp = re.test(e.detail.value);
        }
        this.setData({
            canGetOldCode: temp,
            oldPhone: e.detail.value
        })
    },
    setOldCode(e) {
        let temp = false;
        if (e.detail.value.length == 6) {
            let re = /\d{6}/;
            temp = re.test(e.detail.value)
        }
        this.setData({
            canBindOldPhone: temp,
        })
    },
    getOldCode(e) {
        console.log(e)
        let that = this;
        let re = /^1[3|5|7|8][0-9]\d{8}$/;
        if (!re.test(this.data.oldPhone)) {
            this.setData({
                canGetOldCode: false
            })
            return
        }

        app.sendGetRequest(that.data.optionsPath.sendPath, {
            phoneNumber: that.data.oldPhone
        }).then(res => {
            console.log(res);
            if (res.message === 'success') {
                // that.setData({
                //     oldVerifyCode: res.data.code
                // })
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
        this.setData({
            canGetOldCode: false
        })
        let count = 61;
        let countDown = () => {
            count = count - 1;
            if (count >= 0) {
                this.setData({
                    canGetOldCode: false,
                    oldCodeButton: count + "秒后重发"
                })
                setTimeout(countDown, 1000)
            } else {
                this.setData({
                    canGetOldCode: true,
                    oldCodeButton: "获取验证码",
                })
            }
        }
        countDown();
    },
    submitForOld(e) {
        console.log(e);
        let that = this;
        app.sendGetRequest(that.data.optionsPath.loginPath, {
            phone: e.detail.value.oldPhone,
            code: e.detail.value.oldCode,
            loginStyle: 2
        }).then(res => {
            console.log(res)
            if (res.message === 'success'&&res.data.status) {
                wx.showModal({
                    title: '错误',
                    content: `${res.data.status}`,
                    showCancel: false,
                    confirmText: '确定',
                    success: function(res1) {
                        if (res.data.status === '需要注册') {
                            wx.redirectTo({
                                url: `../../index`
                            })
                        }
                    }
                });
            }else if(res.message === 'success') {
                app.globalData.transData = res.data;
                console.log(123124);
                if (app.globalData.orderNumber) {
                    wx.navigateTo({
                        url:`../all-trade-list-detail/all-trade-list-detail?orderNumber=${app.globalData.orderNumber}&codeInPath=${that.data.codeInPath}`
                    })
                }else if (app.globalData.id) {
                    app.sendGetRequest(that.data.codeInPath,{
                        userNumber: app.globalData.id
                    }).then(res => {
                        wx.switchTab({
                            url: '../home/home',
                        })
                    }).catch(err => {

                    })
                }else {
                    wx.switchTab({
                        url: '../home/home',
                    })
                }
            }
        }).catch(err => {
            console.log(err)
            this.setData({
                showError: true
            })
        })
    },

    loginFromPwd(e) {
        console.log(e);
        let that = this;
        app.sendGetRequest(that.data.optionsPath.loginPath, {
            userName: e.detail.value.userName,
            password: e.detail.value.pwd,
            loginStyle: 1
        }).then(res => {
            console.log(res)
            if (res.message === 'success'&&res.data.status) {
                wx.showModal({
                    title: '错误',
                    content: `${res.data.status}`,
                    showCancel: false,
                    confirmText: '确定',
                    success: function(res1) {
                        if (res.data.status === '需要注册') {
                            wx.redirectTo({
                                url: `../../index`
                            })
                        }
                    }
                });
            }else if(res.message === 'success') {
                app.globalData.transData = res.data;
                console.log(123124);
                if (app.globalData.orderNumber) {
                    wx.navigateTo({
                        url:`../all-trade-list-detail/all-trade-list-detail?orderNumber=${app.globalData.orderNumber}&codeInPath=${that.data.codeInPath}`
                    })
                }else if (app.globalData.id) {
                    app.sendGetRequest(that.data.codeInPath,{
                        userNumber: app.globalData.id
                    }).then(res => {
                        wx.switchTab({
                            url: '../home/home',
                        })
                    }).catch(err => {

                    })
                }else {
                    wx.switchTab({
                        url: '../home/home',
                    })
                }
            }
        }).catch(err => {
            console.log(err)
            this.setData({
                showError: true
            })
        })
    },
    goToIndex(e) {
        app.sendGetRequest(this.data.optionsPath.reloginPath, {}).then(res => {
            if (res.message === 'success'&&res.data.status === '验证码错误') {
                wx.showModal({
                    title: '错误',
                    content: `${res.data.status}`,
                    showCancel: false,
                    confirmText: '确定',
                    success: function(res) {
                    }
                });
            }else if (res.message === 'success') {
                wx.redirectTo({
                    url: `../../index`
                })
            }
        }).catch(err => {

        });
    },
    toRegister() {
        wx.redirectTo({
            url: `../../index`
        })
    },
    onUnload: function() {
        let that = this;
        app.globalData.isBack = true;
    },
    toPwd() {
        this.setData({
            showError: false,
            submitForPwd: true,
            submitForCode: false
        })
    },
    toCode() {
        this.setData({
            showError: false,
            submitForPwd: false,
            submitForCode: true
        })
    }
})
