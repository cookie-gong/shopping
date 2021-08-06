<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 一共有多少页
      timerId: null,
    }
  },
  created() {
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  mounted() {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: '',
    })
    // this.getData();
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    // 在组件销毁的时候取消监听器
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
    this.chartInstance.dispose()
  },
  methods: {
    // 初始化echarts实例化对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)
      // 对图表初始化配置的控制
      const initOption = {
        title: {
          text: '🛒 商家销售量统计',
          left: 20,
          top: 20,
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443',
            },
          },
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              color: 'white',
            },
            itemStyle: {
              // 指明颜色渐变的方向
              // 指明不同百分比之下颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#5052EE' },
                { offset: 1, color: '#AB6EE5' },
              ]),
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)

      // 对图表对象进行鼠标事件的监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器的数据
    async getData(res) {
      // const { data: res } = await this.$http.get("seller");
      this.allData = res
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updateChart()
      this.startInterval()
    },
    // 更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map(item => {
        return item.name
      })

      const sellerValue = showData.map(item => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValue,
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          fontSize: titleFontSize,
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
  },
  computed: {
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
}
</script>
<style lang="css" scoped>
</style>