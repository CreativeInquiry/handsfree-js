/**
 * Adds a simple keyboard
 * - Use `handsfree.dispatch('SimpleKeyboard:injectKeyboard')` to re-render keyboard
 * - Keyboards are injected into `.handsfree-simple-keyboard`
 * - They are then given `.handsfree-simple-keyboard-rendered` to signal to CSS that it has a keyboard
 * - Adds `body.handsfree-simple-keyboard-is-visible` `on('SimpleKeyboard:show')`
 * 
 * @listens SimpleKeyboard:injectKeyboard Injects the keyboard into all .handsfree-simple-keyboard
 * @emits handsfree:SimpleKeyboard:change(value) 
 * @see https://franciscohodge.com/projects/simple-keyboard/documentation/
 */
const Keyboard = require('simple-keyboard').default
require('simple-keyboard/build/css/index.css')

module.exports = {
  name: 'SimpleKeyboard',

  // Collection of keyboards
  // {$input, $keyboard, keyboard}
  keyboards: [],

  // The target input element receiving content
  $target: null,

  // Cache different callbacks
  callbacks: {
    focusin: []
  },

  /**
   * Setup events
   * 
   * @listens SimpleKeyboard:injectKeyboard
   * @listens SimpleKeyboard:show
   * @listens SimpleKeyboard:hide
   * @listens SimpleKeyboard:set
   * 
   * @emits SimpleKeyboard:injectKeyboard
   */
  onUse () {
    this.$handsfree.on('SimpleKeyboard:injectKeyboard', () => this.injectKeyboard())
    this.$handsfree.on('SimpleKeyboard:show', value => this.show(value))
    this.$handsfree.on('SimpleKeyboard:hide', this.hide)
    this.$handsfree.on('SimpleKeyboard:set', value => this.set(value))

    this.$handsfree.dispatch('SimpleKeyboard:injectKeyboard')
    this.listenToFocusEvents()
  },

  /**
   * Shows the keyboard
   * - Adds `body.handsfree-simple-keyboard-is-visible`
   */
  show () {
    document.body.classList.add('handsfree-simple-keyboard-is-visible')
    this.set(this.$target.value)
  },

  /**
   * Hides the keyboard
   * - Removes `body.handsfree-simple-keyboard-is-visible`
   */
  hide () {
    document.body.classList.remove('handsfree-simple-keyboard-is-visible')
  },

  /**
   * Sets the value of the keyboard
   * 
   * @param {String} value The new value to use
   * @emits handsfree:SimpleKeyboard:change(value) 
   */
  set (value = '') {
    this.keyboards.forEach(board => {
      board.keyboard.setInput(value)
      this.$target.value = board.$keyboard.value = board.$input.value = value
      // Required on the target for reactive frameworks like React/Vue
      this.$target.dispatchEvent(new Event('input'))
      this.$handsfree.dispatch('SimpleKeyboard:change', value)
    })
  },

  /**
   * Injects the keyboard
   * - Adds .handsfree-simple-keyboard-rendered to prevent duplicates
   */
  injectKeyboard () {
    document.querySelectorAll('.handsfree-simple-keyboard:not(.handsfree-simple-keyboard-rendered)').forEach($el => {
      const $input = document.createElement('input')
      const $keyboard = document.createElement('div')
      $keyboard.classList.add('simple-keyboard')
      $input.classList.add('simple-keyboard-input')

      $el.appendChild($input)
      $el.appendChild($keyboard)
      $el.classList.add('handsfree-simple-keyboard-rendered')

      this.keyboards.push({
        $input,
        $keyboard,
        keyboard: new Keyboard({
          /**
           * Set the value
           */
          onChange: value => this.set(value),
          
          /**
           * Handle the `{enter}` key
           * @see https://franciscohodge.com/projects/simple-keyboard/documentation/
           */
          onKeyPress: button => {
            if (button === '{enter}') {
              this.$target.dispatchEvent(new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                keyCode: 13
              }))
              this.$handsfree.dispatch('SimpleKeyboard:hide')
            }
          }
        })
      })
    })
  },

  /**
   * Adds event listeners to input focus events, to know when to trigger show/hide events
   */
  listenToFocusEvents () {
    const callback = ev => {
      const name = ev.target.nodeName
      const type = ev.target.type
      
      if (!ev.target.classList.contains('simple-keyboard-input')) {
        if ((name === 'INPUT' && (type === 'text' || type === 'password'))
          || (name === 'TEXTAREA')) {
          this.$target = ev.target
          this.show()
        }
      }

      this.$target && this.setInputType()
    }
    this.callbacks.focusin.push(callback)

    document.addEventListener('click', callback)
    document.addEventListener('focusin', callback)
  },

  /**
   * Changes the simple-keyboarde input type to text/password
   */
  setInputType () {
    let type = 'text'
    
    switch (this.$target.type) {
      case 'password': type = 'password'; break
    }

    this.keyboards.forEach(board => {
      board.$input.type = type
    })
},

  /**
   * Stop listening to document.addEventListener
   */
  unlistenToFocusEvents () {
    this.callbacks.focusin.forEach(callback => {
      document.removeEventListener('focusin', callback)
      document.removeEventListener('click', callback)
    })
  }
}
