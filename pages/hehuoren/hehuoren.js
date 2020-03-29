// pages/hehuoren/hehuoren.js
const app = getApp()

Page({
  data: {
    imgurl: [],
    sessionkey: wx.getStorageSync('sessionkey'),
    xingm: '',
    fphone: '',
    jingzhengyoushi: '',
    userinfo: '',
    status: 0,
    widthview: 0,
    heightview: 0,
    lujing: '',
    statusjine: {
      yue: 0,
      zuorishouru: 0,
      zongshouru: 0
    }
  },

  onLoad: function(options) {
    var that = this;
    app.sendposturl("index/fenxiaostatus", {
      sessionkey: wx.getStorageSync('sessionkey')
    }, function(res) {
      that.setData({
        statusjine: res.data
      })
    })


    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          widthview: res.screenWidth,
        })
      },
    })


    if (options.status == 1) {
      wx.showModal({
        title: '提示',
        content: '申请中，请等待',
        complete: function(res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } 
    if (options.status == 2) {
      this.setData({
        status: options.status,
        userinfo: wx.getStorageSync('userinfo')
      })
    }

    if (options.status == 3) {
      wx.showModal({
        title: '提示',
        content: '您的申请已被退回，请重新提交',
        complete: function(){
          that.setData({
            status: 0,
            userinfo: wx.getStorageSync('userinfo')
          })
        }
      })
      
    }
  },

  xingminput(e) {
    this.setData({
      xingm: e.detail
    })
  },

  fphoneinput(e) {
    this.setData({
      fphone: e.detail
    })
  },

  jingzhengyoushiinput(e) {
    this.setData({
      jingzhengyoushi: e.detail
    })
  },

  afterRead(event) {
    wx.showLoading({
      title: '上传中..',
    })
    var that = this;
    const {
      file
    } = event.detail;
    wx.uploadFile({
      count: 1,
      url: app.globalData.root_url + '/index/shoukuanmaupload', 
      filePath: file.path,
      name: 'file',
      success(res) {
        wx.hideLoading()
        that.setData({
          imgurl: 'https://jxc.xmoj.cn' + '/uploads/test/' + res.data.replace(/"/g, '')
        })
      }
    });
  },

  shenqingdo() {
    var that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['pm90-j1YU8hhQqZFEYZ9Zjy5zKpV2yaJkuLFFWgPBf0'],
      success(res) {
        if (that.data.xingm == '' || that.data.fphone == '') {
          wx.showToast({
            title: '表单不全'
          })
          return;
        }
        app.sendposturl('index/addfenxiao', that.data, function(res) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg,
            complete: function(res1) {
              if (res.data.code == 0) {
                app.sendposturl('/index/sendnewfenxiaoimg', {
                  newid: res.data.newid,
                })
              }
              wx.navigateBack({
                delta: 1
              })
            }
          })
        })
      }
    })
  },
  gettuiguang() {
    wx.showLoading({
      title: '生成中..'
    })
    var that = this;
    wx.getImageInfo({
      src: '../images/backimg.png',
      success: function(res) {
        var huansuan = res.width / res.height
        var backimg = '../images/backimg.png';
        var erweima = '';
        var fcanvat = wx.createCanvasContext('mycanvat', that);
        wx.getImageInfo({
          src: app.globalData.root_url + '/index/fgetxiaochengxuma?sessionkey=' + wx.getStorageSync('sessionkey'),
          success: function(res1) {
            erweima = res1.path
            fcanvat.drawImage(backimg, 0, 0, 400, 720);
            fcanvat.drawImage(erweima, 46, 720 - 143, 110, 110);
            fcanvat.draw()
            setTimeout(function () {
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 400,
                height: 720,
                destWidth: 400,
                destHeight: 720,
                canvasId: 'mycanvat',
                success(res) {
                  that.setData({
                    lujing: res.tempFilePath
                  })
                  wx.hideLoading()
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function (res) {
                      wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '图片已保存在您的相册'
                      })
                    }
                  })
                }
              })
            }, 2000)

          }
        })
      }
    })
  },

  sendtixian() {
    var that = this;
    if (that.data.statusjine.yue < 100) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '满100元，方可提现'
      })
    } else {
      app.sendposturl("/index/tixiando", {
        sessionkey: wx.getStorageSync('sessionkey'),
        jine: that.data.statusjine.yue
      }, function(res) {
        wx.showToast({
          title: res.data
        })
      })
    }
  },

  gotichengguize() {
    wx.navigateTo({
      url: "/pages/tichengguize/tichengguize"
    })
  }
})