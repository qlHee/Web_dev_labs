<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-title">
        <h2>Quiz 管理系统</h2>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" @keyup.enter.native="handleLogin"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: false
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$axios.post('/admin/login', this.loginForm)
            .then(response => {
              this.loading = false
              const res = response.data
              if (res.code === 1) {
                // 检查用户是否是管理员
                // 这里假设后端返回的token中包含了用户角色信息，并且只有管理员角色能够登录
                localStorage.setItem('admin_token', res.data)
                
                // 跳转到首页或重定向页面
                const redirect = this.$route.query.redirect || '/'
                this.$router.push(redirect)
              } else {
                this.$message.error(res.msg || '登录失败，请检查您的用户名和密码')
              }
            })
            .catch(error => {
              this.loading = false
              this.$message.error('登录失败，请稍后重试')
              console.error(error)
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.login-title h2 {
  font-weight: 500;
}
</style>
