// component/uploader/upload.js
var app = getApp();
var common = require("../../../../util/common.js");
var qiniuUploader  = require("../../../../util/qiniuUploader.js");
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {
        files: {
            type: Array,
            value: []
        },
        maxFileCount: { //允许最多9张图片
            type: Number,
            value: 9
        },
        isCanAddFile: {
            type: Boolean,
            value: true
        },
        bigWidth: {
            type: String,
            value: '154rpx'
        },
        bigHeight: {
            type: String,
            value: '154rpx'
        },
        uploadText: {
            type: String,
            value: '宝贝作品&照片上传'
        }
    },
    /**
     * 组件的初始数据
     */
    data: {

    },
    /*
     *组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
     */
    ready: function () { },
    /**
     * 组件的方法列表
     */
    methods: {
        /*图片上传 */
        _chooseImage: function (e) {
            var that = this;
            wx.chooseImage({
                count: that.data.maxFileCount - that.data.files.length,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    var waitFiles = res.tempFilePaths;
                    var allowCount = that.data.maxFileCount - that.data.files.length; //允许上传的文件数
                    if (waitFiles.length >= allowCount) {
                        waitFiles = waitFiles.slice(0, allowCount);
                    }
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
                                    if (that.data.files.length >= that.data.maxFileCount) {
                                        that.data.isCanAddFile = false;
                                    }
                                    that.setData({
                                        files: that.data.files,
                                        isCanAddFile: that.data.isCanAddFile
                                    });
                                    console.log(that.data.files)
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


                    // common.uploadFiles(waitFiles, index, successFiles, function (urls) {    //此处为抽出的公用方法，便于其它地方调用
                    //     that.data.files = that.data.files.concat(urls);
                    //     if (that.data.files.length >= that.data.maxFileCount) {
                    //         that.data.isCanAddFile = false;
                    //     }
                    //     that.setData({
                    //         files: that.data.files,
                    //         isCanAddFile: that.data.isCanAddFile
                    //     });
                    // });
                }
            })
            // let that = this;
            // let {
            //     uploadPicture
            // } = that.data
            // console.log(that.data);
            // // 通过微信的api选择图片，暂存到本地文件夹，并且通过路径名可以拿到该图片
            // wx.chooseImage({
            //     sizeType: ['original', 'compressed'],
            //     sourceType: ['album', 'camera'],
            //     success: function (res) {
            //         let tempFilePaths = res.tempFilePaths; //选择了多张图片，但由于上传七牛云是单张上传，因此需要循环调接口，注意是调两个接口，获取直传token和七牛直传的接口
            //         tempFilePaths.map((r,i) => {
            //             app.fetchUptoken().then(function(res){ //异步变同步
            //                 let uptoken = res.data
            //                 //使用引入的qiniuUploader方法调七牛上传的接口
            //                 qiniuUploader.upload(
            //                     r, //上传的图片
            //                     (res) => {  //回调 success
            //                         console.log(res)
            //                         uploadPicture.push(res.imageURL);
            //                         that.setData({
            //                             uploadPicture,
            //                         })
            //                         i == tempFilePaths.length - 1 && (
            //                             that.uploadImage()
            //                         )
            //                     }, (error) => { //回调 fail
            //                         console.log('error: ' + error);
            //                     },
            //                     { // 参数设置  地区代码 token domain 和直传的链接 注意七牛四个不同地域的链接不一样，我使用的是华南地区
            //                         region: 'ECN',
            //                         uptoken: uptoken,
            //                         uploadURL: 'https://up-z2.qiniup.com',
            //                         domain: 'http://crm.blingblingstar.com/',
            //                     })
            //             })
            //         })
            //     }
            // })
        },
        /*图片预览*/
        _previewImage: function (e) {
            var preUlrs = [];
            this.data.files.map(
                function (value, index) {
                    preUlrs.push(value.OrigionUrl);
                }
            );
            wx.previewImage({
                current: e.currentTarget.id, // 当前显示图片的http链接
                urls: preUlrs // 需要预览的图片http链接列表
            })
        },
        /*图片删除*/
        _deleteImage: function (e) {
            var that = this;
            var files = that.data.files;
            var index = e.currentTarget.dataset.index; //获取当前长按图片下标
            wx.showModal({
                title: '提示',
                content: '确定要删除此图片吗？',
                success: function (res) {
                    if (res.confirm) {
                        files.splice(index, 1);
                    } else if (res.cancel) {
                        return false;
                    }
                    that.setData({
                        files,
                        isCanAddFile: true
                    });
                }
            })
        },
        /*************供外部调用接口*******************/
        getFiles: function () {
            return this.data.files;
        }
    }
})