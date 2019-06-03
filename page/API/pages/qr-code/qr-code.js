// page/API/pages/activity/new-comer/new-comeer-nav/new-comer-nav.js
var qiniuUploader  = require("../../../../util/qiniuUploader.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        access_token: '',
        createQrCodePath: '',
        orderNumber: '',
        goodsList: [],
        url: '',
        touxiang: '',
        firstImg: '',
        canvasPath: '',
        lenderName: '',
        price: 0,
        isView: 'false'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        app.globalData.isBack = false;
        let that = this;
        console.log(options);
        if (options.view === 'true') {
            that.setData({
                orderNumber: options.number,
                goodsList: JSON.parse(options.goodsList),
                lenderName: options.lenderName,
                url: options.url,
                isView: 'true'
            })
            let priceForCom = 0;
            that.data.goodsList.forEach(item => {
                priceForCom += item.price
            });
            this.setData({
                price: priceForCom,
            });
            that.getUserAvatarAndFirstImg();
        }else if( options.fromShare === 'true'){
            that.setData({
                goodsList: JSON.parse(options.goodsList),
                url: options.url
            })
            let priceForCom = 0;
            that.data.goodsList.forEach(item => {
                priceForCom += item.price
            });
            this.setData({
                price: priceForCom,
            });
        }else {
            this.setData({
                goodsList: app.globalData.goodsList,
                url: options.qrUrl
            });
            // this.data.orderNumber = options.orderNumber;
            // this.data.createQrCodePath = options.createQrCodePath;
            this.setData({
                price: options.price,
            });
            that.getUserAvatarAndFirstImg();
                //     app.sendPostRequest(that.data.createQrCodePath, {
                //         qrUrl: that.data.url
                //     }).then(res => {
                //         console.log(res);
                //         if (res.message === 'success') {
                //             that.setData({
                //                 lenderName: res.data.lenderName
                //             })
                //         }
                //     }).catch(err => {
                //         console.log(err);
                //     })
                // },
                // fail(res) {
                //     console.log('二维码失败', res);
                // }
            // })
        }
    },

    onShareAppMessage (res) {
        let  that = this;
        console.log(res);
        if (res.from === 'button') {
            return {
                title: '快速借货',
                path: `/page/API/pages/qr-code/qr-code?fromShare=true&goodsList=${JSON.stringify(that.data.goodsList)}&url=${that.data.url}`,
                imageUrl: that.data.goodsList[0].imageUrl,
                success: function(res){
                    // 转发成功之后的回调
                    if(res.errMsg == 'shareAppMessage:ok'){
                        console.log(11111)
                    }
                },
                fail: function(){
                    // 转发失败之后的回调
                    if(res.errMsg == 'shareAppMessage:fail cancel'){
                        // 用户取消转发
                    }else if(res.errMsg == 'shareAppMessage:fail'){
                        // 转发失败，其中 detail message 为详细失败信息
                    }
                },
                complete: function(){
                    // 转发结束之后的回调（转发成不成功都会执行）
                }
            }
        }
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
        if (this.data.isView !== 'true') {
            app.globalData.isBack = true;
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
    createNewImg: function () {
        var that = this;
        var ctx = wx.createCanvasContext('qrcanvas');
        ctx.setFillStyle("#fff");
        ctx.fillRect(0, 0, 375, 667)
        // var path = "/images/gobg.png";
        //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
        //不知道是什么原因，手机环境能正常显示
        // context.drawImage(path, 0, 0, 375, 183);
        var path1 = that.data.touxiang;
        ctx.drawImage('../../../../image/72px.png', 156, 10, 70, 70);

        ctx.setFontSize(14);
        ctx.setFillStyle('#333333');
        ctx.setTextAlign('center');
        ctx.fillText('TUNBAO宝管家', 190, 100);
        ctx.stroke();
        ctx.setFontSize(14);
        ctx.setFillStyle('#333333');
        ctx.setTextAlign('center');
        ctx.fillText(`我是${that.data.lenderName}，我正在使用Tunbao宝管家,`, 210, 130);
        ctx.stroke();
        ctx.setFontSize(14);
        ctx.setFillStyle('#333333');
        ctx.setTextAlign('center');
        ctx.fillText(`邀你扫码租货！`, 190, 150);
        ctx.stroke();
        ctx.setFontSize(14);
        ctx.setFillStyle('#333333');
        ctx.setTextAlign('center');
        ctx.fillText(`共${that.data.goodsList.length}件`, 190, 500);
        ctx.stroke();
        ctx.setFontSize(14);
        ctx.setFillStyle('red');
        ctx.setTextAlign('center');
        ctx.fillText(`￥${that.data.price}`, 190, 520);
        ctx.stroke();
        ctx.setFontSize(14);
        ctx.setFillStyle('#333333');
        ctx.setTextAlign('right');
        ctx.fillText(`长按关注`, 290, 560);
        ctx.stroke();
        ctx.setFontSize(14);
        ctx.setFillStyle('#333333');
        ctx.setTextAlign('right');
        ctx.fillText(`您身边的宝贝管家`, 290, 580);
        ctx.stroke();

        ctx.drawImage(that.data.firstImg, 68, 160, 240, 240);
        ctx.drawImage(that.data.url, 118, 340, 140, 140);
        ctx.drawImage(that.data.url, 300, 525, 60, 60);

        console.log(path1,"path1");
        ctx.arc(40, 130, 20, 0, 2 * Math.PI) //画出圆
        ctx.strokeStyle = "#ffe200";
        ctx.clip(); //裁剪上面的圆形
        ctx.drawImage(path1, 20, 105, 40, 40); // 在刚刚裁剪的园上画图

        ctx.draw();
        //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        setTimeout(function () {
            wx.canvasToTempFilePath({
                canvasId: 'qrcanvas',
                success: function (res) {
                    let tempFilePath = res.tempFilePath;
                    that.setData({
                        canvasPath: tempFilePath,
                        // canvasHidden:true
                    });
                },
                fail: function (res) {
                    console.log(res);
                }
            });
        }, 200);
    },

    getUserAvatarAndFirstImg(){
        let that = this;
        wx.getUserInfo({
            success: res => {
                console.log(res.userInfo)
                this.setData({
                    name: res.userInfo.nickName,
                })
                wx.downloadFile({
                    url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
                    success: function (res) {
                        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                        if (res.statusCode === 200) {
                            // console.log(res)
                            that.setData({
                                touxiang: res.tempFilePath
                            });
                            wx.downloadFile({
                                url: that.data.goodsList[0].imageUrl, //仅为示例，并非真实的资源
                                success: function (res1) {
                                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                                    if (res1.statusCode === 200) {
                                        // console.log(res1)
                                        that.setData({
                                            firstImg: res1.tempFilePath
                                        });
                                        that.createNewImg();
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    saveToLocal() {
        let that = this
        wx.saveImageToPhotosAlbum({
            filePath: that.data.canvasPath,
            success(res) {
                wx.showModal({
                    content: '图片已保存到相册，赶紧晒一下吧~',
                    showCancel: false,
                    confirmText: '好的',
                    confirmColor: '#333',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            /* 该隐藏的隐藏 */
                            that.setData({
                                maskHidden: false
                            })
                        }
                    },fail:function(res){
                        console.log(11111)
                    }
                })
            }
        })
    }
})
