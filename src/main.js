import { createApp } from 'vue'

import App from './App.vue'
import router from './router' 
import Vuex from 'vuex'
 
import { Field, CellGroup, Toast } from 'vant'
import store from './store'

import 'vant/lib/index.css'
import '../src/style.css'

const app = createApp(App);
app.use(Field)
app.use(CellGroup)
app.use(Toast)
app.use(store)

app.use(router)
app.use(Vuex)
app.mount('#app')
