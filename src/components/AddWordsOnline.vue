<template>
  <div>
    <AddWordForm @addWord="addWord" />
    <v-data-table
      :headers="headers"
      :items="words"
      :items-per-page="5"
      sort-by="votes"
      sort-desc
      class="text-h4"
    >
      <template v-slot:item.action="{ item }">
        <v-btn depressed color="primary">
          <v-icon>mdi-arrow-up-box</v-icon>
          {{item.votes}}
        </v-btn>
      </template>
    </v-data-table>
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
    }
  }
}
</script>
