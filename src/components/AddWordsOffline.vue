<template>
  <div>
    <div v-if="$VARNAM_OFFLINE">
      <v-card rounded outlined>
        <v-card-title>Learn Word</v-card-title>
        <v-card-subtitle>Varnam will learn this word, make different patterns from it.</v-card-subtitle>
        <v-card-text>
          <v-text-field
            :label="`Word to learn (in ${langName})`"
            v-model="wordToLearn"
            :hide-details="true"
            outlined
            clearable
          >
            <template v-slot:append-outer>
              <v-btn style="top: -12px" large color="primary" @click="learnWord">
                <v-icon left>mdi-teach</v-icon>
                Learn Word
              </v-btn>
            </template>
          </v-text-field>
        </v-card-text>
      </v-card>
      <v-card rounded outlined>
        <v-card-title>Train Word</v-card-title>
        <v-card-subtitle>Ask Varnam to use a particular pattern for a word.</v-card-subtitle>
        <v-card-text>
          <AddWordForm @addWord="addWord" />
        </v-card-text>
      </v-card>
      <v-card rounded outlined>
        <v-card-title>Delete Word</v-card-title>
        <v-card-subtitle>Varnam will delete this word and all patterns associated with it.</v-card-subtitle>
        <v-card-text>
          <v-row cols="12" align="center">
            <v-col cols="9">
              <v-text-field
                :label="`Word to delete (in ${langName})`"
                v-model="wordToDelete"
                :hide-details="true"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-btn large color="error" @click="deleteWord()">
                <v-icon left>mdi-minus</v-icon>
                Delete Word
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card rounded outlined>
        <v-card-title>Import Words</v-card-title>
        <v-card-subtitle>Import many words to Varnam.</v-card-subtitle>
        <v-card-text>
          <v-tabs v-model="vtab" :vertical="true">
            <v-tab href="#file">File</v-tab>
            <v-tab href="#online">Online</v-tab>
            <v-tab-item value="file">
              <v-card flat tile>
                <v-card-text>
                  <ImportFromFile />
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item value="online">
              <v-card flat tile>
                <v-card-text>
                  <ImportFromOnline />
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
      </v-card>
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
import ImportFromFile from '@/components/ImportFromFile.vue'
import ImportFromOnline from '@/components/ImportFromOnline.vue'

export default {
  name: 'AddWordsOffline',

  components: {
    AddWordForm,
    ImportFromFile,
    ImportFromOnline
  },

  computed: {
    langName () {
      const langInfo = this.$store.state.langs.find(item => {
        return item.Identifier === this.$store.state.settings.lang
      })

      if (langInfo) {
        return langInfo.DisplayName
      } else {
        return ''
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
  },

  data: () => {
    return {
      snackbarDisplay: false,
      snackbarText: false,

      wordToLearn: '',
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

    learnWord () {
      const word = this.wordToLearn.trim()
      if (word === '') {
        this.snackbarText = 'Some inputs were empty'
        this.snackbarDisplay = true
      }

      fetch(this.$VARNAM_API_URL + '/learn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lang: this.$store.state.settings.lang,
          text: word
        })
      })
        .then(response => {
          if (response.status === 200) {
            this.snackbarText = `Succesfully learnt word "${word}"`
            this.snackbarDisplay = true
            this.wordToLearn = ''
          }
        })
    },

    addWord (wordInfo) {
      if (wordInfo.pattern.trim() === '' || wordInfo.word.trim() === '') {
        this.snackbarText = 'Some inputs were empty'
        this.snackbarDisplay = true
      }

      if (this.$VARNAM_OFFLINE) {
        fetch(this.$VARNAM_API_URL + '/train/' + this.$store.state.settings.lang, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pattern: wordInfo.pattern,
            word: wordInfo.word
          })
        })
          .then(response => {
            if (response.status === 200) {
              this.snackbarText = `Succesfully trained "${wordInfo.pattern}" => "${wordInfo.word}"`
              this.snackbarDisplay = true
              this.wordToLearn = ''
            }
          })
      } else {
        this.$VARNAM_IDB.getWordsStore().then(wordsStore => {
          const request = wordsStore.add(wordInfo)
          request.onsuccess = () => {
            this.snackbarText = 'Word was addedd successfully'
            this.snackbarDisplay = true
            this.init()
          }
          request.onerror = (e) => {
            console.log(e)
          }
        })
      }
    },

    deleteWord (id) {
      if (this.$VARNAM_OFFLINE) {
        fetch(this.$VARNAM_API_URL + '/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            lang: this.$store.state.settings.lang,
            word: this.wordToDelete
          })
        })
          .then(async response => {
            if (response.status === 200) {
              this.snackbarText = `Succesfully deleted word "${this.wordToDelete}"`
              this.snackbarDisplay = true
              this.wordToLearn = ''
            } else {
              response = await response.json()
              this.snackbarText = `Error: ${response.message}`
              this.snackbarDisplay = true
            }
          })
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
