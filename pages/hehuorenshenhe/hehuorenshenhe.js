// pages/hehuorenshenhe/hehuorenshenhe.js
const app = getApp()


Page({

  data: {
    fdata: []
  },

  onLoad: function (options) {
    var that = this;
    app.sendposturl("/index/gethehuoren", {}, function(res){
      that.setData({
        fdata: res.data
      })
    })
  },

  bodadianhua(e){
   var fphone = e.target.dataset.phone
    wx.makePhoneCall({
      phoneNumber: fphone
    })
  },

  setfenxiaostatus(e){
    var that = this;
    var id = e.target.dataset.id
    var status = e.target.dataset.status
    app.sendposturl("index/setfenxiaostatus", {
      id: id,
      sessionkey: wx.getStorageSync('sessionkey'),
      status: status
    }, function(res){
      wx.showModal({
        title: '提示',
        content: res.data,
        complete: function (res1) {
          if (res.data == '操作成功') {
            app.sendposturl("/index/fsendfenxiaosuccess", { id: id })
          }
        }
      })

      app.sendposturl("/index/gethehuoren", {}, function (res) {
        that.setData({
          fdata: res.data
        })
      })
    })
  }
})