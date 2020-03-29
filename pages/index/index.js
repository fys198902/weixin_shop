//index.js
const app = getApp()

Page({
  data: {
    userinfo: {
      nickName: '尚未授权获取您的昵称',
      avatarUrl: ''
    },
    isguanli: true,
    imageURL: 'https://img.yzcdn.cn/vant/cat.jpeg',
    showgetuserinfo: false,
    searchval: '',
    xianshi_show: false,
    shouye_leibie_active: 0,
    vw_width: wx.getSystemInfoSync().windowWidth,
    vw_height: wx.getSystemInfoSync().windowHeight,
    shouye_leibie_active: 0,
    activemenu: 0,
    yixuanjine: 0,
    leibie_leibie_active: 0,
    leibie_entry_active: 0,
    gonggao: {
      gonggao: '',
      status: 0
    },
    userstatus: {
      daizhifu: 0,
      daipeisong: 0,
      quanxian: 0,
      fenxiao: 0,
      fenxiaoma: 1,
      daisonghuo: 0,
      isguanli: 0,
      daidianpu: 0,
      daihehuo: 0,
    },
    addgouwuche: {},
    addgouwuche_show: false,
    gouwuchequanxuan: '',
    row_leibie_index: [],
    row_leibie: [],
    row_qiangou: [],
    gouwuche: [],
    gouwucheitemshul: 0,
    time: 0,
    timeData: {},
    lunboimg: [
      '../images/peisong.png',
      '../images/qingdaopijiu.png',
    ],
  },

  onLoad: function (options) {

    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    
    if (options.scene){
      const scene = decodeURIComponent(options.scene)
      wx.login({
        success(res){
          app.sendposturl('/index/setfenxiaoma', {
            code: res.code,
            scene: scene
          })
        }
      })
    }
    if(!wx.getStorageSync('userinfo')){
      this.setData({
        showgetuserinfo: true
      })
    }else{
      var userinfo = wx.getStorageSync('userinfo')
      this.setData({
        userinfo: userinfo
      })
      if (!wx.getStorageSync('peisongdizhi') || wx.getStorageSync('peisongdizhi') == null){
        setTimeout(function () {
          wx.request({
            url: app.globalData.root_url + '/index/setuserinfo',
            method: 'post',
            data: {
              sessionkey: wx.getStorageSync('sessionkey'),
              nickname: userinfo.nickName,
              touxiang: userinfo.avatarUrl
            },
            success: function (res) {
              if (res.data != null) {
                wx.setStorageSync('peisongdizhi', res.data.peisongdizhi)
                wx.setStorageSync('lianxfs', res.data.lianxfs)
              }
            }
          })
        }, 5 * 1000)
      }
    }

    var that = this;
    setTimeout(function(){
      wx.request({
        url: app.globalData.root_url + '/index/userstatus',
        data:{
          sessionkey: wx.getStorageSync('sessionkey')
        },
        success: function(res){
          if (res.data.fenxiao == null){
            res.data.fenxiao = 0;
          }
          that.setData({
            userstatus: res.data
          })
        }
      })
    }, 2 * 1000)

    if(options.activemenu){
      var heji = 0;
      app.globalData.gouwuche.forEach((val, index) => {
        heji += parseFloat(val.shoujia) * parseFloat(val.goumaishul)
      })
      this.setData({
        gouwuche: app.globalData.gouwuche,
        activemenu: options.activemenu,
        yixuanjine: heji * 100
      });
    }
    
    this.getshangpinlist();
  },

  getshangpinlist(){
    var that = this;
    var ftmp = [];
    app.sendgeturl('index/shangpinlist', '', function (res) {
      res.data.leibie.forEach((val, index) => {
        if (val.index_show == 1) {
          ftmp.push({
            id: val.id,
            leibiename: val.leibiename,
            leibieimg: val.leibieimg,
          })
        }
      })

      that.setData({
        row_leibie: res.data.leibie,
        row_leibie_index: ftmp,
        gonggao: res.data.gonggao,
        row_qiangou: res.data.qianggou,
        time: res.data.shengyutime * 1000,
        xianshi_show: res.data.qianggou.length > 0 ? true : false
      })
    })
  },

  gosearch(e) {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  shouye_leibie_onchange(e) {
    this.setData({
      shouye_leibie_active: e.detail
    })
  },

  daojishi(e) {
    this.setData({
      timeData: e.detail
    });
  },

  menuonChange(event) {
    if (event.detail == 2) {
      var heji = 0;
      app.globalData.gouwuche.forEach((val, index) => {
        heji += parseFloat(val.shoujia) * parseFloat(val.goumaishul)
      })

      this.setData({
        gouwuchequanxuan: 'quanxuan',
        yixuanjine: heji * 100,
        gouwuche: app.globalData.gouwuche
      })
    }

    if(event.detail == 1){
      this.setData({
        leibie_leibie_active: 0,
        leibie_entry_active: 0,
      })
    }

    this.setData({
      activemenu: event.detail,
    })

  },

  digndanonChange(event) {
    console.log(event)
  },

  leibie_leibie_onclick(e) {
    this.setData({
      leibie_leibie_active: e.detail.index,
    })
  },

  leibie_entry_onclick(e) {
    this.setData({
      leibie_entry_active: e.detail,
    })
  },

  addgouwuche_close() {
    var that = this;
    this.setData({
      addgouwuche_show: false
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

  changegouwucheshul(e) {
    if (this.data.activemenu == 2) {
      var val = app.globalData.gouwuche[e.target.dataset.index]
      var yuanval = parseFloat(val.goumaishul) * parseFloat(val.shoujia)
      app.globalData.gouwuche[e.target.dataset.index].goumaishul = e.detail;
      var xinval = parseFloat(e.detail) * parseFloat(val.shoujia)
      this.setData({
        yixuanjine: this.data.yixuanjine + (xinval - yuanval) * 100,
        gouwuche: app.globalData.gouwuche
      })
    } else {
      this.data.addgouwuche.goumaishul = e.detail
      this.setData({
        addgouwuche: this.data.addgouwuche
      })
    }
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

  gogouwuche() {
    var heji = 0;
    app.globalData.gouwuche.forEach((val, index) => {
      heji += parseFloat(val.shoujia) * parseFloat(val.goumaishul)
    })

    this.setData({
      gouwuchequanxuan: 'quanxuan',
      activemenu: 2,
      yixuanjine: heji * 100,
      addgouwuche_show: false
    })
  },

  gozhuye() {
    this.setData({
      activemenu: 0,
      addgouwuche_show: false
    })
  },

  quanxuangouwuche() {
    if (app.globalData.gouwuchequanxuan == 'quanxuan') {
      this.setData({
        gouwuchequanxuan: '',
        yixuanjine: 0
      })
    } else {
      var heji = 0;
      app.globalData.gouwuche.forEach((val, index) => {
        heji += parseFloat(val.shoujia) * parseFloat(val.goumaishul)
      })

      this.setData({
        gouwuchequanxuan: 'quanxuan',
        yixuanjine: heji * 100
      })
    }
  },
  delgouwuche(e) {
    var heji = 0;
    app.globalData.gouwuche.splice(e.target.dataset.index, 1)
    app.globalData.gouwuche.forEach((val, index) => {
      heji += parseFloat(val.shoujia) * parseFloat(val.goumaishul)
    })

    this.setData({
      gouwuche: app.globalData.gouwuche,
      yixuanjine: heji * 100
    })
  },

  goxiangxi(e){
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/xiangxi/xiangxi?id=' + id,
    })
  },

  goleibie(e){
    var that = this;
    var id = e.target.dataset.id;
    this.data.row_leibie.forEach((val, index)=>{
      if(val.id == id){
        that.setData({
          activemenu: 1,
          leibie_leibie_active: index,
          leibie_entry_active: 0
        })
      }
    })
  },
  gowaimai(){
    this.setData({
      activemenu: 1,
      leibie_leibie_active: 0,
      leibie_entry_active: 0,
    })
  },

  goshucai(){
    this.setData({
      activemenu: 1,
      leibie_leibie_active: 1,
      leibie_entry_active: 0,
    })
  },

  goshuiguo(){
    this.setData({
      activemenu: 1,
      leibie_leibie_active: 3,
      leibie_entry_active: 0,
    })
  },

  getUserInfo(e){
    var userinfo = JSON.parse(e.detail.rawData);
    wx.setStorageSync('userinfo', userinfo);
    this.setData({
      userinfo: userinfo
    })
    if(!wx.getStorageSync('peisongdizhi') || wx.getStorageSync('peisongdizhi') == null){
      wx.request({
        url: app.globalData.root_url + '/index/setuserinfo',
        method: 'post',
        data: {
          sessionkey: wx.getStorageSync('sessionkey'),
          nickname: userinfo.nickName,
          touxiang: userinfo.avatarUrl
        },
        success: function (res) {
          wx.setStorageSync('peisongdizhi', res.data.peisongdizhi)
          wx.setStorageSync('lianxfs', res.data.lianxfs)
        }
      })
    }
  },

  gopeisongdizhi(){
    wx.navigateTo({
      url: '/pages/peisongdizhi/peisongdizhi',
    })
  },

  gohehuoren(){
    var that = this;
    wx.navigateTo({
      url: '/pages/hehuoren/hehuoren?status=' + that.data.userstatus.fenxiao,
    })
  },

  lijigoumai(){
    var that = this;
    app.fukuan(this.data.addgouwuche, 'obj', function(res){
      that.setData({
        addgouwuche_show: false
      })
    });
  },

  gouwuchegoumai(){
    app.fukuan(this.data.gouwuche, 'arr', function(res){

    });
  },

  getshouquaninfo(){
    var that = this;
    this.setData({
      userinfo: wx.getStorageSync('userinfo')
    })
    this.getshangpinlist();
    wx.showLoading({
      title: '更新权限中..',
    })
    wx.request({
      url: app.globalData.root_url + '/index/userstatus',
      data: {
        sessionkey: wx.getStorageSync('sessionkey')
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.fenxiao == null) {
          res.data.fenxiao = 0;
        }
        that.setData({
          userstatus: res.data
        })
      }
    })
  },
  
  gettongzhi(){
    wx.navigateTo({
      url: '/pages/tongzhi/tongzhi',
    })
  },

  getdaifukuan(){
    wx.navigateTo({
      url: '/pages/weiwancheng/weiwancheng?status=0',
    })
  },

  getdaipeisong(){
    wx.navigateTo({
      url: '/pages/weiwancheng/weiwancheng?status=1',
    })
  },

  getallorder(){
    wx.navigateTo({
      url: '/pages/weiwancheng/weiwancheng?status=9',
    })
  },

  gohehuorenshenhe(){
    wx.navigateTo({
      url: '/pages/hehuorenshenhe/hehuorenshenhe',
    })
  },

  gomsgshouquan(){
    wx.navigateTo({
      url: '/pages/msgshouquan/msgshouquan',
    })
  },

  godaipeisong(){
    wx.navigateTo({
      url: '/pages/daisonghuo/daisonghuo',
    })
  },

  gokefu(){
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '请联系客服',
    })
  },

  goxiangmu(e){
    var that = this;
    that.setData({
      activemenu: 1,
      leibie_leibie_active: 0,
      leibie_entry_active: 0
    })
  },

  onShareAppMessage: function (res) {
    var that = this;
    var fenxiaoma = that.data.userstatus.fenxiaoma
    if(fenxiaoma == undefined){
      fenxiaoma = 1
    }
    return {
      title: '青岛啤酒攀西大区欢迎您',
      path: '/pages/index/index?scene=' + fenxiaoma,
      // imageUrl: '../images/peisong.png'
    }
  },

  goshangpinweihu(){
    wx.navigateTo({
      url: '/pages/shangpinweihu/shangpinweihu',
    })
  },

  goshangjia(){
    wx.navigateTo({
      url: '/pages/chengweishangjia/chengweishangjia',
    })
  },

  godaishenheshangjia(){
    wx.navigateTo({
      url: '/pages/daishenheshangjia/daishenheshangjia',
    })
  },

  goaddguanliyuan(){
   wx.navigateTo({
     url: '/pages/addguanli/addguanli',
   })
  },

  onShow: function(){
    if(this.data.activemenu == 3){
      this.getshouquaninfo()
    }
  }
})
