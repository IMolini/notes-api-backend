const indexRouter = require('express').Router()

indexRouter.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

module.exports = indexRouter
