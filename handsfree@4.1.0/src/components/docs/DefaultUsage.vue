<template lang="pug">
div
  v-container(grid-list-lg flex)
    v-layout(row wrap)
      DocsSidebar(activeGroup='gettingStarted')
        v-img(src='https://media.giphy.com/media/1BfxclKOXRBVQyX2OV/source.gif')

      v-flex(xs12 md8)
        v-card
          v-card-title(primary-title)
            h1.headline.mb-0 Default Usage
          v-card-text
            p By default, Handsfree.js adds a cursor on the screen for one user at a time. This cursor is capable of the following:
            ul
              li Clicking and focusing elements with a "Click Action" (smile wide by default)
              li Display a virtual keyboard when clicking into <code>&lt;input&gt;</code> fields
              li Scroll pages by moving the cursor above or below the window

            h2 Try it out

            v-expansion-panel.mt-3(v-model='tab')
              v-expansion-panel-content
                strong(slot='header') Clicking on buttons and switches using native mouse events
                v-card
                  v-card-text
                    v-btn-toggle(v-model='lastButton')
                      v-btn(flat large)
                        v-icon format_align_left
                      v-btn(flat large)
                        v-icon format_align_center
                      v-btn(flat large)
                        v-icon format_align_right
                      v-btn(flat large)
                        v-icon format_align_justify
                      v-divider.mx-2(vertical)
                      v-btn(flat large)
                        v-icon format_bold
                      v-btn(flat large)
                        v-icon format_italic
                      v-btn(flat large)
                        v-icon format_underlined
                      v-btn(flat large)
                        v-icon format_color_fill
                    br
                    v-radio-group(v-model='lastRadio')
                      v-radio(label='Test Switch A' value=1)
                      v-radio(label='Test Switch B' value=2)
                      v-radio(label='Test Switch C' value=3)

              v-expansion-panel-content
                strong(slot='header') Activate virtual keyboard by focusing on input fields
                v-card
                  v-card-text
                    v-text-field(label='Standard text field')
                    v-text-field(label='Password field' type='password')
                    v-textarea(label='Text area')

              v-expansion-panel-content
                strong(slot='header') Scroll pages
                v-card
                  v-card-text
                    h2 Dummy Text
                    p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a purus consequat purus aliquet venenatis. Sed pretium sed lorem a maximus. Cras eu tellus aliquam, gravida nibh nec, sagittis augue. Etiam id diam sed ex lacinia rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus ut arcu vitae turpis vulputate dignissim. Donec euismod diam at felis pharetra, eu auctor velit consequat. Sed nec leo augue. Donec consequat nunc non nisl mattis consequat. Quisque mollis mauris vehicula lorem vulputate ultrices. Nunc ullamcorper, magna quis consectetur eleifend, nulla lectus sagittis ex, eget varius ligula nisl a sapien. Sed dictum orci vitae aliquam porta. In ornare at enim at maximus. Sed dapibus aliquam dolor non tincidunt.
                    p Pellentesque imperdiet nisl at felis volutpat semper a sed elit. Donec ac interdum mauris. Aenean lacinia pretium ligula et vestibulum. In hac habitasse platea dictumst. Nulla facilisi. Nullam odio sapien, sollicitudin ut lectus nec, interdum rhoncus enim. Cras faucibus nulla sodales, lobortis lorem et, sagittis mauris.
                    p Proin eget mi dui. Sed bibendum enim quis ipsum viverra, et auctor justo egestas. Curabitur hendrerit lacinia elit et vulputate. Maecenas a sem ac neque egestas congue. Nullam id leo ultrices elit convallis vehicula sit amet ut dolor. Cras venenatis justo nec lacinia imperdiet. Suspendisse at rhoncus erat, in volutpat mauris. Aliquam vestibulum ligula vitae condimentum venenatis. Aenean eu risus quis quam dapibus varius. Vivamus sed risus fringilla, facilisis tortor quis, varius ligula. Sed finibus felis eros, a mattis mi pharetra ac.
                    p Duis vestibulum non ipsum quis imperdiet. Aliquam et laoreet turpis. Nam nec interdum felis. Aenean tristique volutpat nibh a feugiat. Morbi ut quam aliquam, maximus eros non, pretium nisl. Phasellus consequat, mauris non porta sollicitudin, libero mi molestie tortor, eget interdum nisl nunc eget metus. Cras sed purus eu mauris tempus pretium. Donec in risus eget sem aliquam tristique. Nulla varius metus ac arcu luctus pellentesque. Maecenas varius varius ultrices. Pellentesque a ante mattis, ultrices felis eget, hendrerit dolor. Suspendisse congue tortor commodo euismod aliquet. Pellentesque finibus a sapien at vestibulum.
                    p Donec dignissim facilisis blandit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam luctus dapibus elit ac laoreet. Morbi blandit orci nulla, non consequat orci molestie fermentum. Pellentesque turpis massa, sodales a nibh ac, feugiat malesuada est. Nullam ornare rhoncus elit ac condimentum. Ut nec mauris et turpis ultricies fringilla. Ut a quam gravida, vestibulum diam eget, efficitur magna. Praesent viverra blandit diam, id finibus leo porttitor a. Quisque est ipsum, placerat id mattis a, finibus id velit. Proin auctor lectus eu massa tempor fermentum. Vestibulum commodo egestas pellentesque. Proin eget tellus vehicula, rhoncus mi id, imperdiet mauris. Nullam mattis, leo a semper commodo, enim lorem volutpat orci, blandit egestas justo enim ac arcu. Donec molestie finibus diam, a laoreet dui sollicitudin id.
                    p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a purus consequat purus aliquet venenatis. Sed pretium sed lorem a maximus. Cras eu tellus aliquam, gravida nibh nec, sagittis augue. Etiam id diam sed ex lacinia rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus ut arcu vitae turpis vulputate dignissim. Donec euismod diam at felis pharetra, eu auctor velit consequat. Sed nec leo augue. Donec consequat nunc non nisl mattis consequat. Quisque mollis mauris vehicula lorem vulputate ultrices. Nunc ullamcorper, magna quis consectetur eleifend, nulla lectus sagittis ex, eget varius ligula nisl a sapien. Sed dictum orci vitae aliquam porta. In ornare at enim at maximus. Sed dapibus aliquam dolor non tincidunt.
                    p Pellentesque imperdiet nisl at felis volutpat semper a sed elit. Donec ac interdum mauris. Aenean lacinia pretium ligula et vestibulum. In hac habitasse platea dictumst. Nulla facilisi. Nullam odio sapien, sollicitudin ut lectus nec, interdum rhoncus enim. Cras faucibus nulla sodales, lobortis lorem et, sagittis mauris.
                    p Proin eget mi dui. Sed bibendum enim quis ipsum viverra, et auctor justo egestas. Curabitur hendrerit lacinia elit et vulputate. Maecenas a sem ac neque egestas congue. Nullam id leo ultrices elit convallis vehicula sit amet ut dolor. Cras venenatis justo nec lacinia imperdiet. Suspendisse at rhoncus erat, in volutpat mauris. Aliquam vestibulum ligula vitae condimentum venenatis. Aenean eu risus quis quam dapibus varius. Vivamus sed risus fringilla, facilisis tortor quis, varius ligula. Sed finibus felis eros, a mattis mi pharetra ac.
                    p Duis vestibulum non ipsum quis imperdiet. Aliquam et laoreet turpis. Nam nec interdum felis. Aenean tristique volutpat nibh a feugiat. Morbi ut quam aliquam, maximus eros non, pretium nisl. Phasellus consequat, mauris non porta sollicitudin, libero mi molestie tortor, eget interdum nisl nunc eget metus. Cras sed purus eu mauris tempus pretium. Donec in risus eget sem aliquam tristique. Nulla varius metus ac arcu luctus pellentesque. Maecenas varius varius ultrices. Pellentesque a ante mattis, ultrices felis eget, hendrerit dolor. Suspendisse congue tortor commodo euismod aliquet. Pellentesque finibus a sapien at vestibulum.
                    p Donec dignissim facilisis blandit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam luctus dapibus elit ac laoreet. Morbi blandit orci nulla, non consequat orci molestie fermentum. Pellentesque turpis massa, sodales a nibh ac, feugiat malesuada est. Nullam ornare rhoncus elit ac condimentum. Ut nec mauris et turpis ultricies fringilla. Ut a quam gravida, vestibulum diam eget, efficitur magna. Praesent viverra blandit diam, id finibus leo porttitor a. Quisque est ipsum, placerat id mattis a, finibus id velit. Proin auctor lectus eu massa tempor fermentum. Vestibulum commodo egestas pellentesque. Proin eget tellus vehicula, rhoncus mi id, imperdiet mauris. Nullam mattis, leo a semper commodo, enim lorem volutpat orci, blandit egestas justo enim ac arcu. Donec molestie finibus diam, a laoreet dui sollicitudin id.
            v-flex
              v-btn(color='primary' :to='{name: "docs"}')
                v-icon chevron_left
                | Getting Started
              v-btn(color='primary' :to='{name: "docsConfig"}' style='float: right')
                | Config &amp; Settings
                v-icon chevron_right
              .clear
</template>

<script>
import DocsSidebar from './Sidebar'

export default {
  name: 'docsDefaultUsage',
  components: {DocsSidebar},
  mounted () {this.$store.dispatch('syntaxHighlight')},

  data () {
    return {
      lastButton: 0,
      lastRadio: 1,
      tab: 0
    }
  }
}
</script>