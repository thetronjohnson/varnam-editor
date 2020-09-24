<template>
  <v-form>
    <v-text-field
      type="number"
      v-model="fontSize"
      label="Font Size"
    ></v-text-field>
  </v-form>
</template>

<script>
export default {
  name: 'EditorSettings',

  data () {
    return {
    }
  },

  computed: {
    fontSize: {
      get () {
        return this.$store.state.settings.fontSize
      },
      set (value) {
        this.$store.commit('updateSettings', {
          fontSize: value
        })
      }
    }
  },

  methods: {
    init () {

    }
  },
  mounted () {
    this.init()
  }
}
</script>
