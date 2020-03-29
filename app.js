//app.js
// var util = require('../../utils/util.js')
//< wxs module = "utils" src = "../../utils/utils.wxs" ></wxs >
// app.sendgeturl('', '', function(data){
//   console.log(data)
// })




App({
  onLaunch: function () {
    var that = this;
    wx.login({
      success(res) {
        that.sendposturl('/index/getsession', { 
          code: res.code,
          sessionkey: wx.getStorageSync('sessionkey')
        }, function (res) {
          if (res.statusCode == 200){
            wx.setStorageSync('sessionkey', res.data)
          }
        })
      }
    })
  },
  globalData: {
    peisongdizhi: '',
    lianxfs: '',
    gouwuche: [],
    root_url: "https://jxc.xmoj.cn/zhao/"
  },
  sendgeturl(furl, fdata, callback){
    wx.showLoading({
      title: '加载中..',
    })
    var that = this;
    wx.request({
      url: that.globalData.root_url + furl,
      data: {
        data: JSON.stringify(fdata)
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        wx.hideLoading()
        callback && callback(result);
      }
    });
  },

  sendposturl(furl, fdata, callback) {
    wx.showLoading({
      title: '加载中..',
    })
    var that = this;
    wx.request({
      url: that.globalData.root_url + furl,
      data: {
        data: JSON.stringify(fdata)
      },
      method: 'POST',
      dataType: 'json',
      success: (result) => {
        wx.hideLoading()
        callback && callback(result);
      }
    });
  },

  fukuan(postdata, ftype, callback){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '点餐当日送达，蔬菜、水果、海鲜、肉类次日送到（晚10点前下单）',
      complete: function(res){
        if(res.confirm){
          var peisongdizhi = wx.getStorageSync('peisongdizhi');
          var lianxfs = wx.getStorageSync('lianxfs');
          if (!peisongdizhi || peisongdizhi == null || peisongdizhi == '' || !lianxfs || lianxfs == null || lianxfs == '') {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '请先设置配送地址和联系方式',
              success: function () {
                wx.navigateTo({
                  url: '/pages/peisongdizhi/peisongdizhi',
                })
              }
            })
          } else {
            wx.showModal({
              title: '请再次确认配送地址',
              cancelText: '更换',
              content: peisongdizhi + '\r\n' + lianxfs,
              success: function (res) {
                if (res.confirm) {
                  wx.requestSubscribeMessage({
                    tmplIds: ['39NDIGn6r79cDyw6DqZ5_TCLQujzYkkE2zPg6fPknW0'],
                    success(res) {
                      var senddata = {
                        code: '',
                        sessionkey: wx.getStorageSync('sessionkey'),
                        peisongdizhi: '',
                        lianxfs: '',
                        ordertotal: 0,
                        wuliao: []
                      }

                      wx.login({
                        success(res) {
                          senddata.code = res.code
                          senddata.peisongdizhi = peisongdizhi;
                          senddata.lianxfs = lianxfs;
                          var jixu = true;
                          if (ftype == 'obj') {
                            if (postdata.jianjie == '抢购商品') {
                              if (postdata.goumaishul > 1) {
                                jixu = false;
                              }
                            }
                            senddata.ordertotal = parseFloat(postdata.shoujia) * parseFloat(postdata.goumaishul)
                            senddata.wuliao.push(postdata)
                          } else {
                            var total = 0;
                            postdata.forEach((val, index) => {
                              total += parseFloat(val.shoujia) * parseFloat(val.goumaishul)
                              if (val.jianjie == '抢购商品') {
                                if (val.goumaishul > 1) {
                                  jixu = false;
                                  return false;
                                }
                              }
                            })
                            senddata.ordertotal = total;
                            senddata.wuliao = postdata
                          }

                          if (!jixu) {
                            wx.showModal({
                              title: '提示',
                              showCancel: false,
                              content: '抢购商品仅能抢购一份',
                            })
                          } else {
                            if(senddata.ordertotal < 100){
                              wx.showModal({
                                title: '温馨提示',
                                content: '订单金额小于100元，需额外支付配送外10元',
                                complete: function(res){
                                  senddata.ordertotal = senddata.ordertotal + 10;
                                  if(res.confirm){
                                    that.zhifu(senddata, callback);
                                  }
                                }
                              })
                            }
                            
                          }
                        }
                      })
                    }
                  })
                } else {
                  wx.navigateTo({
                    url: '/pages/peisongdizhi/peisongdizhi',
                  })
                }
              }
            })
          }
        }
      }
    })
    
  },
  zhifu(senddata, callback){
    var that = this;
    that.sendposturl('/Wxpay/pay', senddata, function (result) {
      if (result.data.code == 0) {
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
      } else {
        wx.showModal({
          title: '提示',
          content: result.data.msg,
        })
      }

    })
  }
})