// pages/addguanli/addguanli.js
const app = getApp()

Page({
  data: {
    img: '',
    vw_width: wx.getSystemInfoSync().windowWidth,
  },

  onLoad: function (options) {
    var that = this;
    wx.getImageInfo({
      src: app.globalData.root_url + '/index/getaddguanlima?sessionkey=' + wx.getStorageSync('sessionkey'),
      success: function (res) {
        that.setData({
          img: res.path
        })
      }
    })
  },
})