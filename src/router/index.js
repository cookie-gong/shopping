import Vue from 'vue'
import VueRouter from 'vue-router'

/* 
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

import Add from '../components/goods/Add.vue'
import Categories from '../components/goods/Categories.vue'
import Goods from '../components/goods/Goods.vue'
import Params from '../components/goods/Params.vue'

import Order from '../components/order/Order.vue'
import ScreenPage from '../components/report/ScreenPage.vue' */

// 懒加载: 登录——主页——欢迎页
const LoginComponent = () => import(/* webpackChunkName: "login_Home_Welcome" */ '../components/LoginComponent.vue')
const HomeComponent = () => import(/* webpackChunkName: "login_Home_Welcome" */ '../components/HomeComponent.vue')
const WelcomeComponent = () => import(/* webpackChunkName: "login_Home_Welcome" */ '../components/WelcomeComponent.vue')

// 用户管理
const UsersComponent = () => import(/* webpackChunkName: "users" */ '../components/users/UsersComponent.vue')

// 权限管理
const RightsComponent = () => import(/* webpackChunkName: "rights" */ '../components/power/RightsComponent.vue')
const RolesComponent = () => import(/* webpackChunkName: "rights" */ '../components/power/RolesComponent.vue')

// 商品管理
const Categories = () => import(/* webpackChunkName: "goods" */ '../components/goods/CategoriesComponent.vue')
const ParamsComponent = () => import(/* webpackChunkName: "goods" */ '../components/goods/ParamsComponent.vue')
const AddComponent = () => import(/* webpackChunkName: "goods" */ '../components/goods/AddComponent.vue')
const GoodsComponent = () => import(/* webpackChunkName: "goods" */ '../components/goods/GoodsComponent.vue')

// 订单管理
const OrderComponent = () => import(/* webpackChunkName: "order_Report" */ '../components/order/OrderComponent.vue')

// 数据可视化
const ScreenPage = () => import(/* webpackChunkName: "order_Report" */ '../components/report/ScreenPage.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginComponent },
    {
      path: '/home',
      component: HomeComponent,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: WelcomeComponent },
        { path: '/users', component: UsersComponent },
        { path: '/rights', component: RightsComponent },
        { path: '/roles', component: RolesComponent },
        { path: '/categories', component: Categories },
        { path: '/goods', component: GoodsComponent },
        { path: '/goods/add', component: AddComponent },
        { path: '/params', component: ParamsComponent },
        { path: '/orders', component: OrderComponent },
      ],
    },
    { path: '/reports', component: ScreenPage },
  ],
})
/* 路由守卫 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
