<template>
  <v-card flat tile>
    <v-card-title>Languages</v-card-title>
    <v-card-actions>
      <p>Choose languages you want and click Download</p>
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
</template>

<script>
export default {
  name: 'LanguageDownload',

  computed: {
    downloadBtnDisabled () {
      return !this.selectedLangs.find(item => this.langsDownloadable.indexOf(item.Identifier) > -1)
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
      window.fetch(window.$VARNAM_UPSTREAM_URL + '/languages')
        .then(response => response.json())
        .then(languages => {
          this.langs = languages
        })
    },

    download () {

    }
  },

  mounted () {
    this.init()
  }
}
</script>
