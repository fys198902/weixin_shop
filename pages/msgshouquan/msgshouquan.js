// pages/msgshouquan/msgshouquan.js
const app = getApp()

Page({
  data: {
    dianpuinfo: [],
    dianyuan: [],
    img: '',
    vw_width: wx.getSystemInfoSync().windowWidth,
  },

  onLoad: function(options) {
    var that = this;
    app.sendposturl("/index/getdianpuinfo", {
      sessionkey: wx.getStorageSync('sessionkey'),
    }, function (res) {
      that.setData({
        dianpuinfo: res.data.info,
        dianyuan: res.data.dianyuan
      })
    })

    wx.getImageInfo({
      src: app.globalData.root_url + '/index/getdianpuma?sessionkey=' + wx.getStorageSync('sessionkey'),
      success: function(res){
        that.setData({
          img: res.path
        })
      }
    })
  },

  deldianyuan(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function(res){
        if(res.confirm){
          var id = e.target.dataset.id;
          var index = e.target.dataset.index;
          app.sendposturl('/index/deldianyuan', {
            userid: id,
            sessionkey: wx.getStorageSync('sessionkey')
          }, function (res) {
            if (res.data == '操作成功') {
              wx.showToast({
                title: res.data,
                complete: function () {
                  that.data.dianyuan.splice(index, 1);
                  that.setData({
                    dianyuan: that.data.dianyuan
                  })
                }
              })
            }else{
              wx.showModal({
                title: '提示',
                content: res.data,
              })
            }
          })
        }
      }
    })
  }
})