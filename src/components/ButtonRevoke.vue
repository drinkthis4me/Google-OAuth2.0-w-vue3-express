<template>
  <div class="container">
    <button @click="revokeToken" class="btn">Revoke token</button>
    <div v-if="message" class="message">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const message = ref('')

/**
 * Revoke user consent: call server to delete the access token
 */
const revokeToken = async () => {
  await axios
    .get('http://localhost:3000/api/oauth/google/revoke')
    .then((res) => {
      console.log('>>> Revken token response: ' + res.statusText)
      message.value = 'Token deleted!'
    })
    .catch((err) => {
      console.log('>>> Revoke token error: ' + err)
      message.value = JSON.stringify(err.message)
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
