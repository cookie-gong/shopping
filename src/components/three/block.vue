<template>
  <div id="block">
    <div class="box green"></div>
    <div class="box grey"></div>
    <div class="box orange"></div>
    <div class="box green"></div>
    <div class="box grey"></div>
    <div class="box orange"></div>
    <div class="box green"></div>
    <div class="box grey"></div>
    <div class="box orange"></div>
  </div>
</template>
<script>
import { TweenMax } from './TweenMax.js'
export default {
  data() {
    return {
      timer: null,
    }
  },
  methods: {
    init() {
      TweenMax.staggerTo('.box', 1, { rotation: 360, y: 50 }, 0.5)
      let num = 0
      this.timer = setInterval(function () {
        if (num % 2 === 1) {
          TweenMax.staggerTo('.box', 1, { rotation: 360, y: 50 }, 0.5)
        } else {
          TweenMax.staggerTo('.box', 1, { rotation: 0, y: 0 }, 0.5)
        }
        num += 1
      }, 5000)
    },
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>
<style lang="css" scoped>
#block {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}
.box {
  width: 50px;
  height: 50px;
  position: relative;
  border-radius: 6px;
  margin-top: 4px;
  display: block;
  margin-right: 10px;
}

.green {
  background-color: #6fb936;
}

.orange {
  background-color: #f38630;
}
.grey {
  background-color: #989898;
}
</style>