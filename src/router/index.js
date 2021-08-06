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
const Login = () => import(/* webpackChunkName: "login_Home_Welcome" */ "../components/Login.vue")
const Home = () => import(/* webpackChunkName: "login_Home_Welcome" */ "../components/Home.vue")
const Welcome = () => import(/* webpackChunkName: "login_Home_Welcome" */ "../components/Welcome.vue")

// 用户管理
const Users = () => import(/* webpackChunkName: "users" */ "../components/users/Users.vue")

// 权限管理
const Rights = () => import(/* webpackChunkName: "rights" */ "../components/power/Rights.vue")
const Roles = () => import(/* webpackChunkName: "rights" */ "../components/power/Roles.vue")

// 商品管理
const Categories = () => import(/* webpackChunkName: "goods" */ "../components/goods/Categories.vue")
const Params = () => import(/* webpackChunkName: "goods" */ "../components/goods/Params.vue")
const Add = () => import(/* webpackChunkName: "goods" */ "../components/goods/Add.vue")
const Goods = () => import(/* webpackChunkName: "goods" */ "../components/goods/Goods.vue")

// 订单管理
const Order = () => import(/* webpackChunkName: "order_Report" */ "../components/order/Order.vue")

// 数据可视化
const ScreenPage = () => import(/* webpackChunkName: "order_Report" */ "../components/report/ScreenPage.vue")

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories },
        { path: '/goods', component: Goods },
        { path: '/goods/add', component: Add },
        { path: '/params', component: Params },
        { path: '/orders', component: Order },

      ]
    },
    { path: '/reports', component: ScreenPage },
  ]
})
/* 路由守卫 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
