<template>
<div>
  <Navbar/>
    <transition name="slide">
      <router-view/>
    </transition>
</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
export default {
  name: 'App',

  components: {
   Navbar
  },

  data: () => ({
    //
  }),
};
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
html{
  font-family: 'Raleway', sans-serif;
  font-weight: 500;
}
</style>