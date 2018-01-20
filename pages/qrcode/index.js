const qiniuUploader = require("../../utils/qiniuUploader-min.js");
var app = getApp();
Page({
  data: {
    picUrls: [],
    actionText: "Cam/Alb",
    btnBgc: "",
    imgkey: "",
    qiniu: "",
    wechatId: ""
  },
  bindInput: function(e) {
    var wechatId = e.detail.value;

    this.setData({
      wechatId: wechatId
    });
    console.log("wechat f--", this.data.wechatId);
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: "Upload Qrcode"
    });
    var that = this;
    wx.showNavigationBarLoading();
    //get the upload token for qiniu
    wx.request({
      url: "https://connect.duohuo.org/api/v1/uptoken",
      method: "GET",
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            qiniu: res.data.token
          });
        }
        return;
      },
      complete: function() {
        wx.hideNavigationBarLoading();
      }
    });
  },
  bindCamera: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        let tfps = res.tempFilePaths;
        let _picUrls = that.data.picUrls;
        for (let item of tfps) {
          _picUrls.push(item);
          this.setData({
            picUrls: _picUrls,
            actionText: "+"
          });
          //upload to qiniu
          console.log("whats in picUrls==", that.data.picUrls);
          for (var i = 0; i < that.data.picUrls.length; i++) {
            var e = that.data.picUrls[i];
            qiniuUploader.upload(
              e,
              res => {
                that.setData({
                  imgkey: res.imageURL
                });
              },
              error => {
                console.log("error: " + error);
              },
              {
                region: "SCN",
                domain: "http://connectimage.duohuo.org", // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                key: new Date().getTime() + ".jpg", // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
                uptoken: that.data.qiniu, // 由其他程序生成七牛 uptoken
                uptokenURL: "https://connect.duohuo.org/api/v1/uptoken", // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
                uptokenFunc: function() {
                  return "[yourTokenString]";
                }
              }
            );
          }
        }
        var tempFilePath = res.tempFilePaths[0];
        if (that.data.picUrls.length === 0) {
          that.setData({
            btnBgc: ""
          });
        } else {
          that.setData({
            btnBgc: "#42b3f4"
          });
        }
      }
    });
  },

  delPic: function(e) {
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index, 1);
    this.setData({
      picUrls: _picUrls
    });
  },

  formSubmit: function(e) {
    var that = this;

    console.log("wechat_id--", that.data.wechatId);
    wx.showNavigationBarLoading();
    if (that.data.imgkey === "") {
      wx.showModal({
        title: "Warning",
        content: "Qrcode image is required",
        showCancel: false,
        confirmText: "OK"
      });
      return;
    }
    wx.request({
      url: "https://connect.duohuo.org/api/v1/qrcode",
      method: "POST",
      header: {
        auth: wx.getStorageSync("auth")
      },
      data: {
        path: that.data.imgkey,
        wechat_id: that.data.wechatId
      },
      success: function(res) {
        if (res.data.code === 0) {
          console.log(res.data.data);

          //upload to server was successful
          wx.showToast({
            title: "Wechat qrcode upload success!",
            icon: "success",
            duration: 1000
          });
          setTimeout(function() {
            wx.switchTab({
              url: "/pages/index/index"
            });
          }, 2000);
        }
      },
      fail: function() {
        wx.hideNavigationBarLoading()
        wx.showModal({
          title: "Error",
          content: "Could not upload wechat qrcode,Please try again",
          confirmText: "Ok",
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: "/pages/qrcode/index"
              });
            }
          }
        });
      },
      complete: function() {
        wx.hideNavigationBarLoading();
        that.setData({
          picUrls: [],
          imgkey: ""
        });
      }
    });
  }
});
