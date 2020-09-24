import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// Is this editor running offline on a system and not the website
window.$VARNAM_OFFLINE = false

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

// any change to IndexedDB schema should be
// reflected here with a version update
const VARNAM_INDEXEDDB_VERSION = 1

Vue.prototype.$VARNAM_IDB = {
  getDB () {
    return new Promise(resolve => {
      const openRequest = window.indexedDB.open('varnam-' + store.state.settings.lang, VARNAM_INDEXEDDB_VERSION)

      openRequest.onupgradeneeded = function (e) {
        const db = openRequest.result
        switch (e.oldVersion) {
          case 0:
            // version 0 means that the client had no database
            // nothing to initialize
            db.createObjectStore('words', {
              keyPath: 'id',
              autoIncrement: true
            })
            break
          case 1:
            // client had version 1
        }
      }

      openRequest.onerror = function () {
        console.error('IndexedDB Error', openRequest.error)
      }

      openRequest.onsuccess = function (e) {
        const db = e.target.result

        resolve(db)

        db.onversionchange = function () {
          db.close()
          window.alert('Database is outdated, please reload the page.')
        }
      }
    })
  },

  getWordsStore () {
    return new Promise(resolve => {
      return this.getDB().then(db => {
        const transaction = db.transaction('words', 'readwrite')
        const wordsStore = transaction.objectStore('words')

        resolve(wordsStore)
      })
    })
  }
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
