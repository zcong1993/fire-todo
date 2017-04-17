<template>
  <div class="container">
      <mu-appbar title="vue todos">
      <template v-if="userinfo">
        <mu-icon-button icon="add_box" slot="left" @click="showAddNew"/>
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
     <mu-flexbox-item :grow="0" class="flex-demo" v-if="!todos.length">
        <mu-paper :zDepth="2">
        <mu-card>
          <mu-card-title title="样例"
          subTitle="2017-04-13 14:49"/>
          <mu-card-text class="card-content">
            散落在指尖的阳光，我试着轻轻抓住光影的踪迹，它却在眉宇间投下一片淡淡的阴影。
            调皮的阳光掀动了四月的心帘，温暖如约的歌声渐起。
            似乎在诉说着，我也可以在漆黑的角落里，找到阴影背后的阳光，
            找到阳光与阴影奏出和谐的旋律。我要用一颗敏感赤诚的心迎接每一缕滑过指尖的阳光！
          </mu-card-text>
          <mu-card-actions>
            <mu-flat-button label="EDIT" icon="edit"/>
            <mu-flat-button label="DELETE" icon="delete" secondary/>
          </mu-card-actions>
        </mu-card>
        </mu-paper>
      </mu-flexbox-item>
      <mu-flexbox-item :grow="0" class="flex-demo" v-for="(t, i) in todos" :key="'todo-' + i">
        <mu-paper :zDepth="2">
        <mu-card>
          <mu-card-title :title="t.title"
          :subTitle="t.createdAt"/>
          <mu-card-text class="card-content">
            {{ t.content }}
          </mu-card-text>
          <mu-card-actions>
            <mu-flat-button label="EDIT" icon="edit" @click="handleEditing(t)"/>
            <mu-flat-button label="DELETE" @click="showRemoveSubmit(t)"
            icon="delete" secondary />
          </mu-card-actions>
        </mu-card>
        </mu-paper>
      </mu-flexbox-item>
    </mu-flexbox>
    <Index :handleLogin="handleLogin" v-else/>
    <!--cards end-->
    <!--dialog-->
    <mu-dialog :open="showDialog" @close="closeAddNew" :title="isEdit ? 'Edit one todo' : 'Add new todo'">
      <mu-text-field label="标题" labelFloat fullWidth v-model.trim="title"/><br/>
      <mu-text-field hintText="内容" multiLine :rows="2" :rowsMax="6" fullWidth v-model.trim="content"/><br/>
      <mu-flat-button label="取消" slot="actions" secondary @click="closeAddNew"/>
      <mu-flat-button label="确定" slot="actions" primary @click="addNew"/>
    </mu-dialog>
    <!--dialog end-->
    <!--remove submit-->
    <mu-dialog :open="showSubmit" title="确认" @close="closeSubmit">
      确定要删除吗？无法恢复哦！
      <mu-flat-button slot="actions" @click="closeSubmit" secondary label="取消"/>
      <mu-flat-button slot="actions" primary @click="handleRemove" label="确定"/>
    </mu-dialog>
    <!--remove submit end-->
    <!--toast-->
    <mu-toast v-if="toast" :message="tips" @close="hideToast"/>
    <!--toast end-->
    <!--<pre>
      <p v-for="t in todos">{{ t }}</p>
    </pre>-->
  </div>
</template>

<script>
  import timestamp from 'time-stamp'
  import Index from './components/Index.vue'
  import firebase, { firebaseAuth, firebaseDb, baseRef } from './firebase'
  const provider = new firebase.auth.GoogleAuthProvider()

  export default {
    components: {
      Index
    },
    data() {
      return {
        userinfo: null,
        toast: false,
        tips: '',
        showDialog: false,
        showSubmit: false,
        title: '',
        content: '',
        todosRef: '',
        removeTodo: '',
        isEdit: false,
        editing: ''
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
          .catch(() => {
            this.tips = 'Oops. maybe error occurred!'
            this.showToast()
          })
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
      },
      addNew() {
        if (this.title && this.content) {
          if (this.todosRef) {
            const todo = {
              title: this.title,
              content: this.content
            }
            if (this.isEdit) {
              if (this.editing) {
                this.todosRef.child(this.editing['.key']).set(Object.assign({}, todo, { createdAt: this.editing.createdAt }))
              }
            } else {
              this.todosRef.push(Object.assign({}, todo, { createdAt: timestamp('YYYY-MM-DD HH:mm') }))
            }
          }
          this.closeAddNew()
        }
      },
      closeAddNew() {
        this.editing = this.title = this.content = ''
        this.isEdit = this.showDialog = false
      },
      handleRemove() {
        if (this.todosRef) {
          this.todosRef.child(this.removeTodo['.key']).remove()
          this.closeSubmit()
        }
      },
      showAddNew() {
        this.showDialog = true
      },
      closeSubmit() {
        this.showSubmit = false
        this.removeTodo = ''
      },
      showRemoveSubmit(todo) {
        this.removeTodo = todo
        this.showSubmit = true
      },
      handleEditing(todo) {
        this.isEdit = true
        this.editing = todo
        this.title = todo.title
        this.content = todo.content
        this.showDialog = true
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
        .catch(() => {
          this.tips = 'Oops. maybe error occurred!'
          this.showToast()
        })
      firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          this.islogin = true
          const detail = firebaseAuth.currentUser
          this.userinfo = detail.providerData[0]
          this.todosRef = firebaseDb.ref(baseRef + '/' + user.uid)
          this.$bindAsArray('todos', this.todosRef)
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
