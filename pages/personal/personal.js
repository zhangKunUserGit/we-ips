const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
  },
  goApplyDesign() {
    wx.navigateTo({
      url: '../applyDesign/applyDesign'
    });
  },
  goApplyMaterials() {
    wx.navigateTo({
      url: '../applyMaterials/applyMaterials'
    });
  },
  goApplyConstruction() {
    wx.navigateTo({
      url: '../applyConstruction/applyConstruction'
    });
  },
  goApplyCabinet() {
    wx.navigateTo({
      url: '../applyCabinet/applyCabinet'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心'
    });
    var that = this;
    console.log(app.globalData.userInfo);
    if (!app.globalData.userInfo) {
      app.userInfoReadyCallback = (user) => {
        that.setData({
          userInfo: user.userInfo,
        })
      };
    } else {
      that.setData({
        userInfo: app.globalData.userInfo,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})