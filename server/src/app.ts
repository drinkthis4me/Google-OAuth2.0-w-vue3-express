import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
require('dotenv').config()
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import oauthRouter from './routes/oauth.route'

const app = express()
const port = 3000

// Cors
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'],
  })
)

// Body parser
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Cookie parser
app.use(cookieParser())

// Routes
app.use('/api/oauth', oauthRouter)

// Testing
app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!!!')
})

// Unknow routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any
  err.status = 404
  next(err)
})

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('>>> Something went wrong. ' + err.message)
  err.status = err.status || 500
  err.message = err.message || 'Something went wrong'
  res.status(err.status).json({ status: err.status, message: err.message })
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
