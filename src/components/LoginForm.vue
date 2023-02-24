<template>
  <div>
    <h2>
      Authentication: Sign users into this app using their Google accounts
    </h2>
    <div>(Check your browser for cookie "logged_in_demo")</div>
    <div>
      <a
        href="https://developers.google.com/identity/gsi/web/reference/html-reference">
        ---Google HTML API---
      </a>
      <ButtonLogInHTMLAPI />
      <a
        href="https://developers.google.com/identity/gsi/web/reference/js-reference">
        ---Google JavaScript API---
      </a>
      <ButtonLogInJavaScriptAPI />
      <h3>Sign out (Clean cookie and user data)</h3>
      <ButtonSignOut />
    </div>
  </div>
  <div>
    <h2>Authorization: Authorize this app to use Google APIs and data.</h2>
    <div>(will request permission to read your Google calendar.)</div>
    <div>
      <div>
        <a
          href="https://developers.google.com/identity/oauth2/web/reference/js-reference">
          ---Google 3P Authorization JavaScript Library API ---
        </a>
      </div>
      <ButtonAuthJavaScriptAPI />
      <div>
        <a
          href="https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#redirecting">
          ---HTTP/REST: directly call the OAuth 2.0 endpoints---
        </a>
      </div>
      <ButtonAuthHTTP />
    </div>
    <h3>Revoke authorization:</h3>
    <div>
      (Tell this app that you don't want it to access your Google calendar
      anymore.)
    </div>
    <ButtonRevoke />
  </div>
</template>

<script setup lang="ts">
import ButtonLogInHTMLAPI from './ButtonLogInHTMLAPI.vue'
import ButtonSignOut from './ButtonSignOut.vue'
import ButtonAuthJavaScriptAPI from './ButtonAuthJavaScriptAPI.vue'
import ButtonLogInJavaScriptAPI from './ButtonLogInJavaScriptAPI.vue'
import ButtonAuthHTTP from './ButtonAuthHTTP.vue'
import ButtonRevoke from './ButtonRevoke.vue'
</script>
