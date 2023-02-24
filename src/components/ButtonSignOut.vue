<template>
  <div class="container">
    <div class="g_id_signout">
      <button @click="signOut" class="btn">Sign Out</button>
    </div>
    <div v-if="message" class="message">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useOAuthStore } from '@/stores/useOAuthStore'

const oAuthStore = useOAuthStore()

const message = ref('')

/**
 * delete session tokens and cookies
 */
const signOut = async () => {
  await axios
    .get('http://localhost:3000/api/oauth/signout')
    .then((res) => {
      message.value = 'Sign out success!'
      oAuthStore.user = null
      console.log('>>> Sign out response: ' + res.statusText)
    })
    .catch((err) => {
      message.value = JSON.stringify(err.message)
      console.log('>>> Sign out error: ' + err)
    })
}
</script>

<style scoped>
.container {
  display: flex;
}

.message {
  font-size: larger;
  color: red;
  margin-left: 1rem;
}
</style>
