import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    // 根目录
    name: 'home',
    path: '/',
    redirect: '/bookfile'
  },
  {
    // 采集文件管理
    name: 'bookfile',
    path: '/bookfile',
    component: () => import(/* webpackChunkName: "bookFile" */'@/views/bookfile/list')
  },
  {
    // 采集文件管理
    name: 'bookfiledetailadd',
    path: '/bookfile/detail',
    component: () => import(/* webpackChunkName: "bookFile" */'@/views/bookfile/detail')
  },
  { // 采集处理管理
    name: 'dealresulth',
    path: '/dealresult',
    component: () => import(/* webpackChunkName: "dealResult" */'@/views/dealresult/list')
  },
  { // 账套对应关系查看
    name: 'entitybook',
    path: '/entitybook',
    component: () => import(/* webpackChunkName: "entityBook" */'@/views/entitybook/list')
  }
]

const router = new VueRouter({
  routes
})

export default router
