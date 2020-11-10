import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Setting from '../views/Setting.vue'
import AlarmAdd from '../views/AlarmAdd.vue'
import AlarmDetail from '../views/AlarmDetail.vue'

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
    path: '/alarm/add',
    name: 'AlarmAdd',
    component: AlarmAdd,
    meta: {
        index: 7, // ページ番号
    },
  },
{
    path: '/alarm/detail/:alarmId',
    name: 'alarm.detail',
    component: AlarmDetail,
    meta: {
        index: 8, // ページ番号
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
