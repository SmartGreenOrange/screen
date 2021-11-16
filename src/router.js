import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: () => import('./views/home/index.vue')
        },
        {
            path: '/screen',
            component: () => import('./views/screen/index.vue')
        },
        {
            path: '/scroll-list',
            component: () => import('./views/scroll-list/index.vue')
        }
    ]
})

export default router
