// pages/daishenheshangjia/daishenheshangjia.js
const app = getApp()


Page({
  data: {
    dianpuinfo: [], 
    activeNames: [0],
    vw_width: wx.getSystemInfoSync().windowWidth,
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  onLoad: function (options) {
    var that = this;
    app.sendposturl('/index/daishenheshangjia', {}, function (res) {
      that.setData({
        dianpuinfo: res.data
      })
    });
  },

  boda(e) {
    var phone = e.target.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  jujue(e){
    var that = this;
    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    wx.login({
      success(res) {
        app.sendposturl('/index/setdianpustatus', {
          code: res.code,
          sessionkey: wx.getStorageSync('sessionkey'),
          dianpuid: id,
          status: 2
        }, function (res) {
          wx.showModal({
            title: '提示',
            content: res.data,
            complete: function () {
              that.data.dianpuinfo.splice(index, 1);
              that.setData({
                dianpuinfo: that.data.dianpuinfo
              })
            }
          })
        })
      }
    })
    
  },

  tongyi(e) {
    var that = this;
    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    wx.login({
      success(res){
        app.sendposturl('/index/setdianpustatus', {
          code: res.code,
          sessionkey: wx.getStorageSync('sessionkey'),
          dianpuid: id,
          status: 1
        }, function(res){
          wx.showModal({
            title: '提示',
            content: res.data,
            complete: function(){
              that.data.dianpuinfo.splice(index, 1);
              that.setData({
                dianpuinfo: that.data.dianpuinfo
              })

              wx.request({
                url: app.globalData.root_url + '/index/fsenddianpustatusmsg',
                data:{
                  dianpuid: id
                }
              })
            }
          })
        })
      }
    })
  },
  yulan(e) {
    var src = e.target.dataset.src;
    wx.previewImage({
      urls: [src],
      current: src
    })
  }
})