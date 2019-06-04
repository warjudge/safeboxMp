// page/API/pages/activity/new-comer/new-comeer-nav/new-comer-nav.js
var qiniuUploader  = require("../../../../util/qiniuUploader.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        createPath: '',
        createQrCodePath: '',
        access_token: '',
        goodsList: [
            {
                imageUrl: '',
                price: 0.00
            },
            {
                imageUrl: '',
                price: 0.00
            },
            {
                imageUrl: '',
                price: 0.00
            },
        ],
        price: 0,
        period: [1,3,5,7,15,20,30],
        term: 3,
        index: 0,
        orderNumber: '',
        newFiles: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        this.setData({
            goodsList: app.globalData.goodsList
        });
        console.log(this.data.goodsList);
        app.sendGetRequest(app.globalData.transData.doLendPath, {}).then(res=> {
            console.log(res);
            if (res.message === 'success') {
                this.data.createPath = res.data.createPath;
                this.data.access_token = res.data.token;
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

        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {

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

    checkTap(e) {
        if (e.currentTarget.dataset.selectType === '1') {
            this.setData({
                type: true
            })
        }else if (e.currentTarget.dataset.selectType === '2') {
            this.setData({
                type: false
            })
        }
    },

    /*图片上传 */
    _chooseImage: function (e) {
        console.log(e)
        let that = this;
        wx.chooseImage({
            // count: that.data.maxFileCount - that.data.files.length,
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
                                        that.data.goodsList.push({
                                            price : 0.00,
                                            imageUrl : item.fileUrl
                                        })
                                    });
                                    console.log(that.data.goodsList);
                                    that.setData({
                                        goodsList: that.data.goodsList
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
    initValue(e) {
        if (e.detail.value.indexOf(0)===0) {
            e.detail.value = '';
            this.data.goodsList[e.currentTarget.dataset.index].price = e.detail.value;
            this.setData({
                goodsList: this.data.goodsList
            });
        }
    },
    computeAmount (e) {
        // console.log(e.currentTarget.dataset);
        // console.log(this.data.goodsList[e.currentTarget.dataset.index].price);
        e.detail.value = e.detail.value.match(/\d+(\.\d{0,2})?/) ? e.detail.value.match(/\d+(\.\d{0,2})?/)[0] : '';
        this.data.goodsList[e.currentTarget.dataset.index].price = e.detail.value;
        this.setData({
            price: 0,
            goodsList: this.data.goodsList
        });
        let amountForCom = 0;
        this.data.goodsList.forEach(item => {
            // console.log(item.price)
            amountForCom += +item.price;
        });
        this.setData({
            price: amountForCom
        });
    },
    bindPickerChange (e) {
        this.setData({
            index: e.detail.value
        })
        this.data.term = this.data.period[this.data.index];
    },
    createCode (e) {
        console.log(e)
        console.log('生成订单')
        if (!this.data.price) {
            wx.showModal({
                title: '警告',
                content: '订单总金额不能为0!',
                showCancel: false,
                confirmText: '确定',
                success: function(res) {
                   //  if (res.confirm) {
                   //      console.log('用户点击了“返回授权”');
                   //  }
                    return;
                }
            });
        }else {
            // wx.showLoading({
            //     title: '创建中...',
            //     mask: true
            // });
            app.sendPostRequest(this.data.createPath,{
                goodsList: this.data.goodsList,
                price: this.data.price,
                amount: this.data.goodsList.length,
                term: this.data.term,
                // formId: e.detail.formId
            }).then(res => {
                console.log(res);
                if (res.message === 'success') {
                    // this.data.orderNumber = res.data.number;
                    // this.data.createQrCodePath = res.data.createQrCodePath;
                    // wx.hideLoading();
                    wx.redirectTo({
                        url: `../qr-code/qr-code?orderNumber=${this.data.orderNumber}&token=${this.data.access_token}&createQrCodePath=${this.data.createQrCodePath}&price=${this.data.price}&qrUrl=${res.data.qrUrl}`,
                    })
                }else {
                    wx.showModal({
                        title: '警告',
                        content: `${res.message}`,
                        showCancel: false,
                        confirmText: '确定',
                        success: function(res) {
                            return;
                        }
                    });
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }
})
