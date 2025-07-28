import { namespaceContextKey } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart.vue')
  },
  {
    path: '/special',
    name: 'Special',
    component: () => import('@/views/Special.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue')
  },
  {
    path: '/orderConfirm',
    name: 'OrderConfirm',
    component: () => import('@/views/OrderConfirm.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/Orders.vue')
  },
  {
    path: '/european',
    name: 'european',
    component: () => import('@/views/european.vue')
  },

  // 皮肤科学美容事业部
  {
    path: '/skin-care',
    name: 'skin-care',
    component: () => import('@/views/skin-care.vue')
  },
  {
    path: '/skin-care/brand1',
    name: 'skin-care-brand1',
    component: () => import('@/views/skin-care-brand1.vue')
  },
  {
    path: '/skin-care/brand2',
    name: 'skin-care-brand2',
    component: () => import('@/views/skin-care-brand2.vue')
  },
  {
    path: '/skin-care/brand3',
    name: 'skin-care-brand3',
    component: () => import('@/views/skin-care-brand3.vue')
  },
  {
    path: '/skin-care/brand4',
    name: 'skin-care-brand4',
    component: () => import('@/views/skin-care-brand4.vue')
  },

  // 专业美妆产品 
  { 
    path: '/beauty',
    name: 'beauty',
    component: () => import('@/views/beauty.vue')
  },
  {
    path: '/beauty/brand1',
    name: 'beauty-brand1',
    component: () => import('@/views/beauty-brand1.vue')
  },
  {
    path: '/beauty/brand2',
    name: 'beauty-brand2',
    component: () => import('@/views/beauty-brand2.vue')
  },

  // 高端化妆品部
  {
    path:'/aromatherapy',
    name: 'aromatherapy',
    component: () => import('@/views/aromatherapy.vue')
  },
  {
    path:'/aromatherapy/brand1',
    name: 'aromatherapy-brand1',
    component: () => import('@/views/aromatherapy-brand1.vue')
  },
  
  // 大众化妆品部
  {
    path:'/dermo',
    name: 'dermo',
    component: () => import('@/views/dermo.vue')
  },
  {
    path:'/dermo/brand1',
    name: 'dermo-brand1',
    component: () => import('@/views/dermo-brand1.vue')
  },
  {
    path: '/dermo/brand2',
    name: 'dermo-brand2',
    component: () => import('@/views/dermo-brand2.vue')
  },
  {
    path: '/dermo/brand3',
    name: 'dermo-brand3',
    component: () => import('@/views/dermo-brand3.vue')
  },


  {
    path:'/address',
    name: 'address',
    component: () => import('@/views/address.vue')
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: () => import('@/views/change-password.vue')
  }
]

// 创建路由实例
// 使用 createWebHistory 创建基于 HTML5 History 模式的路由
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 用于标记是否为应用内导航
let isNavigatingFromApp = false

// 设置应用内导航标记
export const setAppNavigation = () => {
  isNavigatingFromApp = true
}

// 全局前置守卫 - 检测页面刷新
router.beforeEach((to, from, next) => {
  // 如果是登录页面，直接放行
  if (to.path === '/login') {
    next()
    return
  }
  
  // 检测是否为页面刷新（from.name为null表示直接访问或刷新）
  if (!from.name && !isNavigatingFromApp) {
    // 页面刷新或直接访问，跳转到登录页
    next('/login')
    return
  }
  
  // 重置标记
  isNavigatingFromApp = false
  next()
})

export default router
