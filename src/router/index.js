import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Setting from '../views/Setting.vue'
import AleamAdd from '../views/AleamAdd.vue'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
        index: 0, // ページ番号
    },

  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    meta: {
        index: 1, // ページ番号
    },
  },
  {
    path: '/aleam/add',
    name: 'AleamAdd',
    component: AleamAdd,
    meta: {
        index: 7, // ページ番号
    },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
