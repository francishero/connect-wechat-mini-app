var app=getApp()
Page({
  data:{
    version:'',
    year:''
  },
  onLoad:function(){
    this.setData({
      version:app.globalData.version,
      year: new Date().getFullYear()
    })
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title: 'About Us',
    })
  }
})