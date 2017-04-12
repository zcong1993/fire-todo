import Vue from 'vue'
import VueFire from 'vuefire'
// import firebase from 'firebase'
import App from './Auth'

Vue.use(VueFire)

new Vue({
  el: '#app',
  render: h => h(App)
})
