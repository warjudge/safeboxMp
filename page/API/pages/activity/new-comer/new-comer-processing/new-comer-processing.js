// page/API/pages/activity/new-comer/new-comer-processing/new-comer-processing.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodity: [],
    taskData: {},
    needMoney: "",
    needCount: "",
    finishMoney: "",
    taskId: "",
    sumMoney: null,
    bar1: 0,
    bar2: 400,
    h5image: 'http://qiniu.blingblingstar.com/h5banner.png',
    showh5activity: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title:'加载中',
      mask:true
    });
    if (options.taskId) {
      this.setData({
        taskId: options.taskId
      })
      app.sendGetRequest({
        action: "getAidInfo",
        id: options.taskId
      }).then(res => {
        console.log(res)
        if (res.serviceCall) {
          let temp = app.getCallData(res);
          if (temp.msg == "success") {
            if (temp.data) {
              this.setData({
                taskData: temp.data
              })
            }
            if (temp.needMoney) {
              this.setData({
                needMoney: temp.needMoney
              })
            }
            if (temp.needCount) {
              this.setData({
                needCount: temp.needCount,
                finishMoney: (temp.data.aidActivityData.money - temp.needMoney).toFixed(2),
                sumMoney: temp.data.aidActivityData.money
              })
            }
            this.setData({
              bar1: 400 * this.data.finishMoney / this.data.sumMoney,
              bar2: 400 - 400 * this.data.finishMoney / this.data.sumMoney
            })
          }
        }
      }).catch(err => {
        console.log(err)
        wx.hideLoading();
      })
    }

    app.sendGetRequest({
      action: "listHotCommodity"
    }).then(res => {
      if (res && !res.sessionId)
        this.reLogin();
      else {
        let temp = app.getCallData(res);
        if (temp != null) {
          if (temp.msg == "success") {
            if (temp.data) {
              let  commodity = temp.data
              //如果有商品缩略图 就使用 商品缩略图   不然使用商品伦播图   两个没有 使用默认的砖石图片
              commodity.forEach(item=>{
                if(item.commodityData!=undefined&&item.thumbnail!=undefined){
                    item.commodityData['img']=item.thumbnail[0]
                }else if(item.commodityData!=undefined&&item.multimedia!=undefined){
                    item.commodityData['img']=item.multimedia[0]
                }else{
                    item.commodityData['img']='/image/product/zuanshi.png'
                }
              })
              this.setData({
                commodity:commodity
              });

              console.log(this.data.commodity);
          }
          }
        }
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading();
    })
    wx.hideLoading();
  },
  goToProductDetail(e) {
    wx.navigateTo({
      url: '/page/API/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: app.getShareText().title,
      path: 'page/API/index?id=' + this.data.taskId,
    }
  }
})
