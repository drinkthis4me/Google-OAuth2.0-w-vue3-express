import express from 'express'
import {
  googleAuthenticationHandler,
  signoutHandler,
  googleAuthorizationHandler,
  googleRevokeTokenHandler,
} from '../controller/auth.controller'

const router = express.Router()

router.post('/google/verify', googleAuthenticationHandler)

router.post('/google/auth', googleAuthorizationHandler)

router.get('/signout', signoutHandler)

router.get('/google/revoke', googleRevokeTokenHandler)

export default router
