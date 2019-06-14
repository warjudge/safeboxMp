const openIdUrl = require('./config').openIdUrl;
const config = require("./config.js");
const pro = require("./util/promisify.js");
const login = pro(wx.login)

App({
    onLaunch(opts) {
        this.updataApp();
        let sid = wx.getStorageSync("sid")
        // let uid = wx.getStorageSync("uid")
        if (!sid) {
            wx.setStorageSync("sid", "");
            // wx.setStorageSync("uid", "")
            sid = "";
            // uid = "";
        }
        console.log('App Launch', opts)
        if(opts.query.scene){
            let scene=decodeURIComponent(opts.query.scene);
            console.log(scene);
            if (scene.split("=")[0] === 'orderNumber'){
                this.globalData.orderNumber = scene.split('=')[1];
            }else if (scene.split("=")[0] === 'id') {
                this.globalData.id = scene.split('=')[1];
            }
        }
        this.globalData.sid = sid;
        // this.globalData.uid = uid;
        if (opts.query.orderNumber && !opts.query.tempId) {
            this.globalData.orderNumber = opts.query.orderNumber;
        }
        if (opts.query.id) {
            this.globalData.id = opts.query.id;
        }
        if (opts.query.tempId) {
            this.globalData.fromMesQuery = opts.query;
        }
        let systemInfo = wx.getSystemInfoSync();
        this.globalData.navigationBarHeight = systemInfo.screenHeight - systemInfo.windowHeight;
        this.globalData.statusBarHeight = systemInfo.statusBarHeight ? systemInfo.statusBarHeight : 20;
        console.log(this.globalData.navigationBarHeight)
        console.log(systemInfo);
        this.globalData.lastTime = Date.parse(new Date());
    },
    onShow(opts) {
        // console.log('App Show', opts)
        // if (opts.query.scene) {
        //     this.globalData.id = opts.query.scene
        // }
    },
    onHide() {
        console.log('App Hide')
    },
    globalData: {
        hasLogin: false,
        openid: null,
        id: '',
        sid: '',
        // cookies: [],
        // uid: '',
        navigationBarHeight: 20,
        statusBarHeight: 20,
        former: 1,
        lastData: '',
        lastTime: 0,
        orderNumber: '',
        transData: null,
        goodsList: [],
        backPath: '',
        isBack: false,
        firstPath: '',
        thirdPath: '',
        // userType: ''
        fromMesQuery: null,
        actionPath:'',
        orderNumberForBack: ''
    },
    updataApp: function() { //版本更新
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function(res) {
                if (res.hasUpdate) { // 请求完新版本信息的回调
                    updateManager.onUpdateReady(function() {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function(res) {
                                if (res.confirm) { // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function() {
                        wx.showModal({ // 新的版本下载失败
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                        })
                    })
                }
            })
        } else {
            wx.showModal({ // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    // lazy loading openid
    getUserOpenId(callback) {
        const self = this

        if (self.globalData.openid) {
            callback(null, self.globalData.openid)
        } else {
            wx.login({
                success(data) {
                    wx.request({
                        url: openIdUrl,
                        data: {
                            code: data.code
                        },
                        success(res) {
                            console.log('拉取openid成功', res)
                            self.globalData.openid = res.data.openid
                            callback(null, self.globalData.openid)
                        },
                        fail(res) {
                            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
                            callback(res)
                        }
                    })
                },
                fail(err) {
                    console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
                    callback(err)
                }
            })
        }
    },
    retrySession() {
        // this.globalData.sid = "";
        this.sendRequestWithoutData().then(res => {
            if (res.sessionId) {
                this.globalData.sid = res.sessionId;
                wx.setStorageSync("sid", res.sessionId);
                login().then(res => {
                    if (res.code) {
                        this.getNewSession(res.code)
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            console.log(err)
        })
    },
    getNewSession(code) {
        this.sendGetRequest({
            code: code
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    },
    sendGetRequest: function(path, data) {
        let temptime = Date.parse(new Date())
        if (data == this.globalData.lastData && temptime - this.data.lastTime < 1000) {

        } else {
            this.globalData.lastData = data;
            this.globalData.lastTime = temptime
            let that = this;
            // data.command = "WXMINIAPP";
            let promise = new Promise((resolve, reject) => {
                wx.request({
                    url: `${config.host}?sid=${that.globalData.sid}`,
                    // url: `http://192.168.31.209:8080/Gesture`,
                    method: 'GET',
                    // header: {
                    //     "Cookie": that.globalData.cookies[0]
                    // },
                    data: {
                        command: {
                            // sid: that.globalData.sid,
                            // uid: that.globalData.uid,
                            // former: that.globalData.former,
                            // path: 'EX:WXMINIAPP',
                            path: path,
                            data: JSON.stringify(data)
                        }
                    },
                    success: function(res) {
                        console.log(res);

                        if (res.data.type == "shipment") {
                            that.retrySession()
                        } else {
                            // that.globalData.former = res.data.former;
                            // that.globalData.sid = res.data['sessionId'];
                            // if( res.data['success'] && res.data['success']['data']) {
                            //     const tempData = JSON.parse(res.data['success']['data']);
                            //     tempData.value && tempData.value === 'Execution exception' ?
                            //             reject('error') : resolve(JSON.parse(tempData.value));
                            // }
                            if (res.data.views && res.data.views[0].data) {
                                const  tempData = JSON.parse(res.data.views[0].data);
                                if (tempData.value && tempData.value === 'Server side exceptionnull') {
                                    // console.log('重启')
                                    // that.onLaunch({});
                                    reject('error')
                                }else {
                                    resolve(JSON.parse(tempData.value))
                                }
                                    // reject('error') : resolve(JSON.parse(tempData.value));
                            }else {
                                reject('error')
                            }
                        }

                    },
                    fail: function(error) {
                        reject(error)
                    }
                })
            })
            return promise;
        }
    },
    sendPostRequest: function(path, data) {
        let temptime = Date.parse(new Date());
        if (data == this.globalData.lastData && temptime - this.data.lastTime < 1000) {

        } else {
            this.globalData.lastData = data;
            this.globalData.lastTime = temptime;
            var that = this;
            // data.command = "WXMINIAPP";
            var promise = new Promise((resolve, reject) => {
                wx.request({
                    url: `${config.host}?sid=${that.globalData.sid}`,
                    method: 'POST',
                    data: {
                        command: JSON.stringify({
                            // sid: that.globalData.sid,
                            // uid: that.globalData.uid,
                            former: that.globalData.former,
                            // path: 'EX:WXMINIAPP',
                            path: path,
                            data: JSON.stringify(data)
                        })
                    },
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        // "Cookie": that.globalData.cookies[0]
                    },
                    success: function(res) {

                        if (res.data.type == "shipment") {
                            that.retrySession()
                        } else {
                            // that.globalData.former = res.data.former;
                            // that.globalData.sid = res.data['sessionId'];
                            // if( res.data['success'] && res.data['success']['data']) {
                            //     const tempData = JSON.parse(res.data['success']['data']);
                            //     tempData.value && tempData.value === 'Execution exception' ?
                            //         reject('error') : resolve(JSON.parse(tempData.value));
                            // }
                            // that.globalData.sid = res.cookies['sid'];
                            if (res.data.views[0].data) {
                                const  tempData = JSON.parse(res.data.views[0].data);
                                tempData.value && tempData.value === 'Execution exception' ?
                                    reject('error') : resolve(JSON.parse(tempData.value));
                            }
                        }

                    },
                    fail: function(error) {
                        reject(error)
                    }
                })
            })
            return promise;
        }
    },
    sendRequestWithoutData: function() {
        let tempData = {
            json: {
                sid: this.globalData.sid,
                // uid: this.globalData.uid,
                former: this.globalData.former,
                // path: 'EX:WXMINIAPP'
            }
        }
        var that = this;
        var promise = new Promise((resolve, reject) => {
            wx.request({
                url: config.host,
                method: 'GET',
                data: tempData,
                success: function(res) {
                    console.log(res);
                    // that.globalData.former = res.data.former;
                    that.globalData.sid = res.data['sid'];
                    // that.globalData.cookies = res.cookies;
                    // if( res.data['success'] && res.data['success']['data']) {
                    //     const tempData = JSON.parse(res.data['success']['data']);
                    //     tempData.value && tempData.value === 'Execution exception' ?
                    //         reject('error') : resolve(JSON.parse(tempData.value));
                    // }
                    if (res.data.views[0]&&res.data.views[0].data) {
                        const  tempData = JSON.parse(res.data.views[0].data);
                        tempData.value && tempData.value === 'Execution exception' ?
                                reject('error') : resolve(JSON.parse(tempData.value));
                    }
                },
                fail: function(error) {
                    reject(error)
                }
            })
        })
        return promise;
    },
    getCallData(data) {
        if (data.serviceCall && data.serviceCall.callData) {
            return JSON.parse(data.serviceCall.callData)
        } else {
            return null;
        }
    },
    getShareText() {
        return this.globalData.shareText[this.Random(0, this.globalData.shareText.length - 1)]
    },
    Random(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    },
    fetchUptoken: function () {
        return new Promise(function(resolve, reject){
            wx.request({
                url: `${config.host1}`,
                data: {},
                success: function(res){
                    // success
                    console.log(res.data)
                    resolve(res)
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })
        })
    },
    parseTime(d) {
        const newDate = d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1))
            + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + ' '
            + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':'
            + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':'
            + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
        return newDate;
    },
    timeStamp2formDta(ts) {
        const d = new Date(ts);
        return this.parseTime(d);
    }
})