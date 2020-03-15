import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {path: '/', redirect:'/login'},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/home', component: Home}
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问路径
  // from 从哪个路径跳转而来
  // next 放行
  // next() 代表放行 next('/login') 强制跳转

  // 访问login放行
  if(to.path === '/login') return next();
  // 访问register放行
  if(to.path === '/register') return next();
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if(!token) return next('/login')
  next()
})

export default router