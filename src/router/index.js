import Vue from 'vue'
import VueRouter from 'vue-router'
import * as helper from '@/services/helper'
import VerticleLayout from '@/layouts/VerticleLayout'
import CategoryMain from '@/views/Category/CategoryMain'
import CategoryForm from '@/views/Category/CategoryForm'
import ProductMain from '@/views/Product/ProductMain'
import ProductForm from '@/views/Product/ProductForm'
import DashboardLanding from '@/views/Dashboards/DashboardLanding'
import AuthLayout from '@/layouts/AuthLayouts/AuthLayout'
import SignIn from '@/views/AuthPages/Default/SignIn'
Vue.use(VueRouter)
var route = [
  {
    path: '/',
    name: 'dashboard',
    meta: { auth: true, name: 'dashboard' },
    component: VerticleLayout,
    redirect: { name: 'dashboard.landing' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard.landing',
        meta: { auth: true, name: 'dashboard' },
        component: DashboardLanding
      },
      {
        path: 'category',
        name: 'dashboard.category',
        meta: { auth: true, name: 'category' },
        component: CategoryMain
      },
      {
        path: 'category/add',
        name: 'dashboard.category.add',
        meta: { auth: true, name: 'category add' },
        component: CategoryForm
      },
      {
        path: 'category/:id',
        name: 'dashboard.category.edit',
        meta: { auth: true, name: 'category edit' },
        component: CategoryForm
      },
      {
        path: 'product',
        name: 'dashboard.product',
        meta: { auth: true, name: 'product' },
        component: ProductMain
      },
      {
        path: 'product/add',
        name: 'dashboard.product.add',
        meta: { auth: true, name: 'product add' },
        component: ProductForm
      },
      {
        path: 'product/:id',
        name: 'dashboard.product.edit',
        meta: { auth: true, name: 'product edit' },
        component: ProductForm
      }
    ]
  },
  {
    path: '/auth',
    name: 'auth',
    meta: { auth: false, name: 'auth' },
    component: AuthLayout,
    children: [
      {
        path: 'sign-in',
        name: 'auth.sign-in',
        meta: { auth: false, name: 'sign-in' },
        component: SignIn
      }
    ]
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes: route
})
router.beforeEach((to, from, next) => {
  const publicPages = ['/auth/sign-in', '/auth/sign-up']
  if (publicPages.includes(to.path)) {
    helper.eraseCookie('user')
    helper.eraseCookie('jwt-token')
  }
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = helper.getCookie('jwt-token')
  if (to.meta.auth) {
    if (authRequired && loggedIn === null) {
      return next('/auth/sign-in')
    } else {
    }
  }
  next()
})

export default router
