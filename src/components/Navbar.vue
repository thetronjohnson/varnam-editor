<template>
  <div>
    <v-app-bar class="appbar"
      color="#fff"
      blue
      flat
      v-if="$route.name == 'Home'"
    >
    <router-link to="/" class="link"> 
     <v-toolbar-title class="title">Varnam Editor</v-toolbar-title>
    </router-link>
      <v-spacer></v-spacer>
      <router-link to="/setings" class="link"> 
      <v-btn depressed class="settings" color="#4C5DF5">
        <v-icon >mdi-cog</v-icon>
        Settings 
      </v-btn>
      </router-link>
    </v-app-bar>
    <v-app-bar class="appbar"
      color="#fff"
      blue
      flat
      v-else
    >
    <router-link to="/" class="link">
     <v-toolbar-title class="title">Varnam Editor</v-toolbar-title>
    </router-link>
      <v-spacer></v-spacer>
      <router-link to="/" class="link"> 
      <v-btn depressed class="settings" color="#4C5DF5">
        <v-icon >mdi-arrow-left</v-icon>
        Back
      </v-btn>
      </router-link>
    </v-app-bar>
    <hr/>
  </div>
</template>

<script>

  export default {
    name:'Navbar',
  }
</script>

<style scoped>
.appbar{
  padding-left: 5vw;
  padding-right: 5vw;
  padding-top: 1vh;
}
.v-btn .v-btn__content .v-icon {
  color: #fff;
  padding-right: 5px;
}
.title{
  color: #4C5DF5;
  font-weight:600;
  font-size:28px;
}
hr{
  margin-top:5px;
  border: 1.5px solid;
  margin-left: 6vw;
  margin-right: 6vw;
  color: rgb(185, 187, 202,25%);
}
.settings{
  color: #fff !important;
  padding-top:5px !important;
  padding-bottom:5px !important;
  text-transform: capitalize;
  font-weight: 700 !important;
}
 a{
     text-decoration: none !important;
 }

</style>