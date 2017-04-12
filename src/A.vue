<template>
  <div class="app">
    <h1>Hello Vue!</h1>
    <input type="text"
      v-model.trim="input"
      @keyup.enter="add"
    >
    <ul>
      <li v-for="todo in todos">
        <p>{{ todo.text }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  import firebase from 'firebase'
  const db = firebase.initializeApp({
    databaseURL: 'https://first-2fc61.firebaseio.com'
  }).database()
  const ref = db.ref('zcong')

  export default {
    name: 'app',
    firebase: {
      todos: ref
    },
    data() {
      return {
        input: ''
      }
    },
    methods: {
      add() {
        if (this.input) {
          ref.push({
            text: this.input
          })
          this.input = ''
        }
      }
    }
  }
</script>
