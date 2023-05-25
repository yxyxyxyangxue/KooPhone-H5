import request from './axios';

export const getAllData = (headers, params) => { return request({
    url: 'api/Data/GetAll',
    method: 'get',
    headers,
    params
  }) 
};
// token校验
export const tokenValidate = (headers, params) => { 
  return request({
    url: 'api/uniTokenValidate',
    method: 'post',
    headers,
    params
  })
};
// 签名加密
export const signEncrypt = (headers, params) => { 
  return request({
    url: 'api/signEncrypt',
    method: 'post',
    headers,
    params
  })
};
// 是否已领取
export const checkOrder = (headers, params) => { 
  return request({
    url: 'api/checkOrder',
    method: 'post',
    headers,
    params
  })
};
// 领取流量
export const getTraffic = (headers, params) => { 
  return request({
    url: 'api/getTraffic',
    method: 'post',
    headers,
    params
  })
};
// 获取验证码
export const getSMS = (headers, params) => { 
  return request({
    url: 'api/getSMS',
    method: 'post',
    headers,
    params
  })
};
// 验证码校验
export const smsCodeCheck = (headers, params) => { 
  return request({
    url: 'api/smsCodeCheck',
    method: 'post',
    headers,
    params
  })
};