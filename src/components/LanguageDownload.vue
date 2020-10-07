<template>
  <div>
    <v-card flat tile :loading="loading">
      <v-card-title>Languages</v-card-title>
      <v-card-actions>
        <p>
          Choose languages you want and click Download.
          You can also download these from <a target="_blank" href="https://varnamproject.com/downloads">here</a>.
        </p>
        <v-spacer />
        <v-btn depressed color="primary" :disabled="downloadBtnDisabled" @click="download" title="Download & Import" aria-label="Download & Import">
          <v-icon left>mdi-arrow-down-box</v-icon>
          Download
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items.sync="langs"
          sort-by="DisplayName"
          item-key="Identifier"
          show-select
          v-model="selectedLangs"
          :items-per-page="20"
        >
          <template v-slot:item.installed="{ item }">
            <div v-if="langsInstalled.find(k => k.Identifier === item.Identifier)">
              <v-icon :color="langsDownloadable.indexOf(item.Identifier) > -1 ? 'warning' : 'success'" title="Installed" aria-label="Installed">mdi-checkbox-blank-circle</v-icon>
              {{ langsInstalled.find(k => k.Identifier === item.Identifier).CompiledDate.split(' ')[0] }}
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-snackbar
      v-model="snackbarDisplay"
      :right="true"
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          :color="snackbarColor"
          text
          v-bind="attrs"
          @click="snackbarDisplay = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'LanguageDownload',

  computed: {
    downloadBtnDisabled () {
      return !this.selectedLangs.find(item => this.langsDownloadable.indexOf(item.Identifier) > -1)
    },

    upstreamURL () {
      return this.$store.state.upstreamURL
    },

    langsInstalled () {
      return this.$store.state.langs
    },

    // Langs that are not installed and updatable
    langsDownloadable () {
      const langs = this.langs.filter(item => {
        const installedLang = this.langsInstalled.find(item2 => item2.Identifier === item.Identifier)

        if (installedLang) {
          return item.CompiledDate > installedLang.CompiledDate
        } else {
          return true
        }
      })
      return langs.reduce((langs, langInfo) => langs.concat(langInfo.Identifier), [])
    }
  },

  data: () => {
    return {
      snackbarColor: 'secondary',
      snackbarDisplay: false,
      snackbarText: false,

      loading: false,

      headers: [
        {
          text: 'Name',
          value: 'DisplayName'
        },
        {
          text: 'Author',
          value: 'Author'
        },
        {
          text: 'Updated',
          value: 'CompiledDate'
        },
        {
          text: 'Installed',
          value: 'installed'
        }
      ],
      langs: [],
      selectedLangs: []
    }
  },

  methods: {
    init () {
      window.fetch(this.upstreamURL + '/languages')
        .then(response => response.json())
        .then(languages => {
          this.langs = languages
        })
    },

    download () {
      let langs = this.selectedLangs.filter(item => this.langsDownloadable.indexOf(item.Identifier) > -1)

      langs = langs.reduce((langs, langInfo) => langs.concat(langInfo.Identifier), [])

      let downloadFinishedCount = 0
      langs.forEach(lang => {
        this.loading = true

        // This is a dekstop only endpoint. Not in varnamd
        window.fetch(this.$VARNAM_API_URL + '/download-language', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            lang
          })
        })
          .then(response => {
            this.loading = false

            if (response.status === 200) {
              if (++downloadFinishedCount === langs.length) {
                this.snackbarColor = 'secondary'
                this.snackbarText = 'All selected languages downloaded. Restart app for changes to take effect.'
                this.snackbarDisplay = true
              } else {
                this.snackbarColor = 'secondary'
                this.snackbarText = `Language '${lang}' downloaded`
                this.snackbarDisplay = true
              }
            } else {
              response.json().then(json => {
                this.snackbarColor = 'error'
                this.snackbarText = json.message
                this.snackbarDisplay = true
              })
            }
          })
      })
    }
  },

  created () {
    this.init()
    this.$store.subscribe(mutation => {
      if (mutation.type === 'setUpstream') {
        this.init()
      }
    })
  }
}
</script>
