import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentWord: 0, // Word ID
    lang: 'ml',

    /**
     * {
     *   wordid: [suggestions: string]
     * }
     */
    suggestions: {}
  },
  mutations: {
    setCurrentWord (state, payload) {
      state.currentWord = payload
    },

    setSuggestions (state, payload) {
      Vue.set(state.suggestions, payload.id, [
        ...[payload.word],
        ...payload.suggestions
      ])
    },

    clearSuggestions (state, wordID) {
      Vue.delete(state.suggestions, wordID)
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
