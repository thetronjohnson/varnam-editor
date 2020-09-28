<template>
  <div>
    <v-data-table
      :headers="headers"
      :items.sync="packs"
      item-key="identifier"
      show-expand
      show-select
      v-model="packsSelected"
      :item-selected="onPacksSelect"
      class="packsTable"
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td></td>
        <td :colspan="headers.length">
          <v-data-table
            :headers="versionHeaders"
            :items.sync="item.versions"
            :hide-default-header="true"
            :hide-default-footer="true"
            show-select
          >
            <template v-slot:item.size="{ item }">
              {{ item.size }} MB
            </template>
          </v-data-table>
        </td>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn depressed color="primary" @click="download(item.identifier)" title="Download & Import" aria-label="Download & Import">
          <v-icon>mdi-arrow-down-box</v-icon>
          Download
        </v-btn>
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
        },
        {
          text: '',
          sortable: false,
          value: 'action',
          width: 10
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
              version: '1',
              description: 'Most common words found across many sources',
              size: 10
            },
            {
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
              version: '1',
              description: 'Basic words like "try", "last", "first" and many more sourced from social media.',
              size: 10
            }
          ]
        }
      ],

      packsSelected: []
    }
  },

  methods: {
    onPacksSelect () {
    }
  }
}
</script>

<style>
.v-data-table.packsTable .v-data-table__expanded__content {
  box-shadow: none;
}
</style>
