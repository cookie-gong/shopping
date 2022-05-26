<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="el-icon-arrow-left" @click="toLeft" :style="comStyle"></span>
    <span class="el-icon-arrow-right" @click="toRight" :style="comStyle"></span>
    <span class="cat-name" :style="comStyle">{{ cateName }}</span>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
  name: 'HotComponent',
  data() {
    return {
      chartInstance: null,
      allData: null,
      // 当前所展示出的以及分类数据
      currentIndex: 0,
      titleFontSize: null,
    }
  },
  created() {
    this.$socket.registerCallBack('hotData', this.getData)
  },
  mounted() {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hotproduct',
      value: '',
    })
    // this.getData();
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  computed: {
    cateName() {
      if (!this.allData) {
        return ''
      }
      return this.allData[this.currentIndex].name
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor,
      }
    },
    ...mapState(['theme']),
  },
  watch: {
    theme() {
      // 销毁当前图表
      this.chartInstance.dispose()
      // 重新以最新的主题名称初始化图表对象
      this.initChart()
      // 完成屏幕的适配
      this.screenAdapter()
      // 更新图表的展示
      this.updateChart()
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('hotData')
    this.chartInstance.dispose()
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      const initOption = {
        title: {
          text: '🎁 热销商品占比',
          left: 20,
          top: 20,
        },
        legend: {
          top: '15%',
          icon: 'circle',
        },
        tooltip: {
          show: true,
          formatter: arg => {
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach(item => {
              retStr += `${item.name}: ${parseInt((item.value / total) * 100) + '%'}<br/>`
            })
            return retStr
          },
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)
    },
    async getData(res) {
      // const { data: res } = await this.$http.get("hotproduct");
      this.allData = res

      this.updateChart()
    },
    updateChart() {
      const legendData = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children,
        }
      })
      const dataOption = {
        legend: {
          data: legendData,
        },
        series: [
          {
            data: seriesData,
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          fontSize: this.titleFontSize,
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%'],
          },
        ],
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          fontSize: this.titleFontSize / 1.2,
        },
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    toLeft() {
      this.currentIndex--
      if (this.currentIndex < 0) this.currentIndex = this.allData.length - 1
      this.updateChart()
    },
    toRight() {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) this.currentIndex = 0
      this.updateChart()
    },
  },
}
</script>
<style lang="css" scoped>
.el-icon-arrow-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #fff;
}
.el-icon-arrow-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #fff;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20%;
  color: #fff;
}
</style>
