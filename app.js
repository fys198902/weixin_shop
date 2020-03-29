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
    root_url: "https://jxc.xmoj.cn/qingdao/"
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
    var peisongdizhi = wx.getStorageSync('peisongdizhi');
    var lianxfs = wx.getStorageSync('lianxfs');
    if (!peisongdizhi || peisongdizhi == null || peisongdizhi == '' || !lianxfs || lianxfs == null || lianxfs == ''){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请先设置配送地址和联系方式',
        success: function(){
          wx.navigateTo({
            url: '/pages/peisongdizhi/peisongdizhi',
          })
        }
      })
    }else{
      wx.showModal({
        title: '请再次确认配送地址',
        cancelText: '更换',
        content: peisongdizhi + '\r\n' + lianxfs,
        success: function(res){
          if(res.confirm){
            wx.requestSubscribeMessage({
              tmplIds: ['3g0lAJ7w4RKNyO9e5kXRrr45WG-4MdN1SDTdb-04K90',
              '15oTT6f7tch1ECWthn2szcdKIVyx7_BQlw6YF_jqd3o'],
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
                      if (postdata.jianjie == '抢购商品'){
                        if (postdata.goumaishul > 1){
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

                    if(!jixu){
                      wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '抢购商品仅能抢购一份',
                      })
                    }else{
                      that.zhifu(senddata);
                    }
                  }
                })
              }
            })
          }else{
            wx.navigateTo({
              url: '/pages/peisongdizhi/peisongdizhi',
            })
          }
        }
      })
    }
  },
  zhifu(senddata){
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