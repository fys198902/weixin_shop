// pages/shouquan/shouquan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sessionkey: ''
  },

  onLoad: function (options) {
    this.setData({
      sessionkey: wx.getStorageSync('sessionkey')
    })
  },

  copy(){
    var that = this;
    wx.setClipboardData({
      data: that.data.sessionkey,
    })
  }
})