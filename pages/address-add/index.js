var commonCityData = require('../../utils/city.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    provinces:[],
    citys:[],
    districts:[],
    selProvince:'Choose',
    selCity:'Choose',
    selDistrict:'Choose',
    selProvinceIndex:0,
    selCityIndex:0,
    selDistrictIndex:0
  },
  bindCancel:function () {
   // wx.navigateBack({})
   wx.switchTab({
     url:'../index/index'
   })
  },
  errorModal:function(content){
    wx.showModal({
      title:'Warning',
      content:content,
      showCancel:false
    })
  },
  bindSave: function(e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;

    if (linkMan == ""){
      this.errorModal('Please enter name')
      return
    }
    if (mobile == ""){
      this.errorModal('please enter phone number')
      return
    }
    if (this.data.selProvince == "Choose"){
      this.errorModal('Please select province')
      return
    }
    if (this.data.selCity == "Choose"){
     this.errorModal('Please select city')
      return
    }
    var cityId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id;
    var districtId;
    if (this.data.selDistrict == "Choose"){
      districtId = cityId;
    } else {
      districtId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id;
    }
    if (address == ""){
    this.errorModal('Please fill in the address')
      return
    }
    if (code == ""){
     this.errorModal('Please fill in the zip code')
      return
    }
    var apiAddoRuPDATE = "add";
    var apiAddid = that.data.id;
    if (apiAddid) {
      apiAddoRuPDATE = "update";
    } else {
      apiAddid = 0;
    }
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/' + apiAddoRuPDATE,
      data: {
        token: app.globalData.token,
        id: apiAddid,
        provinceId: commonCityData.cityData[this.data.selProvinceIndex].id,
        cityId: cityId,
        districtId: districtId,
        linkMan:linkMan,
        address:address,
        mobile:mobile,
        code:code,
        isDefault:'true'
      },
      success: function(res) {
        if (res.data.code != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel:false
          })
          return;
        }
        // 跳转到结算页面
        wx.navigateBack({})
      }
    })
  },
  initCityData:function(level, obj){
    if(level == 1){
      var pinkArray = [];
      for(var i = 0;i<commonCityData.cityData.length;i++){
        pinkArray.push(commonCityData.cityData[i].name);
      }
      this.setData({
        provinces:pinkArray
      });
    } else if (level == 2){
      var pinkArray = [];
      var dataArray = obj.cityList
      for(var i = 0;i<dataArray.length;i++){
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        citys:pinkArray
      });
    } else if (level == 3){
      var pinkArray = [];
      var dataArray = obj.districtList
      for(var i = 0;i<dataArray.length;i++){
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts:pinkArray
      });
    }
    
  },
  bindPickerProvinceChange:function(event){
    var selIterm = commonCityData.cityData[event.detail.value];
    this.setData({
      selProvince:selIterm.name,
      selProvinceIndex:event.detail.value,
      selCity:'Choose',
      selDistrict:'Choose'
    })
    this.initCityData(2, selIterm)
  },
  bindPickerCityChange:function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
    this.setData({
      selCity:selIterm.name,
      selCityIndex:event.detail.value,
      selDistrict:'Choose'
    })
    this.initCityData(3, selIterm)
  },
  bindPickerChange:function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
    if (selIterm && selIterm.name && event.detail.value) {
      this.setData({
        selDistrict: selIterm.name,
        selDistrictIndex: event.detail.value
      })
    }
  },
  onLoad: function (e) {
    var that = this;
    this.initCityData(1);
    var id = e.id;
    if (id) {
      // 初始化原数据
      wx.showLoading();
      wx.request({
        url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/detail',
        data: {
          token: app.globalData.token,
          id: id
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            that.setData({
              id:id,
              addressData: res.data.data,
              //selProvince: res.data.data.provinceStr,
              //selCity: res.data.data.cityStr,
              //selDistrict: res.data.data.areaStr
            });
            return;
          } else {
            this.errorModal('Cannot retrieve the address')
          }
        }
      })
      // 
    }
  },
  selectCity: function () {
    
  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: 'Warning',
      content: 'Are you sure you want to delete？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/delete',
            data: {
              token: app.globalData.token,
              id: id
            },
            success: (res) => {
              wx.navigateBack({})
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
