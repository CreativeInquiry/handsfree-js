<template lang="pug">
div
  v-container(grid-list-lg flex)
    v-layout(row wrap)
      DocsSidebar
        v-img(src='https://media.giphy.com/media/1BfxclKOXRBVQyX2OV/source.gif')

      v-flex(xs12 md8)
        v-card
          v-card-title(primary-title)
            h2.headline.mb-0 handsfree.cursor
          v-card-text
            p The <code>handsfree.cursor</code> object contains the following:
            pre
              code.javascript.
               {
                  // The predicted pixel.x
                  x: {Number},
                  // The predicted pixel.y
                  y: {Number},
                  // The HTML element currently under the (x, y)
                  $el: {HTMLElement}
                }

            p If you're using multiple trackers/users, you can also use the <code>.cursor.$target</code> of the pose:
            pre
              code.javascript.
                // Outside of plugins
                const $target = handsfree.poses[n].cursor.$target
                
                // Inside plugins
                handsfree.use({
                  onFrame (poses) {
                    const $target = poses[n].cursor.$target
                  }
                })

            p You can do anything with the target including manipulating it (eg with jQuery) and dispatching events with the <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events">dispatchEvent API</a>.

            v-flex
              v-btn(color='primary' :to='{name: "docsEvents"}')
                v-icon chevron_left
                | Events
</template>

<script>
import DocsSidebar from './Sidebar'

export default {
  name: 'docsCursor',
  components: {DocsSidebar},
  mounted () {this.$store.dispatch('syntaxHighlight')}
}
</script>
