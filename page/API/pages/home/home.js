// page/API/pages/activity/new-comer/new-comeer-nav/new-comer-nav.js
var qiniuUploader  = require("../../../../util/qiniuUploader.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: true,
        allData: null,
        files: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        app.globalData.isBack = false;
        console.log(app.globalData.transData);
        this.setData({
            allData : JSON.parse(JSON.stringify(app.globalData.transData))
        })
        app.globalData.firstPath = this.data.allData.firstPath;
        app.globalData.thirdPath = this.data.allData.thirdPath;
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
        console.log('show')
        if(app.globalData.isBack && app.globalData.backPath) {
            app.sendGetRequest(app.globalData.backPath, {}).then(res => {
                console.log(res)
                if (res.message === 'success') {
                    this.setData({
                        allData : res.data
                    })
                    app.globalData.firstPath = this.data.allData.firstPath;
                    app.globalData.thirdPath = this.data.allData.thirdPath;
                    app.globalData.backPath = '';
                }
            }).catch(err => {
                console.log(err)
            })
        }else if (app.globalData.firstPath){
            app.sendGetRequest(app.globalData.firstPath, {}).then(res => {
                console.log(res)
                if (res.message === 'success') {
                    this.setData({
                        allData : res.data,
                        files: []
                    })
                    app.globalData.firstPath = this.data.allData.firstPath;
                    app.globalData.thirdPath = this.data.allData.thirdPath;
                    app.globalData.backPath = '';
                }
            }).catch(err => {
                console.log(err)
            })
        }

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
    goToMessage() {
        let that = this;
        wx.navigateTo({
            url: `../message/message?toMessagePath=${that.data.allData.toMessagePath}&fromHome=true`,
        })
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
        // wx.navigateTo({
        //     url: '../qr-code/qr-code',
        // })
        // return;
        var that = this;
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
                                    app.globalData.goodsList = that.data.files;
                                    app.globalData.goodsList.forEach(item => {
                                       item.price = 0.00;
                                       item.imageUrl = item.fileUrl;
                                    });
                                    wx.navigateTo({
                                        url: '../quick-lend/quick-lend',
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
    goToAllTradeList (e){
        console.log(e.currentTarget.dataset.type);
        let that = this;
        let url = '';
        if (e.currentTarget.dataset.type === '1') {
            url = `../all-trade-list/all-trade-list?allLendPath=${that.data.allData.allLendPath}&todayLendCount=${that.data.allData.todayLendCount}&timeOutLendCount=${that.data.allData.timeOutLendCount}&allLendCount=${that.data.allData.allLendCount}&settleLendCount=${that.data.allData.settleLendCount}&type=${e.currentTarget.dataset.type}`
        }else if (e.currentTarget.dataset.type === '2') {
            url = `../all-trade-list/all-trade-list?todayLendPath=${that.data.allData.todayLendPath}&todayLendCount=${that.data.allData.todayLendCount}&timeOutLendCount=${that.data.allData.timeOutLendCount}&allLendCount=${that.data.allData.allLendCount}&settleLendCount=${that.data.allData.settleLendCount}&type=${e.currentTarget.dataset.type}`
        }
        else if (e.currentTarget.dataset.type === '3') {
            url = `../all-trade-list/all-trade-list?timeOutLendPath=${that.data.allData.timeOutLendPath}&todayLendCount=${that.data.allData.todayLendCount}&timeOutLendCount=${that.data.allData.timeOutLendCount}&allLendCount=${that.data.allData.allLendCount}&settleLendCount=${that.data.allData.settleLendCount}&type=${e.currentTarget.dataset.type}`
        }
        else if (e.currentTarget.dataset.type === '4') {
            url = `../all-trade-list/all-trade-list?settleLendPath=${that.data.allData.settleLendPath}&todayLendCount=${that.data.allData.todayLendCount}&timeOutLendCount=${that.data.allData.timeOutLendCount}&allLendCount=${that.data.allData.allLendCount}&settleLendCount=${that.data.allData.settleLendCount}&type=${e.currentTarget.dataset.type}`
        }
        wx.navigateTo({
            url: url,
        })
    },

    scanCode () {
        let that = this;
        wx.scanCode({
            success: (res) => {
                console.log(res);
                let orderNumber = that.base64_decode(res.rawData).split("=")[1];
                console.log(orderNumber)
                app.sendGetRequest(that.data.allData.doBorrowPath, {}).then(res1 => {
                    if (res1.message === 'success') {
                        let codeInPath = res1.data.codeInPath;
                        wx.navigateTo({
                            url:`../all-trade-list-detail/all-trade-list-detail?orderNumber=${orderNumber}&codeInPath=${codeInPath}`
                        })
                    }
                }).catch(err => {

                });
            }
        })
    },
    base64_decode:function  (input) { // 解码，配合decodeURIComponent使用
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        function utf8_decode(utftext){ // utf-8解码
            var string = '';
            let i = 0;
            let c = 0;
            let c1 = 0;
            let c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c1 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                    i += 2;
                } else {
                    c1 = utftext.charCodeAt(i + 1);
                    c2 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                    i += 3;
                }
            }
            return string;
        }
        while (i < input.length) {
            enc1 = base64EncodeChars.indexOf(input.charAt(i++));
            enc2 = base64EncodeChars.indexOf(input.charAt(i++));
            enc3 = base64EncodeChars.indexOf(input.charAt(i++));
            enc4 = base64EncodeChars.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        return utf8_decode(output);
    },



    goToAllTradeListBorrow (e){
        console.log(e.currentTarget.dataset.type);
        let that = this;
        let url = '';
        if (e.currentTarget.dataset.type === '1') {
            url = `../all-trade-list-borrow/all-trade-list-borrow?allBorrowPath=${that.data.allData.allBorrowPath}&todayBorrowCount=${that.data.allData.todayBorrowCount}&timeOutBorrowCount=${that.data.allData.timeOutBorrowCount}&allBorrowCount=${that.data.allData.allBorrowCount}&soldBorrowCount=${that.data.allData.soldBorrowCount}&type=${e.currentTarget.dataset.type}`
        }else if (e.currentTarget.dataset.type === '2') {
            url = `../all-trade-list-borrow/all-trade-list-borrow?todayBorrowPath=${that.data.allData.todayBorrowPath}&todayBorrowCount=${that.data.allData.todayBorrowCount}&timeOutBorrowCount=${that.data.allData.timeOutBorrowCount}&allBorrowCount=${that.data.allData.allBorrowCount}&soldBorrowCount=${that.data.allData.soldBorrowCount}&type=${e.currentTarget.dataset.type}`
        }
        else if (e.currentTarget.dataset.type === '3') {
            url = `../all-trade-list-borrow/all-trade-list-borrow?timeOutBorrowPath=${that.data.allData.timeOutBorrowPath}&todayBorrowCount=${that.data.allData.todayBorrowCount}&timeOutBorrowCount=${that.data.allData.timeOutBorrowCount}&allBorrowCount=${that.data.allData.allBorrowCount}&soldBorrowCount=${that.data.allData.soldBorrowCount}&type=${e.currentTarget.dataset.type}`
        }
        else if (e.currentTarget.dataset.type === '4') {
            url = `../all-trade-list-borrow/all-trade-list-borrow?soldBorrowPath=${that.data.allData.soldBorrowPath}&todayBorrowCount=${that.data.allData.todayBorrowCount}&timeOutBorrowCount=${that.data.allData.timeOutBorrowCount}&allBorrowCount=${that.data.allData.allBorrowCount}&soldBorrowCount=${that.data.allData.soldBorrowCount}&type=${e.currentTarget.dataset.type}`
        }
        wx.navigateTo({
            url: url,
        })
    },
})
