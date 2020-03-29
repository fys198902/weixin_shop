// pages/dianpu/dianpu.js
const app = getApp()

Page({
  data: {
    goumaishul: 0,
    addgouwuche: [],
    addgouwuche_show: false,
    activeNames: [],
    dianpu: [],
    vw_width: wx.getSystemInfoSync().windowWidth,
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  onLoad: function (options) {
    var that = this;
    app.sendposturl('/index/getdianpuallinfo',{
      dianpuid: options.dianpuid
    }, function(res){
      that.setData({
        dianpu: res.data
      })
    })
  },
  
  boda(e) {
    var phone = e.target.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  showgouwuche(e) {
    var ftmp = {
      id: e.currentTarget.dataset.id,
      wuliaoname: e.currentTarget.dataset.wuliaoname,
      imgurl: e.currentTarget.dataset.imgurl,
      jianjie: e.currentTarget.dataset.jianjie,
      shoujia: e.currentTarget.dataset.shoujia,
      danwei: e.currentTarget.dataset.danwei,
      goumaishul: 1
    };
    this.setData({
      goumaishul: 1,
      addgouwuche: ftmp,
      addgouwuche_show: true,
    })
  },

  addgouwuche() {
    var that = this;
    var cunzai = false
    app.globalData.gouwuche.forEach((val, index) => {
      if (val.id == that.data.addgouwuche.id) {
        cunzai = true;
        app.globalData.gouwuche[index].goumaishul++
      }
    })

    if (!cunzai) {
      app.globalData.gouwuche.push(this.data.addgouwuche)
    }

    this.setData({
      gouwuche: app.globalData.gouwuche,
      gouwucheitemshul: app.globalData.gouwuche.length
    })
  },

  lijigoumai() {
    var that = this;
    app.fukuan(this.data.addgouwuche, 'obj', function (res) {
      that.setData({
        addgouwuche_show: false
      })
    });
  },

  gogouwuche() {
    wx.navigateTo({
      url: '/pages/index/index?activemenu=2',
    })
  },

  addgouwuche_close() {
    var that = this;
    this.setData({
      addgouwuche_show: false
    })
  },

  goxiangxi(e) {
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/xiangxi/xiangxi?id=' + id,
    })
  },

  yulan(e){
    var src = e.target.dataset.src;
    wx.previewImage({
      urls: [src],
      current: src
    })
  }
})