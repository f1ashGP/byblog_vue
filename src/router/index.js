import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import AdminHome from '../components/AdminHome.vue'
import Welcome from '../components/Welcome.vue'
import MenuList from '../components/menu/MenuList.vue'
import RoleList from '../components/role/RoleList.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login, meta: { title: 'ByBlog后台管理' } },
        {
            path: '/home',
            component: AdminHome,
            meta: { title: '首页' }
        },
        {
            path: '/adminHome',
            component: AdminHome,
            meta: { title: '首页' },
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome, meta: { title: '后台管理' } },
                { path: '/menuList', component: MenuList, meta: { title: '侧边栏列表' } },
                { path: '/roleList', component: RoleList, meta: { title: '权限列表' } }
            ]
        }
    ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问路径
    // from 从哪个路径跳转而来
    // next 放行
    // next() 代表放行 next('/login') 强制跳转

    // 访问login放行
    if (to.path === '/login') return next();
    // 获取token
    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
})

export default router