require('dotenv').config()
require('./mongo')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./loggerMiddleware')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const indexRouter = require('./controllers/index')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')

app.use(cors())
app.use(express.json())
app.use('/static', express.static('static/images'))
app.use(logger)

Sentry.init({
  dsn: 'https://91327037c8df4efba35217bcee8eb665@o981686.ingest.sentry.io/5936146',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

// Router Controllers
app.use('/', indexRouter)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

// Manejo de errores
app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

// Ajuste del puerto
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
