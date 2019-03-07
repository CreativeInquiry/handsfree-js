<template lang="pug">
  v-app
    v-toolbar#main-nav(app style='z-index: 99')
      v-toolbar-side-icon(@click.stop='isNavOpen = !isNavOpen')
      v-toolbar-title.headline.text-uppercase
        router-link(to='/' style='text-decoration: none; color: inherit')
          img.mr-2(:src='favicon' height=50 style='vertical-align: middle')
          span.hidden-sm-and-down
            strong Handsfree
            small .js.org
      v-spacer
      span.hidden-sm-and-down
        WebcamToggle
      span.hidden-md-and-up
        v-btn.primary.handsfree-show-when-stopped(large @click='startWebcam' :disabled='isHandsfreeLoading')
          v-icon videocam
        v-btn.primary.handsfree-show-when-started(large color='error' @click='stopWebcam')
          v-icon videocam_off

    v-progress-linear#loading-bar(v-model='loading.progress' :color='loading.color')

    //- Left Navigation
    v-navigation-drawer(app temporary v-model='isNavOpen' style='z-index: 100')
      v-list.layout.column.fill-height
        v-list-tile(:to='{name: "Home"}')
          v-list-tile-action
            img(src='/favicon.png' width=48)
          v-list-tile-title Home

        v-list-tile(:to='{name: "docs"}')
          v-list-tile-action
            v-icon book
          v-list-tile-title Docs

        v-list-group
          v-list-tile(slot='activator')
            v-list-tile-action
              v-icon category
            v-list-tile-content
              v-list-tile-title Demos
            
          v-list-tile(
          v-for='demo in demos'
          :to='demo.to'
          :key='demo.title'
          :prepend-icon='demo.icon'
          no-action)
            v-list-tile-action
            v-list-tile-title(v-html='demo.title')

        v-list-tile(:to='{name: "settings"}')
          v-list-tile-action
            v-icon settings
          v-list-tile-title Settings

        v-spacer
        v-divider
        v-list-tile(href='https://glitch.com/~handsfree-mini-boilerplate')
          v-list-tile-action
            v-icon developer_board
          v-list-tile-title Handsfree Starter Kit
        v-divider
        v-list-tile(href='https://twitter.com/labofoz')
          v-list-tile-action
            v-icon person
          v-list-tile-title Twitter @Labofoz

    v-content
      .handsfree-debug-wrap
      Keyboard
      router-view
</template>

<script>
import Keyboard from './components/Keyboard'
import WebcamToggle from './components/WebcamToggle'
import {mapState} from 'vuex'

export default {
  name: 'App',

  components: {
    Keyboard,
    WebcamToggle
  },

  computed: mapState([
    'isHandsfreeLoading',
    'loading'
  ]),

  data () {
    return {
      // Collection of demos
      demos: [
        {
          title: 'YouTube Client',
          to: {name: "youtubeLanding"},
          icon: 'ondemand_video'
        },
        {
          title: '"VR Display"',
          to: {name: "holodeckLanding"},
          icon: 'blur_on'
        },
        // {
        //   title: 'Kinematics',
        //   to: {name: "kinematicsLanding"},
        //   icon: 'android'
        // },
        {
          title: 'Space Whales',
          to: {name: "spaceWhalesLanding"},
          icon: 'blur_on'
        }
      ],
      
      // The favicon next to the title
      favicon: '/favicon.png',
      
      // If the navigation is open
      isNavOpen: false
    }
  },

  methods: {
    startWebcam () {this.$store.dispatch('startHandsfree')},
    stopWebcam () {this.$store.dispatch('stopHandsfree')}
  }
}
</script>

<style scoped lang="stylus">
  body
    background: rgb(18, 10, 34)

  div.theme--dark.application,
  div.theme--light.application
    background: none
    position: relative
    z-index: 1

  #loading-bar
    position: fixed
    top: 50px
    z-index: 2
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.35)

  @media screen and (max-width: 960px)
    #loading-bar
      top: 34px

  @media screen and (max-width: 724px)
    #loading-bar
      top: 42px
</style>