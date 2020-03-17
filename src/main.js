import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
Vue.prototype.$http = axios

// 检测侧边栏是否关闭
Vue.prototype.checkMenu = function(menuName) {
    const that = this;
    this.$http.get("/menu/checkMenuIsOpen", {
        params: {
            menuName: menuName
        }
    }).then(function(response) {
        const code = response.data.code
        if (code === 1) return that.$router.push({ path: '/home' })
    })
}

// 输出提示信息
Vue.prototype.basic = function(status, data) {
    if (status !== 200) return this.$message.error('服务器出现问题，请联系系统管理员')
    if (data !== '' && data.code === 1) {
        return this.$message.error(data.msg)
    }
}

// 根据路由设置标题
router.beforeEach((to, from, next) => {
    /*路由发生改变修改页面的title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next();
})

//设置axios为form-data
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function(data) {
    let ret = ''
    for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
}]

// 默认请求地址
axios.defaults.baseURL = 'http://localhost:8081/blog'

axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

Vue.config.productionTip = false

//让ajax携带cookie
axios.defaults.withCredentials = true;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')