var app = getApp();
const promisify = require('../../../../util/promisify.js')
const login = promisify(wx.login)
const getSystemInfo = promisify(wx.getSystemInfo)
const checkSession = promisify(wx.checkSession)
Page({
    data: {
        items: [],
        id: '',
        payPath:'',
        goSchemeOrderListPath: '',
        showError: false
    },
    onLoad(options) {
        app.globalData.isBack = false;
        console.log(options);
        app.sendGetRequest(options.paymentPath,{}).then(res => {
            console.log(res);
            if (res.message === 'success') {
                this.setData({
                    items: res.data.data,
                    payPath: res.data.payPath,
                    goSchemeOrderListPath: res.data.goSchemeOrderListPath
                });
                app.globalData.backPath = res.data.goBackPath;
            }
        }).catch(err => {
            this.setData({
                showError: true
            })
        })
    },
    radioChange(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({
            id: e.detail.value
        })
    },
    payment() {
        let that = this;
        app.sendGetRequest(that.data.payPath,{
            id: that.data.id
        }).then(res1 => {
            console.log(res1);
            if (res1.message === 'success') {
                wx.requestPayment(
                    {
                        'timeStamp': res1.data.maps.timeStamp+'',
                        'nonceStr': res1.data.maps.nonceStr,
                        'package': res1.data.maps.package,
                        'signType': 'MD5',
                        'paySign': res1.data.maps.paySign,
                        'success':function(res){
                            console.log(res);
                            app.sendGetRequest(res1.data.payPath, {}).then(res => {
                                if (res.message === 'success') {
                                    wx.navigateTo({
                                        url: `../payment-log/payment-log?recordPath=${res.data.recordPath}`
                                    })
                                }
                            }).catch(err => {

                            });
                        },
                        'fail':function(res){},
                        'complete':function(res){
                            app.sendGetRequest(res1.data.payPath, {}).then(res => {
                                console.log(res);
                                if (res.message === 'success') {
                                    wx.navigateTo({
                                        url: `../payment-log/payment-log?recordPath=${res.data.recordPath}`
                                    })
                                }
                            }).catch(err => {

                            });
                        }
                    })
            }
        }).catch(err => {

        })
    },
    viewPayLog() {
        let that = this;
        wx.navigateTo({
            url: `../payment-log/payment-log?recordPath=${that.data.goSchemeOrderListPath}`
        })
    },
    onShow:function(){
        if (app.globalData.isBack) {
            app.sendGetRequest(app.globalData.backPath,{}).then(res => {
                console.log(res);
                if (res.message === 'success') {
                    this.setData({
                        items: res.data.data,
                        payPath: res.data.payPath,
                        goSchemeOrderListPath: res.data.goSchemeOrderListPath
                    });
                    app.globalData.backPath = res.data.goBackPath;
                }
            }).catch(err => {
                console.log(err)
                this.setData({
                    showError: true
                })
            })
        }
    },
    onUnload: function() {
        app.globalData.isBack = true;
    },
})
