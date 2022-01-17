<template>
  <div id="countDown" class="xyCenter flex-column">
    <div class="countdown-time text-white text-center">
      {{ timeText }}
    </div>
    <div class="countdown-btns xyCenter">
      <b-button v-if="muted === false" class="rounded-circle xyCenter" id="alarm" @click="toggleAlarm"><img src="@/assets/images/icon-bell.svg"></b-button>
      <b-button v-else class="rounded-circle xyCenter" id="muted" @click="toggleAlarm"><img src="@/assets/images/icon-muted.svg"></b-button>
      <div v-if="!breakStatus">
        <b-button id="play" @click="play" v-if="status !== 1" class="rounded-circle xyCenter"><img src="@/assets/images/icon-play--orange.svg"></b-button>
        <b-button id="pause" @click="pause" v-else class="rounded-circle xyCenter"><img src="@/assets/images/icon-pause--orange.svg"></b-button>
      </div>
      <div v-else>
        <b-button id="breakPlay" v-if="status !== 1" class="rounded-circle xyCenter" @click="breakPlay"><img src="@/assets/images/icon-play--green.svg"></b-button>
        <b-button id="breakPause" v-else class="rounded-circle xyCenter" @click="pause"><img src="@/assets/images/icon-pause--green.svg"></b-button>
      </div>
      <b-button id="stop" @click="stop" class="rounded-circle xyCenter" ><img src="@/assets/images/icon-delete.svg"></b-button>
    </div>
  </div>
</template>

<script>
const alarm = new Audio()
alarm.src = require('@/assets/audio/alarm.mp3')
export default {
  data () {
    return {
      // 0 停止
      // 1 倒數中
      // 2 暫停
      status: 0,
      timer: 0,
      muted: false
    }
  },
  computed: {
    todos () {
      return this.$store.state.todos
    },
    timeleft () {
      return this.$store.state.timeleft
    },
    timeText () {
      const m = Math.floor(this.timeleft / 60).toString().padStart(2, '0')
      const s = Math.floor(this.timeleft % 60).toString().padStart(2, '0')
      return `${m} : ${s}`
    },
    breakStatus () {
      return this.$store.state.breakStatus
    }
  },
  methods: {
    play () {
      const filterUndone = this.todos.filter(todo => {
        return !todo.done
      })
      if ((this.status === 0 && filterUndone.length > 0) || this.status === 2) {
        this.status = 1
        this.timer = setInterval(() => {
          this.$store.commit('countdown')
          if (this.timeleft <= -1) {
            this.finish()
          }
        }, 1000)
      }
    },
    pause () {
      this.status = 2
      clearInterval(this.timer)
    },
    finish () {
      clearInterval(this.timer)
      this.status = 0
      this.$store.commit('finish')
      alarm.play()
    },
    stop () {
      clearInterval(this.timer)
      this.$store.commit('reset')
      this.status = 0
    },
    breakPlay () {
      if (this.status === 0 || this.status === 2) {
        this.status = 1
        this.timer = setInterval(() => {
          this.$store.commit('countdown')
          if (this.timeleft <= -1) {
            this.breakFinish()
          }
        }, 1000)
      }
    },
    breakFinish () {
      clearInterval(this.timer)
      this.status = 0
      alarm.play()
      this.$store.commit('breakFinish')
    },
    toggleAlarm () {
      this.muted = !this.muted
      if (this.muted) {
        alarm.muted = true
      } else {
        alarm.muted = false
      }
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>
