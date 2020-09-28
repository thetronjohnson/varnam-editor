import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// Offline-first, so keep this value true, and the next URLs localhost on commit
// Is this editor running offline on a system and not the website
window.$VARNAM_OFFLINE = true

// No trailing slash
window.$VARNAM_API_URL = 'http://127.0.0.1:8123'
// window.$VARNAM_API_URL = 'https://api.varnamproject.com'

window.$VARNAM_REVIEW_URL = 'http://127.0.0.1:3000'
// window.$VARNAM_REVIEW_URL = 'https://kde.smc.org.in:8124'

Vue.prototype.$VARNAM_OFFLINE = window.$VARNAM_OFFLINE
Vue.prototype.$VARNAM_API_URL = window.$VARNAM_API_URL
Vue.prototype.$VARNAM_REVIEW_URL = window.$VARNAM_REVIEW_URL

window.fetch(window.$VARNAM_API_URL + '/languages')
  .then(response => response.json())
  .then(languages => {
    store.commit('setLangs', languages)
  })

store.commit('initSettings')

if (window.$VARNAM_OFFLINE) {
  // set upstream url. this allows varnam-desktop's config.toml value to be here
  window.fetch(window.$VARNAM_API_URL + '/get/upstream-url')
    .then(response => response.text())
    .then(url => {
      store.commit('setUpstream', url)
    })
}

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
        db.close()
      })
    })
  },

  fetchWords () {
    this.getWordsStore().then(wordsStore => {
      wordsStore.getAll().onsuccess = e => {
        store.commit('setIDBWords', e.target.result)
      }
    })
  }
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
