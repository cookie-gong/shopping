<template>
  <el-container>
    <el-header>
      <div @click="goHome" class="logo">
        <img src="../assets/pic.png" alt="后台logo" />
        <span>电商后台管理系统</span>
        <span>{{ version }}</span>
      </div>
      <div class="back">
        <img src="../assets/demo.gif" alt="gif图片" />
      </div>
      <div>
        <span>欢迎您：{{ rootName }}</span>
        <i class="el-icon-full-screen" @click="click"></i>
        <el-dropdown>
          <span class="el-dropdown-link"> 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus" @click.native="togitee">gitee</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus" @click.native="togithub">github</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus-outline" @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '60px' : '180px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/' + item1.path" v-for="item1 in item.children" :key="item1.id" @click="saveNavState('/' + item1.path)">
              <i class="el-icon-location"></i>
              <span>{{ item1.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import screenfull from 'screenfull'
export default {
  data() {
    return {
      menuList: [],
      // 菜单栏图标对象
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 菜单栏是否开启水平折叠
      isCollapse: false,
      activePath: '',
      rootName: '',
      version: 'Version: 1.0.0'
    }
  },
  created() {
    this.getMenu()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    goHome() {
      this.$router.push('/home')
    },
    logout() {
      //清除本地缓存
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenu() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('请求菜单列表失败')
      this.menuList = res.data
      this.rootName = window.sessionStorage.getItem('rootName')
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    click() {
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
    togitee() {
      window.open('https://gitee.com/cookieg/vue2_eletricity', 'top')
    },
    togithub() {
      window.open('https://github.com/cookie-gong/bootstrap', 'top')
    }
  }
}
</script>
<style lang="css" scoped>
.logo {
  cursor: pointer;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header > div {
  display: flex;
  align-items: center;
}
.el-header > div span {
  margin: 0 15px;
}

.el-header > div span:nth-child(3) {
  font-size: 16px;
}
.el-header div:first-child img {
  height: 60px;
}
.el-aside {
  background-color: #333744;
}
.el-aside .el-menu {
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-aside {
  overflow: hidden;
}
.el-carousel-item img {
  width: 100%;
  height: 100%;
}

.back img {
  height: 80px;
}

.el-dropdown-link {
  cursor: pointer;
  font-size: 20px;
  color: #ffffff;
}
</style>
