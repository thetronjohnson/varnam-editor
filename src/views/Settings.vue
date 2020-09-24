<template>
  <v-container fluid>
    <v-layout row class="d-flex justify-center">
      <v-flex xs6>
        <v-tabs v-model="tab" :grow="true">
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#editor">
            <v-icon>lead-pencil</v-icon>
            Editor
          </v-tab>
          <v-tab href="#words">
            <v-icon>lead-pencil</v-icon>
            Words
          </v-tab>
          <v-tab-item value="editor">
            <v-card flat tile>
              <v-card-text>
                <EditorSettings />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="words">
            <div v-if="$VARNAM_OFFLINE">
              <v-tabs :vertical="true">
                <v-tab>Offline</v-tab>
                <v-tab>Online</v-tab>
                <v-tab-item>
                  <AddWordsOffline/>
                </v-tab-item>
                <v-tab-item>
                  <AddWordsOnline/>
                </v-tab-item>
              </v-tabs>
            </div>
            <div v-else>
              <AddWordsOnline/>
            </div>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AddWordsOnline from '@/components/AddWordsOnline.vue'
import AddWordsOffline from '@/components/AddWordsOffline.vue'
import EditorSettings from '@/components/EditorSettings.vue'

export default {
  name: 'Settings',

  computed: {
    tab: {
      set (tab) {
        this.$router.replace({
          query: { ...this.$route.query, tab }
        })
      },
      get () {
        return this.$route.query.tab
      }
    }
  },

  components: {
    AddWordsOnline,
    AddWordsOffline,
    EditorSettings
  }
}
</script>
