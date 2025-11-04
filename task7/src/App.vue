<template>
  <div id="app">
    <el-container style="height: 100vh">
      <el-header style="font-size: 40px; background-color: rgb(238, 241, 246); line-height: 60px;">
        Quiz后台管理
      </el-header>
      <el-container>
        <el-aside width="200px" style="background-color: #d3dce6">
          <el-menu
            default-active="1"
            :default-openeds="['1']"
            class="el-menu-vertical-demo"
            background-color="#d3dce6"
            text-color="#333"
            active-text-color="#409EFF">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-message"></i>
                <span>系统信息管理</span>
              </template>
              <el-menu-item index="1-1">
                <router-link to="/user" class="nav-link">用户管理</router-link>
              </el-menu-item>
              <el-menu-item index="1-2">
                <router-link to="/question" class="nav-link">题目管理</router-link>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.nav-link {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
  height: 100%;
}

.el-header {
  padding: 0 20px;
}

.el-aside {
  overflow-y: auto;
}

.el-main {
  padding: 20px;
}
</style>

