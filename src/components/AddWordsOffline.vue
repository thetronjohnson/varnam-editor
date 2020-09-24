<template>
  <div>
    <div v-if="$VARNAM_OFFLINE">
      <span class="text-h6">Add Word</span>
      <AddWordForm @addWord="addWord" />
      <v-form>
        <span class="text-h6">Delete Word</span>
        <v-row cols="12"  align="center">
          <v-col cols="8">
            <v-text-field
              :label="`Word to delete (in ${langName})`"
              v-model="wordToDelete"
              :hide-details="true"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn large color="error" @click="deleteWord">
              <v-icon>mdi-minus</v-icon>
              Delete Word
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <div v-else>
      <AddWordForm @addWord="addWord" />
      <v-data-table
        :headers="headers"
        :items.sync="words"
        :items-per-page="5"
        sort-by="votes"
        sort-desc
      >
        <template v-slot:item.action="{ item }">
          <v-btn small color="error" @click="deleteWord(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </div>
    <v-snackbar
      v-model="snackbarDisplay"
      :right="true"
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="secondary"
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
import AddWordForm from '@/components/AddWordForm.vue'

export default {
  name: 'AddWordsOffline',

  components: {
    AddWordForm
  },

  computed: {
    langName () {
      const langInfo = this.$store.state.langs.find(item => {
        return item.LangCode === this.$store.state.settings.lang
      })

      if (langInfo) {
        return langInfo.DisplayName
      } else {
        return ''
      }
    }
  },

  data: () => {
    return {
      snackbarDisplay: false,
      snackbarText: false,

      wordToDelete: '',

      headers: [
        {
          text: '',
          sortable: false,
          value: 'action',
          width: 10
        },
        {
          text: 'Word',
          sortable: true,
          value: 'word'
        },
        {
          text: 'Pattern',
          sortable: true,
          value: 'pattern'
        }
      ],

      words: []
    }
  },

  methods: {
    init () {
      if (!this.$VARNAM_OFFLINE) {
        this.$VARNAM_IDB.getWordsStore().then(wordsStore => {
          wordsStore.getAll().onsuccess = e => {
            this.words = e.target.result
          }
        })
      }
    },

    addWord (wordInfo) {
      if (wordInfo.pattern.trim() === '' || wordInfo.word.trim() === '') {
        this.snackbarText = 'Some inputs were empty'
        this.snackbarDisplay = true
      }

      if (this.$VARNAM_OFFLINE) {
        // TODO send request
      } else {
        this.$VARNAM_IDB.getWordsStore().then(wordsStore => {
          const request = wordsStore.add(wordInfo)
          request.onsuccess = () => {
            this.snackbarText = 'Word was addedd successfully'
            this.snackbarDisplay = true
          }
          request.onerror = (e) => {
            console.log(e)
          }
        })
      }
    },

    deleteWord (id) {
      if (this.$VARNAM_OFFLINE) {
        // varnamd request
      } else {
        this.$VARNAM_IDB.getWordsStore().then(wordsStore => {
          wordsStore.delete(id)
          this.init()
        })
      }
    }
  },

  mounted () {
    this.init()
  }
}
</script>
