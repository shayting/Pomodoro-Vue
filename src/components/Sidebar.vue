<template>
    <div id="sidebar">
      <div class="menuBTN vh-100 d-flex flex-column justify-content-center">
        <b-button id="toggleList" v-b-toggle.sidebar-list class="border-0">
          <img src="~@/assets/images/icon-list.svg">
        </b-button>
        <b-button id="toggleAnalysis" v-b-toggle.sidebar-analysis class="border-0">
          <img src="~@/assets/images/icon-analysis.svg">
        </b-button>
      </div>
      <b-sidebar id="sidebar-list" shadow no-header v-model="listOpened">
        <div class="list-header d-flex align-items-center justify-content-between">
          <h2 class="">待辦事項</h2>
          <div class="todoState">
            <span id="showFinished" class="mx-2" @click="showFinished">已完成</span>
            <span id="showUnfinished" class="mx-2 isActive" @click="showUnfinished">未完成</span>
          </div>
        </div>
        <div class="addItem w-100 px-3 rounded-pill d-flex align-items-center justify-content-between mb-5">
          <input type="text" class="w-75 border-0" placeholder="新增待辦事項" v-model="newTodo" @keydown.enter="addTodo">
          <button id="addBtn" type="button" @click="addTodo">
            <b-icon-plus font-scale="2"></b-icon-plus>
          </button>
        </div>
        <div class="list">
          <!-- todoList -->
          <ul class="w-100 list-unstyled">
            <!-- default (unfished) -->
            <div v-if="!filterDone">
              <li class="listItem border-top mb-2 w-100 d-flex align-items-center justify-content-between" v-for="(item) in filterUnfinished" :key="item.id">
                <div class="todoCheckBox rounded-circle" @click="changeTodoState(item.id)"></div>
                <div class="todoText mr-auto">
                  <div v-if="!item.edit">
                    {{ item.text }}
                  </div>
                  <div v-else>
                    <!-- 編輯欄位 -->
                    <!-- $event 是input事件物件-->
                    <input id="editInput" type="text" :value="item.text" @input="updateText(item.id, $event)" @keydown.enter="updateEdit(item.id)">
                  </div>
                </div>
                <div class="todoBtn d-flex">
                  <div v-if="!item.edit" class="edit" @click="changeEditState(item.id)">
                    <img src="~@/assets/images/icon-edit.svg" alt="edit">
                  </div>
                  <!-- 編輯確認按鈕 -->
                  <div id="updateEdit" v-else class="edit xyCenter" @click="updateEdit(item.id)">
                    <b-icon-check font-scale="1.5"></b-icon-check>
                  </div>
                  <div v-if="!item.edit" class="delete" @click="delTodo(item.id)">
                    <img src="~@/assets/images/icon-delete.svg" alt="delete">
                  </div>
                  <div id="endEdit" v-else class="delete xyCenter" @click="changeEditState(item.id)">
                    <img src="~@/assets/images/icon-delete.svg" alt="delete">
                  </div>
                </div>
              </li>
            </div>
            <!-- finished -->
            <div v-else>
              <li class="listItem border-top mb-2 w-100 d-flex align-items-center justify-content-between" v-for="item in filterFinished" :key="item.id">
                <b-icon-check-circle font-scale="1.5" @click="changeTodoState(item.id)"></b-icon-check-circle>
                <div class="todoText mr-auto text-muted"><del>{{ item.text }}</del></div>
                <div class="todoBtn d-flex">
                  <div class="delete" @click="delTodo(item.id)">
                    <img src="~@/assets/images/icon-delete.svg" alt="delete">
                  </div>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </b-sidebar>
      <b-sidebar id="sidebar-analysis" shadow no-header v-model="analysisOpend">
          <h2>專注度分析</h2>
          <div class="todoAnalysis d-flex w-100 justify-content-between">
            <div class="dayAnalysis">
              <h6>今日</h6>
              <span>{{ today }}</span>
              <div class="analysisBox w-100 rounded d-flex justify-content-between">
                <div class="analysis-todo-count w-50">
                  <div class="text-center todoCount">9</div>
                  <h5 class="text-center">待辦事項</h5>
                </div>
                <div class="analysis-todo-finished w-50">
                  <div class="text-center todoFinished">7</div>
                  <h5 class="text-center">已完成</h5>
                </div>
              </div>
            </div>
            <div class="weekAnalysis">
              <h6>本週</h6>
              <div class="analysisBox w-100 rounded d-flex justify-content-between">
                <div class="analysis-todo-count w-50">
                  <div class="text-center todoCount">54</div>
                  <h5 class="text-center">待辦事項</h5>
                </div>
                <div class="analysis-todo-finished w-50">
                  <div class="text-center todoFinished">48</div>
                  <h5 class="text-center">已完成</h5>
                </div>
              </div>
            </div>
          </div>
          <Barchart id="chart"></Barchart>
      </b-sidebar>
    </div>
  </template>

<script>
import Barchart from '@/components/Barchart.vue'

export default {
  components: { Barchart },
  data () {
    return {
      newTodo: '',
      filterDone: false,
      listOpened: false,
      analysisOpend: false
    }
  },
  methods: {
    updateText (id, event) {
      this.$store.commit('updateText', { id, value: event.target.value })
    },
    updateEdit (id) {
      this.$store.commit('updateEdit', id)
    },
    addTodo () {
      if (this.newTodo.length > 0) {
        this.$store.commit('addTodo', this.newTodo)
        this.newTodo = ''
      }
    },
    delTodo (id) {
      this.$store.commit('delTodo', id)
      console.log(id)
    },
    changeTodoState (id) {
      this.$store.commit('changeTodoState', id)
    },
    showUnfinished () {
      const showFinished = document.querySelector('#showFinished')
      const showUnfinished = document.querySelector('#showUnfinished')
      this.filterDone = false
      showUnfinished.classList.add('isActive')
      showFinished.classList.remove('isActive')
    },
    showFinished () {
      const showFinished = document.querySelector('#showFinished')
      const showUnfinished = document.querySelector('#showUnfinished')
      this.filterDone = true
      showFinished.classList.add('isActive')
      showUnfinished.classList.remove('isActive')
    },
    changeEditState (id) {
      this.$store.commit('changeEditState', id)
    }
  },
  computed: {
    today () {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year} / ${month} / ${day}`
    },
    todos () {
      return this.$store.state.todos
    },
    filterUnfinished () {
      const filterFalse = this.$store.state.todos.filter(todo => todo.done === false)
      return filterFalse
    },
    filterFinished () {
      const filterTrue = this.$store.state.todos.filter(todo => todo.done === true)
      return filterTrue
    }
  },
  watch: {
    listOpened () {
      if (this.listOpened) {
        this.analysisOpend = false
        this.$emit('sidebarOpen', true)
      } else if (!this.listOpened && !this.analysisOpend) {
        this.$emit('sidebarOpen', false)
      }
    },
    analysisOpend () {
      if (this.analysisOpend) {
        this.listOpened = false
        this.$emit('sidebarOpen', true)
      } else if (!this.listOpened && !this.analysisOpend) {
        this.$emit('sidebarOpen', false)
      }
    }
  }
}
</script>
