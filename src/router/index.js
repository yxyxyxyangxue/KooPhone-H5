import { createRouter, createWebHistory } from 'vue-router'
 
const routerHistory = createWebHistory()

const AppOrder = () => import('../components/AppOrder')
const AppSuccess = () => import('../components/AppSuccess')

const routes =[
    {
        path: '/', 
        redirect: '/AppOrder',
    },
    {
        path: '/AppOrder',
        name: 'AppOrder',
        component: AppOrder
    },
    {
        path: '/AppSuccess',
        name: 'AppSuccess',
        component: AppSuccess
    }
]


const router = createRouter({
  history: routerHistory,
  routes
})
export default router


