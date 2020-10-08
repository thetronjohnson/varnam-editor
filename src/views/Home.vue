<template>
  <div class="home">
   <v-container class="main" :fluid="fluid">
    <div v-if="$store.state.settings.suggestionsPanelPosition === 'right'">
      <v-row dense>
        <v-col class="editor" lg="9" md="8" sm="7" xs="12">
          <Editor />
        </v-col>
        <v-col class="panel" lg="3" md="4" sm="5" xs="12">
          <SuggestionsPanel />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row dense>
        <v-col class="panel" lg="3" md="4" sm="5" xs="12">
          <SuggestionsPanel />
        </v-col>
        <v-col class="editor" lg="9" md="8" sm="7" xs="12">
          <Editor />
        </v-col>
      </v-row>
    </div>
   </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Editor from '@/components/Editor.vue'
import SuggestionsPanel from '@/components/SuggestionsPanel.vue'

export default {
  name: 'Home',
  components: {
    Editor,
    SuggestionsPanel
  },
  computed: {
    fluid () {
      const b = this.$vuetify.breakpoint.name
      if (b === 'md' || b === 'sm' || b === 'xs') return true
      return false
    }
  }
}
</script>

<style scoped>
</style>
