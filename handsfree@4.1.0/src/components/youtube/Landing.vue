<template lang="pug">
v-container(grid-list-md)
  v-layout.mb-5(wrap)
    v-flex(xs12 md6 lg8)
      v-card(light)
        v-card-text.mb-0
          v-text-field(label='Search YouTube' clearable v-model='searchQuery' @keyup.enter='search')
            v-btn.mt-0(slot='append-outer' @click='search' :disabled='isDisabled' :loading='isLoading')
              v-icon search
          v-switch(label='Only 360/VR videos' v-model='only360')

      v-container.px-0(v-if='results.search.items.length')
        v-layout(wrap)
          template(v-for='result in results.search.items')
            v-flex.mb-3(xs12)
              v-card(light)
                v-layout(row)
                  v-flex(xs5)
                    router-link(:to='{name: "youtubeSingle", params: {id: result.id.videoId}}')
                      v-img(contain :src='result.snippet.thumbnails.medium.url')
                  v-flex(xs7)
                    router-link.unlink(:to='{name: "youtubeSingle", params: {id: result.id.videoId}}')
                      v-card-title(primary-title)
                        div
                          h3 {{result.snippet.title}}
                          //- @TODO link
                          span.grey--text {{result.snippet.channelTitle}} &middot; {{timeAgo(result.snippet.publishedAt)}}
                      v-card-text 
                        div(style='white-space: pre-wrap;') {{result.snippet.description}}

    v-flex(xs12 md6 lg4)
      v-card(light)
        v-responsive
          v-img(src='https://media.giphy.com/media/4HgnusIh1i8MzRoaOm/giphy.gif')
        v-card-text
          div.mt-3
              | This experiment explores watching YouTube handsfree, specifically "360" panoramic videos!
        v-divider.mb-3
        v-card-title.pb-0
          h3 Instructions
        v-card-text
          ul
            li Turn, tilt, and roll your head in the direction you want to look in
            li Smile wide to click on video to start/pause it
            li Manually click/tap fullscreen button to enter full screen and hide cursor
          
        v-divider.my-3

        v-card-title.pb-0
          h3 🗺️ Roadmap
        v-card-text
          ol
            li Remove jitter
            li Go in and out of full screen with gesture
            li Change FOV by leaning in/out
            li Get virtual keyboard working
            li Pagination
            li Search filters
            li Scrub videos
            li View playlists
            li Create local playlists (no login)
            li Trending videos
            li Comment on videos
            li Upvote/downvote
            li Account-based features (requires login)
          p.mt-4 Want to help? Pull requests welcome on <a href="https://github.com/browsehandsfree/HandsfreeJS">GitHub</a> or <a href="https://twitter.com/labofoz">@labofoz</a>
</template>

<script>
import {mapState} from 'vuex'
import {trim} from 'lodash'

// @TODO Add this as a vue plugin
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

export default {
  name: 'YouTubeLanding',

  computed: {
    isDisabled () {return this.isLoading || !this.isAPIReady || !trim(this.searchQuery)},
    
    ...mapState('youtube', {
      isAPIReady: state => state.isReady,
      isLoading: state => state.isLoading,
      results: state => state.results
    })
  },

  data: () => ({
    // Limit to just 360 videos
    only360: true,
    // The search query to use
    searchQuery: 'Blue Angels'
  }),

  mounted () {
    this.search()
  },

  methods: {
    /**
     * Search YouTube and display results
     */
    search () {
      let query = this.searchQuery
      if (this.only360) query += ' 360'
      
      this.$store.dispatch('youtube/search', {query})
    },

    /**
     * Returns a formatted time
     */
    timeAgo: date => timeAgo.format(new Date(date), 'time')
  }
}
</script>
