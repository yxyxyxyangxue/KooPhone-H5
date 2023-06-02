import { createRouter, createWebHistory } from 'vue-router'
 
const routerHistory = createWebHistory()

const AppOrder = () => import('../components/AppOrder')
const AppSuccess = () => import('../components/AppSuccess')

const routes =[
    {
        path: '/', 
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
  history: routerHistory,
  routes
})
export default router


