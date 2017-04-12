<template>
  <div class="app">
    <h1>Hello Vue!</h1>
    <input type="text"
      v-model.trim="input"
      @keyup.enter="add"
    >
    <ul>
      <li v-for="todo in zcong">
        <p>{{ todo.text }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        input: '',
        zcong: []
      }
    },
    methods: {
      add() {
        if (this.input) {
          this.$firebaseRefs.zcong.push({
            text: this.input
          })
          this.input = ''
        }
      }
    },
    mounted() {
      console.log(this.$bindAsObject, this.$firebaseRefs)
    }
  }
</script>
