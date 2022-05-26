<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span class="title-text" @click="showChoice = !showChoice">{{ '📈 ' + showTitle }}</span>
      <span class="el-icon-arrow-down" @click="showChoice = !showChoice" :style="comStyle"></span>
      <div class="select-com" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectType" :key="item.key" @click="handleSelect(item.key)" :style="comStyle">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getThemeValue } from '../../utils/theme_utils'
export default {
  name: 'TrendComponent',
  data() {
    return {
      chartInstance: null,
      allData: null, // 从服务器中获取到的所有数据
      showChoice: false,
      choiceType: 'map', // 显示的数据的类型
      titleFontSize: 0, // 指明标题的字体大小
    }
  },
  created() {
    this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted() {
    this.initChart()
    // 发送数据给服务器，告诉服务器，我现在需要数据
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: '',
    })
    // this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('trendData')
    this.chartInstance.dispose()
  },
  computed: {
    selectType() {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle() {
      if (!this.allData) {
        return []
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 设置给标题的样式
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor,
      }
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize * 1.7 + 'px',
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
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme)
      const initOption = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
        },
        grid: {
          top: '35%',
          left: '3%',
          right: '4%',
          bottom: '4%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          // 鼠标放上去十字交叉指示器
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          left: 'center',
          top: '18%',
          icon: 'circle',
        },
      }
      this.chartInstance.setOption(initOption)
    },
    // res 就是服务端发送给客户端的图表数据
    async getData(res) {
      // const {data:res} = await this.$http.get('trend')
      this.allData = res
      // 对allData进行赋值
      this.updateChart()
    },
    updateChart() {
      // 半透明的颜色值
      const colorArr1 = ['rgba(11,168,44,.5)', 'rgba(44,110,255,.5)', 'rgba(22,242,217,.5)', 'rgba(254,33,30,.5)', 'rgba(250,105,0,.5)']
      // 全透明的颜色值
      const colorArr2 = ['rgba(11,168,44,0)', 'rgba(44,110,255,0)', 'rgba(22,242,217,0)', 'rgba(254,33,30,0)', 'rgba(250,105,0,0)']
      // 处理数据
      // 类目轴的数据
      const timeArr = this.allData.common.month
      // y轴的数据 series下的数据
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          name: item.name,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { color: colorArr1[index], offset: 0 },
              { color: colorArr2[index], offset: 1 },
            ]),
          },
        }
      })
      // 图例的数据
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        series: seriesArr,
        legend: {
          data: legendArr,
        },
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          fontSize: this.titleFontSize / 1.5,
        },
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleSelect(currentType) {
      this.choiceType = currentType
      this.updateChart()
      this.showChoice = false
    },
  },
}
</script>
<style lang="css" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 1;
  color: #fff;
}

.el-icon-arrow-down {
  margin-left: 10px;
  cursor: pointer;
}

.title-text {
  cursor: pointer;
}

.select-com {
  cursor: pointer;
}
</style>
