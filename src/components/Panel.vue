<template>
  <div class="panel">
    <v-container>
      <div class="suggestions">
        <p class="title">Word Suggestions</p>
        <template v-for="n in 4">
          <v-row :key="n" align="start" justify="center">
            <v-card class="card" outlined>
                <v-btn depressed class="sug-id" color="#4C5DF5">{{n-1}}</v-btn>
                <span class="sug-word">Word</span>
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
  name: "Panel"
};
</script>

<style scoped>
.panel {
  padding-left: 5vw;
  padding-right: 5vw;
  padding-top: 2vh;
}
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
    margin-top:3rem;
    height: 3rem;
    width: 20rem;
    margin-left: 1rem;
    margin-right: 1rem;
    text-transform: capitalize;
    color: #fff;
    font-weight: 700;
}
</style>