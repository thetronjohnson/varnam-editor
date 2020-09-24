import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentWord: 0, // Word ID

    langs: [],

    // Suggestions to display
    suggestionsDisplay: [],

    /**
     * {
     *   wordid: [suggestions]
     * }
     */
    suggestions: {},

    /**
     * {
     *   transliterated_word: [suggestions]
     * }
     */
    alternateWords: {},

    // Editor settings
    settings: {
      lang: 'ml',
      fontSize: 14
    }
  },
  mutations: {
    initSettings (state) {
      let settings = window.localStorage.getItem('varnam-settings')
      if (settings) {
        settings = JSON.parse(settings)
        state.settings = Object.assign({}, state.settings, settings)
      }
    },

    updateSettings (state, payload) {
      Vue.set(state, 'settings', {
        ...state.settings,
        ...payload
      })

      window.localStorage.setItem('varnam-settings', JSON.stringify(state.settings))
    },

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

    displaySuggestions (state, suggestions) {
      state.suggestionsDisplay = suggestions
    },

    setLangs (state, langs) {
      state.langs = langs
    }
  },
  actions: {
  },
  modules: {
  }
})
