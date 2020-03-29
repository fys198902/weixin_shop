// pages/addguanli/addguanlido.js
const app = getApp()

Page({
  data: {

  },
  onLoad: function (options) {
    wx.showLoading({
      title: '操作中，请等待',
    })
    wx.login({
      success(res){
        wx.request({
          url: app.globalData.root_url + '/index/setguanliyuan',
          method: "post",
          data:{
            sessionkey: wx.getStorageSync('sessionkey'),
            code: res.code
          },
          success: function(res){
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data,
              complete: function(){
                wx.navigateTo({
                  url: '/pages/index/index',
                })
              }
            })
          }
        })
      }
    })
  },

})