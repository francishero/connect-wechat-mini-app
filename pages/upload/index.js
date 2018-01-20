const qiniuUploader =  require('../../utils/qiniuUploader-min.js');

var app = getApp()
Page({
  data: {
    files: [],
    title: '',
    description: '',
    price: 0,
    categoryIndex: null,
    tags: [],
    tempFile: '',
    imgkey: [],
    qiniu:'',
    btnBgc:"",
    loading:false,
    imgWidth:525,
    imgHeight:350,
    actionText:"Cam/Alb"
  },
  //try to write own qiniu uploader 
  uploadImg:function(path){
    var that=this 
    wx.showNavigationBarLoading()
    wx.uploadFile({
      url:'https://up-z2.qbox.me',
      header:{
        'content-Type':'multipart/form-data'
      },
      filePath:path,
      name:'file',
      formData:{
        token:that.data.qiniu
      },
      success:function(res){
        var data=JSON.parse(res.data)
        console.log('own uploader--res data--',data)
        if(data.key && that.data.imgkey.indexOf('http://connectimage.duohuo.org/'+data.key)==-1){
          that.setData({
            imgkey: that.data.imgkey.concat('http://connectimage.duohuo.org/'+data.key)
          })
        
        }
          console.log(that.data.imgkey)
        
      }
    })
  },
  errorModal: function (content) {
    wx.showModal({
      title: 'Warning',
      content: content,
      showCancel: false,
      confirmText:'Ok'
    })
  },
  onLoad: function (options) {
    var that=this
    wx.showNavigationBarLoading()
    //get the upload token for qiniu
    wx.request({
      url:'https://connect.duohuo.org/api/v1/uptoken',
      method:'GET',
      success:function(res)
      {
        if(res.data.code==0)
        {
          that.setData({
            qiniu:res.data.token
          })
        }
        return;
      },
      complete:function()
      {
        wx.hideNavigationBarLoading()
      }
    })

    var that = this
    //TODO: use wx.request!!!!!!!!!
    var dummy = ["BOOKS", "UTILS", "CLOTHES","PHONES","LAPTOPS","FOOD","OTHERS"]
    that.setData({
      arrayCategories: dummy
    })
  },
    
  bindPickerChange: function (e) {

      var categoryIndex=e.detail.value
    var click = this.data.arrayCategories[categoryIndex]
  
    //store the current index
    this.setData({
     categoryIndex:categoryIndex
    })
  },
  bindCamera: function (e) {
    var that = this;
    if (that.data.files.length === 0) {
      that.setData({
        btnBgc: ""
      })
    }
    else {
      that.setData({
        btnBgc: "#42b3f4"
      })
    }
    wx.showModal({
      title: 'Info',
      content: 'You can upload from album or take live pictures',
      confirmText: 'Ok',
      cancelText:'Back',
      showCancel: true,
      cancelColor:'#16ad2d',
      success: function (res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 4,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
              let tfps=res.tempFilePaths
             // let _files=that.data.files
             let _files=that.data.files
              // for(let tfp of tfps)
              // {
              //   _files.concat(tfp)
              //   console.log('_files--',_files)
              //   that.setData({
              //     files:_files,
              //     actionText:'+'
              //   })
              // }
              _files=_files.concat(tfps)
              console.log('__files--',_files)
              that.setData({
                files:_files,
                actionText:"+"
              })
              console.log('after- _files--',_files)
              // that.setData({
              //   files: that.data.files.concat(res.tempFilePaths),
              //   tempFile: res.tempFilePaths.join(''),
              //    actionText:'+'
              // });

              //resize images before uploading
        for(var i=0;i<that.data.files.length;i++)
        {
          var img=that.data.files[i]
           wx.getImageInfo({
          src: img,
          success: function (res) {
            res.width=800
            res.height=320
          }
        })
      }
      //fix
     
               
            //uplaod code was here
   for(var i=0;i<that.data.files.length;i++){
                  var e=that.data.files[i]
                 // that.uploadImg(e)
           
                    qiniuUploader.upload(e, (res) => {
                      that.setData({
                        imgkey: that.data.imgkey.concat(res.imageURL),
                      });

                    }, (error) => {
                      console.log('error--upload: ', error);
                      //upload bug

                    }, {
                        region: 'SCN',
                        domain: 'http://connectimage.duohuo.org', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                        key: new Date().getTime() + '.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                        // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
                        uptoken: that.data.qiniu, // 由其他程序生成七牛 uptoken
                        uptokenURL: 'http://connect.duohuo.org/api/v1/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
                        uptokenFunc: function () { return '[yourTokenString]'; }
                      });
            
               }

            },
            // complete:function()
            // {
            //   that.setData({
            //     imgKey:[],
            //     files:[],
            //     actionText:"Cam/Alb"
            //   })
            // }
          })
        }
      }
    })
    
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
    
  },
   delPic: function (e) {
    let index = e.currentTarget.id;
    let files = this.data.files;
    files.splice(index, 1);
    this.setData({
      files: files
    })
  },
  uploadQiniu:function(){
    var that=this
       for(var i=0;i<that.data.files.length;i++){
                  var e=that.data.files[i]
                 // that.uploadImg(e)
           
                    qiniuUploader.upload(e, (res) => {
                      that.setData({
                        imgkey: that.data.imgkey.concat(res.imageURL),
                      });

                    }, (error) => {
                      console.log('error--upload: ', error);
                      //upload bug

                    }, {
                        region: 'SCN',
                        domain: 'http://connectimage.duohuo.org', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                        key: new Date().getTime() + '.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                        // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
                        uptoken: that.data.qiniu, // 由其他程序生成七牛 uptoken
                        uptokenURL: 'http://connect.duohuo.org/api/v1/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
                        uptokenFunc: function () { return '[yourTokenString]'; }
                      });
            
               }
  },

 
  submitF:function(e)
  {
    wx.showNavigationBarLoading()
    var that = this
    
    var title = e.detail.value.inputTitle
    var description = e.detail.value.inputDescription
    var price = e.detail.value.inputPrice
    var tags=e.detail.value.tagsInput

    that.setData({
      title: title,
      description: description,
      price: price,
      categoryIndex: this.data.categoryIndex
    })
    
    if (title=="" ) {
      this.errorModal('Please enter the title')
      return
    }
    if (!price.match(/^\d{0,8}(\.\d{1,4})?$/)) {
      this.errorModal('Please enter valid price')
      return
    }
    if(that.data.categoryIndex===null){
      this.errorModal('Please choose the category')
      return
    }
    if(that.data.imgkey.length==0){
      this.errorModal('Images are required')
      return
    }
    
    

      wx.request({
        url: 'https://connect.duohuo.org/api/v1/posts',
        method:'POST',
        data: {
          pics: that.data.imgkey,
          title:title,
          description:description,
          price:price,
          categoryIndex: that.data.categoryIndex,
          tags:tags,
        },
        header: {
          'content-type': 'application/json',
          auth:wx.getStorageSync('auth')
        },

        success: function (res) {
            if(res.data.code===0){
                //upload to server was successful
                wx.setStorageSync('post', res.data.data)          
                
                wx.showToast({
                  title: 'Post uploaded successfully!',
                  icon:'loading',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }, 1500)
            }
        },
        fail:function()
        {
          wx.showModal({
            title:'Error',
            content:'Could not upload your post,Please try again',
            confirmText:'Ok',
            showCancel:false,
            success:function(res)
            {
              if(res.confirm)
              {
               wx.navigateTo({
                  url:'/pages/upload/index'
                }) //end of navigateTo
              }
            }
          })
        },
        complete:function()
        {
          that.setData({
            files:[],
            categoryIndex:'',
            title:'',
            description:'',
            price:0,
            tags:[],
            imgkey:[]
          })
      
          
          wx.hideNavigationBarLoading()
        }
      })
   
    }
  
});

