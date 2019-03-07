<template lang="pug">
div
  .handsfree-simple-keyboard-mask(@click='close')
  .handsfree-simple-keyboard
</template>

<script>
export default {
  name: 'Keyboard',

  methods: {
    close () {window.handsfree.dispatch('SimpleKeyboard:hide')}
  }
}
</script>

<style lang="stylus" scoped>
.handsfree-simple-keyboard-mask
  position: fixed
  display: none
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 9
  background: rgba(0, 0, 0, 0.35)

>>>.handsfree-simple-keyboard
  position: fixed
  bottom: -450px
  height: 450px
  left: 0
  right: 0
  z-index: 10
  color: #444
  transition: bottom 0.15s ease

.handsfree-simple-keyboard-is-visible
  .handsfree-simple-keyboard
    bottom: 0
  .handsfree-simple-keyboard-mask
    display: block
    cursor: pointer
</style>
