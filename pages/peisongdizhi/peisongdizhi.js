// pages/shouhuodizhi/shouhuodizhi.js
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../qqmap-wx-jssdk/qqmap-wx-jssdk.js');
// 实例化API核心类
const wxMap = new QQMapWX({
  key: 'EVNBZ-BI5C4-TRHUR-DY3HH-V6MKJ-LEB32'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    peisongdizhi: '',
    lianxfs: '',
    latitude: '',
    longitude: '',
    dizhi: '',
    isdisabled: false,
    xianshimap: false,
  },

  onLoad: function (options) {
    var that = this;
    if (options.dizhi) {
      
    }else{
      that.setData({
        peisongdizhi: wx.getStorageSync('peisongdizhi'),
        lianxfs: wx.getStorageSync('lianxfs')
      })
    }


    wx.showModal({
      title: '提示',
      content: '是否自动定位当前位置',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '定位中..',
          })

          wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.userLocation']) {
                wx.authorize({
                  scope: 'scope.userLocation',
                  success(res) {
                    wx.getLocation({
                      type: 'gcj02',
                      isHighAccuracy: false,
                      success(res) {
                        const latitude = res.latitude
                        const longitude = res.longitude

                        wxMap.reverseGeocoder({
                          location: {
                            latitude: latitude,
                            longitude: longitude,
                          },
                          success: function (res) {
                            wx.hideLoading()
                            that.setData({
                              peisongdizhi: res.result.address,
                              isdisabled: true,
                              latitude: latitude,
                              longitude: longitude,
                              xianshimap: true
                            })
                          },
                          fail: function (res) {
                            wx.hideLoading()
                            wx.showToast({
                              title: '定位失败',
                            })
                          }
                        })
                      }
                    })
                  }
                })
              } else {
                wx.getLocation({
                  type: 'gcj02',
                  isHighAccuracy: false,
                  success(res) {
                    const latitude = res.latitude
                    const longitude = res.longitude

                    wxMap.reverseGeocoder({
                      location: {
                        latitude: latitude,
                        longitude: longitude,
                      },
                      success: function (res) {
                        wx.hideLoading()
                        that.setData({
                          peisongdizhi: res.result.address,
                          isdisabled: true,
                          latitude: latitude,
                          longitude: longitude,
                          xianshimap: true
                        })
                      },
                      fail: function (res) {
                        wx.hideLoading()
                        wx.showToast({
                          title: '定位失败',
                        })
                      }
                    })
                  }
                })
              }
            },
          })
        }
      }
    })
  },


  peisonginput(e) {
    this.setData({
      peisongdizhi: e.detail.value
    })
  },

  lianxfsinput(e) {
    this.setData({
      lianxfs: e.detail.value
    })
  },

  save() {
    var that = this;
    if (this.data.peisongdizhi == '' || this.data.peisongdizhi == null || this.data.lianxfs == '' || this.data.lianxfs == null) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '地址和联系方式必填',
      })
    } else {
      wx.showLoading({
        title: '保存中..',
      })

      wx.login({
        success: function (res) {
          app.sendposturl('/index/savedizhi',{
            code: res.code,
            sessionkey: wx.getStorageSync('sessionkey'),
            peisongdizhi: that.data.peisongdizhi,
            lianxfs: that.data.lianxfs,
            latitude: that.data.latitude,
            longitude: that.data.longitude
          }, function(res){
            wx.hideLoading()
            wx.setStorageSync('peisongdizhi', that.data.peisongdizhi);
            wx.setStorageSync('lianxfs', that.data.lianxfs);
            wx.navigateBack({
              delta: 1
            })
          })
        }
      })
    }
  }
})