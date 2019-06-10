var qiniuUploader  = require("../../../../util/qiniuUploader.js");
var app = getApp();
Page({
    data: {
        checkPath: '',
        detail: {},
        isScan: false,
        closePath:'',
        lendPath: '',
        isSelect: false,
        selected: [],
        giveBackPath: '',
        files: [],
        reminderPath: '',
        showError: false,
        goBackOrderListPath: '',
        isFromMes: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        app.globalData.isBack= false;
        if (options.checkPath) {
            this.data.checkPath = options.checkPath;
            app.sendGetRequest(this.data.checkPath, {}).then(res => {
                console.log(res);
                if (res.message === 'success') {
                    res.data.createTime = app.timeStamp2formDta(res.data.createTime);
                    res.data.lendTime = res.data.lendTime?app.timeStamp2formDta(res.data.lendTime):'';
                    res.data.endTime = res.data.endTime?app.timeStamp2formDta(res.data.endTime):'';
                    app.globalData.orderNumberForBack = res.data.number;
                    if (res.data.goodsList) {
                        res.data.goodsList.forEach(item => {
                            item.endTime = item.endTime?app.timeStamp2formDta(item.endTime):'';
                            wx.getImageInfo({
                                src:item.imageUrl,
                                success(respon) {
                                    item['backgroundSize'] = respon.width > respon.height;
                                    that.setData({
                                        detail: res.data,
                                    })
                                }
                            })
                        });
                    }
                    that.setData({
                        detail: res.data,
                        giveBackPath: res.data.giveBackPath,
                        closePath: res.data.closePath,
                        reminderPath: res.data.reminderPath,
                        goBackOrderListPath: res.data.goBackOrderListPath
                    })
                    app.globalData.backPath= res.data.goBackOrderListPath
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
                that.setData({
                    showError: true
                })
            })
        }else if (options.orderNumber && options.codeInPath) {
            if (options.tempId) {
                that.setData({
                    isFromMes: true
                });
                app.sendGetRequest(options.codeInPath, {
                    orderNumber: options.orderNumber,
                    tempId: options.tempId
                }).then( res => {
                    console.log(res);
                    if (res.message === 'success') {
                        res.data.createTime = app.timeStamp2formDta(res.data.createTime);
                        res.data.lendTime = res.data.lendTime?app.timeStamp2formDta(res.data.lendTime):'';
                        res.data.endTime = res.data.endTime?app.timeStamp2formDta(res.data.endTime):'';
                        app.globalData.orderNumberForBack = res.data.number;
                        if (res.data.goodsList) {
                            res.data.goodsList.forEach(item => {
                                wx.getImageInfo({
                                    src:item.imageUrl,
                                    success(respon) {
                                        item['backgroundSize'] = respon.width > respon.height;
                                        that.setData({
                                            detail: res.data,
                                        })
                                    }
                                })
                                item.endTime = item.endTime?app.timeStamp2formDta(item.endTime):'';
                            });
                        }
                        that.setData({
                            detail: res.data,
                            giveBackPath: res.data.giveBackPath,
                            closePath: res.data.closePath,
                            reminderPath: res.data.reminderPath,
                            goBackOrderListPath: res.data.goBackOrderListPath
                        })
                        app.globalData.backPath= res.data.goBackOrderListPath
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
                }).catch( err => {
                    that.setData({
                        showError: true
                    })
                })

            }else {
                that.setData({
                    isScan: true
                });
                app.sendGetRequest(options.codeInPath, {
                    orderNumber: options.orderNumber
                }).then( res => {
                    console.log(res);
                    if (res.message === 'success') {
                        if (res.data.lendPath) {
                            res.data.createTime = app.timeStamp2formDta(res.data.createTime);
                            res.data.lendTime = res.data.lendTime?app.timeStamp2formDta(res.data.lendTime):'';
                            res.data.endTime = res.data.endTime?app.timeStamp2formDta(res.data.endTime):'';
                            app.globalData.orderNumberForBack = res.data.number;
                            if (res.data.goodsList) {
                                res.data.goodsList.forEach(item => {
                                    item.endTime = item.endTime?app.timeStamp2formDta(item.endTime):'';
                                    wx.getImageInfo({
                                        src:item.imageUrl,
                                        success(respon) {
                                            item['backgroundSize'] = respon.width > respon.height;
                                            that.setData({
                                                detail: res.data,
                                            })
                                        }
                                    })
                                });
                            }
                            that.setData({
                                detail: res.data,
                                lendPath: res.data.lendPath
                            })
                        }else {
                            that.setData({
                                showError: true
                            })
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
                }).catch( err => {
                    that.setData({
                        showError: true
                    })
                })
            }
        }
        if (options.goBackOrderDetailsPath) {
            app.sendGetRequest(options.goBackOrderDetailsPath,{}).then(res => {
                console.log(res);
                if (res.message === 'success') {
                    res.data.createTime = app.timeStamp2formDta(res.data.createTime);
                    res.data.lendTime = res.data.lendTime?app.timeStamp2formDta(res.data.lendTime):'';
                    res.data.endTime = res.data.endTime?app.timeStamp2formDta(res.data.endTime):'';
                    app.globalData.orderNumberForBack = res.data.number;
                    if (res.data.goodsList) {
                        res.data.goodsList.forEach(item => {
                            item.endTime = item.endTime?app.timeStamp2formDta(item.endTime):'';
                            wx.getImageInfo({
                                src:item.imageUrl,
                                success(respon) {
                                    item['backgroundSize'] = respon.width > respon.height;
                                    that.setData({
                                        detail: res.data,
                                    })
                                }
                            })
                        });
                    }
                    that.setData({
                        detail: res.data,
                        giveBackPath: res.data.giveBackPath,
                        closePath: res.data.closePath,
                        reminderPath: res.data.reminderPath,
                        goBackOrderListPath: res.data.goBackOrderListPath
                    })
                    app.globalData.backPath= res.data.goBackOrderListPath
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
                that.setData({
                    showError: true
                })
            })
        }
    },
    onShow: function() {
        let that = this;
        that.setData({
            files: [],
        })
        if (app.globalData.isBack) {
            app.sendGetRequest(app.globalData.actionPath, {
                action:'all_trade_list_detail',
                id:app.globalData.orderNumberForBack
            }).then(res => {
                console.log(res);
                if (res.message === 'success') {
                    res.data.createTime = app.timeStamp2formDta(res.data.createTime);
                    res.data.lendTime = res.data.lendTime?app.timeStamp2formDta(res.data.lendTime):'';
                    res.data.endTime = res.data.endTime?app.timeStamp2formDta(res.data.endTime):'';
                    app.globalData.orderNumberForBack = res.data.number;
                    if (res.data.goodsList) {
                        res.data.goodsList.forEach(item => {
                            item.endTime = item.endTime?app.timeStamp2formDta(item.endTime):'';
                            wx.getImageInfo({
                                src:item.imageUrl,
                                success(respon) {
                                    item['backgroundSize'] = respon.width > respon.height;
                                    that.setData({
                                        detail: res.data,
                                    })
                                }
                            })
                        });
                    }
                    that.setData({
                        detail: res.data,
                        giveBackPath: res.data.giveBackPath,
                        closePath: res.data.closePath,
                        reminderPath: res.data.reminderPath,
                        goBackOrderListPath: res.data.goBackOrderListPath,
                    })
                    app.globalData.backPath= res.data.goBackOrderListPath
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
                that.setData({
                    showError: true
                })
            })
        }
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
    closeOrder () {
        let that = this;
        wx.showLoading({
            title: '关闭中...',
            mask: true
        });
        app.sendGetRequest(this.data.closePath,{}).then(res => {
            console.log(res);
            wx.hideLoading();
            if (res.message === 'success') {
                res.data.createTime = app.timeStamp2formDta(res.data.createTime);
                res.data.lendTime = res.data.lendTime?app.timeStamp2formDta(res.data.lendTime):'';
                res.data.endTime = res.data.endTime?app.timeStamp2formDta(res.data.endTime):'';
                if (res.data.goodsList) {
                    res.data.goodsList.forEach(item => {
                        item.endTime = item.endTime?app.timeStamp2formDta(item.endTime):'';
                        wx.getImageInfo({
                            src:item.imageUrl,
                            success(respon) {
                                item['backgroundSize'] = respon.width > respon.height;
                                that.setData({
                                    detail: res.data,
                                })
                            }
                        })
                    });
                }
                that.setData({
                    detail: res.data,
                    giveBackPath: res.data.giveBackPath,
                    closePath: res.data.closePath,
                    reminderPath: res.data.reminderPath,
                    goBackOrderListPath: res.data.goBackOrderListPath
                })
                app.globalData.backPath= res.data.goBackOrderListPath
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
            this.setData({
                showError: true
            })
        })
    },
    showQRCode () {
        let that = this;
        wx.navigateTo({
            url: `../qr-code/qr-code?view=true&number=${that.data.detail.number}&goodsList=${JSON.stringify(that.data.detail.goodsList)}&lenderName=${that.data.detail.lenderName}&url=${that.data.detail.qrCodeData.qrUrl}`
        });
    },
    lendGoods () {
        let that = this;
        wx.showLoading({
            title: '租借中...',
            mask: true
        });
        app.sendGetRequest(this.data.lendPath,{}).then(res => {
            console.log(res);
            wx.hideLoading();
            if (res.message === 'success') {
                wx.showModal({
                    title: '成功',
                    content: '租借成功!!!',
                    showCancel: false,
                    confirmText: '确定',
                    success: function(res) {
                        // 用户没有授权成功，不需要改变 isHide 的值
                        if (res.confirm) {
                            console.log('用户点击了“确定”');
                        }
                    }
                });
                // res.data.createTime = app.timeStamp2formDta(res.data.createTime);
                // res.data.lendTime = res.data.lendTime?app.timeStamp2formDta(res.data.lendTime):'';
                // res.data.endTime = res.data.endTime?app.timeStamp2formDta(res.data.endTime):'';
                // that.setData({
                //     detail: res.data,
                //     giveBackPath: res.data.giveBackPath,
                //     closePath: res.data.closePath,
                //     reminderPath: res.data.reminderPath
                // })
                wx.navigateTo({
                    url: `../all-trade-list-detail-borrow/all-trade-list-detail-borrow?confirmPath=${res.data.confirmPath}`
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
            wx.hideLoading();
            that.setData({
                showError: true
            })
        })
    },
    selectSold() {
        this.setData({
            isSelect: true
        })
    },
    checkboxChange(e) {
        console.log(e.detail);
        this.setData({
            selected : e.detail.value
        })
    },
    forSureGiveBack() {
        let that = this;
        let ids = [];
        that.data.selected.forEach(item => {
            ids.push(that.data.detail.goodsList[item].id);
        });
        app.sendGetRequest(that.data.giveBackPath, {
            ids: ids
        }).then( res => {
            console.log(res);
            if (res.message === 'success') {
                res.data.createTime = app.timeStamp2formDta(res.data.createTime);
                res.data.lendTime = res.data.lendTime?app.timeStamp2formDta(res.data.lendTime):'';
                res.data.endTime = res.data.endTime?app.timeStamp2formDta(res.data.endTime):'';
                res.data.goodsList.forEach(item => {
                    item.endTime = app.timeStamp2formDta(item.endTime);
                    wx.getImageInfo({
                        src:item.imageUrl,
                        success(respon) {
                            item['backgroundSize'] = respon.width > respon.height;
                            that.setData({
                                detail: res.data,
                            })
                        }
                    })
                });
                that.setData({
                    detail: res.data,
                    giveBackPath: res.data.giveBackPath,
                    closePath: res.data.closePath,
                    reminderPath: res.data.reminderPath,
                    goBackOrderListPath: res.data.goBackOrderListPath,
                    checkPath: '',
                    isScan: false,
                    lendPath: '',
                    isSelect: false,
                    selected: [],
                    files: [],
                })
                app.globalData.backPath= res.data.goBackOrderListPath
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
        }).catch( err => {
            console.log(err);
            that.setData({
                showError: true
            })
        })
    },
    _chooseImage: function (e) {
        // wx.navigateTo({
        //     url: '../qr-code/qr-code',
        // })
        // return;
        var that = this;
        let certList = [];
        wx.chooseImage({
            // count: that.data.maxFileCount - that.data.files.length,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var waitFiles = res.tempFilePaths;
                // var allowCount = that.data.maxFileCount - that.data.files.length; //允许上传的文件数
                // if (waitFiles.length >= allowCount) {
                //     waitFiles = waitFiles.slice(0, allowCount);
                // }
                var index = 0; //第几张开始
                var successFiles = []; //成功的文件

                waitFiles.map((r,i) => {
                    wx.showLoading({
                        title: `正在上传第${i+1}张`,
                        mask: true
                    });
                    app.fetchUptoken().then(function(res){ //异步变同步
                        let uptoken = res.data
                        //使用引入的qiniuUploader方法调七牛上传的接口
                        qiniuUploader.upload(
                            r, //上传的图片
                            (res) => {  //回调 success
                                that.data.files = that.data.files.concat({fileUrl:res.fileUrl, hash:res.hash});
                                console.log(that.data.files);
                                wx.hideLoading();
                                if (waitFiles.length === that.data.files.length) {
                                    certList = that.data.files;
                                    certList.forEach(item => {
                                        item.price = 0.00;
                                        item.imageUrl = item.fileUrl;
                                    });
                                    wx.navigateTo({
                                        url: `../upload-cert/upload-cert?certList=${JSON.stringify(certList)}&createVoucherPath=${that.data.detail.createVoucherPath}`,
                                    })
                                }
                            }, (error) => { //回调 fail
                                console.log('error: ' + error);
                            },
                            { // 参数设置  地区代码 token domain 和直传的链接 注意七牛四个不同地域的链接不一样，我使用的是华南地区
                                region: 'ECN',
                                uptoken: uptoken,
                                uploadURL: 'https://up-z2.qiniup.com',
                                domain: 'http://crm.blingblingstar.com/',
                            })
                    })
                })
            }
        })
    },
    viewCert () {
        let that = this;
        wx.navigateTo({
            url: `../view-cert/view-cert?checkVoucherPath=${that.data.detail.checkVoucherPath}`,
        })
    },
    onUnload: function(opts) {
        // console.log(234);
        // let that = this;
        // wx.navigateTo({
        //     url: `../all-trade-list/all-trade-list?goBackOrderListPath=${that.data.goBackOrderListPath}`
        // })
        app.globalData.isBack = true;
    },
    reminder () {
        let that = this;
        let ids = [];
        that.data.detail.goodsList.forEach(item => {
            if (item.state === '逾期') {
                ids.push(item.id)
            }
        })
        app.sendGetRequest(that.data.reminderPath, {
            ids: ids
        }).then( res => {
            console.log(res)
            if (res.message === 'success') {
                wx.showModal({
                    title: '提示',
                    content: '提醒成功!!!',
                    showCancel: false,
                    confirmText: '确定',
                    success: function(res) {
                        if (res.confirm) {
                        //    提醒之后的页面刷新
                        }
                    }
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
    },
    callHim() {
        let that = this;
        wx.makePhoneCall({
            phoneNumber: that.data.detail.borrowerPhone
        })
    }
})
