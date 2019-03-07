<template lang="pug">
div
</template>

<script>
import {TweenMax} from 'gsap'

/**
 * Inject YouTube APIs
 * @see https://developers.google.com/youtube/iframe_api_reference
 * @see https://developers.google.com/youtube/v3/docs/search#resource
 * @todo load only when needed
 */
window.onYouTubeDataAPIReady = function () {window.App.$store.dispatch('youtube/initDataAPI')}

const apis = ['https://www.youtube.com/iframe_api', 'https://apis.google.com/js/api.js']
apis.forEach((api, i) => {
  let $script = document.createElement('script')
  $script.src = api

  // YouTube Data API
  if (i === 1) $script.onload = window.onYouTubeDataAPIReady
  document.body.appendChild($script)
})

export default {
  mounted () {
    this.$store.dispatch('onReady', () => {
      const handsfree = window.handsfree
      handsfree.use({
        name: 'youtube-360',
        
        // Used for tweening
        tween: {},

        /**
         * Toggle video with camera
         */
        onStart () {window.App.$store.dispatch('youtube/play')},
        onStop () {
          window.App.$store.dispatch('youtube/pause')
          handsfree.cursor.$el.style.display = 'inherit'
        },

        /**
         * This is called on each webcam frame
         * @param {Array} poses An array of detected poses
         */
        onFrame (poses) {
          // @TODO Refactor this
          if (!window.App.$store.state.youtube.player || !document.contains(window.App.$store.state.youtube.player.a)) return
          window.App.$store.state.youtube.player.getSphericalProperties && window.App.$store.state.youtube.player.setSphericalProperties(this.tween)

          poses.forEach(pose => {
            const face = pose.face
            this.tweenPOV(face)
            
            // When cursor is over youtube...
            if (window.App.$store.state.youtube.player.getPlayerState && pose.cursor.$target && pose.cursor.$target.getAttribute('id') === 'youtube-player') {
              // ...toggle the player
              if (face.cursor.state.mouseDown) {
                if (window.App.$store.state.youtube.player.getPlayerState() === 1) {
                  this.onStop()
                } else {
                  this.onStart()
                }
              }

              // Hide cursor
              if (window.App.$store.state.youtube.player.getPlayerState && window.App.$store.state.youtube.player.getPlayerState() === 1) handsfree.cursor.$el.style.display = 'none'
            } else {
              // Show cursor
              handsfree.cursor.$el.style.display = 'inherit'
            }
          })
        },

        /**
         * Updates the pov
         */
        tweenPOV (face) {
          if (window.App.$store.state.youtube.player.getSphericalProperties) {
            TweenMax.to(this.tween, 500 / 1000, {
              pitch: -face.rotationX * 180 / Math.PI * 8,
              yaw: -face.rotationY * 180 / Math.PI * 10,
              roll: face.rotationZ * 180 / Math.PI * 2,
              ease: 'Linear.easeNone',
              overwrite: true,
              immediate: true
            })
          }
        }
      })
    })
  }
}
</script>
