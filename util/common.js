/**
 * 文件上传
 */
function uploader(file, callback) {
    wx.uploadFile({
        url: 'http://192.168.31.170/imageUpload',  //服务端Url
        filePath: file,   //需要上传的文件
        name: 'anqindayviews',  //文件名称
        header: {
            "Content-Type": "multipart/form-data"
        },
        success: function(res) {
            console.log(res);
            if (res && res.data) {
                var data = JSON.parse(res.data);
                if (data.isSuccess && callback) {
                    callback(data.content);
                } else {
                    wx.hideToast();
                    wx.showModal({
                        title: '错误提示',
                        content: '上传图片失败',
                        showCancel: false
                    });
                }
            }
        }
    });
};
/**
 * 采用递归的方式多文件上传
 * imgPaths:需要上传的文件列表
 * index：imgPaths开始上传的序号
 * successFiles:已上传成功的文件
 * callBack：文件上传后的回调函数
 */
function uploadFiles(imgPaths, index, successFiles, callBack) {
    var that = this;
    wx.showLoading({
        title: '正在上传第' + index + '张',
    })
    console.log(111222);
    wx.uploadFile({
        url: 'http://192.168.31.170:8080/ImageUpload',
        filePath: imgPaths[index],
        name: 'anqindayviews',
        header: {
            "Content-Type": "multipart/form-data"
        },
        success: function(res) {
            console.log(res);
            console.log(imgPaths[index]);
            //成功,文件返回值存入成功列表
            // if (res && res.data) {
            //     var data = JSON.parse(res.data);
            //     if (data.isSuccess) {
            //         successFiles.push(data.content);
            //     }
            // }
        },
        complete: function(e) {
            index++; //下一张
            if (index == imgPaths.length) {
                wx.hideLoading();
                //上传完毕，作一下提示
                wx.showToast({
                    title: '上传成功' + successFiles.length,
                    icon: 'success',
                    duration: 2000
                });
                if(callBack){
                    callBack(successFiles);
                }
            } else {
                //递归调用，上传下一张
                that.uploadFiles(imgPaths, index,successFiles, callBack);
            }
        }
    })
}

module.exports = {
    uploader: uploader,
    uploadFiles: uploadFiles
};