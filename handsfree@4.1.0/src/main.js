import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router'
import store from './plugins/vuex'
import './plugins/vuetify'
import './plugins/vue-lazyload'
import './handsfree'
import './assets/styles/main.styl'

// Highlight.js
// @TODO only load on required pages
import hljs from 'highlight.js'
require('highlight.js/styles/shades-of-purple.css')
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))

// Setup Vue
Vue.config.productionTip = false
window.App = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')