<template>
  <div class="container">
      <mu-appbar title="vue todos">
      <template v-if="userinfo">
        <mu-icon-button icon="add_box" slot="left"/>
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
    <!--cards-->
    <mu-flexbox wrap="wrap" justify="center" class="content" v-if="userinfo">
      <mu-flexbox-item :grow="0" class="flex-demo">
        <mu-paper :zDepth="2">
        <mu-card>
          <mu-card-title title="Content Title" subTitle="Content Title"/>
          <mu-card-text class="card-content">
            散落在指尖的阳光，我试着轻轻抓住光影的踪迹，它却在眉宇间投下一片淡淡的阴影。
            调皮的阳光掀动了四月的心帘，温暖如约的歌声渐起。
            似乎在诉说着，我也可以在漆黑的角落里，找到阴影背后的阳光，
            找到阳光与阴影奏出和谐的旋律。我要用一颗敏感赤诚的心迎接每一缕滑过指尖的阳光！
          </mu-card-text>
          <mu-card-actions>
            <mu-flat-button label="Action 1"/>
            <mu-flat-button label="Action 2"/>
          </mu-card-actions>
        </mu-card>
        </mu-paper>
      </mu-flexbox-item>
      <mu-flexbox-item :grow="0" class="flex-demo">
        <mu-paper :zDepth="2">
        <mu-card>
          <mu-card-title title="Content Title" subTitle="Content Title"/>
          <mu-card-text class="card-content">
            散落在指尖的阳光，我试着轻轻抓住光影的踪迹，
          </mu-card-text>
          <mu-card-actions>
            <mu-flat-button label="Action 1"/>
            <mu-flat-button label="Action 2"/>
          </mu-card-actions>
        </mu-card>
        </mu-paper>
      </mu-flexbox-item>
    </mu-flexbox>
    <Index :handleLogin="handleLogin" v-else/>
    <!--cards ends-->
    <!--<pre>
      <h4>{{ userinfo && userinfo }}</h4>
    </pre>-->
    <mu-toast v-if="toast" :message="tips" @close="hideToast"/>
  </div>
</template>

<script>
  import Index from './components/Index.vue'
  import firebase, { firebaseAuth } from './firebase'
  const provider = new firebase.auth.GoogleAuthProvider()

  export default {
    components: {
      Index
    },
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

.content {
  margin-top: 10px;
}

.flex-demo {
  width: 96%!important;
  margin-left: 0!important;
  background-color: #e0e0e0;
  text-align: center;
  line-height: 32px;
  margin-bottom: 5px!important;
}

.card-content {
  height: 200px;
  margin-bottom: 32px;
  overflow: hidden;
}

.container {
    margin-right: auto;
    margin-left: auto;
    /*background-color: #eee;*/
}

@media (min-width: 768px) {
    .container {
        padding-right: 5px;
        padding-left: 5px;
        width: 750px;
    }
    .flex-demo {
      width: 31%!important;
      margin-bottom: 20px!important;
      margin-left: 8px!important;
    }
    .content {
      margin-top: 30px;
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
