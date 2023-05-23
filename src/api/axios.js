import axios from 'axios'

axios.defaults.timeout = 100000;
axios.defaults.baseURL = "/api";

export const getAllData = params => {
    return axios.get(`api/Data/GetAll`,{ params: params });
};

export default axios;
