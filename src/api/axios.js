import axios from 'axios'

axios.defaults.timeout = 100000;
axios.defaults.baseURL = "/api";

export default axios;
