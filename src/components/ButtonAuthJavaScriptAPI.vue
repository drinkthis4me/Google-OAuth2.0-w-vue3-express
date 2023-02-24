<template>
  <button @click="authClientLogin" class="btn">Continue with Google</button>
</template>

<script setup lang="ts">
import { googleSdkLoaded, type CallbackTypes } from 'vue3-google-login'
import axios from 'axios'
import { useOAuthStore } from '@/stores/useOAuthStore'
import { useRouter } from 'vue-router'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string
const AUTHORIZATION_ENDPOINT = import.meta.env
  .VITE_AUTHORIZATION_ENDPOINT as string

const oAuthStore = useOAuthStore()
const router = useRouter()

/**
 * Using authorization code model + ux_mode: "popup".
 */
const authClientLogin = () => {
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initCodeClient({
        client_id: CLIENT_ID,
        scope: [
          'openid',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/calendar.readonly',
        ].join(' '),
        ux_mode: 'popup',
        callback: handleCodeResponse,
      })
      .requestCode()
  })
}

/**
 * Request user consent (auth code from Google)-> Server exchanges auth code with access token
 *  -> Server uses access token to call calendar API -> Client programmatically redirect to /calendar
 * Server: redirect_uri = http://localhost:5173
 */
const handleCodeResponse: CallbackTypes.CodeResponseCallback = async (res) => {
  await axios
    .post(AUTHORIZATION_ENDPOINT, res, {
      headers: {
        'X-Requested-With': 'XmlHttpRequest',
      },
    })
    .then((res) => {
      console.log(`>>> Authorization response: ${res.status} ${res.statusText}`)

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
      }

      if (oAuthStore.event) {
        console.log(`>>> Redirect to "/calendar"`)
        router.push('/calendar')
      }
    })
    .catch((err) => console.log('>>> Authorization error: ' + err))
}
</script>
