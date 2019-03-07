<template lang="pug">
v-flex(xs12 md4)
  v-card
    slot
    v-card-text
      v-list(three-line)
        v-list-group(:value='theActiveGroup === "gettingStarted"')
          v-list-tile(slot='activator')
            v-list-tile-content
              v-list-tile-title Getting Started
              v-list-tile-sub-title Learn what Handsfree.js is, what it can do, and how to set it up!

          v-list-tile(:to='{name: "docs"}' exact)
            v-list-tile-avatar
              v-img(style='border-radius: 0 !important' src='/favicon.png')
            v-list-tile-content
              v-list-tile-title Installing
              v-list-tile-sub-title Learn how to setup Handsfree.js through CDN or NPM

          v-divider
          v-list-tile(:to='{name: "docsDefaultUsage"}')
            v-list-tile-avatar
              v-img(style='border-radius: 0 !important' src='/favicon.png')
            v-list-tile-content
              v-list-tile-title Default Usage
              v-list-tile-sub-title See what Handsfree.js can do without any setup

        v-divider
        v-list-group(:value='theActiveGroup === "config"')
          v-list-tile(slot='activator')
            v-list-tile-content
              v-list-tile-title Config and Settings
              v-list-tile-sub-title Instantiate and update Handsfree.js to behave in different ways
          v-list-tile(:to='{name: "docsConfig"}')
            v-list-tile-avatar
              v-img(style='border-radius: 0 !important' src='/favicon.png')
            v-list-tile-content
              v-list-tile-title Config Overview
              v-list-tile-sub-title Explore the different instantiation configs

        v-divider
        v-list-tile(:to='{name: "docsPlugins"}')
          v-list-tile-avatar
            v-img(style='border-radius: 0 !important' src='/favicon.png')
          v-list-tile-content
            v-list-tile-title Plugins
            v-list-tile-sub-title Extend Handsfree.js to work within your project with plugins

        v-divider
        v-list-tile(:to='{name: "docsEvents"}')
          v-list-tile-avatar
            v-img(style='border-radius: 0 !important' src='/favicon.png')
          v-list-tile-content
            v-list-tile-title Events
            v-list-tile-sub-title Events allow disconnected parts of your project to communicate with Handsfree.js
</template>

<script>
export default {
  name: 'DemoSidebar',
  props: ['activeGroup'],

  data () {
    return {
      theActiveGroup: this.activeGroup
    }
  },
}
</script>

<style lang="stylus">
div .v-list__tile__avatar
  display: none

div .v-list__tile--active .v-list__tile__avatar
  display: flex
</style>
