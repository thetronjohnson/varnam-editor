<template>
  <div class="home">
   <v-container class="main">
    <div v-if="$store.state.settings.suggestionsPanelPosition === 'right'">
      <v-row>
        <v-col class="editor" cols="6" sm="9">
          <Editor />
        </v-col>
        <v-col class="panel" cols="6" sm="3">
          <SuggestionsPanel />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row dense>
        <v-col class="panel" cols="6" sm="3">
          <SuggestionsPanel />
        </v-col>
        <v-col class="editor" cols="6" sm="9">
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
  }
}
</script>

<style scoped>
</style>
