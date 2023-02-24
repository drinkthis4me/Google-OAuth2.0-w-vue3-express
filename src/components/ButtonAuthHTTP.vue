<template>
  <a :href="authorizationUrl">
    <button class="btn">Continue with Google</button>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT as string

/**
 * Use authorization code model + ux mode: "redirect" (redirect_uri required in the params)
 * Request user consent -> Automatically redirect to /calendar
 *  -> On /calendar, call backend with auth code as payload -> Render calendar data
 * Google handle the redirection, so redirect_uri must match with API Console Credentials page
 * Server: redirect_uri = http://localhost:5173/calendar
 */
const authorizationUrl = computed(() => {
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: [
      'openid',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar.readonly',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
  }
  const params = new URLSearchParams(options)

  return `${oauth2Endpoint}?${params.toString()}`
})
</script>

<style scoped>
a.btn {
  margin-top: 3rem;
}
</style>
