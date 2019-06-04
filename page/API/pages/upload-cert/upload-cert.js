// page/API/pages/activity/new-comer/new-comeer-nav/new-comer-nav.js
var qiniuUploader  = require("../../../../util/qiniuUploader.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        createPath: '',
        createVoucherPath: '',
        certList: [],
        newFiles: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        this.setData({
            certList: JSON.parse(options.certList),
            createVoucherPath: options.createVoucherPath
        });
        console.log(this.data.certList);
    },
    initValue(e) {
        if (e.detail.value.indexOf(0)===0) {
            e.detail.value = '';
            this.data.certList[e.currentTarget.dataset.index].price = e.detail.value;
            this.setData({
                certList: this.data.certList
            });
        }
    },
    computeAmount (e) {
        // console.log(e.currentTarget.dataset);
        e.detail.value = e.detail.value.match(/\d+(\.\d{0,2})?/) ? e.detail.value.match(/\d+(\.\d{0,2})?/)[0] : '';
        this.data.certList[e.currentTarget.dataset.index].price = e.detail.value;
        this.setData({
            certList: this.data.certList
        });
    },
    /*图片上传 */
    _chooseImage: function (e) {
        let that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let waitFiles = res.tempFilePaths;
                // var allowCount = that.data.maxFileCount - that.data.files.length; //允许上传的文件数
                // if (waitFiles.length >= allowCount) {
                //     waitFiles = waitFiles.slice(0, allowCount);
                // }
                let index = 0; //第几张开始
                let successFiles = []; //成功的文件

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
                                that.data.newFiles = that.data.newFiles.concat({fileUrl:res.fileUrl, hash:res.hash});
                                console.log(that.data.newFiles);
                                if (waitFiles.length === that.data.newFiles.length) {
                                    that.data.newFiles.forEach(item => {
                                        that.data.certList.push({
                                            price : 0.00,
                                            imageUrl : item.fileUrl
                                        })
                                    });
                                    console.log(that.data.certList);
                                    that.setData({
                                        certList: that.data.certList
                                    })
                                }
                                wx.hideLoading();

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
    createVoucher () {
        let that = this;
        app.sendGetRequest(this.data.createVoucherPath, {
            voucherList: that.data.certList
        }).then(res => {
            console.log(res);
            if (res.message === 'success') {
                wx.navigateTo({
                    url: `../view-cert/view-cert?checkVoucherPath=${res.data.checkVoucherPath}`
                })
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
})
