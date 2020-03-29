// pages/weiwancheng/weiwancheng.js
const app = getApp()

Page({
  data: {
    fdata: []
  },

  onLoad: function (options) {
    var that = this;
    wx.login({
      success(res){
        app.sendposturl('/index/getdaisonghuo', {
          code: res.code,
          sessionkey: wx.getStorageSync('sessionkey'),
        }, function (res) {
          that.setData({
            fdata: res.data
          })
        })
      }
    })
  },

  goxiangxi(e) {
    wx.navigateTo({
      url: '/pages/xiangxi/xiangxi?id=' + e.currentTarget.dataset.id,
    })
  },

  yisongda(e) {
    var that = this;
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    var jiaoyi_orderid = that.data.fdata[index].jiaoyi_orderid
    app.sendposturl('index/yisongda', { id: id },
      function (res) {
        wx.showModal({
          title: '提示',
          content: res.data,
          complete: function () {
            if (res.data == '操作成功') {
              that.data.fdata.splice(index, 1);
              that.setData({
                fdata: that.data.fdata
              })
              app.sendposturl('/index/sendsongdamsg', {
                jiaoyi_orderid: jiaoyi_orderid
              })
            }
          }
        })

      })
  },
  boda(e){
    var phone = e.target.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  daohang(e){
    var latitude = e.currentTarget.dataset.latitude;
    var longitude = e.currentTarget.dataset.longitude;
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  }
})