import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface User {
  userName: string
  userEmail: string
  picture: string
}

export const useOAuthStore = defineStore('googleOauth2', () => {
  const user = ref<User | null>(null)

  const event = ref<any[] | null>(null)

  return {
    user,
    event,
  }
})
