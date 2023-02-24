<template>
  <div>
    <h1>Authorization success</h1>
    <div>10 upcoming events in your Google calendar:</div>
    <div v-if="oAuthStore.event">
      <div v-for="e in oAuthStore.event">
        {{ e.start }} - {{ e.end }} - {{ e.summary }} - {{ e.description }}
      </div>
    </div>
    <div v-else>No upcoming events found</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOAuthStore } from '@/stores/useOAuthStore'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const AUTHORIZATION_ENDPOINT = import.meta.env
  .VITE_AUTHORIZATION_ENDPOINT as string

const oAuthStore = useOAuthStore()

const route = useRoute()
const router = useRouter()

const getCalendar = async () => {
  await axios
    .post(AUTHORIZATION_ENDPOINT, route.query, {
      headers: {
        'X-Requested-With': 'XmlHttpRequest',
      },
    })
    .then((res) => {
      if (res.data && res.data.length > 0) {
        const result = res.data.map((event: any) => {
          return {
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            summary: event.summary,
            description: event.description,
          }
        })
        oAuthStore.event = result
        router.replace({ query: undefined })
      }
    })
    .catch((err) => console.log('getCalendar error: ' + err))
}

if (!oAuthStore.event && route.query) {
  getCalendar()
}
</script>

<style scoped></style>
