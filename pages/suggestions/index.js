//textarea.js
var app = getApp()
Page({
  data: {
    height: 20,
    focus: true,
    inputVal: '',
    info: '',
    userInfo: {}
  },
  onLoad: function () {
    var that = this
   
    wx.request({
      url:'https://connect.duohuo.org/api/v1/posts',
      method:'GET',
      header:{
        auth:'5963ab9cefd6a6fa7c1e9884'
      },
      success:function(res){
        console.log('posts==',res.data.data)
      }
    })
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: 'Suggestion',
    });
  },
  bindInput: function (e) {
    var suggestion = e.detail.value.textarea

    this.setData({
      inputVal: suggestion
    })
  },
  bindFormSubmit: function (e) {
    var suggestion = e.detail.value.textarea
    console.log(suggestion)
    //check if the textarea is empty
    //show error 
    //otherwise send the textarea input to server
    //check if it was successfully uploaded 
    //if it was do the success dialog then
    //take the user to home page 
    if(suggestion===""){
      wx.showModal({
        title: 'Warning',
        content: 'Please enter a suggestion',
        showCancel:false,
        confirmText:'Ok'
      })
      return;
    }
    wx.request({
      url:'https://connect.duohuo.org/api/v1/suggestions',
      method:'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        auth:wx.getStorageSync('auth')
      },
      data:{
        content:suggestion
      },
      success:function(res){
        if(res.data.code==0)
        {
          wx.showToast({
            title: 'Thank you',
            icon:'success',
            duration:2000
          })
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/index/index',
            })
          },2000)
          
        }else{
          wx.showModal({
            title:'Error',
            content:'Error sending suggestion,Please try again',
            confirmText:'Ok',
            showCancel:false,
            success:function(res)
            {
              if(res.confirm)
              {
                wx.navigateTo({
                  url: '/pages/suggestions/index',
                })
              }
            }

          })
        }
      }
    })
    

    //here a timrout function 
 

  }



})