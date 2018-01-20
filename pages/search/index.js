var app = getApp()
Page({
  data: {
    inputVal: ''
  },
  clearInput: function () {
    this.setData({
      inputVal: ''
    })
  },
  inputTyping: function (e) {
    var that = this
    /*grab user input */
    that.setData({
      inputVal: e.detail.value
    })
 

  },
  onLoad: function (options) {
    this.setData({
      options_keyword:options.keyword
    })
   this.search(options.keyword)
  },
   search:function(keyword)
  {
    var that = this
    if (keyword===that.data.options_keyword)
    {
      keyword=that.data.options_keyword
    }
    else{
      keyword=that.data.inputVal
    }
    if(keyword==='')
      return;
    /* request to server with keyword as query param */
  
     wx.request({
       url: 'https://connect.duohuo.org/api/v1/posts/search?keyword='+keyword,
      method:'POST',
       header:{
        auth:wx.getStorageSync('auth')
       },
       success: function (res) {

        if (res.data.code == 0) {
         
          that.setData({
           items: res.data.data
           
          })
       
       }else{
         console.log('search fail')
       }
      },
      complete:function()
      {
        
      }

   })
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?_id="+e.currentTarget.dataset.id
    })
  },
  
})