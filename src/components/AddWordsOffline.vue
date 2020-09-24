<template>
  <div>
    <div v-if="$VARNAM_OFFLINE">
      <span class="text-h6">Add Word</span>
      <AddWordForm @addWord="addWord" />
      <v-form>
        <span class="text-h6">Remove Word</span>
        <v-row cols="12"  align="center">
          <v-col cols="8">
            <v-text-field
              :label="`Word to remove (in ${langName})`"
              v-model="wordToRemove"
              :hide-details="true"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn large color="error" @click="removeWord">
              <v-icon>mdi-minus</v-icon>
              Remove Word
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <div v-else>
      <AddWordForm @addWord="addWord" />
      <v-data-table
        :headers="headers"
        :items="words"
        :items-per-page="5"
        sort-by="votes"
        sort-desc
      >
        <template v-slot:item.action="{ item }">
          <v-btn depressed color="primary">
            <v-icon>mdi-arrow-up-box</v-icon>
            {{item.votes}}
          </v-btn>
        </template>
      </v-data-table>
    </div>
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
      wordToRemove: '',

      headers: [
        {
          text: 'Word',
          sortable: true,
          value: 'word'
        },
        {
          text: 'Pattern',
          sortable: true,
          value: 'pattern'
        },
        {
          text: '',
          sortable: false,
          value: 'action'
        }
      ],
      words: [
        { id: 1, word: 'ഫയർഫോക്സ്', pattern: 'firefox', votes: 50 },
        { id: 2, word: 'ക്രോം', pattern: '', votes: 40 },
        { id: 3, word: 'ഇംഗ്ലീഷ്', pattern: '', votes: 100 }
      ]
    }
  },

  methods: {
    addWord (e) {
      console.log(e)
    },

    removeWord () {
    }
  }
}
</script>
