# Google Identity Service + vue3 + express

This project implement Google OAuth 2.0 for both authentication and authorization.

You can watch [this video](https://youtu.be/996OiexHze0) to better understand how Google OAuth 2.0 works.

# Project Dependencies
- Frontend:
  - [Vue3](https://vuejs.org/) for JS framework
  - [Vue Router](https://router.vuejs.org/) for handling page navigation
  - [Pinia](https://pinia.vuejs.org/) for state management
  - [Axios](https://github.com/axios/axios) for calling backend API
  - [Vueuse](https://vueuse.org/) for loading Google Identity Service JavaScript API
  - [Vue 3 Google Login](https://yobaji.github.io/vue3-google-login/): Provides ready-to-use login compoments and callback functions (Although this project only use it for Google's SDK)
- Backend:
  - [Express](https://expressjs.com): Server framework for Node.js
  - [body-parser](https://github.com/expressjs/body-parser)
  - [cookie-parser](https://github.com/expressjs/cookie-parser)
  - [cors](https://github.com/expressjs/cors)
  - [dotenv](https://github.com/motdotla/dotenv)
  - [Axios](https://github.com/axios/axios) for calling Google API
  - [Google Auth Library Node.js Client](https://github.com/googleapis/google-auth-library-nodejs): Google's officially supported node.js client library for using OAuth 2.0
  - [@googleapis/calendar](https://www.npmjs.com/package/@googleapis/calendar): Google Calendar API



# Project Setup
Go to Google Cloud Consle and set up OAuth 2.0 client ID. You can follow [this page](https://support.google.com/cloud/answer/6158849) for instructions.


Create your own <code>.env</code> files for environment variables.

One at the root directory <code>/.env</code> for client:
```
VITE_SERVER_ENDPOINT=http://localhost:5173

VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
VITE_GOOGLE_OAUTH_REDIRECT=http://localhost:5173/calendar

VITE_AUTHENTICATION_ENDPOINT=http://localhost:3000/api/oauth/google/verify
VITE_AUTHORIZATION_ENDPOINT=http://localhost:3000/api/oauth/google/auth
```

The other at <code>/server/.env</code> for server:
```
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
GOOGLE_OAUTH_REDIRECT=http://localhost:5173 (might be different depends on your choice of API/UX mode)
```

Start the client on localhost:5173
```sh
npm install
npm run dev
```

Start the server on localhost:3000
```sh
npm install
npm start
```
