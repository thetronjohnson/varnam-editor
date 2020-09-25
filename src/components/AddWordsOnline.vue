<template>
  <div>
    <AddWordForm @addWord="addWord" />
    <v-data-table
      :headers="headers"
      :items.sync="words"
      :items-per-page="5"
      sort-by="votes"
      sort-desc
      class="text-h4"
    >
      <template v-slot:item.action="{ item }">
        <v-btn depressed :color="item.voted ? 'primary' : 'secondary'" @click="vote(item.id)">
          <v-icon v-if="item.voted">mdi-arrow-down-box</v-icon>
          <v-icon v-else>mdi-arrow-up-box</v-icon>
          {{ item.votes }}
        </v-btn>
      </template>
    </v-data-table>
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
  name: 'AddWordsOnline',

  components: {
    AddWordForm
  },

  data: () => {
    return {
      snackbarDisplay: false,
      snackbarText: false,

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
      fetch(this.$VARNAM_REVIEW_URL + '/suggestions')
        .then(response => response.json())
        .then(data => {
          this.words = data
        })
    },

    addWord (wordInfo) {
      wordInfo.lang = this.$store.state.settings.lang

      fetch(this.$VARNAM_REVIEW_URL + '/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(wordInfo)
      })
        .then(_ => {
          this.snackbarText = 'Word was addedd successfully'
          this.snackbarDisplay = true
          this.init()
        })
    },

    vote (sid) {
      const suggestionItem = this.words.find(item => item.id === sid)

      fetch(this.$VARNAM_REVIEW_URL + '/suggestions/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sid
        })
      })
        .then(response => response.json())
        .then(response => {
          if (response.message === 'voted') {
            suggestionItem.voted = false
            suggestionItem.votes--
          } else if (response.message === 'success') {
            suggestionItem.voted = true
            suggestionItem.votes++
          }
        })
    }
  },

  mounted () {
    this.init()
  }
}
</script>
