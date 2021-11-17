<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>
<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
import { mapState } from 'vuex'

export default {
  name: 'Map',
  data() {
    return {
      // axios实例对象
      axiosInstance: null,
      // 图表实例对象
      chartInstance: null,
      // 中国地图数据
      chinaMapData: null,
      // 从服务器中获取的所有数据
      allData: null,
      // 所获取的省份的地图矢量数据
      mapData: {},
      // 判断是否进入省份
      isProvince: false,
      url:''
    }
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
  created() {
    this.url = location.protocol + "//" + location.host
    console.log(this.url)
    this.axiosInstance = axios.create({
      baseURL: this.url,
    })
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted() {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: '',
    })
    // this.getData();
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    // 在组件销毁的时候取消监听器
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
    this.chartInstance.dispose()
  },
  methods: {
    // 初始化echarts实例化对象
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      // 获取中国地图的矢量数据
      if (!this.chinaMapData) {
        const { data: res } = await this.axiosInstance.get('/static/map/china.json')
        this.chinaMapData = res
      }
      // 注册地图数据
      this.$echarts.registerMap('china', this.chinaMapData)

      // 初始化配置项
      const initOption = {
        title: {
          text: '🗺 商家分布',
          left: 20,
          top: 20,
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          // 允许拖动和缩放
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333',
          },
          label: {
            show: true,
            color: 'white',
            formatter: `{a}`,
          },
        },
        /* legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical',
        }, */
      }
      // 对图表初始化配置的控制
      this.chartInstance.setOption(initOption)

      this.chartInstance.on('click', async arg => {
        // arg.name 得到所点击的省份，这个省份名称为中文
        if (!this.isProvince) {
          const provinceInfo = getProvinceMapInfo(arg.name)
          // 需要获取这个省份的地图矢量数据
          // 判断当前所点击的省份的地图矢量数据是否存在于mapData
          if (!this.mapData[provinceInfo.key]) {
            const { data: res } = await this.axiosInstance.get(provinceInfo.path)
            this.mapData[provinceInfo.key] = res
            this.$echarts.registerMap(provinceInfo.key, res)
          }
          const changeOption = {
            geo: {
              map: provinceInfo.key,
            },
          }
          this.chartInstance.setOption(changeOption)
          this.isProvince = true
        }
      })
    },
    // 获取服务器的数据
    getData(res) {
      // const { data: res } = await this.$http.get("map");
      this.allData = res
      this.updateChart()
    },
    // 更新图表
    updateChart() {
      // 图例的数据
      const lengedArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        // return 的这个对象就代表的是一个类别下的所有散点数据
        // 如果想要在地图中显示散点的数据，所以我们需要给散点的图表增加一个配置
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 8,
            brushType: 'stroke',
          },
        }
      })
      const dataOption = {
        legend: {
          left: '2%',
          bottom: '5%',
          // 图例的方向
          orient: 'verticle',
          data: lengedArr,
        },
        series: seriesArr,
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          fontSize: titleFontSize,
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          fontSize: titleFontSize / 3,
        },
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 回到中国地图
    revertMap() {
      const revertOption = {
        geo: {
          map: 'china',
        },
      }
      this.chartInstance.setOption(revertOption)
      this.isProvince = false
    },
  },
}
</script>
<style lang="css" scoped>
</style>