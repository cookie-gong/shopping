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
          <div class="subbox">
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
              <grid-item v-for="(item, i) in layout" class="ix" :key="'k' + i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :style="{ backgroundColor: item.bgc,color:'#fff','text-align':'center','line-height':`${item.h*20}px`}">
                {{ item.name }}
              </grid-item>
            </grid-layout>
          </div>
        </div>
      </div>
    </template>

    <!-- echarts表格，不需要了，好丑 -->
    <el-row v-if="false">
      <el-col>
        <el-card>
          <div id="chart" style="height: 500px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import Vue from 'vue'
Vue.prototype.$echarts = echarts
import VueGridLayout from 'vue-grid-layout'
export default {
  data() {
    return {
      option: {
        title: {
          text: '用户访问量',
          fontSize: 30,
          color: 'rgb(64, 201, 198)'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '0%',
          data: ['2020年访问量', '2021年访问量'],
          color: '#000',
          fontSize: '20'
        },

        grid: {
          left: '10',
          top: '80',
          right: '10',
          bottom: '10',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            // x轴更换数据
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
            axisLabel: {
              color: '#000',
              fontSize: 20
            },
            // x轴线的颜色为   rgba(255,255,255,.2)
            axisLine: {
              lineStyle: {
                color: '#000'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: '#000'
              }
            },
            axisLabel: {
              color: '#000',
              fontSize: 20
            },
            // 修改分割线的颜色
            splitLine: {
              lineStyle: {
                color: '#ccc'
              }
            }
          }
        ],
        series: [
          {
            name: '2020年访问量',
            type: 'line',
            smooth: true,
            // 单独修改当前线条的样式
            lineStyle: {
              color: '#0184d5',
              width: '2'
            },
            // 填充颜色设置
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(1, 132, 213, 0.4)' // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(1, 132, 213, 0.1)' // 渐变线的结束颜色
                  }
                ],
                false
              ),
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            // 设置拐点
            symbol: 'circle',
            // 拐点大小
            symbolSize: 8,
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: '#0184d5',
              borderColor: 'rgba(221, 220, 107, .1)',
              borderWidth: 12
            },
            data: [555555, 234567, 345678, 123456, 245321, 345634, 243545, 234565, 234342, 121112, 544332, 634232]
          },
          {
            name: '2021年访问量',
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#00d887',
              width: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.1)'
                  }
                ],
                false
              ),
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            // 设置拐点 小圆点
            symbol: 'circle',
            // 拐点大小
            symbolSize: 5,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: '#00d887',
              borderColor: 'rgba(221, 220, 107, .1)',
              borderWidth: 12
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            data: [343533, 400034, 310893, 387864, 356456, 412312]
          }
        ]
      },
      layout: [
        { x: 0, y: 0, w: 2, h: 2, i: '0', name: 'HTML' },
        { x: 2, y: 0, w: 2, h: 4, i: '1' , name: 'CSS'},
        { x: 4, y: 0, w: 2, h: 5, i: '2' , name: 'JavaScript'},
        { x: 6, y: 0, w: 2, h: 3, i: '3' , name: 'TypeScript'},
        { x: 8, y: 0, w: 2, h: 3, i: '4' , name: 'vue'},
        { x: 10, y: 0, w: 2, h: 3, i: '5' , name: 'node'},
        { x: 0, y: 5, w: 2, h: 5, i: '6' , name: 'ES6'},
        { x: 2, y: 5, w: 2, h: 5, i: '7' , name: 'hexo'},
        { x: 4, y: 5, w: 2, h: 5, i: '8' , name: 'GIT'},
        { x: 6, y: 4, w: 2, h: 4, i: '9', name: 'npm' },
        { x: 8, y: 4, w: 2, h: 4, i: '10', name: 'JSON' },
        { x: 10, y: 4, w: 2, h: 4, i: '11' , name: 'React'},
        { x: 0, y: 10, w: 2, h: 5, i: '12', name: 'Angular' },
        { x: 2, y: 10, w: 2, h: 5, i: '13' , name: 'webpack'},
        { x: 4, y: 8, w: 2, h: 4, i: '14' , name: '小程序'},
        { x: 6, y: 8, w: 2, h: 4, i: '15', name: '移动端' },
        { x: 8, y: 10, w: 2, h: 5, i: '16', name: 'LESS' },
        { x: 10, y: 4, w: 2, h: 2, i: '17', name: 'SASS' },
        { x: 0, y: 9, w: 2, h: 3, i: '18', name: 'echarts' },
        { x: 2, y: 6, w: 2, h: 2, i: '19', name: 'axios' }
      ]
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
    }
  },
  mounted() {
    //this.echartFun()
    this.bgcStyle()
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
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
</style>
