import axios from 'axios'

axios.defaults.timeout = 3000;
axios.defaults.baseURL = "/apaas";

export default axios;
