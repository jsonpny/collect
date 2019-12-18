import router from '../../router'
import Vue from 'vue'
// import axios from 'axios'

const _import = file => () => import('@/views' + file)
const routevue = () =>
  import(/* webpackChunkName: "routevue" */ '@/components/router.vue')

var getRouter // 用来获取后台拿到的路由

export function permissionRouter () {
  Vue.prototype.$http.get('/api/base/loadmodules').then(res => {
  // axios.get('/static/jsonData/nav.json').then(res => {
    getRouter = res.data.data
    routerGo()
  })
}

function routerGo () {
  getRouter.filter(layout => {
    dynamicRoutes.filter(routeLayout => {
      if (layout.name === routeLayout.name) {
        routeLayout.children = filterAsyncRouter(layout.data) // 过滤路由
      }
    })
  })
  router.app.$store.state.route = dynamicRoutes
  router.addRoutes(dynamicRoutes)
}

function filterAsyncRouter (asyncRouterMap, parentroute) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component && route.component !== '/router') {
      route.component = _import(route.component)
    } else {
      route.component = routevue
    }
    if (
      route.path &&
      route.path.length > 0 &&
      route.path.lastIndexOf('/') < route.path.length - 1
    ) {
      route.path += '/'
    }
    if (route.defaultpage === true) {
      Vue.set(parentroute, 'redirect', route.path)
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route)
    }
    return true
  })
  return accessedRouters
}

export const dynamicRoutes = [
  {
    name: 'tm',
    path: '/tm',
    component: () =>
      import(/* webpackChunkName: "Tm" */ '@/components/layout/tm'),
    children: []
  },
  {
    name: 'tlm',
    path: '/tlm',
    component: () =>
      import(/* webpackChunkName: "Tlm" */ '@/components/layout/tlm'),
    children: []
  },
  {
    path: '*',
    component: () =>
      import(/* webpackChunkName: "NotFound" */ '@/components/404')
  }
]
