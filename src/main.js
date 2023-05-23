import { createApp } from 'vue'

import App from './App.vue'
import router from './router' 

import { Button, Icon} from 'vant'

import 'vant/lib/index.css'


const app = createApp(App);
app.use(Button)
app.use(Icon)

app.use(router)
app.mount('#app')
