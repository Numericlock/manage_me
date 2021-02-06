import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Setting from '../views/Setting.vue'
import Sounds from '../views/Sounds.vue'

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
        index: 2, // ページ番号
    },
  },
  {
    path: '/sounds',
    name: 'Sounds',
    component: Sounds,
    meta: {
        index: 1, // ページ番号
    },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
