<template>
  <div class="home">
   <Navbar/>
   <Editor/>
    <!---<Panel/>--->
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import Editor from '@/components/Editor.vue'
//import Panel from '@/components/Panel.vue'
export default {
  name: 'Home',
  components: {
    Navbar,
    Editor
   // Panel
  }
}
</script>
