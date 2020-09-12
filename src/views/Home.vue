<template>
  <div class="home">
    <Navbar/>
    <Panel/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import Panel from '@/components/Panel.vue'
export default {
  name: 'Home',
  components: {
    Navbar,
    Panel
  }
}
</script>
