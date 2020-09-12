<template>
  <div class="home">
   <Navbar/>
   <v-container class="main">
     <v-row no-gutters>
       <v-col :cols="9">
        <Editor/>
       </v-col>
       <v-col :cols="3">
        <Panel/>
       </v-col>
     </v-row>
   </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import Editor from '@/components/Editor.vue'
import Panel from '@/components/Panel.vue'
export default {
  name: 'Home',
  components: {
    Navbar,
    Editor,
    Panel
  }
}
</script>
<style scoped>
.main{
    padding-top:2vh;
    margin-left: 5vw;
    margin-right: 5vw;
}
</style>