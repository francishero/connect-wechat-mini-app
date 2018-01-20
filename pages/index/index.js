//index.
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false , // loading
    userInfo: {},
    swiperCurrent: 0,  
    selectCurrent:0,
    activeCategoryId: 0,
    goods:[],
    scrollTop:"0",
    loadingMoreHidden:true,
    /*search input */
    inputVal:'',
    categories:[
      
      {
        id:0,
        name:'Books'
      },{
        id:1,
        name:'Utils'
      },
      {
        id:2,
        name:'Clothes'
      },
      {
        id:3,
        name:'Phones'
      },{
        id:4,
        name:'Laptops'
      },{
        id:5,
        name:'Food'
      },
      {
        id:6,
        name:'Others'
      }
    ]
  },
  onShareAppMessage: function () {
    return {
      title: 'connecting everyone',
      path: 'pages/index/index'
    }
  },
 clearInput:function(e)
 {
   this.setData({
     inputVal:''
   })
 },
 inputTyping:function(e)
 {
   var that=this 
   that.setData({
     inputVal:e.detail.value
   })
 },
  redirectToUser: function (e) {
    wx.navigateTo({
      url: '/pages/search/index?keyword='+this.data.inputVal
    })
  },
  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  swiperchange: function(e) {
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?_id="+e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function(e) {
     this.setData({  
        selectCurrent: e.index 
    })  
  },
  scroll: function (e) {
    var that = this,scrollTop=that.data.scrollTop;
    that.setData({
      scrollTop:e.detail.scrollTop
    })
  },
  onLoad: function () {
    var that = this
    that.setData({
      categories:that.data.categories
    })
    wx.setNavigationBarTitle({
      title: 'connect'
    })
    wx.request({
      url: 'https://connect.duohuo.org/api/v1/banners',
      success: function(res) {
        that.setData({
          banners: res.data.data
        });
      }
    })
  },

  onShow:function()
  {
    var that=this
    wx.request({
      url: 'https://connect.duohuo.org/api/v1/posts',
      header: {
        auth: wx.getStorageSync('auth')
      },
      success: function (res) {
        that.setData({
          goods: [],
          loadingMoreHidden: true
        });
        var goods = [];
        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden: false,
          });
          return;
        }
        
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);

        }
        that.setData({
          goods: goods,
        });
      }
    })
    //get the current users post
    var post=wx.getStorageSync('post')
    //push to the top of  the current posts
    this.data.goods.push(post)
    that.setData({
      goods:that.data.goods
    })
    
  },
  getGoodsList: function (categoryIndex) {
    var that = this;
    wx.request({
      url: 'https://connect.duohuo.org/api/v1/posts/category?categoryIndex='+categoryIndex,
      method:'POST',
      header:{
        auth:wx.getStorageSync('auth')
      },
      success: function(res) {
       
        that.setData({
          goods:[],
          loadingMoreHidden:true
        });
        var goods = [];
        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden:false,
          });
          return;
        }
        for(var i=0;i<res.data.data.length;i++){
          goods.push(res.data.data[i]);
        }
        that.setData({    
          goods:goods,                                                                                                                                        goods:goods,
        });
      } //end of success
    })//end of wx.request
  } //end of getGoodsList
})
