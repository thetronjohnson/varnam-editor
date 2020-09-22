<template>
    <div class="textarea">
        <v-textarea
          outlined
          name="translate"
          label="Type your content"
          rows="20"
          color="#4C5DF5"
          v-model="inputText"
          ref="editor"
        ></v-textarea>
    </div>
</template>

<script>
const minChunkSize = 1
const cycleOnTab = true
const KEY = {
  UNKNOWN: 0,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DEL: 46,
  TAB: 9,
  RETURN: 13,
  ESC: 27,
  COMMA: 188,
  PAGEUP: 33,
  PAGEDOWN: 34,
  BACKSPACE: 8,
  SPACE: 32
}

let fetchController = null

export default {
  name: 'Editor',

  data () {
    return {
      cachedSuggestions: [],
      inputText: ''
    }
  },

  computed: {
    lang: function () {
      return this.$store.state.lang
    },
    suggestions: function () {
      return this.$store.state.suggestions
    }
  },

  methods: {
    init () {
      const input = this.$refs.editor.$el.getElementsByTagName('textarea')[0]

      input.addEventListener('keyup', (e) => {
        var hasSpecialKeys = e.altKey || e.metaKey || e.ctrlKey
        var hasSpecialKeysOrShift = hasSpecialKeys || e.shiftKey
        switch (e.keyCode) {
          case KEY.UNKNOWN: // Special key released
          case KEY.SHIFT:
          case KEY.CTRL:
          case KEY.ALT:
          case KEY.RETURN: // we don't want to suggest when RETURN key has pressed (another IE workaround)
            break
          case KEY.TAB:
            if (!hasSpecialKeysOrShift && cycleOnTab) {
              break
            }
            // falls through
          case KEY.ESC:
          case KEY.UP:
          case KEY.DOWN:
          case KEY.LEFT:
          case KEY.RIGHT:
            break
          default:
            // numkeys & numpad
            if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
              break
            }
            if (!hasSpecialKeys) {
              var chunk = this.getCurrentWord(input)
              if (chunk.length >= minChunkSize) {
                if (!this.showCachedSuggestions(this.getCurrentWord(input))) {
                  this.transliterate(this.getCurrentWord(input))
                }
              }
            }
            break
        }
      })

      input.addEventListener('keydown', (e) => {
        var hasSpecialKeysOrShift = e.altKey || e.metaKey || e.ctrlKey || e.shiftKey

        if (hasSpecialKeysOrShift) { return }

        // numeric keys
        if (e.keyCode >= 48 && e.keyCode <= 57) {
          var i = e.keyCode - 48

          e.preventDefault()

          if (typeof this.suggestions[i] !== 'undefined') {
            this.replaceWord(input, this.getCurrentWordPos(input), this.suggestions[i])
          }
        }

        if (e.keyCode === KEY.SPACE) {
          // if suggestions has not yet received, wait
          if (typeof this.suggestions[1] === 'undefined') {
            this.onTransliterationResult()
          } else {
            this.replaceWord(input, this.getCurrentWordPos(input), this.suggestions[1])
          }
        }

        localStorage['varnam-input'] = input.value
      })
    },

    getChunk (input, pos) {
      var text = input.value
      var start = pos[0]
      var end = pos[1]
      return text.substr(start, end - start)
    },

    getCurrentWord (input) {
      return this.getChunk(input, this.getCurrentWordPos(input))
    },

    replaceWord (input, position, word) {
      var text = this.inputText
      var start = position[0]
      var end = position[1]

      this.inputText = text.substring(0, start) + word + text.substring(end, text.length)

      this.setCursorPosition(input, start + word.length)

      this.$store.commit('clearSuggestions')
    },

    setCursorPosition (input, pos) {
      if (input.setSelectionRange) {
        input.setSelectionRange(pos, pos)
      } else if (input.createTextRange) {
        var range = input.createTextRange()
        range.collapse(true)
        range.moveEnd('character', pos)
        range.moveStart('character', pos)
        range.select()
      }
    },

    showCachedSuggestions (word) {
      if (typeof this.cachedSuggestions[word] !== 'undefined') {
        this.$store.commit('setSuggestions', this.cachedSuggestions[word])
        return true
      }
      return false
    },

    getCurrentWordPos (input) {
      const stopCharacters = [' ', '\n', '\r', '\t']

      var text = this.inputText
      var end = input.selectionEnd
      var textBeforeCursor = text.substr(0, end)
      var indexOfDelimiter = -1
      var i
      var d
      var idx
      for (i = 0; i < stopCharacters.length; i++) {
        d = stopCharacters[i]
        idx = textBeforeCursor.lastIndexOf(d)
        if (idx > indexOfDelimiter) {
          indexOfDelimiter = idx
        }
      }
      while (end < text.length) {
        if (stopCharacters.indexOf(text[end]) === -1) {
          ++end
        } else {
          break
        }
      }
      if (indexOfDelimiter < 0) {
        return [0, end]
      } else {
        return [indexOfDelimiter + 1, end]
      }
    },

    transliterate (word) {
      if (fetchController) {
        fetchController.abort()
      }
      fetchController = new AbortController()
      fetch(
        this.$VARNAM_API_URL + `/tl/${this.lang}/${word}`,
        {
          signal: fetchController.signal
        }
      )
        .then(response => response.json())
        .then(data => this.$store.commit('setSuggestions', data))
    }
  },
  mounted () {
    this.init()
  }
}
</script>
