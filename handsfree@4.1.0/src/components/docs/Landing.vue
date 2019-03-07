<template lang="pug">
div
  v-container(grid-list-lg flex)
    v-layout(row wrap)
      DocsSidebar(activeGroup='gettingStarted')
        v-img(src='https://media.giphy.com/media/1BfxclKOXRBVQyX2OV/source.gif')

      v-flex(xs12 md8)
        v-card
          v-card-title(primary-title)
            h1.headline.mb-0 Getting Started
          v-card-text
            p <strong>Handsfree.js is a drop-in library that adds head tracked cursors in just a few lines.</strong> By default, Handsfree.js is configured for web browsing: clicking, typing, and page scrolling all work out the box with no setup!
            p To calculate where to place these cursors, <strong>Handsfree.js</strong> uses computer vision models like <a href="https://github.com/Tastenkunst/brfv4_javascript_examples">BRFv4</a> and <a href="https://github.com/tensorflow/tfjs-models/tree/master/posenet">PoseNet</a> to extract pose information. Depending on your specific use case and performance requirements, you can hot-swap these models to explore new ways to interact with your devices!

            v-card.mb-3
              v-card-text
                .text-xs-center
                  a(href='https://glitch.com/~handsfree-mini-boilerplate')
                    img(src='https://media.giphy.com/media/ljWZ0aoDVR5bqWGbRu/giphy.gif')
                  br
                  a(href='https://glitch.com/~handsfree-mini-boilerplate') Try the Handsfree Starter on Glitch.com
                pre 
                  code.xml.
                   &lt;!DOCTYPE html&gt;
                    &lt;body&gt;
                      &lt;script src="https://unpkg.com/handsfree@4.0.2/dist/handsfree.js">&lt;/script&gt;
                      &lt;script&gt;
                        handsfree = new Handsfree()
                        handsfree.start()
                      &lt;/script&gt;
                    &lt;/body&gt;

            v-expansion-panel(v-model='tab')
              v-expansion-panel-content
                strong(slot='header') Installing through HTML (for web environments)
                v-card
                  v-card-text
                    p This is how we encourage you to use Handsfree.js when using standard web technologies or when experimenting on sites like <a href="https://glitch.com/~handsfree-mini-boilerplate">Glitch.com (check out the Handsfree Starter!)</a>. Because Handsfree.js is constantly being updated, we strongly recommend using either a specific version or limiting it to a major version:
                    pre 
                      code.xml.
                        &lt;!-- Lock Handsfree.js to a specific version (RECOMMENDED) --&gt;
                        &lt;script src="https://unpkg.com/handsfree@4.0.2/dist/handsfree.js">&lt;/script&gt;

                        &lt;!-------------------- or --------------------&gt;
                        &lt;!-- Use any new minor release before 5.0.0 --&gt;
                        &lt;script src="https://unpkg.com/handsfree@&lt;5/dist/handsfree.js">&lt;/script&gt;

                        &lt;!-------------------- or --------------------&gt;
                        &lt;!-- Use the very latest (NOT recommended) --&gt;
                        &lt;script src="https://unpkg.com/handsfree/dist/handsfree.js">&lt;/script&gt;

                        &lt;!------------------ then --------------------&gt;
                        &lt;!-- Instantiate Handsfree with default settings and start it --&gt;
                        &lt;script&gt;
                          handsfree = new Handsfree()
                          handsfree.start()
                        &lt;/script>
                    
                    p And here's a complete, minimal example:
                    pre 
                      code.xml.
                       &lt;!DOCTYPE html&gt;
                        &lt;body&gt;
                          &lt;script src="https://unpkg.com/handsfree@4.0.2/dist/handsfree.js">&lt;/script&gt;
                          &lt;script&gt;
                            handsfree = new Handsfree()
                            handsfree.start()
                          &lt;/script&gt;
                        &lt;/body&gt;

              v-expansion-panel-content
                strong(slot='header') Installing through Node (for server based environments)
                v-card
                  v-card-text
                    p When developing for the Internet of Things or non-browser based environments, we encourage you to use the below method:
                    pre
                      code.bash npm install handsfree

                    div then:
                    pre 
                      code.javascript.
                       import Handsfree from 'handsfree'
                        const handsfree = new Handsfree()
                        handsfree.start()

            v-flex
              v-btn(color='primary' :to='{name: "docsDefaultUsage"}' style='float: right')
                | Default Usage
                v-icon chevron_right
              .clear
</template>

<script>
import DocsSidebar from './Sidebar'

export default {
  name: 'docsLanding',
  components: {DocsSidebar},
  mounted () {this.$store.dispatch('syntaxHighlight')},

  data () {
    return {
      tab: -1
    }
  }
}
</script>