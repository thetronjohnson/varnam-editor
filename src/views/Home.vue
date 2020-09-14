<template>
  <div class="home">
   <v-container class="main">
     <v-row no-gutters >
       <v-col class="editor" cols="6" sm="9">
        <Editor/>
       </v-col>
       <v-col class="panel" cols="6" sm="3">
        <Panel/>
       </v-col>
     </v-row>
   </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Editor from '@/components/Editor.vue'
import Panel from '@/components/Panel.vue'
export default {
  name: 'Home',
  components: {
    Editor,
    Panel
  }
}
</script>
<style scoped>
.main{
    padding-top:5vh;
    margin-left: 5vw;
    margin-right: 5vw;
}
</style>