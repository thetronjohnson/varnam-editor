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
      <div class="lang">
        <v-select
          :items="langs"
          value="Malayalam"
          v-model="lang"
          label="Language"
          outlined
          dense
        ></v-select>
      </div>
      <router-link to="/settings" class="link"> 
        <v-btn depressed class="settings" color="#4C5DF5">
          <v-icon >mdi-cog</v-icon>
          <span class="s-text">Settings</span>
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
    name: 'Navbar',
    data () {
      return {
        langs: Object.keys(this.$LANGS)
      }
    },
    computed: {
      lang: {
        get () {
          return this.$store.state.lang
        },
        set (value) {
          this.$store.commit('setLang', value)
        }
      }
    }
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
  font-size:25px;
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
.lang{
   margin-left: 1rem;
   margin-top:1.6rem;
   padding-top:5px !important;
   padding-bottom:5px !important;
   width: 10rem;
   margin-right: 1rem;
 }

 @media only screen and (max-width: 600px) {
  .s-text{
    display: none;
  }
}
</style>