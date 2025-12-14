<template>
  <el-container class="layout-container">
    <el-header style="font-size: 24px; background-color: rgb(238, 241, 246)">
      <div class="header-content">
        <div class="logo">Quiz管理系统</div>
        <div class="user-info">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          router
          background-color="rgb(238, 241, 246)"
          text-color="#2c3e50"
          active-text-color="#409EFF">
          <el-menu-item index="/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/question">
            <i class="el-icon-question"></i>
            <span slot="title">题目管理</span>
          </el-menu-item>
          <el-menu-item index="/score">
            <i class="el-icon-document"></i>
            <span slot="title">评分查询</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      username: localStorage.getItem('admin_username') || '管理员',
      activeIndex: this.$route.path
    }
  },
  watch: {
    $route(to) {
      this.activeIndex = to.path
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_username')
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo {
  font-weight: bold;
  font-size: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.el-header {
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.el-menu {
  border-right: none;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>
