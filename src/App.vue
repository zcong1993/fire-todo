<template>
  <div class="container">
      <mu-appbar title="vue todos">
      <template v-if="userinfo">
        <mu-icon-button slot="right">
          <mu-avatar :src="userinfo.photoURL" :size="30" :iconSize="20"/>
        </mu-icon-button>
        <mu-icon-menu
          icon="expand_more"
          slot="right"
        >
          <mu-menu-item :title="userinfo.displayName" disabled/>
          <mu-divider />
          <mu-menu-item title="Sign out" @click="handleLogout"/>
        </mu-icon-menu>
      </template>
      <template v-else>
        <mu-flat-button label="Sign in" slot="right" @click="handleLogin"/>
      </template>
    </mu-appbar>
    <pre>
      <h4>{{ userinfo && userinfo }}</h4>
    </pre>
    <mu-toast v-if="toast" :message="tips" @close="hideToast"/>
  </div>
</template>

<script>
  import firebase, { firebaseAuth } from './firebase'
  const provider = new firebase.auth.GoogleAuthProvider()

  export default {
    data() {
      return {
        userinfo: null,
        toast: false,
        tips: ''
      }
    },
    methods: {
      handleLogin() {
        if (!this.userinfo) {
          firebaseAuth.signInWithRedirect(provider)
        }
      },
      handleLogout() {
        firebaseAuth.signOut()
          .then(() => {
            this.userinfo = null
            this.tips = 'logout success!'
            this.showToast()
          })
          .catch(e => console.log(e))
      },
      showToast() {
        this.toast = true
        if (this.toastTimer) clearTimeout(this.toastTimer)
        this.toastTimer = setTimeout(() => {
          this.toast = false
        }, 2000)
      },
      hideToast() {
        this.toast = false
        this.tips = ''
        if (this.toastTimer) clearTimeout(this.toastTimer)
      }
    },
    mounted() {
      firebaseAuth.getRedirectResult()
        .then(res => {
          if (res.user) {
            this.tips = 'login success!'
            this.showToast()
          }
        })
        .catch(e => console.log(e))
      firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          this.islogin = true
          const detail = firebaseAuth.currentUser
          this.userinfo = detail.providerData[0]
        }
      })
    }
  }
</script>

<style>
html, body, #app, .container {
  height: 100%;
}

.container {
    margin-right: auto;
    margin-left: auto;
    background-color: #eee;
}

@media (min-width: 768px) {
    .container {
        padding-right: 5px;
        padding-left: 5px;
        width: 750px;
    }
}

@media (min-width: 992px) {
    .container {
        width: 970px;
    }
}

@media (min-width: 1200px) {
    .container {
        width: 1170px;
    }
}
</style>
