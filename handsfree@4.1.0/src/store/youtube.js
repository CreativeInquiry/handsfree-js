/**
 * Handles the YouTube player and APIs
 * @see https://developers.google.com/youtube/iframe_api_reference
 * @see https://developers.google.com/youtube/v3/docs/search#resource
 */
import {trim} from 'lodash'
const dataAPIKey = 'AIzaSyBAQDzthv61fqzDTy3IVMbgIrzYSi4vIYw'

export default {
  namespaced: true,
  
  state: {
    // Whether the API is ready
    isReady: false,
    // Whether we are loading
    isLoading: false,
    // The YT.Player object
    player: false,
    // The ID of the video to use
    id: 'qhLExhpXX0E',
    // The YT.Player config to use
    config: {
      start: 0
    },
    results: {
      // List of search results
      search: {
        items: []
      }
    }
  },

  actions: {
    /**
     * Initialize a YouTube Player
     * - Requires a #youtube-player
     * @param {Object} config {id: 'The youtube ID'}
     */
    setupPlayer (store, config = {}) {
      if (window.YT && window.YT.Player) {
        if (config.id) store.state.id = config.id
  
        // Look for #youtube-player and initialize it
        const $youtubePlayer = document.querySelector('#youtube-player')
        if ($youtubePlayer && $youtubePlayer.nodeName === 'DIV') {
          store.commit('set', ['youtube.player', new window.YT.Player('youtube-player', {
            videoId: store.state.id,
            playerVars: store.state.config
          })], {root: true})
        // Otherwise load a new one
        } else {
          store.state.player.loadVideoById(store.state.id)
        }
      } else {
        setTimeout(() => store.dispatch('setupPlayer', config), 100)
      }
    },

    /**
     * Setup the YouTube Data API
     */
    initDataAPI (store) {
      window.gapi.load('client', () => {
        window.gapi.client.init({
          apiKey: dataAPIKey
        }).then(() => {
          store.commit('set', ['youtube.isReady', true], {root: true})
        })  
      })
    },

    /**
     * Start/Stop
     * @TODO Refactor the conditional
     */
    play ({state}) {
      if (!state.player || !document.contains(state.player.a)) return
      state.player.playVideo()
    },
    pause ({state}) {
      if (!state.player || !document.contains(state.player.a)) return
      state.player.pauseVideo()
    },
    
    /**
     * Search YouTube
     * @param {String} config.query The search string
     */
    search (store, config = {}) {
      if (!trim(config.query)) return
      
      if (store.state.isReady) {
        store.commit('set', ['youtube.isLoading', true], {root: true})
        window.gapi.client.request({
          method: 'GET',
          path: '/youtube/v3/search',
          params: {
            // @TODO make this configurable
            maxResults: 10,
            part: 'snippet',
            q: config.query,
            type: 'video'
          }
        }).execute(response => {
          store.commit('set', ['youtube.isLoading', false], {root: true})
          store.commit('set', ['youtube.results.search', response], {root: true})
        })
      } else {
        setTimeout(() => {store.dispatch('search', config)}, 100)
      }
    }
  }
}