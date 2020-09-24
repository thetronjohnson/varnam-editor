import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// Is this editor running offline on a system and not the website
window.$VARNAM_OFFLINE = true

// No trailing slash
window.$VARNAM_API_URL = 'http://127.0.0.1:8123'
// window.$VARNAM_API_URL = 'https://api.varnamproject.com'

Vue.prototype.$VARNAM_OFFLINE = window.$VARNAM_OFFLINE
Vue.prototype.$VARNAM_API_URL = window.$VARNAM_API_URL

window.fetch(window.$VARNAM_API_URL + '/languages')
  .then(response => response.json())
  .then(languages => {
    store.commit('setLangs', languages)
  })

store.commit('initSettings')

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
