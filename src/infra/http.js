const express = require('express')
const bodyParser = require('body-parser')

const {
  GameStatus,
  getStatus,
  setStatus,
  onChange
} = require('../business/status')
const { HTTP_PORT } = require('./config')

module.exports.start = function start () {
  return Promise.resolve(express())
    .then(app => app.use(bodyParser.json()))
    .then(app => app.get('/status', (req, res) => res.json({
      status: getStatus()
    })))
    .then(app => app.post('/status', (req, res) => {
      const status = req.body.status
      try {
        setStatus(status)
        res.json({ status: getStatus() })
      } catch (e) {
        console.error(e)
        res.status(400).json({ error: e.message })
      }
    }))
    .then(app => new Promise(res => {
      app.listen(HTTP_PORT, () => res(app))
    }))
}
