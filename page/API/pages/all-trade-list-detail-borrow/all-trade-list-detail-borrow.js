var qiniuUploader  = require("../../../../util/qiniuUploader.js");
var app = getApp();
Page({
    data: {
        checkPath: '',
        confirmPath: '',
        detail: {},
        soldPath: '',
        isSelect: false,
        selected: [],
        files: [],
        goBackOrderListPath: '',
        showError: false,
        isFromMes: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        app.globalData.isBack= false;
        let that = this;
        console.log(options.checkPath);
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
                        soldPath: res.data.soldPath,
                        goBackOrderListPath: res.data.goBackOrderListPath
                    })
                    console.log(that.data.detail)
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
        // if (options.resTran) {
        //     this.setData({
        //         detail: JSON.parse(options.resTran)
        //     })
        // }
        if (options.confirmPath) {
            console.log(options.confirmPath);
            that.setData({
                confirmPath: options.confirmPath
            })
            if (that.data.confirmPath) {
                app.sendGetRequest(that.data.confirmPath,{}).then(res => {
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
                            soldPath: res.data.soldPath,
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
                        soldPath: res.data.soldPath,
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

        if (options.tempId) {
            app.sendGetRequest(options.codeInPath, {
                orderNumber: options.orderNumber,
                tempId: options.tempId
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
                        soldPath: res.data.soldPath,
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
        }
    },
    onReady: function(){
        // var query = wx.createSelectorQuery()
        // console.log(query.selectAll('.imageDom'))
        // query.selectAll('.imageDom').boundingClientRect()
        // query.selectViewport().scrollOffset()
        // query.exec(function(res) {
        //     console.log(res);
        //     // res[0].top // #the-id节点的上边界坐标
        //     // res[1].scrollTop // 显示区域的竖直滚动位置
        // })
        //创建节点选择器
        var query = wx.createSelectorQuery()
        query.select('.list-img').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function(res) {
            console.log(res);

        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onShow: function() {
        // console.log(this.selectAll('.imageDom'))
        let that = this;
        that.setData({
            files: [],
        })
        if (app.globalData.isBack) {
            app.sendGetRequest(app.globalData.actionPath, {
                action:'all_trade_list_detail_borrow',
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
    forSureSold () {
        let that = this;
        let ids = [];
        that.data.selected.forEach(item => {
            ids.push(that.data.detail.goodsList[item].id);
        });
        app.sendGetRequest(that.data.soldPath, {
            ids: ids
        }).then( res => {
            console.log(res);
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
                    soldPath: res.data.soldPath,
                    checkPath: '',
                    confirmPath: '',
                    isSelect: false,
                    selected: [],
                    files: [],
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
            console.log(err);
            that.setData({
                showError: true
            })
        })
    },
    _chooseImage: function (e) {
        var that = this;
        let certList = [];
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var waitFiles = res.tempFilePaths;
                var index = 0;
                var successFiles = [];
                waitFiles.map((r,i) => {
                    wx.showLoading({
                        title: `正在上传第${i+1}张`,
                        mask: true
                    });
                    app.fetchUptoken().then(function(res){
                        let uptoken = res.data;
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
        app.globalData.isBack = true;
        // console.log(234);
        // let that = this;
        // wx.navigateTo({
        //     url: `../all-trade-list-borrow/all-trade-list-borrow?goBackOrderListPath=${that.data.goBackOrderListPath}`
        // })
    },
})
