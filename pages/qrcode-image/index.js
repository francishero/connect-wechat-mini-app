// pages/qrcode-image/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  qrcodeUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.qrcodeUrl)
    this.setData({
      qrcodeUrl:options.qrcodeUrl,
      wechatId:options.wechat_id
    })
  },
  imgLongTap: function () {
    // Save image to album 
    wx.saveImageToPhotosAlbum({
      filePath: this.data.src,
      success(res) {
        wx.showToast({
          title: 'Save',
          icon: 'success',
          duration: 1500
        })
        console.log('success')
      }
    })
  } ,

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  wx.setNavigationBarTitle({
    title: 'Add wechat',
    success: function(res) {
      // success
    }
  })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})