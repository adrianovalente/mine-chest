require('colors')

const childProcess = require('child_process')

const resourcesManager = require('./resources-manager')
const config = require('./config')

const GameStatus = {
  IDLE     : 'idle',
  SETUP    : 'setup',
  STARTING : 'starting',
  RUNNING  : 'running',
  STOPPING : 'stopping'
}

var _status = GameStatus.IDLE; // eslint-disable-line

module.exports = {
  startServer,
  getStatus: () => _status
}

function startServer() {
  setStatus(GameStatus.SETUP)

  Promise.resolve()
  // resourcesManager.setupResources()
    .then(() => {

      console.log('Starting server...')
      setStatus(GameStatus.STARTING)
      const game = childProcess.spawn(
        'java',
        ['-Xmx1024M', '-Xms1024M', '-jar', `${config.RESOURCES_PATH}/minecraft_server.1.12.jar`, 'nogui'],
        { cwd: config.RESOURCES_PATH, stdio: ['pipe', 'pipe', 'pipe']}
      )

      game.stdout.on('data', onData)
      game.stderr.on('data', onData)



    })

    .catch(console.error)

    function onData(a) {
      const data = String(a)

      if (/Done.* For help, type/i.test(data)) {
        setStatus(GameStatus.RUNNING)
      }
      console.log('data:', String(data))
    }

}

function setStatus(status) {
  if (!Object.keys(GameStatus).filter((key) => GameStatus[key] === status).length) {
    throw new Error('Invalid status!')
  }

  _status = status
  console.log('STATUS CHANGED: '.green, status)
}
