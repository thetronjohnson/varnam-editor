<template>
  <div class="settings">
    <AddWords/>
    <Navbar/>
  </div>
</template>
<script>
import AddWords from '@/components/AddWords.vue'
export default {
  name:'Settings',
  components:{
    AddWords
  }
}
</script>