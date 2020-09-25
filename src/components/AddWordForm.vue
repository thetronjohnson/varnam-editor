<template>
  <div class="addwords">
    <v-form>
      <v-row cols="12" md="4" align="center">
        <v-col cols="4">
          <v-text-field
            :label="`Word (in ${langName})`"
            v-model="word"
            :hide-details="true"
            outlined
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field
            label="Pattern"
            v-model="pattern"
            :hide-details="true"
            outlined
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-btn large color="primary" @click="addWord">
            <v-icon>mdi-plus</v-icon>
            Add Word
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'AddWordsForm',

  data () {
    return {
      word: '',
      pattern: ''
    }
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
    }
  },

  methods: {
    addWord () {
      this.$emit('addWord', {
        word: this.word,
        pattern: this.pattern
      })
    }
  }
}
</script>
