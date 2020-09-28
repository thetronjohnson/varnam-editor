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
        <v-row align="center" justify="right">
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
            item-key="id"
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
      packs: [
        {
          identifier: 'ml-basic',
          name: 'Malayalam Basic',
          description: 'Collection of basic Malayalam words',
          lang: 'ml',
          versions: [
            {
              identifier: 'ml-basic-1',
              version: '1',
              description: 'Most common words found across many sources',
              size: 10
            },
            {
              identifier: 'ml-basic-2',
              version: '2',
              description: 'Some new-gen words from 2020',
              size: 1
            }
          ]
        },
        {
          identifier: 'ml-twitter',
          name: 'Malayalam Twitter',
          description: 'Collection of words sourced from Twitter',
          lang: 'ml',
          versions: [
            {
              identifier: 'ml-twitter-1',
              version: '1',
              description: 'Most common words found across many sources',
              size: 10
            }
          ]
        },
        {
          identifier: 'ml-english',
          name: 'English Words in Malayalam',
          description: 'Collection of english words written in Malayalam. Eg: KSEB, Facebook',
          lang: 'ml',
          versions: [
            {
              identifier: 'ml-english-1',
              version: '1',
              description: 'Basic words like "try", "last", "first" and many more sourced from social media.',
              size: 10
            }
          ]
        }
      ],

      packsSelected: [],
      packsVersionsSelected: []
    }
  },

  computed: {
    downloadBtnDisabled () {
      return this.packsVersionsSelected.length === 0
    }
  },

  methods: {
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
    }
  }
}
</script>

<style>
.v-data-table.packsTable .v-data-table__expanded__content {
  box-shadow: none;
}
</style>
