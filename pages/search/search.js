// pages/search/search.js
const app = getApp()

Page({
  data: {
    addgouwuche_show: false,
    addgouwuche: {},
    wuliaolist: [],
    vw_width: wx.getSystemInfoSync().windowWidth,
  },

  onLoad: function (options) {

  },

  searchwuliao(e) {
    var that = this;
    app.sendposturl('/index/searchwuliao', { searchval: e.detail }, function (res) {
      that.setData({
        wuliaolist: res.data
      })
    })
  },

  goxiangxi(e) {
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/xiangxi/xiangxi?id=' + id,
    })
  },

  addgouwuche_close() {
    var that = this;
    this.setData({
      addgouwuche_show: false
    })
  },

  showgouwuche(e) {
    console.log(e)
    var ftmp = {
      id: e.currentTarget.dataset.id,
      wuliaoname: e.currentTarget.dataset.wuliaoname,
      imgurl: e.currentTarget.dataset.wuliaoimg,
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

  changegouwucheshul(e) {
    this.data.addgouwuche.goumaishul = e.detail
    this.setData({
      addgouwuche: this.data.addgouwuche
    })
  },

  gogouwuche(){
    wx.navigateTo({
      url: '/pages/index/index?activemenu=2',
    })
  },

  gozhuye(){
    wx.navigateTo({
      url: '/pages/index/index?activemenu=0',
    })
  },

  lijigoumai(){
    app.fukuan(this.data.addgouwuche, 'obj')
  }
})