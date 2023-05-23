import request from './axios';

export const tokenValidate = params => { return request({
    url: 'Data/GetAll',
    method: 'get',
    params
  }) 
};