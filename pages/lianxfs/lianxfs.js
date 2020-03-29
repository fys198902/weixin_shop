// pages/lianxfs/lianxfs.js
const app = getApp()

Page({

  data: {
    fdata: [
      {
        pianqu: '长安',
        lianxr: '方永顺',
        lianxfs: '18113220863'
      }
    ]
  },  

  onLoad(){
    var that = this;
    app.sendgeturl('index/getlianxfs',{}, function(res){
      that.setData({
        fdata: res.data
      })
    })
  },

  gophone(e){
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone,
    })
  }
})