import request from './axios';

export const getAllData = (headers, params) => { return request({
    url: 'api/Data/GetAll',
    method: 'get',
    headers,
    params
  }) 
};
// token校验
export const tokenValidate = (data) => { 
  return request({
    url: 'koophone/v1/auth/phone',
    method: 'post',
    data
  })
};
// 签名加密
export const signEncrypt = (params) => { 
  return request({
    url: 'koophone/v1/auth/sign',
    method: 'post',
    params
  })
};
// 是否已订购
export const checkOrder = (params) => { 
  return request({
    url: 'koophone/v1/order/receiveStatus',
    method: 'post',
    params
  })
};
// 获取验证码
export const getSMS = (params) => { 
  return request({
    url: 'koophone/v1/auth/sendSmsCode',
    method: 'post',
    params
  })
};
// 验证码校验
export const smsCodeCheck = (params) => { 
  return request({
    url: 'koophone/v1/auth/login',
    method: 'post',
    params
  })
};
// 领取流量
export const getTraffic = (params) => { 
  return request({
    url: 'koophone/v1/order/add',
    method: 'post',
    params
  })
};
// 履约结果查询
export const getResponse = (params) => { 
  return request({
    url: 'koophone/v1/auth/phone',
    method: 'post',
    params
  })
};
