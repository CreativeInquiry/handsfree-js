<template lang="pug">
div
  v-container(grid-list-lg flex)
    v-layout(row wrap)
      DocsSidebar
        v-img(src='https://media.giphy.com/media/1BfxclKOXRBVQyX2OV/source.gif')

      v-flex(xs12 md8)
        v-card
          v-card-title(primary-title)
            h2.headline.mb-0 Events
          v-card-text
            p If you don't have access to the handsfree instance, or if you don't want to create a plugin (for instance, to communicate with disconnected parts of your app/service), an alternative is to just listen to the following window events:
            
            pre
              code.javascript.
                /**
                  * Bind to the handsfree:trackPoses event, which is called once per frame
                  * @param {Handsfree} ev.detail.scope The handsfree instance
                  * @param {Array}     ev.detail.poses Collection of pose objects
                  */
                window.addEventListener('handsfree:trackPoses', (ev) => {
                  // Do code with the handsfree instance: ev.detail.scope
                  // or with the the pose: ev.detail.poses
                })

                /**
                  * Called for every chunk while BRFv4 is loading
                  * - Good for showing load progress
                  * - ev.data.progress is between 0 and 1
                  */
                window.addEventListener('handsfree:loading', (ev) => {
                  const progress = ev.data.progress
                  // Display progress
                })

                /**
                  * Called after handsfree is instantiated and ready to be used
                  * - Models are loaded and ready to be used
                  * - Use this to enable a [onclick="handsfree.start()"]
                  * - Also good for ending a loading screen
                  */
                window.addEventListener('handsfree:ready', () => {
                  // Enable .start() buttons
                })

                /**
                  * Called the first frame that a face clicks
                  */
                window.addEventListener('handsfree:mouseDown', (ev) => {
                  const face = ev.detail.face
                  const faceIndex = ev.detail.faceIndex

                  // Do things with face and faceIndex here
                })

                /**
                  * Called every frame after a face clicks and is still in "click mode"
                  */
                window.addEventListener('handsfree:mouseDrag', (ev) => {
                  const face = ev.detail.face
                  const faceIndex = ev.detail.faceIndex

                  // Do things with face and faceIndex here
                })

                /**
                  * Called when a face releases a click
                  */
                window.addEventListener('handsfree:mouseUp', (ev) => {
                  const face = ev.detail.face
                  const faceIndex = ev.detail.faceIndex

                  // Do things with face and faceIndex here
                })

          v-card-text
            p You can use <code>handsfree.dispatch(eventName)</code> to trigger events. This helper is the equivalent of using <code>window.dispatchEvent()</code>. One thing to note is that eventNames are namespaced with <code>handsfree:</code>, for instance:

            pre
              code.javascript.
                // This...
                handsfree.dispatch('SimpleKeyboard:change', 'abc')

                // ...and this are equivalent
                window.dispatchEvent(new CustomEvent('handsfree:SimpleKeyboard:change'), {
                  detail: 'abc'
                })

            v-flex
              v-btn(color='primary' :to='{name: "docsPlugins"}')
                v-icon chevron_left
                | Plugins
              v-btn(color='primary' :to='{name: "docsCursor"}' style='float: right')
                | Cursor
                v-icon chevron_right
              .clear
</template>

<script>
import DocsSidebar from './Sidebar'

export default {
  name: 'docsEvents',
  components: {DocsSidebar},
  mounted () {this.$store.dispatch('syntaxHighlight')}
}
</script>
