import { createApp } from 'vue'

import App from './App.vue'
import router from './router' 

import { Button, Icon, Dialog, Field, CellGroup, Toast } from 'vant'

import 'vant/lib/index.css'
import '../src/style.css'


const app = createApp(App);
app.use(Button)
app.use(Icon)
app.use(Dialog)
app.use(Field)
app.use(CellGroup)
app.use(Toast)

app.use(router)
app.mount('#app')
