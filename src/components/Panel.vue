<template>
  <div class="panel">
    <v-container>
      <div class="suggestions">
        <p class="title">Word Suggestions</p>
        <template v-for="(item, index) in $store.state.suggestions">
          <v-row :key="item.key" align="start" justify="center">
            <v-card class="card" outlined>
                <v-btn depressed class="sug-id" color="#4C5DF5">{{index}}</v-btn>
                <span class="sug-word">{{item}}</span>
            </v-card>
          </v-row>
        </template>
         <div class="add-word">
          <v-btn depressed class="sug-add" color="#4C5DF5">Add Word</v-btn>
      </div>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Panel'
}
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 20px;
  color: #4c5df5;
  font-weight: 600;
}
.card{
    text-align: left;
    margin-left: 2rem;
    margin-right: 2rem;
    height: 3rem;
    width:20rem;
    margin-top:1rem;
    border: solid 1px;
    border-color: #4c5df5;
    background:#fff;
}
.suggestions {
    position: absolute;
    align-items: center;
    justify-content: center;
    background:#F8F8F8;
    padding-bottom: 1rem;
    padding-top: 1rem;
}
.sug-id{
  color: #fff;
  font-weight: 700;
  height: 3rem !important;
  min-width: 3rem !important;
}
.sug-word{
    padding-left: 1rem;
}
.sug-add{
    margin-top:3vh;
    height: 3vh;
    width: 20vw;
    margin-left: 1vw;
    margin-right: 1vw;
    text-transform: capitalize;
    color: #fff;
    font-weight: 700;
}
</style>
