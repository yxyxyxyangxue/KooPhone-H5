import { createRouter, createWebHashHistory } from 'vue-router'
 
const routerHash = createWebHashHistory()

const AppOrder = () => import('../components/AppOrder')
const AppSuccess = () => import('../components/AppSuccess')

const routes =[
    {
        path: '', 
        redirect: '/apporder',
    },
    {
        path: '/apporder',
        name: 'AppOrder',
        component: AppOrder
    },
    {
        path: '/appsuccess',
        name: 'AppSuccess',
        component: AppSuccess
    }
]


const router = createRouter({
  history: routerHash,
  routes
})
export default router


