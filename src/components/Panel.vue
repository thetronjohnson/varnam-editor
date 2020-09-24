<template>
  <div>
    <div class="suggestions">
      <p class="title">Word Suggestions</p>
      <template v-for="(item, index) in $store.state.suggestionsDisplay">
        <v-row :key="item.key" align="start" justify="center">
          <v-card class="word-card" outlined>
            <v-btn depressed class="sug-id" color="primary">{{ index }}</v-btn>
            <div class="sug-word">{{ item }}</div>
          </v-card>
        </v-row>
      </template><br/>
      <center class="add-word">
        <v-btn class="sug-add" color="primary" to="/settings?tab=words">Add Word</v-btn>
      </center>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuggestionsPanel'
}
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 20px;
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
