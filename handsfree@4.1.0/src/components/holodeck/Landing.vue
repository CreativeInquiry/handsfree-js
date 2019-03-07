<template lang="pug">
div
  UseHandsfree
  v-container(grid-list-md)
    v-layout.mb-5(wrap)
      v-flex(xs12 md6 lg8 style='height: 500px')
      v-flex.handsfree-show-when-stopped(xs12 md6 lg4)
        v-card(light)
          v-responsive
            v-img(src='https://media.giphy.com/media/9wZID81vMLTwJ5JKps/giphy.gif')
          v-card-text
            //- v-img(src='https://media.giphy.com/media/4HgnusIh1i8MzRoaOm/giphy.gif')
            p.mt-3
              | This experiment explores an illusion of depth effect via head tracking! It doesn't work quite right yet, so you can <a href="https://github.com/BrowseHandsfree/handsfreeJS/issues/37">check out these links</a> for examples of what it should look like.
          
          v-divider.mb-3

          v-card-title.pb-0
            h3 Instructions
          v-card-text
            ul
              li Lean and duck in any direction to move towards that direction
              li Smile wide to show and hide the cursor
            
          v-divider.my-3

          v-card-title.pb-0
            h3 🗺️ Roadmap
          v-card-text
            p
              i 
                a(href='https://github.com/BrowseHandsfree/handsfreeJS/issues/37') See issue on GitHub
            p.mt-4 Want to help? Pull requests welcome on <a href="https://github.com/browsehandsfree/HandsfreeJS">GitHub</a> or <a href="https://twitter.com/labofoz">@labofoz</a>
</template>

<script>
import UseHandsfree from './handsfree'

export default {
  name: 'HolodeckLanding',

  components: {UseHandsfree},
  
  beforeRouteLeave (to, from, next) {
    window.handsfree.plugin.holodeck.disable()
    next()
  }
}
</script>

<style scoped lang="stylus">
>>>iframe
  position: fixed
</style>
