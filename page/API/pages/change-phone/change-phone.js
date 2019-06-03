var app = getApp();
const promisify = require('../../../../util/promisify.js')
const login = promisify(wx.login)
const getSystemInfo = promisify(wx.getSystemInfo)
const checkSession = promisify(wx.checkSession)
Page({
    data: {
        optionsPath: null,
        canGetOldCode: true,
        canBindOldPhone: false,
        oldPhone: "",
        oldCodeButton: "获取验证码",
        step: '1',

        canGetNewCode: false,
        canBindNewPhone: false,
        newPhone: "",
        newCodeButton: "获取验证码",
    },
    onLoad(options) {
        console.log(options)
        this.setData({
            optionsPath: options,
            oldPhone: options.oldPhone
        })
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

        app.sendGetRequest(that.data.optionsPath.forCodePath, {
            phoneNumber: that.data.oldPhone
        }).then(res => {
            console.log(res);
            if (res.message === 'success') {
                // that.setData({
                //     oldVerifyCode: res.data.code
                // })
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
        app.sendGetRequest(that.data.optionsPath.finishPath, {
            phoneNumber: e.detail.value.oldPhone,
            code: e.detail.value.oldCode
        }).then(res => {
            console.log(res)
            if (res.message === 'success') {
                that.setData({
                    step: '2'
                })
            }
        }).catch(err => {
            console.log(err)
        })
    },

    setNewPhone(e) {
        let temp = false
        if (e.detail.value.length == 11) {
            let re = /^1[3|5|7|8][0-9]\d{8}$/;
            temp = re.test(e.detail.value);
        }
        this.setData({
            canGetNewCode: temp,
            newPhone: e.detail.value
        })
    },
    setNewCode(e) {
        let temp = false;
        if (e.detail.value.length == 6) {
            let re = /\d{6}/;
            temp = re.test(e.detail.value)
        }
        this.setData({
            canBindNewPhone: temp,
        })
    },
    getNewCode(e) {
        console.log(e)
        let that = this;
        let re = /^1[3|5|7|8][0-9]\d{8}$/;
        if (!re.test(this.data.newPhone)) {
            this.setData({
                canGetNewCode: false
            })
            return
        }

        app.sendGetRequest(that.data.optionsPath.forCodeConfirmPath, {
            phoneNumber: that.data.newPhone
        }).then(res => {
            console.log(res);
            if (res.message === 'success') {
                // that.setData({
                //     oldVerifyCode: res.data.code
                // })
            }
        }).catch(err => {
            console.log(err);
        })
        this.setData({
            canGetNewCode: false
        })
        let count = 61;
        let countDown = () => {
            count = count - 1;
            if (count >= 0) {
                this.setData({
                    canGetNewCode: false,
                    newCodeButton: count + "秒后重发"
                })
                setTimeout(countDown, 1000)
            } else {
                this.setData({
                    canGetNewCode: true,
                    newCodeButton: "获取验证码",
                })
            }
        }
        countDown();
    },
    submitForNew(e) {
        console.log(e);
        let that = this;
        app.sendGetRequest(that.data.optionsPath.finishConfirmPath, {
            phoneNumber: e.detail.value.newPhone,
            code: e.detail.value.newCode
        }).then(res => {
            console.log(res)
            if(res.message === 'success') {
                //提示修改成功
                wx.showModal({
                    title: '提示',
                    content: '换绑手机号成功!!!',
                    showCancel: false,
                    confirmText: '确定',
                    success: function(res1) {
                        wx.switchTab({
                            url: `../my/my?changePhoneSuccess=${res.data.goBackPath}`
                        })
                    }
                });

            }
        }).catch(err => {
            console.log(err)
        })
    }
})
