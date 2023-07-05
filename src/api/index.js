import request from './axios';

// token校验
export const tokenValidate = (data) => { 
  return request({
    url: '/apaas/koophone/v1/auth/phone',
    method: 'post',
    data
  })
};
// 签名加密
export const signEncrypt = (data) => { 
  return request({
    url: '/apaas/koophone/v1/auth/sign',
    method: 'post',
    data
  })
};
// 是否已订购
export const checkOrder = (data) => { 
  return request({
    url: '/apaas/koophone/v1/order/status',
    method: 'post',
    data
  })
};
// 获取验证码
export const getSMS = (data) => { 
  return request({
    url: '/apaas/koophone/v1/auth/sendSmsCode',
    method: 'post',
    data
  })
};
// 验证码校验
export const smsCodeCheck = (data) => { 
  return request({
    url: '/apaas/koophone/v1/auth/login',
    method: 'post',
    data
  })
};
// 领取流量
export const getTraffic = (data) => { 
  return request({
    url: '/apaas/koophone/v1/order/add',
    method: 'post',
    data
  })
};
// 埋点上报
export const pointReporting = (headers, data) => { 
  return request({
    url: '/cloudphone/bilog/upload',
    method: 'post',
    headers,
    data
  })
};