// pages/xiangxi/xiangxi.js
const app = getApp()

Page({

  data: {
    vw_width: wx.getSystemInfoSync().windowWidth,
    wuliao: {},
    goumaishul: 1,
    gouwucheshul: 0,
  },

  onLoad: function (options) {
    var that = this;
    var id = 0;
    if (options.scene) {
      const scene = decodeURIComponent(options.scene)
      var data = scene.split(';')
      id = data[1];
      wx.login({
        success(res){
          app.sendposturl('/index/setfenxiaoma', {
            code: res.code,
            scene: data[0],
            test: scene
          })
        }
      })
    }else{
      id = options.id
    }

    app.sendgeturl('/index/getshangpinxiangxi', { 
      id: id,
      sessionkey: wx.getStorageSync('sessionkey')
    }, function (res) {
      that.setData({
        wuliao: res.data,
        gouwucheshul: app.globalData.gouwuche.length
      })
    })
    
  },

  changegoumaishul(e) {
    this.setData({
      goumaishul: e.detail
    })
  },

  gogouwuche() {
    wx.navigateTo({
      url: '/pages/index/index?activemenu=2',
    })
  },

  godianpu() {
    var that = this;
    wx.navigateTo({
      url: '/pages/dianpu/dianpu?dianpuid=' + that.data.wuliao.dianpu_id,
    })
  },


  onShareAppMessage: function (res) {
    var that = this;
    var goods_id = that.data.wuliao.id;//获取产品id
    var goods_shoujia = that.data.wuliao.shoujia;
    var goods_danwei = that.data.wuliao.danwei;
    var goods_title = that.data.wuliao.wuliaoname;//获取产品标题
    var goods_img = that.data.wuliao.wuliaoimg;//产品图片
    return {
      title: '快来购买：' + goods_title + '  仅' + goods_shoujia + '元/' + goods_danwei,
      path: '/pages/xiangxi/xiangxi?scene=' + that.data.wuliao.fenxiaoma + ';' + goods_id,
      imageUrl: goods_img
    }
  },

  addgouwuche() {
    var that = this;
    var cunzai = false
    app.globalData.gouwuche.forEach((val, index) => {
      if (val.id == that.data.wuliao.id) {
        cunzai = true
        app.globalData.gouwuche[index].goumaishul = app.globalData.gouwuche[index].goumaishul + 1
      }
    })

    if (!cunzai) {
      app.globalData.gouwuche.push({
        id: that.data.wuliao.id,
        wuliaoname: that.data.wuliao.wuliaoname,
        imgurl: that.data.wuliao.wuliaoimg,
        jianjie: that.data.wuliao.jianjie,
        danwei: that.data.wuliao.danwei,
        shoujia: that.data.wuliao.shoujia,
        goumaishul: that.data.goumaishul
      })
    }

    that.setData({
      gouwucheshul: app.globalData.gouwuche.length
    })
  },

  lijigoumai() {
    var that = this;
    app.fukuan({
      id: that.data.wuliao.id,
      wuliaoname: that.data.wuliao.wuliaoname,
      imgurl: that.data.wuliao.wuliaoimg,
      jianjie: that.data.wuliao.jianjie,
      danwei: that.data.wuliao.danwei,
      shoujia: that.data.wuliao.shoujia,
      goumaishul: that.data.goumaishul
    }, 'obj');
  },

  fenxiangpengyouquan() {
    wx.showLoading({
      title: '生成中...',
    })
    var that = this;
    var backimg = that.data.wuliao.wuliaoimg
    wx.getImageInfo({
      src: backimg,
      success: function (res) {
        backimg = res.path
        wx.getImageInfo({
          src: app.globalData.root_url + '/index/fgetfenxiangxuma?wuliaoid=' + that.data.wuliao.id + '&sessionkey=' + wx.getStorageSync('sessionkey'),
          success: function (res) {
            var erweima = res.path
            var fcanvat = wx.createCanvasContext('fenxiang', this)
            fcanvat.drawImage(backimg, 0, 0, 600, 600);
            fcanvat.drawImage(erweima, 20, 420, 160, 160);
            fcanvat.rect(320, 20, 280, 60)
            fcanvat.setFillStyle('white')
            fcanvat.fill()
            fcanvat.rect(20, 380, 160, 30)
            fcanvat.setFillStyle('white')
            fcanvat.fill()
            fcanvat.setFillStyle('#ed4014')
            fcanvat.setFontSize(40)
            fcanvat.fillText('仅' + that.data.wuliao.shoujia + '元/' + that.data.wuliao.danwei, 330, 64)
            fcanvat.setFontSize(14)
            fcanvat.fillText('扫一扫或长按识别购买', 30, 400)
            fcanvat.draw()
            setTimeout(function () {
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 600,
                height: 600,
                destWidth: 600,
                destHeight: 600,
                canvasId: 'fenxiang',
                success: function(res){
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function(res){
                      wx.hideLoading()
                      wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '图片已保存在您的相册',
                      })
                    }
                  })
                  
                  
                }
              }, this)
              
            },  1500)
          }
        })
      }
    })
  }
})