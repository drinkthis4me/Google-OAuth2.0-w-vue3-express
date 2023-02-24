<template>
  <div>
    <h1>Login success</h1>
    <div v-if="oAuthStore.user">
      <h2>
        Welcome <span class="user">{{ oAuthStore.user.userName }}</span>
      </h2>
      <h2>
        Email: <span class="user">{{ oAuthStore.user.userEmail }}</span>
      </h2>
      <img :src="oAuthStore.user.picture" alt="Google user picture" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOAuthStore } from '@/stores/useOAuthStore'

const oAuthStore = useOAuthStore()
</script>

<style scoped>
.user {
  font-weight: 500;
  color: crimson;
}
</style>
