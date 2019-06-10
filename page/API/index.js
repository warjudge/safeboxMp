var app = getApp();
const promisify = require('../../util/promisify.js')
const login = promisify(wx.login)
const getSystemInfo = promisify(wx.getSystemInfo)
const checkSession = promisify(wx.checkSession)
Page({
    data: {
        showError: false,
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        code: '',
        userInfo: {},
        isHide: false,
        valuePath: '',
        loginPath: '',
        sendPath: '',
        reLoginPath: '',
        wxPhonePath: '',
        registerPath: '',
        codeInPath: '',
        isFirstLogin: false,
        isShowGetPhone: false,
        registerType: '',
        showPersonRegister: false,
        showCompanyRegister: false,
        canGetCode: false,
        canBindPhone: false,
        phone: "",
        verifyCode: "",
        codeButton: "获取验证码",
        uploadText: "上传营业执照",
        files: [],
        maxFileCount: 1,
        showRegisterComplete: false,
        formIdList:[],
        showSonPersonStop: false
    },
    onReady: function() {
        //获得upload组件，后续直接用upload调用组件方法
        this.upload = this.selectComponent("#upload");

    },
    showFiles: function() {
        this.data.files = this.upload.getFiles(); //调用组件外显方法，获取文件列表
        console.log(this.data.files);
    },
    onLoad(options) {
        // this.setData({
        //     showError: false,
        //     // isHide: true,
        //     isHide: true,
        //     isShowGetPhone: false,
        //     isFirstLogin: false,
        //     showPersonRegister: false,
        //     showCompanyRegister: false,
        //     showRegisterComplete: false,
        // });
        // return;
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function(res) {
                console.log(res);
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function(res) {
                            console.log(res.userInfo);
                            // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                            // 根据自己的需求有其他操作再补充
                            // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                            wx.login({
                                success: res => {
                                    // 获取到用户的 code 之后：res.code
                                    console.log("用户的code:" + res.code);
                                    that.data.code = res.code;
                                    // 可以传给后台，再经过解析获取用户的 openid
                                    // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                                    // wx.request({
                                    //     // 自行补上自己的 APPID 和 SECRET
                                    //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
                                    //     success: res => {
                                    //         // 获取到用户的 openid
                                    //         console.log("用户的openid:" + res.data.openid);
                                    //     }
                                    // });
                                    wx.getStorage({
                                        key: 'phone',
                                        success (res){
                                            //已授权手机
                                            console.log('已授权手机',res)
                                            that.getValueAndLoginPath();
                                        },
                                        fail () {
                                        //    没授权手机
                                            wx.hideLoading();
                                            that.setData({
                                                isShowGetPhone: true,
                                                showError: false,
                                                isHide: false,
                                                isFirstLogin: false,
                                                showPersonRegister: false,
                                                showCompanyRegister: false,
                                                showRegisterComplete: false,
                                            })
                                        }
                                    })

                                }
                            });
                        }
                    });
                } else {
                    // 用户没有授权
                    // 改变 isHide 的值，显示授权页面
                    that.setData({
                        isHide: true
                    });
                    wx.hideLoading()
                }
            }
        });
    },
    goToNav() {
        wx.navigateTo({
            url: 'pages/activity/new-comer/new-comer-nav/new-comer-nav',
        })
    },
    onShow() {

    },
    onHide() {

    },
    bindGetUserInfo: function(e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var that = this;
            // 获取到用户的信息了，打印到控制台上看下
            console.log("用户的信息如下：");
            console.log(e.detail.userInfo);
            //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
            that.setData({
                userInfo: e.detail.userInfo,
                isHide: false,
                isShowGetPhone: true
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function(res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
    },
    getValueAndLoginPath () {
        app.globalData.sid = "";
        app.sendRequestWithoutData().then(res => {
            console.log(res);
            if (res.message === 'success') {
                this.data.valuePath = res.data.valuePath;
                app.sendGetRequest(this.data.valuePath, {
                    type: '3',
                }).then(res => {
                    console.log(res);
                    if (res.message === 'success') {
                        this.data.loginPath = res.data.loginPath;
                        this.data.codeInPath = res.data.codeInPath;
                        this.data.sendPath = res.data.sendPath;
                        this.data.reLoginPath = res.data.reLoginPath;
                        app.globalData.actionPath = res.data.actionPath;
                        this.login();
                    }
                }).catch(err => {

                });
            }
        }).catch(err => {
            console.log(err)
            wx.hideLoading();
            this.showError();
        })

    },
    login () {
        console.log(1111);
        let that = this;
        wx.login({
            success(res) {
                that.data.code = res.code;
                wx.checkSession({
                    success: function (res) {
                        console.log(res, '登录未过期')
                        wx.showToast({
                            title: '登录未过期啊',
                        })
                        app.sendGetRequest(that.data.loginPath, {
                            loginStyle: '3',
                            code: that.data.code
                        }).then(res => {
                            wx.hideLoading();
                            console.log(res);
                            if (res.data.status === '需要注册') {
                                that.setData({
                                    showError: false,
                                    isHide: false,
                                    isShowGetPhone: false,
                                    isFirstLogin: true,
                                    showPersonRegister: false,
                                    showCompanyRegister: false,
                                    showRegisterComplete: false,
                                    registerPath: res.data.registerPath,
                                    phone: wx.getStorageSync('phone'),
                                    canGetCode: true
                                });
                            }else if (res.data.status === '待审核') {
                                that.setData({
                                    showError: false,
                                    isHide: false,
                                    isShowGetPhone: false,
                                    isFirstLogin: false,
                                    showPersonRegister: false,
                                    showCompanyRegister: false,
                                    showRegisterComplete: true,
                                });

                            }else if(res.data.status === '子账户停用'){
                                that.setData({
                                    showError: false,
                                    isHide: false,
                                    isShowGetPhone: false,
                                    isFirstLogin: false,
                                    showPersonRegister: false,
                                    showCompanyRegister: false,
                                    showRegisterComplete: false,
                                    showSonPersonStop: true
                                });
                            }else if(res.data.status === '需要登录'){
                                wx.redirectTo({
                                    url: `./pages/relogin/relogin?loginPath=${res.data.loginPath}&sendPath=${res.data.sendPath}&codeInPath=${res.data.codeInPath}&reloginPath=${res.data.reLoginPath}`
                                })
                            }else {
                                app.globalData.transData = res.data;
                                console.log(123124);
                                if (app.globalData.orderNumber) {
                                    wx.navigateTo({
                                        url:`./pages/all-trade-list-detail/all-trade-list-detail?orderNumber=${app.globalData.orderNumber}&codeInPath=${that.data.codeInPath}`
                                    })
                                }else if (app.globalData.id) {
                                    app.sendGetRequest(that.data.codeInPath,{
                                        userNumber: app.globalData.id
                                    }).then(res => {
                                        wx.switchTab({
                                            url: './pages/home/home',
                                        })
                                    }).catch(err => {

                                    })
                                }else if(app.globalData.fromMesQuery) {
                                    that.fromMessageTemp(app.globalData.fromMesQuery);
                                }else {
                                    wx.switchTab({
                                        url: './pages/home/home',
                                    })
                                }
                                // wx.navigateTo({
                                //     url: './pages/all-trade-list-detail/all-trade-list-detail',
                                // })
                            }
                            if (res.message === 'error') {
                                wx.showModal({
                                    title: '错误',
                                    content: `${res.data.status}`,
                                    showCancel: false,
                                    confirmText: '确定',
                                    success: function(res) {
                                    }
                                });
                            }
                        }).catch( err => {
                            console.log(err)
                            wx.hideLoading()
                            that.showError();
                            wx.hideTabBar({})
                        })
                    },
                    fail: function (res) {
                        console.log(res, '登录过期了')
                        wx.showModal({
                            title: '提示',
                            content: '你的登录信息过期了，请重新登录',
                        })
                    }
                });
            }
        })
        // this.setData({
        //     isFirstLogin: true,
        // });
        // wx.hideLoading();
        // return;

    },
    goToRegister (e) {
        console.log(e);
        console.log(e.currentTarget.dataset.selectType);
        this.setData({
            isFirstLogin: false
        });
        if (e.currentTarget.dataset.selectType === '1') {
            this.setData({
                registerType: 'person',
                showPersonRegister: true
            })
        }else if (e.currentTarget.dataset.selectType === '2') {
            this.setData({
                registerType: 'company',
                showCompanyRegister: true
            })
        }
    },
    getPhoneNumber(e) {
        let that = this;
        wx.login({
            success: res => {
                wx.showLoading({
                    title: '加载中...',
                    mask: true
                });
                that.data.code = res.code;
            //    此处发请求给后台，获取解密后的手机号
                app.globalData.sid = "";
                app.sendRequestWithoutData().then(res => {
                    console.log(res);
                    if (res.message === 'success') {
                        this.data.valuePath = res.data.valuePath;
                        app.sendGetRequest(this.data.valuePath, {
                            type: '3',
                        }).then(res => {
                            console.log(res);
                            if (res.message === 'success') {
                                this.data.loginPath = res.data.loginPath;
                                this.data.sendPath = res.data.sendPath;
                                this.data.wxPhonePath = res.data.wxPhonePath;
                                this.data.registerPath = res.data.registerPath;
                                app.sendGetRequest(this.data.wxPhonePath, {
                                    code: this.data.code,
                                    phoneNumber: e.detail.encryptedData,
                                    ivParameter: e.detail.iv
                                }).then(res => {
                                    wx.hideLoading();
                                    console.log(res);
                                    if (res.message === 'success') {
                                        if(res.data.state === '需要注册') {
                                            this.setData({
                                                phone: res.data.phone,
                                                canGetCode: true
                                            });
                                            wx.setStorage({
                                                key: 'phone',
                                                data: that.data.phone,
                                                success (res){
                                                    //已授权手机
                                                    console.log(res);
                                                    that.setData({
                                                        isShowGetPhone: false,
                                                        isFirstLogin: true
                                                    });
                                                    wx.setNavigationBarTitle({
                                                        title: '用户注册'
                                                    });
                                                },
                                            })
                                        }else {
                                            this.setData({
                                                phone: res.data.phone
                                            });
                                            wx.setStorage({
                                                key: 'phone',
                                                data: that.data.phone,
                                                success (res){
                                                    that.login();
                                                },
                                            })
                                        }
                                    }
                                }).catch( err => {
                                    console.log(err);
                                    wx.hideLoading();
                                    this.showError();
                                })
                            }
                        }).catch(err => {
                            wx.hideLoading();
                            this.showError();
                        });
                    }
                }).catch(err => {
                    console.log(err)
                    wx.hideLoading()
                    this.showError();
                    wx.hideTabBar({})
                })
            }
        })
    },
    setPhone(e) {
        let temp = false
        if (e.detail.value.length == 11) {
            let re = /^1[3|5|7|8][0-9]\d{8}$/;
            temp = re.test(e.detail.value);
        }
        this.setData({
            canGetCode: temp,
            phone: e.detail.value
        })
    },
    setCode(e) {
        let temp = false;
        if (e.detail.value.length == 6) {
            let re = /\d{6}/;
            temp = re.test(e.detail.value)
        }
        this.setData({
            canBindPhone: temp,
        })
    },
    getCode(e) {
        console.log(e)
        let re = /^1[3|5|7|8][0-9]\d{8}$/;
        if (!re.test(this.data.phone)) {
            this.setData({
                canGetCode: false
            })
            return
        }
        // this.setData({
        //     lastPhone: this.data.phone
        // })
        app.sendGetRequest(this.data.sendPath, {
            phoneNumber: this.data.phone
        }).then(res => {
            console.log(res);
            if (res.message === 'success') {
                // this.setData({
                //     verifyCode: res.data.code
                // })
            }
        }).catch(err => {
            console.log(err);
        })
        this.setData({
            canGetCode: false
        })
        let count = 61;
        let countDown = () => {
            count = count - 1;
            if (count >= 0) {
                this.setData({
                    canGetCode: false,
                    codeButton: count + "秒后重发"
                })
                setTimeout(countDown, 1000)
            } else {
                this.setData({
                    canGetCode: true,
                    codeButton: "获取验证码",
                })
            }
        }
        countDown();
    },
    personRegister (e) {
        let that = this;
        console.log(e.detail.value);
        console.log(e.detail.formId);
        // if (this.data.verifyCode !== e.detail.value.code) {
        //     wx.showModal({
        //         title: '警告',
        //         content: '验证码错误!!!',
        //         showCancel: false,
        //         confirmText: '重新输入',
        //         success: function(res) {
        //             // 用户没有授权成功，不需要改变 isHide 的值
        //             if (res.confirm) {
        //                 console.log('用户点击了“重新输入”');
        //             }
        //         }
        //     });
        //     return;
        // }
        if (!e.detail.value.userName||!e.detail.value.idNumber||!e.detail.value.code) {
            wx.showModal({
                title: '警告',
                content: '请填入全部信息',
                showCancel: false,
                confirmText: '重新输入',
            });
            return;
        }
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        wx.getUserInfo({
            success: function(res) {
                let userInfo = res.userInfo;
                wx.login({
                    success: res => {
                        // 获取到用户的 code 之后：res.code
                        console.log("用户的code:" + res.code);
                        that.data.code = res.code;
                        app.sendGetRequest(that.data.registerPath, {
                            code: that.data.code,
                            weChat: userInfo,
                            phone: that.data.phone,
                            realName: e.detail.value.userName,
                            idCard: e.detail.value.idNumber,
                            phoneCode: e.detail.value.code,
                            userType: '1',
                            loginStyle: '2',
                            lists: that.data.formIdList
                            // formId: e.detail.formId
                        }).then(res => {
                            console.log(res);
                            if (res.message === 'success' && res.data.status === '待审核') {
                                that.setData({
                                    showError: false,
                                    isHide: false,
                                    isShowGetPhone: false,
                                    isFirstLogin: false,
                                    showPersonRegister: false,
                                    showCompanyRegister: false,
                                    showRegisterComplete: true,
                                });
                                if (app.globalData.id) {
                                    app.sendGetRequest(that.data.codeInPath,{
                                        userNumber: app.globalData.id
                                    }).then(res => {

                                    }).catch(err => {

                                    })
                                }
                            }else if (res.message === 'success' && res.data.status === '需要登录') {
                                that.login();
                            }else {
                                wx.showModal({
                                    title: '错误',
                                    content: `${res.data.status}`,
                                    showCancel: false,
                                    confirmText: '确定',
                                    success: function(res) {
                                    }
                                });
                            }
                            wx.hideLoading();
                        }).catch(err => {
                            console.log(err);
                            wx.hideLoading();
                            that.showError();
                        });
                    }
                });
            }
        });
    },
    companyRegister (e) {
        let that = this;
        console.log(e.detail.value);
        // if (this.data.verifyCode !== e.detail.value.code) {
        //     wx.showModal({
        //         title: '警告',
        //         content: '验证码错误!!!',
        //         showCancel: false,
        //         confirmText: '重新输入',
        //         success: function(res) {
        //             // 用户没有授权成功，不需要改变 isHide 的值
        //             if (res.confirm) {
        //                 console.log('用户点击了“重新输入”');
        //             }
        //         }
        //     });
        //     return;
        // }
        if (!e.detail.value.company||!e.detail.value.code||!that.data.files[0].fileUrl) {
            wx.showModal({
                title: '警告',
                content: '请填入全部信息',
                showCancel: false,
                confirmText: '重新输入',
            });
            return;
        }
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        this.data.files = this.upload.getFiles();

        wx.getUserInfo({
            success: function(res) {
                let userInfo = res.userInfo;
                wx.login({
                    success: res => {
                        console.log("用户的code:" + res.code);
                        that.data.code = res.code;
                        app.sendGetRequest(that.data.registerPath, {
                            code: that.data.code,
                            weChat: userInfo,
                            phone: that.data.phone,
                            company: e.detail.value.company,
                            phoneCode: e.detail.value.code,
                            businessLicense: that.data.files[0].fileUrl,
                            userType: '2',
                            loginStyle: '2',
                            lists: that.data.formIdList
                            // formId: e.detail.formId
                        }).then(res => {
                            console.log(res);
                            if (res.message === 'success' && res.data.status === '待审核') {
                                that.setData({
                                    showError: false,
                                    isHide: false,
                                    isShowGetPhone: false,
                                    isFirstLogin: false,
                                    showPersonRegister: false,
                                    showCompanyRegister: false,
                                    showRegisterComplete: true,
                                });
                            }else if (res.message === 'success' && res.data.status === '需要登录') {
                                that.login();
                            }else {
                                wx.showModal({
                                    title: '错误',
                                    content: `${res.data.status}`,
                                    showCancel: false,
                                    confirmText: '确定',
                                    success: function(res) {
                                    }
                                });
                            }
                            wx.hideLoading();
                        }).catch(err => {
                            console.log(err)
                            wx.hideLoading();
                            that.showError();
                        });
                    }
                });
            }
        });



    },
    showError () {
        this.setData({
            showError: true,
            isHide: false,
            isShowGetPhone: false,
            isFirstLogin: false,
            showPersonRegister: false,
            showCompanyRegister: false,
            showRegisterComplete: false,
        })
    },
    retry () {
        this.onLoad();
    },
    formSubmit: function(e) {
        let that = this;
        if (e.detail.formId != 'the formId is a mock one') {
            that.data.formIdList.push(e.detail.formId);
            console.log(that.data.formIdList);
        }
        console.log(e.detail)
    },
    fromMessageTemp(query) {
        let that = this;
        if (query.tempId === '1'||query.tempId === '4'||query.tempId === '6'){
            wx.redirectTo({
                url:`./pages/all-trade-list-detail/all-trade-list-detail?tempId=${query.tempId}&orderNumber=${query.orderNumber}&codeInPath=${that.data.codeInPath}`
            })
        }
        if (query.tempId === '2'||query.tempId === '5'||query.tempId === '7'||query.tempId === '3'){
            console.log(query.tempId)
            wx.redirectTo({
                url:`./pages/all-trade-list-detail-borrow/all-trade-list-detail-borrow?tempId=${query.tempId}&orderNumber=${query.orderNumber}&codeInPath=${that.data.codeInPath}`
            })
        }
        if (query.tempId === '9'){
            wx.redirectTo({
                url:`./pages/payment-log/payment-log?tempId=${query.tempId}&codeInPath=${that.data.codeInPath}`
            })
        }
        if (query.tempId === '10'){
            wx.redirectTo({
                url:`./pages/long-time/long-time?tempId=${query.tempId}&codeInPath=${that.data.codeInPath}`
            })
        }
        if (query.tempId === '11'){
            wx.redirectTo({
                url:`./pages/my-info-person/my-info-person?tempId=${query.tempId}&codeInPath=${that.data.codeInPath}`
            })
        }
    },
    goToLogin () {
        let that = this;
        wx.redirectTo({
            url:`./pages/relogin/relogin?loginPath=${that.data.loginPath}&sendPath=${that.data.sendPath}&codeInPath=${that.data.codeInPath}&reloginPath=${that.data.reLoginPath}`
        })
    }
})
