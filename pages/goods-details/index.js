// pages/goods-details/index.js
Page({

  data: {
    autoplay:true,
    interval:3000,
    duration:1000,
    goodsDetails:{},
    swiperCurrent:0,
  },
  swiperchange:function(e)
  {
    this.setData({
      swiperCurrent:e.detail.current
    })
  },
  onLoad: function (options) {
    var that=this 
    wx.setStorageSync('postId', options._id)
    wx.request({
      url: 'https://connect.duohuo.org/api/v1/posts/'+options._id,
      method:'GET',
      header:{
        auth:wx.getStorageSync('auth')
      },
      success:function(res)
      {
        var goodsDetails=res.data
        that.setData({
          goodsDetails:goodsDetails,
          count:goodsDetails.favoriteCount, //previous state
          liked:goodsDetails.favorite
        })
        console.log('check wechat_id---',that.data.goodsDetails)
      }
    })
  },

  share: function () {
   wx.showShareMenu({
  withShareTicket: true
})
  },
  addWechat:function()
  {
    var that=this
    if( that.data.goodsDetails.user.qrcode.length===0)
    {
      var auth_check=wx.getStorageSync('auth')
      if(that.data.goodsDetails.user._id===auth_check)
      {
        wx.showModal({
          title:'Info',
          content:'Please bind your wechat qrcode',
          showCancel:true,
          cancelText:'Nope',
          cancelColor:'green',
          confirmText:'Ok',
          success:function(res)
          {
            if(res.confirm)
            {
              wx.navigateTo({
                url:'/pages/qrcode/index'
              })
            }
          }
        })
      }
      else{
wx.showModal({
        title:'Info',
        content:'The owner of this post has not yet set the wechat qrcode,Please try again later',
        showCancel:false,
        confirmText:'Ok',
        success:function(res)
        {
          if(res.confirm)
          {
            wx.navigateBack()
          }
        }
      })
      }
      
    }
    else{
      var qrcodeUrl=that.data.goodsDetails.user.qrcode[0].path
     var wechat_id=that.data.goodsDetails.user.qrcode[0].wechat_id
      wx.redirectTo({
        url:'/pages/qrcode-image/index?qrcodeUrl='+qrcodeUrl+'&wechat_id='+wechat_id
      })
    }
    
  },

  onReady: function () {
  
  },
  toHome:function(e)
  {
    wx.naviageTo({
      url:'/pages/index/index'
    })
  },
  favoritePost:function()
  {
    var that=this 
    console.log(that.data.liked)
    var postId=wx.getStorageSync('postId')
    wx.request({
      url:'https://connect.duohuo.org/api/v1/posts/'+postId+'/favoritePost',
      method:'POST',
      header:{
        auth:wx.getStorageSync('auth')
      },
      success:function(res)
      {
        if(res.data.code===0)
        {
          wx.request({
            url:'https://connect.duohuo.org/api/v1/posts/'+postId,
            method:'GET',
            header:{
              auth:wx.getStorageSync('auth')
            },
            success:function(res)
            {
              that.setData({
                count:res.data.favoriteCount, //current state
                liked:res.data.favorite
              })
            }
          })
        }
      }
    
    })
  }



  
})