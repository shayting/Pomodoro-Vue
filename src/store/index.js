import Vue from 'vue'
import Vuex from 'vuex'
// 將vuex存在localstorage
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

// 引用.env檔
const time = parseInt(process.env.VUE_APP_TIME)
const timebreak = parseInt(process.env.VUE_APP_TIMEBREAK)

export default new Vuex.Store({
  state: {
    todos: [],
    timeleft: time,
    breakStatus: false,
    listOpened: false,
    analysisOpened: false
  },
  mutations: {
    addTodo (state, data) {
      state.todos.push(
        {
          id: Date.now(),
          done: false,
          text: data,
          edit: false,
          editModel: data
        }
      )
    },
    delTodo (state, data) {
      const idx = state.todos.findIndex(todo => { return todo.id === data })
      state.todos.splice(idx, 1)
    },
    changeTodoState (state, data) {
      const idx = state.todos.findIndex(todo => { return todo.id === data })
      state.todos[idx].done = !state.todos[idx].done
    },
    changeEditState (state, data) {
      const idx = state.todos.findIndex(todo => { return todo.id === data })
      state.todos[idx].edit = !state.todos[idx].edit
    },
    countdown (state) {
      state.timeleft--
    },
    finish (state) {
      // 將第一個未完成的狀態改完已完成
      const filterUndone = state.todos.filter(todo => {
        return !todo.done
      })
      const firstId = filterUndone[0].id
      const idx = state.todos.findIndex(todo => { return todo.id === firstId })
      state.todos[idx].done = true
      if (filterUndone.length > 1) {
        state.breakStatus = true
        state.timeleft = timebreak
        console.log(filterUndone)
      } else {
        state.breakStatus = false
        console.log(filterUndone)
        state.timeleft = time
      }
    },
    reset (state) {
      state.timeleft = state.breakStatus ? timebreak : time
    },
    breakFinish (state) {
      state.timeleft = time
      state.breakStatus = false
    },
    updateText (state, data) {
      const editIdx = state.todos.findIndex(todo => { return todo.id === data.id })
      state.todos[editIdx].editModel = data.value
    },
    updateEdit (state, id) {
      const editIdx = state.todos.findIndex(todo => { return todo.id === id })
      state.todos[editIdx].text = state.todos[editIdx].editModel
      state.todos[editIdx].edit = false
    }
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({ key: 'pomodoro' })
  ]
})
