<template lang="pug">
div
  v-btn.primary.handsfree-show-when-stopped(large @click='startWebcam' :disabled='isHandsfreeLoading')
    v-icon.mr-2 videocam
    | Start Webcam
  v-btn.primary.handsfree-show-when-started(large color='error' @click='stopWebcam')
    v-icon.mr-2 videocam_off
    | Stop Webcam
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'WebcamToggle',

  computed: mapState([
    'isHandsfreeLoading'
  ]),

  methods: {
    startWebcam () {this.$store.dispatch('startHandsfree')},
    stopWebcam () {this.$store.dispatch('stopHandsfree')}
  }
}
</script>
