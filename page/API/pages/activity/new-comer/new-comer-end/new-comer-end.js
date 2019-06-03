// page/API/pages/activity/new-comer/new-comer-end/new-comer-end.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFriendList: false,
    animationData: {},
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title:'加载中',
      mask:true
    });
    app.sendGetRequest({
      action: "listFinishAid"
    }).then(res => {
      console.log(res)
      if (res.serviceCall) {
        let temp = app.getCallData(res)
        if (temp.msg == "success") {
          if (temp.list && temp.list.length > 0) {
            temp.list.forEach(item => {
              item.showFriendList = false
            })
            this.setData({
              list: temp.list
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
  openFriendList(e) {
    let id = e.currentTarget.dataset.id;
    let tempList = this.data.list;
    tempList.forEach(item => {
      if (item.aidActivityData.aidId == id) {
        if (item.showFriendList === true)
          item.showFriendList = false
        else
          item.showFriendList = true;
      } else {
        item.showFriendList = false;
      }
    })
    this.setData({
      list: tempList
    })
  },
  closeFriendList(e) {
    let id = e.currentTarget.dataset.id;
    let tempList = this.data.list;
    tempList.forEach(item => {
      item.showFriendList = false;
    })
    this.setData({
      list: tempList
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  goToIndex(){
    wx.switchTab({
      url: '/page/API/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
