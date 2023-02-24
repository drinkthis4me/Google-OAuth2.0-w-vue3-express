<template>
  <div ref="google_btn_ref">Sign in with Google</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { googleSdkLoaded, type CallbackTypes } from 'vue3-google-login'
import axios from 'axios'
import { useOAuthStore } from '@/stores/useOAuthStore'
import { useRouter } from 'vue-router'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string
const AUTHENTICATION_ENDPOINT = import.meta.env
  .VITE_AUTHENTICATION_ENDPOINT as string

const oAuthStore = useOAuthStore()
const router = useRouter()

const google_btn_ref = ref<HTMLElement | null>(null)

/**
 * Authentication:
 * Use GSI JavaScript Library's API
 * ux_mode: "popup" can only be returned to the callback JS function (with some downside. See handleCredentialResponse).
 * Use the HTML API if the response must be submitted automatically to login_uri.
 */
onMounted(() => {
  googleSdkLoaded((google) => {
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse, // Only used when ux_mode: "popup" is set.
      login_uri: AUTHENTICATION_ENDPOINT, // Only used when ux_mode: "redirect" is set.
      ux_mode: 'popup',
    })
    if (google_btn_ref.value)
      google.accounts.id.renderButton(google_btn_ref.value, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '200',
        locale: 'zh_TW',
      })
    // google.accounts.id.prompt() // display One Tap prompt UI
  })
})

/**
 * Verify the Google ID token on the server side.
 * NOTE!!:
 * 1. With JavaScript API, popup UX mode can only be returned to the callback JavaScript function.
 *    Use ux_mode: "redirect" or HTML API if the response must be submitted automatically to login_uri.
 * 2. This request will not have google provided csrf token cookie.
 *    Client must provide its own csrf prevention (e.g. use custom request headers)
 */
const handleCredentialResponse: CallbackTypes.CredentialCallback = async (
  CredentialPopupResponse
) => {
  console.log(
    '>>> credential JWT: ' + JSON.stringify(CredentialPopupResponse.credential)
  )

  await axios
    .post(AUTHENTICATION_ENDPOINT, CredentialPopupResponse)
    .then((res) => {
      console.log('>>> Verify user result: ' + JSON.stringify(res.data))
      oAuthStore.user = res.data
      if (oAuthStore.user) router.push('/success')
    })
    .catch((err) => console.log('>>> Verify user error: ' + err))
}
</script>
