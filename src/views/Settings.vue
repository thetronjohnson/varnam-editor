<template>
  <v-container fluid>
    <v-layout row class="d-flex justify-center">
      <v-flex xs11 xl6>
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
            <EditorSettings />
            <LanguageDownload v-if="$VARNAM_OFFLINE" />
          </v-tab-item>
          <v-tab-item value="words">
            <div v-if="$VARNAM_OFFLINE">
              <AddWordsOffline/>
            </div>
            <div v-else>
              <v-tabs v-model="vtab" :vertical="true">
                <v-tab href="#offline">Offline</v-tab>
                <v-tab href="#online">Online</v-tab>
                <v-tab-item value="offline">
                  <v-card flat tile>
                    <v-card-text>
                      <AddWordsOffline/>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item value="online">
                  <v-card flat tile>
                    <v-card-text>
                      <AddWordsOnline/>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </div>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout><br/>
    <v-divider></v-divider>
    <v-footer
      :padless="true"
    >
      <v-card
        flat
        tile
        width="100%"
        class="text-center"
      >
        <v-card-text>
          Need Help ? Feedback ? <a href="https://indicproject.org/" target="_blank">Contact Us</a><br/><br/>
          <a href="https://varnamproject.com/" target="_blank">Varnam</a> is a Free Software under&nbsp;<a href="https://indicproject.org/" target="_blank">Indic Project</a>. Copyright 2020, <a href="https://github.com/athul/varnam-desktop/graphs/contributors" target="_blank">Varnam Contributors</a>.
        </v-card-text>
      </v-card>
    </v-footer>
  </v-container>
</template>

<script>
import AddWordsOnline from '@/components/AddWordsOnline.vue'
import AddWordsOffline from '@/components/AddWordsOffline.vue'
import EditorSettings from '@/components/EditorSettings.vue'
import LanguageDownload from '@/components/LanguageDownload.vue'

export default {
  name: 'Settings',

  components: {
    AddWordsOnline,
    AddWordsOffline,
    EditorSettings,
    LanguageDownload
  },

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
    },
    vtab: {
      set (vtab) {
        this.$router.replace({
          query: { ...this.$route.query, vtab }
        })
      },
      get () {
        return this.$route.query.vtab
      }
    }
  }
}
</script>
