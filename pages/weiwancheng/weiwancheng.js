// pages/weiwancheng/weiwancheng.js
const app = getApp()


Page({
  data: {
    status: 0,
    fdata: []
  },

  onLoad: function (options) {
    var that = this;
    var status = options.status
    app.sendposturl('/index/getweiwaicheng', {
      sessionkey: wx.getStorageSync('sessionkey'),
      status: status
    }, function(res){
      that.setData({
        fdata: res.data,
        status: status
      })
    })
  },

  goxiangxi(e){
    wx.navigateTo({
      url: '/pages/xiangxi/xiangxi?id=' + e.currentTarget.dataset.id,
    })
  },

  jiaoyidel(e){
    var that = this;
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    app.sendposturl('index/jiaoyidel', {
      id: id,
      sessionkey: wx.getStorageSync('sessionkey')
    }, function (res) {
      wx.showToast({
        title: res,
      })
      that.data.fdata.splice(index, 1);
      that.setData({
        fdata: that.data.fdata
      })
    })
  },

  sendjiaoyi(e){
    var that = this;
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    var jiaoyi_orderid = that.data.fdata[index].jiaoyi_orderid
    var jiaoyi_total = that.data.fdata[index].jiaoyi_total
    wx.login({
      success(res){
        app.sendposturl('/wxpay/zc_pay', {
          id: id,
          code: res.code,
          jiaoyi_orderid: jiaoyi_orderid,
          zongji: jiaoyi_total,
          sessionkey: wx.getStorageSync('sessionkey')
        }, function (result) {
          wx.requestPayment({
            timeStamp: result.data.timeStamp,
            nonceStr: result.data.nonceStr,
            package: result.data.package,
            signType: 'MD5',
            paySign: result.data.paySign,
            success(res) {
              callback && callback(res);
            },
          })
        })
      }
    })
  },
  yisongda(e) {
    var that = this;
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    var jiaoyi_orderid = that.data.fdata[index].jiaoyi_orderid
    app.sendposturl('index/yisongda', { id: id }, function (res) {
      wx.showModal({
        title: '提示',
        content: res.data,
        complete: function(){
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
  }
})