// page/API/pages/activity/new-comer/new-comer-index/new-comer-index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:"http://qiniu.blingblingstar.com/miniappyifenzhuan.png",
    showh5activity: true,
    h5image: 'http://qiniu.blingblingstar.com/h5banner.png',
    showModal: false,
    taskData: {},
    needMoney: null,
    needCount: null,
    finishMoney: null,
    sumMoney:null,
    taskId: "",
    bar1: 0,
    bar2:400
  },

  /**
   * 生命周期函数--监听页面加载
   */
  openModal() {
    this.setData({
      showModal: true
    })
  },
  closeModal() {
    this.setData({
      showModal: false
    })
  },
  onLoad: function(options) {
    wx.showLoading({
      title:'加载中',
      mask:true
    });
    console.log(options)
    if (options.taskId) {
      this.setData({
        taskId: options.taskId
      })
      app.sendGetRequest({
        action: "getAidInfo",
        id: options.taskId
      }).then(res => {
        console.log('-----------------------------');
        console.log(res)
        this.getCommodity()
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
                sumMoney:temp.data.aidActivityData.money
              })
            }
            this.setData({
              bar1:400 * this.data.finishMoney / this.data.sumMoney,
              bar2: 400 - 400 * this.data.finishMoney / this.data.sumMoney
            })
          }
        }
          wx.hideLoading();
      }).catch(err => {
        console.log(err)
        wx.hideLoading();
      })
    }else{
        wx.hideLoading();
    }

  },
  getCommodity(){
    app.sendGetRequest({
      action: "listHotCommodity"
    }).then(res => {
      if (res && !res.sessionId)
        this.reLogin();
      else {
        let temp = app.getCallData(res);
        if (temp != null) {
          if (temp.msg == "success") {
            if (temp.data && temp.data.length > 0) {
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
              console.log(this.data.commodity)
            }
          }
        }
      }
    }).catch(err => {
      console.log(err)
    })
  },
  goToH5(){
    wx.navigateTo({
      url: '/page/API/pages/h5/h5?taskId='+this.data.taskId,
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
  goToProductDetail(e) {
    wx.navigateTo({
      url: '/page/API/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id,
    })
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
      path: 'page/API/index?id=' + this.data.taskId
    }
  }
})
