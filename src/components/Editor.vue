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
const minWordSize = 1
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

let input

const transliterateTimeout = []
const fetchController = []
const wordsToReplace = []

// Thanks vsync
// https://stackoverflow.com/a/13335359/1372424
function hasEnglishChar (s) {
  let i, charCode
  for (i = s.length; i--;) {
    charCode = s.charCodeAt(i)
    // Character code from A to z
    if (charCode >= 65 && charCode <= 122) {
      return true
    }
  }
  return false
}

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
      input = this.$refs.editor.$el.getElementsByTagName('textarea')[0]

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
            break
          default:
            // numkeys & numpad
            if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
              break
            }

            if (!hasSpecialKeys) {
              const wordPosition = this.getCurrentWordPosition()
              const wordID = wordPosition[2]
              const word = this.getChunk(wordPosition)

              if (!hasEnglishChar(word)) return

              console.log(word, wordID)

              if (word.length >= minWordSize) {
                // if (!this.showCachedSuggestions(wordID, word)) {
                if (fetchController[wordID]) {
                  fetchController[wordID].abort()
                }

                clearTimeout(transliterateTimeout[wordID])

                transliterateTimeout[wordID] = setTimeout(() => {
                  this.transliterate(word, wordID)
                  delete transliterateTimeout[wordID]
                }, 500)
                // }
              }
              this.$store.commit('setCurrentWord', wordID)
            }
            break
        }
      })

      input.addEventListener('keydown', (e) => {
        var hasSpecialKeysOrShift = e.altKey || e.metaKey || e.ctrlKey || e.shiftKey

        if (hasSpecialKeysOrShift) { return }

        const keysToSkip = [KEY.BACKSPACE, KEY.DEL, KEY.LEFT, KEY.RIGHT, KEY.UP, KEY.DOWN, KEY.SHIFT, KEY.CTRL]

        if (keysToSkip.indexOf(e.keyCode) !== -1) { return }

        if (e.keyCode >= 65 && e.keyCode <= 90) { return }

        const wordPosition = this.getCurrentWordPosition()
        const wordID = wordPosition[2]
        const word = this.getChunk(wordPosition)

        // numeric keys
        if (e.keyCode >= 48 && e.keyCode <= 57) {
          var i = e.keyCode - 48

          if (this.suggestions[wordID]) {
            e.preventDefault()

            const suggestedWord = this.suggestions[wordID][i]

            if (typeof suggestedWord !== 'undefined') {
              // add a space at the end too
              this.replaceWord(wordPosition, suggestedWord)
            }
          }
        } else if (hasEnglishChar(word)) {
          // Not a character key
          if (this.suggestions[wordID]) {
            this.replaceWord(wordPosition, this.suggestions[wordID][1])
          } else {
            this.replaceWordOnSuggestion(wordPosition)
          }
        }

        localStorage['varnam-input'] = input.value
      })
    },

    getChunk (pos) {
      const text = input.value
      const start = pos[0]
      const end = pos[1]
      return text.substr(start, end - start)
    },

    replaceWordOnSuggestion (position) {
      const wordID = position[2]
      wordsToReplace[wordID] = position
    },

    replaceWord (position, word) {
      const wordID = position[2]
      const text = this.inputText
      const start = position[0]
      const end = position[1]

      const cursorPos = input.selectionEnd
      this.inputText = text.substring(0, start) + word + text.substr(end, text.length)

      const change = word.length - (end - start)

      this.$nextTick(() => {
        this.setCursorPosition(cursorPos + change)
      })

      this.$store.commit('clearSuggestions', wordID)
    },

    setCursorPosition (pos) {
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

    showCachedSuggestions (word, wordID) {
      if (typeof this.cachedSuggestions[word] !== 'undefined') {
        this.onSuggestionsReceive(word, wordID, this.cachedSuggestions[word])
        return true
      }
      return false
    },

    getCurrentWordPosition () {
      const stopCharacters = [' ', '\n', '\r', '\t', ',', '.']

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

      // Find the ordinal number of the word in the sentence
      // എത്രാമത്തെ വാക്കാണ് ഇതെന്ന് കണ്ടുപിടിക്കുക
      let nThWord = 0
      const delimeterSplitted = textBeforeCursor.match(/\S+/gi)
      if (delimeterSplitted) {
        nThWord = delimeterSplitted.length - 1
      }

      if (indexOfDelimiter < 0) {
        return [0, end, nThWord]
      } else {
        return [indexOfDelimiter + 1, end, nThWord]
      }
    },

    transliterate (word, wordID) {
      fetchController[wordID] = new AbortController()

      fetch(
        this.$VARNAM_API_URL + `/tl/${this.lang}/${word}`,
        {
          signal: fetchController[wordID].signal
        }
      )
        .then(response => response.json())
        .then(data => {
          this.onSuggestionsReceive(word, wordID, data.result)

          delete fetchController[wordID]
        })
    },

    onSuggestionsReceive (word, wordID, suggestions) {
      this.$store.commit('setSuggestions', {
        id: wordID,
        word: word,
        suggestions
      })

      if (wordsToReplace[wordID]) {
        const wordPosition = wordsToReplace[wordID]
        this.replaceWord(wordPosition, suggestions[0])
        delete wordsToReplace[wordID]
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
