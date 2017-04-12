<template>
  <div class="auth">
    <h2>auth</h2>
    <div class="userinfo" v-if="islogin">
      <div class="user" v-for="user in userinfos">
        <h3>{{ user.displayName }}</h3>
        <img :src="user.photoURL">
      </div>
    </div>
    <button @click="handleLogin">login</button>
    <button @click="handleLogout">logout</button>
  </div>
</template>

<script>
  import firebase, { firebaseAuth } from './firebase/firebase'
  const provider = new firebase.auth.GoogleAuthProvider()
  export default {
    data() {
      return {
        islogin: false,
        userinfos: []
      }
    },
    methods: {
      handleLogin() {
        if (this.islogin) {
          return
        }
        firebaseAuth.signInWithRedirect(provider)
      },
      handleLogout() {
        firebaseAuth.signOut()
          .then(() => {
            this.islogin = false
            this.userinfos = []
          })
          .catch(e => console.log(e))
      }
    },
    mounted() {
      firebaseAuth.getRedirectResult()
        .then(res => {
          console.log(res.user)
        })
        .catch(e => console.log(e))
      firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          this.islogin = true
          const detail = firebaseAuth.currentUser
          detail.providerData.forEach(profile => {
            console.log('Sign-in provider: ' + profile.providerId)
            console.log('  Provider-specific UID: ' + profile.uid)
            console.log('  Name: ' + profile.displayName)
            console.log('  Email:  ' + profile.email)
            console.log('  Photo URL: ' + profile.photoURL)
            this.userinfos.push(profile)
          })
        }
      })
    }
  }
</script>
