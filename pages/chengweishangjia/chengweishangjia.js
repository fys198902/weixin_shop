// pages/chengweishangjia/chengweishangjia.js
const app = getApp()

Page({
  data: {
    dianpuname: '',
    dianpudizhi: '',
    zhuyingyewu: '',
    lianxr: '',
    lianxfs: '',
    zhaopaiimg: '',
    shenfenzhengzhengimg: '',
    shenfenzhengfanimg: '',
    yingyezhizhaoimg: '',
    shipinjingyingxukezhengimg: '',
    vw_width: wx.getSystemInfoSync().windowWidth,
  },

  onLoad: function (options) {
    this.setData({
      imgheight: wx.getSystemInfoSync().windowWidth / 2
    })
  },

  upload(event, callback) {
    this.setData({
      imgheight: wx.getSystemInfoSync().windowWidth
    })
    const { file } = event.detail;
    wx.uploadFile({
      url: app.globalData.root_url + '/index/shangpinimgupload',
      filePath: file.path,
      name: 'file',
      formData: { user: 'test' },
      success(result) {
        callback && callback(result);
      }
    });
  },

  dianpunameinput(e){
    this.setData({
      dianpuname: e.detail
    })
  },

  dianpudizhiinput(e) {
    this.setData({
      dianpudizhi: e.detail
    })
  },

  zhuyinginput(e) {
    this.setData({
      zhuyingyewu: e.detail
    })
  },

  lianxrinput(e) {
    this.setData({
      lianxr: e.detail
    })
  },

  lianxfsinput(e) {
    this.setData({
      lianxfs: e.detail
    })
  },

  shenqing(){
    var that = this;
    if(that.data.dianpuname == '' || that.data.dianpudizhi == '' || that.data.zhuyingyewu == '' || that.data.lianxr == '' || that.data.lianxfs == '' || that.data.zhaopaiimg == '' || that.data.shenfenzhengzhengimg == '' || that.data.shenfenzhengfanimg == '' || that.data.yingyezhizhaoimg == '' || that.data.shipinjingyingxukezhengimg == ''){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '表单不全',
      })
      return false;
    }

    wx.requestSubscribeMessage({
      tmplIds: ['pm90-j1YU8hhQqZFEYZ9Zjy5zKpV2yaJkuLFFWgPBf0'],
      success(res) {
        app.sendposturl("/index/shangjiashenqingdo", {
          sessionkey: wx.getStorageSync('sessionkey'),
          dianpuname: that.data.dianpuname,
          dianpudizhi: that.data.dianpudizhi,
          zhuyingyewu: that.data.zhuyingyewu,
          lianxr: that.data.lianxr,
          lianxfs: that.data.lianxfs,
          zhaopaiimg: that.data.zhaopaiimg,
          shenfenzhengzhengimg: that.data.shenfenzhengzhengimg,
          shenfenzhengfanimg: that.data.shenfenzhengfanimg,
          yingyezhizhaoimg: that.data.yingyezhizhaoimg,
          shipinjingyingxukezhengimg: that.data.shipinjingyingxukezhengimg
        }, function (res) {
          if (res.data.newid > 0) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              complete: function () {
                wx.request({
                  url: app.globalData.root_url + '/index/sendnewshangjiamsg',
                  data: {
                    id: res.data.newid
                  }
                })
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '保存失败',
            })
          }

        })
      }
    })
    
  },

  uploadzhaopai(e){
    var that = this;
    this.upload(e, function(res){
      res = JSON.parse(res.data);
      that.setData({
        zhaopaiimg: 'https://jxc.xmoj.cn/uploads/zhao/' + res.src
      })
    })
  },

  uploadzhaopai(e) {
    var that = this;
    this.upload(e, function (res) {
      res = JSON.parse(res.data);
      that.setData({
        zhaopaiimg: 'https://jxc.xmoj.cn/uploads/zhao/' + res.src
      })
    })
  },

  uploadshenfenzhengzheng(e) {
    var that = this;
    this.upload(e, function (res) {
      res = JSON.parse(res.data);
      that.setData({
        shenfenzhengzhengimg: 'https://jxc.xmoj.cn/uploads/zhao/' + res.src
      })
    })
  },

  uploadshenfenzhengfan(e) {
    var that = this;
    this.upload(e, function (res) {
      res = JSON.parse(res.data);
      that.setData({
        shenfenzhengfanimg: 'https://jxc.xmoj.cn/uploads/zhao/' + res.src
      })
    })
  },

  uploadyingyezhizhao(e) {
    var that = this;
    this.upload(e, function (res) {
      res = JSON.parse(res.data);
      that.setData({
        yingyezhizhaoimg: 'https://jxc.xmoj.cn/uploads/zhao/' + res.src
      })
    })
  },

  uploadshipinjingyingxukezheng(e) {
    var that = this;
    this.upload(e, function (res) {
      res = JSON.parse(res.data);
      that.setData({
        shipinjingyingxukezhengimg: 'https://jxc.xmoj.cn/uploads/zhao/' + res.src
      })
    })
  },
})