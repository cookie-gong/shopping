<template>
  <div id="welcome">
    <el-row>
      <el-button type="primary" round @click="addTags = true">添加标签</el-button>
       <el-button type="danger" round @click="deleteTag">删除标签</el-button>
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
    <el-dialog title="添加用户" :visible.sync="addTags" width="50%" @close="addTagClosed">
      <el-form ref="addFormRef" :model="addForm" label-width="90px" :rules="addFormRules">
        <el-form-item label="标签名称" prop="tagname">
          <el-input v-model="addForm.tagname"></el-input>
        </el-form-item>
        <el-form-item label="URL地址" prop="tagurl">
          <el-input v-model="addForm.tagurl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addTags = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
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
    var checkUrl = (rules, value, callback) => {
      const regUrl = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
      if (regUrl.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的URL'))
    }
    return {
      layout: null,
      isShow: false,
      addTags: false,
      addForm: {
        tagname: '',
        tagurl: ''
      },
      addFormRules: {
        tagname: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        tagurl: [
          { required: true, message: '请输入URL地址', trigger: 'blur' },
          { validator: checkUrl, trigger: 'blur' }
        ]
      }
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
    },
    addUser() {
      const arr = this.layout
      const [x, y] = [12, 40]
      let res = new Array(y).fill().map(() => new Array(x).fill(0))
      let result = JSON.parse(JSON.stringify(arr[1]))
      result.name = this.addForm.tagname
      result.url = this.addForm.tagurl
      result.w = 1
      result.h = 4
      result.i = arr.length
      result.bgc = `rgba(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.round(Math.random() * 0.7) + 0.3})`
      arr.forEach(item => {
        for (let i = 0; i < item.h; i++) {
          for (let j = 0; j < item.w; j++) {
            res[item.y + i][item.x + j] = 1
          }
        }
      })
      let end = false
      for (let i = 0; i < y; i++) {
        if(end) break;
        for (let j = 0; j < x; j++) {
          if (res[i][j] == 0) {
            if (!res[i + 1][j] && !res[i + 2][j] && !res[i + 3][j]) {
              [result.x, result.y] = [j, i]
              end = true
              break
            }
          }
        }
      }
      this.layout.push(result)
      this.setData()
    },
    deleteTag() {
      console.log("星期一弄完")
    },
    addTagClosed() {
      this.$refs.addFormRef.resetFields()
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
