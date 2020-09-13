import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    }
  },
  actions: {
  },
  modules: {
  }
})
