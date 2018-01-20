// pages/my/index.js
var app=getApp()
Page({
  data: {
  userInfo:{},
  navs:[
   // {icon:'../../images/sold.png',name:'Sold',typeId:0},
    { icon: '../../images/favorites.png', name: 'Starred', typeId: 1 }
    
  ],
  items:[
    {
      icon: '../../images/qr-code.png',
      text: 'wechat-qrcode',
      path: '/pages/qrcode/index'
    },
    {
      icon: '../../images/suggestions-icon.png',
      text: 'suggestions',
      path: '/pages/suggestions/index'
    },
    {
      icon:'../../images/address-icon.png',
      text:'address',
      path:'/pages/select-address/index'
    },
     {
      icon:'../../images/about-icon.png',
      text:'about us',
      path:'/pages/about/index'
    },
   
  
  ]
  },

   onLoad: function() {
    var that = this
    app.getUserInfo( function( userInfo ) {
      that.setData( {
        userInfo: userInfo
      })
    })
  },
  //handler for the `sold` and `starred` 
  catchTapCategory:function(e)
  {
    //get the dataset and store it globally
    var data= e.currentTarget.dataset 
    app.globalData.currentCateType={typeName:data.type,typeId:data.typeid}
    wx.navigateTo({
      url:'/pages/category/index?app.globalData.currentCateType='
    })

  },

  onReady: function () {
  wx.setNavigationBarTitle({
    title: 'Mine',
  })
  },
  navigateTo:function(e){
    var path=e.currentTarget.dataset.path 
    wx.navigateTo({
      url:path
    })
  }
})