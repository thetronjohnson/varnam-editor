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
        <v-col lg="2" sm="6">
          <v-select
            :items="langs"
            :hide-details="true"
            v-model="lang"
            label="Language"
            outlined
            dense
          ></v-select>
        </v-col>
        <v-col lg="2" sm="4">
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
  </div>
</template>

<script>
export default {
  name: 'Navbar',

  data () {
    return {}
  },

  computed: {
    langs: function () {
      const items = []
      this.$store.state.langs.forEach(langInfo => {
        items.push({
          text: langInfo.DisplayName,
          value: langInfo.Identifier
        })
      })
      return items
    },

    lang: {
      get () {
        return this.$store.state.settings.lang
      },
      set (value) {
        this.$store.commit('updateSettings', {
          lang: value
        })
      }
    }
  }
}
</script>
