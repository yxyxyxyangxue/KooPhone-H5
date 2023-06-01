import { createApp } from 'vue'

import App from './App.vue'
import router from './router' 

import { Field, CellGroup, Toast } from 'vant'

import 'vant/lib/index.css'
import '../src/style.css'


const app = createApp(App);
app.use(Field)
app.use(CellGroup)
app.use(Toast)

app.use(router)
app.mount('#app')
