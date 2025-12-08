import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 60000
})

export const sendMessage = (roomId, userPrompt) => {
  return api.post(`/${roomId}/chat`, null, {
    params: { userPrompt }
  })
}

export const getChatRooms = () => {
  return api.get('/rooms')
}
