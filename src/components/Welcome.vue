<template>
  <div id="welcome">
    <el-row :gutter="20">
      <el-col :lg="6" :md="8" :sm="12" :xs="24">
        <el-card>
          <div class="content">
            <div class="left">
              <i class="iconfont icon-showpassword"></i>
            </div>
            <div class="right">
              <div>总访问量</div>
              <div>4025142</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="8" :sm="12" :xs="24">
        <el-card>
          <div class="content content2">
            <div class="left">
              <i class="iconfont icon-user"></i>
            </div>
            <div class="right">
              <div>昨日访问量</div>
              <div>4321</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="8" :sm="12" :xs="24">
        <el-card>
          <div class="content content3">
            <div class="left">
              <i class="iconfont icon-baobiao"></i>
            </div>
            <div class="right">
              <div>总成交量</div>
              <div>456456</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="8" :sm="12" :xs="24">
        <el-card>
          <div class="content">
            <div class="left">
              <i class="iconfont icon-3702mima"></i>
            </div>
            <div class="right">
              <div>昨日成交量</div>
              <div>121</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <template>
      <div class="box">
        <div class="item">
          <div class="subbox" v-if="isShow">
            <grid-layout
              :layout="layout"
              :col-num="12"
              :row-height="15"
              :is-draggable="true"
              :is-resizable="true"
              :is-mirrored="false"
              :vertical-compact="true"
              :margin="[10, 10]"
              :use-css-transforms="true"
            >
              <grid-item
                v-for="(item, i) in layout"
                class="ix"
                :key="'k' + i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                :style="{ backgroundColor: item.bgc, color: '#fff', 'text-align': 'center', 'line-height': `${item.h * 20}px` }"
                @dblclick.native.self="toLink(item.url)"
              >
                {{ item.name }}
              </grid-item>
            </grid-layout>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import Vue from 'vue'
Vue.prototype.$echarts = echarts
import VueGridLayout from 'vue-grid-layout'
const delay = (function() {
  let timer = 0
  return function(callback, ms) {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()

export default {
  data() {
    return {
      layout: null,
      isShow: false
    }
  },
  created() {
    this.$socket.registerCallBack('gridData', this.getData)
  },
  mounted() {
    this.$socket.send({
      action: 'getData',
      socketType: 'gridData',
      chartName: 'grid',
      value: ''
    })
  },
  watch: {
    layout: {
      handler(val) {
        this.fn()
      },
      // 这里是关键，代表递归监听 demo 的变化
      deep: true
    }
  },
  methods: {
    echartFun() {
      var myChart = echarts.init(document.querySelector('#chart'))

      this.option && myChart.setOption(this.option)
      window.onresize = myChart.resize
    },
    bgcStyle() {
      for (let i = 0; i < this.layout.length; i++) {
        this.layout[i].bgc = `rgba(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.round(Math.random() * 0.7) + 0.3})`
      }
    },
    getData(res) {
      this.layout = res
      this.isShow = true
      this.bgcStyle()
    },
    toLink(url) {
      if (url) {
        window.open(url, '_blank')
      }
    },
    setData() {
      this.$socket.send({
        action: 'setData',
        socketType: 'gridData',
        chartName: 'grid',
        value: this.layout
      })
    },
    // 使用防抖函数
    fn() {
      delay(() => {
        this.setData()
      }, 500)
    }
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  beforeDestroy() {
    this.setData()
  }
}
</script>
<style lang="css" scoped>
.iconfont {
  font-size: 48px;
  border-radius: 5px;
  padding: 10px;
}
.icon-showpassword {
  color: rgb(64, 201, 198);
}

.icon-user {
  color: rgb(54, 163, 247);
}

.icon-baobiao {
  color: rgb(244, 81, 108);
}

.icon-3702mima {
  color: rgb(64, 201, 198);
}

.content:hover .iconfont {
  color: rgb(255, 255, 255);
  background-color: rgb(64, 201, 198);
}

.content2:hover .iconfont {
  color: rgb(255, 255, 255);
  background-color: rgb(54, 163, 247);
}

.content3:hover .iconfont {
  color: rgb(255, 255, 255);
  background-color: rgb(244, 81, 108);
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.right div:first-child {
  font-size: 20px;
}

.right div:last-child {
  margin-top: 10px;
  font-size: 18px;
}

.vue-grid-item {
  border-radius: 10px;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
</style>
