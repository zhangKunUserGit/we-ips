//app.js
App({
  onLaunch: function () {
    var that = this;
    that.wxLogin = function (user, hideToast) {
      that.globalData.phoneInfo = null;
      that.globalData.sessionid = null;
      if (that.removePhoneInfoCallback) {
        that.removePhoneInfoCallback();
      }
      // 登录
      wx.login({
        success: res => {
          that.globalData.code = res.code;
          if (that.userSessionIdReadyCallback) {
            that.userSessionIdReadyCallback(res);
          }
          wx.showLoading({
            title: '加载中...',
          });
          wx.request({
            method: 'POST',
            url: that.globalData.base_url + '/users/3rdsession?v=' + new Date().getTime(),
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              code: res.code,
              rawData: user.rawData,
              signature: user.signature,
              encryptedData: user.encryptedData,
              iv: user.iv
            },
            success: sessionData => {
              if (sessionData.data.code !== 200) {
                if (!hideToast) {
                  wx.hideLoading();
                  wx.showToast({
                    title: (sessionData.data && sessionData.data.msg) || '授权失败' ,
                    icon: 'none',
                    duration: 2000
                  });
                } else {
                  that.getUserInfoBySetting(true, hideToast);
                }
                return;
              }
              wx.hideLoading();
              if (!hideToast) {
                wx.showToast({
                  title: '授权成功' ,
                  icon: 'success',
                  duration: 2000
                });
              }
              that.globalData.sessionid = sessionData.data.data.sessionid;
              if (that.userSessionIdReadyCallback) {
                that.userSessionIdReadyCallback(sessionData.data.data.sessionid)
              }
            },
            fail: function(err){
              wx.hideLoading();
              if (!hideToast) {
                wx.showToast({
                  title: (err.data && err.data.msg) || '获取用户信息失败' ,
                  icon: 'none',
                  duration: 2000
                });
              }
            },//请求失败
          });
        }
      });
    };

    that.getPhoneInfo = function (info, fn) {
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        method: 'POST',
        url: that.globalData.base_url + '/users/phone',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "sessionid": that.globalData.sessionid
        },
        data: {
          encryptedData: info.encryptedData,
          iv: info.iv
        },
        success: phoneData => {
          wx.hideLoading();
          if (phoneData.data.code !== 200) {
            wx.showToast({
              title: '获取手机号码失败, 请重试',
              icon: 'none',
              duration: 2000
            });
            that.getUserInfoBySetting(true);
            return;
          }
          wx.showToast({
            title: '手机授权成功' ,
            icon: 'success',
            duration: 2000
          });
          that.globalData.phoneInfo = phoneData.data.data;
          if (that.userPhoneReadyCallback) {
            that.userPhoneReadyCallback(phoneData.data.data)
          }
          if (fn) {
            fn(phoneData.data.data);
          }
        },
        fail: function (err) {
          wx.hideLoading();
          wx.showToast({
            title: (err.data && err.data.msg) || '获取手机号码失败',
            icon: 'none',
            duration: 2000
          });
        },//请求失败
      });
    };
    that.getUserInfoBySetting = function(a, hideToast) {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: user => {
                that.globalData.userInfo = user.userInfo;
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(user)
                }
                that.wxLogin(user, hideToast);
              }
            })
          } else {
            if (that.userNotAuthCallback) {
              that.userNotAuthCallback()
            }
          }
        }
      });
    };
    that.getUserInfoBySetting(false, true);
  },
  globalData: {
    // base_url: 'http://rap2api.taobao.org/app/mock/118824',
    // base_url: 'http://43.247.90.152:8081',
    base_url: 'https://wx.ipsinteriors.com/api',
    base_img_url: 'https://ips-source.oss-cn-hangzhou.aliyuncs.com/ipsimg',
    sessionid: null,
    userInfo: null,
    phoneInfo: null,
    openid: 'wx051b26a66be567e3',
    wx_url_1: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=',
    wx_url_2: '&grant_type=authorization_code',
  }
});
