import { Request, Response, NextFunction } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { calendar } from '@googleapis/calendar'
import axios from 'axios'

require('dotenv').config()

/**
 * Google Authentication for client signing in
 */
export const googleAuthenticationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the ID token from the request body
    const code = req.body.credential
    if (!code) return next(new Error('ID token not provided'))

    // verify then CSRF token (for HTML API)
    const g_csrf_token = req.body.g_csrf_token
    const g_cookie = req.cookies.g_csrf_token
    // if (!g_csrf_token) return next(new Error('g_csrf_token not provided'))
    // if (!g_cookie) return next(new Error('g_cookie not provided'))
    // if (g_csrf_token !== g_cookie)
    //   return next(new Error('Failed to verify double submit cookie'))

    // Init new oauth2client object
    // NOTE!!: redirect URI should be exactly the same as the one that client sent in the request
    const client = new OAuth2Client({
      redirectUri: process.env.GOOGLE_OAUTH_REDIRECT,
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    })

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: code,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload) return next(new Error('Failed to verify IdToken'))

    const { name, email_verified, email, picture } = payload

    // Check if the email is verified
    if (!email_verified) return next(new Error('Google account not verified'))

    // respond status
    const cookieContent = { userName: name, userEmail: email, picture: picture }
    res.statusMessage = 'User authenticated. Welcome.'

    // HTML API: redirect client to '/success'; JavaScript API: return user info.
    if (g_cookie)
      return res
        .status(200)
        .cookie('logged_in_demo', cookieContent, {
          expires: new Date(Date.now() + 5 * 60 * 1000), // 5 min
          maxAge: 5 * 60 * 1000,
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        })
        .redirect(301, 'http://localhost:5173/success')
    else
      return res
        .status(200)
        .cookie('logged_in_demo', cookieContent, {
          expires: new Date(Date.now() + 5 * 60 * 1000), // 5 min
          maxAge: 5 * 60 * 1000,
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        })
        .json(cookieContent)
    // TODO: Create session token in JWT
  } catch (err: any) {
    console.log('>>> googleAuthenticationHandler error: ' + err)
    return res.json(err)
  }
}

export const signoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.statusMessage = 'Sign out success'
    res.clearCookie('logged_in_demo', { path: '/' }).status(200).end()
    console.log('>>> signoutHandler: clean cookie logged_in_demo')
    return
  } catch (err: any) {
    return next(err)
  }
}

export const googleAuthorizationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the authorization code from the body
    const code = req.body.code
    if (!code) return next(new Error('Auth code not provided'))

    // CSRF attacks prevention
    const header = req.get('X-Requested-With')
    if (!header || header !== 'XmlHttpRequest')
      return next(new Error('Permission denied'))

    // Init new oauth2client object
    const client = new OAuth2Client({
      redirectUri: process.env.GOOGLE_OAUTH_REDIRECT,
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    })

    // Obtain refresh and access tokens
    const { tokens } = await client.getToken(code)
    client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    })
    if (!tokens) return next(new Error('getToken error'))

    if (tokens.access_token) {
      accessToken = tokens.access_token
      console.log(accessToken)
    }

    // Request upcoming 10 events in Google calender: use Oauth2Client to call Google APIs
    const calender = calendar({ version: 'v3', auth: client })
    const listResponse = await calender.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime',
    })
    const events = listResponse.data.items

    // respond status
    return res.status(200).json(events)
    // TODO: store access and refresh tokens in the data base
  } catch (err: any) {
    console.log('>>> googleAuthorizationHandler error: ' + err)
    return res.json(err)
  }
}

let accessToken = ''

export const googleRevokeTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Grab the access token from the database (The token is store in run-time memory for demo.)
    if (!accessToken.length) return next(new Error('Cannot find accessToken'))

    // Make a request to googleapis revoke endpoint and includes the token as a parameter.
    // Remember to include an empty body if using "axios.post(url, data, option)" format.
    const params = new URLSearchParams({ token: accessToken })
    const axiosResponse = await axios({
      method: 'post',
      url: 'https://oauth2.googleapis.com/revoke',
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      params: params,
    })

    if (axiosResponse.data) {
      accessToken = ''
      res.statusMessage = 'success'
      res.status(200).end()
    }
    return
  } catch (err: any) {
    return next(err)
  }
}
