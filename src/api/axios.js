import axios from 'axios'

axios.defaults.timeout = 100000;
axios.defaults.baseURL = "/apaas";

export default axios;
