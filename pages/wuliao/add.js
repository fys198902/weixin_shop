// pages/wuliao/add.js
const app = getApp()

Page({
  data: {
    dianpuid: '',
    fengmian: '',
    leibie: [],
    showleibie: false,
    selectedleibie: '',
    selectedleibieid: 0,
    wuliaoentry: [],
    columns: [],
    vw_width: wx.getSystemInfoSync().windowWidth,
    wuliaoname: '',
    jianjie: '',
    danwei: '',
    shoujia: '',
    ticheng: ''
  },

  onLoad: function (options) {
    var that = this;
    app.sendposturl("/index/getleibielist",{
      sessionkey: wx.getStorageSync('sessionkey')
    }, function(res){
      that.setData({
        dianpuid: res.data.dianpuid,
        leibie: res.data.leibie,
        columns: [{
          values: res.data.leibie,
          className: 'column1'
        },
        {
          values: res.data.leibie[0]['entry'],
          className: 'column2',
          defaultIndex: 2
        }
        ]
      })
    })
  },

  uploadfengmian(event){
    var that = this;
    const { file } = event.detail;
    wx.uploadFile({
      url: app.globalData.root_url + '/index/shangpinimgupload',
      filePath: file.path,
      name: 'file',
      success(res) {
        res = JSON.parse(res.data);
        that.setData({
          fengmian: 'https://jxc.xmoj.cn/uploads/qingdao/' + res.src
        });
      }
    });
  },

  afterRead(event) {
    var that = this;
    const { file } = event.detail;
    wx.uploadFile({
      url: app.globalData.root_url + '/index/shangpinxiangxiimgupload',
      filePath: file.path,
      name: 'file',
      success(res) {
        res = JSON.parse(res.data);
        that.data.wuliaoentry.push({
          url: 'https://jxc.xmoj.cn/uploads/qingdao/' + res.src,
          isImage: true
        });
        that.setData({ 
          wuliaoentry: that.data.wuliaoentry
        });
      }
    });
  },
  delwuliaoentry(e){
    var that = this;
    var index = e.detail.index
    that.data.wuliaoentry.splice(index, 1);
    that.setData({
      wuliaoentry: that.data.wuliaoentry
    })
  },

  onChange(event) {
    var that = this;
    const { picker, value, index } = event.detail;
    
    
    picker.setColumnValues(1, value[0]['entry']);
  },

  yincang(){
    this.setData({
      showleibie: false
    })
  },

  show(){
    this.setData({
      showleibie: true
    })
  },

  queding(e){
    var that = this;
    this.setData({
      selectedleibie: that.data.leibie[e.detail.index[0]]['text'] + '-' + that.data.leibie[e.detail.index[0]]['entry'][e.detail.index[1]]['text'],
      selectedleibieid: that.data.leibie[e.detail.index[0]]['entry'][e.detail.index[1]]['id'],
      showleibie: false
    })
  },

  wuliaonameinput(e){
    this.setData({
      wuliaoname: e.detail
    })
  },

  jianjieinput(e) {
    this.setData({
      jianjie: e.detail
    })
  },

  danweiinput(e) {
    this.setData({
      danwei: e.detail
    })
  },

  shoujiainput(e) {
    this.setData({
      shoujia: e.detail
    })
  },

  tichenginput(e) {
    this.setData({
      ticheng: e.detail
    })
  },

  save() {
    var that = this;
    if (that.data.dianpuid == '' || that.data.selectedleibieid == 0 || that.data.fengmian == '' || that.data.wuliaoname == '' || that.data.jianjie == '' || that.data.danwei == '' || that.data.shoujia == '' || that.data.ticheng == ''){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '表单不全',
      })
      return false;
    }
    app.sendposturl('/index/addwuliaodo',{
      dianpuid: that.data.dianpuid,
      leibieid: that.data.selectedleibieid,
      fengmian: that.data.fengmian,
      wuliaoname: that.data.wuliaoname,
      jianjie: that.data.jianjie,
      danwei: that.data.danwei,
      shoujia: that.data.shoujia,
      ticheng: that.data.ticheng,
      wuliaoentry: that.data.wuliaoentry
    }, function(res){
      wx.showToast({
        title: res.data,
        complete: function(){
          that.setData({
            fengmian: '',
            wuliaoname: '',
            jianjie: '',
            danwei: '',
            shoujia: '',
            ticheng: '',
            wuliaoentry: []
          })
        }
      })
    })
  },

})