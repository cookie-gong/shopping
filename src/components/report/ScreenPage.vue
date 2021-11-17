<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="" />
      </div>
      <span class="logo" @click="backPage">
        <span>返回</span>
        <i class="el-icon-s-home"></i>
      </span>
      <span class="title">后台数据实时监控系统</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme" />
        <i class="el-icon-full-screen" @click="clickFull"></i>
        <span class="datetime">
          {{ timeNow | dateFormat }}
        </span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <i @click="changeSize('trend')" :class="fullScreenStatus.trend ? 'el-icon-zoom-out' : 'el-icon-zoom-in'"></i>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <i @click="changeSize('seller')" :class="fullScreenStatus.seller ? 'el-icon-zoom-out' : 'el-icon-zoom-in'"></i>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <div class="resize">
            <i @click="changeSize('map')" :class="fullScreenStatus.map ? 'el-icon-zoom-out' : 'el-icon-zoom-in'"></i>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <i @click="changeSize('rank')" :class="fullScreenStatus.rank ? 'el-icon-zoom-out' : 'el-icon-zoom-in'"></i>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div class="resize">
            <i @click="changeSize('hot')" :class="fullScreenStatus.hot ? 'el-icon-zoom-out' : 'el-icon-zoom-in'"></i>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <i @click="changeSize('stock')" :class="fullScreenStatus.stock ? 'el-icon-zoom-out' : 'el-icon-zoom-in'"></i>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from './Hot.vue'
import Map from './Map.vue'
import Rank from './Rank.vue'
import Seller from './Seller.vue'
import Stock from './Stock.vue'
import Trend from './Trend.vue'
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
import screenfull from 'screenfull'

export default {
  data() {
    return {
      // 定义每一个图表的全屏状态
      fullScreenStatus: {
        trend: false,
        seller: false,
        stock: false,
        map: false,
        rank: false,
        hot: false
      },
      timeNow: '',
      timer: null
    }
  },
  created() {
    // 注册接收到数据的回调函数
    this.$socket.registerCallBack('fullScreen', this.recvData)
    this.$socket.registerCallBack('themeChange', this.recvThemeChange)
  },
  destroyed() {
    this.$socket.unRegisterCallBack('fullScreen')
    this.$socket.unRegisterCallBack('themeChange')
    clearInterval(this.timer)
  },
  mounted() {
    this.getTime()
  },
  methods: {
    changeSize(chartName) {
      // 1、改变fullScreenStatus中的数据状态
      // this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName];
      // 2、需要调用每一个图表组件中screenAdapter函数
      // this.$nextTick(() => {
      //   this.$refs[chartName].screenAdapter();
      // });
      // 将数据发送给服务端
      const tragetValue = !this.fullScreenStatus[chartName]
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: tragetValue
      })
    },
    // 接收到全屏数据之后的处理
    recvData(data) {
      // 取出是哪一个图表需要进行切换
      const chartName = data.chartName
      // 取出，切换成什么状态
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    handleChangeTheme() {
      // 修改vueX中的主题
      // this.$store.commit("changeTheme");
      this.$socket.send({
        action: 'themeChange',
        socketType: 'themeChange',
        chartName: '',
        value: ''
      })
    },
    // 接收服务器传入的主题数据，实现主题切换
    recvThemeChange() {
      this.$store.commit('changeTheme')
    },
    getTime() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timeNow = new Date()
      this.timer = setInterval(() => {
        this.timeNow = new Date()
      }, 1000)
    },
    clickFull() {
      // 判断是否支持
      if (!screenfull.isEnabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    backPage() {
      this.$router.go(-1)
      window.sessionStorage.setItem('activePath', '')
    }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  },
  computed: {
    ...mapState(['theme']),
    headerSrc() {
      return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
    },
    themeSrc() {
      return '/static/img/' + getThemeValue(this.theme).themeSrc
    },
    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    }
  }
}
</script>
<style lang="less" scoped>
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;

  .screen-header {
    width: 100%;
    height: 64px;
    font-size: 20px;
    position: relative;

    .title {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 20px;
      transform: translate(-50%, -50%);
    }
    .title-right {
      display: flex;
      align-items: center;
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-80%);

      .logo {
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-80%);
        cursor: pointer;

        span {
          margin-right: 10px;
        }

        .el-icon-s-home {
          font-size: 25px;
        }
      }
      .qiehuan {
        width: 28px;
        height: 21px;
        cursor: pointer;
      }

      .el-icon-full-screen {
        font-size: 25px;
        margin-left: 10px;
      }

      .datetime {
        font-size: 15px;
        margin-left: 10px;
      }
    }
  }
}

.screen-header > div img {
  width: 100%;
}

.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;

    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}

.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  font-size: 30px;
}
</style>
