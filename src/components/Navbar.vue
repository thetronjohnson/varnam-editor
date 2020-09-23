<template>
  <div>
    <v-toolbar>
      <v-toolbar-title class="title">
        <router-link to="/" class="primary--text text-decoration-none">
          Varnam Editor
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-row align="center" justify="end" class="d-inline-flex">
        <v-col cols="2">
          <v-select
            :items="langs"
            :hide-details="true"
            value="Malayalam"
            v-model="lang"
            label="Language"
            outlined
            dense
          ></v-select>
        </v-col>
        <v-col cols="2">
          <div v-if="$route.name == 'Home'">
            <v-btn to="/settings" color="primary" depressed>
              <v-icon>mdi-cog</v-icon>
              Settings
            </v-btn>
          </div>
          <div v-else>
            <v-btn to="/" color="primary" depressed>
              <v-icon>mdi-arrow-left</v-icon>
              Back
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-toolbar>
    <hr/>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
      langs: Object.keys(this.$LANGS)
    }
  },
  computed: {
    lang: {
      get () {
        return this.$store.state.lang
      },
      set (value) {
        this.$store.commit('setLang', value)
      }
    }
  }
}
</script>
