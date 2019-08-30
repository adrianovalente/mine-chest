const express = require('express')
const bodyParser = require('body-parser')

const snapshot = require('./snapshot')
const {
  getStatus,
  setStatus,
  GameStatus
} = require('../business/status')
const { HTTP_PORT } = require('./config')
const { stopServer } = require('../game-controller')

module.exports.start = function start () {
  return Promise.resolve(express())
    .then(app => app.use(bodyParser.json()))
    .then(app => app.get('/status', (req, res) => res.json({
      status: getStatus()
    })))
    .then(app => app.post('/restart', (req, res) => {
      setTimeout(() => process.exit(0), 5000)
      return setStatus(GameStatus.RESTARTING)
        .then(() => res.status(200).json({ processed: true, mesage: 'Good bye! Will restart in 5 seconds. 💣'}))
    }))
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
    .then(app => app.get('/snapshot', (req, res) => {
      return Promise.resolve()
        .then(() => stopServer())
        .catch(console.error)
        .then(() => snapshot.upload())
        .then(() => res.json({ processed: true }))
        .catch(e => {
          console.error(e)
          res.status(500).json({ error: e.message })
        })
    }))
    .then(app => app.get('/stop', (req, res) => {
      return stopServer()
        .then(() => res.json({ processed: true }))
        .catch(e => {
          console.error(e)
          res.status(500).json({ error: e.message })
        })
    }))
    .then(app => new Promise(resolve => {
      app.listen(HTTP_PORT, () => resolve(app))
    }))
}
