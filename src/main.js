import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// No trailing slash
// api.varnamproject.com
window.$VARNAM_API_URL = 'http://127.0.0.1:8089'
Vue.prototype.$VARNAM_API_URL = window.$VARNAM_API_URL

Vue.prototype.$LANGS = {
  ml: 'Malayalam',
  hi: 'Hindi',
  kn: 'Kannada'
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
