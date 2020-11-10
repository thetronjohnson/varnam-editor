<template>
  <v-card outlined :loading="loading">
    <v-card-title class="title">
      Word Suggestions &nbsp;&nbsp;
      <v-btn small text depressed color="primary" to="/settings?tab=words">
        <v-icon small>mdi-plus</v-icon> New
      </v-btn>
    </v-card-title>
    <v-card-text class="suggestions">
      <v-skeleton-loader
        v-show="placeholder"
        :boilerplate="true"
        :tile="true"
      >
        <v-card class="word-card d-flex align-center" outlined>
          <v-btn depressed class="sug-id" color="primary">1</v-btn>
          <div class="flex-grow-1 sug-word v-skeleton-loader__bone">
            <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
          </div>
        </v-card>
      </v-skeleton-loader>
      <div v-for="(item, index) in $store.state.suggestionsDisplay" :key="item.key">
        <v-card class="word-card d-flex align-center" outlined @click="chooseSuggestion(index)">
          <v-btn depressed class="sug-id" color="primary">{{ index }}</v-btn>
          <div class="sug-word">{{ item }}</div>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'SuggestionsPanel',

  data () {
    return {
      placeholder: true,
      loading: false
    }
  },

  methods: {
    chooseSuggestion (index) {
      this.$store.commit('chooseSuggestion', index)
    }
  },

  mounted () {
    this.$store.subscribe(mutation => {
      if (mutation.type === 'requestSend') {
        this.loading = true
      } else if (mutation.type === 'displaySuggestions') {
        this.placeholder = false
        this.loading = false
      } else if (mutation.type === 'hideSuggestions') {
        this.placeholder = true
        this.loading = false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.title {
  justify-content: center;
  color: #4c5df5;
  font-weight: 600;
}
.word-card {
  text-align: left;
  width: 100%;
  margin-top: 1rem;
  border: solid 1px;
  border-color: #4c5df5;
  background:#fff;
}
.v-btn.sug-id {
  min-width: 0;
}
.sug-word {
  padding: 0 1rem 0 0.5rem;

  .v-skeleton-loader__text {
    margin-bottom: 0;
  }
}
</style>
