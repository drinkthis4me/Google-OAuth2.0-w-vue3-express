<template>
  <div
    id="g_id_onload"
    :data-client_id="CLIENT_ID"
    data-context="signin"
    data-ux_mode="popup"
    :data-login_uri="AUTHENTICATION_ENDPOINT"
    data-auto_prompt="false"></div>
  <div
    class="g_id_signin"
    data-type="standard"
    data-shape="rectangular"
    data-theme="outline"
    data-text="signin_with"
    data-size="large"
    data-logo_alignment="left"
    data-locale="zh-TW"></div>
</template>

<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string
const AUTHENTICATION_ENDPOINT = import.meta.env
  .VITE_AUTHENTICATION_ENDPOINT as string

/**
 * Render HTML API's button
 */
useScriptTag('https://accounts.google.com/gsi/client')
</script>
