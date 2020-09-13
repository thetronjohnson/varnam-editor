import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang: 'ml',
    suggestions: []
  },
  mutations: {
    setSuggestions (state, payload) {
      state.suggestions = [
        ...[payload.input],
        ...payload.result
      ]
    },
    clearSuggestions (state) {
      state.suggestions = []
    },
    setLang (state, lang) {
      state.lang = lang
    }
  },
  actions: {
  },
  modules: {
  }
})
