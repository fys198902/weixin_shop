// pages/shangpinweihu/shangpinweihu.js
const app = getApp()

Page({
  data: {
    wuliao: [],
    allwuliao: [],
    vw_width: wx.getSystemInfoSync().windowWidth
  },

  onShow: function (options) {
    var that = this;
    app.sendposturl("/index/getdianpushangpin", {
      sessionkey: wx.getStorageSync('sessionkey')
    }, function (res) {
      that.setData({
        wuliao: res.data,
        allwuliao: res.data
      })
    })
  },

  search(e) {
    var that = this;
    var ftmp = [];
    that.data.allwuliao.forEach((val, index) => {
      if (val.wuliaoname.indexOf(e.detail) > -1) {
        ftmp.push(val);
      }
    })
    that.setData({
      wuliao: ftmp
    })
  },
  xinzeng(e) {
    wx.navigateTo({
      url: '/pages/wuliao/add',
    })
  },

  goxiangxi(e) {
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/xiangxi/xiangxi?id=' + id,
    })
  },

  shangxiajia(e) {
    var that = this;
    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    wx.showModal({
      title: '提示',
      cancelText: '删除',
      confirmText: '上下架',
      content: '请选择删除还是上下架',
      success: function(res){
        if(res.confirm){
          app.sendposturl("/index/xcx_shangxiajia", {
            wuliaoid: id,
            status: that.data.wuliao[index].status == 1 ? 0 : 1,
            sessionkey: wx.getStorageSync('sessionkey')
          }, function (res){
            if (res.data == '操作成功') {
              wx.showToast({
                title: res.data,
                complete: function () {
                  that.data.wuliao[index].status = that.data.wuliao[index].status == 1 ? 0 : 1;
                  that.setData({
                    wuliao: that.data.wuliao
                  })
                }
              })

            } else {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '操作失败',
              })
            }
          })
        }else{
          app.sendposturl("/index/wuliaodel", {
            wuliaoid: id,
            sessionkey: wx.getStorageSync('sessionkey')
          }, function (res){
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              complete: function(){
                that.onShow()
              }
            })
          })
        }
      }
    })
    
  },

  xiugai(e) {
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/wuliao/update?id=' + id,
    })
  }
})