<template>
  <v-form>
    <v-row>
      <v-col l="6">
        <v-text-field
          type="number"
          v-model="fontSize"
          label="Font Size"
          outlined
        ></v-text-field>
      </v-col>
      <v-col l="6">
        <v-select
          :items="[
            {text: 'Left', value: 'left'},
            {text: 'Right', value: 'right'}
          ]"
          v-model="suggestionsPanelPosition"
          label="Suggestions Panel Position"
          outlined
        ></v-select>
      </v-col>
    </v-row>
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
    },

    suggestionsPanelPosition: {
      get () {
        return this.$store.state.settings.suggestionsPanelPosition
      },
      set (value) {
        this.$store.commit('updateSettings', {
          suggestionsPanelPosition: value
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
