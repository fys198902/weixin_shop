// pages/tongzhi/tongzhi.js
Page({
  data: {
    tongzhi: [
      {
        tongzhiname: '订单配送通知',
        tongzhiid: 'NijlAfeXB_BkwHkZi4jBb7I2hsnjGzC7737Hj1F2Nr8'
      },
      {
        tongzhiname: '合伙人/商家申请通知',
        tongzhiid: '3Hy3u8SFUCxneHGPiw_F7BHXV6mvSjwfvfuLri-yfWk'
      },
      {
        tongzhiname: '合伙人提现通知',
        tongzhiid: 'O-2HsKHfszqonOkVYJxt3pjFLe9AsHBuNAd5hR55FDg'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  gettongzhi(e){
    var tongzhiid = e.currentTarget.dataset.id;
    wx.requestSubscribeMessage({
      tmplIds: [tongzhiid],
      success(res) { 
        if (res.errMsg == 'requestSubscribeMessage:ok'){
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '获取成功',
          })
        }
        
      }
    })
  }
})