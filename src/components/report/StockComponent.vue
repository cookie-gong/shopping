<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'StockComponent',
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      timerId: null,
    }
  },
  created() {
    this.$socket.registerCallBack('stockData', this.getData)
  },
  mounted() {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
      value: '',
    })
    // this.getData();
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
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
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
    this.$socket.unRegisterCallBack('stockData')
    this.chartInstance.dispose()
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      const initOption = {
        title: {
          text: '📰 库存和销量分析',
          left: 20,
          top: 20,
        },
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })

      this.chartInstance.on('mouseout', () => {
        this.stratInterval()
      })
    },
    getData(res) {
      // const { data: res } = await this.$http.get("stock");
      this.allData = res
      this.updateChart()
    },
    updateChart() {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%'],
      ]

      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF'],
      ]

      const start = this.currentIndex * 5
      const showData = this.allData.slice(start, start + 5)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          center: centerArr[index],
          // 关闭鼠标移入到饼图时的动画效果
          emphasis: {
            scale: false,
          },
          labelLine: {
            show: false,
          },
          label: {
            position: 'center',
            color: colorArr[index][0],
          },
          data: [
            {
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1],
                  },
                ]),
              },
              tooltip: {
                formatter: `${item.name} <br/>销量：{c} <br/>占比：{d}%`,
              },
            },
            {
              name: item.name + '\n\n' + item.sales,
              value: item.stock,
              itemStyle: {
                color: '#333843',
              },
              tooltip: {
                formatter: `${item.name} <br/>库存：{c} <br>占比：{d}%`,
              },
            },
          ],
        }
      })
      const dataOption = {
        tooltip: {
          // 这里为item 可以为内部的数据开启 单独的 tooltip
          trigger: 'item',
        },
        series: seriesArr,
      }
      this.chartInstance.setOption(dataOption)

      this.stratInterval()
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6
      const innerRadius = titleFontSize * 2.8
      const outterRadius = innerRadius * 1.2
      const adapterOption = {
        title: {
          fontSize: titleFontSize,
        },
        series: [
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2,
            },
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2,
            },
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2,
            },
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2,
            },
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2,
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    stratInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart()
      }, 5000)
    },
  },
}
</script>
<style lang="css" scoped></style>
