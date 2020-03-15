import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import axios from 'axios'
Vue.prototype.$http = axios


//设置axios为form-data
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
}]

// 默认请求地址
axios.defaults.baseURL = 'http://localhost:8081/blog'

Vue.config.productionTip = false

//让ajax携带cookie
axios.defaults.withCredentials = true; 

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
