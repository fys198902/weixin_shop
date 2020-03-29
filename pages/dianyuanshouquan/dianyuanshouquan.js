const app = getApp()

Page({
  data: {

  },

  onLoad: function (options) {
    if (options.scene) {
      const scene = decodeURIComponent(options.scene)
      wx.login({
        success(res) {
          app.sendposturl('/index/adddianyuan', {
            code: res.code,
            sessionkey: wx.getStorageSync('sessionkey'),
            dianpuid: scene
          }, function(res){
            if(res.data.code == 0){
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '添加成功',
                complete: function(){
                  wx.navigateTo({
                    url: '/pages/index/index',
                  })
                }
              })
            }else{
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: res.data.msg,
                complete: function () {
                  wx.navigateTo({
                    url: '/pages/index/index',
                  })
                }
              })
            }
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '获取店铺信息失败',
      })
    }
  },
})