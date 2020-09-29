import Vue from 'vue'
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'
import VuetifyToast from 'vuetify-toast-snackbar-ng'

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  }
})
Vue.use(VuetifyToast)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#4c5df5',
        secondary: '#00bcd4',
        accent: '#03a9f4',
        error: '#e91e63',
        warning: '#ffc107',
        info: '#2196f3',
        success: '#4caf50'
      }
    }
  }
})
