<template>
  <div>
    <v-form>
      <p>Choose a file to import (learn) words from. Can be <b>any text file</b> that has {{ langName }} words or <b>.VPF</b> [Varnam Pack Files] files downloaded from <a href="https://varnamproject.com/packs" target="_blank">here.</a></p>
      <v-file-input multiple v-model="files" label="File input"></v-file-input>
      <v-btn color="primary" @click="upload" :disabled="this.files.length === 0">Upload & Import</v-btn>
    </v-form><br/>
    <v-card flat v-show="log.length > 0" :loading="loading">
      <v-card-subtitle>Import Status</v-card-subtitle>
      <v-card-text>
        <ul>
          <li v-for="(l, index) in log" :key="index">{{ l }}</li>
        </ul>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ImportFromFile',

  data () {
    return {
      files: [],
      log: [],
      loading: false
    }
  },

  computed: {
    langName () {
      const langInfo = this.$store.state.langs.find(item => {
        return item.Identifier === this.$store.state.settings.lang
      })

      if (langInfo) {
        return langInfo.DisplayName
      } else {
        return ''
      }
    }
  },

  methods: {
    upload () {
      const formData = new FormData()

      this.files.forEach(file => formData.append('files', file))

      this.log = []
      this.loading = true

      fetch(this.$VARNAM_API_URL + '/learn/upload/' + this.$store.state.settings.lang, {
        method: 'POST',
        body: formData
      })
        .then(async response => {
          if (response.status === 200) {
            const reader = response.body.getReader()

            // "done" is a Boolean and value a "Uint8Array"
            const processResponse = ({ done, value }) => {
              const items = new TextDecoder('utf-8')
                .decode(value)
                .split('\n')
                .filter(item => item.length !== 0)

              items.forEach(item => this.log.push(item))

              if (done) {
                this.loading = false
                this.$toast('Successfully learnt words in file', {
                  color: 'success'
                })
              } else {
                // Read some more, and call this function again
                return reader.read().then(processResponse)
              }
            }

            // read() returns a promise that resolves
            // when a value has been received
            reader.read().then(processResponse)
          } else {
            const json = await response.json()
            this.$toast(json.message, {
              color: 'error'
            })
          }
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }
  }
}
</script>
