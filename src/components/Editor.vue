<template>
  <div class="textarea">
    <v-textarea
      outlined
      name="translate"
      label="Type your content"
      rows="20"
      v-model="inputText"
      ref="editor"
      :autofocus="true"
      :style="`font-size: ${$store.state.settings.fontSize}px`"
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
      inputText: '',

      alternateWords: []
    }
  },

  computed: {
    lang: function () {
      return this.$store.state.settings.lang
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

              if (!hasEnglishChar(word)) {
                // Show alternate suggestions for that word
                if (this.alternateWords[word]) {
                  this.$store.commit('displaySuggestions', this.alternateWords[word])
                }

                return
              }

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

        // character keys A-Z
        if (e.keyCode >= 65 && e.keyCode <= 90) { return }

        const wordPosition = this.getCurrentWordPosition()
        const wordID = wordPosition[2]
        const word = this.getChunk(wordPosition)

        // numeric keys
        if (e.keyCode >= 48 && e.keyCode <= 57) {
          let suggestions = []
          const suggestionIndex = e.keyCode - 48

          if (this.suggestions[wordID]) {
            suggestions = this.suggestions[wordID]
          } else if (this.alternateWords[word]) {
            suggestions = this.alternateWords[word]
          }

          if (suggestions[suggestionIndex]) {
            e.preventDefault()
            this.replaceWord(wordPosition, suggestions, suggestionIndex)
          }
        } else if (hasEnglishChar(word)) {
          if (this.suggestions[wordID] && this.suggestions[wordID][0] === word) {
            this.replaceWord(wordPosition, this.suggestions[wordID], 1)
          } else {
            this.replaceWordOnSuggestion(wordPosition)
          }
        }

        localStorage['varnam-input'] = input.value
      })

      input.addEventListener('click', () => {
        const wordPosition = this.getCurrentWordPosition()
        const word = this.getChunk(wordPosition)

        // Show alternate suggestions for that word
        if (this.alternateWords[word]) {
          this.$store.commit('displaySuggestions', this.alternateWords[word])
        }
      })

      if (!this.$VARNAM_OFFLINE) {
        this.$VARNAM_IDB.fetchWords()

        this.$store.subscribe(mutation => {
          if (mutation.type === 'updateSettings') {
            this.$VARNAM_IDB.fetchWords()
          }
        })
      }
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

    replaceWord (position, suggestions, suggestionIndex) {
      const start = position[0]
      const end = position[1]
      const wordID = position[2]

      const replaceWord = suggestions[suggestionIndex]
      const text = this.inputText

      const cursorPos = input.selectionEnd
      this.inputText = text.substring(0, start) + replaceWord + text.substr(end, text.length)

      const change = replaceWord.length - (end - start)

      this.$nextTick(() => {
        this.setCursorPosition(cursorPos + change)
      })

      this.alternateWords[replaceWord] = suggestions
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
      if (!this.$VARNAM_OFFLINE && this.$store.state.idbWords[word]) {
        // First, check IndexedDB
        this.onSuggestionsReceive(word, wordID, [this.$store.state.idbWords[word]])
      } else {
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
      }
    },

    onSuggestionsReceive (word, wordID, suggestions) {
      this.$store.commit('setSuggestions', {
        id: wordID,
        word: word,
        suggestions
      })

      const suggestionsWithEnglishFirst = [
        ...[word],
        ...suggestions
      ]

      this.$store.commit('displaySuggestions', suggestionsWithEnglishFirst)

      if (wordsToReplace[wordID]) {
        const wordPosition = wordsToReplace[wordID]
        if (this.getChunk(wordPosition) === word) {
          this.replaceWord(wordPosition, suggestionsWithEnglishFirst, 1)
        }
        delete wordsToReplace[wordID]
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
