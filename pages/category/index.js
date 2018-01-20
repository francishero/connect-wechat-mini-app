var app=getApp()
Page({
  data:{
    title:'',
    categoryType:null,
    categoryTypeId:null,
    favoritePosts:[],
    soldPosts:[]
  },
  onLoad:function(options)
  {
    var that=this 
    var favorites;
    wx.request({
      url:'https://connect.duohuo.org/api/v1/posts',
      method:'GET',
      header:{
        auth:wx.getStorageSync('auth')
      },
      success:function(res){
        favorites=res.data.data.filter(post=>post.favorite===true)
        that.setData({
          favoritePosts:favorites
        })
      }
    })
  },
  onShow:function()
  {
    var that=this 
    var cateType = app.globalData.currentCateType
    console.log(cateType)
    that.setData({
      categoryType:cateType.typeName,
      categoryTypeId:cateType.typeId
    })
  },
  onReady:function(){
    var title='Mine-'+this.data.categoryType
    this.setData({
      title:title
    })
    wx.setNavigationBarTitle({
      title: title
    })
  },
  bindTapProduct:function(e)
  {
    wx.navigateTo({
      url:'/pages/goods-details/index?id='+e.currentTarget.dataset.id 
    })
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?_id="+e.currentTarget.dataset.id
    })
  },
})