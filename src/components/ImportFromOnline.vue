<template>
  <div>
    <v-data-table
      :headers="headers"
      :items.sync="packs"
      item-key="identifier"
      show-expand
      show-select
      v-model="packsSelected"
      @item-selected="onPackSelect"
      @toggle-select-all="onPackSelectAll"
      class="packsTable"
    >
      <template v-slot:top>
        <v-row align="center" justify="end">
          <v-col l="10">
            Choose the language packs you need and click download
          </v-col>
          <v-col cols="2">
            <v-btn depressed color="primary" :disabled="downloadBtnDisabled" @click="download" title="Download & Import" aria-label="Download & Import">
              <v-icon left>mdi-arrow-down-box</v-icon>
              Download
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td></td>
        <td :colspan="headers.length">
          <v-data-table
            :headers="versionHeaders"
            :items.sync="item.versions"
            :hide-default-header="true"
            :hide-default-footer="true"
            item-key="identifier"
            show-select
            v-model="packsVersionsSelected"
            @item-selected="onPackVersionSelect"
          >
            <template v-slot:item.size="{ item }">
              {{ item.size }} MB
            </template>
          </v-data-table>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'ImportFromFile',

  data () {
    return {
      headers: [
        {
          text: 'Name',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Description',
          sortable: false,
          value: 'description'
        }
      ],
      versionHeaders: [
        {
          text: 'Version',
          sortable: false,
          value: 'version'
        },
        {
          text: 'Description',
          sortable: false,
          value: 'description'
        },
        {
          text: 'Size',
          sortable: false,
          value: 'size'
        }
      ],

      packsFromUpstream: [],

      packsSelected: [],
      packsVersionsSelected: []
    }
  },

  computed: {
    downloadBtnDisabled () {
      return this.packsVersionsSelected.length === 0
    },

    upstreamURL () {
      return this.$store.state.upstreamURL
    },

    packs () {
      return this.packsFromUpstream.map((item, index) => {
        item.versions = item.versions.map(versionItem => {
          versionItem.packID = item.identifier
          console.log(versionItem)
          return versionItem
        })
        return item
      })
    }
  },

  methods: {
    init () {
      window.fetch(this.upstreamURL + '/packs/' + this.$store.state.settings.lang)
        .then(response => response.json())
        .then(packs => {
          this.packsFromUpstream = packs
        })
    },

    onPackSelect (e) {
      if (e.value) {
        // checked
        this.packsVersionsSelected = this.packsVersionsSelected.concat(e.item.versions)
      } else {
        const ids = []
        e.item.versions.forEach(item => ids.push(item.id))

        this.packsVersionsSelected = this.packsVersionsSelected.filter(item => ids.indexOf(item.id) === -1)
      }
    },

    onPackVersionSelect (e) {
      const pack = this.packs.find(item => item.identifier === e.item.packID)
      const packsVersionsSelected = this.packsVersionsSelected.filter(item => item.packID === e.item.packID)

      // +1 is for the current item selected
      if (pack.versions.length === packsVersionsSelected.length + (e.value ? 1 : -1)) {
        this.packsSelected.push(pack)
      } else {
        this.packsSelected = this.packsSelected.filter(item => item.identifier !== e.item.packID)
      }
    },

    onPackSelectAll (e) {
      if (e.value) {
        // Select all
        const allPacksVersions = this.packs.reduce((combined, item) => combined.concat(item.versions), [])
        this.packsVersionsSelected = allPacksVersions
      } else {
        // Unselect all
        this.packsVersionsSelected = []
      }
    },

    download () {
      this.packsVersionsSelected.forEach(packVersion => {
        console.log(packVersion)
        // This is a dekstop only endpoint. Not in varnamd
        window.fetch(this.$VARNAM_API_URL + '/packs/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            lang: this.$store.state.settings.lang,
            pack: packVersion.packID,
            version: packVersion.identifier
          })
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

<style>
.v-data-table.packsTable .v-data-table__expanded__content {
  box-shadow: none;
}
</style>
