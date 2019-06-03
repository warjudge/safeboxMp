// page/API/pages/activity/new-comer/new-comeer-nav/new-comer-nav.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    showTask: false,
    diamondAccount: 0,
    list: {},
    processTaskId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  showTaskModal() {
    this.setData({
      showTask: true
    })
  },
  closeTaskModal() {
    this.setData({
      showTask: false
    })
  },

  show() {
    this.setData({
      showModal: true
    })
  },
  closeModal() {
    this.setData({
      showModal: false
    })
  },
  goToIndex() {
    this.showTaskModal()
    // wx.navigateTo({
    //   url: '../new-comer-index/new-comer-index',
    // })
  },
  goToProcessing() {
    if (this.data.processTaskId != '') {
      wx.navigateTo({
        url: '../new-comer-index/new-comer-index?taskId=' + this.data.processTaskId,
      })
    }
  },
  goToEnd() {
    if (this.data.list.finish != 0)
      wx.navigateTo({
        url: '../new-comer-end/new-comer-end',
      })
  },
  acceptTask() {
    app.sendGetRequest({
      action: "startAid"
    }).then(res => {
      console.log(res)
      if (res.serviceCall) {
        let temp = app.getCallData(res);
        if (temp.msg == "success") {
          this.setData({
            taskId: temp.id
          })
          this.closeModal()
          wx.navigateTo({
            url: '../new-comer-processing/new-comer-processing?taskId=' + temp.id,
          })
        } else {
          wx.showModal({
            content: temp.msg
          })
          this.closeModal();
        }
      }
    }).catch(err => {
      console.log(err)
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
    wx.showLoading({
      title:'加载中',
      mask:true
    });
    app.sendGetRequest({
      action: "listAid"
    }).then(res => {
      console.log(res)
      if (res.serviceCall) {
        let temp = app.getCallData(res);
        if (temp.msg == "success") {
          this.setData({
            diamondAccount: temp.diamondAccount,
            list: temp.listAidInfo
          })
          if (temp.aid) {
            this.setData({
              processTaskId: temp.aid
            })
          }
        }
      }
      wx.hideLoading();
    }).catch(err => {
      console.log(err)
      wx.hideLoading();
    })
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

  }
})
