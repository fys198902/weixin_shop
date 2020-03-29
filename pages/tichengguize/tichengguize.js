// pages/tichengguize/tichengguize.js
const app = getApp()

Page({
  data: {
    fdata: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.sendposturl("/index/getdanjianticheng", {}, function(res){
      that.setData({
        fdata: res.data
      })
    })
  },

})