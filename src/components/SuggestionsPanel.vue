<template>
  <v-card outlined :loading="loading">
    <v-card-title class="title">Word Suggestions</v-card-title>
    <v-card-text class="suggestions">
      <v-skeleton-loader
        v-show="placeholder"
        type="list-item-avatar"
        :boilerplate="true"
        :tile="true"
      ></v-skeleton-loader>
      <div v-for="(item, index) in $store.state.suggestionsDisplay" :key="item.key">
        <v-row align="start" justify="center">
          <v-card class="word-card" outlined>
            <v-btn depressed class="sug-id" color="primary">{{ index }}</v-btn>
            <div class="sug-word">{{ item }}</div>
          </v-card>
        </v-row>
      </div>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn depressed color="primary" to="/settings?tab=words">Add Word</v-btn>
    </v-card-actions>
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

<style scoped>
.title {
  text-align: center;
  color: #4c5df5;
  font-weight: 600;
}
.word-card{
  text-align: left;
  min-width: 20rem;
  margin-top: 1rem;
  border: solid 1px;
  border-color: #4c5df5;
  background:#fff;
}
.v-btn.sug-id {
  padding: 1.5rem;
  min-width: 0;
}
.sug-word{
  display: inline-block;
  padding-left: 1rem;
}
</style>
