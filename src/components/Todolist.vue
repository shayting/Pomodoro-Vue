<template>
<div id="todoList">
  <ul v-if="!takeABreak" class="list-unstyled">
    <div v-if="filterUnfinished.length > 0">
      <li class="listItem mb-2 w-100 d-flex align-items-center justify-content-between" v-for="item in filterUnfinished" :key="item.id">
        <div class="todoCheckBox rounded-circle" @click="changeTodoState(item.id)"></div>
        <div class="todoText mr-auto">{{ item.text }}</div>
      </li>
    </div>
    <div v-else>
      <li class="listItem w-100">無待辦事項</li>
    </div>
  </ul>
  <div id="breakText" v-else>
    <h2>休息，</h2>
    <p>是為了下一次的努力。</p>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    changeTodoState (id) {
      this.$store.commit('changeTodoState', id)
    }
  },
  computed: {
    filterUnfinished () {
      const filterFalse = this.$store.state.todos.filter(todo => todo.done === false)
      return filterFalse
    },
    takeABreak () {
      const breakStatus = this.$store.state.breakStatus
      return breakStatus
    }
  }
}
</script>
