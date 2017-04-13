import Vue from 'vue'
import VueFire from 'vuefire'
import MuseUI from 'muse-ui'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-teal.css'
import App from './App'

Vue.use(VueFire)
Vue.use(MuseUI)

new Vue({
  el: '#app',
  render: h => h(App)
})
