<template>
  <div class="page-container">
    <div class="sidebar">
      <div class="sidebar-title">历史对话</div>
      <a-button type="primary" block @click="createNewRoom" style="margin: 8px 12px; width: calc(100% - 24px);">
        + 新建对话
      </a-button>
      <div class="room-list">
        <div v-for="(room, index) in historyRooms" :key="room.roomId" 
             :class="['room-item', room.roomId == roomId ? 'active' : '']"
             @click="switchRoom(room.roomId)">
          <div class="room-info">
            <div class="room-name">房间号: {{ String(room.roomId).slice(-6) }}</div>
          </div>
          <a-button type="text" danger size="small" @click.stop="deleteRoom(room.roomId)">删除</a-button>
        </div>
      </div>
    </div>
    <div class="chat-container">
      <div class="header">
        <div class="header-title">AI 脑筋急转弯</div>
        <div class="header-info">房间号: {{ roomId }} | {{ currentTime }}</div>
      </div>
      <div class="chat-area" ref="chatAreaRef">
        <div v-for="(msg, index) in messages" :key="index" 
             :class="['message', msg.role === 'user' ? 'user-message' : 'ai-message']">
          <div class="avatar">{{ msg.role === 'user' ? '我' : 'AI' }}</div>
          <div class="bubble">{{ msg.content }}</div>
        </div>
      </div>
      <div class="input-area">
        <div class="btn-group">
          <a-button type="primary" :disabled="startDisabled" @click="handleStart">开始</a-button>
          <a-button :disabled="endDisabled" @click="handleEnd">结束游戏</a-button>
        </div>
        <div class="input-row">
          <a-input v-model:value="inputText" placeholder="请输入内容" 
                   @pressEnter="sendMsg" :disabled="loading" />
          <a-button type="primary" @click="sendMsg" :loading="loading">发送</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sendMessage } from '../api/chat'

const route = useRoute()
const router = useRouter()
const roomId = ref(route.params.roomId)

const messages = ref([])
const inputText = ref('')
const loading = ref(false)
const startDisabled = ref(false)
const endDisabled = ref(true)
const chatAreaRef = ref(null)
const historyRooms = ref([])
const currentTime = ref('')

const STORAGE_KEY = 'ai_naojin_rooms'

const updateTime = () => {
  const now = new Date()
  currentTime.value = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
}

// 从localStorage加载历史房间
const loadHistoryRooms = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    historyRooms.value = JSON.parse(saved)
  }
}

// 保存到localStorage
const saveHistoryRooms = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historyRooms.value))
}

// 保存当前房间的消息
const saveCurrentRoomMessages = () => {
  const room = historyRooms.value.find(r => r.roomId == roomId.value)
  if (room) {
    room.messages = messages.value
    room.startDisabled = startDisabled.value
    room.endDisabled = endDisabled.value
    saveHistoryRooms()
  }
}

// 加载房间消息
const loadRoomMessages = (rid) => {
  const room = historyRooms.value.find(r => r.roomId == rid)
  if (room && room.messages) {
    messages.value = room.messages
    startDisabled.value = room.startDisabled || false
    endDisabled.value = room.endDisabled !== false ? room.endDisabled : true
  } else {
    messages.value = []
    startDisabled.value = false
    endDisabled.value = true
  }
}

// 创建新房间
const createNewRoom = () => {
  const newRoomId = Date.now()
  historyRooms.value.unshift({ roomId: newRoomId, messages: [], startDisabled: false, endDisabled: true })
  saveHistoryRooms()
  router.push(`/chat/${newRoomId}`)
}

// 切换房间
const switchRoom = (newRoomId) => {
  if (newRoomId == roomId.value) return
  saveCurrentRoomMessages()
  router.push(`/chat/${newRoomId}`)
}

// 删除房间
const deleteRoom = (rid) => {
  historyRooms.value = historyRooms.value.filter(r => r.roomId != rid)
  saveHistoryRooms()
  if (rid == roomId.value && historyRooms.value.length > 0) {
    router.push(`/chat/${historyRooms.value[0].roomId}`)
  } else if (historyRooms.value.length === 0) {
    createNewRoom()
  }
}

// 监听路由变化
watch(() => route.params.roomId, (newId) => {
  if (newId) {
    roomId.value = newId
    loadRoomMessages(newId)
  }
})

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
  loadHistoryRooms()
  
  // 确保当前房间在列表中
  if (!historyRooms.value.find(r => r.roomId == roomId.value)) {
    historyRooms.value.unshift({ roomId: roomId.value, messages: [], startDisabled: false, endDisabled: true })
    saveHistoryRooms()
  }
  loadRoomMessages(roomId.value)
})

const scrollToBottom = () => {
  nextTick(() => {
    if (chatAreaRef.value) {
      chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight
    }
  })
}

const sendMsg = async () => {
  if (!inputText.value.trim() || loading.value) return
  const text = inputText.value.trim()
  inputText.value = ''
  
  if (text === '开始') {
    startDisabled.value = true
    endDisabled.value = false
  }
  
  messages.value.push({ role: 'user', content: text })
  scrollToBottom()
  saveCurrentRoomMessages()
  
  loading.value = true
  try {
    const res = await sendMessage(roomId.value, text)
    const aiReply = res.data
    messages.value.push({ role: 'ai', content: aiReply })
    
    if (aiReply.includes('游戏结束')) {
      endDisabled.value = true
    }
    saveCurrentRoomMessages()
  } catch (e) {
    messages.value.push({ role: 'ai', content: '请求失败，请重试' })
  }
  loading.value = false
  scrollToBottom()
}

const handleStart = () => {
  inputText.value = '开始'
  sendMsg()
}

const handleEnd = () => {
  inputText.value = '退出'
  sendMsg()
}
</script>

<style scoped>
.page-container {
  height: 100vh;
  display: flex;
}
.sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}
.sidebar-title {
  padding: 16px;
  font-size: 16px;
  color: #1890ff;
  border-bottom: 1px solid #e8e8e8;
}
.room-list {
  flex: 1;
  overflow-y: auto;
}
.room-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.room-item:hover {
  background: #f5f5f5;
}
.room-item.active {
  background: #e6f7ff;
  border-left: 3px solid #1890ff;
}
.room-info {
  flex: 1;
}
.room-name {
  font-size: 14px;
  color: #333;
}
.room-id {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}
.header {
  padding: 16px;
  background: #fff;
  text-align: center;
  border-bottom: 1px solid #e8e8e8;
}
.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}
.header-info {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}
.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.message {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}
.user-message {
  flex-direction: row-reverse;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.user-message .avatar {
  background: #52c41a;
}
.bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fff;
  margin: 0 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}
.user-message .bubble {
  background: #95ec69;
}
.input-area {
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
}
.btn-group {
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}
.input-row {
  display: flex;
  gap: 12px;
}
.input-row .ant-input {
  flex: 1;
}
</style>
