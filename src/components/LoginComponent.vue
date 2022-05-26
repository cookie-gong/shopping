<template>
  <div class="login_container">
    <div class="three">
      <three></three>
    </div>
    <div class="login_box">
      <div class="img_circle">
        <img src="../assets/login.png" alt="" />
      </div>
      <div class="login_form">
        <el-form ref="formRef" :rules="rules" :model="form">
          <el-form-item prop="username">
            <el-input placeholder="请输入用户名" v-model="form.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入用户密码" prefix-icon="iconfont icon-3702mima" type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="clearForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    clearForm() {
      this.$refs.formRef.resetFields()
    },
    login() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.form)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        // this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        window.sessionStorage.setItem('rootName', this.form.username)
        this.$router.push('/home')
      })
    },
  },
  components: {
    three: () => import('./three/threeComponent.vue'),
  },
}
</script>
<style lang="less" scoped>
.login_container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #333;
  overflow: hidden;

  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 300px;
    width: 450px;
    background-color: #fff;
    opacity: 0.9;
    pointer-events: none;
    border-radius: 10px;

    .img_circle {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 1px solid #eee;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      pointer-events: auto;
      .el-form-item {
        margin-bottom: 20px;
      }
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .three {
    position: absolute;
    height: 100%;
    width: 100%;
  }
}
</style>
