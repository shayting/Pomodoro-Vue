<template>
  <div id="app" class="vh-100 vw-100 position-relative">
    <Sidebar @sidebarOpen="update"></Sidebar>
    <div v-if="!takeABreak" id="main" class="vh-100">
      <div id="background" :class="{moveRight:open}"></div>
      <b-container fluid :class="{push:open}">
        <b-row>
          <b-col cols="12" :lg="open ? 12:6">
            <Countdown></Countdown>
          </b-col>
          <b-col cols="12" lg="6" :class="{hide:open}">
            <Todolist></Todolist>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div v-else id="mainBreak" class="vh-100">
      <div id="backgroundBreak" :class="{moveRight:open}"></div>
      <b-container fluid :class="{push:open}">
      <b-row>
        <b-col cols="12" :lg="open ? 12:6">
          <Countdown></Countdown>
        </b-col>
        <b-col cols="12" lg="6" :class="{hide:open}">
          <Todolist></Todolist>
        </b-col>
      </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
// 引用元件
import Sidebar from '@/components/Sidebar.vue'
import Countdown from './components/Countdown.vue'
import Todolist from './components/Todolist.vue'
export default {
  name: 'App',
  // 引用註冊後的元件
  components: {
    Sidebar,
    Countdown,
    Todolist
  },
  data () {
    return {
      open: false
    }
  },
  computed: {
    takeABreak () {
      const breakStatus = this.$store.state.breakStatus
      return breakStatus
    }
  },
  methods: {
    update (value) {
      this.open = value
    }
  }
}
</script>
