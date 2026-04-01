<template>
  <div class="home-container">
    <div class="content">
      <h1 class="title">AI 脑筋急转弯</h1>
      <a-button type="primary" size="large" class="start-btn" @click="startGame">
        点击开始
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const startGame = () => {
  const roomId = Math.floor(Math.random() * 900000) + 100000
  router.push(`/chat/${roomId}`)
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.content {
  text-align: center;
}
.title {
  color: #fff;
  font-size: 48px;
  margin-bottom: 60px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}
.start-btn {
  width: 200px;
  height: 60px;
  font-size: 20px;
  border-radius: 30px;
}
</style>
