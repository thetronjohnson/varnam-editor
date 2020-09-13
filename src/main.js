import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

window.$VARNAM_API_URL = "https://api.varnamproject.com/"
Vue.prototype.$VARNAM_API_URL = window.$VARNAM_API_URL

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
